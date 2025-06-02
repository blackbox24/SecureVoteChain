// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';

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
      navigate('/');
    } else {
      await login();
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-900">SecureVoteChain</span>
            </Link>
          </div>

          <div className="flex items-center">
            {address ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">{formatAddress(address)}</span>
                </div>
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Connect Wallet
              </Link>
            )}
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