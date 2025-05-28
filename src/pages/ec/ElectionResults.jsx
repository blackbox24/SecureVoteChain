// src/pages/ec/ElectionResults.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import { fetchElectionDetails, fetchCandidates } from '../../redux/electionSlice';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ElectionResults = () => {
  const dispatch = useDispatch();
  const { electionDetails, candidates, loading, error } = useSelector(state => state.election);
  
  // Local state for data visualization
  const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [resultsView, setResultsView] = useState('chart'); // 'chart' or 'table'
  const [showInactive, setShowInactive] = useState(false);
  const [sortBy, setSortBy] = useState('votes'); // 'votes', 'name', or 'party'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [filterParty, setFilterParty] = useState('all');
  const [parties, setParties] = useState([]);
  
  // Mock data for candidates if needed for development
  const mockCandidates = [
    { id: 1, name: 'John Smith', party: 'Progressive Party', voteCount: 143, isActive: true },
    { id: 2, name: 'Sarah Johnson', party: 'Future Alliance', voteCount: 98, isActive: true },
    { id: 3, name: 'Michael Chen', party: 'Unity Coalition', voteCount: 112, isActive: true },
    { id: 4, name: 'Jessica Williams', party: 'Reform Movement', voteCount: 76, isActive: true },
    { id: 5, name: 'Robert Garcia', party: 'Independent', voteCount: 64, isActive: false },
    { id: 6, name: 'David Wilson', party: 'Progressive Party', voteCount: 53, isActive: true },
    { id: 7, name: 'Maria Rodriguez', party: 'Future Alliance', voteCount: 88, isActive: true },
    { id: 8, name: 'James Taylor', party: 'Unity Coalition', voteCount: 45, isActive: false },
  ];
  
  // Use mock data for now, would use real data from Redux in production
  const candidateData = mockCandidates;

  useEffect(() => {
    dispatch(fetchElectionDetails());
    dispatch(fetchCandidates());
    
    if (error) {
      toast.error(`Error loading election data: ${error}`);
    }
  }, [dispatch, error]);

  // Extract unique parties for filtering
  useEffect(() => {
    if (candidateData.length > 0) {
      const uniqueParties = [...new Set(candidateData.map(candidate => candidate.party))];
      setParties(uniqueParties);
    }
  }, [candidateData]);

  // Prepare chart data when candidate data changes
  useEffect(() => {
    if (candidateData.length > 0) {
      prepareChartData();
    }
  }, [candidateData, showInactive, filterParty]);

  // Filtered candidates based on active status and party filter
  const filteredCandidates = candidateData.filter(candidate => {
    if (!showInactive && !candidate.isActive) return false;
    if (filterParty !== 'all' && candidate.party !== filterParty) return false;
    return true;
  });

  // Sort candidates based on current sort settings
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'votes') {
      return sortOrder === 'asc' ? a.voteCount - b.voteCount : b.voteCount - a.voteCount;
    } else if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'party') {
      return sortOrder === 'asc' 
        ? a.party.localeCompare(b.party) 
        : b.party.localeCompare(a.party);
    }
    return 0;
  });

  // Prepare chart data from candidates
  const prepareChartData = () => {
    const labels = filteredCandidates.map(candidate => candidate.name);
    const votes = filteredCandidates.map(candidate => candidate.voteCount);
    
    // Custom colors for the charts
    const backgroundColors = [
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(199, 199, 199, 0.5)',
      'rgba(83, 102, 255, 0.5)',
      'rgba(245, 131, 122, 0.5)',
    ];
    
    const borderColors = [
      'rgba(54, 162, 235, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)',
      'rgba(83, 102, 255, 1)',
      'rgba(245, 131, 122, 1)',
    ];

    // Pie chart data
    setPieChartData({
      labels,
      datasets: [
        {
          data: votes,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    });

    // Bar chart data
    setBarChartData({
      labels,
      datasets: [
        {
          label: 'Votes',
          data: votes,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    });
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} votes (${percentage}%)`;
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Votes Per Candidate',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.parsed.y} votes`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Votes',
        }
      },
      x: {
        title: {
          display: true,
          text: 'Candidate',
        }
      }
    }
  };

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Calculate total votes
  const totalVotes = candidateData.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  
  // Calculate voter turnout
  const voterTurnout = {
    percentage: 68.5, // Mock data - would be calculated from real data
    total: totalVotes,
    registered: Math.round(totalVotes / 0.685), // Mock calculation
  };

  // Generate statistics by party
  const partyStats = parties.map(party => {
    const partyVotes = candidateData
      .filter(c => c.party === party)
      .reduce((sum, c) => sum + c.voteCount, 0);
    
    return {
      party,
      votes: partyVotes,
      percentage: (partyVotes / totalVotes) * 100,
      candidates: candidateData.filter(c => c.party === party).length
    };
  }).sort((a, b) => b.votes - a.votes);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Election Results</h1>
            <p className="text-gray-600">
              Detailed analysis and visualization of voting outcomes
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {electionDetails && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                electionDetails.state === 'Ended' 
                  ? 'bg-blue-100 text-blue-800' 
                  : electionDetails.state === 'Ongoing'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {electionDetails.state === 'Ended' ? 'Final Results' : 'Preliminary Results'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Election Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Votes Cast</h3>
          <p className="text-3xl font-bold text-indigo-600">{totalVotes.toLocaleString()}</p>
          <p className="mt-2 text-sm text-gray-500">From all participating candidates</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Voter Turnout</h3>
          <p className="text-3xl font-bold text-green-600">{voterTurnout.percentage.toFixed(1)}%</p>
          <p className="mt-2 text-sm text-gray-500">
            {voterTurnout.total.toLocaleString()} of {voterTurnout.registered.toLocaleString()} registered voters
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Leading Candidate</h3>
          {sortedCandidates.length > 0 ? (
            <>
              <p className="text-xl font-bold text-blue-600">{sortedCandidates[0].name}</p>
              <p className="mt-1 text-sm text-gray-500">
                {sortedCandidates[0].voteCount.toLocaleString()} votes ({((sortedCandidates[0].voteCount / totalVotes) * 100).toFixed(1)}%)
              </p>
              <p className="mt-1 text-xs text-gray-500">{sortedCandidates[0].party}</p>
            </>
          ) : (
            <p className="text-gray-500">No candidates available</p>
          )}
        </div>
      </div>
      
      {/* Results Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold">Results Visualization</h2>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => setResultsView('chart')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                resultsView === 'chart' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Charts
            </button>
            <button
              onClick={() => setResultsView('table')}
              className={`px-3 py-1.5 text-sm rounded-md ${
                resultsView === 'table' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table View
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <input
              id="show-inactive"
              type="checkbox"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            <label htmlFor="show-inactive" className="text-sm text-gray-700">
              Include inactive candidates
            </label>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="filter-party" className="mr-2 text-sm text-gray-700">Filter by party:</label>
            <select
              id="filter-party"
              className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
            >
              <option value="all">All Parties</option>
              {parties.map((party) => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>
        </div>
        
        {resultsView === 'chart' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <h3 className="text-lg font-medium mb-4 text-center">Vote Distribution (Pie Chart)</h3>
              <Pie data={pieChartData} options={pieOptions} />
            </div>
            <div className="h-80">
              <h3 className="text-lg font-medium mb-4 text-center">Vote Comparison (Bar Chart)</h3>
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Candidate</span>
                      {sortBy === 'name' && (
                        <span>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('party')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Party</span>
                      {sortBy === 'party' && (
                        <span>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('votes')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Votes</span>
                      {sortBy === 'votes' && (
                        <span>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCandidates.map((candidate) => (
                  <tr key={candidate.id} className={!candidate.isActive ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{candidate.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.party}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{candidate.voteCount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {((candidate.voteCount / totalVotes) * 100).toFixed(2)}%
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${(candidate.voteCount / totalVotes) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        candidate.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {candidate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Party Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Party Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Party
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Votes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidates
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partyStats.map((stat, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{stat.party}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{stat.votes.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {stat.percentage.toFixed(2)}%
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{stat.candidates}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Export/Download Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Reports & Data Export</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => toast.info("PDF export feature would be implemented here")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            Download as PDF
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => toast.info("CSV export feature would be implemented here")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            Export Raw Data (CSV)
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => toast.info("Validation report feature would be implemented here")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Generate Validation Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElectionResults;