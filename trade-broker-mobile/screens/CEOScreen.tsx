import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { EmptyState, BottomModal, Field, Inp, Btn } from "../components/ui";
import { COLORS, Plan } from "../lib/types";

function PlanForm({ onSave, onClose }: { onSave: (f: any) => void; onClose: () => void }) {
  const [f, setF] = useState({ title:"", reasoning:"", actions:"", agents:"", estRevenue:"" });
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const valid = f.title.trim() && f.reasoning.trim();
  return (
    <BottomModal visible title="New CEO Plan" onClose={onClose} accent={COLORS.amber}>
      <View style={{ padding: 20 }}>
        <Field label="Plan Title *"><Inp value={f.title} onChange={set("title")} placeholder="Close GCC Steel Deal" /></Field>
        <Field label="CEO Reasoning *"><Inp value={f.reasoning} onChange={set("reasoning")} placeholder="Why is this the top priority right now?" multiline /></Field>
        <Field label="Action Steps (one per line)"><Inp value={f.actions} onChange={set("actions")} placeholder={"Send pricing message\nConfirm supplier stock\nRequest LOI"} multiline /></Field>
        <View style={{ flexDirection:"row", gap:10 }}>
          <View style={{ flex:1 }}><Field label="Agents (comma sep)"><Inp value={f.agents} onChange={set("agents")} placeholder="Outreach AI, CRM AI" /></Field></View>
          <View style={{ flex:1 }}><Field label="Est. Commission (USD)"><Inp value={f.estRevenue} onChange={set("estRevenue")} placeholder="21000" keyboardType="numeric" /></Field></View>
        </View>
        <View style={{ flexDirection:"row", gap:10, marginTop:8 }}>
          <Btn onPress={onClose} color={COLORS.muted} full>Cancel</Btn>
          <Btn onPress={() => valid && onSave({
            title: f.title, reasoning: f.reasoning,
            actions: f.actions.split("\n").filter(Boolean),
            agents: f.agents.split(",").map(s => s.trim()).filter(Boolean),
            estRevenue: Number(f.estRevenue)||0, status:"Pending Approval", priority: Date.now()
          })} color={COLORS.amber} full disabled={!valid}>Create Plan</Btn>
        </View>
      </View>
    </BottomModal>
  );
}

export default function CEOScreen() {
  const ctx = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);

  const addPlan = async (f: any) => {
    await ctx.savePlans([...ctx.plans, { ...f, id: Date.now() }]);
    setShowForm(false);
  };
  const approvePlan = async (plan: Plan) => {
    await ctx.savePlans(ctx.plans.map(p => p.id === plan.id ? { ...p, status:"Approved" } : p));
  };
  const rejectPlan = async (plan: Plan) => {
    await ctx.savePlans(ctx.plans.filter(p => p.id !== plan.id));
  };

  return (
    <View style={{ flex:1, backgroundColor: COLORS.bg }}>
      <ScrollView contentContainerStyle={{ padding:16, paddingBottom:32 }}>
        <View style={s.topRow}>
          <View>
            <Text style={s.title}>CEO AI Boardroom</Text>
            <Text style={s.sub}>Approve plans to deploy agents. Text-only protocol.</Text>
          </View>
          <TouchableOpacity onPress={() => setShowForm(true)} style={s.addBtn}>
            <Text style={{ color: COLORS.amber, fontSize:18, fontWeight:"700" }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={s.protocol}>
          <Text style={s.protocolText}>🔒 Agents draft written messages only. Nothing executes without your explicit approval.</Text>
        </View>

        {ctx.plans.length === 0
          ? <EmptyState icon="⚡" title="No CEO plans yet" sub="Create a plan to coordinate your AI agents." action="Create First Plan" onAction={() => setShowForm(true)} />
          : ctx.plans.map(plan => (
              <View key={plan.id} style={[s.card, plan.status === "Approved" && { borderColor: COLORS.green+"44" }]}>
                <View style={s.cardTop}>
                  <Text style={s.planTitle} numberOfLines={2}>{plan.title}</Text>
                  {plan.estRevenue > 0 && <Text style={s.commission}>+${Number(plan.estRevenue).toLocaleString()}</Text>}
                </View>

                <Text style={s.reasoning}>{plan.reasoning}</Text>

                {plan.actions?.length > 0 && (
                  <View style={s.steps}>
                    {plan.actions.map((a, i) => (
                      <Text key={i} style={s.step}>→ {a}</Text>
                    ))}
                  </View>
                )}

                {plan.agents?.length > 0 && (
                  <View style={s.agentTags}>
                    {plan.agents.map(ag => (
                      <View key={ag} style={s.agentTag}><Text style={s.agentTagText}>{ag}</Text></View>
                    ))}
                  </View>
                )}

                {plan.status === "Approved" ? (
                  <View style={s.approvedBanner}>
                    <Text style={s.approvedText}>✓ Approved — Agents executing</Text>
                  </View>
                ) : (
                  <View style={s.actions}>
                    <TouchableOpacity onPress={() => approvePlan(plan)} style={[s.actionBtn, { backgroundColor: COLORS.green+"18", borderColor: COLORS.green+"33" }]}>
                      <Text style={{ color: COLORS.green, fontSize:12, fontWeight:"700" }}>✓ Approve & Execute</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => rejectPlan(plan)} style={[s.actionBtn, { backgroundColor: COLORS.red+"18", borderColor: COLORS.red+"33" }]}>
                      <Text style={{ color: COLORS.red, fontSize:12, fontWeight:"700" }}>✕ Skip</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
        }
      </ScrollView>

      {showForm && <PlanForm onSave={addPlan} onClose={() => setShowForm(false)} />}
    </View>
  );
}

const s = StyleSheet.create({
  topRow: { flexDirection:"row", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 },
  title: { fontSize:20, fontWeight:"700", color:"white" },
  sub: { fontSize:12, color: COLORS.muted, marginTop:4 },
  addBtn: { backgroundColor: COLORS.amber+"22", borderColor: COLORS.amber+"44", borderWidth:1, borderRadius:10, width:40, height:40, alignItems:"center", justifyContent:"center" },
  protocol: { backgroundColor: COLORS.surface, borderRadius:12, padding:12, marginBottom:16, borderWidth:1, borderColor: COLORS.amber+"22" },
  protocolText: { fontSize:11, color: COLORS.muted, lineHeight:16 },
  card: { backgroundColor: COLORS.card, borderRadius:14, padding:14, marginBottom:12, borderWidth:1, borderColor: COLORS.amber+"33" },
  cardTop: { flexDirection:"row", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, gap:10 },
  planTitle: { fontSize:13, fontWeight:"700", color:"white", flex:1 },
  commission: { fontSize:14, fontWeight:"700", color: COLORS.green },
  reasoning: { fontSize:12, color: COLORS.muted, lineHeight:18, marginBottom:10 },
  steps: { gap:4, marginBottom:10 },
  step: { fontSize:11, color: "#64748b", lineHeight:18 },
  agentTags: { flexDirection:"row", flexWrap:"wrap", gap:6, marginBottom:12 },
  agentTag: { backgroundColor: COLORS.amber+"18", borderColor: COLORS.amber+"33", borderWidth:1, borderRadius:99, paddingHorizontal:8, paddingVertical:3 },
  agentTagText: { color: COLORS.amber, fontSize:10 },
  approvedBanner: { backgroundColor: COLORS.green+"11", borderRadius:8, paddingVertical:8, alignItems:"center" },
  approvedText: { color: COLORS.green, fontSize:11, fontWeight:"600" },
  actions: { flexDirection:"row", gap:8 },
  actionBtn: { flex:1, borderWidth:1, borderRadius:8, paddingVertical:8, alignItems:"center" },
});
