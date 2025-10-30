# ChainGuard AI

> AI-Powered Smart Contract Security Guardian built on Polygon

![ChainGuard AI](https://img.shields.io/badge/Built%20on-Polygon-8247E5?style=for-the-badge&logo=polygon)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## Overview

ChainGuard AI is an autonomous AI-powered smart contract security platform that provides real-time vulnerability detection and continuous monitoring for smart contracts on the Polygon network. We make enterprise-grade security accessible to every developer at a fraction of traditional audit costs.

**The Problem:** $3.8B lost annually to smart contract exploits. Traditional audits cost $50K+ and take weeks.

**Our Solution:** AI-powered security scans in seconds for $49/month. Real-time monitoring. Plain English recommendations.

## Key Features

### 🛡️ Pre-Deployment Shield
- Upload Solidity files or paste GitHub URLs
- AI analyzes code in 2-3 seconds
- Detects 50+ vulnerability types
- Plain English explanations
- Actionable fix recommendations

### 👁️ Live Guardian Mode (Pro)
- 24/7 contract monitoring
- Real-time threat detection
- Instant security alerts
- Anomaly detection
- Optional auto-pause functionality

### 🌐 Community Defense Network
- Network learns from every attack
- Instant protection updates for all users
- Collective security intelligence
- Zero-day threat sharing

### ⚡ Why Polygon?
- **Ultra-Low Fees:** $0.01 transactions vs. $50+ on Ethereum
- **Lightning Fast:** 2-second block times
- **Scalable:** Monitor thousands of contracts
- **EVM Compatible:** Works with existing tools

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Polygon network access

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/chainguard-ai
cd chainguard-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

### For Users

1. **Sign Up**: Create a free account (5 free scans included)
2. **Scan Contract**: Upload .sol file or paste GitHub URL
3. **Review Results**: Get instant security report with risk score
4. **Fix Issues**: Follow plain English recommendations
5. **Deploy Safely**: Re-scan to verify fixes

### For Pro Users

1. **Connect Wallet**: Link MetaMask to your account
2. **Upgrade**: Subscribe for $49/month in MATIC
3. **Monitor Contracts**: Add deployed contracts for 24/7 monitoring
4. **Get Alerts**: Receive real-time security notifications

## Architecture

### Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Blockchain:** Polygon (ethers.js v6)
- **AI/ML:** Pattern matching + behavioral analysis

### Database Schema
- **profiles:** User accounts and subscription tiers
- **contract_scans:** Scan history and results
- **monitored_contracts:** Live monitoring configurations
- **security_alerts:** Real-time threat notifications
- **payments:** Transaction records

## Pricing

### Free Tier
- 5 pre-deployment scans
- Basic vulnerability detection
- Plain English recommendations

### Pro - $49/month
- Unlimited scans
- Live monitoring (3 contracts)
- Real-time alerts
- Advanced AI detection

### Enterprise - Custom
- Unlimited everything
- Dedicated AI model
- Custom integrations
- 24/7 priority support

## Vulnerability Detection

ChainGuard AI detects:
- ✅ Reentrancy attacks
- ✅ Integer overflow/underflow
- ✅ Gas limit issues
- ✅ Access control flaws
- ✅ Timestamp dependence
- ✅ Delegate call risks
- ✅ Self-destruct vulnerabilities
- ✅ tx.origin authentication
- ✅ Unchecked external calls
- ✅ And 40+ more patterns

## Documentation

For comprehensive documentation, see [CHAINGUARD_AI_DOCUMENTATION.md](./CHAINGUARD_AI_DOCUMENTATION.md)

Topics covered:
- Complete feature guide
- How it works (technical deep dive)
- Business model
- User flows
- Security & privacy
- Competitive advantages
- Future roadmap

## Development

### Project Structure

```
chainguard-ai/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── Navbar.tsx
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── lib/              # Utilities and services
│   │   ├── supabase.ts
│   │   ├── web3.ts
│   │   └── vulnerabilityDetector.ts
│   ├── pages/            # Main application pages
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ScannerPage.tsx
│   │   └── WalletPage.tsx
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── supabase/            # Database migrations (future)
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
```

## Security

### Data Protection
- Row Level Security (RLS) on all database tables
- Users can only access their own data
- No storage of private keys or seed phrases
- Passwords hashed with bcrypt

### Blockchain Security
- Non-custodial wallet connection
- User approves all transactions
- Read-only contract monitoring
- Transparent on-chain operations

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Current (Q1 2024)
- [x] Core scanning engine
- [x] User authentication
- [x] Wallet connection
- [x] Free tier (5 scans)
- [x] Pro tier ($49/month)

### Next (Q2 2024)
- [ ] Live monitoring launch
- [ ] Real-time alerts
- [ ] Discord/Slack integration
- [ ] API access

### Future
- [ ] Neural network-based detection
- [ ] Multi-chain support
- [ ] CI/CD integration
- [ ] DAO governance token

## Support

- **Documentation:** [View Docs](./CHAINGUARD_AI_DOCUMENTATION.md)
- **Email:** support@chainguard.ai
- **Discord:** [Join Community](#)
- **Twitter:** [@ChainGuardAI](#)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com/)
- Deployed on [Polygon](https://polygon.technology/)
- UI components from [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Built with ❤️ for the Polygon community**

*Making smart contract security accessible to everyone*
