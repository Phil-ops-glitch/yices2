import React, { createContext, useEffect, useState } from "react";
import { DB } from "./storage";
import { Opportunity, Buyer, Supplier, Alert, Plan, AppSettings } from "./types";

interface AppContextType {
  opportunities: Opportunity[];
  buyers: Buyer[];
  suppliers: Supplier[];
  alerts: Alert[];
  plans: Plan[];
  settings: AppSettings;
  saveOpportunities: (d: Opportunity[]) => Promise<void>;
  saveBuyers: (d: Buyer[]) => Promise<void>;
  saveSuppliers: (d: Supplier[]) => Promise<void>;
  saveAlerts: (d: Alert[]) => Promise<void>;
  savePlans: (d: Plan[]) => Promise<void>;
  saveSettings: (d: AppSettings) => Promise<void>;
  loaded: boolean;
}

const defaultSettings: AppSettings = {
  ownerName: "Commander",
  market: "",
  target: "",
  risk: "Medium",
  sources: "",
  signoff: "Trade Operations",
  apiKey: "",
};

export const AppContext = createContext<AppContextType>({
  opportunities: [], buyers: [], suppliers: [], alerts: [], plans: [],
  settings: defaultSettings,
  saveOpportunities: async () => {}, saveBuyers: async () => {}, saveSuppliers: async () => {},
  saveAlerts: async () => {}, savePlans: async () => {}, saveSettings: async () => {},
  loaded: false,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [buyers, setBuyers]               = useState<Buyer[]>([]);
  const [suppliers, setSuppliers]         = useState<Supplier[]>([]);
  const [alerts, setAlerts]               = useState<Alert[]>([]);
  const [plans, setPlans]                 = useState<Plan[]>([]);
  const [settings, setSettings]           = useState<AppSettings>(defaultSettings);
  const [loaded, setLoaded]               = useState(false);

  useEffect(() => {
    Promise.all([
      DB.get<Opportunity[]>("opportunities"),
      DB.get<Buyer[]>("buyers"),
      DB.get<Supplier[]>("suppliers"),
      DB.get<Alert[]>("alerts"),
      DB.get<Plan[]>("plans"),
      DB.get<AppSettings>("settings"),
    ]).then(([ops, buy, sup, alr, pln, cfg]) => {
      setOpportunities(ops || []);
      setBuyers(buy || []);
      setSuppliers(sup || []);
      setAlerts(alr || []);
      setPlans(pln || []);
      if (cfg) setSettings(cfg);
      setLoaded(true);
    });
  }, []);

  const saveOpportunities = async (d: Opportunity[]) => { setOpportunities(d); await DB.set("opportunities", d); };
  const saveBuyers        = async (d: Buyer[])       => { setBuyers(d);        await DB.set("buyers", d); };
  const saveSuppliers     = async (d: Supplier[])    => { setSuppliers(d);     await DB.set("suppliers", d); };
  const saveAlerts        = async (d: Alert[])       => { setAlerts(d);        await DB.set("alerts", d); };
  const savePlans         = async (d: Plan[])        => { setPlans(d);         await DB.set("plans", d); };
  const saveSettings      = async (d: AppSettings)   => { setSettings(d);      await DB.set("settings", d); };

  return (
    <AppContext.Provider value={{ opportunities, buyers, suppliers, alerts, plans, settings, saveOpportunities, saveBuyers, saveSuppliers, saveAlerts, savePlans, saveSettings, loaded }}>
      {children}
    </AppContext.Provider>
  );
}
