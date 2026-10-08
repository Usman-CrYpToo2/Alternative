# Self-Review: Alternative

| | |
|---|---|
| Date | October 2026 |
| Commit reviewed | [`8ecefef`](https://github.com/Usman-CrYpToo2/Alternative-dapp/commit/8ecefef) |
| Scope | [`contracts/message.sol`](../contracts/message.sol), as deployed on Sepolia at [`0xB3562D85...79534d`](https://sepolia.etherscan.io/address/0xB3562D85B52dA58008b09d050BC45A0fEe79534d) |
| Method | Manual review |

This is a self-review, not an independent audit. Findings are acknowledged and left unfixed so the source continues to match the deployment.

## Summary

| Severity | Count |
|---|---|
| Medium | 2 |
| Low | 3 |
| Informational | 2 |

## Findings

| ID | Severity | Title |
|---|---|---|
| M-01 | Medium | `transfer` gas stipend prevents payments to contract wallets |
| M-02 | Medium | Handle registration can be front-run; handles are permanent |
| L-01 | Low | Empty string accepted as a handle |
| L-02 | Low | State updated after the external call |
| L-03 | Low | Unbounded history arrays |
| I-01 | Info | Messages are publicly readable from storage |
| I-02 | Info | `receiver` field holds the sender in recipient records |

**M-01.** `send` forwards ETH with `transfer`, which caps the callee at 2,300 gas. Smart contract wallets such as Safe exceed this in their `receive` path, so payments to them revert. *Recommendation:* use `call` with checks-effects-interactions.

**M-02.** `login` is first-come-first-served and visible in the mempool, so a pending registration can be front-run. There is no way to release or transfer a handle. *Recommendation:* commit-reveal registration and an explicit release path.

**L-01.** `login("")` satisfies both checks and binds the empty handle. *Recommendation:* require a non-empty name.

**L-02.** Records are written after the ETH transfer. This is safe only because `transfer` limits gas; replacing it with `call` without reordering introduces reentrancy. *Recommendation:* update state before the external call.

**L-03.** Each payment appends to two arrays that `callData` returns in full, so the call grows linearly and will eventually exceed RPC limits for active users. *Recommendation:* emit events and index history off-chain.

**I-01.** Records are stored in `private` mappings. `private` restricts access from other contracts only; all data is readable via `eth_getStorageAt`.

**I-02.** In the recipient's record, the field named `receiver` stores `msg.sender`. The data model should use distinct `from` and `to` fields.
