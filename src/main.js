import {transit_realtime as tr} from 'gtfs-realtime-bindings';

const fileInput = document.getElementById('file-input');
const sourceLabelEl = document.getElementById('source-label');
const urlInput = document.getElementById('url-input');
const urlLoadBtn = document.getElementById('url-load');
const metaEl = document.getElementById('meta');
const errorEl = document.getElementById('error');
const jsonCode = document.getElementById('json-code');

const TO_JSON_OPTS = {
  'longs': String,
  'enums': String,
  'defaults': true,
  'arrays': true,
  'objects': true,
  'oneofs': true
};

const EMPTY_HINT =
  'Load a file or URL to see JSON here.';

function showError(msg) {
  errorEl.hidden = false;
  errorEl.textContent = msg;
}

function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = '';
}

function decodeBuffer(buf) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const message = tr.FeedMessage.decode(u8);
  return tr.FeedMessage.toObject(message, TO_JSON_OPTS);
}

function renderFeed(obj, sourceText) {
  sourceLabelEl.textContent = sourceText;
  const n = Array.isArray(obj.entity) ? obj.entity.length : 0;
  metaEl.hidden = false;
  metaEl.innerHTML = `Entities in feed: <strong>${n}</strong>`;
  jsonCode.textContent = JSON.stringify(obj, null, 2);
}

function decodeErrorMessage(err) {
  if (err instanceof Error) {
    return err.message;
  }
  return 'Decode failed: buffer is not a valid GTFS-RT FeedMessage.';
}

function loadFromArrayBuffer(buf, sourceText) {
  clearError();
  metaEl.hidden = true;
  try {
    const obj = decodeBuffer(buf);
    renderFeed(obj, sourceText);
  } catch (err) {
    showError(decodeErrorMessage(err));
    jsonCode.textContent = '';
    metaEl.hidden = true;
  }
}

function fetchErrorMessage(err, urlStr) {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return (
      'Request blocked or network error. This is often CORS: the feed server ' +
      'must send `Access-Control-Allow-Origin` so the browser can read the ' +
      'response. Try a local file or a proxy that adds CORS headers.'
    );
  }
  if (err instanceof Error) {
    return err.message;
  }
  return `Could not download ${urlStr}`;
}

async function loadFromUrl(rawUrl) {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    showError('Enter a URL.');
    return;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    showError('Invalid URL.');
    return;
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    showError('Only http: and https: URLs are allowed.');
    return;
  }

  clearError();
  metaEl.hidden = true;
  jsonCode.textContent = 'Downloading…';
  urlLoadBtn.disabled = true;

  try {
    const res = await fetch(parsed.href, {
      'method': 'GET',
      'headers': {
        'Accept': 'application/x-protobuf, application/octet-stream, */*'
      },
      'cache': 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim());
    }

    const buf = await res.arrayBuffer();
    const label = `URL: ${parsed.href}`;
    loadFromArrayBuffer(buf, label);
  } catch (err) {
    showError(fetchErrorMessage(err, parsed.href));
    jsonCode.textContent = '';
    metaEl.hidden = true;
  } finally {
    urlLoadBtn.disabled = false;
  }
}

fileInput.addEventListener('change', async ev => {
  const file = ev.target.files?.[0];
  clearError();
  metaEl.hidden = true;

  if (!file) {
    sourceLabelEl.textContent = 'No source';
    jsonCode.textContent = EMPTY_HINT;
    return;
  }

  try {
    const buf = await file.arrayBuffer();
    loadFromArrayBuffer(buf, `File: ${file.name}`);
  } catch (err) {
    showError(err instanceof Error ? err.message : 'Could not read file.');
    jsonCode.textContent = '';
    metaEl.hidden = true;
  }
});

urlLoadBtn.addEventListener('click', () => {
  loadFromUrl(urlInput.value);
});

urlInput.addEventListener('keydown', ev => {
  if (ev.key === 'Enter') {
    ev.preventDefault();
    loadFromUrl(urlInput.value);
  }
});
