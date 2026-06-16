import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { AppContext } from "../lib/context";
import { useAI } from "../lib/ai";
import { DB } from "../lib/storage";
import { COLORS, ChatMessage } from "../lib/types";
import { AILoading } from "../components/ui";

export default function MessageThreadScreen({ route }: { route: any }) {
  const { contact } = route.params;
  const ctx = useContext(AppContext);
  const { call, loading } = useAI(ctx.settings.apiKey || "");

  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [manual, setManual] = useState("");
  const [showDraft, setShowDraft] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const storageKey = `thread:${contact.id}`;

  useEffect(() => {
    DB.get<ChatMessage[]>(storageKey).then(d => setMsgs(d || []));
  }, [storageKey]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [msgs]);

  const save = async (updated: ChatMessage[]) => {
    setMsgs(updated);
    await DB.set(storageKey, updated);
  };

  const genDraft = async () => {
    const last = msgs[msgs.length - 1];
    const ctx2 = last
      ? `Prior message (${last.from === "ai" ? "we sent" : contact.name + " replied"}): "${last.text}"`
      : "No prior messages — this is the first outreach.";
    const r = await call(
      `You are Outreach AI in a text-based trade brokerage. CRITICAL: text ONLY — no calls, no video, no meetings. Draft a concise professional message under 130 words. Sign off as "Trade Operations" only. Never guarantee outcomes.`,
      `Contact: ${contact.name} (${contact.industry}, ${contact.country}). ${ctx2}. Draft the next written message.`
    );
    setDraft(r);
    setShowDraft(true);
  };

  const approve = async () => {
    if (!draft.trim()) return;
    const m: ChatMessage = { id: Date.now(), from: "ai", text: draft, time: new Date().toISOString().slice(0, 16).replace("T", " ") };
    await save([...msgs, m]);
    setDraft(""); setShowDraft(false);
  };

  const sendManual = async () => {
    if (!manual.trim()) return;
    const m: ChatMessage = { id: Date.now(), from: "ai", text: manual, time: new Date().toISOString().slice(0, 16).replace("T", " ") };
    await save([...msgs, m]);
    setManual("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Protocol bar */}
      <View style={s.protocolBar}>
        <Text style={s.protocolText}>🔒 Written messages only · No calls · No video · Your approval required</Text>
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 16 }}>
        {msgs.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Text style={{ fontSize: 40 }}>💬</Text>
            <Text style={{ color: COLORS.muted, fontSize: 13, marginTop: 12 }}>No messages with {contact.name} yet.</Text>
          </View>
        ) : msgs.map(m => (
          <View key={m.id} style={[s.bubble, m.from === "ai" ? s.bubbleOut : s.bubbleIn]}>
            <Text style={s.bubbleFrom}>{m.from === "ai" ? "Outreach AI → sent" : contact.name}</Text>
            <Text style={[s.bubbleText, m.from === "ai" ? { color: "#e2e8f0" } : { color: "#94a3b8" }]}>{m.text}</Text>
            <Text style={s.bubbleTime}>{m.time}</Text>
          </View>
        ))}
        {loading && <AILoading color={COLORS.orange} />}
      </ScrollView>

      {/* Draft preview */}
      {showDraft && (
        <View style={s.draftBox}>
          <Text style={s.draftLabel}>⚠ AI Draft — Review before sending to {contact.name}</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            style={s.draftInput}
          />
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <TouchableOpacity onPress={() => { setShowDraft(false); genDraft(); }} style={[s.draftBtn, { backgroundColor: COLORS.muted + "22", borderColor: COLORS.muted + "44" }]}>
              <Text style={{ color: COLORS.muted, fontSize: 12 }}>↺ Regen</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDraft(false)} style={[s.draftBtn, { backgroundColor: COLORS.red + "18", borderColor: COLORS.red + "33" }]}>
              <Text style={{ color: COLORS.red, fontSize: 12 }}>✕ Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={approve} style={[s.draftBtn, { flex: 1, backgroundColor: COLORS.green + "18", borderColor: COLORS.green + "33" }]}>
              <Text style={{ color: COLORS.green, fontSize: 12, fontWeight: "700" }}>✓ Approve & Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input row */}
      <View style={s.inputRow}>
        <TextInput
          value={manual}
          onChangeText={setManual}
          placeholder="Type your message…"
          placeholderTextColor={COLORS.muted}
          style={s.textInput}
          multiline
        />
        <TouchableOpacity onPress={genDraft} disabled={loading} style={s.aiBtn}>
          <Text style={{ color: COLORS.amber, fontSize: 11, fontWeight: "700" }}>✦ AI</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sendManual} style={s.sendBtn}>
          <Text style={{ color: COLORS.green, fontSize: 16 }}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  protocolBar: { backgroundColor: COLORS.card, padding: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  protocolText: { fontSize: 10, color: COLORS.muted, textAlign: "center" },
  bubble: { marginBottom: 12, maxWidth: "85%" },
  bubbleOut: { alignSelf: "flex-end", backgroundColor: COLORS.orange + "18", borderRadius: 14, borderBottomRightRadius: 4, borderWidth: 1, borderColor: COLORS.orange + "33", padding: 10 },
  bubbleIn: { alignSelf: "flex-start", backgroundColor: COLORS.card, borderRadius: 14, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border, padding: 10 },
  bubbleFrom: { fontSize: 9, color: COLORS.muted, marginBottom: 4 },
  bubbleText: { fontSize: 12, lineHeight: 18 },
  bubbleTime: { fontSize: 9, color: COLORS.muted, marginTop: 4, textAlign: "right" },
  draftBox: { backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.amber + "33", padding: 14 },
  draftLabel: { fontSize: 10, color: COLORS.amber, marginBottom: 8, fontWeight: "600" },
  draftInput: { backgroundColor: COLORS.input, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: "#cbd5e1", fontSize: 12, padding: 10, maxHeight: 160, lineHeight: 18 },
  draftBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: COLORS.sidebar, borderTopWidth: 1, borderTopColor: COLORS.border },
  textInput: { flex: 1, backgroundColor: COLORS.card, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: "white", fontSize: 12, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 100 },
  aiBtn: { backgroundColor: COLORS.amber + "18", borderWidth: 1, borderColor: COLORS.amber + "33", borderRadius: 8, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" },
  sendBtn: { backgroundColor: COLORS.green + "18", borderWidth: 1, borderColor: COLORS.green + "33", borderRadius: 8, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" },
});
