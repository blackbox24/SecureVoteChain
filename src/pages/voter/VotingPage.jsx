// src/pages/voter/VotingPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchElectionDetails, fetchCandidates, submitVote, resetVotingStatus } from '../../redux/electionSlice';
import { useAuth } from '../../contexts/AuthContext';
import VoteCard from '../../components/ui/VoteCard';
import { toast } from 'react-toastify';

const VotingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const { electionDetails, candidates, loading, votingStatus, error } = useSelector(state => state.election);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  useEffect(() => {
    dispatch(fetchElectionDetails());
    dispatch(fetchCandidates());
    
    return () => {
      // Reset voting status when component unmounts
      dispatch(resetVotingStatus());
    };
  }, [dispatch]);
  
  useEffect(() => {
    // Check if user has already voted
    if (userInfo?.hasVoted) {
      toast.info('You have already cast your vote for this election');
      navigate('/voter/dashboard');
    }
  }, [userInfo, navigate]);
  
  useEffect(() => {
    // Check if election is active
    if (electionDetails && electionDetails.state !== 'Ongoing') {
      toast.error('Voting is not currently active');
      navigate('/voter/dashboard');
    }
  }, [electionDetails, navigate]);
  
  useEffect(() => {
    // Handle voting status changes
    if (votingStatus === 'succeeded') {
      toast.success('Your vote has been cast successfully!');
      setTimeout(() => {
        navigate('/voter/results');
      }, 2000);
    } else if (votingStatus === 'failed' && error) {
      toast.error(`Voting failed: ${error}`);
    }
  }, [votingStatus, error, navigate]);
  
  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidate(candidateId);
  };
  
  const handleVoteSubmit = () => {
    if (!selectedCandidate) {
      toast.warning('Please select a candidate before voting');
      return;
    }
    
    setShowConfirmation(true);
  };
  
  const handleConfirmVote = () => {
    dispatch(submitVote(selectedCandidate));
    setShowConfirmation(false);
  };
  
  const handleCancelVote = () => {
    setShowConfirmation(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading voting page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Cast Your Vote</h1>
            <p className="text-gray-600 mt-2">
              Select your preferred candidate from the options below
            </p>
          </div>
          
          <div className="mt-8">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your vote is private and secure. Once submitted, it cannot be changed.
                    Please review your choice carefully before confirming.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="my-6">
              <h2 className="text-lg font-medium mb-4">Election: {electionDetails?.title}</h2>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                      <VoteCard
                        key={candidate.candidateId}
                        candidate={candidate}
                        isSelected={selectedCandidate === candidate.candidateId}
                        onSelect={() => handleCandidateSelect(candidate.candidateId)}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2 text-center py-8">No candidates available for this election.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleVoteSubmit}
                disabled={!selectedCandidate || votingStatus === 'loading'}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  !selectedCandidate || votingStatus === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {votingStatus === 'loading' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Submit Your Vote'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Your Vote</h3>
            <p className="text-gray-600 mb-6">
              You are about to cast your vote for:
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              {candidates.find(c => c.candidateId === selectedCandidate) && (
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    <img
                      src={candidates.find(c => c.candidateId === selectedCandidate).imageReference || '/assets/images/avatar-placeholder.png'}
                      alt="Candidate"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/avatar-placeholder.png';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{candidates.find(c => c.candidateId === selectedCandidate).name}</h4>
                    <p className="text-sm text-gray-500">{candidates.find(c => c.candidateId === selectedCandidate).party}</p>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-sm text-red-600 mb-4">
              Warning: This action cannot be undone. Your vote will be permanently recorded on the blockchain.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelVote}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVote}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;