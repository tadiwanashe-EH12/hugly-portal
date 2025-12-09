/**
 * getClientIp
 * Safely extracts client IP from common headers for Next.js Route Handlers.
 * Use: const ip = getClientIp(req);
 */
import { NextRequest } from "next/server";

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  // Fallback to unknown when not available (local dev)
  return "unknown";
}
