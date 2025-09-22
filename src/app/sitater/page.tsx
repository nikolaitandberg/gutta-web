"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Quote {
  id: string;
  text: string;
  author: string;
  context?: string;
  isFavorite: boolean;
  createdAt: string;
  submitter: {
    id: string;
    name: string;
    email: string;
  };
  authorUser?: {
    id: string;
    name: string;
  };
}

export default function QuotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [newQuote, setNewQuote] = useState({
    text: "",
    author: "",
    context: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchQuotes();
    }
  }, [session]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      } else {
        setError("Failed to fetch quotes");
      }
    } catch {
      setError("Error loading quotes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuote.text.trim() || !newQuote.author.trim()) {
      setError("Quote text and author are required");
      return;
    }

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      });

      if (response.ok) {
        const quote = await response.json();
        setQuotes([quote, ...quotes]);
        setNewQuote({ text: "", author: "", context: "" });
        setShowAddForm(false);
        setError("");
      } else {
        setError("Failed to add quote");
      }
    } catch {
      setError("Error adding quote");
    }
  };

  const toggleFavorite = async (quoteId: string, currentFavorite: boolean) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isFavorite: !currentFavorite }),
      });

      if (response.ok) {
        setQuotes(
          quotes.map((quote) =>
            quote.id === quoteId
              ? { ...quote, isFavorite: !currentFavorite }
              : quote,
          ),
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const deleteQuote = async (quoteId: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQuotes(quotes.filter((quote) => quote.id !== quoteId));
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sitater</h1>
                <p className="text-gray-600">Gutta kødder ass</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showAddForm ? "Avbryt" : "Legg til sitat"}
              </button>
            </div>
          </div>

          {/* Add Quote Form */}
          {showAddForm && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="quote-text"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sitat
                  </label>
                  <textarea
                    id="quote-text"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Hva sa de?"
                    value={newQuote.text}
                    onChange={(e) =>
                      setNewQuote({ ...newQuote, text: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Hvem sa det?
                    </label>
                    <input
                      type="text"
                      id="author"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Navn"
                      value={newQuote.author}
                      onChange={(e) =>
                        setNewQuote({ ...newQuote, author: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="context"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Kontekst (valgfritt)
                    </label>
                    <input
                      type="text"
                      id="context"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Når/hvor/i hvilken situasjon sa de det?"
                      value={newQuote.context}
                      onChange={(e) =>
                        setNewQuote({ ...newQuote, context: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Legg til sitat
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 border border-red-300 rounded-md bg-red-50">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Quotes List */}
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.206-.259l-4.894 1.632c-.34.113-.716-.067-.829-.407a.849.849 0 01-.127-.424V16.51a8 8 0 1114.056-4.51z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No quotes yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start capturing the funny things your flatmates say!
              </p>
            </div>
          ) : (
            quotes.map((quote) => (
              <div key={quote.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <blockquote className="text-lg italic text-gray-900 mb-3">
                      &ldquo;{quote.text}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          — {quote.author}
                        </p>
                        {quote.context && (
                          <p className="text-sm text-gray-500">
                            {quote.context}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Lagt til av {quote.submitter.name} den{" "}
                          {new Date(quote.createdAt).toLocaleDateString(
                            "no-NO",
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            toggleFavorite(quote.id, quote.isFavorite)
                          }
                          className={`p-2 rounded-full ${
                            quote.isFavorite
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-gray-400 hover:text-yellow-500"
                          }`}
                        >
                          <svg
                            className="h-5 w-5"
                            fill={quote.isFavorite ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </button>
                        {(quote.submitter.id === session.user.id ||
                          session.user.role === "ADMIN") && (
                          <button
                            onClick={() => deleteQuote(quote.id)}
                            className="p-2 rounded-full text-gray-400 hover:text-red-500"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
