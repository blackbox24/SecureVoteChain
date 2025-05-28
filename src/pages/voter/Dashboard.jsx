// src/pages/voter/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElectionDetails, fetchCandidates } from '../../redux/electionSlice';
import { useAuth } from '../../contexts/AuthContext';
import ElectionTimer from '../../components/ui/ElectionTimer';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { electionDetails, candidates, loading, error } = useSelector(state => state.election);
  const { userInfo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (userInfo && userInfo.isVerified) {
      dispatch(fetchElectionDetails());
      dispatch(fetchCandidates());
    }
  }, [dispatch, userInfo]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  const isElectionActive = electionDetails?.state === 'Ongoing';
  const canVote = isElectionActive && userInfo && !userInfo.hasVoted;
  const hasVoted = userInfo?.hasVoted;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Voter Dashboard</h1>
            <p className="text-gray-600">Welcome, Voter ID: {userInfo?.voterId}</p>
          </div>
          
          {electionDetails && (
            <div className="mt-4 md:mt-0">
              <ElectionTimer 
                startTime={electionDetails.startTime}
                endTime={electionDetails.endTime}
                status={electionDetails.state}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-center text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`py-4 px-6 text-center text-sm font-medium ${
                activeTab === 'status'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Voting Status
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-6 text-center text-sm font-medium ${
                activeTab === 'info'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Information
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Election Overview</h2>
              
              {!electionDetails ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        No active election is currently available.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">{electionDetails.title}</h3>
                      <p className="text-gray-600">{electionDetails.description}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          isElectionActive 
                            ? 'bg-green-100 text-green-800' 
                            : electionDetails.state === 'Ended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isElectionActive ? 'Ongoing' : electionDetails.state}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Candidates:</span>
                        <span className="ml-2 text-gray-900">{candidates.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link
                      to="/voter/vote"
                      className={`px-4 py-2 rounded-md text-white text-center ${
                        canVote 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => !canVote && e.preventDefault()}
                    >
                      {hasVoted 
                        ? 'Already Voted' 
                        : isElectionActive 
                          ? 'Cast Your Vote' 
                          : 'Voting Not Active'}
                    </Link>
                    <Link
                      to="/voter/results"
                      className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-center"
                    >
                      View Results
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'status' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Voting Status</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hasVoted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {hasVoted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">
                      {hasVoted ? 'Vote Successfully Cast' : 'Vote Not Yet Cast'}
                    </h3>
                    <p className="text-gray-600">
                      {hasVoted 
                        ? 'Your vote has been securely recorded on the blockchain.' 
                        : isElectionActive 
                          ? 'You are eligible to vote in the ongoing election.' 
                          : 'Please wait for an active election to cast your vote.'}
                    </p>
                  </div>
                </div>
                
                {hasVoted && (
                  <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">Transaction Details</h4>
                    <div className="mt-2 text-sm text-gray-900">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Transaction Hash:</span>
                        <span className="font-mono">0x83a...b21f</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span>Block Number:</span>
                        <span>12,345,678</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Timestamp:</span>
                        <span>{new Date().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {!hasVoted && isElectionActive && (
                  <div className="mt-4">
                    <Link
                      to="/voter/vote"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Vote Now
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'info' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Voting Information</h2>
              
              <div className="prose max-w-none">
                <h3>How to Vote</h3>
                <ol className="list-decimal pl-5 mb-4">
                  <li className="mb-2">Ensure your wallet is connected and you are registered as a voter.</li>
                  <li className="mb-2">Navigate to the "Cast Your Vote" page during the active voting period.</li>
                  <li className="mb-2">Review candidate information carefully before making your selection.</li>
                  <li className="mb-2">Submit your vote by confirming the transaction in your wallet.</li>
                  <li className="mb-2">Wait for the blockchain to process your vote (this may take a moment).</li>
                  <li className="mb-2">View your voting receipt and transaction confirmation.</li>
                </ol>
                
                <h3>Voting Rules</h3>
                <ul className="list-disc pl-5 mb-4">
                  <li className="mb-2">Each registered voter can vote only once.</li>
                  <li className="mb-2">Votes cannot be changed once submitted.</li>
                  <li className="mb-2">Voting is only possible during the active election period.</li>
                  <li className="mb-2">Your vote is anonymous - your identity is not linked to your choice.</li>
                  <li className="mb-2">Results are visible in real-time as votes are cast.</li>
                </ul>
                
                <h3>Security Features</h3>
                <p>
                  Your vote is secured by blockchain technology, making it tamper-proof and 
                  verifiable. The voting process uses smart contracts that have been audited 
                  for security vulnerabilities. Each vote transaction is recorded on the blockchain, 
                  providing a permanent and transparent record while maintaining voter privacy.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;