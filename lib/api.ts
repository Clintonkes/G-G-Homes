import { Property, User, Appointment, Payment, NotificationItem } from "@/lib/types";

function getAppOrigin() {
  if (typeof window !== "undefined") return "";

  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.RAILWAY_PUBLIC_DOMAIN?.trim() || "http://localhost:3000";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${getAppOrigin()}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    console.error("API proxy request failed", {
      path,
      method: init.method ?? "GET",
      message: error instanceof Error ? error.message : String(error),
    });
    throw new Error("Cannot reach the API proxy. Confirm the frontend service is deployed with BACKEND_API_URL pointing to the live backend.");
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Request failed" }));
    console.error("API responded with an error", {
      path,
      method: init.method ?? "GET",
      status: response.status,
      detail: payload.detail ?? "Request failed",
    });
    throw new Error(payload.detail ?? "Request failed");
  }
  return response.json();
}

export async function fetchProperties(params = "") {
  return request<{ items: Property[]; total: number; page: number; page_size: number }>(`/api/properties${params}`);
}

export async function fetchProperty(id: string, token?: string | null) {
  return request<Property>(`/api/properties/${id}`, {}, token);
}

export async function login(email: string, password: string) {
  return request<{ access_token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: Record<string, unknown>) {
  return request<{ access_token: string; user: User }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(email: string) {
  return request<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function fetchMe(token: string) {
  return request<User>("/api/auth/me", {}, token);
}

export async function fetchAppointments(token: string) {
  return request<Appointment[]>("/api/appointments", {}, token);
}

export async function fetchPayments(token: string) {
  return request<Payment[]>("/api/payments", {}, token);
}

export async function fetchNotifications(token: string) {
  return request<NotificationItem[]>("/api/notifications", {}, token);
}

export async function fetchSaved(token: string) {
  return request<Array<{ id: string; property: Property }>>("/api/saved", {}, token);
}

export async function createAppointment(token: string, payload: Record<string, unknown>) {
  return request("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function createProperty(token: string, payload: Record<string, unknown>) {
  return request<Property>("/api/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function initializePayment(token: string, payload: Record<string, unknown>) {
  return request<{ checkout_url: string }>("/api/payments/initialize", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}
