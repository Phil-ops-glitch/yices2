import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { MetricCard, EmptyState } from "../components/ui";
import { COLORS } from "../lib/types";

export default function RevenueScreen() {
  const ctx = useContext(AppContext);
  const total = ctx.opportunities.reduce((s, o) => s + (o.commission || 0), 0);
  const highConf = ctx.opportunities.filter(o => o.confidence > 80).reduce((s, o) => s + (o.commission || 0), 0);
  const closing = ctx.opportunities.filter(o => o.status === "Closing").length;

  return (
    <ScrollView style={{ flex:1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding:16, paddingBottom:32 }}>
      <Text style={s.title}>Revenue Forecast</Text>

      <View style={s.metricsRow}>
        <MetricCard label="Total Pipeline" value={total ? `$${(total/1000).toFixed(1)}K` : "$0"} sub="All commissions" accent={COLORS.amber} />
        <MetricCard label="High Confidence" value={highConf ? `$${(highConf/1000).toFixed(1)}K` : "$0"} sub=">80% confidence" accent={COLORS.green} />
      </View>
      <View style={[s.metricsRow, { marginTop:10 }]}>
        <MetricCard label="Opportunities" value={ctx.opportunities.length} sub="Total tracked" accent={COLORS.purple} />
        <MetricCard label="Closing" value={closing} sub="Near completion" accent={COLORS.violet} />
      </View>

      {ctx.opportunities.length === 0 ? (
        <EmptyState icon="💰" title="No revenue data yet" sub="Add opportunities with commission values to see your forecast." />
      ) : (
        <View style={{ marginTop:24 }}>
          <Text style={s.sectionTitle}>Commission by Opportunity</Text>
          {[...ctx.opportunities]
            .sort((a, b) => (b.commission||0) - (a.commission||0))
            .map(op => (
              <View key={op.id} style={s.row}>
                <Text style={s.opTitle} numberOfLines={1}>{op.title}</Text>
                <View style={s.barWrap}>
                  <View style={[s.bar, { width: `${op.confidence||0}%`, backgroundColor: op.confidence > 85 ? COLORS.green : op.confidence > 70 ? COLORS.amber : COLORS.red }]} />
                </View>
                <Text style={s.commission}>{op.commission ? `+$${Number(op.commission).toLocaleString()}` : "—"}</Text>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: { fontSize:20, fontWeight:"700", color:"white", marginBottom:16 },
  metricsRow: { flexDirection:"row", gap:10 },
  sectionTitle: { fontSize:13, fontWeight:"700", color:"white", marginBottom:10 },
  row: { backgroundColor: COLORS.card, borderRadius:12, padding:12, marginBottom:8, borderWidth:1, borderColor: COLORS.border, flexDirection:"row", alignItems:"center", gap:10 },
  opTitle: { flex:1, fontSize:11, color:"white" },
  barWrap: { width:80, height:5, backgroundColor: COLORS.border, borderRadius:99, overflow:"hidden" },
  bar: { height:"100%", borderRadius:99 },
  commission: { fontSize:11, fontWeight:"700", color: COLORS.green, width:80, textAlign:"right" },
});
