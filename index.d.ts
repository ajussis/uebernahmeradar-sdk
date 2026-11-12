export declare class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message?: string);
}

export interface WatchlistInput {
  name: string;
  color?: string;
}

export interface AlertInput {
  name: string;
  query: Record<string, unknown>;
  minBand?: "IDEAL" | "STRONG" | "WEAK";
  channels?: ("email" | "slack" | "webhook")[];
  buyerProfileId?: string;
  enabled?: boolean;
}

export declare class UebernahmeRadarClient {
  constructor(apiToken: string, options?: { baseUrl?: string });

  listWatchlists(): Promise<{ items: unknown[] }>;
  createWatchlist(input: WatchlistInput): Promise<unknown>;
  addWatchlistMember(
    watchlistId: string,
    input: { announcementId: string; note?: string },
  ): Promise<{ ok: true }>;
  removeWatchlistMember(watchlistId: string, announcementId: string): Promise<{ ok: true }>;

  listAlerts(): Promise<{ items: unknown[] }>;
  createAlert(input: AlertInput): Promise<unknown>;
  updateAlert(alertId: string, patch: Partial<AlertInput>): Promise<unknown>;
  deleteAlert(alertId: string): Promise<{ ok: true }>;
}

export default UebernahmeRadarClient;
