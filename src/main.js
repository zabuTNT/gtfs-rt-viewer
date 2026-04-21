import {transit_realtime as tr} from 'gtfs-realtime-bindings';

const fileInput = document.getElementById('file-input');
const fileNameEl = document.getElementById('file-name');
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

fileInput.addEventListener('change', async ev => {
  const file = ev.target.files?.[0];
  clearError();
  metaEl.hidden = true;

  if (!file) {
    fileNameEl.textContent = 'Nessun file';
    jsonCode.textContent = 'Carica un feed per vedere il JSON qui.';
    return;
  }

  fileNameEl.textContent = file.name;

  try {
    const buf = await file.arrayBuffer();
    const obj = decodeBuffer(buf);
    const n = Array.isArray(obj.entity) ? obj.entity.length : 0;
    metaEl.hidden = false;
    metaEl.innerHTML = `Entità nel feed: <strong>${n}</strong>`;
    jsonCode.textContent = JSON.stringify(obj, null, 2);
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : 'Decodifica non riuscita: il file non è un FeedMessage GTFS-RT valido.';
    showError(msg);
    jsonCode.textContent = '';
  }
});
