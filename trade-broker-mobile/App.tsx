import React, { useContext } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProvider, AppContext } from "./lib/context";
import { COLORS } from "./lib/types";

import DashboardScreen    from "./screens/DashboardScreen";
import OpportunitiesScreen from "./screens/OpportunitiesScreen";
import NetworkScreen      from "./screens/NetworkScreen";
import MessagesScreen     from "./screens/MessagesScreen";
import MessageThreadScreen from "./screens/MessageThreadScreen";
import AgentsScreen       from "./screens/AgentsScreen";
import MoreScreen         from "./screens/MoreScreen";
import CEOScreen          from "./screens/CEOScreen";
import RevenueScreen      from "./screens/RevenueScreen";
import PipelineScreen     from "./screens/PipelineScreen";
import TendersScreen      from "./screens/TendersScreen";
import SettingsScreen     from "./screens/SettingsScreen";

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const tabIcon = (label: string, focused: boolean): string => {
  const icons: Record<string, [string, string]> = {
    Home:        ["🏠", "🏡"],
    Deals:       ["⭐", "✨"],
    Network:     ["👥", "👤"],
    Messages:    ["💬", "🗨️"],
    Agents:      ["🤖", "🤖"],
    More:        ["☰", "≡"],
  };
  return (icons[label] || ["●", "○"])[focused ? 0 : 1];
};

const stackOptions = {
  headerStyle: { backgroundColor: COLORS.sidebar },
  headerTintColor: "white",
  headerTitleStyle: { fontSize: 15, fontWeight: "700" as const },
  headerBackTitle: "",
};

function RootStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MessageThread" component={MessageThreadScreen}
        options={({ route }: any) => ({ title: route.params?.contact?.name || "Message Thread" })} />
      <Stack.Screen name="CEO"      component={CEOScreen}      options={{ title: "CEO Boardroom" }} />
      <Stack.Screen name="Revenue"  component={RevenueScreen}  options={{ title: "Revenue Forecast" }} />
      <Stack.Screen name="Pipeline" component={PipelineScreen} options={{ title: "Deal Pipeline" }} />
      <Stack.Screen name="Tenders"  component={TendersScreen}  options={{ title: "Tender Tracker" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{tabIcon(route.name, focused)}</Text>
        ),
        tabBarActiveTintColor:   COLORS.amber,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: { backgroundColor: COLORS.sidebar, borderTopColor: COLORS.border2, height: 64, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        headerStyle: { backgroundColor: COLORS.sidebar },
        headerTintColor: "white",
        headerTitleStyle: { fontSize: 15, fontWeight: "700" as const },
        headerRight: () => (
          <View style={{ flexDirection:"row", alignItems:"center", gap:6, marginRight:14 }}>
            <View style={{ width:6, height:6, borderRadius:3, backgroundColor: COLORS.green }} />
            <Text style={{ color: COLORS.muted, fontSize:10 }}>11 agents</Text>
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home"     component={DashboardScreen}     options={{ title: "Dashboard" }} />
      <Tab.Screen name="Deals"    component={OpportunitiesScreen} options={{ title: "Opportunities" }} />
      <Tab.Screen name="Network"  component={NetworkScreen}       options={{ title: "Network" }} />
      <Tab.Screen name="Messages" component={MessagesScreen}      options={{ title: "Messages" }} />
      <Tab.Screen name="Agents"   component={AgentsScreen}        options={{ title: "AI Agents" }} />
      <Tab.Screen name="More"     component={MoreScreen}          options={{ title: "More" }} />
    </Tab.Navigator>
  );
}

function AppShell() {
  const ctx = useContext(AppContext);
  if (!ctx.loaded) {
    return (
      <SafeAreaView style={styles.loading}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>OC</Text>
        </View>
        <ActivityIndicator color={COLORS.amber} size="large" style={{ marginTop: 24 }} />
        <Text style={styles.loadingText}>Loading your boardroom…</Text>
      </SafeAreaView>
    );
  }
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootStack />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" },
  logoBox: { width: 64, height: 64, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.amber },
  logoText: { fontSize: 22, fontWeight: "900", color: "black" },
  loadingText: { color: COLORS.muted, fontSize: 13, marginTop: 12 },
});
