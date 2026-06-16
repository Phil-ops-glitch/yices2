import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { AppContext } from "../lib/context";
import { Field, Inp, Btn } from "../components/ui";
import { COLORS, AppSettings } from "../lib/types";

export default function SettingsScreen() {
  const ctx = useContext(AppContext);
  const [s, setS] = useState<AppSettings>(ctx.settings);
  const set = (k: keyof AppSettings) => (v: string) => setS(p => ({ ...p, [k]: v }));

  const save = async () => {
    await ctx.saveSettings(s);
    Alert.alert("Saved", "Settings saved successfully.");
  };

  return (
    <ScrollView style={{ flex:1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding:16, paddingBottom:48 }}>
      <Text style={st.title}>Settings</Text>

      <View style={st.section}>
        <Text style={st.sectionLabel}>Profile</Text>
        <Field label="Your Name"><Inp value={s.ownerName} onChange={set("ownerName")} placeholder="Commander" /></Field>
        <Field label="Primary Market"><Inp value={s.market} onChange={set("market")} placeholder="Sub-Saharan Africa, GCC, EU" /></Field>
        <Field label="Commission Target"><Inp value={s.target} onChange={set("target")} placeholder="$50,000 / month" /></Field>
        <Field label="Message Sign-off"><Inp value={s.signoff} onChange={set("signoff")} placeholder="Trade Operations" /></Field>
      </View>

      <View style={st.section}>
        <Text style={st.sectionLabel}>AI Configuration</Text>
        <Field label="Anthropic API Key">
          <Inp value={s.apiKey} onChange={set("apiKey")} placeholder="sk-ant-…" secureTextEntry />
        </Field>
        <Text style={st.hint}>Get your key at console.anthropic.com · Stored securely on device only</Text>
      </View>

      <View style={st.section}>
        <Text style={st.sectionLabel}>Preferences</Text>
        <Field label="Tender Sources"><Inp value={s.sources} onChange={set("sources")} placeholder="UNGM, World Bank, EU TED, UK Find a Tender" /></Field>
        <Field label="Risk Tolerance">
          <View style={{ flexDirection:"row", gap:8 }}>
            {["Low","Medium","High"].map(r => (
              <TouchableOpacity key={r} onPress={() => set("risk")(r)}
                style={[st.pill, s.risk === r && { backgroundColor: COLORS.amber+"33", borderColor: COLORS.amber }]}>
                <Text style={[st.pillText, s.risk === r && { color: COLORS.amber }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>
      </View>

      <Btn onPress={save} full color={COLORS.amber}>Save Settings</Btn>

      <View style={st.protocol}>
        <Text style={st.protocolTitle}>🔒 System Constraints — Permanent & Non-Negotiable</Text>
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
          <Text key={i} style={st.constraint}>🔒 {c}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  title: { fontSize:20, fontWeight:"700", color:"white", marginBottom:20 },
  section: { backgroundColor: COLORS.card, borderRadius:14, padding:16, marginBottom:16, borderWidth:1, borderColor: COLORS.border },
  sectionLabel: { fontSize:9, color: COLORS.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:14 },
  hint: { fontSize:10, color: COLORS.muted, marginTop:4, lineHeight:15 },
  pill: { flex:1, backgroundColor: COLORS.input, borderColor: COLORS.border, borderWidth:1, borderRadius:99, paddingVertical:8, alignItems:"center" },
  pillText: { fontSize:12, color: COLORS.dim },
  protocol: { backgroundColor: COLORS.surface, borderRadius:14, padding:16, marginTop:16, borderWidth:1, borderColor: COLORS.red+"33" },
  protocolTitle: { fontSize:11, color: COLORS.red, fontWeight:"700", marginBottom:10 },
  constraint: { fontSize:10, color: COLORS.muted, lineHeight:20 },
});
