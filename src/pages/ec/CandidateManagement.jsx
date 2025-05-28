// src/pages/ec/CandidateManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchCandidates, 
  addCandidate,
  updateCandidate,
  deleteCandidate 
} from '../../redux/electionSlice';

const CandidateManagement = () => {
  const dispatch = useDispatch();
  const { candidates, loading, error } = useSelector(state => state.election);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    party: '',
    information: '',
    imageReference: ''
  });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Fetch candidates data from Redux store
    dispatch(fetchCandidates());
  }, [dispatch]);
  
  useEffect(() => {
    // Handle errors from redux
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);
  
  const filteredCandidates = candidates.filter(candidate => {
    // Apply filter
    if (filter === 'approved' && !candidate.isApproved) return false;
    if (filter === 'pending' && candidate.isApproved) return false;
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.party.toLowerCase().includes(searchLower) ||
        candidate.information.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
  
  const handleAddCandidate = (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party) {
      toast.error('Name and party are required fields');
      return;
    }
    
    // Create new candidate with a unique ID
    const candidateId = `CAN${Math.floor(Math.random() * 1000000)}`;
    const candidate = {
      ...newCandidate,
      candidateId,
      voteCount: 0,
      isApproved: false
    };
    
    // Dispatch the addCandidate action
    dispatch(addCandidate(candidate))
      .unwrap()
      .then(() => {
        setNewCandidate({ name: '', party: '', information: '', imageReference: '' });
        setShowAddModal(false);
        toast.success('Candidate added successfully and pending approval');
      })
      .catch((error) => {
        toast.error(`Error adding candidate: ${error}`);
      });
  };
  
  const handleEditCandidate = (e) => {
    e.preventDefault();
    if (!editingCandidate.name || !editingCandidate.party) {
      toast.error('Name and party are required fields');
      return;
    }
    
    // Dispatch the updateCandidate action
    dispatch(updateCandidate({
      candidateId: editingCandidate.candidateId,
      updates: {
        name: editingCandidate.name,
        party: editingCandidate.party,
        information: editingCandidate.information,
        imageReference: editingCandidate.imageReference
      }
    }))
      .unwrap()
      .then(() => {
        setEditingCandidate(null);
        toast.success('Candidate updated successfully');
      })
      .catch((error) => {
        toast.error(`Error updating candidate: ${error}`);
      });
  };
  
  const handleDeleteCandidate = (candidateId) => {
    // In a real application, this would call the smart contract to remove the candidate
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      dispatch(deleteCandidate(candidateId))
        .unwrap()
        .then(() => {
          toast.success('Candidate deleted successfully');
        })
        .catch((error) => {
          toast.error(`Error deleting candidate: ${error}`);
        });
    }
  };
  
  const handleApproveCandidate = (candidateId) => {
    // In a real application, this would call the smart contract to approve the candidate
    dispatch(updateCandidate({
      candidateId,
      updates: { isApproved: true }
    }))
      .unwrap()
      .then(() => {
        toast.success('Candidate approved successfully');
      })
      .catch((error) => {
        toast.error(`Error approving candidate: ${error}`);
      });
  };
  
  const handleRevokeApproval = (candidateId) => {
    // In a real application, this would call the smart contract to revoke approval
    dispatch(updateCandidate({
      candidateId,
      updates: { isApproved: false }
    }))
      .unwrap()
      .then(() => {
        toast.success('Candidate approval revoked');
      })
      .catch((error) => {
        toast.error(`Error revoking candidate approval: ${error}`);
      });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidate data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Candidate Management</h1>
            <p className="text-gray-600">
              Add, approve, and manage election candidates
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add New Candidate
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates..."
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
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Candidates
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Approval
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <div key={candidate.candidateId} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={candidate.imageReference || '/assets/images/candidate-placeholder.png'}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/candidate-placeholder.png';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {candidate.isApproved ? (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{candidate.name}</h3>
                  <p className="text-sm text-gray-600">{candidate.party}</p>
                  <div className="mt-2 text-sm text-gray-700">
                    {candidate.information}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">{candidate.voteCount}</span> votes
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCandidate(candidate)}
                          className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                          title="Edit candidate"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCandidate(candidate.candidateId)}
                          className="p-1 rounded-full text-red-600 hover:bg-red-100"
                          title="Delete candidate"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {candidate.isApproved ? (
                          <button
                            onClick={() => handleRevokeApproval(candidate.candidateId)}
                            className="p-1 rounded-full text-yellow-600 hover:bg-yellow-100"
                            title="Revoke approval"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveCandidate(candidate.candidateId)}
                            className="p-1 rounded-full text-green-600 hover:bg-green-100"
                            title="Approve candidate"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No candidates found matching the current filters
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredCandidates.length}</span> of{" "}
            <span className="font-medium">{candidates.length}</span> candidates
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Candidates</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{candidates.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Approved Candidates</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {candidates.filter(candidate => candidate.isApproved).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending Approval</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {candidates.filter(candidate => !candidate.isApproved).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Votes Cast</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0)}
          </p>
        </div>
      </div>
      
      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Candidate</h3>
            <form onSubmit={handleAddCandidate}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter candidate name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="party" className="block text-sm font-medium text-gray-700 mb-1">
                  Party/Organization *
                </label>
                <input
                  type="text"
                  id="party"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter party or organization name"
                  value={newCandidate.party}
                  onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="information" className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Information
                </label>
                <textarea
                  id="information"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter candidate background, experience, etc."
                  rows={3}
                  value={newCandidate.information}
                  onChange={(e) => setNewCandidate({ ...newCandidate, information: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="imageReference" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="imageReference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter image URL (optional)"
                  value={newCandidate.imageReference}
                  onChange={(e) => setNewCandidate({ ...newCandidate, imageReference: e.target.value })}
                />
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
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Candidate Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Candidate</h3>
            <form onSubmit={handleEditCandidate}>
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="edit-name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={editingCandidate.name}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-party" className="block text-sm font-medium text-gray-700 mb-1">
                  Party/Organization *
                </label>
                <input
                  type="text"
                  id="edit-party"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={editingCandidate.party}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, party: e.target.value })}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-information" className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Information
                </label>
                <textarea
                  id="edit-information"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  value={editingCandidate.information}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, information: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-imageReference" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  id="edit-imageReference"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={editingCandidate.imageReference}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, imageReference: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingCandidate(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateManagement;