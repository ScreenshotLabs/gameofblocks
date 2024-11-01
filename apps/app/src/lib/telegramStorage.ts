import crypto from "crypto";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const TELEGRAM_CONFIG = {
  apiId: process.env.NEXT_PUBLIC_TELEGRAM_API_ID ?? "",
  apiHash: process.env.NEXT_PUBLIC_TELEGRAM_API_HASH ?? "",
  encryptionKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "", // Clé de 32 bytes en hex
};

export class TelegramKeyStorage {
  private client: TelegramClient | null = null;
  private session: StringSession;

  constructor() {
    this.session = new StringSession("");
  }

  private encrypt(data: string): {
    iv: string;
    encrypted: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-256-gcm",
      Buffer.from(TELEGRAM_CONFIG.encryptionKey, "hex"),
      iv,
    );

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    return {
      iv: iv.toString("hex"),
      encrypted,
      authTag: authTag.toString("hex"),
    };
  }

  private decrypt(encryptedData: {
    iv: string;
    encrypted: string;
    authTag: string;
  }): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(TELEGRAM_CONFIG.encryptionKey, "hex"),
      Buffer.from(encryptedData.iv, "hex"),
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));
    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  async initialize(): Promise<void> {
    if (this.client) return;

    this.client = new TelegramClient(
      this.session,
      TELEGRAM_CONFIG.apiId,
      TELEGRAM_CONFIG.apiHash,
      { connectionRetries: 3 },
    );

    // La connexion est gérée par une page d'authentification séparée
    const sessionString = localStorage.getItem("telegramSession");
    if (sessionString) {
      this.session = new StringSession(sessionString);
      await this.client.start({
        onError: (err) => console.error("Telegram client error:", err),
      });
    }
  }

  async savePrivateKey(privateKey: string): Promise<void> {
    if (!this.client) {
      throw new Error("Telegram client not initialized");
    }

    const encryptedData = this.encrypt(privateKey);
    const message = JSON.stringify({
      type: "wallet_private_key",
      data: encryptedData,
      timestamp: new Date().toISOString(),
    });

    await this.client.sendMessage("me", {
      message: `#wallet_key\n${message}`,
    });
  }

  async getPrivateKey(): Promise<string | null> {
    if (!this.client) {
      throw new Error("Telegram client not initialized");
    }

    const messages = await this.client.getMessages("me", {
      search: "#wallet_key",
      limit: 1,
    });

    if (!messages || messages.length === 0) {
      return null;
    }

    try {
      const message = messages[0].text.split("\n")[1];
      const { data } = JSON.parse(message);
      return this.decrypt(data);
    } catch (error) {
      console.error("Error retrieving private key:", error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }
}
