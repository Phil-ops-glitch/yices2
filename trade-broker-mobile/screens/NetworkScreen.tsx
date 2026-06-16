import React, { useContext, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { AppContext } from "../lib/context";
import { EmptyState, Badge, StatusBadge, BottomModal, Field, Inp, Btn } from "../components/ui";
import { COLORS, Buyer, Supplier } from "../lib/types";

function BuyerForm({ initial, onSave, onClose }: { initial?: Buyer; onSave: (f: any) => void; onClose: () => void }) {
  const [f, setF] = useState({ name:"", country:"", industry:"", budget:"", status:"Cold", contact:"", notes:"", ...(initial || {}) });
  const set = (k: string) => (v: string) => setF(p => ({ ...p, [k]: v }));
  const valid = f.name.trim() && f.contact.trim();
  return (
    <BottomModal visible title={initial ? "Edit Buyer" : "Add Buyer"} onClose={onClose} accent={COLORS.cyan}>
      <View style={{ padding: 20 }}>
        <Field label="Company Name *"><Inp value={f.name} onChange={set("name")} placeholder="Meridian Group Ltd" /></Field>
        <View style={{ flexDirection:"row", gap:10 }}>
          <View style={{ flex:1 }}><Field label="Country"><Inp value={f.country} onChange={set("country")} placeholder="UAE" /></Field></View>
          <View style={{ flex:1 }}><Field label="Industry"><Inp value={f.industry} onChange={set("industry")} placeholder="Construction" /></Field></View>
        </View>
        <Field label="Contact Email *"><Inp value={f.contact} onChange={set("contact")} placeholder="ahmed@company.com" keyboardType="email-address" /></Field>
        <View style={{ flexDirection:"row", gap:10 }}>
          <View style={{ flex:1 }}><Field label="Budget Range"><Inp value={f.budget} onChange={set("budget")} placeholder="$1M–5M" /></Field></View>
          <View style={{ flex:1 }}>
            <Field label="Status">
              <View style={{ flexDirection:"row", gap:6 }}>
                {["Hot","Warm","Cold"].map(st => (
                  <TouchableOpacity key={st} onPress={() => set("status")(st)}
                    style={[s.pill, f.status === st && { backgroundColor: COLORS.cyan+"33", borderColor: COLORS.cyan }]}>
                    <Text style={[s.pillText, f.status === st && { color: COLORS.cyan }]}>{st}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>
          </View>
        </View>
        <Field label="Notes"><Inp value={f.notes} onChange={set("notes")} placeholder="Budget, timeline, requirements…" multiline /></Field>
        <View style={{ flexDirection:"row", gap:10, marginTop:8 }}>
          <Btn onPress={onClose} color={COLORS.muted} full>Cancel</Btn>
          <Btn onPress={() => valid && onSave(f)} color={COLORS.cyan} full disabled={!valid}>{initial ? "Save" : "Add Buyer"}</Btn>
        </View>
      </View>
    </BottomModal>
  );
}

function SupplierForm({ initial, onSave, onClose }: { initial?: Supplier; onSave: (f: any) => void; onClose: () => void }) {
  const [f, setF] = useState({ name:"", country:"", product:"", capacity:"", certified:false, contact:"", notes:"", ...(initial || {}) });
  const set = (k: string) => (v: any) => setF(p => ({ ...p, [k]: v }));
  const valid = f.name.trim() && f.contact.trim();
  return (
    <BottomModal visible title={initial ? "Edit Supplier" : "Add Supplier"} onClose={onClose} accent={COLORS.green}>
      <View style={{ padding: 20 }}>
        <Field label="Company Name *"><Inp value={f.name} onChange={set("name")} placeholder="Hangzhou Steel Works" /></Field>
        <View style={{ flexDirection:"row", gap:10 }}>
          <View style={{ flex:1 }}><Field label="Country"><Inp value={f.country} onChange={set("country")} placeholder="China" /></Field></View>
          <View style={{ flex:1 }}><Field label="Product"><Inp value={f.product} onChange={set("product")} placeholder="Steel & Metals" /></Field></View>
        </View>
        <Field label="Contact Email *"><Inp value={f.contact} onChange={set("contact")} placeholder="supplier@company.com" keyboardType="email-address" /></Field>
        <View style={{ flexDirection:"row", gap:10 }}>
          <View style={{ flex:1 }}><Field label="Capacity"><Inp value={f.capacity} onChange={set("capacity")} placeholder="50,000 MT/mo" /></Field></View>
          <View style={{ flex:1 }}>
            <Field label="Certified">
              <View style={{ flexDirection:"row", gap:6 }}>
                {["Yes","No"].map(opt => (
                  <TouchableOpacity key={opt} onPress={() => set("certified")(opt === "Yes")}
                    style={[s.pill, f.certified === (opt === "Yes") && { backgroundColor: COLORS.green+"33", borderColor: COLORS.green }]}>
                    <Text style={[s.pillText, f.certified === (opt === "Yes") && { color: COLORS.green }]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>
          </View>
        </View>
        <Field label="Notes"><Inp value={f.notes} onChange={set("notes")} placeholder="Certifications, lead times, MOQ…" multiline /></Field>
        <View style={{ flexDirection:"row", gap:10, marginTop:8 }}>
          <Btn onPress={onClose} color={COLORS.muted} full>Cancel</Btn>
          <Btn onPress={() => valid && onSave(f)} color={COLORS.green} full disabled={!valid}>{initial ? "Save" : "Add Supplier"}</Btn>
        </View>
      </View>
    </BottomModal>
  );
}

export default function NetworkScreen({ navigation }: { navigation: any }) {
  const ctx = useContext(AppContext);
  const [tab, setTab] = useState<"buyers"|"suppliers">("buyers");
  const [showBuyer, setShowBuyer] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [editBuyer, setEditBuyer] = useState<Buyer|null>(null);
  const [editSupplier, setEditSupplier] = useState<Supplier|null>(null);

  const addBuyer = async (f: any) => {
    await ctx.saveBuyers([...ctx.buyers, { ...f, id: Date.now(), lastContact: new Date().toISOString().slice(0,10) }]);
    setShowBuyer(false);
  };
  const updateBuyer = async (f: any) => {
    await ctx.saveBuyers(ctx.buyers.map(b => b.id === editBuyer!.id ? { ...editBuyer!, ...f } : b));
    setEditBuyer(null);
  };
  const deleteBuyer = async (id: number) => { await ctx.saveBuyers(ctx.buyers.filter(b => b.id !== id)); };

  const addSupplier = async (f: any) => {
    await ctx.saveSuppliers([...ctx.suppliers, { ...f, id: Date.now() }]);
    setShowSupplier(false);
  };
  const updateSupplier = async (f: any) => {
    await ctx.saveSuppliers(ctx.suppliers.map(s => s.id === editSupplier!.id ? { ...editSupplier!, ...f } : s));
    setEditSupplier(null);
  };
  const deleteSupplier = async (id: number) => { await ctx.saveSuppliers(ctx.suppliers.filter(s => s.id !== id)); };

  return (
    <View style={{ flex:1, backgroundColor: COLORS.bg }}>
      {/* Tab row */}
      <View style={s.tabRow}>
        {(["buyers","suppliers"] as const).map(t => (
          <TouchableOpacity key={t} onPress={() => setTab(t)}
            style={[s.tabBtn, tab === t && { borderBottomColor: tab === "buyers" ? COLORS.cyan : COLORS.green, borderBottomWidth: 2 }]}>
            <Text style={[s.tabText, tab === t && { color: tab === "buyers" ? COLORS.cyan : COLORS.green }]}>
              {t === "buyers" ? `Buyers (${ctx.buyers.length})` : `Suppliers (${ctx.suppliers.length})`}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => tab === "buyers" ? setShowBuyer(true) : setShowSupplier(true)}
          style={[s.addBtn, { backgroundColor: (tab === "buyers" ? COLORS.cyan : COLORS.green) + "22", borderColor: (tab === "buyers" ? COLORS.cyan : COLORS.green) + "44" }]}>
          <Text style={{ color: tab === "buyers" ? COLORS.cyan : COLORS.green, fontSize: 18, fontWeight: "700" }}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {tab === "buyers" && (
          ctx.buyers.length === 0
            ? <EmptyState icon="👥" title="No buyers yet" sub="Add your first buyer to build your network." action="Add Buyer" onAction={() => setShowBuyer(true)} />
            : ctx.buyers.map(b => (
                <View key={b.id} style={s.card}>
                  <View style={s.cardTop}>
                    <View style={s.avatar}><Text style={s.avatarText}>{b.name[0]}</Text></View>
                    <View style={{ flex:1 }}>
                      <Text style={s.name}>{b.name}</Text>
                      <Text style={s.sub}>{b.country} · {b.industry}</Text>
                    </View>
                    <StatusBadge status={b.status} />
                  </View>
                  {b.budget ? <Text style={s.detail}>Budget: <Text style={{ color:"white" }}>{b.budget}</Text></Text> : null}
                  {b.contact ? <Text style={s.detail}>✉ {b.contact}</Text> : null}
                  <View style={s.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate("MessageThread", { contact: { ...b, industry: b.industry } })} style={[s.actionBtn, { backgroundColor: COLORS.orange+"18", borderColor: COLORS.orange+"33" }]}>
                      <Text style={{ color: COLORS.orange, fontSize: 11, fontWeight:"600" }}>✦ Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEditBuyer(b)} style={s.iconBtn}>
                      <Text style={{ color: COLORS.dim, fontSize:13 }}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteBuyer(b.id)} style={[s.iconBtn, { backgroundColor: COLORS.red+"11" }]}>
                      <Text style={{ color: COLORS.red, fontSize:13 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
        )}

        {tab === "suppliers" && (
          ctx.suppliers.length === 0
            ? <EmptyState icon="🏭" title="No suppliers yet" sub="Add your first supplier to start your sourcing network." action="Add Supplier" onAction={() => setShowSupplier(true)} />
            : ctx.suppliers.map(sup => (
                <View key={sup.id} style={s.card}>
                  <View style={s.cardTop}>
                    <View style={[s.avatar, { backgroundColor: COLORS.green+"22" }]}><Text style={[s.avatarText, { color: COLORS.green }]}>{sup.name[0]}</Text></View>
                    <View style={{ flex:1 }}>
                      <Text style={s.name}>{sup.name}</Text>
                      <Text style={s.sub}>{sup.country} · {sup.product}</Text>
                    </View>
                    <Badge label={sup.certified ? "Certified" : "Unverified"} color={sup.certified ? COLORS.green : COLORS.amber} />
                  </View>
                  {sup.capacity ? <Text style={s.detail}>Capacity: <Text style={{ color:"white" }}>{sup.capacity}</Text></Text> : null}
                  {sup.contact ? <Text style={s.detail}>✉ {sup.contact}</Text> : null}
                  <View style={s.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate("MessageThread", { contact: { ...sup, industry: sup.product, status:"Active" } })} style={[s.actionBtn, { backgroundColor: COLORS.orange+"18", borderColor: COLORS.orange+"33" }]}>
                      <Text style={{ color: COLORS.orange, fontSize:11, fontWeight:"600" }}>✦ Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEditSupplier(sup)} style={s.iconBtn}>
                      <Text style={{ color: COLORS.dim, fontSize:13 }}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteSupplier(sup.id)} style={[s.iconBtn, { backgroundColor: COLORS.red+"11" }]}>
                      <Text style={{ color: COLORS.red, fontSize:13 }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
        )}
      </ScrollView>

      {showBuyer && <BuyerForm onSave={addBuyer} onClose={() => setShowBuyer(false)} />}
      {showSupplier && <SupplierForm onSave={addSupplier} onClose={() => setShowSupplier(false)} />}
      {editBuyer && <BuyerForm initial={editBuyer} onSave={updateBuyer} onClose={() => setEditBuyer(null)} />}
      {editSupplier && <SupplierForm initial={editSupplier} onSave={updateSupplier} onClose={() => setEditSupplier(null)} />}
    </View>
  );
}

const s = StyleSheet.create({
  tabRow: { flexDirection:"row", backgroundColor: COLORS.sidebar, borderBottomWidth:1, borderBottomColor: COLORS.border2, alignItems:"center", paddingHorizontal:12 },
  tabBtn: { flex:1, paddingVertical:14, alignItems:"center" },
  tabText: { fontSize:12, fontWeight:"600", color: COLORS.muted },
  addBtn: { width:36, height:36, borderRadius:10, borderWidth:1, alignItems:"center", justifyContent:"center", marginLeft:8 },
  card: { backgroundColor: COLORS.card, borderRadius:14, padding:14, marginBottom:10, borderWidth:1, borderColor: COLORS.border },
  cardTop: { flexDirection:"row", alignItems:"center", gap:10, marginBottom:8 },
  avatar: { width:38, height:38, borderRadius:19, backgroundColor:"#1e2433", alignItems:"center", justifyContent:"center" },
  avatarText: { color:"#94a3b8", fontWeight:"700", fontSize:14 },
  name: { fontSize:13, fontWeight:"700", color:"white" },
  sub: { fontSize:11, color: COLORS.muted, marginTop:2 },
  detail: { fontSize:11, color: COLORS.muted, marginBottom:4 },
  actions: { flexDirection:"row", gap:8, marginTop:8 },
  actionBtn: { flex:1, borderWidth:1, borderRadius:8, paddingVertical:7, alignItems:"center" },
  iconBtn: { width:32, height:32, borderRadius:8, backgroundColor: COLORS.surface, alignItems:"center", justifyContent:"center" },
  pill: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderWidth:1, borderRadius:99, paddingHorizontal:10, paddingVertical:5 },
  pillText: { fontSize:11, color: COLORS.dim },
});
