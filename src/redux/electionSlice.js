// src/redux/electionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initialize from localStorage or use defaults
const getSavedElection = () => {
  try {
    const savedElection = localStorage.getItem('election');
    return savedElection ? JSON.parse(savedElection) : null;
  } catch (error) {
    console.error('Error loading saved election:', error);
    return null;
  }
};

const getSavedCandidates = () => {
  try {
    const savedCandidates = localStorage.getItem('candidates');
    return savedCandidates ? JSON.parse(savedCandidates) : [];
  } catch (error) {
    console.error('Error loading saved candidates:', error);
    return [];
  }
};

// Mock data for development - only used if no saved data exists
const mockElection = getSavedElection() || {
  title: "General Election 2023",
  description: "Vote for your preferred candidate in the general election",
  startTime: Date.now() + 1000 * 60 * 60 * 24 * 2, // 2 days from now
  endTime: Date.now() + 1000 * 60 * 60 * 24 * 5, // 5 days from now
  state: "Created" // NotCreated, Created, Ongoing, Paused, Ended
};

const mockCandidates = getSavedCandidates().length > 0 ? getSavedCandidates() : [
  {
    candidateId: 1,
    name: "Alex Thompson",
    information: "Progress Party candidate with 10 years of public service experience.",
    imageReference: "/assets/images/candidate1.jpg",
    party: "Progress Party",
    voteCount: 156,
    percentage: 42,
    isApproved: true
  },
  {
    candidateId: 2,
    name: "Morgan Rivera",
    information: "Liberty Alliance nominee and community organizer.",
    imageReference: "/assets/images/candidate2.jpg",
    party: "Liberty Alliance",
    voteCount: 142,
    percentage: 38,
    isApproved: true
  },
  {
    candidateId: 3,
    name: "Jordan Casey",
    information: "Independent candidate focused on environmental issues.",
    imageReference: "/assets/images/candidate3.jpg",
    party: "Independent",
    voteCount: 75,
    percentage: 20,
    isApproved: true
  }
];

// Get voter data from localStorage
const getSavedVoters = () => {
  try {
    const savedVoters = localStorage.getItem('voters');
    return savedVoters ? JSON.parse(savedVoters) : [];
  } catch (error) {
    console.error('Error loading saved voters:', error);
    return [];
  }
};

// Default voters if none saved
const defaultVoters = [
  { id: 'VOT123456', walletAddress: '0x1234...5678', registrationDate: new Date(2023, 5, 15).toISOString(), hasVoted: true, verified: true },
  { id: 'VOT234567', walletAddress: '0x2345...6789', registrationDate: new Date(2023, 5, 16).toISOString(), hasVoted: false, verified: true },
  { id: 'VOT345678', walletAddress: '0x3456...7890', registrationDate: new Date(2023, 5, 17).toISOString(), hasVoted: false, verified: false },
  { id: 'VOT456789', walletAddress: '0x4567...8901', registrationDate: new Date(2023, 5, 18).toISOString(), hasVoted: true, verified: true },
  { id: 'VOT567890', walletAddress: '0x5678...9012', registrationDate: new Date(2023, 5, 19).toISOString(), hasVoted: false, verified: true }
];

const mockVoters = getSavedVoters().length > 0 ? getSavedVoters() : defaultVoters;

// Async thunks for election, candidates and voters
export const fetchElectionDetails = createAsyncThunk(
  'election/fetchElectionDetails',
  async (_, { rejectWithValue }) => {
    try {
      // In actual implementation, this would be a contract call
      // For now, we'll return mock/saved data
      return mockElection;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrUpdateElection = createAsyncThunk(
  'election/createOrUpdateElection',
  async (electionData, { rejectWithValue }) => {
    try {
      // In a real app, this would be a contract call
      // For now, we'll just simulate and save to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      localStorage.setItem('election', JSON.stringify(electionData));
      
      return electionData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateElectionState = createAsyncThunk(
  'election/updateElectionState',
  async ({newState}, { getState, rejectWithValue }) => {
    try {
      // Get current election data
      const { electionDetails } = getState().election;
      
      if (!electionDetails) {
        return rejectWithValue('No election found to update');
      }
      
      // Update state
      const updatedElection = {
        ...electionDetails,
        state: newState
      };
      
      // Save to localStorage
      localStorage.setItem('election', JSON.stringify(updatedElection));
      
      return updatedElection;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCandidates = createAsyncThunk(
  'election/fetchCandidates',
  async (_, { rejectWithValue }) => {
    try {
      // In actual implementation, this would be a contract call
      // For now, we'll return mock data
      return mockCandidates;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCandidate = createAsyncThunk(
  'election/addCandidate',
  async (candidateData, { getState, rejectWithValue }) => {
    try {
      // Get current candidates
      const { candidates } = getState().election;
      
      // Generate new candidate ID
      const maxId = candidates.length > 0 
        ? Math.max(...candidates.map(c => c.candidateId)) 
        : 0;
      const newCandidate = {
        ...candidateData,
        candidateId: maxId + 1,
        voteCount: 0,
        percentage: 0
      };
      
      // Add to candidates list
      const updatedCandidates = [...candidates, newCandidate];
      
      // Save to localStorage
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      
      return newCandidate;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCandidate = createAsyncThunk(
  'election/updateCandidate',
  async (candidateData, { getState, rejectWithValue }) => {
    try {
      // Get current candidates
      const { candidates } = getState().election;
      
      // Find and update the candidate
      const updatedCandidates = candidates.map(candidate => 
        candidate.candidateId === candidateData.candidateId 
          ? { ...candidate, ...candidateData.updates } 
          : candidate
      );
      
      // Save to localStorage
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      
      return { 
        updatedCandidate: candidateData,
        allCandidates: updatedCandidates
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCandidate = createAsyncThunk(
  'election/deleteCandidate',
  async (candidateId, { getState, rejectWithValue }) => {
    try {
      // Get current candidates
      const { candidates } = getState().election;
      
      // Remove the candidate
      const updatedCandidates = candidates.filter(
        candidate => candidate.candidateId !== candidateId
      );
      
      // Save to localStorage
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      
      return { 
        deletedId: candidateId,
        allCandidates: updatedCandidates
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVoters = createAsyncThunk(
  'election/fetchVoters',
  async (_, { rejectWithValue }) => {
    try {
      return mockVoters;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerVoter = createAsyncThunk(
  'election/registerVoter',
  async (voterData, { getState, rejectWithValue }) => {
    try {
      // Get current voters
      const { voters } = getState().election;
      
      // Check if wallet address is already registered
      const existingVoter = voters.find(
        voter => voter.walletAddress && 
        voter.walletAddress.toLowerCase() === voterData.walletAddress.toLowerCase()
      );
      
      if (existingVoter) {
        return rejectWithValue('Wallet address is already registered');
      }
      
      // Create new voter registration
      const newVoter = {
        ...voterData,
        verified: false, // Will be verified by EC admin
        hasVoted: false,
      };
      
      // Add to voters list
      const updatedVoters = [...voters, newVoter];
      
      // Save to localStorage
      localStorage.setItem('voters', JSON.stringify(updatedVoters));
      
      return newVoter;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const addVoter = createAsyncThunk(
  'election/addVoter',
  async (voterData, { getState, rejectWithValue }) => {
    try {
      // Get current voters
      const { voters } = getState().election;
      
      // Create new voter
      const newVoter = {
        ...voterData,
        id: `VOT${Math.floor(Math.random() * 1000000)}`,
        registrationDate: new Date().toISOString(),
        hasVoted: false,
      };
      
      // Add to voters list
      const updatedVoters = [...voters, newVoter];
      
      // Save to localStorage
      localStorage.setItem('voters', JSON.stringify(updatedVoters));
      
      return newVoter;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVoter = createAsyncThunk(
  'election/updateVoter',
  async (voterData, { getState, rejectWithValue }) => {
    try {
      // Get current voters
      const { voters } = getState().election;
      
      // Find the voter to update
      const voterIndex = voters.findIndex(voter => voter.id === voterData.voterId);
      
      if (voterIndex === -1) {
        return rejectWithValue(`Voter with ID ${voterData.voterId} not found`);
      }
      
      // Create updated voter with both old and new naming conventions for backward compatibility
      const updatedVoter = {
        ...voters[voterIndex],
        ...voterData.updates
      };
      
      // Support both naming conventions (verified/isVerified)
      if ('verified' in voterData.updates) {
        updatedVoter.isVerified = voterData.updates.verified;
      }
      
      if ('isVerified' in voterData.updates) {
        updatedVoter.verified = voterData.updates.isVerified;
      }
      
      // Create the new voters array
      const updatedVoters = [...voters];
      updatedVoters[voterIndex] = updatedVoter;
      
      // Save to localStorage
      localStorage.setItem('voters', JSON.stringify(updatedVoters));
      
      return { 
        updatedVoter: voterData,
        allVoters: updatedVoters
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update voter');
    }
  }
);

export const submitVote = createAsyncThunk(
  'election/submitVote',
  async ({candidateId, voterId}, { getState, rejectWithValue }) => {
    try {
      // Get current state
      const { candidates, voters } = getState().election;
      
      // In a real app, this would call the smart contract to record the vote
      console.log("Submitting vote for candidate ID:", candidateId, "from voter:", voterId);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update candidate vote count
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.candidateId === candidateId) {
          return {
            ...candidate,
            voteCount: candidate.voteCount + 1
          };
        }
        return candidate;
      });
      
      // Mark voter as having voted
      const updatedVoters = voters.map(voter => {
        if (voter.id === voterId) {
          return {
            ...voter,
            hasVoted: true
          };
        }
        return voter;
      });
      
      // Save to localStorage
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      localStorage.setItem('voters', JSON.stringify(updatedVoters));
      
      return { 
        success: true, 
        candidateId,
        voterId,
        updatedCandidates,
        updatedVoters
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const electionSlice = createSlice({
  name: 'election',
  initialState: {
    electionDetails: null,
    candidates: [],
    voters: [],
    loading: false,
    votingStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    results: {
      totalVotes: 0,
      voterTurnout: 0,
    },
    error: null
  },
  reducers: {
    resetVotingStatus: (state) => {
      state.votingStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Election Details
      .addCase(fetchElectionDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchElectionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.electionDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchElectionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create or Update Election
      .addCase(createOrUpdateElection.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrUpdateElection.fulfilled, (state, action) => {
        state.loading = false;
        state.electionDetails = action.payload;
        state.error = null;
      })
      .addCase(createOrUpdateElection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Election State
      .addCase(updateElectionState.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateElectionState.fulfilled, (state, action) => {
        state.loading = false;
        state.electionDetails = action.payload;
        state.error = null;
      })
      .addCase(updateElectionState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
        
        // Calculate percentages for each candidate
        const totalVotes = action.payload.reduce((sum, candidate) => sum + candidate.voteCount, 0);
        
        if (totalVotes > 0) {
          state.candidates = state.candidates.map(candidate => ({
            ...candidate,
            percentage: Math.round((candidate.voteCount / totalVotes) * 100)
          }));
        }
        
        state.results.totalVotes = totalVotes;
        state.error = null;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Candidate
      .addCase(addCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.push(action.payload);
        state.error = null;
      })
      .addCase(addCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Candidate
      .addCase(updateCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.allCandidates;
        state.error = null;
      })
      .addCase(updateCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Candidate
      .addCase(deleteCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.allCandidates;
        state.error = null;
      })
      .addCase(deleteCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Voters
      .addCase(fetchVoters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVoters.fulfilled, (state, action) => {
        state.loading = false;
        state.voters = action.payload;
        state.error = null;
        
        // Calculate voter turnout
        const totalVoters = action.payload.length;
        const votedVoters = action.payload.filter(voter => voter.hasVoted).length;
        
        if (totalVoters > 0) {
          state.results.voterTurnout = Math.round((votedVoters / totalVoters) * 100);
        }
      })
      .addCase(fetchVoters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register Voter
      .addCase(registerVoter.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerVoter.fulfilled, (state, action) => {
        state.loading = false;
        state.voters.push(action.payload);
        state.error = null;
      })
      .addCase(registerVoter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Voter
      .addCase(addVoter.pending, (state) => {
        state.loading = true;
      })
      .addCase(addVoter.fulfilled, (state, action) => {
        state.loading = false;
        state.voters.push(action.payload);
        state.error = null;
      })
      .addCase(addVoter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Voter
      .addCase(updateVoter.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVoter.fulfilled, (state, action) => {
        state.loading = false;
        state.voters = action.payload.allVoters;
        state.error = null;
      })
      .addCase(updateVoter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Vote submission
      .addCase(submitVote.pending, (state) => {
        state.votingStatus = 'loading';
        state.loading = true;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.votingStatus = 'succeeded';
        state.loading = false;
        state.candidates = action.payload.updatedCandidates;
        state.voters = action.payload.updatedVoters;
        
        // Calculate percentages
        const totalVotes = state.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
        
        if (totalVotes > 0) {
          state.candidates = state.candidates.map(candidate => ({
            ...candidate,
            percentage: Math.round((candidate.voteCount / totalVotes) * 100)
          }));
        }
        
        state.results.totalVotes = totalVotes;
        state.results.voterTurnout = state.voters.length > 0
          ? Math.round((state.voters.filter(v => v.hasVoted).length / state.voters.length) * 100)
          : 0;
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.votingStatus = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetVotingStatus } = electionSlice.actions;
export default electionSlice.reducer;