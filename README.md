# SafeNest: A Cardano-Powered Anti-Fraud Real Estate dApp

## 🚀 Overview

**SafeNest** is a Cardano smart contract solution built to prevent real estate fraud in Nigeria. It protects buyers by ensuring funds are only released after property inspection and legal verification. Inspired by real-life scams, SafeNest ensures transactions are transparent, professional, and safe.

> "Real estate is not plantain—you don’t just buy because it looks ripe."

## 🎯 Problem It Solves

1. Fake agents who disappear after payment.
2. No legal document verification.
3. No trusted inspection process.
4. No accountability or refund after fraud.

## ✅ Key Questions SafeNest Answers

* Have I verified this agent?
* Is there a property lawyer involved?
* Has the property been inspected professionally?

## 🧩 Solution Flow (MVP)

1. Agent lists property.
2. Buyer connects wallet and selects property.
3. Buyer chooses a lawyer and inspector (or uses defaults).
4. Buyer sends payment to escrow contract.
5. Lawyer and Inspector confirm the property.
6. Buyer signs off to release payment to agent.

All confirmations are enforced on-chain.

## 🔐 Smart Contract Logic

### EscrowDatum:

* `buyer`
* `agent`
* `lawyer`
* `inspector`
* `lawyer_confirmed`
* `inspector_confirmed`

### Redeemer:

* `ConfirmLawyer`
* `ConfirmInspector`
* `WithdrawToAgent`

### Security:

* Funds cannot be released unless both lawyer and inspector have signed.
* Buyer has the final sign-off.

## 🧪 Test Instructions

Tests simulate the 3 stages:

1. Lawyer signs → `ConfirmLawyer`
2. Inspector signs → `ConfirmInspector`
3. Buyer withdraws → `WithdrawToAgent`

## 🛠 Tech Stack

| Layer                | Tool                      |
| -------------------- | ------------------------- |
| Smart Contracts      | Aiken                     |
| Blockchain           | Cardano (Preview/Testnet) |
| Off-Chain (Optional) | Node.js or CLI            |
| Wallets              | Eternl               |


## 📜 License & Credits

Created by **Kehn Marv** — GitHub: [Kehn-Marv](https://github.com/Kehn-Marv)

If you’re reading this during a hackathon judging session — thank you 🙏🏽. This project was built to solve a painful real problem affecting thousands.

---

Stay safe. Use SafeNest. 🕊️
