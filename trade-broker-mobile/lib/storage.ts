import AsyncStorage from "@react-native-async-storage/async-storage";

export const DB = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  async set(key: string, val: unknown): Promise<boolean> {
    try { await AsyncStorage.setItem(key, JSON.stringify(val)); return true; }
    catch { return false; }
  },
  async del(key: string): Promise<boolean> {
    try { await AsyncStorage.removeItem(key); return true; }
    catch { return false; }
  },
};
