import {
  ChevronDown,
  Clock3,
  Download,
  ExternalLink,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { askPagbilaoAssistant } from "../../lib/chatApi";
import type { ChatApiAction, ChatApiMessage } from "../../lib/chatApi";
import { useLanguage } from "../../i18n/useLanguage";
import { Bilao, Papag } from "./ChatMascots";

type ChatMessage = {
  id: number;
  author: "assistant" | "resident";
  text: string;
  html?: string;
  actions?: ChatApiAction[];
  time: string;
};

type ChatFloatProps = {
  onResolveMessage?: (message: string, history: ChatMessage[]) => Promise<string> | string;
};

const getMessageTime = () =>
  new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

const ChatFloat = ({ onResolveMessage }: ChatFloatProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 1, author: "assistant", text: t.chat.starterMessage, time: getMessageTime() },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const nextMessageId = useRef(2);
  const messageListRef = useRef<HTMLDivElement>(null);
  const quickPrompts = t.chat.quickPrompts;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [isOpen, messages, isReplying]);

  const appendAssistantMessage = (partial: { text: string; html?: string; actions?: ChatApiAction[] }) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextMessageId.current++,
        author: "assistant",
        time: getMessageTime(),
        ...partial,
      },
    ]);
  };

  const sendMessage = async (message: string) => {
    const cleanMessage = message.trim();

    if (!cleanMessage || isReplying) {
      return;
    }

    const priorMessages = messages;
    const residentMessage: ChatMessage = {
      id: nextMessageId.current++,
      author: "resident",
      text: cleanMessage,
      time: getMessageTime(),
    };

    const nextMessages = [...priorMessages, residentMessage];
    setMessages(nextMessages);
    setDraft("");
    setIsReplying(true);

    try {
      if (onResolveMessage) {
        const replyText = await onResolveMessage(cleanMessage, nextMessages);
        appendAssistantMessage({ text: replyText });
      } else {
        const history: ChatApiMessage[] = priorMessages.map((historyMessage) => ({
          role: historyMessage.author === "resident" ? "user" : "assistant",
          content: historyMessage.text,
        }));

        const response = await askPagbilaoAssistant(cleanMessage, history);
        appendAssistantMessage({
          text: response.answer,
          html: response.answerHtml,
          actions: response.actions,
        });
      }
    } catch {
      appendAssistantMessage({ text: t.chat.fallbackReply });
    } finally {
      setIsReplying(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(draft);
  };

  const assistantMascotById = new Map<number, boolean>();
  let nextIsPapag = true;
  for (const message of messages) {
    if (message.author === "assistant") {
      assistantMascotById.set(message.id, nextIsPapag);
      nextIsPapag = !nextIsPapag;
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-60 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          className="flex h-[min(42rem,calc(100vh-6rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft ring-1 ring-slate-900/5 sm:h-[min(44rem,calc(100vh-7rem))] sm:w-104"
          aria-label="Better Pagbilao chat assistant"
        >
          <div className="flag-ribbon h-1.5 w-full" />

          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-bayan-mist px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex shrink-0 items-center -space-x-2.5">
                <Papag className="h-10 w-10 animate-mascot-bob rounded-full bg-blue-50 ring-2 ring-white" style={{ animationDelay: "0s" }} />
                <Bilao className="h-10 w-10 animate-mascot-bob rounded-full bg-amber-50 ring-2 ring-white" style={{ animationDelay: "0.3s" }} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-base font-black text-bayan-ink">{t.chat.title}</h2>
                <p className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-bayan-green" />
                  {t.chat.ready}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-white hover:text-bayan-ink"
              aria-label={t.chat.closeLabel}
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={messageListRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => {
              const isResident = message.author === "resident";
              const isPapag = assistantMascotById.get(message.id) ?? true;
              const MessageMascot = isPapag ? Papag : Bilao;

              return (
                <article
                  key={message.id}
                  className={`flex items-end gap-2 ${isResident ? "justify-end" : "justify-start"}`}
                >
                  {!isResident ? (
                    <MessageMascot className={`mb-5 h-8 w-8 shrink-0 rounded-full ${isPapag ? "bg-blue-50" : "bg-amber-50"}`} />
                  ) : null}

                  <div className={`max-w-[82%] ${isResident ? "items-end" : "items-start"}`}>
                    <div
                      className={[
                        "rounded-lg px-3.5 py-3 text-sm font-semibold leading-6",
                        isResident
                          ? "bg-bayan-blue text-white"
                          : "bpg-chat-bubble border border-slate-200 bg-slate-50 text-slate-700",
                      ].join(" ")}
                    >
                      {!isResident && message.html ? (
                        <div dangerouslySetInnerHTML={{ __html: message.html }} />
                      ) : (
                        message.text
                      )}
                    </div>

                    {message.actions?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {message.actions.map((action) => (
                          <a
                            key={action.url}
                            href={action.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-bayan-blue transition hover:border-bayan-blue"
                          >
                            {action.kind === "download" ? (
                              <Download className="h-3.5 w-3.5" />
                            ) : (
                              <ExternalLink className="h-3.5 w-3.5" />
                            )}
                            {action.label}
                          </a>
                        ))}
                      </div>
                    ) : null}

                    <p className={`mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-400 ${isResident ? "justify-end" : "justify-start"}`}>
                      <Clock3 className="h-3 w-3" />
                      {message.time}
                    </p>
                  </div>
                </article>
              );
            })}

            {isReplying ? (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                {nextIsPapag ? (
                  <Papag className="h-8 w-8 shrink-0 animate-mascot-bob rounded-full bg-blue-50" />
                ) : (
                  <Bilao className="h-8 w-8 shrink-0 animate-mascot-bob rounded-full bg-amber-50" />
                )}
                {t.chat.checkingReply}
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 transition hover:border-bayan-blue hover:text-bayan-blue"
                  onClick={() => void sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <label htmlFor="chat-message" className="sr-only">
                {t.chat.messageLabel}
              </label>
              <input
                id="chat-message"
                value={draft}
                type="text"
                placeholder={t.chat.inputPlaceholder}
                className="min-h-11 min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-bayan-ink outline-none transition placeholder:text-slate-400 focus:border-bayan-blue focus:bg-white focus:ring-[3px] focus:ring-blue-100"
                onChange={(event) => setDraft(event.target.value)}
              />
              <button
                type="submit"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-bayan-red text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label={t.chat.sendLabel}
                disabled={!draft.trim() || isReplying}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className="group relative inline-flex min-h-14 items-center gap-3 rounded-full bg-bayan-blue px-4 pr-5 text-sm font-black text-white shadow-soft ring-1 ring-blue-300/40 transition hover:-translate-y-0.5 hover:bg-blue-700"
        aria-label={isOpen ? t.chat.minimizeLabel : t.chat.openLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <Bilao className="h-9 w-9 animate-mascot-bob" />}
        </span>
        <span className="hidden sm:inline">{isOpen ? t.chat.minimizeLabel : t.chat.openLabel}</span>
      </button>
    </div>
  );
};

export default ChatFloat;
