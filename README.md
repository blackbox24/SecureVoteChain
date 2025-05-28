# SecureVoteChain - Decentralized Voting Application

SecureVoteChain is a blockchain-based voting application designed to provide secure, transparent, and decentralized election management. This system leverages the power of blockchain technology to ensure vote integrity and transparency in the electoral process.

![SecureVoteChain Logo](public/assets/images/secure-vote-chain-logo.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Usage Guide](#usage-guide)
  - [Electoral Commission Admin](#electoral-commission-admin)
  - [Voters](#voters)
- [Smart Contracts](#smart-contracts)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## Overview

SecureVoteChain is designed to modernize and secure the electoral process through blockchain technology. The application enables electoral commissions to create and manage elections, approve candidates, and verify voters. For voters, the platform provides a seamless way to participate in elections with full confidence that their votes are securely recorded and cannot be tampered with.

## Features

### For Electoral Commission (Administrators)

- **Election Management**: Create, configure, and manage election cycles
- **Candidate Management**: Register, approve, and manage election candidates
- **Voter Registration**: Register and verify eligible voters
- **Real-time Results**: Access and monitor election results in real-time
- **Dashboard Analytics**: View comprehensive statistics about voter turnout and participation

### For Voters

- **Secure Authentication**: Log in using Ethereum wallet addresses (MetaMask, etc.)
- **Voting Interface**: Easy-to-use interface for casting votes
- **Vote Verification**: Ability to verify that votes were recorded correctly
- **Real-time Results**: View election results once voting has concluded
- **Voter Dashboard**: Access personalized information and election status

## System Architecture

SecureVoteChain is built on a combination of blockchain technology and modern web development frameworks:

- **Frontend**: React.js with Redux for state management
- **Styling**: Tailwind CSS for responsive design
- **Blockchain Connectivity**: ThirdWeb SDK for connecting to Ethereum
- **Smart Contracts**: Solidity contracts for vote recording and verification
- **Authentication**: Wallet-based authentication through MetaMask or other Ethereum wallets

## Prerequisites

Before installing and running SecureVoteChain, ensure you have the following prerequisites:

1. **Node.js**: Version 16.x or higher
   - Download from [Node.js official website](https://nodejs.org/)

2. **Package Manager**: pnpm (recommended) or npm
   - Install pnpm: `npm install -g pnpm`

3. **Code Editor**: VS Code (recommended)
   - Download from [VS Code official website](https://code.visualstudio.com/)

4. **Ethereum Wallet**: MetaMask browser extension
   - Install from [MetaMask official website](https://metamask.io/)
   - Set up a wallet account

5. **Web Browser**: Chrome, Firefox, or Brave (with MetaMask installed)

## Installation and Setup

Follow these steps to get the SecureVoteChain application up and running on your local machine:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd secure-vote-chain
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Using npm:

```bash
npm install
```

### 3. Configure Environment

The project uses environment variables for configuration. For local development, you can use the default settings, but for production, you would configure these appropriately.

### 4. Start the Development Server

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

## Usage Guide

### Electoral Commission Admin

To access the Electoral Commission dashboard:

1. Navigate to the homepage
2. Click on "EC Login" in the navigation bar
3. Use the following credentials for demo purposes:
   - Username: `admin`
   - Password: `admin123`
4. Once logged in, you'll have access to:
   - Dashboard: Overview of election statistics
   - Election Management: Create and control election cycles
   - Candidate Management: Add, approve, and manage candidates
   - Voter Management: Register and verify voters
   - Results: View detailed election results

### Voters

To participate in an election as a voter:

1. Connect your MetaMask wallet by clicking on "Connect Wallet"
2. Ensure your wallet address is registered and verified by the Electoral Commission
3. Navigate to the voting page during an active election
4. Select your preferred candidate and submit your vote
5. Verify your vote was recorded correctly
6. View election results when available

## Smart Contracts

SecureVoteChain uses multiple smart contracts to manage the voting process:

- **VotingSystem.sol**: Main contract that manages the election lifecycle
- **VoterRegistry.sol**: Handles voter registration and verification
- **CandidateRegistry.sol**: Manages candidate registration and information
- **BallotSystem.sol**: Records votes and handles vote counting

These contracts are deployed on the Ethereum blockchain and interact with the frontend through the ThirdWeb SDK.

## Development

### Project Structure

```
secure-vote-chain/
├── contracts/           # Smart contracts
│   └── src/             # Contract source files
├── public/              # Public assets
│   └── assets/          # Images and other static files
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── pages/           # Page components
│   ├── redux/           # Redux store and slices
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
└── README.md            # Project documentation
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## Troubleshooting

### Wallet Connection Issues

- Ensure MetaMask is installed and unlocked
- Check that you're connected to the correct network
- Try refreshing the page and reconnecting

### Voting Problems

- Verify that the election is currently active
- Ensure your wallet address is registered and verified
- Check that you haven't already voted in the current election

### For Developers

- Run `pnpm lint` to check for code quality issues
- If encountering build errors, try clearing node_modules and reinstalling dependencies

---

© 2025 SecureVoteChain. All rights reserved.
