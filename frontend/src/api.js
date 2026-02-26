import { API_BASE_URL } from "./config.js";

const TOKEN_KEY = "seatflow_token";

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload.message || "Request failed";
    throw new Error(message);
  }

  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export const login = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

export const register = async ({ name, username, email, password, type }) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password, type }),
  });

  return handleResponse(response);
};

export const getMe = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export const getProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export const getSeats = async ({ date, userId }) => {
  const params = new URLSearchParams();
  if (date) {
    params.set("date", date);
  }

  const response = await fetch(`${API_BASE_URL}/api/seats?${params.toString()}`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
};

export const createBooking = async ({ seatId, date }) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ seatId, date }),
  });

  return handleResponse(response);
};

export const getBookings = async ({ date }) => {
  const params = new URLSearchParams();
  if (date) {
    params.set("date", date);
  }

  const response = await fetch(`${API_BASE_URL}/api/bookings?${params.toString()}`, {
    headers: authHeaders(),
  });

  return handleResponse(response);
};

export const deleteBooking = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleResponse(response);
};
