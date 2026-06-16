import React, { useContext } from "react";
import { View, Text, ScrollView, Linking, TouchableOpacity, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { EmptyState, Badge, StatusBadge } from "../components/ui";
import { COLORS } from "../lib/types";

const SOURCES = [
  { label: "UNGM",           url: "https://www.ungm.org" },
  { label: "World Bank",     url: "https://projects.worldbank.org/en/projects-operations/procurement" },
  { label: "EU TED",         url: "https://ted.europa.eu" },
  { label: "UK Tenders",     url: "https://www.find-tender.service.gov.uk" },
  { label: "AfDB",           url: "https://www.afdb.org/en/projects-and-operations/procurement" },
];

export default function TendersScreen() {
  const ctx = useContext(AppContext);
  const tenders = ctx.opportunities.filter(o => o.type === "Tender" || o.type === "Procurement");

  return (
    <ScrollView style={{ flex:1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding:16, paddingBottom:32 }}>
      <Text style={s.title}>Tender Tracker</Text>

      <View style={s.sourceCard}>
        <Text style={s.sourceTitle}>📋 Tender Hunter AI — Live Sources</Text>
        <Text style={s.sourceSubtitle}>Register on these free procurement portals to get notified of new tenders:</Text>
        <View style={s.sources}>
          {SOURCES.map(src => (
            <TouchableOpacity key={src.label} onPress={() => Linking.openURL(src.url)} style={s.sourceBtn}>
              <Text style={s.sourceLabel}>{src.label} ↗</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {tenders.length === 0 ? (
        <EmptyState icon="📄" title="No tenders tracked yet" sub='Add opportunities with type "Tender" or "Procurement" to track them here.' />
      ) : tenders.map(op => (
        <View key={op.id} style={s.card}>
          <View style={s.cardTop}>
            <Text style={s.cardTitle} numberOfLines={2}>{op.title}</Text>
            {op.commission > 0 && (
              <View>
                <Text style={s.commission}>+${Number(op.commission).toLocaleString()}</Text>
                <Text style={s.commissionLabel}>est. commission</Text>
              </View>
            )}
          </View>
          <View style={s.badges}>
            <Badge label={op.type} color={COLORS.blue} />
            <Badge label={`${op.confidence}% match`} color={COLORS.green} />
            <StatusBadge status={op.status} />
          </View>
          {op.notes ? <Text style={s.notes}>{op.notes}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: { fontSize:20, fontWeight:"700", color:"white", marginBottom:16 },
  sourceCard: { backgroundColor: COLORS.card, borderRadius:14, padding:14, marginBottom:16, borderWidth:1, borderColor: COLORS.blue+"33" },
  sourceTitle: { fontSize:12, fontWeight:"700", color: COLORS.blue, marginBottom:4 },
  sourceSubtitle: { fontSize:11, color: COLORS.muted, marginBottom:10, lineHeight:16 },
  sources: { flexDirection:"row", flexWrap:"wrap", gap:6 },
  sourceBtn: { backgroundColor: COLORS.blue+"18", borderColor: COLORS.blue+"33", borderWidth:1, borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  sourceLabel: { color: COLORS.blue, fontSize:11, fontWeight:"600" },
  card: { backgroundColor: COLORS.card, borderRadius:14, padding:14, marginBottom:10, borderWidth:1, borderColor: COLORS.border },
  cardTop: { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:8 },
  cardTitle: { fontSize:13, fontWeight:"700", color:"white", flex:1 },
  commission: { fontSize:13, fontWeight:"700", color: COLORS.green, textAlign:"right" },
  commissionLabel: { fontSize:9, color: COLORS.muted, textAlign:"right" },
  badges: { flexDirection:"row", gap:6, flexWrap:"wrap", marginBottom:6 },
  notes: { fontSize:11, color: COLORS.muted, lineHeight:16, marginTop:6 },
});
