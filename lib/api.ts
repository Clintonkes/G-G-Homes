import { Property, User, Appointment, Payment, NotificationItem } from "@/lib/types";

type RequestOptions = {
  silent?: boolean;
};

function getAppOrigin() {
  if (typeof window !== "undefined") return "";

  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.RAILWAY_PUBLIC_DOMAIN?.trim() || "http://localhost:3000";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

function getServerApiOrigin() {
  const raw = process.env.BACKEND_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return getAppOrigin();
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

async function request<T>(path: string, init: RequestInit = {}, token?: string | null, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = init.method ?? "GET";
  const inBrowser = typeof window !== "undefined";
  const origin = inBrowser ? getAppOrigin() : getServerApiOrigin();
  const fetchOptions: RequestInit & { next?: { revalidate?: number | false } } = {
    ...init,
    headers,
  };

  if (inBrowser) {
    fetchOptions.cache = "no-store";
  } else if (method === "GET" || method === "HEAD") {
    fetchOptions.next = { revalidate: 300 };
  } else {
    fetchOptions.cache = "no-store";
  }

  let response: Response;
  try {
    response = await fetch(`${origin}${path}`, fetchOptions);
  } catch (error) {
    if (!options.silent) {
      console.error("API proxy request failed", {
        path,
        method,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    throw new Error("Cannot reach the API proxy. Confirm the frontend service is deployed with BACKEND_API_URL pointing to the live backend.");
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Request failed" }));
    if (!options.silent) {
      console.error("API responded with an error", {
        path,
        method,
        status: response.status,
        detail: payload.detail ?? "Request failed",
      });
    }
    throw new Error(payload.detail ?? "Request failed");
  }
  return response.json();
}

export async function fetchProperties(params = "", options?: RequestOptions, token?: string | null) {
  return request<{ items: Property[]; total: number; page: number; page_size: number }>(`/api/properties${params}`, {}, token, options);
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

export async function updateMe(token: string, payload: Partial<User>) {
  return request<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token);
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

export async function markNotificationsRead(token: string, ids?: string[]) {
  return request<NotificationItem[]>("/api/notifications", {
    method: "PATCH",
    body: JSON.stringify(ids?.length ? { ids } : { mark_all: true }),
  }, token);
}

export async function fetchSaved(token: string) {
  return request<Array<{ id: string; property: Property }>>("/api/saved", {}, token);
}

export async function createAppointment(token: string, payload: Record<string, unknown>) {
  return request<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function updateAppointment(token: string, id: string, payload: Record<string, unknown>) {
  return request<Appointment>(`/api/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, token);
}

export async function createProperty(token: string, payload: Record<string, unknown>) {
  return request<Property>("/api/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function uploadAsset(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(payload.detail ?? "Upload failed");
  }

  return response.json() as Promise<{ url: string; uploaded_by: string }>;
}

export async function toggleOccupancy(token: string, id: string) {
  return request<import("@/lib/types").Property>(`/api/properties/${id}/occupancy`, { method: "PATCH" }, token);
}

export async function switchUserRole(token: string, role: "TENANT" | "LANDLORD") {
  return request<import("@/lib/types").User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify({ role }),
  }, token);
}

export async function deleteProperty(token: string, id: string): Promise<void> {
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`/api/properties/${id}`, {
    method: "DELETE",
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ detail: "Remove failed" }));
    throw new Error(payload.detail ?? "Remove failed");
  }
}

export async function initializePayment(token: string, payload: Record<string, unknown>) {
  return request<{ checkout_url: string }>("/api/payments/initialize", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}
