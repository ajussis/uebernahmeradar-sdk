// Minimal, zero-dependency client for the Übernahme-Radar REST API
// (https://uebernahmeradar.de/api-docs). Node 18+ (uses the global `fetch`).
//
// Covers the write endpoints — watchlists and search alerts — plus their
// list operations. Full reference / OpenAPI 3.1 spec:
//   https://uebernahmeradar.de/api/v1/docs
//   https://uebernahmeradar.de/api/v1/openapi.json

const DEFAULT_BASE_URL = "https://uebernahmeradar.de/api/v1";

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message || `Übernahme-Radar API error (${status}): ${code}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class UebernahmeRadarClient {
  /**
   * @param {string} apiToken Token created under /app/settings/api-tokens (starts "bb_live_").
   * @param {{baseUrl?: string}} [options]
   */
  constructor(apiToken, options = {}) {
    if (!apiToken) throw new Error("apiToken is required");
    this.apiToken = apiToken;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  async _request(method, path, body) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${this.apiToken}`,
        ...(body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = data?.error ?? {};
      throw new ApiError(res.status, err.code ?? "unknown", err.message);
    }
    return data;
  }

  // ---- Watchlists ----------------------------------------------------

  /** List this org's watchlists. */
  listWatchlists() {
    return this._request("GET", "/watchlists");
  }

  /** Create a watchlist. `color` is an optional 6-digit hex string. */
  createWatchlist({ name, color }) {
    return this._request("POST", "/watchlists", { name, color });
  }

  /** Add an announcement (lead) to a watchlist. */
  addWatchlistMember(watchlistId, { announcementId, note }) {
    return this._request("POST", `/watchlists/${watchlistId}/members`, { announcementId, note });
  }

  /** Remove an announcement from a watchlist. */
  removeWatchlistMember(watchlistId, announcementId) {
    return this._request("DELETE", `/watchlists/${watchlistId}/members/${announcementId}`);
  }

  // ---- Search alerts ---------------------------------------------------

  /** List this org's saved search alerts. */
  listAlerts() {
    return this._request("GET", "/alerts");
  }

  /**
   * Create a search alert.
   * @param {{name: string, query: object, minBand?: "IDEAL"|"STRONG"|"WEAK",
   *          channels?: ("email"|"slack"|"webhook")[], buyerProfileId?: string,
   *          enabled?: boolean}} alert
   */
  createAlert(alert) {
    return this._request("POST", "/alerts", alert);
  }

  /** Partially update an alert (any subset of createAlert's fields). */
  updateAlert(alertId, patch) {
    return this._request("PATCH", `/alerts/${alertId}`, patch);
  }

  /** Delete a search alert. */
  deleteAlert(alertId) {
    return this._request("DELETE", `/alerts/${alertId}`);
  }
}

export default UebernahmeRadarClient;
