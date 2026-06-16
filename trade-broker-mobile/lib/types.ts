export interface Opportunity {
  id: number;
  title: string;
  type: string;
  value: number;
  commission: number;
  effort: string;
  risk: string;
  confidence: number;
  status: string;
  notes: string;
  created: string;
}

export interface Buyer {
  id: number;
  name: string;
  country: string;
  industry: string;
  budget: string;
  status: string;
  contact: string;
  notes: string;
  lastContact: string;
}

export interface Supplier {
  id: number;
  name: string;
  country: string;
  product: string;
  capacity: string;
  certified: boolean;
  contact: string;
  notes: string;
}

export interface Alert {
  id: number;
  message: string;
  severity: string;
  time: string;
}

export interface Plan {
  id: number;
  title: string;
  reasoning: string;
  actions: string[];
  agents: string[];
  estRevenue: number;
  status: string;
  priority: number;
}

export interface AppSettings {
  ownerName: string;
  market: string;
  target: string;
  risk: string;
  sources: string;
  signoff: string;
  apiKey: string;
}

export interface ChatMessage {
  id: number;
  from: string;
  text: string;
  time: string;
}

export interface Agent {
  id: string;
  name: string;
  color: string;
  desc: string;
}

export const AGENTS: Agent[] = [
  { id:"ceo",         name:"CEO AI",              color:"#f59e0b", desc:"Strategic command. Prioritizes deals and creates execution plans. All actions need your approval." },
  { id:"opportunity", name:"Opportunity Hunter",  color:"#8b5cf6", desc:"Scans sources and ranks opportunities by value, effort, risk, and confidence." },
  { id:"tender",      name:"Tender Hunter",       color:"#3b82f6", desc:"Tracks procurement portals. Delivers deadline alerts and requirement summaries." },
  { id:"buyer",       name:"Buyer Finder",        color:"#06b6d4", desc:"Builds and maintains your buyer database. Text messages only — no calls, no video." },
  { id:"supplier",    name:"Supplier Finder",     color:"#10b981", desc:"Maintains supplier network with capacity and certifications. Written messages only." },
  { id:"deal",        name:"Deal Matching",       color:"#ec4899", desc:"Suggests optimal buyer-supplier pairings with compatibility scores." },
  { id:"outreach",    name:"Outreach AI",         color:"#f97316", desc:"Drafts written messages. Never sends without your explicit approval. Text only." },
  { id:"crm",         name:"CRM AI",              color:"#6366f1", desc:"Tracks all conversations, relationships, and follow-up schedules." },
  { id:"market",      name:"Market Intelligence", color:"#14b8a6", desc:"Monitors commodity prices and trade signals. Written market briefings only." },
  { id:"risk",        name:"Risk AI",             color:"#ef4444", desc:"Flags geopolitical, financial, and counterparty risks with mitigation guidance." },
  { id:"revenue",     name:"Revenue AI",          color:"#a855f7", desc:"Forecasts commission income and pipeline value. Written revenue reports." },
];

export const COLORS = {
  bg:       "#060810",
  card:     "#0c0f18",
  sidebar:  "#080b13",
  surface:  "#0a0d16",
  input:    "#0f1117",
  border:   "#1e2433",
  border2:  "#1a1f2e",
  text:     "#cbd5e1",
  muted:    "#475569",
  dim:      "#94a3b8",
  amber:    "#f59e0b",
  green:    "#10b981",
  blue:     "#3b82f6",
  purple:   "#8b5cf6",
  cyan:     "#06b6d4",
  pink:     "#ec4899",
  orange:   "#f97316",
  red:      "#ef4444",
  teal:     "#14b8a6",
  indigo:   "#6366f1",
  violet:   "#a855f7",
};
