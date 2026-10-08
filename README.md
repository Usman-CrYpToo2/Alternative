# Alternative

Username-addressed ETH transfers. Users register a unique handle bound to their address, then send ETH with an attached message by handle instead of by address. Both parties can query their sent and received history.

> [!WARNING]
> Testnet deployment of educational code. Unaudited, with known issues documented under [Security](#security).

## Deployments

| Network | Component | Location |
|---|---|---|
| Sepolia | Contract (`chai`) | [`0xB3562D85B52dA58008b09d050BC45A0fEe79534d`](https://sepolia.etherscan.io/address/0xB3562D85B52dA58008b09d050BC45A0fEe79534d) |
| | Frontend | [usman-alternative.netlify.app](https://usman-alternative.netlify.app) |

## Architecture

The contract maintains two mappings for the handle registry (`address → name`, `name → address`) and two per-address arrays of payment records (received and sent).

| Function | Behaviour |
|---|---|
| `login(name)` | Binds `name` to `msg.sender`. One handle per address; each handle is unique. |
| `send(name, message)` | Resolves `name`, forwards `msg.value`, and appends a record to the sender's and recipient's histories. |
| `callData()` | Returns the caller's received and sent records. |

The frontend is a React application using ethers.js v5 against MetaMask.

## Repository Structure

| Path | Contents |
|---|---|
| [`contracts/message.sol`](contracts/message.sol) | Contract source, not modified since deployment |
| [`scripts/final.js`](scripts/final.js) | Hardhat deployment script |
| [`frontend/`](frontend) | React application |
| [`netlify.toml`](netlify.toml) | Frontend build configuration |

## Usage

Frontend, against the existing Sepolia deployment:

```bash
cd frontend
npm install
npm start
```

Deploying a new instance:

```bash
npm install
cp .env.example .env   # Alchemy key and deployer private key
npx hardhat run scripts/final.js --network sepolia
```

Update the address in `frontend/src/App.js` after deploying.

## Security

Self-review of the deployed contract. Findings are acknowledged and left unfixed so the source continues to match the deployment.

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

## License

MIT, see [`LICENSE`](LICENSE).
