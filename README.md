# SolvBTC Stellar Interface

A modern web interface for interacting with SolvBTC on the Stellar network. This application provides a user-friendly way to deposit, withdraw, and manage SolvBTC tokens, which are Bitcoin-backed reserve tokens that enable Bitcoin's value to be used across multiple blockchains.

## 🌟 Features

- **Deposit & Withdraw**: Seamlessly deposit and withdraw SolvBTC tokens
- **Portfolio Management**: View and manage your SolvBTC holdings
- **Stellar Integration**: Built specifically for the Stellar network with testnet and mainnet support
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Wallet Integration**: Connect with Stellar wallets using Stellar Wallets Kit
- **Real-time Data**: Live updates of token balances and transaction status

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn package manager
- A Stellar wallet (for testing)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/solv-finance-dev/solv-interface-stellar.git
cd solv-interface-stellar
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL= xxx
NEXT_PUBLIC_VAULT_CONTRACT= xxx
NEXT_PUBLIC_EXPLORER_TX_URL=https://stellar.expert/explorer/testnet/tx/

NEXT_PUBLIC_GRAPHQL_URL=https://dev.sft-api.com/graphql
NEXT_PUBLIC_GRAPHQL_AUTH=solv-app-dev
```

4. Start the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

## Deploy on Vercel

### Portfolio (`/portfolio`)

- **My Redemption**: View and manage redemption requests
- **Transaction History**: Track all your SolvBTC transactions

### SolvBTC Jupiter (`/solvbtc-jupiter`)

- **Jupiter Integration**: Advanced trading and liquidity features

## ⚙️ Configuration

### Network Configuration

The application supports both Stellar testnet and mainnet:

- **Testnet**: Default configuration for development and testing
- **Mainnet**: Production configuration for live trading

Switch networks by updating the `NEXT_PUBLIC_STELLAR_NETWORK` environment variable.

### Contract Addresses

- **Vault Contract**: Manages SolvBTC token operations
- **Token Contract**: SolvBTC token implementation

## 🔧 Development

### Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint issues
yarn format       # Format code with Prettier
yarn format:check # Check code formatting
```

### Code Quality

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for commit message validation

## 🌐 Stellar Network Integration

### Supported Networks

- **Testnet**: `https://horizon-testnet.stellar.org`
- **Mainnet**: `https://horizon.stellar.org`

### Key Features

- Automatic network detection
- Transaction signing and submission
- Account balance queries
- Contract interaction
- Explorer integration

## 📚 Learn More

### About SolvBTC

SolvBTC is a universal Bitcoin reserve token that connects Bitcoin's value across multiple blockchains. It's backed 1:1 by a transparent reserve, allowing you to use Bitcoin in DeFi, CeFi, and TradFi markets.

### About Stellar

Stellar is an open network for storing and moving money. It enables fast, low-cost transactions and supports various assets and currencies.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 🆘 Support

For support and questions:

- Check the FAQ section in the application
- Review the documentation
- Open an issue on GitHub

---

Built with ❤️ by the Solv Protocol team
