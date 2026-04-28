# Missing You: Product Guide for Users

Missing You is a calm, private-first space to write memories for people you love and miss.

Your full writing stays off-chain.  
Only a cryptographic proof is anchored on-chain so authenticity can be verified later.

---

## What You Can Do

- Write personal memories in a clean, gentle editor
- Keep entries private or choose to share publicly
- Anchor proof on-chain (without revealing your full content)
- Verify that a shared memory has not been changed
- Use the product in English or Traditional Chinese

---

## Quick Start (1 minute)

1. Sign in with email
2. Write a memory
3. Save it as draft
4. Optionally anchor to blockchain
5. Optionally share with a public link

---

## Visual User Flow

```text
Sign in with email
  -> Write memory
  -> Save full content off-chain
  -> [Optional] Anchor proof on-chain
     -> Create canonical payload + hash
     -> Submit proof to MemoryRegistry
     -> Save tx metadata off-chain
  -> Choose visibility
     -> Private: owner-only
     -> Shareable: public memory page
  -> Anyone with link can verify proof details
```

---

## A Vivid User Journey

Imagine Mei, who wants to preserve a memory of her grandfather:

1. Mei signs in with her email.
2. She writes a heartfelt memory and saves it.
3. The story itself stays private in the app database.
4. Mei chooses to anchor proof on-chain.
5. The app creates a stable digital fingerprint (hash), not the story text.
6. Mei receives a transaction record proving that this memory existed at that time.
7. Weeks later, she toggles sharing on and sends the public link to family.
8. Family members can view the shared page and verify authenticity without seeing private drafts.

Result: emotional writing remains private, while trust is publicly verifiable.

---

## Privacy and Trust (Simple Explanation)

- **Private by default**: your memory content is off-chain.
- **Proof on-chain only**: memory ID + hash + metadata, never full text.
- **Share when ready**: visibility can be changed by owner.
- **Verification built-in**: people can confirm the memory matches anchored proof.

---

## Key Screens

- **Write**: create memories
- **Memories**: your list/dashboard
- **Journal Detail**: owner controls, anchoring, visibility
- **Public Memory Page**: shared content + verification details
- **Settings**: account and future wallet-linking area

---

## Frequently Asked Questions

### Is my full diary content on blockchain?
No. Full content stays off-chain in the database.

### What goes on-chain?
Proof metadata only (memory key + content hash + owner/timestamp/shareable state).

### Can I make a memory private again?
Yes. Visibility can be toggled by the owner.

### Can people verify shared memories?
Yes. Shared pages include proof details for verification.

---

## Product Promise

Missing You is built for emotional clarity and digital trust:

- gentle writing experience
- practical privacy
- verifiable authenticity

