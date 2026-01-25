/**
 * Simple encryption/decryption for local storage data
 * Note: For a production app, use a more secure method like Web Crypto API
 * with a user-provided password. For this offline-first app, we'll use
 * a simple base64-based obfuscation as a placeholder for "encryption".
 */

const SECRET_SALT = 'ameer-autos-2024';

/**
 * Encrypt a string
 */
export const encrypt = (text: string): string => {
  if (!text) return '';

  // Simple obfuscation for local storage
  const encoded = btoa(text + SECRET_SALT);
  return encoded;
};

/**
 * Decrypt a string
 */
export const decrypt = (encoded: string): string => {
  if (!encoded) return '';

  try {
    const decoded = atob(encoded);
    if (decoded.endsWith(SECRET_SALT)) {
      return decoded.slice(0, -SECRET_SALT.length);
    }
    return decoded;
  } catch (e) {
    console.error('Failed to decrypt:', e);
    return '';
  }
};
