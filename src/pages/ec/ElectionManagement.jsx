// src/pages/ec/ElectionManagement.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchElectionDetails, 
  fetchCandidates,
  createOrUpdateElection,
  updateElectionState
} from '../../redux/electionSlice';

const ElectionManagement = () => {
  const dispatch = useDispatch();
  const { electionDetails, loading, error } = useSelector(state => state.election);
  
  const [isCreatingElection, setIsCreatingElection] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  });
  
  // State for manual time entry
  const [useManualTime, setUseManualTime] = useState(false);
  const [manualStartTime, setManualStartTime] = useState({
    date: '',
    time: ''
  });
  const [manualEndTime, setManualEndTime] = useState({
    date: '',
    time: ''
  });
  
  useEffect(() => {
    dispatch(fetchElectionDetails());
    dispatch(fetchCandidates());
  }, [dispatch]);
  
  useEffect(() => {
    // Handle errors from redux
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [error]);
  
  // Prefill form if editing existing election
  useEffect(() => {
    if (electionDetails && electionDetails.state !== 'NotCreated') {
      setFormData({
        title: electionDetails.title || '',
        description: electionDetails.description || '',
        startTime: new Date(electionDetails.startTime).toISOString().slice(0, 16),
        endTime: new Date(electionDetails.endTime).toISOString().slice(0, 16)
      });
    }
  }, [electionDetails]);
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleManualTimeChange = (e, timeField, subField) => {
    const { value } = e.target;
    if (timeField === 'start') {
      setManualStartTime({
        ...manualStartTime,
        [subField]: value
      });
    } else {
      setManualEndTime({
        ...manualEndTime,
        [subField]: value
      });
    }
  };
  
  const handleCreateElection = (e) => {
    e.preventDefault();
    
    let startTimestamp, endTimestamp;
    
    if (useManualTime) {
      // Construct timestamps from manual inputs
      const startDateTime = `${manualStartTime.date}T${manualStartTime.time}`;
      const endDateTime = `${manualEndTime.date}T${manualEndTime.time}`;
      startTimestamp = new Date(startDateTime).getTime();
      endTimestamp = new Date(endDateTime).getTime();
    } else {
      // Use the datetime-local inputs
      startTimestamp = new Date(formData.startTime).getTime();
      endTimestamp = new Date(formData.endTime).getTime();
    }
    
    // Validation
    if (!formData.title) {
      toast.error('Election title is required');
      return;
    }
    
    if (!startTimestamp || !endTimestamp) {
      toast.error('Both start and end times are required');
      return;
    }
    
    if (startTimestamp >= endTimestamp) {
      toast.error('End time must be after start time');
      return;
    }
    
    // Create the election data object
    const electionData = {
      title: formData.title,
      description: formData.description,
      startTime: startTimestamp,
      endTime: endTimestamp,
      state: 'Created' // Initial state
    };
    
    // Dispatch the action to create/update the election
    dispatch(createOrUpdateElection(electionData))
      .unwrap()
      .then(() => {
        toast.success('Election has been created successfully');
        setIsCreatingElection(false);
      })
      .catch((error) => {
        toast.error(`Error creating election: ${error}`);
      });
  };
  
  const handleStartElection = () => {
    // In a real app, this would call the smart contract to start the election
    const now = Date.now();
    if (now < electionDetails.startTime) {
      toast.error('Cannot start an election before its scheduled start time');
      return;
    }
    
    // Dispatch action to update election state
    dispatch(updateElectionState({ newState: 'Ongoing' }))
      .unwrap()
      .then(() => {
        toast.success('Election has been started');
      })
      .catch((error) => {
        toast.error(`Error starting election: ${error}`);
      });
  };
  
  const handleEndElection = () => {
    // In a real app, this would call the smart contract to end the election
    dispatch(updateElectionState({ newState: 'Ended' }))
      .unwrap()
      .then(() => {
        toast.success('Election has been ended');
      })
      .catch((error) => {
        toast.error(`Error ending election: ${error}`);
      });
  };
  
  const handlePauseElection = () => {
    // In a real app, this would call the smart contract to pause the election
    dispatch(updateElectionState({ newState: 'Paused' }))
      .unwrap()
      .then(() => {
        toast.success('Election has been paused');
      })
      .catch((error) => {
        toast.error(`Error pausing election: ${error}`);
      });
  };
  
  const handleResumeElection = () => {
    // In a real app, this would call the smart contract to resume the election
    dispatch(updateElectionState({ newState: 'Ongoing' }))
      .unwrap()
      .then(() => {
        toast.success('Election has been resumed');
      })
      .catch((error) => {
        toast.error(`Error resuming election: ${error}`);
      });
  };
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Helper to determine if election has not been created yet
  const isElectionNotCreated = !electionDetails || electionDetails.state === 'NotCreated';
  
  // Helper to determine if election is active (created but not yet ended)
  const isElectionActive = electionDetails && ['Created', 'Ongoing', 'Paused'].includes(electionDetails.state);
  
  // Helper to determine if election is ongoing specifically
  const isElectionOngoing = electionDetails && electionDetails.state === 'Ongoing';
  
  // Helper to determine if election is paused
  const isElectionPaused = electionDetails && electionDetails.state === 'Paused';
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Election Management</h1>
            <p className="text-gray-600">
              Create and manage the election process
            </p>
          </div>
          
          {!isElectionNotCreated && !isCreatingElection && (
            <div className="mt-4 md:mt-0">
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                isElectionOngoing 
                  ? 'bg-green-100 text-green-800' 
                  : isElectionPaused
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {electionDetails.state}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {isElectionNotCreated || isCreatingElection ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {isElectionNotCreated ? 'Create New Election' : 'Edit Election'}
          </h2>
          
          <form onSubmit={handleCreateElection}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Election Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a title for the election"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Provide details about the election"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  id="useManualTime"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={useManualTime}
                  onChange={() => setUseManualTime(!useManualTime)}
                />
                <label htmlFor="useManualTime" className="ml-2 block text-sm text-gray-700">
                  Use separate date and time inputs
                </label>
              </div>
              
              {useManualTime ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date and Time *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={manualStartTime.date}
                          onChange={(e) => handleManualTimeChange(e, 'start', 'date')}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={manualStartTime.time}
                          onChange={(e) => handleManualTimeChange(e, 'start', 'time')}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date and Time *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={manualEndTime.date}
                          onChange={(e) => handleManualTimeChange(e, 'end', 'date')}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          value={manualEndTime.time}
                          onChange={(e) => handleManualTimeChange(e, 'end', 'time')}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date and Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="startTime"
                      name="startTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.startTime}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date and Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="endTime"
                      name="endTime"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.endTime}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                {!isElectionNotCreated && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingElection(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {isElectionNotCreated ? 'Create Election' : 'Update Election'}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">{electionDetails.title}</h2>
                <p className="text-gray-600 mt-1">{electionDetails.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => setIsCreatingElection(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Edit Election Details
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">Election Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Start Date:</span>
                    <p className="font-medium">{formatDate(electionDetails.startTime)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">End Date:</span>
                    <p className="font-medium">{formatDate(electionDetails.endTime)}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-500">Duration:</span>
                    <p className="font-medium">
                      {Math.ceil((electionDetails.endTime - electionDetails.startTime) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Current Status:</span>
                    <p className="font-medium">{electionDetails.state}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Election Controls</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Election State Management</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control the current state of the election. Once started, voters can cast their votes.
                  Pause if needed, and end the election when voting period is over.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  {electionDetails.state === 'Created' && (
                    <button
                      onClick={handleStartElection}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Start Election
                    </button>
                  )}
                  
                  {isElectionOngoing && (
                    <>
                      <button
                        onClick={handlePauseElection}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                      >
                        Pause Election
                      </button>
                      <button
                        onClick={handleEndElection}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        End Election
                      </button>
                    </>
                  )}
                  
                  {isElectionPaused && (
                    <>
                      <button
                        onClick={handleResumeElection}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Resume Election
                      </button>
                      <button
                        onClick={handleEndElection}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        End Election
                      </button>
                    </>
                  )}
                  
                  {electionDetails.state === 'Ended' && (
                    <div className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
                      This election has ended and cannot be modified
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Advanced Options</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Additional controls for managing the election process.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => toast.info('This feature would allow for election backup/export in a real implementation')}
                  >
                    Export Election Data
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    onClick={() => toast.info('This feature would allow for vote recounting in a real implementation')}
                  >
                    Verify Vote Count
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Require Voter Verification</h3>
                    <p className="text-sm text-gray-600">
                      When enabled, voters must be verified before they can cast a vote
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-green-500 rounded-full">
                    <label
                      htmlFor="toggle-voter-verification"
                      className="absolute left-0 block w-6 h-6 mt-0 bg-white border-2 rounded-full cursor-pointer transform translate-x-6"
                    ></label>
                    <input
                      type="checkbox"
                      id="toggle-voter-verification"
                      name="toggle-voter-verification"
                      className="absolute w-0 h-0 opacity-0"
                      checked={true}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication for Admin Controls</h3>
                    <p className="text-sm text-gray-600">
                      Require additional verification for election control operations
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-300 rounded-full">
                    <label
                      htmlFor="toggle-2fa"
                      className="absolute left-0 block w-6 h-6 mt-0 bg-white border-2 rounded-full cursor-pointer"
                    ></label>
                    <input
                      type="checkbox"
                      id="toggle-2fa"
                      name="toggle-2fa"
                      className="absolute w-0 h-0 opacity-0"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Public Results During Election</h3>
                    <p className="text-sm text-gray-600">
                      Allow real-time results to be visible while the election is ongoing
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-green-500 rounded-full">
                    <label
                      htmlFor="toggle-public-results"
                      className="absolute left-0 block w-6 h-6 mt-0 bg-white border-2 rounded-full cursor-pointer transform translate-x-6"
                    ></label>
                    <input
                      type="checkbox"
                      id="toggle-public-results"
                      name="toggle-public-results"
                      className="absolute w-0 h-0 opacity-0"
                      checked={true}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ElectionManagement;