// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAddress, useDisconnect, useMetamask, useContract } from '@thirdweb-dev/react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();
  
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Get voters data from Redux store
  const { voters } = useSelector(state => state.election);
  
  // For development purposes - mock voter registration contract
  // In production, this would be replaced with actual contract calls
  const adminAddresses = [
    "0xEC00000000000000000000000000000000000001",
    "0xEC00000000000000000000000000000000000002",
    "0x64E01a30a963206345bE12DEcEcDA08d78c9a2a5" // User-provided admin wallet address
  ];

  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      
      try {
        if (address) {
          // Check if user is admin
          const adminStatus = adminAddresses.includes(address);
          setIsAdmin(adminStatus);
          
          // Store role in localStorage for protected routes
          if (adminStatus) {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isAuthenticated', 'true');
            
            setUserInfo({
              address,
              isAdmin: true,
              hasVoted: false, // Admins don't vote
              voterId: "EC-ADMIN" // Special admin ID
            });
            setRegistrationStatus('admin');
          } else {
            // Check if address is registered as a voter in the Redux store
            const voterRecord = voters.find(voter => 
              voter.walletAddress && 
              voter.walletAddress.toLowerCase() === address.toLowerCase()
            );
            
            if (voterRecord) {
              // Check verification status using either naming convention (verified or isVerified)
              const isVerified = voterRecord.verified || voterRecord.isVerified;
              const isPending = voterRecord.isPending !== undefined ? voterRecord.isPending : !isVerified;
              const isRegistered = voterRecord.isRegistered !== undefined ? voterRecord.isRegistered : true;
              
              if (isVerified) {
                // Verified voter
                localStorage.setItem('userRole', 'voter');
                localStorage.setItem('isAuthenticated', 'true');
                
                setUserInfo({
                  address,
                  isAdmin: false,
                  voterId: voterRecord.id,
                  hasVoted: voterRecord.hasVoted,
                  fullName: voterRecord.personalInfo?.name || voterRecord.fullName,
                  isVerified: true,
                  isPending: false,
                  isRegistered: true
                });
                setRegistrationStatus('verified');
              } else if (isPending && isRegistered) {
                // Voter registration pending verification
                setUserInfo({
                  address,
                  isAdmin: false,
                  voterId: voterRecord.id,
                  isPending: true,
                  isRegistered: true,
                  isVerified: false
                });
                setRegistrationStatus('pending');
                
                localStorage.removeItem('userRole');
                localStorage.removeItem('isAuthenticated');
              } else {
                // Registered but not verified or pending (unusual state)
                setUserInfo({
                  address,
                  isAdmin: false,
                  voterId: voterRecord.id,
                  isPending: isPending,
                  isRegistered: isRegistered,
                  isVerified: isVerified
                });
                setRegistrationStatus('unknown');
                
                localStorage.removeItem('userRole');
                localStorage.removeItem('isAuthenticated');
              }
            } else {
              // User is not registered
              setUserInfo({
                address,
                isRegistered: false,
                isVerified: false,
                isPending: false
              });
              setRegistrationStatus('unregistered');
              
              localStorage.removeItem('userRole');
              localStorage.removeItem('isAuthenticated');
            }
          }
        } else {
          // No wallet connected
          setUserInfo(null);
          setIsAdmin(false);
          setRegistrationStatus(null);
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAuthenticated');
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        toast.error("Error authenticating with blockchain");
      } finally {
        setLoading(false);
      }
    };
    
    checkUserStatus();
  }, [address, voters]);
  
  const login = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
      toast.error("Failed to connect wallet");
    }
  };
  
  const logout = () => {
    disconnect();
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    setUserInfo(null);
    setRegistrationStatus(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        address,
        userInfo,
        isAdmin,
        loading,
        login,
        logout,
        registrationStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;