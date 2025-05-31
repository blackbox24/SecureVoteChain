// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAddress, useDisconnect, useConnect, useMetamask } from '@thirdweb-dev/react';
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
  
  // Admin wallet addresses
  const adminAddresses = [
    "0xEC00000000000000000000000000000000000001",
    "0xEC00000000000000000000000000000000000002",
    "0x64E01a30a963206345bE12DEcEcDA08d78c9a2a5"
  ];

  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      
      try {
        if (address) {
          // Check if user is admin
          const adminStatus = adminAddresses.map(addr => addr.toLowerCase())
            .includes(address.toLowerCase());
          setIsAdmin(adminStatus);
          
          if (adminStatus) {
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isAuthenticated', 'true');
            
            setUserInfo({
              address,
              isAdmin: true,
              hasVoted: false,
              voterId: "EC-ADMIN"
            });
            setRegistrationStatus('admin');
          } else {
            // Check if address is registered as a voter
            const voterRecord = voters.find(voter => 
              voter.walletAddress && 
              voter.walletAddress.toLowerCase() === address.toLowerCase()
            );
            
            if (voterRecord) {
              const isVerified = voterRecord.verified || voterRecord.isVerified;
              const isPending = voterRecord.isPending !== undefined ? voterRecord.isPending : !isVerified;
              const isRegistered = voterRecord.isRegistered !== undefined ? voterRecord.isRegistered : true;
              
              if (isVerified) {
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
                });
                setRegistrationStatus('verified');
              } else if (isPending) {
                setRegistrationStatus('pending');
              } else {
                setRegistrationStatus('unregistered');
              }
            } else {
              setRegistrationStatus('unregistered');
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
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask to connect your wallet');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }
      
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
      toast.error(error.message || "Failed to connect wallet");
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