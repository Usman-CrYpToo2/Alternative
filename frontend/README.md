# Alternative frontend

React app for the Alternative dApp. It connects to MetaMask and talks to the contract on Sepolia with ethers.js v5.

```bash
npm install
npm start        # dev server on http://localhost:3000
npm run build    # production build into build/
```

The contract address is set in `src/App.js`, and the ABI lives in `src/Contract/contracts/message.sol/chai.json` (Hardhat writes it there when you compile). See the [main README](../README.md) for how the app works.
