import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  StyleSheet, Modal, ScrollView, ViewStyle, TextStyle,
} from "react-native";
import { COLORS } from "../lib/types";

// ── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color = COLORS.muted }: { label: string; color?: string }) {
  return (
    <View style={[s.badge, { backgroundColor: color + "22", borderColor: color + "44" }]}>
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    New: COLORS.blue, Evaluating: COLORS.amber, Active: COLORS.green,
    Closing: COLORS.violet, Hot: COLORS.red, Warm: COLORS.orange,
    Cold: COLORS.muted, Approved: COLORS.green,
  };
  return <Badge label={status} color={m[status] || COLORS.muted} />;
}

// ── METRIC CARD ───────────────────────────────────────────────────────────────
export function MetricCard({ label, value, sub, accent = COLORS.amber }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <View style={[s.metricCard, { borderColor: COLORS.border }]}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={[s.metricValue, { color: accent }]}>{value}</Text>
      {sub && <Text style={s.metricSub}>{sub}</Text>}
    </View>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, sub, action, onAction }: { icon: string; title: string; sub: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.emptyWrap}>
      <Text style={s.emptyIcon}>{icon}</Text>
      <Text style={s.emptyTitle}>{title}</Text>
      <Text style={s.emptySub}>{sub}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} style={s.emptyBtn}>
          <Text style={s.emptyBtnText}>+ {action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── BOTTOM SHEET MODAL ────────────────────────────────────────────────────────
export function BottomModal({ visible, onClose, title, accent = COLORS.amber, children }: {
  visible: boolean; onClose: () => void; title: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.modalOverlay}>
        <View style={[s.modalSheet, { borderColor: accent + "44" }]}>
          <View style={[s.modalHandle, { backgroundColor: accent + "44" }]} />
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.modalClose}>
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── FIELD + INPUT ─────────────────────────────────────────────────────────────
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function Inp({ value, onChange, placeholder, multiline, keyboardType, secureTextEntry }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  multiline?: boolean; keyboardType?: "default" | "email-address" | "numeric"; secureTextEntry?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={COLORS.muted}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      keyboardType={keyboardType || "default"}
      secureTextEntry={secureTextEntry}
      style={[s.input, multiline && { height: 80, textAlignVertical: "top" }]}
    />
  );
}

// ── BUTTON ────────────────────────────────────────────────────────────────────
export function Btn({ onPress, children, color = COLORS.amber, disabled, full, sm }: {
  onPress?: () => void; children: React.ReactNode; color?: string;
  disabled?: boolean; full?: boolean; sm?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        s.btn,
        { backgroundColor: color + "22", borderColor: color + "44" },
        full && { width: "100%" },
        sm && { paddingVertical: 6, paddingHorizontal: 12 },
        disabled && { opacity: 0.4 },
      ]}
    >
      {typeof children === "string"
        ? <Text style={[s.btnText, { color }, sm && { fontSize: 11 }]}>{children}</Text>
        : children}
    </TouchableOpacity>
  );
}

// ── AI LOADING ────────────────────────────────────────────────────────────────
export function AILoading({ color = COLORS.amber }: { color?: string }) {
  return (
    <View style={s.aiLoading}>
      <ActivityIndicator color={color} size="small" />
      <Text style={[s.aiLoadingText, { color }]}>AI thinking…</Text>
    </View>
  );
}

// ── SECTION HEADER ────────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction, color = COLORS.amber }: {
  title: string; action?: string; onAction?: () => void; color?: string;
}) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color, fontSize: 12 }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, borderWidth: 1, alignSelf: "flex-start" } as ViewStyle,
  badgeText: { fontSize: 10, fontWeight: "600" } as TextStyle,

  metricCard: { backgroundColor: COLORS.input, borderRadius: 12, padding: 14, borderWidth: 1, flex: 1 } as ViewStyle,
  metricLabel: { fontSize: 9, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 } as TextStyle,
  metricValue: { fontSize: 22, fontWeight: "700" } as TextStyle,
  metricSub: { fontSize: 10, color: COLORS.muted, marginTop: 2 } as TextStyle,

  emptyWrap: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 32, gap: 12 } as ViewStyle,
  emptyIcon: { fontSize: 40 } as TextStyle,
  emptyTitle: { fontSize: 14, fontWeight: "600", color: "#64748b", textAlign: "center" } as TextStyle,
  emptySub: { fontSize: 12, color: "#334155", textAlign: "center", lineHeight: 18 } as TextStyle,
  emptyBtn: { backgroundColor: COLORS.amber + "18", borderColor: COLORS.amber + "33", borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, marginTop: 4 } as ViewStyle,
  emptyBtnText: { color: COLORS.amber, fontSize: 12, fontWeight: "600" } as TextStyle,

  modalOverlay: { flex: 1, backgroundColor: "#000000cc", justifyContent: "flex-end" } as ViewStyle,
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, maxHeight: "90%", paddingBottom: 0 } as ViewStyle,
  modalHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginTop: 10, marginBottom: 4 } as ViewStyle,
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border } as ViewStyle,
  modalTitle: { fontSize: 14, fontWeight: "700", color: "white" } as TextStyle,
  modalClose: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.card, alignItems: "center", justifyContent: "center" } as ViewStyle,
  modalCloseText: { color: COLORS.dim, fontSize: 14 } as TextStyle,

  field: { marginBottom: 14 } as ViewStyle,
  fieldLabel: { fontSize: 9, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 } as TextStyle,
  input: { backgroundColor: COLORS.input, borderColor: COLORS.border, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: "white", fontSize: 13 } as TextStyle,

  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" } as ViewStyle,
  btnText: { fontSize: 13, fontWeight: "600" } as TextStyle,

  aiLoading: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, justifyContent: "center" } as ViewStyle,
  aiLoadingText: { fontSize: 12 } as TextStyle,

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } as ViewStyle,
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "white" } as TextStyle,
});
