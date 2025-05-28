# SecureVoteChain Deployment Guide

## Table of Contents

1. [Download and Extract Source Code](#1-download-and-extract-source-code)
2. [Local Development Setup](#2-local-development-setup)
3. [Configuration](#3-configuration)
4. [Building for Production](#4-building-for-production)
5. [Deployment Options](#5-deployment-options)
   - [Vercel](#vercel)
   - [Netlify](#netlify)
   - [GitHub Pages](#github-pages)
   - [AWS Amplify](#aws-amplify)
   - [Firebase Hosting](#firebase-hosting)
6. [Troubleshooting](#6-troubleshooting)
7. [Additional Resources](#7-additional-resources)

## 1. Download and Extract Source Code

The source code for SecureVoteChain is provided as a compressed file.

1. Download the zip file from the provided export directory.
2. Extract the contents using one of the following methods:

   **On Linux/Mac:**
   ```bash
   tar -xzf secure-vote-chain.tar.gz
   ```

   **On Windows:**
   Use a tool like 7-Zip, WinRAR, or Windows built-in extraction to extract the contents.

3. Once extracted, you'll have a directory called `SecureVoteChain` containing all the source code.

## 2. Local Development Setup

To set up the project for local development:

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 16.x or higher recommended).
2. Install a package manager like [npm](https://www.npmjs.com/) (comes with Node.js) or [pnpm](https://pnpm.io/).
3. Navigate to the project directory in your terminal:
   ```bash
   cd SecureVoteChain
   ```
4. Install all dependencies:
   ```bash
   npm install
   # OR if you prefer pnpm
   pnpm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   # OR if you prefer pnpm
   pnpm run dev
   ```
6. Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to access the application.

## 3. Configuration

### Environment Variables

The SecureVoteChain application may require certain environment variables for deployment. Create a `.env` file in the root of your project directory with the following variables:

```
# For ThirdWeb integration (if used)
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
VITE_THIRDWEB_SECRET_KEY=your_thirdweb_secret_key_here

# For blockchain network configuration
VITE_BLOCKCHAIN_RPC_URL=your_blockchain_rpc_url_here
```

### Configuring Smart Contracts

If you're using the blockchain functionality in production, you'll need to deploy your own smart contracts to an Ethereum network or testnet of your choice. Update the contract addresses in the application configuration accordingly.

## 4. Building for Production

To build the application for production deployment:

```bash
npm run build
# OR if you prefer pnpm
pnpm run build
```

This will create a `dist` directory containing the optimized production build of your application.

## 5. Deployment Options

Here are several options for deploying your application without any MGX watermark:

### Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy your app:
   ```bash
   vercel
   ```

3. Follow the prompts to complete your deployment.

### Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy your app:
   ```bash
   netlify deploy
   ```

3. Follow the prompts, and specify `dist` as your publish directory when asked.

### GitHub Pages

1. Create a GitHub repository for your project.

2. Add the following to your `vite.config.js`:
   ```javascript
export default defineConfig({
  // ... other configs
  base: '/your-repo-name/',  // Replace with your repository name
  plugins: [react()],
})
   ```

3. Create a deploy script in `package.json`:
   ```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "gh-pages -d dist"
}
   ```

4. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

5. Deploy:
   ```bash
   npm run build && npm run deploy
   ```

### AWS Amplify

1. Install AWS Amplify CLI:
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. Configure Amplify:
   ```bash
   amplify configure
   ```

3. Initialize Amplify in your project:
   ```bash
   amplify init
   ```

4. Add hosting:
   ```bash
   amplify add hosting
   ```

5. Deploy:
   ```bash
   amplify publish
   ```

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## 6. Troubleshooting

### Common Issues

- **Dependencies Installation Errors**
  
  Try clearing npm/pnpm cache:
  ```bash
  npm cache clean -f  # For npm
  pnpm store prune     # For pnpm
  ```

- **Build Errors**

  Make sure all dependencies are correctly installed and your environment variables are properly set.

- **Smart Contract Connectivity Issues**

  Verify your blockchain RPC URL and contract addresses in the configuration.

## 7. Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ThirdWeb Documentation](https://portal.thirdweb.com/)

