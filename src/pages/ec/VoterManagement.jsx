// src/pages/ec/VoterManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchVoters, updateVoter, addVoter } from '../../redux/electionSlice';

const VoterManagement = () => {
  const dispatch = useDispatch();
  const { voters, loading, error } = useSelector(state => state.election);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVoterAddress, setNewVoterAddress] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Fetch voters data from Redux store
    dispatch(fetchVoters());
  }, [dispatch]);
  
  useEffect(() => {
    // Handle errors from redux
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);
  
  const filteredVoters = voters.filter(voter => {
    // First apply tab filter
    if (activeTab === 'verified' && !voter.verified) return false;
    if (activeTab === 'unverified' && voter.verified) return false;
    if (activeTab === 'voted' && !voter.hasVoted) return false;
    if (activeTab === 'not-voted' && voter.hasVoted) return false;
    
    // Then apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        voter.id.toLowerCase().includes(searchLower) ||
        voter.walletAddress.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
  
  const handleVerifyVoter = (id) => {
    // In a real application, this would call the smart contract to verify the voter
    dispatch(updateVoter({ 
      voterId: id, 
      updates: { verified: true, isPending: false, isVerified: true } 
    }))
      .unwrap()
      .then(() => {
        toast.success(`Voter ${id} verified successfully`);
      })
      .catch((error) => {
        toast.error(`Error verifying voter: ${error}`);
      });
  };
  
  const handleRevokeVerification = (id) => {
    // In a real application, this would call the smart contract to revoke verification
    dispatch(updateVoter({ 
      voterId: id, 
      updates: { verified: false, isPending: true, isVerified: false } 
    }))
      .unwrap()
      .then(() => {
        toast.success(`Voter ${id} verification revoked`);
      })
      .catch((error) => {
        toast.error(`Error revoking verification: ${error}`);
      });
  };
  
  const handleAddVoter = (e) => {
    e.preventDefault();
    if (!newVoterAddress || !newVoterAddress.startsWith('0x') || newVoterAddress.length !== 42) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }
    
    // Check if this wallet address already exists
    const existingVoter = voters.find(voter => 
      voter.walletAddress.toLowerCase() === newVoterAddress.toLowerCase()
    );
    
    if (existingVoter) {
      toast.error('This wallet address is already registered');
      return;
    }
    
    // Create a new voter object with both old and new data structures
    const newVoter = {
      id: `VOT${Math.floor(Math.random() * 1000000)}`,
      walletAddress: newVoterAddress,
      registrationDate: new Date().toISOString(),
      hasVoted: false,
      verified: false,
      isVerified: false,
      isPending: true,
      isRegistered: true,
      personalInfo: {
        name: 'Pending Verification',
        nationalId: 'Pending',
        registrationDate: new Date().toISOString()
      }
    };
    
    // Dispatch the addVoter action
    dispatch(addVoter(newVoter))
      .unwrap()
      .then(() => {
        setNewVoterAddress('');
        setShowAddModal(false);
        toast.success('Voter registered successfully and pending verification');
      })
      .catch((error) => {
        toast.error(`Error registering voter: ${error}`);
      });
  };
  
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatDate = (dateStr) => {
    try {
      // Check if dateStr is valid
      if (!dateStr) return 'N/A';
      
      // Try to parse the date string into a Date object
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      // Format the date
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading voter data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Voter Management</h1>
            <p className="text-gray-600">
              Register, verify, and manage voters for the election
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Register New Voter
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search voters..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          
          <div className="tabs flex space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'verified'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setActiveTab('unverified')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'unverified'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unverified
            </button>
            <button
              onClick={() => setActiveTab('voted')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'voted'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Voted
            </button>
            <button
              onClick={() => setActiveTab('not-voted')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'not-voted'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Not Voted
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voter ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVoters.length > 0 ? (
                filteredVoters.map((voter) => (
                  <tr key={voter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{voter.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatAddress(voter.walletAddress)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(voter.registrationDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voter.verified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voter.hasVoted ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {voter.verified ? (
                        <button
                          onClick={() => handleRevokeVerification(voter.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revoke Verification
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyVoter(voter.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Verify
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No voters found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredVoters.length}</span> of{" "}
            <span className="font-medium">{voters.length}</span> voters
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Voters</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{voters.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Verified Voters</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {voters.filter(voter => voter.verified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Votes Cast</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {voters.filter(voter => voter.hasVoted).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Voter Participation</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">
            {voters.length > 0
              ? Math.round((voters.filter(voter => voter.hasVoted).length / voters.length) * 100)
              : 0}%
          </p>
        </div>
      </div>
      
      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Bulk Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Verify All Pending
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export Voter List
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
            Import Voters
          </button>
        </div>
      </div>
      
      {/* Add Voter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Register New Voter</h3>
            <form onSubmit={handleAddVoter}>
              <div className="mb-4">
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0x..."
                  value={newVoterAddress}
                  onChange={(e) => setNewVoterAddress(e.target.value)}
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the Ethereum wallet address of the voter to register them in the system
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Register Voter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoterManagement;