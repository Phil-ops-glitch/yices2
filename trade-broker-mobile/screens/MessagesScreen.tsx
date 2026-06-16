import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { EmptyState, Badge, StatusBadge } from "../components/ui";
import { COLORS } from "../lib/types";

export default function MessagesScreen({ navigation }: { navigation: any }) {
  const ctx = useContext(AppContext);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* Protocol banner */}
      <View style={s.banner}>
        <Text style={s.bannerIcon}>🔒</Text>
        <Text style={s.bannerText}>Text-Only Protocol — No calls, no video. Every draft requires your approval before sending.</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {ctx.buyers.length === 0 && ctx.suppliers.length === 0 ? (
          <EmptyState icon="💬" title="No contacts yet" sub="Add buyers and suppliers to start message threads." action="Go to Network" onAction={() => navigation.navigate("Network")} />
        ) : (
          <>
            {ctx.buyers.length > 0 && (
              <>
                <Text style={s.sectionLabel}>Buyer Threads</Text>
                {ctx.buyers.map(b => (
                  <TouchableOpacity key={b.id}
                    onPress={() => navigation.navigate("MessageThread", { contact: { ...b, industry: b.industry } })}
                    style={s.row}>
                    <View style={s.avatar}><Text style={s.avatarText}>{b.name[0]}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.name}>{b.name}</Text>
                      <Text style={s.sub}>{b.industry} · {b.country}</Text>
                    </View>
                    <StatusBadge status={b.status} />
                    <Text style={s.arrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {ctx.suppliers.length > 0 && (
              <>
                <Text style={[s.sectionLabel, { marginTop: 20 }]}>Supplier Threads</Text>
                {ctx.suppliers.map(sup => (
                  <TouchableOpacity key={sup.id}
                    onPress={() => navigation.navigate("MessageThread", { contact: { ...sup, industry: sup.product, status: "Active" } })}
                    style={s.row}>
                    <View style={[s.avatar, { backgroundColor: COLORS.green + "22" }]}>
                      <Text style={[s.avatarText, { color: COLORS.green }]}>{sup.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.name}>{sup.name}</Text>
                      <Text style={s.sub}>{sup.product} · {sup.country}</Text>
                    </View>
                    <Badge label={sup.certified ? "Certified" : "Unverified"} color={sup.certified ? COLORS.green : COLORS.amber} />
                    <Text style={s.arrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { flexDirection: "row", gap: 8, backgroundColor: COLORS.surface, padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.red + "33", alignItems: "center" },
  bannerIcon: { fontSize: 13 },
  bannerText: { fontSize: 10, color: COLORS.muted, flex: 1, lineHeight: 16 },
  sectionLabel: { fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#1e2433", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#94a3b8", fontWeight: "700", fontSize: 14 },
  name: { fontSize: 13, fontWeight: "600", color: "white" },
  sub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  arrow: { fontSize: 18, color: COLORS.muted, marginLeft: 4 },
});
