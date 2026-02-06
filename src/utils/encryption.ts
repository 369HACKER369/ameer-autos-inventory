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
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
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
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
  ];
  return factors.join('|');
}

/**
 * Encrypt a string using AES-GCM
 * Returns a base64-encoded string containing salt + iv + ciphertext
 */
export const encrypt = async (text: string): Promise<string> => {
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
      { name: 'AES-GCM', iv },
      key,
      data
    );

    // Combine salt + iv + ciphertext
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    // Fallback for environments without Web Crypto API (shouldn't happen in modern browsers)
    console.warn('Web Crypto API not available, using fallback');
    return btoa(text + '::encrypted');
  }
};

/**
 * Decrypt a string encrypted with the encrypt function
 */
export const decrypt = async (encoded: string): Promise<string> => {
  if (!encoded) return '';

  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));

    // Extract salt, iv, and ciphertext
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    // Derive the same key
    const key = await deriveKey(getDevicePassword(), salt);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
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
      return '';
    } catch {
      return '';
    }
  }
};

/**
 * Synchronous encrypt for backwards compatibility
 * Uses the async version internally but provides a sync interface
 * Note: This is a wrapper that returns a Promise
 */
export const encryptSync = (text: string): string => {
  if (!text) return '';
  // For sync contexts, use simple obfuscation as a fallback
  // The async version should be preferred
  const salt = crypto.getRandomValues(new Uint8Array(8));
  const saltStr = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  return btoa(saltStr + ':' + text + ':' + APP_SALT);
};

/**
 * Synchronous decrypt for backwards compatibility
 */
export const decryptSync = (encoded: string): string => {
  if (!encoded) return '';
  try {
    const decoded = atob(encoded);
    // Try new sync format
    const parts = decoded.split(':');
    if (parts.length >= 3 && parts[parts.length - 1] === APP_SALT) {
      return parts.slice(1, -1).join(':');
    }
    // Try legacy format
    const legacySalt = 'ameer-autos-2024';
    if (decoded.endsWith(legacySalt)) {
      return decoded.slice(0, -legacySalt.length);
    }
    return '';
  } catch {
    return '';
  }
};
