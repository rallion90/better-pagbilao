const CHAT_API_BASE = "https://api-v2.betterpagbilao.org"
const CHAT_ENDPOINT = `${CHAT_API_BASE}/api/chat`
const SESSION_STORAGE_KEY = "bpg_chat_session_id"
const REQUEST_TIMEOUT_MS = 20000

export type ChatApiRole = "user" | "assistant"

export type ChatApiMessage = {
  role: ChatApiRole
  content: string
}

export type ChatApiAction = {
  label: string
  url: string
  kind: "link" | "download"
}

export type ChatApiReference = {
  source: string
  title: string
  id?: string
  verificationStatus?: string | null
}

export type ChatApiResponse = {
  ok: boolean
  answer: string
  answerHtml: string
  sessionId: string
  intent?: string
  references: ChatApiReference[]
  actions: ChatApiAction[]
  sources: string[]
  matchCount?: number
  error?: string
}

function getOrCreateSessionId(): string {
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) return existing
  } catch {
    // localStorage can be unavailable (private browsing); fall through to a throwaway id.
  }

  const fresh = crypto.randomUUID()

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh)
  } catch {
    // ignore
  }

  return fresh
}

function rememberSessionId(sessionId: string | undefined) {
  if (!sessionId) return

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
  } catch {
    // ignore
  }
}

export async function askPagbilaoAssistant(
  question: string,
  history: ChatApiMessage[],
): Promise<ChatApiResponse> {
  const sessionId = getOrCreateSessionId()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, sessionId, messages: history }),
      signal: controller.signal,
    })

    const data = (await response.json()) as ChatApiResponse

    if (!response.ok || !data.ok) {
      throw new Error(data.error || `Assistant request failed with status ${response.status}`)
    }

    rememberSessionId(data.sessionId)
    return data
  } finally {
    clearTimeout(timeout)
  }
}
