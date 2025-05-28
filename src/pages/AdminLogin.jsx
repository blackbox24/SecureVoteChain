// src/pages/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const { address, login, userInfo, loading } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  // Admin wallet addresses for testing
  const adminWallets = [
    "0xEC00000000000000000000000000000000000001",
    "0xEC00000000000000000000000000000000000002"
  ];

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate('/ec/dashboard');
    } else if (userInfo && !userInfo.isAdmin && address) {
      setMessage('This wallet address does not have Electoral Commission privileges.');
    }
  }, [userInfo, navigate, address]);

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg className="h-16 w-16 text-indigo-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-5a3 3 0 110-6 3 3 0 010 6zm0-4a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Electoral Commission Login</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connect your Electoral Commission wallet to manage the election
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {message}
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">For Testing Purposes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use one of the following wallet addresses to login as an Electoral Commission member:
            </p>
            <div className="bg-gray-50 rounded-md p-3 mb-4 font-mono text-xs">
              {adminWallets.map((wallet, index) => (
                <div key={index} className="mb-1 break-all">{wallet}</div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Note: In a real-world scenario, only authorized EC members would have access.
            </p>
          </div>
          
          <div>
            <button
              onClick={handleConnect}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {address ? 'Switch Wallet' : 'Connect Wallet'}
            </button>
          </div>
          
          {address && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Connected address:</p>
              <p className="mt-1 text-sm font-medium text-gray-800 break-all">{address}</p>
            </div>
          )}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;