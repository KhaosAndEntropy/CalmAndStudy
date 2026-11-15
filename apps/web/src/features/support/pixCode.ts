function emvField(id: string, value: string): string {
  const length = new TextEncoder().encode(value).length.toString().padStart(2, '0');
  if (length.length !== 2) throw new Error(`O campo Pix ${id} excede o limite do formato.`);
  return `${id}${length}${value}`;
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function normalizePixLabel(value: string, maxLength: number, label: string): string {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
  if (!normalized || normalized.length > maxLength || !/^[A-Z0-9 .&-]+$/.test(normalized)) {
    throw new Error(`${label} do Pix deve ter até ${maxLength} caracteres e não usar acentos.`);
  }
  return normalized;
}

/** Builds a static Pix EMV payload. The QR is generated locally in the browser. */
export function buildPixCode(key: string, merchantName: string, merchantCity: string): string {
  const pixKey = key.trim();
  if (!pixKey || new TextEncoder().encode(pixKey).length > 77) {
    throw new Error('A chave Pix está vazia ou excede o limite do formato.');
  }

  const name = normalizePixLabel(merchantName, 25, 'O nome');
  const city = normalizePixLabel(merchantCity, 15, 'A cidade');
  const merchantAccount = emvField('00', 'br.gov.bcb.pix') + emvField('01', pixKey);
  const additionalData = emvField('05', '***');
  const payload =
    emvField('00', '01') +
    emvField('01', '11') +
    emvField('26', merchantAccount) +
    emvField('52', '0000') +
    emvField('53', '986') +
    emvField('58', 'BR') +
    emvField('59', name) +
    emvField('60', city) +
    emvField('62', additionalData) +
    '6304';

  return `${payload}${crc16(payload)}`;
}
