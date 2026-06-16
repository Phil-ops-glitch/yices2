import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { AppContext } from "../lib/context";
import { COLORS } from "../lib/types";

const MENU_ITEMS = [
  { label: "CEO Boardroom",     icon: "⚡", screen: "CEO",      color: COLORS.amber  },
  { label: "Deal Pipeline",     icon: "📊", screen: "Pipeline", color: COLORS.purple },
  { label: "Revenue Forecast",  icon: "💰", screen: "Revenue",  color: COLORS.green  },
  { label: "Tender Tracker",    icon: "📋", screen: "Tenders",  color: COLORS.blue   },
  { label: "Settings",          icon: "⚙️", screen: "Settings", color: COLORS.muted  },
];

export default function MoreScreen({ navigation }: { navigation: any }) {
  const ctx = useContext(AppContext);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View style={s.profile}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{(ctx.settings.ownerName || "C")[0].toUpperCase()}</Text>
        </View>
        <View>
          <Text style={s.name}>{ctx.settings.ownerName || "Commander"}</Text>
          <Text style={s.role}>Opportunity Command AI</Text>
        </View>
      </View>

      {/* Quick stats */}
      <View style={s.stats}>
        {[
          { label:"Opportunities", value: ctx.opportunities.length, color: COLORS.purple },
          { label:"Buyers",        value: ctx.buyers.length,        color: COLORS.cyan   },
          { label:"Suppliers",     value: ctx.suppliers.length,     color: COLORS.green  },
          { label:"Alerts",        value: ctx.alerts.length,        color: COLORS.red    },
        ].map(st => (
          <View key={st.label} style={s.statCard}>
            <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      {/* Navigation items */}
      <View style={s.menu}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item.screen} onPress={() => navigation.navigate(item.screen)}
            style={s.menuItem}>
            <View style={[s.menuIcon, { backgroundColor: item.color + "18" }]}>
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            </View>
            <Text style={s.menuLabel}>{item.label}</Text>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Protocol reminder */}
      <View style={s.protocol}>
        <Text style={s.protocolTitle}>🔒 System Protocol (Non-Negotiable)</Text>
        {[
          "All contact via written text messages only",
          "No calls, video, or meetings ever suggested",
          "AI never sends without your explicit approval",
          "No profit guarantees ever made",
          "No contracts executed by AI",
        ].map((c, i) => (
          <Text key={i} style={s.protocolItem}>· {c}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  profile: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 20 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", backgroundColor: "transparent", borderWidth: 2, borderColor: COLORS.amber },
  avatarText: { fontSize: 22, fontWeight: "700", color: COLORS.amber },
  name: { fontSize: 16, fontWeight: "700", color: "white" },
  role: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  stats: { flexDirection: "row", gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 10, alignItems: "center", borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 },
  menu: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden", marginBottom: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 13, color: "white", fontWeight: "500" },
  menuArrow: { fontSize: 20, color: COLORS.muted },
  protocol: { backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.red + "33" },
  protocolTitle: { fontSize: 11, color: COLORS.red, fontWeight: "700", marginBottom: 10 },
  protocolItem: { fontSize: 11, color: COLORS.muted, lineHeight: 20 },
});
