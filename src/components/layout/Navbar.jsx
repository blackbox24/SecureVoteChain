// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { userInfo, address, login, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Helper to check if a route is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Format wallet address for display
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  const handleLoginClick = async () => {
    if (address) {
      logout();
    } else {
      await login();
    }
  };

  return (
    <nav className="bg-indigo-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-5a3 3 0 110-6 3 3 0 010 6zm0-4a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
              <span className="ml-2 text-xl font-bold">SecureVoteChain</span>
            </Link>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') && !isActive('/voter') && !isActive('/ec') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
              Home
            </Link>
            
            <Link to="/admin-login" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin-login') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
              EC Login
            </Link>
            
            {userInfo && userInfo.isAdmin && (
              <Link to="/ec/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/ec') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
                EC Dashboard
              </Link>
            )}
            
            {userInfo && !userInfo.isAdmin && userInfo.isVerified && (
              <Link to="/voter/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/voter') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
                Voter Dashboard
              </Link>
            )}
            
            {address && userInfo && !userInfo.isRegistered && (
              <Link to="/register" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/register') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
                Register as Voter
              </Link>
            )}
            
            {userInfo && userInfo.isPending && (
              <Link to="/registration-pending" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/registration-pending') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}>
                Registration Status
              </Link>
            )}
            
            <button
              onClick={handleLoginClick}
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-500"
            >
              {address ? 'Disconnect' : 'Connect Wallet'}
            </button>
            
            {address && (
              <div className="px-3 py-1 rounded-full bg-indigo-700 text-xs">
                {formatAddress(address)}
              </div>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-indigo-300 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') && !isActive('/voter') && !isActive('/ec') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            <Link 
              to="/admin-login" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin-login') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              EC Login
            </Link>
            
            {userInfo && userInfo.isAdmin && (
              <Link 
                to="/ec/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/ec') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                EC Dashboard
              </Link>
            )}
            
            {userInfo && !userInfo.isAdmin && userInfo.isVerified && (
              <Link 
                to="/voter/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/voter') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Voter Dashboard
              </Link>
            )}
            
            {address && userInfo && !userInfo.isRegistered && (
              <Link 
                to="/register" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/register') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register as Voter
              </Link>
            )}
            
            {userInfo && userInfo.isPending && (
              <Link 
                to="/registration-pending" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/registration-pending') ? 'bg-indigo-900' : 'hover:bg-indigo-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Registration Status
              </Link>
            )}
            
            <button
              onClick={() => {
                handleLoginClick();
                setIsMenuOpen(false);
              }}
              className="w-full text-left mt-2 block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 hover:bg-indigo-500"
            >
              {address ? 'Disconnect' : 'Connect Wallet'}
            </button>
            
            {address && (
              <div className="px-3 py-1 mt-2 rounded-full bg-indigo-700 text-sm inline-block">
                {formatAddress(address)}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;