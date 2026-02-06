/**
 * Secure encryption/decryption using Web Crypto API
 * Uses AES-GCM for authenticated encryption with PBKDF2 key derivation
 */

// Application-level salt for key derivation (not a secret, just adds uniqueness)
const APP_SALT = 'ameer-autos-encryption-v2';
const ITERATIONS = 100000;
const KEY_LENGTH = 256;

/**
 * Derive a cryptographic key from a password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a device-specific password for encryption
 * Uses a combination of factors to create a consistent key per device
 */
function getDevicePassword(): string {
  // Use a combination of stable browser/device properties
  const factors = [
    APP_SALT,
    typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    typeof navigator !== 'undefined' ? navigator.language : 'en',
    typeof screen !== 'undefined' ? screen.width.toString() : '1920',
    typeof screen !== 'undefined' ? screen.height.toString() : '1080',
    typeof screen !== 'undefined' ? screen.colorDepth.toString() : '24',
  ];
  return factors.join('|');
}

/**
 * Convert Uint8Array to base64 string
 */
function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}

/**
 * Encrypt a string using AES-GCM (async)
 * Returns a base64-encoded string containing salt + iv + ciphertext
 */
export const encryptAsync = async (text: string): Promise<string> => {
  if (!text) return '';

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key from device password
    const key = await deriveKey(getDevicePassword(), salt);

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      data
    );

    // Combine salt + iv + ciphertext
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encryptedArray, salt.length + iv.length);

    // Convert to base64 for storage
    return uint8ArrayToBase64(combined);
  } catch (error) {
    // Fallback for environments without Web Crypto API
    console.warn('Web Crypto API not available, using fallback');
    return btoa(text + '::encrypted');
  }
};

/**
 * Decrypt a string encrypted with the encryptAsync function (async)
 */
export const decryptAsync = async (encoded: string): Promise<string> => {
  if (!encoded) return '';

  try {
    // Decode from base64
    const combined = base64ToUint8Array(encoded);

    // Extract salt, iv, and ciphertext
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    // Derive the same key
    const key = await deriveKey(getDevicePassword(), salt);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as unknown as BufferSource },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    // Try legacy format (old base64 obfuscation)
    try {
      const decoded = atob(encoded);
      const legacySalt = 'ameer-autos-2024';
      if (decoded.endsWith(legacySalt)) {
        return decoded.slice(0, -legacySalt.length);
      }
      // Check fallback format
      if (decoded.endsWith('::encrypted')) {
        return decoded.slice(0, -11);
      }
      // Check sync format
      const parts = decoded.split(':');
      if (parts.length >= 3 && parts[parts.length - 1] === APP_SALT) {
        return parts.slice(1, -1).join(':');
      }
      return '';
    } catch {
      return '';
    }
  }
};

/**
 * Synchronous encrypt - simpler obfuscation for backwards compatibility
 * For stronger security, use encryptAsync
 */
export const encrypt = (text: string): string => {
  if (!text) return '';
  // Generate random prefix for some entropy
  const randomBytes = crypto.getRandomValues(new Uint8Array(8));
  const randomPrefix = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return btoa(randomPrefix + ':' + text + ':' + APP_SALT);
};

/**
 * Synchronous decrypt - handles both sync and legacy formats
 */
export const decrypt = (encoded: string): string => {
  if (!encoded) return '';
  try {
    const decoded = atob(encoded);
    
    // Try new sync format: randomHex:value:salt
    if (decoded.includes(':' + APP_SALT)) {
      const parts = decoded.split(':');
      if (parts.length >= 3 && parts[parts.length - 1] === APP_SALT) {
        // Remove first (random prefix) and last (salt) parts
        return parts.slice(1, -1).join(':');
      }
    }
    
    // Try legacy format
    const legacySalt = 'ameer-autos-2024';
    if (decoded.endsWith(legacySalt)) {
      return decoded.slice(0, -legacySalt.length);
    }
    
    // Try fallback format
    if (decoded.endsWith('::encrypted')) {
      return decoded.slice(0, -11);
    }
    
    return '';
  } catch {
    return '';
  }
};
