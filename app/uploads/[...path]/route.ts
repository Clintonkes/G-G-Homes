import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error("Missing BACKEND_API_URL. Set it to your deployed backend base URL.");
  }
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  return normalized.endsWith("/api") ? normalized.slice(0, -4) : normalized;
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  const backendBaseUrl = getBackendBaseUrl();
  const upstreamUrl = `${backendBaseUrl}/uploads/${context.params.path.join("/")}${request.nextUrl.search}`;

  const response = await fetch(upstreamUrl, { cache: "no-store" });
  if (!response.ok) {
    return NextResponse.json({ detail: "Upload not found." }, { status: response.status });
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/octet-stream",
      "cache-control": "public, max-age=300",
    },
  });
}
