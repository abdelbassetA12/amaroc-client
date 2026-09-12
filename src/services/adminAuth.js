import API_BASE from "../config/api";

const adminAuth = {
  async register(data) {
    const response = await fetch(
      `${API_BASE}/api/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to create admin account"
      );
    }

    return result;
  },

  async login(data) {
    const response = await fetch(
      `${API_BASE}/api/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Invalid email or password"
      );
    }

    return result;
  },

  async logout() {
    const response = await fetch(
      `${API_BASE}/api/auth/logout`,
      {
        method: "POST",

        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Logout failed"
      );
    }

    return result;
  },

  async getCurrentAdmin() {
    const response = await fetch(
      `${API_BASE}/api/auth/me`,
      {
        method: "GET",

        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Authentication required"
      );
    }

    return result;
  },
};

export default adminAuth;