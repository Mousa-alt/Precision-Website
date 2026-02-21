import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  // Verify the request is from Vercel Cron or an authenticated admin
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Allow if: valid cron secret, or valid admin session cookie
  const isFromCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isAdmin = request.cookies.get("precision-admin-session")?.value === "authenticated";

  if (!isFromCron && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("drive-photos", "max");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}

// Also support GET for Vercel Cron (cron jobs send GET requests)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("drive-photos", "max");

  return NextResponse.json({
    revalidated: true,
    timestamp: new Date().toISOString(),
  });
}
