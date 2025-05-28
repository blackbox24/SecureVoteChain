// src/pages/voter/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchElectionDetails, fetchCandidates } from '../../redux/electionSlice';
import ElectionTimer from '../../components/ui/ElectionTimer';
import { toast } from 'react-toastify';

const ResultsPage = () => {
  const dispatch = useDispatch();
  const { electionDetails, candidates, loading, error } = useSelector(state => state.election);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'pie', 'table'
  
  useEffect(() => {
    dispatch(fetchElectionDetails());
    dispatch(fetchCandidates());
  }, [dispatch]);
  
  useEffect(() => {
    // Handle errors
    if (error) {
      toast.error(`Error loading results: ${error}`);
    }
  }, [error]);
  
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  
  // Calculate percentages and add to candidates
  const candidatesWithPercentage = sortedCandidates.map(candidate => ({
    ...candidate,
    percentage: totalVotes > 0 ? Math.round((candidate.voteCount / totalVotes) * 100) : 0
  }));
  
  // Generate colors for pie chart
  const pieChartColors = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  // Statistics calculations
  const totalRegisteredVoters = 487; // This would come from the contract in a real app
  const voterTurnout = totalRegisteredVoters > 0 ? Math.round((totalVotes / totalRegisteredVoters) * 100) : 0;
  const leadingCandidate = candidatesWithPercentage[0] || null;
  const marginOfVictory = candidatesWithPercentage.length >= 2 
    ? candidatesWithPercentage[0].percentage - candidatesWithPercentage[1].percentage
    : 0;
  
  // Format date helper
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading election results...</p>
        </div>
      </div>
    );
  }
  
  // Determine election state for UI messaging
  const isElectionActive = electionDetails?.state === 'Ongoing';
  const isElectionEnded = electionDetails?.state === 'Ended';
  const isElectionCreated = electionDetails?.state !== 'NotCreated';
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Election Results</h1>
            <p className="text-gray-600">
              {isElectionActive 
                ? 'Live results tracking in real-time' 
                : isElectionEnded 
                  ? 'Final verified election results'
                  : 'Preliminary election data'
              }
            </p>
          </div>
          
          {isElectionCreated && (
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
      
      {isElectionCreated ? (
        <>
          {/* Election Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Total Votes</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{totalVotes.toLocaleString()}</p>
              {isElectionActive && (
                <p className="mt-1 text-sm text-green-600">Results update in real-time</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Voter Turnout</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{voterTurnout}%</p>
              <div className="mt-1 text-sm text-gray-600">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${voterTurnout}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Leading Candidate</h3>
              {leadingCandidate ? (
                <>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{leadingCandidate.name}</p>
                  <div className="mt-1 text-sm text-gray-600 flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${leadingCandidate.percentage > 50 ? 'green' : 'blue'}-100 text-${leadingCandidate.percentage > 50 ? 'green' : 'blue'}-800`}>
                      {leadingCandidate.percentage}%
                    </span>
                    <span className="ml-2">{leadingCandidate.party}</span>
                  </div>
                </>
              ) : (
                <p className="mt-1 text-gray-500">No votes cast</p>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wide">Margin of Victory</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{marginOfVictory}%</p>
              {leadingCandidate && candidatesWithPercentage.length > 1 && (
                <p className="mt-1 text-sm text-gray-600">
                  Ahead of {candidatesWithPercentage[1].name} ({candidatesWithPercentage[1].percentage}%)
                </p>
              )}
            </div>
          </div>
          
          {/* Visualization Controls & Display */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold">Results Visualization</h2>
              <div className="mt-3 md:mt-0 flex space-x-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Bar Chart
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`px-4 py-2 rounded ${chartType === 'pie' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Pie Chart
                </button>
                <button
                  onClick={() => setChartType('table')}
                  className={`px-4 py-2 rounded ${chartType === 'table' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  Table
                </button>
              </div>
            </div>
            
            {/* Chart display area */}
            <div className="mt-6">
              {chartType === 'bar' && (
                <div className="space-y-6">
                  {candidatesWithPercentage.map((candidate, index) => (
                    <div key={candidate.candidateId} className="relative">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                          <img 
                            src={candidate.imageReference || '/assets/images/avatar-placeholder.png'} 
                            alt={candidate.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/images/avatar-placeholder.png';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <span className="text-sm text-gray-600">{candidate.party}</span>
                        </div>
                        <div className="ml-auto text-right">
                          <span className="block font-bold">{candidate.voteCount.toLocaleString()} votes</span>
                          <span className="text-sm">{candidate.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${candidate.percentage}%`,
                            backgroundColor: pieChartColors[index % pieChartColors.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {chartType === 'pie' && (
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64 relative rounded-full overflow-hidden mb-6">
                    {candidatesWithPercentage.map((candidate, index, arr) => {
                      // Calculate the start and end angles for the pie slice
                      let startPercent = 0;
                      for (let i = 0; i < index; i++) {
                        startPercent += arr[i].percentage;
                      }
                      const endPercent = startPercent + candidate.percentage;
                      
                      // Convert percentages to angles (0-360)
                      const startAngle = (startPercent / 100) * 360;
                      const endAngle = (endPercent / 100) * 360;
                      
                      // Skip if percentage is zero
                      if (candidate.percentage === 0) return null;
                      
                      return (
                        <div 
                          key={candidate.candidateId}
                          className="absolute inset-0"
                          style={{
                            background: `conic-gradient(
                              transparent ${startAngle}deg,
                              ${pieChartColors[index % pieChartColors.length]} ${startAngle}deg,
                              ${pieChartColors[index % pieChartColors.length]} ${endAngle}deg,
                              transparent ${endAngle}deg
                            )`
                          }}
                        ></div>
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center text-center">
                        <div>
                          <div className="font-bold text-lg">{totalVotes}</div>
                          <div className="text-sm text-gray-500">Total Votes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {candidatesWithPercentage.map((candidate, index) => (
                      <div key={candidate.candidateId} className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: pieChartColors[index % pieChartColors.length] }}></div>
                        <div>
                          <div className="text-sm font-medium">{candidate.name}</div>
                          <div className="text-xs text-gray-500">{candidate.percentage}% ({candidate.voteCount})</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {chartType === 'table' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {candidatesWithPercentage.map((candidate, index) => (
                        <tr key={candidate.candidateId} className={index === 0 ? "bg-indigo-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-full" 
                                  src={candidate.imageReference || '/assets/images/avatar-placeholder.png'} 
                                  alt="" 
                                  onError={(e) => {
                                    e.target.src = '/assets/images/avatar-placeholder.png';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{candidate.party}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {candidate.voteCount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              candidate.percentage > 50 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {candidate.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {/* Election Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Election Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Title</span>
                    <div className="font-medium">{electionDetails.title}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Description</span>
                    <div className="text-gray-700">{electionDetails.description}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <div className="font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                        isElectionActive ? 'bg-green-100 text-green-800' :
                        isElectionEnded ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {isElectionActive ? 'Active' : 
                         isElectionEnded ? 'Ended' : 
                         electionDetails.state === 'Paused' ? 'Paused' :
                         'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Timeline</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Start Date</span>
                    <div className="font-medium">{formatDate(electionDetails.startTime)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">End Date</span>
                    <div className="font-medium">{formatDate(electionDetails.endTime)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Duration</span>
                    <div className="font-medium">{Math.round((electionDetails.endTime - electionDetails.startTime) / (1000 * 60 * 60 * 24))} days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="py-8">
            <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">No Election Data Available</h2>
            <p className="mt-1 text-sm text-gray-500">
              There is no election currently configured in the system.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;