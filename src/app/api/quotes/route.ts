import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotes = await prisma.quote.findMany({
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        authorUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, author, context, authorId } = await request.json();

    if (!text || !author) {
      return NextResponse.json(
        { error: "Quote text and author are required" },
        { status: 400 },
      );
    }

    const quote = await prisma.quote.create({
      data: {
        text,
        author,
        context,
        authorId: authorId || null,
        submittedBy: session.user.id,
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        authorUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
