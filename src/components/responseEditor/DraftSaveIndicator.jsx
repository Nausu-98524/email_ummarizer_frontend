// src/components/ResponseEditor/DraftSaveIndicator.jsx
import React from 'react';
import { FiCheck, FiLoader } from 'react-icons/fi';

const DraftSaveIndicator = ({ saveStatus, lastSaved }) => {
  const formatTimestamp = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 10) return 'just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="draft-save-indicator">
      {saveStatus === 'saving' && (
        <>
          <FiLoader className="spinner" />
          <span className="save-text">Saving draft...</span>
        </>
      )}
      
      {saveStatus === 'saved' && (
        <>
          <FiCheck className="check-icon" />
          <span className="save-text success">
            Draft saved {formatTimestamp(lastSaved)}
          </span>
        </>
      )}
      
      {saveStatus === 'error' && (
        <span className="save-text error">
          Failed to save draft
        </span>
      )}
    </div>
  );
};

export default DraftSaveIndicator;