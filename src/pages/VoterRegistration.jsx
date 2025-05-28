import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addVoter } from '../redux/electionSlice';
import { useAuth } from '../contexts/AuthContext';

const VoterRegistration = () => {
  const { address, userInfo, login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    email: '',
    address: '',
    dateOfBirth: '',
    agreeToTerms: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already registered
  useEffect(() => {
    if (userInfo) {
      if (userInfo.isVerified && userInfo.isRegistered) {
        navigate('/voter/dashboard');
      } else if (userInfo.isPending && userInfo.isRegistered) {
        navigate('/registration-pending');
      }
    }
  }, [userInfo, navigate]);

  const handleConnectWallet = async () => {
    if (!address) {
      try {
        await login();
      } catch (error) {
        toast.error('Failed to connect wallet. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'National ID is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if user is at least 18 years old
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'You must be at least 18 years old to register';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Physical address is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    if (!address) {
      newErrors.wallet = 'You must connect your wallet to register';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting');
      return;
    }
    
    setLoading(true);
    
    // Create new voter object with personal info
    const newVoter = {
      id: `VOT${Math.floor(Math.random() * 1000000)}`,
      walletAddress: address,
      registrationDate: new Date().toISOString(),
      hasVoted: false,
      verified: false,
      isVerified: false,
      isPending: true,
      isRegistered: true,
      personalInfo: {
        name: formData.fullName,
        nationalId: formData.nationalId,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        registrationDate: new Date().toISOString()
      }
    };
    
    // Dispatch the addVoter action
    dispatch(addVoter(newVoter))
      .unwrap()
      .then(() => {
        setLoading(false);
        toast.success('Registration submitted successfully');
        navigate('/registration-pending');
      })
      .catch((error) => {
        setLoading(false);
        toast.error(`Registration failed: ${error}`);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Voter Registration</h2>
            <p className="mt-1 text-indigo-200">Register to participate in secure blockchain voting</p>
          </div>
          
          <div className="px-6 py-8">
            <div className="mb-8 p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Why register as a voter?</h3>
              <ul className="list-disc pl-5 text-sm text-blue-700">
                <li>Participate in secure, tamper-proof elections</li>
                <li>Verify your vote was correctly recorded and counted</li>
                <li>Vote remotely while maintaining security and privacy</li>
                <li>Help ensure democratic integrity through blockchain technology</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Connect Wallet</h3>
                {address && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Wallet Connected
                  </span>
                )}
              </div>
              
              <div className={`mt-2 p-4 border rounded-md ${address ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                {address ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Connected Address:</span>
                      <span className="ml-2 text-gray-600">
                        {address.substring(0, 6)}...{address.substring(address.length - 4)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">
                      To register as a voter, you need to connect your Ethereum wallet.
                    </p>
                    <button
                      type="button"
                      onClick={handleConnectWallet}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
                {errors.wallet && <p className="mt-2 text-sm text-red-600">{errors.wallet}</p>}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.fullName ? 'border-red-300' : ''
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                    National ID Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="nationalId"
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.nationalId ? 'border-red-300' : ''
                      }`}
                      placeholder="ID12345678"
                    />
                    {errors.nationalId && <p className="mt-2 text-sm text-red-600">{errors.nationalId}</p>}
                  </div>
                </div>
              
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.dateOfBirth ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.dateOfBirth && <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.email ? 'border-red-300' : ''
                      }`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.phoneNumber ? 'border-red-300' : ''
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phoneNumber && <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>}
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Physical Address
                </label>
                <div className="mt-1">
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.address ? 'border-red-300' : ''
                    }`}
                    placeholder="123 Main St, City, State, Zip"
                  />
                  {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={`focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ${
                      errors.agreeToTerms ? 'border-red-300' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                    I agree to the terms and privacy policy
                  </label>
                  <p className="text-gray-500">
                    By registering, you confirm that all provided information is accurate and your identity can be verified by the Election Commission.
                  </p>
                  {errors.agreeToTerms && <p className="mt-2 text-sm text-red-600">{errors.agreeToTerms}</p>}
                </div>
              </div>
              
              <div className="flex justify-between pt-5 border-t border-gray-200">
                <Link
                  to="/login"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back to Login
                </Link>
                <button
                  type="submit"
                  disabled={loading || !address}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    loading || !address ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterRegistration;