# SecureVoteChain - Source Code & Deployment Guide

## Contents

1. **secure-vote-chain.tar.gz** - Compressed archive containing the complete source code of the application
2. **DEPLOYMENT_GUIDE.md** - Comprehensive guide for setting up, configuring, and deploying the application

## Quick Start

1. Extract the source code:
   ```bash
   tar -xzf secure-vote-chain.tar.gz
   ```

2. Navigate to the extracted directory:
   ```bash
   cd SecureVoteChain
   ```

3. Install dependencies:
   ```bash
   npm install
   # OR
   pnpm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # OR
   pnpm run dev
   ```

5. Access the application at: http://localhost:5173

## Detailed Instructions

For comprehensive deployment instructions, including configuration options and deployment to platforms like Vercel, Netlify, GitHub Pages, AWS Amplify, and Firebase, please refer to the [Deployment Guide](./DEPLOYMENT_GUIDE.md).

## Admin Access

When running the application, you can access the Electoral Commission admin features using:
- Username: `admin`
- Password: `admin123`

## Features

- Fully functional election management system for the Electoral Commission
- Candidate management with real-time updates
- Voter registration and verification
- Secure voting interface for registered voters
- Real-time election results visualization
