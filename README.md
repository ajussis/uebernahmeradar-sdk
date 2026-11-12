# uebernahmeradar-sdk

Minimal, zero-dependency Node.js client for the [Übernahme-Radar](https://uebernahmeradar.de) write API: create and manage watchlists and search alerts programmatically, from your own scripts or backend.

This is an unofficial, open-source convenience wrapper over the public REST API documented at [uebernahmeradar.de/api-docs](https://uebernahmeradar.de/api-docs) (interactive reference: `/api/v1/docs`, OpenAPI 3.1 spec: `/api/v1/openapi.json`). It has no dependencies beyond Node's built-in `fetch` (Node 18+) and wraps every **write** endpoint plus the matching list calls.

## Install

```bash
npm install uebernahmeradar-sdk
```

Or just copy `index.js` — it's one file with no dependencies.

## Get an API token

1. Sign in at [uebernahmeradar.de](https://uebernahmeradar.de) (a Pro/Platform/Enterprise plan is required for API access).
2. Go to **Einstellungen → API-Schlüssel** (`/app/settings/api-tokens`) and create a token. It looks like `bb_live_…` and is shown once.

## Usage

```js
import { UebernahmeRadarClient } from "uebernahmeradar-sdk";

const client = new UebernahmeRadarClient(process.env.UEBERNAHMERADAR_API_TOKEN);

// Watchlists
const watchlist = await client.createWatchlist({ name: "Q1 Pipeline", color: "#c2410c" });
await client.addWatchlistMember(watchlist.id, { announcementId: "…", note: "Erstkontakt geplant" });
const { items: watchlists } = await client.listWatchlists();

// Search alerts
const alert = await client.createAlert({
  name: "Maschinenbau NRW, IDEAL+",
  query: { sector: "manufacturing", bundesland: "nordrhein-westfalen" },
  minBand: "IDEAL",
  channels: ["email"],
});
await client.updateAlert(alert.id, { enabled: false });
await client.deleteAlert(alert.id);
```

Every method returns the parsed JSON body and throws an `ApiError` (`.status`, `.code`, `.message`) on a non-2xx response — including `403 quota_exceeded` when a plan's watchlist/alert quota is hit.

## Scope

Deliberately minimal: this covers the mutating endpoints (`POST`/`PATCH`/`DELETE`) and their list (`GET`) counterparts — not the full read-only dossier/search surface, which is better explored directly against the [OpenAPI spec](https://uebernahmeradar.de/api/v1/openapi.json) or the interactive docs.

## License

MIT — see [LICENSE](./LICENSE). Not an official Übernahme-Radar project; see [uebernahmeradar.de](https://uebernahmeradar.de) for the product itself.
