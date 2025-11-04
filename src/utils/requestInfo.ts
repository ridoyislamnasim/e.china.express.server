import { Request } from "express";
import geoip from "geoip-lite";

interface DeviceInfo {
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
}

function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = { name: "", version: "" };
  if (ua.includes("chrome")) {
    browser.name = "Chrome";
    const matches = ua.match(/chrome\/(\d+\.\d+)/);
    browser.version = matches ? matches[1] : "";
  } else if (ua.includes("firefox")) {
    browser.name = "Firefox";
    const matches = ua.match(/firefox\/(\d+\.\d+)/);
    browser.version = matches ? matches[1] : "";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser.name = "Safari";
    const matches = ua.match(/version\/(\d+\.\d+)/);
    browser.version = matches ? matches[1] : "";
  } else if (ua.includes("edg")) {
    browser.name = "Edge";
    const matches = ua.match(/edg\/(\d+\.\d+)/);
    browser.version = matches ? matches[1] : "";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser.name = "Opera";
    const matches = ua.match(/(?:opera|opr)\/(\d+\.\d+)/);
    browser.version = matches ? matches[1] : "";
  }

  // OS detection
  let os = { name: "", version: "" };
  if (ua.includes("windows")) {
    os.name = "Windows";
    if (ua.includes("windows nt 10")) os.version = "10";
    else if (ua.includes("windows nt 6.3")) os.version = "8.1";
    else if (ua.includes("windows nt 6.2")) os.version = "8";
    else if (ua.includes("windows nt 6.1")) os.version = "7";
    else os.version = "";
  } else if (ua.includes("macintosh")) {
    os.name = "macOS";
    const matches = ua.match(/mac os x (\d+[._]\d+)/);
    os.version = matches ? matches[1].replace("_", ".") : "";
  } else if (ua.includes("linux")) {
    os.name = "Linux";
    os.version = "";
  } else if (ua.includes("android")) {
    os.name = "Android";
    const matches = ua.match(/android (\d+\.\d+)/);
    os.version = matches ? matches[1] : "";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os.name = "iOS";
    const matches = ua.match(/os (\d+[._]\d+)/);
    os.version = matches ? matches[1].replace("_", ".") : "";
  }

  return {
    browser,
    os
  };
}

export const getRequestInfo = (req: Request) => {
  // Get IP address with IPv6 handling
  const ip = (typeof req.headers["x-forwarded-for"] === "string" 
    ? req.headers["x-forwarded-for"].split(",")[0] 
    : Array.isArray(req.headers["x-forwarded-for"]) 
      ? req.headers["x-forwarded-for"][0] 
      : req.socket.remoteAddress || req.ip || "")
    .replace(/^.*:/, "");

  // Parse user agent
  const userAgent = req.headers["user-agent"] || "";
  const deviceInfo = parseUserAgent(userAgent);

  // Format device string like "Chrome 111.0.0"
  const browserString = deviceInfo.browser.name && deviceInfo.browser.version 
    ? `${deviceInfo.browser.name} ${deviceInfo.browser.version}`
    : "Unknown Browser";

  // Format OS string like "Windows 10"
  const osString = deviceInfo.os.name && deviceInfo.os.version
    ? `${deviceInfo.os.name} ${deviceInfo.os.version}`
    : "Unknown OS";

  const geoInfo = ip ? geoip.lookup(ip) : null;

  // Format date like "Monday, 20 March 2023"
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Format time like "11:31:10 pm"
  const timeString = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toLowerCase();

  console.log("========= Request Info =========");
  console.log("IP Address:", ip);
  console.log("Browser:", browserString);
  console.log("Operating System:", osString);
  console.log("Date:", dateString);
  console.log("Time:", timeString);
  console.log("Location:", geoInfo);


  return {
    ip,
    browser: browserString,    // Returns format: "Chrome 111.0.0"
    os: osString,             // Returns format: "Windows 10"
    rawUserAgent: userAgent,  // Original user agent string
    date: dateString,         // Returns format: "Monday, 20 March 2023"
    time: timeString,         // Returns format: "11:31:10 pm"
    location: geoInfo
  };
};
