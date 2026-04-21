# GTFS-RT viewer

Small web app that loads a binary **GTFS-realtime** feed (`FeedMessage` protobuf) from a **local file** or by **URL**, decodes it with the official GTFS-RT schema (via [`gtfs-realtime-bindings`](https://www.npmjs.com/package/gtfs-realtime-bindings)), and shows pretty-printed JSON in the browser. Nothing is proxied through this app’s server: file reads and `fetch()` happen in your browser.

**URL loading:** many public feeds do not send CORS headers, so the browser may block the response. In that case use a file download, a feed that allows your origin, or your own reverse proxy that adds `Access-Control-Allow-Origin`.

## Requirements

- Node.js 18+

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens the dev server (default port **5179**). Use **Choose file** for a local `.pb`, or paste a feed URL and click **Load URL** (Enter in the URL field works too).

## Production build

```bash
npm run build
npm run preview
```

Static files are written to `dist/`.

## Notes

- Input must be a valid **protobuf-encoded** `FeedMessage`, not JSON.
- Integer fields that map to `int64`/`uint64` appear as **strings** in JSON for safe round-tripping.
