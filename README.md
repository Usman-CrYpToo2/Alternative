# Alternative

Username-addressed ETH transfers. Users register a unique handle bound to their address, then send ETH with an attached message by handle instead of by address. Both parties can query their sent and received history.

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

A self-review of the deployed contract found 7 issues (2 medium, 3 low, 2 informational). They are acknowledged and left unfixed so the source matches the deployment. See [`audits/2026-10-self-review.md`](audits/2026-10-self-review.md).

## Safety

Not audited by a third party. Provided as is, without warranty. The contract is deployed on Sepolia testnet only.

## License

MIT, see [`LICENSE`](LICENSE).
