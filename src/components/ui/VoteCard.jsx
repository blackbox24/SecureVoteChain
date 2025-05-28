// src/components/ui/VoteCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

const VoteCard = ({ candidate, isSelected, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-shadow hover:shadow-lg ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
      }`}
      onClick={onSelect}
    >
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              src={candidate.imageReference || '/assets/images/avatar-placeholder.png'} 
              alt={candidate.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/avatar-placeholder.png';
              }}
            />
          </div>
          <div className="ml-4">
            <h3 className="font-medium text-lg">{candidate.name}</h3>
            <p className="text-sm text-gray-500">{candidate.party}</p>
          </div>
          <div className="ml-auto">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'border-indigo-600 bg-indigo-600' 
                : 'border-gray-300'
            }`}>
              {isSelected && (
                <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">{candidate.information}</p>
        </div>
        
        {isSelected && (
          <div className="mt-4 bg-indigo-50 p-2 rounded-md text-sm text-indigo-700 flex items-center">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Selected for your vote
          </div>
        )}
      </div>
    </div>
  );
};

VoteCard.propTypes = {
  candidate: PropTypes.shape({
    candidateId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    information: PropTypes.string,
    imageReference: PropTypes.string,
    party: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default VoteCard;