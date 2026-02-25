import axios from "axios";

const COUNTRY_CONFIG: Record<string, { currency: string; category: string }> = {
  IN: { currency: "INA", category: "local" }, // India
  PK: { currency: "PAK", category: "local" }, // Pakistan
  BD: { currency: "BDT", category: "local" }, // Bangladesh
  SA: { currency: "SUA", category: "local" }, // Saudi Arabia
};

const DEFAULT_CONFIG = { currency: "RMB", category: "personal" };

export async function getLocationFromIP(ip: string) {
  try {
    const cleanIp = ip.replace("::ffff:", "").replace("::1", "127.0.0.1");

    // Skip localhost
    if (cleanIp === "127.0.0.1" || cleanIp.startsWith("192.168.")) {
      return DEFAULT_CONFIG;
    }

    const response = await axios.get(`http://ip-api.com/json/${cleanIp}`, {
      timeout: 2000,
    });

    if (response.data.status === "success") {
      return COUNTRY_CONFIG[response.data.countryCode] || DEFAULT_CONFIG;
    }

    return DEFAULT_CONFIG;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function getClientIP(req: any): string {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.ip ||
    "0.0.0.0"
  );
}
