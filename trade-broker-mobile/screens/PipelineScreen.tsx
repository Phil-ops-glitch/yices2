import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { EmptyState, Badge } from "../components/ui";
import { COLORS } from "../lib/types";

const STAGES = ["New","Evaluating","Active","Closing"];
const STAGE_COLORS: Record<string,string> = { New: COLORS.blue, Evaluating: COLORS.amber, Active: COLORS.green, Closing: COLORS.violet };

export default function PipelineScreen() {
  const ctx = useContext(AppContext);

  if (ctx.opportunities.length === 0) {
    return (
      <View style={{ flex:1, backgroundColor: COLORS.bg }}>
        <EmptyState icon="📊" title="Pipeline is empty" sub="Add opportunities to track them through deal stages." />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex:1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding:16, paddingBottom:32 }}>
      <Text style={s.title}>Deal Pipeline</Text>
      {STAGES.map(stage => {
        const items = ctx.opportunities.filter(o => o.status === stage);
        const color = STAGE_COLORS[stage];
        return (
          <View key={stage} style={s.column}>
            <View style={s.columnHeader}>
              <View style={[s.dot, { backgroundColor: color }]} />
              <Text style={s.stageName}>{stage}</Text>
              <Text style={s.stageCount}>{items.length}</Text>
            </View>
            {items.length === 0 ? (
              <Text style={s.empty}>No deals in {stage}</Text>
            ) : items.map(op => (
              <View key={op.id} style={[s.card, { borderLeftColor: color, borderLeftWidth: 3 }]}>
                <Text style={s.cardTitle} numberOfLines={2}>{op.title}</Text>
                {op.commission > 0 && <Text style={[s.commission, { color }]}>+${Number(op.commission).toLocaleString()}</Text>}
                <View style={s.badges}>
                  <Badge label={op.type} color={color} />
                  <Badge label={`${op.confidence}%`} color={op.confidence > 85 ? COLORS.green : op.confidence > 70 ? COLORS.amber : COLORS.red} />
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: { fontSize:20, fontWeight:"700", color:"white", marginBottom:16 },
  column: { marginBottom:20 },
  columnHeader: { flexDirection:"row", alignItems:"center", gap:8, marginBottom:8 },
  dot: { width:8, height:8, borderRadius:4 },
  stageName: { fontSize:11, fontWeight:"700", color: COLORS.muted, textTransform:"uppercase", letterSpacing:1, flex:1 },
  stageCount: { fontSize:11, color: COLORS.muted },
  empty: { fontSize:11, color: "#334155", fontStyle:"italic", paddingLeft:16 },
  card: { backgroundColor: COLORS.card, borderRadius:10, padding:12, marginBottom:8, borderWidth:1, borderColor: COLORS.border },
  cardTitle: { fontSize:12, fontWeight:"700", color:"white", marginBottom:4 },
  commission: { fontSize:12, fontWeight:"700", marginBottom:6 },
  badges: { flexDirection:"row", gap:6, flexWrap:"wrap" },
});
