import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, author, context, isFavorite } = await request.json()
    const resolvedParams = await params
    const quoteId = resolvedParams.id

    // Check if quote exists and user has permission to edit
    const existingQuote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { submittedBy: true }
    })

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    // Only allow the submitter or admin to edit
    if (existingQuote.submittedBy !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        ...(text !== undefined && { text }),
        ...(author !== undefined && { author }),
        ...(context !== undefined && { context }),
        ...(isFavorite !== undefined && { isFavorite }),
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        authorUser: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Error updating quote:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const quoteId = resolvedParams.id

    // Check if quote exists and user has permission to delete
    const existingQuote = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { submittedBy: true }
    })

    if (!existingQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 })
    }

    // Only allow the submitter or admin to delete
    if (existingQuote.submittedBy !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.quote.delete({
      where: { id: quoteId }
    })

    return NextResponse.json({ message: "Quote deleted successfully" })
  } catch (error) {
    console.error("Error deleting quote:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}