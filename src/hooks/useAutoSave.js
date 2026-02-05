// src/hooks/useAutoSave.js
import { useEffect, useRef, useState } from 'react';

const useAutoSave = (value, onSave, delay = 30000) => {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [lastSaved, setLastSaved] = useState(null);
  const timeoutRef = useRef(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    // Don't auto-save if value hasn't changed
    if (value === previousValueRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await onSave(value);
        setSaveStatus('saved');
        setLastSaved(new Date());
        previousValueRef.current = value;
      } catch (error) {
        console.error('Auto-save error:', error);
        setSaveStatus('error');
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSave, delay]);

  // Manual save function
  const manualSave = async () => {
    try {
      setSaveStatus('saving');
      await onSave(value);
      setSaveStatus('saved');
      setLastSaved(new Date());
      previousValueRef.current = value;
    } catch (error) {
      console.error('Manual save error:', error);
      setSaveStatus('error');
    }
  };

  return { saveStatus, lastSaved, manualSave };
};

export default useAutoSave;