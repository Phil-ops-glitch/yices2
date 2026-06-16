import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { EmptyState, SectionHeader, StatusBadge, Badge, BottomModal, Field, Inp, Btn } from "../components/ui";
import { COLORS, Opportunity } from "../lib/types";

function OppForm({ initial, onSave, onClose }: { initial?: Opportunity; onSave: (f: any) => void; onClose: () => void }) {
  const empty = { title:"", type:"Brokerage", value:"", commission:"", effort:"Medium", risk:"Medium", confidence:"70", status:"New", notes:"" };
  const [f, setF] = useState<Record<string,string>>(initial ? { ...initial, value: String(initial.value), commission: String(initial.commission), confidence: String(initial.confidence) } : empty);
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const valid = f.title.trim().length > 0;

  const statusOptions = ["New","Evaluating","Active","Closing"];
  const typeOptions = ["Brokerage","Procurement","Sourcing","Tender","Referral"];
  const levelOptions = ["Low","Medium","High"];

  return (
    <BottomModal visible title={initial ? "Edit Opportunity" : "Add Opportunity"} onClose={onClose} accent={COLORS.purple}>
      <View style={{ padding: 20 }}>
        <Field label="Title *"><Inp value={f.title} onChange={set("title")} placeholder="Steel Supply Contract – GCC" /></Field>

        <Field label="Type">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {typeOptions.map(t => (
                <TouchableOpacity key={t} onPress={() => set("type")(t)}
                  style={[s.pill, f.type === t && { backgroundColor: COLORS.purple + "33", borderColor: COLORS.purple }]}>
                  <Text style={[s.pillText, f.type === t && { color: COLORS.purple }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Field>

        <Field label="Status">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {statusOptions.map(t => (
                <TouchableOpacity key={t} onPress={() => set("status")(t)}
                  style={[s.pill, f.status === t && { backgroundColor: COLORS.blue + "33", borderColor: COLORS.blue }]}>
                  <Text style={[s.pillText, f.status === t && { color: COLORS.blue }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Field>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="Deal Value (USD)"><Inp value={f.value} onChange={set("value")} placeholder="2400000" keyboardType="numeric" /></Field></View>
          <View style={{ flex: 1 }}><Field label="Commission (USD)"><Inp value={f.commission} onChange={set("commission")} placeholder="72000" keyboardType="numeric" /></Field></View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Risk">
              <View style={{ flexDirection: "row", gap: 6 }}>
                {levelOptions.map(t => (
                  <TouchableOpacity key={t} onPress={() => set("risk")(t)}
                    style={[s.pill, f.risk === t && { backgroundColor: COLORS.red + "33", borderColor: COLORS.red }]}>
                    <Text style={[s.pillText, f.risk === t && { color: COLORS.red }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>
          </View>
          <View style={{ flex: 1 }}><Field label="Confidence %"><Inp value={f.confidence} onChange={set("confidence")} placeholder="85" keyboardType="numeric" /></Field></View>
        </View>

        <Field label="Notes"><Inp value={f.notes} onChange={set("notes")} placeholder="Source, contacts, requirements…" multiline /></Field>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
          <Btn onPress={onClose} color={COLORS.muted} full>Cancel</Btn>
          <Btn onPress={() => valid && onSave({ ...f, value: Number(f.value)||0, commission: Number(f.commission)||0, confidence: Number(f.confidence)||0 })} color={COLORS.purple} full disabled={!valid}>
            {initial ? "Save Changes" : "Add Opportunity"}
          </Btn>
        </View>
      </View>
    </BottomModal>
  );
}

export default function OpportunitiesScreen() {
  const ctx = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Opportunity | null>(null);
  const [search, setSearch] = useState("");

  const addOpp = async (f: any) => {
    const item: Opportunity = { ...f, id: Date.now(), created: new Date().toISOString().slice(0, 10) };
    await ctx.saveOpportunities([...ctx.opportunities, item]);
    setShowForm(false);
  };

  const updateOpp = async (f: any) => {
    await ctx.saveOpportunities(ctx.opportunities.map(o => o.id === editItem!.id ? { ...editItem!, ...f } : o));
    setEditItem(null);
  };

  const deleteOpp = async (id: number) => {
    await ctx.saveOpportunities(ctx.opportunities.filter(o => o.id !== id));
  };

  const filtered = ctx.opportunities.filter(o => !search || o.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <TextInput
            value={search} onChangeText={setSearch} placeholder="Search opportunities…"
            placeholderTextColor={COLORS.muted}
            style={[s.searchInput]}
          />
          <TouchableOpacity onPress={() => setShowForm(true)} style={s.addBtn}>
            <Text style={{ color: COLORS.purple, fontWeight: "700", fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        {filtered.length === 0
          ? <EmptyState icon="⭐" title="No opportunities yet" sub="Add your first trade deal to start tracking commissions." action="Add Opportunity" onAction={() => setShowForm(true)} />
          : filtered.map(op => (
              <View key={op.id} style={s.card}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={s.title} numberOfLines={2}>{op.title}</Text>
                  <View style={{ flexDirection: "row", gap: 6, marginLeft: 8 }}>
                    <TouchableOpacity onPress={() => setEditItem(op)} style={s.iconBtn}>
                      <Text style={{ color: COLORS.dim, fontSize: 13 }}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteOpp(op.id)} style={[s.iconBtn, { backgroundColor: COLORS.red + "11" }]}>
                      <Text style={{ color: COLORS.red, fontSize: 13 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={s.badgeRow}>
                  <StatusBadge status={op.status} />
                  <Badge label={op.type} color={COLORS.indigo} />
                  <Badge label={`Risk: ${op.risk}`} color={op.risk === "Low" ? COLORS.green : op.risk === "Medium" ? COLORS.amber : COLORS.red} />
                </View>

                <View style={s.metrics}>
                  <View style={s.metric}>
                    <Text style={s.metricLabel}>Deal Value</Text>
                    <Text style={s.metricVal}>{op.value ? `$${(op.value/1000).toFixed(0)}K` : "—"}</Text>
                  </View>
                  <View style={s.metric}>
                    <Text style={s.metricLabel}>Commission</Text>
                    <Text style={[s.metricVal, { color: COLORS.green }]}>{op.commission ? `+$${Number(op.commission).toLocaleString()}` : "—"}</Text>
                  </View>
                  <View style={s.metric}>
                    <Text style={s.metricLabel}>Confidence</Text>
                    <Text style={[s.metricVal, { color: op.confidence > 85 ? COLORS.green : op.confidence > 70 ? COLORS.amber : COLORS.red }]}>{op.confidence}%</Text>
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>

      {showForm && <OppForm onSave={addOpp} onClose={() => setShowForm(false)} />}
      {editItem && <OppForm initial={editItem} onSave={updateOpp} onClose={() => setEditItem(null)} />}
    </View>
  );
}

const s = StyleSheet.create({
  searchInput: { flex: 1, backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, color: "white", fontSize: 12 },
  addBtn: { backgroundColor: COLORS.purple + "22", borderColor: COLORS.purple + "44", borderWidth: 1, borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border },
  title: { fontSize: 13, fontWeight: "700", color: "white", flex: 1 },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 8, marginBottom: 10 },
  iconBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center" },
  metrics: { flexDirection: "row", gap: 8 },
  metric: { flex: 1, backgroundColor: COLORS.input, borderRadius: 8, padding: 8 },
  metricLabel: { fontSize: 9, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  metricVal: { fontSize: 13, fontWeight: "700", color: "white", marginTop: 2 },
  pill: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth: 1, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
  pillText: { fontSize: 11, color: COLORS.dim },
});
