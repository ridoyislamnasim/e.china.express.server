import crypto from "crypto";

export function generateOTP(digits: number = 6): string {
  const max = 10 ** digits;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(digits, "0");
}

export function hashOTP(otp: string, secret: string = ""): string {
  return crypto.createHmac("sha256", secret).update(otp).digest("hex");
}
