import * as crypto from 'crypto';

export interface EncryptionConfig {
  algorithm: string;
  key: Buffer;
  iv: Buffer;
}

export function createEncryptionConfig(): EncryptionConfig {
  return {
    algorithm: 'aes-256-gcm',
    key: crypto.randomBytes(32),
    iv: crypto.randomBytes(16)
  };
}

export function encrypt(data: string, config: EncryptionConfig): { encryptedData: string; tag: Buffer } {
  const cipher = crypto.createCipheriv(config.algorithm, config.key, config.iv) as crypto.CipherGCM;
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    encryptedData: encrypted,
    tag: cipher.getAuthTag()
  };
}

export function decrypt(encryptedData: string, tag: Buffer, config: EncryptionConfig): string {
  const decipher = crypto.createDecipheriv(config.algorithm, config.key, config.iv) as crypto.DecipherGCM;
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
