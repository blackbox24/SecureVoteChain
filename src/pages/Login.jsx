import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, address, userInfo, loading, registrationStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/ec/dashboard');
      } else if (userInfo.isVerified) {
        navigate('/voter/dashboard');
      }
    } else if (address && registrationStatus === 'pending') {
      navigate('/registration-pending');
    }
  }, [userInfo, address, registrationStatus, navigate]);

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg className="h-16 w-16 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-5a3 3 0 110-6 3 3 0 010 6zm0-4a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connect to SecureVoteChain
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Use your blockchain wallet to authenticate securely and access the voting system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : address ? 'Wallet Connected' : 'Connect Wallet'}
              </button>
            </div>

            {!address && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">First time here?</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Register as a voter
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Why use a blockchain wallet?</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                <li>Secure, password-free authentication</li>
                <li>Tamper-proof voting record</li>
                <li>Full control over your identity</li>
                <li>Transparent vote verification</li>
              </ul>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                Don't have a blockchain wallet?{' '}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Get started with MetaMask
                </a>
              </p>
              <p className="mt-2">
                Need an Electoral Commission account?{' '}
                <Link
                  to="/admin-login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in as EC Administrator
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;