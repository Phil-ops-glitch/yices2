"use client";

import { useState, useRef, useEffect } from "react";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }: { d: string; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const I: Record<string, string> = {
  menu:    "M3 12h18M3 6h18M3 18h18",
  x:       "M18 6L6 18M6 6l12 12",
  dash:    "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  doc:     "M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z",
  buyers:  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  deals:   "M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3",
  msg:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  crm:     "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  rev:     "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  risk:    "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  brain:   "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  cog:     "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  bell:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  send:    "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  arrow:   "M5 12h14M12 5l7 7-7 7",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
  plus:    "M12 5v14M5 12h14",
  trash:   "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  lock:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  trend:   "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  check:   "M20 6L9 17l-5-5",
  ceo:     "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v4l3 3",
  kanban:  "M8 6h.01M8 10h.01M8 14h.01M12 6h.01M12 10h.01M16 6h.01M3 3h18v18H3z",
};

// ── STORAGE (localStorage wrapper matching window.storage interface) ──────────
const DB = {
  get: async (key: string) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  set: async (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch { return false; }
  },
  del: async (key: string) => {
    try { localStorage.removeItem(key); return true; }
    catch { return false; }
  },
};

// ── AI HOOK (calls Next.js API proxy — keeps key server-side) ─────────────────
function useAI() {
  const [loading, setLoading] = useState(false);
  const call = async (system: string, user: string): Promise<string> => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      const d = await res.json();
      if (!res.ok) return d.error || "AI error.";
      return d.content?.map((b: { text?: string }) => b.text || "").join("") || "No response.";
    } catch { return "AI temporarily unavailable."; }
    finally { setLoading(false); }
  };
  return { call, loading };
}

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Agent { id: string; name: string; color: string; icon: string; desc: string; }
interface Opportunity { id: number; title: string; type: string; value: number; commission: number; effort: string; risk: string; confidence: number; status: string; notes: string; created: string; }
interface Buyer { id: number; name: string; country: string; industry: string; budget: string; status: string; contact: string; notes: string; lastContact: string; }
interface Supplier { id: number; name: string; country: string; product: string; capacity: string; certified: boolean; contact: string; notes: string; }
interface Alert { id: number; message: string; severity: string; time: string; }
interface Plan { id: number; title: string; reasoning: string; actions: string[]; agents: string[]; estRevenue: number; status: string; priority: number; }
interface Settings { ownerName: string; market: string; target: string; risk: string; sources: string; signoff: string; }
interface Message { id: number; from: string; text: string; time: string; }

// ── AGENT DEFINITIONS ─────────────────────────────────────────────────────────
const AGENTS: Agent[] = [
  { id:"ceo",         name:"CEO AI",              color:"#f59e0b", icon:I.ceo,   desc:"Strategic command. Prioritizes deals and creates execution plans. All actions need your approval." },
  { id:"opportunity", name:"Opportunity Hunter",  color:"#8b5cf6", icon:I.star,  desc:"Scans sources and ranks opportunities by value, effort, risk, and confidence." },
  { id:"tender",      name:"Tender Hunter",       color:"#3b82f6", icon:I.doc,   desc:"Tracks procurement portals. Delivers deadline alerts and requirement summaries." },
  { id:"buyer",       name:"Buyer Finder",        color:"#06b6d4", icon:I.buyers,desc:"Builds and maintains your buyer database. Text messages only — no calls, no video." },
  { id:"supplier",    name:"Supplier Finder",     color:"#10b981", icon:I.home,  desc:"Maintains supplier network with capacity and certifications. Written messages only." },
  { id:"deal",        name:"Deal Matching",       color:"#ec4899", icon:I.deals, desc:"Suggests optimal buyer-supplier pairings with compatibility scores." },
  { id:"outreach",    name:"Outreach AI",         color:"#f97316", icon:I.msg,   desc:"Drafts written messages. Never sends without your explicit approval. Text only." },
  { id:"crm",         name:"CRM AI",              color:"#6366f1", icon:I.crm,   desc:"Tracks all conversations, relationships, and follow-up schedules." },
  { id:"market",      name:"Market Intelligence", color:"#14b8a6", icon:I.brain, desc:"Monitors commodity prices and trade signals. Written market briefings only." },
  { id:"risk",        name:"Risk AI",             color:"#ef4444", icon:I.risk,  desc:"Flags geopolitical, financial, and counterparty risks with mitigation guidance." },
  { id:"revenue",     name:"Revenue AI",          color:"#a855f7", icon:I.rev,   desc:"Forecasts commission income and pipeline value. Written revenue reports." },
];

// ── SMALL UI COMPONENTS ────────────────────────────────────────────────────────
const Badge = ({ label, color = "#6b7280" }: { label: string; color?: string }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    className="text-xs px-2 py-0.5 rounded-full font-medium">{label}</span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const m: Record<string, string> = { New:"#3b82f6", Evaluating:"#f59e0b", Active:"#10b981", Closing:"#a855f7", Hot:"#ef4444", Warm:"#f97316", Cold:"#6b7280", Approved:"#10b981" };
  return <Badge label={status} color={m[status] || "#6b7280"} />;
};

const MetricCard = ({ label, value, sub, accent = "#f59e0b", icon }: { label: string; value: string | number; sub?: string; accent?: string; icon?: string }) => (
  <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "#0f1117", border: "1px solid #1e2433" }}>
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
      {icon && <span style={{ color: accent }}><Icon d={icon} size={14} /></span>}
    </div>
    <div className="text-2xl font-bold" style={{ color: accent }}>{value}</div>
    {sub && <div className="text-xs text-slate-500">{sub}</div>}
  </div>
);

const EmptyState = ({ icon, title, sub, action, onAction }: { icon: string; title: string; sub: string; action?: string; onAction?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#0f1117", border: "1px solid #1e2433" }}>
      <Icon d={icon} size={28} className="text-slate-700" />
    </div>
    <div>
      <div className="text-sm font-semibold text-slate-400">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{sub}</div>
    </div>
    {action && (
      <button onClick={onAction} className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg"
        style={{ background: "#f59e0b18", color: "#f59e0b", border: "1px solid #f59e0b33" }}>
        <Icon d={I.plus} size={12} />{action}
      </button>
    )}
  </div>
);

const Modal = ({ title, onClose, children, accent = "#f59e0b" }: { title: string; onClose: () => void; children: React.ReactNode; accent?: string }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "#000000dd" }}>
    <div className="w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh]"
      style={{ background: "#0a0d16", border: `1px solid ${accent}44` }}>
      <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "#1e2433" }}>
        <span className="text-sm font-semibold text-white">{title}</span>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <Icon d={I.x} size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5">{children}</div>
    </div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs text-slate-500 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const inputStyle = { background: "#0f1117", border: "1px solid #1e2433" };

const Input = ({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    className="text-sm text-white px-3 py-2.5 rounded-lg outline-none placeholder-slate-600"
    style={inputStyle} />
);

const Select = ({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    className="text-sm text-white px-3 py-2.5 rounded-lg outline-none"
    style={inputStyle}>
    {children}
  </select>
);

const Btn = ({ onClick, children, color = "#f59e0b", disabled, full, sm }: { onClick?: () => void; children: React.ReactNode; color?: string; disabled?: boolean; full?: boolean; sm?: boolean }) => (
  <button onClick={onClick} disabled={disabled}
    className={`${full ? "w-full" : ""} ${sm ? "text-xs py-1.5 px-3" : "text-sm py-2.5 px-4"} rounded-lg font-semibold transition-all disabled:opacity-40`}
    style={{ background: color + "22", color, border: `1px solid ${color}33` }}>
    {children}
  </button>
);

// ── MESSAGE THREAD ────────────────────────────────────────────────────────────
function MessageThread({ contact, onClose, onSent }: { contact: Buyer & { industry?: string }; onClose: () => void; onSent?: () => void }) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [view, setView] = useState("thread");
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [manual, setManual] = useState("");
  const [loading, setLoading] = useState(false);
  const { call, loading: aiLoad } = useAI();
  const bottomRef = useRef<HTMLDivElement>(null);
  const storageKey = `thread:${contact.id}`;

  useEffect(() => { DB.get(storageKey).then(d => setMsgs(d || [])); }, [storageKey]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, view]);

  const save = async (updated: Message[]) => { setMsgs(updated); await DB.set(storageKey, updated); };

  const genDraft = async () => {
    setLoading(true);
    const last = msgs[msgs.length - 1];
    const ctx = last
      ? `Prior message (${last.from === "ai" ? "we sent" : contact.name + " replied"}): "${last.text}"`
      : "No prior messages — this is the first outreach.";
    const system = `You are Outreach AI inside a text-based trade brokerage. CRITICAL: all external contact is via written text ONLY — no calls, no video, no meetings ever suggested. Draft a concise professional business message under 130 words. Be value-driven and specific. Never guarantee outcomes. Sign off as "Trade Operations" only.`;
    const msg = `Contact: ${contact.name} (${contact.industry || ""}, ${contact.country}). ${ctx}. Draft the next written message to advance this trade relationship.`;
    const r = await call(system, msg);
    setDraft(r); setReady(true); setView("draft"); setLoading(false);
  };

  const approve = async () => {
    if (!draft.trim()) return;
    const m: Message = { id: Date.now(), from: "ai", text: draft, time: new Date().toISOString().slice(0, 16).replace("T", " ") };
    await save([...msgs, m]);
    setDraft(""); setReady(false); setView("thread");
    onSent?.();
  };

  const sendOwn = async () => {
    if (!manual.trim()) return;
    const m: Message = { id: Date.now(), from: "ai", text: manual, time: new Date().toISOString().slice(0, 16).replace("T", " ") };
    await save([...msgs, m]);
    setManual(""); onSent?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "#000000dd" }}>
      <div className="w-full max-w-lg rounded-2xl flex flex-col" style={{ background: "#0a0d16", border: "1px solid #f9731644", maxHeight: "88vh" }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{ borderColor: "#1e2433" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: "#1e2433", color: "#94a3b8" }}>{contact.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{contact.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{contact.industry} · {contact.country}</span>
              <span className="text-xs px-1.5 rounded font-semibold" style={{ background: "#ef444422", color: "#ef4444", fontSize: 9 }}>TEXT ONLY</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setView(view === "draft" ? "thread" : "draft")}
              className="text-xs px-2.5 py-1.5 rounded-lg"
              style={{ background: "#f9731618", color: "#f97316", border: "1px solid #f9731633" }}>
              {view === "draft" ? "← Thread" : "✦ Draft"}
            </button>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><Icon d={I.x} size={18} /></button>
          </div>
        </div>
        <div className="px-4 py-2 flex items-center gap-2 flex-shrink-0" style={{ background: "#0c0f18", borderBottom: "1px solid #1e2433" }}>
          <Icon d={I.lock} size={11} className="text-red-400" />
          <span className="text-xs" style={{ color: "#475569" }}>Written messages only · No calls · No video · Your approval required</span>
        </div>

        {view === "thread" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
              {msgs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
                  <Icon d={I.msg} size={36} className="text-slate-700" />
                  <div className="text-sm text-slate-600">No messages with {contact.name} yet.</div>
                  <Btn onClick={genDraft} disabled={loading || aiLoad} sm>✦ Generate First Message</Btn>
                </div>
              ) : msgs.map(m => (
                <div key={m.id} className={`flex flex-col gap-1 ${m.from === "ai" ? "items-end" : "items-start"}`}>
                  <div className="text-xs text-slate-600 px-1">{m.from === "ai" ? "Outreach AI → sent" : contact.name}</div>
                  <div className="max-w-sm text-xs leading-relaxed px-3 py-2.5 rounded-xl"
                    style={m.from === "ai"
                      ? { background: "#f9731618", color: "#e2e8f0", border: "1px solid #f9731633" }
                      : { background: "#12161f", color: "#94a3b8", border: "1px solid #1e2433" }}>
                    {m.text}
                  </div>
                  <div className="text-xs text-slate-700 px-1">{m.time}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t flex gap-2 flex-shrink-0" style={{ borderColor: "#1e2433" }}>
              <input value={manual} onChange={e => setManual(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendOwn()}
                placeholder="Type your own message…"
                className="flex-1 text-xs text-white outline-none placeholder-slate-600 px-3 py-2 rounded-lg"
                style={inputStyle} />
              <button onClick={genDraft} disabled={loading || aiLoad}
                className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0"
                style={{ background: "#f59e0b18", color: "#f59e0b", border: "1px solid #f59e0b33" }}>
                {loading || aiLoad ? "…" : "✦ AI"}
              </button>
              <button onClick={sendOwn}
                className="px-3 py-2 rounded-lg flex-shrink-0"
                style={{ background: "#10b98118", color: "#10b981", border: "1px solid #10b98133" }}>
                <Icon d={I.send} size={13} />
              </button>
            </div>
          </>
        )}

        {view === "draft" && (
          <div className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto" style={{ minHeight: 0 }}>
            <div className="text-xs font-semibold text-white">Outreach AI — Message Draft</div>
            <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: "#f59e0b11", border: "1px solid #f59e0b22", color: "#f59e0b" }}>
              ⚠ Review carefully. Sent to <strong>{contact.name}</strong> only after your explicit approval.
            </div>
            {!ready ? (
              <Btn onClick={genDraft} disabled={loading || aiLoad} full color="#f97316">
                {loading || aiLoad ? "Drafting…" : "✦ Generate Message Draft"}
              </Btn>
            ) : (
              <>
                <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={9}
                  className="text-xs text-slate-300 leading-relaxed p-3 rounded-lg outline-none resize-none"
                  style={inputStyle} />
                <div className="flex gap-2">
                  <Btn onClick={genDraft} disabled={loading || aiLoad} color="#6b7280">↺ Regenerate</Btn>
                  <Btn onClick={approve} color="#10b981">✓ Approve & Send</Btn>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── AGENT CHAT ────────────────────────────────────────────────────────────────
function AgentChat({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", text: `I'm ${agent.name}. ${agent.desc} How can I help?` }]);
  const [input, setInput] = useState("");
  const { call, loading } = useAI();
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    const txt = input.trim(); setInput("");
    setMsgs(p => [...p, { role: "user", text: txt }]);
    const system = `You are ${agent.name} in a text-based trade brokerage boardroom. ${agent.desc} CRITICAL: all contact with buyers and suppliers is via written text ONLY. Never suggest calls, video, or meetings. Be concise (2–4 sentences) unless more detail is explicitly requested.`;
    const r = await call(system, txt);
    setMsgs(p => [...p, { role: "assistant", text: r }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "#000000dd" }}>
      <div className="w-full max-w-lg rounded-2xl flex flex-col" style={{ background: "#0a0d16", border: `1px solid ${agent.color}44`, maxHeight: "80vh" }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "#1e2433" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: agent.color + "22" }}>
              <span style={{ color: agent.color }}><Icon d={agent.icon} size={15} /></span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{agent.name}</div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: agent.color }} />
                <span className="text-xs" style={{ color: agent.color }}>Online · Text-only</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><Icon d={I.x} size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ minHeight: 0 }}>
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-xs text-xs leading-relaxed px-3 py-2 rounded-xl"
                style={m.role === "user"
                  ? { background: agent.color + "33", color: "#e2e8f0", border: `1px solid ${agent.color}44` }
                  : { background: "#12161f", color: "#94a3b8", border: "1px solid #1e2433" }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="text-xs px-3 py-2 rounded-xl" style={{ background: "#12161f", color: "#475569", border: "1px solid #1e2433" }}>Thinking…</div></div>}
          <div ref={bottom} />
        </div>
        <div className="p-4 border-t flex gap-2" style={{ borderColor: "#1e2433" }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Brief this agent…"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-slate-600 px-3 py-2 rounded-lg"
            style={inputStyle} />
          <button onClick={send} disabled={loading} className="px-3 py-2 rounded-lg"
            style={{ background: agent.color + "22", color: agent.color, border: `1px solid ${agent.color}33` }}>
            <Icon d={I.send} size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FORMS ─────────────────────────────────────────────────────────────────────
function BuyerForm({ initial, onSave, onClose }: { initial?: Buyer; onSave: (f: Omit<Buyer, "id" | "lastContact">) => void; onClose: () => void }) {
  const empty = { name:"", country:"", industry:"", budget:"", status:"Cold", contact:"", notes:"" };
  const [f, setF] = useState(initial ? { name: initial.name, country: initial.country, industry: initial.industry, budget: initial.budget, status: initial.status, contact: initial.contact, notes: initial.notes } : empty);
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const valid = f.name.trim() && f.contact.trim();
  return (
    <Modal title={initial ? "Edit Buyer" : "Add Buyer"} onClose={onClose} accent="#06b6d4">
      <div className="flex flex-col gap-4">
        <Field label="Company Name *"><Input value={f.name} onChange={set("name")} placeholder="Meridian Group Ltd" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Country"><Input value={f.country} onChange={set("country")} placeholder="UAE" /></Field>
          <Field label="Industry"><Input value={f.industry} onChange={set("industry")} placeholder="Construction" /></Field>
        </div>
        <Field label="Contact Email *"><Input value={f.contact} onChange={set("contact")} placeholder="ahmed@company.com" type="email" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Budget Range"><Input value={f.budget} onChange={set("budget")} placeholder="$1M–5M" /></Field>
          <Field label="Status">
            <Select value={f.status} onChange={set("status")}>
              <option value="Hot">Hot</option><option value="Warm">Warm</option><option value="Cold">Cold</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes">
          <textarea value={f.notes} onChange={e => set("notes")(e.target.value)} rows={3} placeholder="Any additional notes…"
            className="text-sm text-white px-3 py-2.5 rounded-lg outline-none resize-none placeholder-slate-600" style={inputStyle} />
        </Field>
        <div className="flex gap-3 mt-2">
          <Btn onClick={onClose} color="#6b7280" full>Cancel</Btn>
          <Btn onClick={() => valid && onSave(f)} color="#06b6d4" full disabled={!valid}>{initial ? "Save Changes" : "Add Buyer"}</Btn>
        </div>
      </div>
    </Modal>
  );
}

function SupplierForm({ initial, onSave, onClose }: { initial?: Supplier; onSave: (f: Omit<Supplier, "id">) => void; onClose: () => void }) {
  const empty = { name:"", country:"", product:"", capacity:"", certified:false, contact:"", notes:"" };
  const [f, setF] = useState(initial || empty);
  const set = (k: string) => (v: string | boolean) => setF(p => ({ ...p, [k]: v }));
  const valid = f.name.trim() && f.contact.trim();
  return (
    <Modal title={initial ? "Edit Supplier" : "Add Supplier"} onClose={onClose} accent="#10b981">
      <div className="flex flex-col gap-4">
        <Field label="Company Name *"><Input value={f.name} onChange={set("name") as (v: string) => void} placeholder="Hangzhou Steel Works" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Country"><Input value={f.country} onChange={set("country") as (v: string) => void} placeholder="China" /></Field>
          <Field label="Product / Service"><Input value={f.product} onChange={set("product") as (v: string) => void} placeholder="Steel & Metals" /></Field>
        </div>
        <Field label="Contact Email *"><Input value={f.contact} onChange={set("contact") as (v: string) => void} placeholder="supplier@company.com" type="email" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacity"><Input value={f.capacity} onChange={set("capacity") as (v: string) => void} placeholder="50,000 MT/mo" /></Field>
          <Field label="Certified">
            <Select value={f.certified ? "yes" : "no"} onChange={v => set("certified")(v === "yes")}>
              <option value="yes">Certified</option><option value="no">Unverified</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes">
          <textarea value={f.notes} onChange={e => set("notes")(e.target.value)} rows={3} placeholder="Certifications, lead times, minimum order…"
            className="text-sm text-white px-3 py-2.5 rounded-lg outline-none resize-none placeholder-slate-600" style={inputStyle} />
        </Field>
        <div className="flex gap-3 mt-2">
          <Btn onClick={onClose} color="#6b7280" full>Cancel</Btn>
          <Btn onClick={() => valid && onSave(f)} color="#10b981" full disabled={!valid}>{initial ? "Save Changes" : "Add Supplier"}</Btn>
        </div>
      </div>
    </Modal>
  );
}

function OpportunityForm({ initial, onSave, onClose }: { initial?: Opportunity; onSave: (f: Omit<Opportunity, "id" | "created">) => void; onClose: () => void }) {
  const empty = { title:"", type:"Brokerage", value:"", commission:"", effort:"Medium", risk:"Medium", confidence:"70", status:"New", notes:"" };
  const [f, setF] = useState(initial ? { ...initial, value: String(initial.value), commission: String(initial.commission), confidence: String(initial.confidence) } : empty);
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const valid = (f as Record<string, string>).title.trim();
  return (
    <Modal title={initial ? "Edit Opportunity" : "Add Opportunity"} onClose={onClose} accent="#8b5cf6">
      <div className="flex flex-col gap-4">
        <Field label="Title *"><Input value={(f as Record<string, string>).title} onChange={set("title")} placeholder="Steel Supply Contract – GCC Infrastructure" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <Select value={(f as Record<string, string>).type} onChange={set("type")}>
              {["Brokerage","Procurement","Sourcing","Tender","Referral"].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={(f as Record<string, string>).status} onChange={set("status")}>
              {["New","Evaluating","Active","Closing"].map(s => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Deal Value (USD)"><Input value={(f as Record<string, string>).value} onChange={set("value")} placeholder="2400000" type="number" /></Field>
          <Field label="Your Commission (USD)"><Input value={(f as Record<string, string>).commission} onChange={set("commission")} placeholder="72000" type="number" /></Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Effort"><Select value={(f as Record<string, string>).effort} onChange={set("effort")}>{["Low","Medium","High"].map(v => <option key={v}>{v}</option>)}</Select></Field>
          <Field label="Risk"><Select value={(f as Record<string, string>).risk} onChange={set("risk")}>{["Low","Medium","High"].map(v => <option key={v}>{v}</option>)}</Select></Field>
          <Field label="Confidence %"><Input value={(f as Record<string, string>).confidence} onChange={set("confidence")} placeholder="85" type="number" /></Field>
        </div>
        <Field label="Notes">
          <textarea value={(f as Record<string, string>).notes} onChange={e => set("notes")(e.target.value)} rows={3} placeholder="Source, requirements, key contacts…"
            className="text-sm text-white px-3 py-2.5 rounded-lg outline-none resize-none placeholder-slate-600" style={inputStyle} />
        </Field>
        <div className="flex gap-3 mt-2">
          <Btn onClick={onClose} color="#6b7280" full>Cancel</Btn>
          <Btn onClick={() => {
            if (!valid) return;
            const ff = f as Record<string, string>;
            onSave({ title: ff.title, type: ff.type, value: Number(ff.value)||0, commission: Number(ff.commission)||0, effort: ff.effort, risk: ff.risk, confidence: Number(ff.confidence)||0, status: ff.status, notes: ff.notes });
          }} color="#8b5cf6" full disabled={!valid}>{initial ? "Save Changes" : "Add Opportunity"}</Btn>
        </div>
      </div>
    </Modal>
  );
}

function AlertForm({ onSave, onClose }: { onSave: (f: { message: string; severity: string }) => void; onClose: () => void }) {
  const [f, setF] = useState({ message: "", severity: "medium" });
  return (
    <Modal title="Add Risk Alert" onClose={onClose} accent="#ef4444">
      <div className="flex flex-col gap-4">
        <Field label="Alert Message *">
          <textarea value={f.message} onChange={e => setF(p => ({ ...p, message: e.target.value }))} rows={3}
            placeholder="Describe the risk or deadline…"
            className="text-sm text-white px-3 py-2.5 rounded-lg outline-none resize-none placeholder-slate-600" style={inputStyle} />
        </Field>
        <Field label="Severity">
          <Select value={f.severity} onChange={v => setF(p => ({ ...p, severity: v }))}>
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </Select>
        </Field>
        <div className="flex gap-3 mt-2">
          <Btn onClick={onClose} color="#6b7280" full>Cancel</Btn>
          <Btn onClick={() => f.message.trim() && onSave(f)} color="#ef4444" full disabled={!f.message.trim()}>Add Alert</Btn>
        </div>
      </div>
    </Modal>
  );
}

function PlanForm({ onSave, onClose }: { onSave: (f: Omit<Plan, "id">) => void; onClose: () => void }) {
  const [f, setF] = useState({ title:"", reasoning:"", actions:"", agents:"", estRevenue:"" });
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const valid = f.title.trim() && f.reasoning.trim();
  return (
    <Modal title="New CEO Plan" onClose={onClose} accent="#f59e0b">
      <div className="flex flex-col gap-4">
        <Field label="Plan Title *"><Input value={f.title} onChange={set("title")} placeholder="Close Coffee Beans Deal – UK Roasters" /></Field>
        <Field label="CEO Reasoning *">
          <textarea value={f.reasoning} onChange={e => set("reasoning")(e.target.value)} rows={3} placeholder="Why is this the top priority right now?"
            className="text-sm text-white px-3 py-2.5 rounded-lg outline-none resize-none placeholder-slate-600" style={inputStyle} />
        </Field>
        <Field label="Action Steps (one per line)">
          <textarea value={f.actions} onChange={e => set("actions")(e.target.value)} rows={4}
            placeholder={"Send pricing message\nConfirm supplier stock\nRequest LOI"}
            className="text-sm text-white px-3 py-2.5 rounded-lg outline-none resize-none placeholder-slate-600" style={inputStyle} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Assigned Agents (comma separated)"><Input value={f.agents} onChange={set("agents")} placeholder="Outreach AI, CRM AI" /></Field>
          <Field label="Est. Commission (USD)"><Input value={f.estRevenue} onChange={set("estRevenue")} placeholder="21000" type="number" /></Field>
        </div>
        <div className="flex gap-3 mt-2">
          <Btn onClick={onClose} color="#6b7280" full>Cancel</Btn>
          <Btn onClick={() => valid && onSave({
            title: f.title, reasoning: f.reasoning,
            actions: f.actions.split("\n").filter(Boolean),
            agents: f.agents.split(",").map(s => s.trim()).filter(Boolean),
            estRevenue: Number(f.estRevenue) || 0,
            status: "Pending Approval",
            priority: Date.now(),
          })} color="#f59e0b" full disabled={!valid}>Create Plan</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [sideOpen, setSideOpen] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [msgTarget, setMsgTarget] = useState<(Buyer & { industry?: string }) | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [briefing, setBriefing] = useState("");

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [settings, setSettings] = useState<Settings>({ ownerName:"Commander", market:"", target:"", risk:"Medium", sources:"", signoff:"Trade Operations" });
  const [dataLoaded, setDataLoaded] = useState(false);

  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showOppForm, setShowOppForm] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editBuyer, setEditBuyer] = useState<Buyer | null>(null);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [editOpp, setEditOpp] = useState<Opportunity | null>(null);

  const { call, loading: aiLoad } = useAI();

  useEffect(() => {
    Promise.all([
      DB.get("opportunities"), DB.get("buyers"), DB.get("suppliers"),
      DB.get("alerts"), DB.get("plans"), DB.get("settings"),
    ]).then(([ops, buy, sup, alr, pln, set]) => {
      setOpportunities(ops || []);
      setBuyers(buy || []);
      setSuppliers(sup || []);
      setAlerts(alr || []);
      setPlans(pln || []);
      if (set) setSettings(set);
      setDataLoaded(true);
    });
  }, []);

  const saveOpps    = async (d: Opportunity[]) => { setOpportunities(d); await DB.set("opportunities", d); };
  const saveBuyers  = async (d: Buyer[])       => { setBuyers(d);        await DB.set("buyers", d); };
  const saveSupps   = async (d: Supplier[])    => { setSuppliers(d);     await DB.set("suppliers", d); };
  const saveAlerts  = async (d: Alert[])       => { setAlerts(d);        await DB.set("alerts", d); };
  const savePlans   = async (d: Plan[])        => { setPlans(d);         await DB.set("plans", d); };
  const saveSettings = async (d: Settings)     => { setSettings(d);      await DB.set("settings", d); };

  const notify = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const runBriefing = async () => {
    const oppSummary = opportunities.length
      ? opportunities.map(o => `${o.title} ($${o.commission?.toLocaleString()} commission, ${o.confidence}% confidence, ${o.status})`).join(" | ")
      : "No opportunities in pipeline yet.";
    const system = `You are CEO AI in a text-based trade brokerage boardroom. All buyer/supplier contact is via written messages ONLY. Analyze the pipeline and give the owner a crisp 3-sentence executive briefing with the single highest-priority written action to take today. Be specific. No bullet points.`;
    const msg = `Pipeline: ${oppSummary}. Buyers: ${buyers.length}. Suppliers: ${suppliers.length}. Risk alerts: ${alerts.length}.`;
    setBriefing(await call(system, msg));
  };

  const addOpp = async (f: Omit<Opportunity, "id" | "created">) => {
    await saveOpps([...opportunities, { ...f, id: Date.now(), created: new Date().toISOString().slice(0, 10) }]);
    setShowOppForm(false); setEditOpp(null); notify("Opportunity added ✓");
  };
  const updateOpp = async (f: Omit<Opportunity, "id" | "created">) => {
    await saveOpps(opportunities.map(o => o.id === editOpp!.id ? { ...editOpp!, ...f } : o));
    setEditOpp(null); notify("Opportunity updated ✓");
  };
  const deleteOpp = async (id: number) => { await saveOpps(opportunities.filter(o => o.id !== id)); notify("Removed", "info"); };

  const addBuyer = async (f: Omit<Buyer, "id" | "lastContact">) => {
    await saveBuyers([...buyers, { ...f, id: Date.now(), lastContact: new Date().toISOString().slice(0, 10) }]);
    setShowBuyerForm(false); setEditBuyer(null); notify("Buyer added ✓");
  };
  const updateBuyer = async (f: Omit<Buyer, "id" | "lastContact">) => {
    await saveBuyers(buyers.map(b => b.id === editBuyer!.id ? { ...editBuyer!, ...f } : b));
    setEditBuyer(null); notify("Buyer updated ✓");
  };
  const deleteBuyer = async (id: number) => { await saveBuyers(buyers.filter(b => b.id !== id)); notify("Removed", "info"); };

  const addSupplier = async (f: Omit<Supplier, "id">) => {
    await saveSupps([...suppliers, { ...f, id: Date.now() }]);
    setShowSupplierForm(false); setEditSupplier(null); notify("Supplier added ✓");
  };
  const updateSupplier = async (f: Omit<Supplier, "id">) => {
    await saveSupps(suppliers.map(s => s.id === editSupplier!.id ? { ...editSupplier!, ...f } : s));
    setEditSupplier(null); notify("Supplier updated ✓");
  };
  const deleteSupplier = async (id: number) => { await saveSupps(suppliers.filter(s => s.id !== id)); notify("Removed", "info"); };

  const addAlert = async (f: { message: string; severity: string }) => {
    await saveAlerts([...alerts, { ...f, id: Date.now(), time: "just now" }]);
    setShowAlertForm(false); notify("Alert added ✓");
  };
  const deleteAlert = async (id: number) => { await saveAlerts(alerts.filter(a => a.id !== id)); };

  const addPlan = async (f: Omit<Plan, "id">) => {
    await savePlans([...plans, { ...f, id: Date.now() }]);
    setShowPlanForm(false); notify("CEO Plan created ✓");
  };
  const approvePlan = async (plan: Plan) => {
    await savePlans(plans.map(p => p.id === plan.id ? { ...p, status: "Approved" } : p));
    notify(`Plan approved — agents executing: "${plan.title}"`);
  };
  const rejectPlan = async (plan: Plan) => {
    await savePlans(plans.filter(p => p.id !== plan.id)); notify(`Skipped: "${plan.title}"`, "info");
  };

  const totalPipeline = opportunities.reduce((s, o) => s + (o.commission || 0), 0);
  const highConf = opportunities.filter(o => o.confidence > 80).reduce((s, o) => s + (o.commission || 0), 0);
  const activeDeals = opportunities.filter(o => o.status === "Active" || o.status === "Closing").length;

  const NAV = [
    { id:"dashboard",     label:"Dashboard",        icon:I.dash   },
    { id:"ceo",           label:"CEO Boardroom",    icon:I.ceo    },
    { id:"opportunities", label:"Opportunities",    icon:I.star   },
    { id:"pipeline",      label:"Deal Pipeline",    icon:I.kanban },
    { id:"messages",      label:"Messages",         icon:I.msg    },
    { id:"tenders",       label:"Tenders",          icon:I.doc    },
    { id:"buyers",        label:"Buyer Network",    icon:I.buyers },
    { id:"suppliers",     label:"Supplier Network", icon:I.home   },
    { id:"revenue",       label:"Revenue",          icon:I.rev    },
    { id:"agents",        label:"AI Agents",        icon:I.brain  },
    { id:"settings",      label:"Settings",         icon:I.cog    },
  ];

  if (!dataLoaded) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060810" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f59e0b,#a855f7)" }}>
          <span className="text-lg font-black text-black">OC</span>
        </div>
        <div className="text-sm text-slate-500">Loading your boardroom…</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex text-slate-300 overflow-hidden" style={{ background: "#060810", fontFamily: "'Inter',system-ui,sans-serif" }}>

      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl"
          style={{ background: toast.type === "success" ? "#10b98122" : "#3b82f622", color: toast.type === "success" ? "#10b981" : "#60a5fa", border: `1px solid ${toast.type === "success" ? "#10b98133" : "#3b82f633"}`, backdropFilter: "blur(12px)" }}>
          {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <div className="flex-shrink-0 flex flex-col transition-all duration-300 z-30"
        style={{ width: sideOpen ? 240 : 60, background: "#080b13", borderRight: "1px solid #1a1f2e" }}>
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: "#1a1f2e" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#f59e0b,#a855f7)" }}>
            <span className="text-xs font-black text-black">OC</span>
          </div>
          {sideOpen && (
            <div>
              <div className="text-xs font-black text-white tracking-tight leading-none">OPPORTUNITY</div>
              <div className="text-xs font-black leading-none" style={{ color: "#f59e0b" }}>COMMAND AI</div>
            </div>
          )}
          <button onClick={() => setSideOpen(v => !v)} className="ml-auto text-slate-600 hover:text-slate-300 transition-colors flex-shrink-0">
            <Icon d={sideOpen ? I.x : I.menu} size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 p-2 flex-1 overflow-y-auto">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left w-full"
              style={tab === item.id
                ? { background: "#f59e0b18", color: "#f59e0b", border: "1px solid #f59e0b22" }
                : { color: "#475569", border: "1px solid transparent" }}>
              <span className="flex-shrink-0"><Icon d={item.icon} size={15} /></span>
              {sideOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {sideOpen && (
          <div className="p-3 border-t" style={{ borderColor: "#1a1f2e" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-600 uppercase tracking-widest">Risk Alerts</div>
              <button onClick={() => setShowAlertForm(true)} className="text-xs px-1.5 py-0.5 rounded" style={{ color: "#ef4444", background: "#ef444411" }}>+ Add</button>
            </div>
            {alerts.length === 0
              ? <div className="text-xs text-slate-700 py-2 text-center">No active alerts</div>
              : alerts.map(a => (
                <div key={a.id} className="group flex items-start gap-2 text-xs px-2 py-1.5 rounded-lg mb-1.5 leading-snug"
                  style={{ background: a.severity === "high" ? "#ef444411" : a.severity === "medium" ? "#f59e0b11" : "#3b82f611", color: a.severity === "high" ? "#ef4444" : a.severity === "medium" ? "#f59e0b" : "#60a5fa", border: `1px solid ${a.severity === "high" ? "#ef444422" : a.severity === "medium" ? "#f59e0b22" : "#3b82f622"}` }}>
                  <span className="flex-1">{a.message}</span>
                  <button onClick={() => deleteAlert(a.id)} className="opacity-0 group-hover:opacity-100 flex-shrink-0"><Icon d={I.x} size={10} /></button>
                </div>
              ))}
            <div className="mt-2 text-xs px-2 py-1.5 rounded-lg text-center font-semibold"
              style={{ background: "#ef444411", color: "#ef4444", border: "1px solid #ef444422" }}>
              🔒 Written messages only
            </div>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-4 border-b flex-shrink-0" style={{ background: "#08090f", borderColor: "#1a1f2e" }}>
          <div className="flex-1">
            <div className="relative max-w-xs">
              <Icon d={I.search} size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Search opportunities, contacts…"
                className="w-full bg-transparent text-xs text-white pl-8 pr-3 py-2 rounded-lg outline-none placeholder-slate-600"
                style={inputStyle} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: "#ef444411", border: "1px solid #ef444422" }}>
            <Icon d={I.lock} size={11} className="text-red-400" />
            <span className="text-xs font-semibold" style={{ color: "#ef4444" }}>Text-only mode</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#10b981" }} />
            <span className="text-xs text-slate-500">11 agents active</span>
          </div>
          <button onClick={() => setTab("messages")} className="relative text-slate-500 hover:text-white transition-colors">
            <Icon d={I.bell} size={18} />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: "#ef4444", color: "white", fontSize: 9 }}>{alerts.length}</span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-bold text-white">Good morning, {settings.ownerName || "Commander"}.</h1>
                <p className="text-sm text-slate-500 mt-1">Your AI boardroom is live. All contact is via written messages only — no calls, no video.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Pipeline Value" value={totalPipeline ? `$${(totalPipeline/1000).toFixed(0)}K` : "$0"} sub="Est. commissions" accent="#f59e0b" icon={I.rev} />
                <MetricCard label="Active Deals" value={activeDeals} sub="In motion" accent="#10b981" icon={I.deals} />
                <MetricCard label="Buyer Network" value={buyers.length} sub="Contacts" accent="#3b82f6" icon={I.buyers} />
                <MetricCard label="Supplier Network" value={suppliers.length} sub="Partners" accent="#10b981" icon={I.home} />
              </div>

              <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "#0a0d16", border: "1px solid #f59e0b33" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon d={I.ceo} size={15} className="text-yellow-400" />
                    <span className="text-sm font-semibold text-white">CEO AI — Executive Briefing</span>
                  </div>
                  <button onClick={runBriefing} disabled={aiLoad}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg disabled:opacity-40"
                    style={{ background: "#f59e0b18", color: "#f59e0b", border: "1px solid #f59e0b33" }}>
                    <Icon d={I.refresh} size={12} />{aiLoad ? "Analyzing…" : "Refresh Briefing"}
                  </button>
                </div>
                {briefing
                  ? <p className="text-sm text-slate-300 leading-relaxed">{briefing}</p>
                  : <p className="text-sm text-slate-500 italic">Click Refresh to get your AI executive briefing from CEO AI.</p>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label:"Add Buyer",       action:() => setShowBuyerForm(true),    color:"#06b6d4" },
                  { label:"Add Supplier",    action:() => setShowSupplierForm(true), color:"#10b981" },
                  { label:"Add Opportunity", action:() => setShowOppForm(true),      color:"#8b5cf6" },
                  { label:"New CEO Plan",    action:() => setShowPlanForm(true),     color:"#f59e0b" },
                ].map(q => (
                  <button key={q.label} onClick={q.action}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold"
                    style={{ background: q.color + "18", color: q.color, border: `1px solid ${q.color}33` }}>
                    <Icon d={I.plus} size={12} />{q.label}
                  </button>
                ))}
              </div>

              {opportunities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white">Recent Opportunities</h2>
                    <button onClick={() => setTab("opportunities")} className="text-xs" style={{ color: "#f59e0b" }}>View all →</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {opportunities.slice(-3).reverse().map(op => (
                      <div key={op.id} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{op.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={op.status} />
                            <Badge label={op.type} color="#6366f1" />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold" style={{ color: "#10b981" }}>{op.commission ? `+$${Number(op.commission).toLocaleString()}` : "—"}</div>
                          <div className="text-xs text-slate-500">{op.confidence}% confidence</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plans.filter(p => p.status !== "Approved").length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-white">CEO Plans — Awaiting Approval</h2>
                    <button onClick={() => setTab("ceo")} className="text-xs" style={{ color: "#f59e0b" }}>Full boardroom →</button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {plans.filter(p => p.status !== "Approved").slice(0, 2).map(plan => (
                      <div key={plan.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#0c0f18", border: "1px solid #f59e0b33" }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-semibold text-white">{plan.title}</div>
                          {plan.estRevenue > 0 && <div className="text-sm font-bold flex-shrink-0" style={{ color: "#10b981" }}>+${Number(plan.estRevenue).toLocaleString()}</div>}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{plan.reasoning}</p>
                        <div className="flex gap-2">
                          <Btn onClick={() => approvePlan(plan)} color="#10b981" sm full>✓ Approve</Btn>
                          <Btn onClick={() => rejectPlan(plan)} color="#ef4444" sm full>✗ Skip</Btn>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CEO BOARDROOM */}
          {tab === "ceo" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">CEO AI Boardroom</h1>
                  <p className="text-sm text-slate-500 mt-1">Approve plans to deploy agents. All contact via written messages only.</p>
                </div>
                <Btn onClick={() => setShowPlanForm(true)} sm color="#f59e0b"><Icon d={I.plus} size={12} className="inline mr-1" />New Plan</Btn>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "#0a0d16", border: "1px solid #f59e0b22" }}>
                <div className="flex items-center gap-2 mb-1"><Icon d={I.lock} size={13} className="text-red-400" /><span className="font-semibold text-white text-xs">Protocol</span></div>
                <p className="text-xs text-slate-400 leading-relaxed">Agents draft written messages only. Nothing is sent or executed without your explicit approval on each action.</p>
              </div>
              {plans.length === 0
                ? <EmptyState icon={I.ceo} title="No CEO plans yet" sub="Create a plan to coordinate your AI agents toward a specific deal." action="Create First Plan" onAction={() => setShowPlanForm(true)} />
                : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map(plan => (
                      <div key={plan.id} className="rounded-xl p-5 flex flex-col gap-4" style={{ background: "#0c0f18", border: "1px solid #f59e0b33" }}>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-white">{plan.title}</h3>
                          {plan.estRevenue > 0 && <div className="text-sm font-bold flex-shrink-0" style={{ color: "#10b981" }}>+${Number(plan.estRevenue).toLocaleString()}</div>}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{plan.reasoning}</p>
                        {plan.actions?.length > 0 && (
                          <div className="flex flex-col gap-1.5">
                            {plan.actions.map((a, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <Icon d={I.arrow} size={10} className="text-slate-600 flex-shrink-0 mt-0.5" />{a}
                              </div>
                            ))}
                          </div>
                        )}
                        {plan.agents?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {plan.agents.map(ag => <Badge key={ag} label={ag} color="#f59e0b" />)}
                          </div>
                        )}
                        {plan.status === "Approved"
                          ? <div className="text-xs py-2 text-center rounded-lg" style={{ background: "#10b98111", color: "#10b981" }}>✓ Approved – Agents executing</div>
                          : <div className="flex gap-2">
                              <Btn onClick={() => approvePlan(plan)} color="#10b981" sm full>✓ Approve & Execute</Btn>
                              <Btn onClick={() => rejectPlan(plan)} color="#ef4444" sm full>✗ Skip</Btn>
                            </div>
                        }
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* OPPORTUNITIES */}
          {tab === "opportunities" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Opportunities</h1>
                <Btn onClick={() => setShowOppForm(true)} sm color="#8b5cf6"><Icon d={I.plus} size={12} className="inline mr-1" />Add Opportunity</Btn>
              </div>
              {opportunities.length === 0
                ? <EmptyState icon={I.star} title="No opportunities yet" sub="Add your first trade deal opportunity to start tracking commissions." action="Add First Opportunity" onAction={() => setShowOppForm(true)} />
                : <div className="flex flex-col gap-3">
                    {opportunities
                      .filter(o => !searchQ || o.title?.toLowerCase().includes(searchQ.toLowerCase()))
                      .map(op => (
                        <div key={op.id} className="rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white mb-1">{op.title}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <StatusBadge status={op.status} />
                              <Badge label={op.type} color="#6366f1" />
                              <Badge label={`Risk: ${op.risk}`} color={op.risk === "Low" ? "#10b981" : op.risk === "Medium" ? "#f59e0b" : "#ef4444"} />
                              <Badge label={`Effort: ${op.effort}`} color="#6b7280" />
                            </div>
                          </div>
                          <div className="flex items-center gap-5 flex-shrink-0 flex-wrap">
                            <div><div className="text-xs text-slate-600">Deal Value</div><div className="font-semibold text-white">{op.value ? `$${(op.value/1000).toFixed(0)}K` : "—"}</div></div>
                            <div><div className="text-xs text-slate-600">Commission</div><div className="font-bold" style={{ color: "#10b981" }}>{op.commission ? `+$${Number(op.commission).toLocaleString()}` : "—"}</div></div>
                            <div><div className="text-xs text-slate-600">Confidence</div><div className="font-semibold" style={{ color: op.confidence > 85 ? "#10b981" : op.confidence > 70 ? "#f59e0b" : "#ef4444" }}>{op.confidence}%</div></div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditOpp(op)} className="p-1.5 rounded-lg" style={{ background: "#1e2433", color: "#94a3b8" }}><Icon d={I.edit} size={13} /></button>
                              <button onClick={() => deleteOpp(op.id)} className="p-1.5 rounded-lg" style={{ background: "#ef444411", color: "#ef4444" }}><Icon d={I.trash} size={13} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
              }
            </div>
          )}

          {/* PIPELINE */}
          {tab === "pipeline" && (
            <div className="flex flex-col gap-5">
              <h1 className="text-xl font-bold text-white">Deal Pipeline</h1>
              {opportunities.length === 0
                ? <EmptyState icon={I.kanban} title="Pipeline is empty" sub="Add opportunities to track them through the deal stages." action="Add Opportunity" onAction={() => setShowOppForm(true)} />
                : <div className="flex gap-4 overflow-x-auto pb-2">
                    {["New","Evaluating","Active","Closing"].map(stage => {
                      const cols: Record<string,string> = { New:"#3b82f6",Evaluating:"#f59e0b",Active:"#10b981",Closing:"#a855f7" };
                      const items = opportunities.filter(o => o.status === stage);
                      return (
                        <div key={stage} className="flex flex-col gap-3 min-w-52 flex-1">
                          <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: cols[stage] }} />
                              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{stage}</span>
                            </div>
                            <span className="text-xs text-slate-600">{items.length}</span>
                          </div>
                          {items.map(op => (
                            <div key={op.id} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                              <div className="text-xs font-semibold text-white leading-snug">{op.title}</div>
                              {op.commission > 0 && <div className="text-xs" style={{ color: "#10b981" }}>+${Number(op.commission).toLocaleString()}</div>}
                              <div className="flex gap-2 flex-wrap mt-1">
                                <Badge label={op.type} color={cols[stage]} />
                                <Badge label={`${op.confidence}%`} color={op.confidence > 85 ? "#10b981" : op.confidence > 70 ? "#f59e0b" : "#ef4444"} />
                              </div>
                              {buyers.length > 0 && (
                                <button onClick={() => setMsgTarget(buyers[0])} className="text-xs py-1 rounded-lg mt-1" style={{ background: "#f9731618", color: "#f97316", border: "1px solid #f9731633" }}>
                                  Message Buyer →
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
              }
            </div>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-xl font-bold text-white">Messages</h1>
                <p className="text-sm text-slate-500 mt-1">All AI communication via written messages only — no calls, no video.</p>
              </div>
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: "#0a0d16", border: "1px solid #ef444433" }}>
                <Icon d={I.lock} size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-red-400">Text-Only Protocol: </span>
                  Outreach AI drafts written messages. No calls, no video, no meetings. Every draft reviewed and approved by you before delivery.
                </div>
              </div>
              {buyers.length === 0 && suppliers.length === 0
                ? <EmptyState icon={I.msg} title="No contacts yet" sub="Add buyers and suppliers to start message threads." action="Add Buyer" onAction={() => setShowBuyerForm(true)} />
                : <>
                    {buyers.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Buyer Threads</div>
                        <div className="flex flex-col gap-2">
                          {buyers.map(buyer => (
                            <button key={buyer.id} onClick={() => setMsgTarget(buyer)}
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left w-full transition-all"
                              style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: "#1e2433", color: "#94a3b8" }}>{buyer.name[0]}</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{buyer.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{buyer.industry} · {buyer.country}</div>
                              </div>
                              <StatusBadge status={buyer.status} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {suppliers.length > 0 && (
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">Supplier Threads</div>
                        <div className="flex flex-col gap-2">
                          {suppliers.map(sup => (
                            <button key={sup.id} onClick={() => setMsgTarget({ ...sup, industry: sup.product, status: "Active", budget: "", lastContact: "" })}
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left w-full transition-all"
                              style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: "#1e2433", color: "#94a3b8" }}>{sup.name[0]}</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white truncate">{sup.name}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{sup.product} · {sup.country}</div>
                              </div>
                              <Badge label={sup.certified ? "Certified" : "Unverified"} color={sup.certified ? "#10b981" : "#f59e0b"} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
              }
            </div>
          )}

          {/* TENDERS */}
          {tab === "tenders" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Tender Tracker</h1>
                <Btn onClick={() => setShowOppForm(true)} sm color="#3b82f6"><Icon d={I.plus} size={12} className="inline mr-1" />Add Tender</Btn>
              </div>
              <div className="p-4 rounded-xl text-xs text-slate-400" style={{ background: "#0c0f18", border: "1px solid #3b82f633" }}>
                <div className="flex items-center gap-2 mb-1"><Icon d={I.doc} size={13} className="text-blue-400" /><span className="text-blue-400 font-semibold">Tender Hunter AI — Monitoring Sources</span></div>
                Register free on: UNGM (ungm.org) · World Bank (worldbank.org/vendors) · EU TED (ted.europa.eu) · UK Find a Tender (find-tender.service.gov.uk) · AfDB (afdb.org/procurement)
              </div>
              {opportunities.filter(o => o.type === "Tender" || o.type === "Procurement").length === 0
                ? <EmptyState icon={I.doc} title="No tenders tracked yet" sub="Add opportunities with type Tender or Procurement to track them here." action="Add Tender" onAction={() => setShowOppForm(true)} />
                : opportunities.filter(o => o.type === "Tender" || o.type === "Procurement").map(op => (
                    <div key={op.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white mb-1">{op.title}</div>
                          <div className="flex gap-2 flex-wrap">
                            <Badge label={op.type} color="#3b82f6" />
                            <Badge label={`${op.confidence}% match`} color="#10b981" />
                            <StatusBadge status={op.status} />
                          </div>
                        </div>
                        {op.commission > 0 && (
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-sm" style={{ color: "#10b981" }}>+${Number(op.commission).toLocaleString()}</div>
                            <div className="text-xs text-slate-500">est. commission</div>
                          </div>
                        )}
                      </div>
                      {op.notes && <div className="text-xs text-slate-500 leading-relaxed">{op.notes}</div>}
                      <div className="flex gap-2">
                        {buyers.length > 0 && (
                          <button onClick={() => setMsgTarget(buyers[0])} className="text-xs py-2 px-3 rounded-lg" style={{ background: "#f9731618", color: "#f97316", border: "1px solid #f9731633" }}>Message Contact →</button>
                        )}
                        <button onClick={() => setChatAgent(AGENTS.find(a => a.id === "tender")!)} className="text-xs py-2 px-3 rounded-lg" style={{ background: "#3b82f618", color: "#3b82f6", border: "1px solid #3b82f633" }}>Ask Tender Hunter →</button>
                      </div>
                    </div>
                  ))
              }
            </div>
          )}

          {/* BUYERS */}
          {tab === "buyers" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Buyer Network</h1>
                <div className="flex gap-2">
                  <Btn onClick={() => setChatAgent(AGENTS.find(a => a.id === "buyer")!)} sm color="#06b6d4">Ask Buyer AI</Btn>
                  <Btn onClick={() => setShowBuyerForm(true)} sm color="#06b6d4"><Icon d={I.plus} size={12} className="inline mr-1" />Add Buyer</Btn>
                </div>
              </div>
              {buyers.length === 0
                ? <EmptyState icon={I.buyers} title="No buyers yet" sub="Add your first buyer contact to start building your network." action="Add First Buyer" onAction={() => setShowBuyerForm(true)} />
                : <div className="grid md:grid-cols-2 gap-4">
                    {buyers.filter(b => !searchQ || b.name?.toLowerCase().includes(searchQ.toLowerCase())).map(buyer => (
                      <div key={buyer.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">{buyer.name}</div>
                            <div className="text-xs text-slate-500">{buyer.country} · {buyer.industry}</div>
                          </div>
                          <StatusBadge status={buyer.status} />
                        </div>
                        {buyer.budget && <div className="text-xs text-slate-400">Budget: <span className="text-white">{buyer.budget}</span></div>}
                        {buyer.contact && <div className="text-xs text-slate-600 flex items-center gap-1.5"><Icon d={I.msg} size={11} />{buyer.contact}</div>}
                        {buyer.notes && <div className="text-xs text-slate-500 leading-relaxed">{buyer.notes}</div>}
                        <div className="flex gap-2">
                          <button onClick={() => setMsgTarget(buyer)} className="flex-1 text-xs py-2 rounded-lg font-medium" style={{ background: "#f9731618", color: "#f97316", border: "1px solid #f9731633" }}>✦ Message</button>
                          <button onClick={() => setEditBuyer(buyer)} className="p-2 rounded-lg" style={{ background: "#1e2433", color: "#94a3b8" }}><Icon d={I.edit} size={13} /></button>
                          <button onClick={() => deleteBuyer(buyer.id)} className="p-2 rounded-lg" style={{ background: "#ef444411", color: "#ef4444" }}><Icon d={I.trash} size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* SUPPLIERS */}
          {tab === "suppliers" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Supplier Network</h1>
                <div className="flex gap-2">
                  <Btn onClick={() => setChatAgent(AGENTS.find(a => a.id === "supplier")!)} sm color="#10b981">Ask Supplier AI</Btn>
                  <Btn onClick={() => setShowSupplierForm(true)} sm color="#10b981"><Icon d={I.plus} size={12} className="inline mr-1" />Add Supplier</Btn>
                </div>
              </div>
              {suppliers.length === 0
                ? <EmptyState icon={I.home} title="No suppliers yet" sub="Add your first supplier to start building your sourcing network." action="Add First Supplier" onAction={() => setShowSupplierForm(true)} />
                : <div className="grid md:grid-cols-2 gap-4">
                    {suppliers.filter(s => !searchQ || s.name?.toLowerCase().includes(searchQ.toLowerCase())).map(sup => (
                      <div key={sup.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">{sup.name}</div>
                            <div className="text-xs text-slate-500">{sup.country} · {sup.product}</div>
                          </div>
                          <Badge label={sup.certified ? "Certified" : "Unverified"} color={sup.certified ? "#10b981" : "#f59e0b"} />
                        </div>
                        {sup.capacity && <div className="text-xs text-slate-400">Capacity: <span className="text-white">{sup.capacity}</span></div>}
                        {sup.contact && <div className="text-xs text-slate-600 flex items-center gap-1.5"><Icon d={I.msg} size={11} />{sup.contact}</div>}
                        {sup.notes && <div className="text-xs text-slate-500 leading-relaxed">{sup.notes}</div>}
                        <div className="flex gap-2">
                          <button onClick={() => setMsgTarget({ ...sup, industry: sup.product, status: "Active", budget: "", lastContact: "" })} className="flex-1 text-xs py-2 rounded-lg font-medium" style={{ background: "#f9731618", color: "#f97316", border: "1px solid #f9731633" }}>✦ Message</button>
                          <button onClick={() => setChatAgent(AGENTS.find(a => a.id === "deal")!)} className="flex-1 text-xs py-2 rounded-lg" style={{ background: "#ec489918", color: "#ec4899", border: "1px solid #ec489933" }}>Match Buyer</button>
                          <button onClick={() => setEditSupplier(sup)} className="p-2 rounded-lg" style={{ background: "#1e2433", color: "#94a3b8" }}><Icon d={I.edit} size={13} /></button>
                          <button onClick={() => deleteSupplier(sup.id)} className="p-2 rounded-lg" style={{ background: "#ef444411", color: "#ef4444" }}><Icon d={I.trash} size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* REVENUE */}
          {tab === "revenue" && (
            <div className="flex flex-col gap-5">
              <h1 className="text-xl font-bold text-white">Revenue Forecast</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Pipeline" value={totalPipeline ? `$${(totalPipeline/1000).toFixed(1)}K` : "$0"} sub="All commissions" accent="#f59e0b" icon={I.rev} />
                <MetricCard label="High Confidence" value={highConf ? `$${(highConf/1000).toFixed(1)}K` : "$0"} sub=">80% confidence" accent="#10b981" icon={I.trend} />
                <MetricCard label="Opportunities" value={opportunities.length} sub="Total tracked" accent="#8b5cf6" icon={I.star} />
                <MetricCard label="Closing" value={opportunities.filter(o => o.status === "Closing").length} sub="Near completion" accent="#a855f7" icon={I.check} />
              </div>
              {opportunities.length === 0
                ? <EmptyState icon={I.rev} title="No revenue data yet" sub="Add opportunities with commission values to see your pipeline forecast." />
                : <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-white">Commission by Opportunity</h2>
                    {[...opportunities].sort((a, b) => (b.commission||0) - (a.commission||0)).map(op => (
                      <div key={op.id} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: "#0c0f18", border: "1px solid #1e2433" }}>
                        <div className="flex-1 text-xs text-white truncate">{op.title}</div>
                        <div className="w-28 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#1e2433" }}>
                          <div className="h-full rounded-full" style={{ width: `${op.confidence||0}%`, background: op.confidence > 85 ? "#10b981" : op.confidence > 70 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <div className="text-xs font-bold w-24 text-right flex-shrink-0" style={{ color: "#10b981" }}>
                          {op.commission ? `+$${Number(op.commission).toLocaleString()}` : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          )}

          {/* AI AGENTS */}
          {tab === "agents" && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-xl font-bold text-white">AI Agent Team</h1>
                <p className="text-sm text-slate-500 mt-1">All agents communicate via written messages only. No calls, no video. Your approval required before every action.</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AGENTS.map(agent => (
                  <div key={agent.id} className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#090c14", border: "1px solid #1e2433" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: agent.color + "22" }}>
                        <span style={{ color: agent.color }}><Icon d={agent.icon} size={16} /></span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{agent.name}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: agent.color }} />
                          <span className="text-xs" style={{ color: agent.color }}>Active</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{agent.desc}</p>
                    <button onClick={() => setChatAgent(agent)} className="text-xs py-1.5 px-3 rounded-lg text-left"
                      style={{ background: agent.color + "18", color: agent.color, border: `1px solid ${agent.color}33` }}>
                      Brief this agent →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="flex flex-col gap-6 max-w-xl">
              <h1 className="text-xl font-bold text-white">Settings</h1>
              <div className="flex flex-col gap-4">
                {([
                  { label:"Your Name",        key:"ownerName", ph:"Commander" },
                  { label:"Primary Market",   key:"market",    ph:"Sub-Saharan Africa, GCC, EU" },
                  { label:"Commission Target",key:"target",    ph:"$50,000 / month" },
                  { label:"Tender Sources",   key:"sources",   ph:"UNGM, World Bank, EU TED, UK Find a Tender" },
                  { label:"Message Sign-off", key:"signoff",   ph:"Trade Operations" },
                ] as { label: string; key: keyof Settings; ph: string }[]).map(s => (
                  <Field key={s.key} label={s.label}>
                    <Input value={settings[s.key] || ""} onChange={v => setSettings(p => ({ ...p, [s.key]: v }))} placeholder={s.ph} />
                  </Field>
                ))}
                <Field label="Risk Tolerance">
                  <Select value={settings.risk || "Medium"} onChange={v => setSettings(p => ({ ...p, risk: v }))}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </Select>
                </Field>
              </div>
              <Btn onClick={async () => { await saveSettings(settings); notify("Settings saved ✓"); }} full color="#f59e0b">Save Settings</Btn>

              <div className="p-4 rounded-xl" style={{ background: "#0a0d16", border: "1px solid #ef444433" }}>
                <div className="font-semibold text-red-400 text-xs mb-3">System Constraints — Permanent & Non-Negotiable</div>
                {[
                  "All contact with buyers and suppliers is via written text messages only",
                  "No phone calls are ever made or arranged",
                  "No video calls are ever initiated or scheduled",
                  "No in-person or virtual meetings are arranged",
                  "No profit guarantees are ever made",
                  "No contracts are executed by the AI",
                  "AI never impersonates a human",
                  "Every outgoing message requires explicit owner approval",
                  "Every action requires explicit owner approval",
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500 mb-1.5">
                    <Icon d={I.lock} size={11} className="text-red-500 flex-shrink-0 mt-0.5" />{c}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODALS */}
      {chatAgent    && <AgentChat agent={chatAgent} onClose={() => setChatAgent(null)} />}
      {msgTarget    && <MessageThread contact={msgTarget} onClose={() => setMsgTarget(null)} onSent={() => notify("Message sent via Outreach AI ✓")} />}
      {showBuyerForm    && <BuyerForm    onSave={addBuyer}    onClose={() => setShowBuyerForm(false)} />}
      {showSupplierForm && <SupplierForm onSave={addSupplier} onClose={() => setShowSupplierForm(false)} />}
      {showOppForm      && <OpportunityForm onSave={addOpp}   onClose={() => setShowOppForm(false)} />}
      {showAlertForm    && <AlertForm    onSave={addAlert}    onClose={() => setShowAlertForm(false)} />}
      {showPlanForm     && <PlanForm     onSave={addPlan}     onClose={() => setShowPlanForm(false)} />}
      {editBuyer    && <BuyerForm    initial={editBuyer}    onSave={updateBuyer}    onClose={() => setEditBuyer(null)} />}
      {editSupplier && <SupplierForm initial={editSupplier} onSave={updateSupplier} onClose={() => setEditSupplier(null)} />}
      {editOpp      && <OpportunityForm initial={editOpp}   onSave={updateOpp}      onClose={() => setEditOpp(null)} />}
    </div>
  );
}
