# Project Summary
SecureVoteChain is a decentralized voting platform leveraging blockchain technology to enhance the integrity, transparency, and security of electoral processes. It empowers electoral commissions to manage elections, oversee candidate registrations, and analyze voting outcomes while providing a seamless voting experience for users. By facilitating secure digital voting, SecureVoteChain aims to increase electoral participation and trust in democratic processes across various organizational levels.

# Project Module Description
SecureVoteChain consists of several key functional modules:
- **Electoral Commission Management**: Allows officials to create, edit, and manage elections, oversee candidate registrations, and results.
- **Voter Interaction**: Provides voters with the ability to register, verify, and participate in elections, along with user-friendly access to election information.
- **Analytics Dashboard**: Offers real-time insights into election progress, voter turnout, and results, enhancing transparency and trust.
- **Voter Registration System**: A newly implemented system that allows voters to self-register, receive admin verification, and check their registration status.

# Directory Tree
```
react_template/
├── contracts/
│   ├── src/
│   │   ├── BallotSystem.sol
│   │   ├── CandidateRegistry.sol
│   │   ├── VoterRegistry.sol
│   │   └── VotingSystem.sol
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── ui/
│   │   │   ├── ElectionTimer.jsx
│   │   │   ├── Logo.jsx
│   │   │   └── VoteCard.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── ec/
│   │   │   ├── CandidateManagement.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ElectionManagement.jsx
│   │   │   ├── ElectionResults.jsx
│   │   │   └── VoterManagement.jsx
│   │   ├── voter/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── VotingPage.jsx
│   │   ├── VoterRegistration.jsx
│   │   ├── RegistrationPending.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── AdminLogin.jsx
│   ├── redux/
│   │   ├── electionSlice.js
│   │   └── store.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── ...
├── package.json
└── README.md
```

# File Description Inventory
- **BallotSystem.sol**: Manages ballot creation and the voting process.
- **CandidateRegistry.sol**: Handles candidate registration and management.
- **VoterRegistry.sol**: Manages voter registrations and verification.
- **VotingSystem.sol**: Orchestrates the overall voting process.
- **App.jsx**: Main application component for routing and state management, updated to include new registration routes.
- **AuthContext.jsx**: Manages user authentication and authorization, enhanced to support the new voter registration flow.
- **VoterRegistration.jsx**: A new component for voters to register themselves with personal information.
- **RegistrationPending.jsx**: A new component that informs voters that their registration is pending verification.
- **Login.jsx**: Updated to display registration status and options for unregistered voters.
- **VoterManagement.jsx**: Interface for managing voter data, improved to handle the new registration workflow.
- **electionSlice.js**: Redux slice managing election-related state and operations, updated to include voter registration functionality.
- **README.md**: Documentation for setting up and running the application.
- **DEPLOYMENT_GUIDE.md**: Instructions for deploying the application without MGX watermarks.

# Technology Stack
- **Frontend**: React, Vite, Redux, Tailwind CSS
- **Smart Contracts**: Solidity
- **Visualization**: Chart.js, react-chartjs-2

# Usage
1. Install dependencies:
   ```bash
   cd /data/chats/52x3t/workspace/react_template
   pnpm install
   ```
2. Build the project:
   ```bash
   pnpm run build
   ```
3. Lint the project:
   ```bash
   pnpm run lint
   ```
4. To deploy the application externally, download the source code package and follow the instructions in `DEPLOYMENT_GUIDE.md`.
