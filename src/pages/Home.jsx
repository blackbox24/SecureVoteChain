// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { userInfo, login, address } = useAuth();
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20"
            src="/assets/images/voting-backdrop.jpg"
            alt="Voting backdrop"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80';
            }}
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">SecureVoteChain</h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            A decentralized blockchain voting platform that ensures secure, transparent, and tamper-proof elections.
            Your vote is your voice - we make sure it counts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {!address ? (
              <button
                onClick={login}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Connect Wallet
              </button>
            ) : userInfo?.isAdmin ? (
              <Link
                to="/ec/dashboard"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Electoral Commission Dashboard
              </Link>
            ) : (
              <Link
                to="/voter/dashboard"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Voter Dashboard
              </Link>
            )}
            <Link
              to="/voter/results"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Election Results
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Blockchain Powered</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Why Choose SecureVoteChain?
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our platform combines the security of blockchain technology with an intuitive user experience.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white shadow-lg rounded-lg px-6 py-8 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Secure & Immutable</h3>
                <p className="mt-2 text-base text-gray-500">
                  Votes are securely stored on the blockchain, making them tamper-proof and immutable.
                  Once cast, a vote cannot be altered or deleted.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white shadow-lg rounded-lg px-6 py-8 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Transparent & Verifiable</h3>
                <p className="mt-2 text-base text-gray-500">
                  Every vote is transparent and verifiable, while maintaining voter privacy.
                  Results are updated in real-time and can be independently verified.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white shadow-lg rounded-lg px-6 py-8 hover:shadow-xl transition-shadow">
                <div className="h-12 w-12 rounded-md bg-indigo-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Fast & Efficient</h3>
                <p className="mt-2 text-base text-gray-500">
                  Cast your vote in seconds from anywhere. Results are processed instantly,
                  eliminating manual counting and reducing the risk of error.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Process</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              How It Works
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-around">
                <div className="bg-white px-4">
                  <span className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                    1
                  </span>
                </div>
                <div className="bg-white px-4">
                  <span className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                    2
                  </span>
                </div>
                <div className="bg-white px-4">
                  <span className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                    3
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Connect Your Wallet</h3>
                <p className="mt-2 text-base text-gray-500">
                  Connect your blockchain wallet to authenticate your identity securely.
                  No passwords to remember or forget.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Choose Your Candidate</h3>
                <p className="mt-2 text-base text-gray-500">
                  View candidate profiles and select your preferred choice.
                  Your selection is prepared for blockchain submission.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">Cast Your Vote</h3>
                <p className="mt-2 text-base text-gray-500">
                  Confirm and submit your vote to the blockchain.
                  Your vote is recorded immutably and results update instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Info Section */}
      <div className="py-16 bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Developer Information</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Testing the Platform
            </p>
          </div>
          
          <div className="mt-10 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Access Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Details for testing the voting platform</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-indigo-700 mb-2">Electoral Commission Admin Access</h4>
                <p className="text-sm text-gray-600 mb-2">Use these wallet addresses to access admin features:</p>
                <div className="bg-gray-50 rounded-md p-3 mb-2 font-mono text-xs">
                  <div className="mb-1 break-all">0xEC00000000000000000000000000000000000001</div>
                  <div className="mb-1 break-all">0xEC00000000000000000000000000000000000002</div>
                  <div className="mb-1 break-all bg-green-100 p-1 rounded border border-green-300">0x64E01a30a963206345bE12DEcEcDA08d78c9a2a5 <span className="text-green-600 font-semibold ml-1">(✓ Admin Wallet)</span></div>
                </div>
                <Link to="/admin-login" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Go to Admin Login
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-indigo-700 mb-2">Registered Voter Wallets</h4>
                <p className="text-sm text-gray-600 mb-2">Use these wallet addresses to access voter features:</p>
                <div className="bg-gray-50 rounded-md p-3 font-mono text-xs">
                  <div className="mb-1 break-all">0x1234567890123456789012345678901234567890</div>
                  <div className="mb-1 break-all">0x2345678901234567890123456789012345678901</div>
                  <div className="mb-1 break-all">0x3456789012345678901234567890123456789012</div>
                </div>
              </div>
              
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      In a production environment, only verified wallet addresses would have access to these features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to cast your vote?</span>
            <span className="block">Connect your wallet now.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join the future of secure, transparent, and accessible voting.
            Your voice matters - make it count with SecureVoteChain.
          </p>
          <button
            onClick={login}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;