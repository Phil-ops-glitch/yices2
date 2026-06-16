import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { useAI } from "../lib/ai";
import { MetricCard, SectionHeader, Btn, StatusBadge, Badge, AILoading } from "../components/ui";
import { COLORS } from "../lib/types";

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const ctx = useContext(AppContext);
  const { call, loading } = useAI(ctx.settings.apiKey || "");
  const [briefing, setBriefing] = useState("");

  const totalPipeline = ctx.opportunities.reduce((s, o) => s + (o.commission || 0), 0);
  const activeDeals   = ctx.opportunities.filter(o => o.status === "Active" || o.status === "Closing").length;

  const runBriefing = async () => {
    const summary = ctx.opportunities.length
      ? ctx.opportunities.map(o => `${o.title} ($${o.commission?.toLocaleString()}, ${o.confidence}%, ${o.status})`).join(" | ")
      : "No opportunities yet.";
    const r = await call(
      "You are CEO AI in a text-based trade brokerage. Analyze the pipeline and give the owner a crisp 3-sentence executive briefing with the single highest-priority action to take today. No bullet points.",
      `Pipeline: ${summary}. Buyers: ${ctx.buyers.length}. Suppliers: ${ctx.suppliers.length}. Alerts: ${ctx.alerts.length}.`
    );
    setBriefing(r);
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={s.header}>
        <Text style={s.greeting}>Good morning, {ctx.settings.ownerName || "Commander"}.</Text>
        <Text style={s.subtext}>Your AI boardroom is live. Text-only mode active.</Text>
      </View>

      <View style={s.metricsRow}>
        <MetricCard label="Pipeline" value={totalPipeline ? `$${(totalPipeline/1000).toFixed(0)}K` : "$0"} sub="Est. commissions" accent={COLORS.amber} />
        <MetricCard label="Active Deals" value={activeDeals} sub="In motion" accent={COLORS.green} />
      </View>
      <View style={[s.metricsRow, { marginTop: 10 }]}>
        <MetricCard label="Buyers" value={ctx.buyers.length} sub="Network" accent={COLORS.blue} />
        <MetricCard label="Suppliers" value={ctx.suppliers.length} sub="Partners" accent={COLORS.green} />
      </View>

      {/* CEO Briefing */}
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>⚡ CEO AI Briefing</Text>
          <TouchableOpacity onPress={runBriefing} disabled={loading}
            style={[s.refreshBtn, loading && { opacity: 0.5 }]}>
            <Text style={{ color: COLORS.amber, fontSize: 11 }}>↺ Refresh</Text>
          </TouchableOpacity>
        </View>
        {loading ? <AILoading /> : briefing
          ? <Text style={s.briefingText}>{briefing}</Text>
          : <Text style={s.placeholderText}>Tap Refresh to get your AI executive briefing.</Text>}
      </View>

      {/* Quick Actions */}
      <Text style={s.sectionLabel}>Quick Actions</Text>
      <View style={s.quickActions}>
        {[
          { label:"+ Add Buyer",       color: COLORS.cyan,   tab: "Network" },
          { label:"+ Add Supplier",    color: COLORS.green,  tab: "Network" },
          { label:"+ Opportunity",     color: COLORS.purple, tab: "Deals"   },
          { label:"+ CEO Plan",        color: COLORS.amber,  tab: "CEO"     },
        ].map(q => (
          <TouchableOpacity key={q.label} onPress={() => navigation.navigate(q.tab)}
            style={[s.quickBtn, { backgroundColor: q.color + "18", borderColor: q.color + "33" }]}>
            <Text style={{ color: q.color, fontSize: 11, fontWeight: "600" }}>{q.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Opportunities */}
      {ctx.opportunities.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <SectionHeader title="Recent Opportunities" action="View all →" onAction={() => navigation.navigate("Deals")} />
          {ctx.opportunities.slice(-3).reverse().map(op => (
            <View key={op.id} style={s.oppRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.oppTitle} numberOfLines={1}>{op.title}</Text>
                <View style={s.badgeRow}>
                  <StatusBadge status={op.status} />
                  <Badge label={op.type} color={COLORS.indigo} />
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.commission}>{op.commission ? `+$${Number(op.commission).toLocaleString()}` : "—"}</Text>
                <Text style={s.confidence}>{op.confidence}% conf.</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Protocol */}
      <View style={s.protocol}>
        <Text style={s.protocolIcon}>🔒</Text>
        <Text style={s.protocolText}>Text-only mode · No calls · No video · Owner approval required for every action</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16 },
  header: { paddingTop: 16, paddingBottom: 20 },
  greeting: { fontSize: 20, fontWeight: "700", color: "white" },
  subtext: { fontSize: 12, color: COLORS.muted, marginTop: 4 },
  metricsRow: { flexDirection: "row", gap: 10 },
  card: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginTop: 16, borderWidth: 1, borderColor: COLORS.amber + "33" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "white" },
  refreshBtn: { backgroundColor: COLORS.amber + "18", borderColor: COLORS.amber + "33", borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  briefingText: { fontSize: 13, color: "#cbd5e1", lineHeight: 20 },
  placeholderText: { fontSize: 12, color: COLORS.muted, fontStyle: "italic" },
  sectionLabel: { fontSize: 11, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 20, marginBottom: 10 },
  quickActions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, minWidth: "48%" },
  oppRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  oppTitle: { fontSize: 12, fontWeight: "600", color: "white", marginBottom: 6 },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  commission: { fontSize: 13, fontWeight: "700", color: COLORS.green },
  confidence: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  protocol: { flexDirection: "row", gap: 8, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginTop: 24, borderWidth: 1, borderColor: COLORS.red + "22", alignItems: "center" },
  protocolIcon: { fontSize: 14 },
  protocolText: { fontSize: 10, color: COLORS.muted, flex: 1, lineHeight: 16 },
});
