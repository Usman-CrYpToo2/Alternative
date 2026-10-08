# Alternative

A dApp for sending ETH to a **username** instead of a wallet address, with a short message attached. Built in 2023 as one of my first full-stack Ethereum projects.

**Live app:** [usman-alternative.netlify.app](https://usman-alternative.netlify.app) (Sepolia testnet, needs MetaMask)
**Contract:** [`0xB3562D85B52dA58008b09d050BC45A0fEe79534d`](https://sepolia.etherscan.io/address/0xB3562D85B52dA58008b09d050BC45A0fEe79534d) on Sepolia

## How it works

1. **Sign up.** Connect MetaMask and pick a username. The contract maps the username to your address, and your address back to the username. Each address gets one username, and each username can only be taken once.
2. **Send.** Enter a recipient's username, an amount of ETH, and a message. The contract looks up the recipient's address and forwards the ETH.
3. **History.** The contract records every payment for both sides, so each user can see what they received and what they sent, with the message, amount, and time.

## Project structure

| Path | What it is |
|---|---|
| [`contracts/message.sol`](contracts/message.sol) | The smart contract (`chai`) |
| [`scripts/final.js`](scripts/final.js) | Hardhat deploy script |
| [`frontend/`](frontend) | React app (ethers.js v5, Bootstrap) |
| [`netlify.toml`](netlify.toml) | Builds and deploys the frontend on Netlify |

## Running it locally

**Frontend** (talks to the contract already deployed on Sepolia):

```bash
cd frontend
npm install
npm start
```

**Deploying your own copy of the contract:**

```bash
npm install
cp .env.example .env    # fill in your Alchemy key and a test wallet's private key
npx hardhat run scripts/final.js --network sepolia
```

Then put the new address into `frontend/src/App.js`.

## Known limitations

Reviewing this 2023 code now, as a smart contract auditor, these are the issues I would report. The contract above is left exactly as deployed, so the repo matches what runs on Sepolia.

| Severity | Issue |
|---|---|
| Medium | **Smart contract wallets cannot receive.** `send` uses `transfer`, which forwards only 2,300 gas. Wallets like Safe need more, so payments to them revert. |
| Medium | **Usernames can be front-run and squatted.** Anyone watching the mempool can register a name first, and a name can never be released or changed. |
| Low | **An empty username can be registered.** `login("")` passes both checks and claims the empty name. |
| Low | **State is updated after sending ETH.** This is only safe because `transfer` limits gas. Switching to `call` without reordering would open a reentrancy bug. |
| Low | **History grows forever.** Each payment adds to two arrays that `callData` returns in full, so it gets slower and can eventually fail for very active users. |
| Info | **Messages are public.** `private` stops other contracts from reading the mappings, but anyone can read the data straight from chain storage. |
| Info | **Confusing data model.** In the recipient's history, the field named `receiver` actually holds the sender's address. |

A rewrite would use `call` with checks-effects-interactions, reject empty names, add a commit-reveal step for name registration, and emit events for history instead of storing it in arrays.

## License

MIT, see [LICENSE](LICENSE).
