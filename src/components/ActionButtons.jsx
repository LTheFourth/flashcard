import React from 'react';

function ActionButtons() {
  const handleProgressClick = () => {
    const progressEvent = new CustomEvent('showProgress', { detail: {} });
    window.dispatchEvent(progressEvent);
  };

  const handleResetClick = () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      window.dispatchEvent(new CustomEvent('resetProgress', { detail: {} }));
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button 
        onClick={handleProgressClick}
        style={{ 
          background: 'transparent', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '8px'
        }}
      >
        <i className="fas fa-chart-line"></i>
        Progress
      </button>
      <button 
        onClick={handleResetClick}
        style={{ 
          background: 'transparent', 
          color: 'white', 
          border: 'none',
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        <i className="fas fa-redo"></i>
      </button>
    </div>
  );
}

export default ActionButtons;
