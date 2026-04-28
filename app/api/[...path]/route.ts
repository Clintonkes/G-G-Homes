import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getBackendBaseUrl() {
  const raw = process.env.BACKEND_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    throw new Error("Missing BACKEND_API_URL. Set it to your deployed backend base URL.");
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function copyResponseHeaders(source: Headers) {
  const headers = new Headers();
  for (const [key, value] of source.entries()) {
    const normalized = key.toLowerCase();
    if (normalized === "content-encoding") continue;
    if (normalized === "transfer-encoding") continue;
    headers.set(key, value);
  }
  return headers;
}

async function proxy(request: NextRequest, params: { path: string[] }) {
  const backendBaseUrl = getBackendBaseUrl();
  const upstreamPath = params.path.join("/");
  const upstreamUrl = `${backendBaseUrl}/api/${upstreamPath}${request.nextUrl.search}`;

  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (authorization) headers.set("authorization", authorization);
  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

  let response: Response;
  try {
    response = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Backend proxy fetch failed", {
      upstreamUrl,
      method,
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { detail: "Backend service is unreachable from the frontend proxy." },
      { status: 502 },
    );
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: copyResponseHeaders(response.headers),
  });
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function PATCH(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
