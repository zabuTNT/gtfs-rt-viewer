# GTFS-RT viewer

Small web app that loads a binary **GTFS-realtime** feed (`FeedMessage` protobuf), decodes it with the official GTFS-RT schema (via [`gtfs-realtime-bindings`](https://www.npmjs.com/package/gtfs-realtime-bindings)), and shows pretty-printed JSON in the browser. Nothing is uploaded to a server; decoding runs locally.

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

Opens the dev server (default port **5179**). Use **Choose file** and pick your `.pb` feed.

## Production build

```bash
npm run build
npm run preview
```

Static files are written to `dist/`.

## Notes

- Input must be a valid **protobuf-encoded** `FeedMessage`, not JSON.
- Integer fields that map to `int64`/`uint64` appear as **strings** in JSON for safe round-tripping.
