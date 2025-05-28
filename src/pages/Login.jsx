import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, userInfo, loading, address, registrationStatus } = useAuth();
  const navigate = useNavigate();

  // Handle redirects based on user status
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/ec/dashboard');
      } else if (userInfo.isVerified && userInfo.isRegistered) {
        navigate('/voter/dashboard');
      } else if (userInfo.isPending && userInfo.isRegistered) {
        navigate('/registration-pending');
      } else if (!userInfo.isRegistered) {
        toast.info('You need to register as a voter to access the system');
        // We don't redirect here, allowing the registration message to display on login page
      }
    }
  }, [userInfo, navigate, registrationStatus]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
          <svg className="h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm0-5a3 3 0 110-6 3 3 0 010 6zm0-4a1 1 0 100-2 1 1 0 000 2zm0 8a1 1 0 100-2 1 1 0 000 2z"/>
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
          <div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Authentication Options</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Connect your wallet to authenticate your identity and access the platform's features.
                </p>
              </div>

              <div className="border-t border-b border-gray-200 py-6">
                <button
                  onClick={login}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Connecting...' : address ? 'Wallet Connected' : 'Connect Wallet'}
                </button>
                
                {address && (
                  <div className="mt-3 text-sm text-center">
                    <span className="font-medium">Connected Address:</span> 
                    <span className="text-gray-500 ml-2">
                      {address.substring(0, 6)}...{address.substring(address.length - 4)}
                    </span>
                  </div>
                )}

                {loading && (
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                )}
              </div>
              
              {/* Registration options for unregistered users */}
              {address && userInfo && !userInfo.isRegistered && !loading && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-medium text-yellow-800">Not Registered</h4>
                  </div>
                  <p className="mt-2 text-sm text-yellow-700">
                    Your wallet is not registered as a voter. Please register to participate in elections.
                  </p>
                  <Link
                    to="/register"
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Register Now
                  </Link>
                </div>
              )}
              
              {/* Message for pending verification */}
              {address && userInfo && userInfo.isPending && !loading && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-medium text-blue-800">Verification Pending</h4>
                  </div>
                  <p className="mt-2 text-sm text-blue-700">
                    Your voter registration is being reviewed by the Electoral Commission.
                  </p>
                  <Link
                    to="/registration-pending"
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Check Status
                  </Link>
                </div>
              )}

              <div className="text-sm text-gray-500">
                <h4 className="font-medium text-gray-900 mb-2">Why connect a wallet?</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Secure authentication without passwords</li>
                  <li>Tamper-proof voting with blockchain verification</li>
                  <li>Complete control over your identity</li>
                  <li>Privacy protection through cryptographic security</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Need help?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <p>
                Don't have a blockchain wallet?{' '}
                <a href="https://metamask.io/" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Get started with MetaMask
                </a>
              </p>
              <p className="mt-2">
                Need an Electoral Commission account?{' '}
                <Link to="/admin-login" className="font-medium text-indigo-600 hover:text-indigo-500">
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