import { useState } from "react"
import "./App.css"
import trpc from "./trpc"

function App() {
  const [longUrl, setLongUrl] = useState("")
  const [shortCode, setShortCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [fetchedUrl, setFetchedUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  /* CREATE SHORT URL */
  const createUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!longUrl.startsWith("http")) {
      setError("Enter a valid URL (must start with http/https)")
      return
    }

    try {
      setLoading(true)
      const res = await trpc.createShortUrl.mutate({
        originalUrl: longUrl,
      })
      setGeneratedCode(res.shortCode)
    } catch {
      setError("Failed to create short link")
    } finally {
      setLoading(false)
    }
  }

  /* FETCH ORIGINAL URL */
  const fetchUrl = async () => {
    setError("")
    setFetchedUrl("")

    try {
      setLoading(true)
      const res = await trpc.getShortUrl.query({
        shortCode: shortCode,
      })

      if (!res) {
        setError("Short link not found")
        return
      }

      setFetchedUrl(res.originalUrl)
    } catch {
      setError("Invalid or expired short link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg space-y-8">

        <h1 className="text-3xl font-bold text-center">🔗 URL Shortener</h1>

        {/* CREATE */}
        <form onSubmit={createUrl} className="space-y-3">
          <p className="font-semibold">Create short link</p>
          <input
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste a long URL..."
            className="w-full p-3 border rounded"
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Shorten"}
          </button>

          {generatedCode && (
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-500">Short URL</p>
              <a
                target="_blank"
                href={`http://localhost:3000/${generatedCode}`}
                className="text-blue-600 underline"
              >
                {generatedCode}
              </a>
            </div>
          )}
        </form>

        <hr />

        {/* FETCH */}
        <div className="space-y-3">
          <p className="font-semibold">Open short link</p>

          <input
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            placeholder="Enter short code (e.g. lcnrul)"
            className="w-full p-3 border rounded"
          />

          <button
            onClick={fetchUrl}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Fetching..." : "Get Original URL"}
          </button>

          {fetchedUrl && (
            <div className="bg-green-50 p-3 rounded border">
              <p className="text-sm text-gray-600">Original URL</p>
              <a
                href={fetchedUrl}
                target="_blank"
                className="text-green-700 underline break-all"
              >
                {fetchedUrl}
              </a>
            </div>
          )}
        </div>

        {error && (
          <p className="text-center text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  )
}

export default App
