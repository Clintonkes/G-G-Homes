
import { Property, User, Appointment, Payment, NotificationItem } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Start the backend service or set NEXT_PUBLIC_API_URL to your deployed backend URL.`);
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Request failed" }));
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
