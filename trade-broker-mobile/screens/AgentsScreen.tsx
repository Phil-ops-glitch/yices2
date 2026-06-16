import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { AppContext } from "../lib/context";
import { useAI } from "../lib/ai";
import { COLORS, AGENTS, Agent } from "../lib/types";
import { AILoading } from "../components/ui";

function AgentChatModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const ctx = useContext(AppContext);
  const { call, loading } = useAI(ctx.settings.apiKey || "");
  const [msgs, setMsgs] = useState([{ role: "assistant", text: `I'm ${agent.name}. ${agent.desc} How can I help?` }]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => { setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100); }, [msgs]);

  const send = async () => {
    if (!input.trim()) return;
    const txt = input.trim(); setInput("");
    setMsgs(p => [...p, { role: "user", text: txt }]);
    const r = await call(
      `You are ${agent.name} in a text-based trade brokerage. ${agent.desc} CRITICAL: all contact is via written text ONLY. Never suggest calls, video, or meetings. Be concise (2–4 sentences).`,
      txt
    );
    setMsgs(p => [...p, { role: "assistant", text: r }]);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={[s.modalHeader, { borderBottomColor: agent.color + "44" }]}>
          <View style={[s.agentIcon, { backgroundColor: agent.color + "22" }]}>
            <Text style={{ color: agent.color, fontSize: 16 }}>🤖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.agentName}>{agent.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={[s.dot, { backgroundColor: agent.color }]} />
              <Text style={[s.onlineText, { color: agent.color }]}>Online · Text-only</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Text style={{ color: COLORS.dim, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {msgs.map((m, i) => (
            <View key={i} style={[s.bubble, m.role === "user" ? s.bubbleUser : s.bubbleAgent]}>
              <Text style={[s.bubbleText, m.role === "user" ? { color: "#e2e8f0" } : { color: "#94a3b8" }]}>{m.text}</Text>
            </View>
          ))}
          {loading && <AILoading color={agent.color} />}
        </ScrollView>

        <View style={s.inputRow}>
          <TextInput
            value={input} onChangeText={setInput} placeholder="Brief this agent…"
            placeholderTextColor={COLORS.muted} style={s.textInput}
            onSubmitEditing={send}
          />
          <TouchableOpacity onPress={send} disabled={loading}
            style={[s.sendBtn, { backgroundColor: agent.color + "22", borderColor: agent.color + "44" }]}>
            <Text style={{ color: agent.color, fontSize: 16 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function AgentsScreen() {
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Text style={s.pageTitle}>AI Agent Team</Text>
        <Text style={s.pageSubtitle}>All agents communicate via written messages only. Your approval required for every action.</Text>

        <View style={s.grid}>
          {AGENTS.map(agent => (
            <View key={agent.id} style={[s.card, { borderColor: agent.color + "33" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <View style={[s.agentIcon, { backgroundColor: agent.color + "22" }]}>
                  <Text style={{ color: agent.color, fontSize: 16 }}>🤖</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.agentName}>{agent.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <View style={[s.dot, { backgroundColor: agent.color }]} />
                    <Text style={[s.onlineText, { color: agent.color }]}>Active</Text>
                  </View>
                </View>
              </View>
              <Text style={s.agentDesc}>{agent.desc}</Text>
              <TouchableOpacity onPress={() => setActiveAgent(agent)}
                style={[s.briefBtn, { backgroundColor: agent.color + "18", borderColor: agent.color + "33" }]}>
                <Text style={{ color: agent.color, fontSize: 11, fontWeight: "600" }}>Brief this agent →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {activeAgent && <AgentChatModal agent={activeAgent} onClose={() => setActiveAgent(null)} />}
    </View>
  );
}

const s = StyleSheet.create({
  pageTitle: { fontSize: 20, fontWeight: "700", color: "white", marginBottom: 4 },
  pageSubtitle: { fontSize: 12, color: COLORS.muted, marginBottom: 20, lineHeight: 18 },
  grid: { gap: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, borderWidth: 1 },
  agentIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  agentName: { fontSize: 13, fontWeight: "700", color: "white" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  onlineText: { fontSize: 10 },
  agentDesc: { fontSize: 11, color: COLORS.muted, lineHeight: 17, marginBottom: 10 },
  briefBtn: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderBottomWidth: 1, backgroundColor: COLORS.sidebar },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.card, alignItems: "center", justifyContent: "center" },
  bubble: { marginBottom: 10, padding: 10, borderRadius: 12, maxWidth: "88%" },
  bubbleUser: { alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleAgent: { alignSelf: "flex-start", backgroundColor: COLORS.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  bubbleText: { fontSize: 12, lineHeight: 18 },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, backgroundColor: COLORS.sidebar, borderTopWidth: 1, borderTopColor: COLORS.border },
  textInput: { flex: 1, backgroundColor: COLORS.card, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, color: "white", fontSize: 12, paddingHorizontal: 12, paddingVertical: 8 },
  sendBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, alignItems: "center", justifyContent: "center" },
});
