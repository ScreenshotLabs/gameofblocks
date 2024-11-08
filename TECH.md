# Technical Choice Document: Telegram Mini App

## Overview
This document outlines the technical architecture and key design decisions for the Telegram mini app. The app is a semi-onchain tap-to-earn game where each user action triggers a transaction, ensuring secure, streamlined interactions with a Starknet wallet. The focus is on user authentication, key management, and real-time UX updates.

---

### 1. User Authentication

To provide a secure, reusable authentication system that integrates with Telegram's user account structure, allowing seamless user re-entry with minimal setup.

#### Implementation
- **First-Time Launch**: 
  - When a user launches the mini app for the first time, a Starknet wallet keypair (public and private keys) is generated specifically for that user. 
  - The private key is immediately encrypted for security purposes, ensuring that even if data storage is compromised, unauthorized access to the wallet remains difficult.
  - The encrypted private key is stored using Telegram’s cloud storage, attached to the user’s Telegram account. This storage solution leverages Telegram’s secure environment, making it accessible only to the authorized Telegram user.
  
- **Subsequent Access**:
  - When the user launches the mini app in subsequent sessions, the app retrieves the encrypted private key from Telegram’s cloud storage.
  - The private key is decrypted locally within the mini app to provide the user with access to their Starknet wallet, ensuring a seamless experience by reusing the same wallet for all interactions.

This design ensures that users only need to authenticate once, while still providing secure, persistent access to their wallet across multiple sessions.

---

### 2. Key Management

The app leverages the Starknet wallet system for its blockchain interactions due to Starknet’s decentralized and secure transaction handling capabilities. Key management prioritizes security and usability:

- **Encryption Standards**: The private key is encrypted using AES-256 encryption, ensuring robust protection against unauthorized access.
- **Storage Protocol**: By storing the encrypted private key in Telegram’s cloud storage, we leverage Telegram’s security infrastructure, minimizing the risk of unauthorized access and ensuring the key is tightly coupled to the user's account.
- **Data Reusability**: On each user return, the app can access the stored key without additional user input, enabling secure, frictionless interactions.

This key management approach aligns with security best practices, ensuring that sensitive information remains protected while minimizing the complexity for users.

---

### 3. Real-Time Interaction and UX

To deliver a responsive user experience in the tap-to-earn game, the app implements optimistic updates and on-chain synchronization:

- **Optimistic Updates**: When a user taps to earn, the UI immediately reflects this action without waiting for on-chain confirmation. This reduces perceived latency, creating a smooth, engaging experience.
- **On-Chain Synchronization**: Each tap action is sent to Starknet, where it is recorded on-chain to ensure accuracy and consistency. The app periodically checks the on-chain state to synchronize the UI with the actual data.

This combination of optimistic UI updates and on-chain synchronization offers a balance between responsiveness and data integrity, ensuring a high-quality user experience.

---

### 4. Data Storage and Security

The app follows a hybrid data storage model to balance performance with security:

- **On-Chain Data**: Key game actions and transaction logs are recorded on the Starknet blockchain. This provides a verifiable, immutable record of user activity, reinforcing trust and transparency.
- **Off-Chain Data (Telegram Cloud Storage)**: Sensitive information, such as the encrypted private key, is stored in Telegram’s cloud storage. This approach minimizes data exposure while allowing necessary access for app functionality.

---

### 5. Development Tools and Frameworks

The following libraries, frameworks, and APIs are used to implement the mini app:

- **Starknet SDK**: Used for Starknet wallet creation, encryption, and transaction handling, enabling secure, decentralized interactions with the blockchain.
- **Telegram Bot API**: Integrates Telegram-specific functionalities like cloud storage, ensuring the private key remains accessible only to the rightful user.
- **React**: Provides the UI framework for building a responsive, interactive interface.
- **AES Encryption Library**: Handles the encryption of the private key before storage to ensure security against unauthorized access.

These tools were chosen for their compatibility with Telegram, security features, and performance capabilities, providing a secure and user-friendly experience.

---

### 6. Future Enhancements

Planned future features include:

- **Multi-Wallet Support**: Allow users to switch between multiple wallets if they choose to expand their on-chain interactions.
- **Expanded On-Chain Functionalities**: Introduce additional game features that utilize Starknet’s capabilities, enhancing the app’s decentralized aspects.
