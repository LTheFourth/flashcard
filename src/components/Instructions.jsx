import React from 'react';

function Instructions() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '16px',
      padding: '8px 0',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      marginTop: '12px',
      fontSize: '12px',
      opacity: 0.8,
      flexWrap: 'wrap'
    }}>
      <span>
        <i className="fas fa-undo"></i> Swipe Left: Recall
      </span>
      <span>
        <i className="fas fa-check"></i> Swipe Right: Remembered
      </span>
      <span>
        <i className="fas fa-sync"></i> Click: Flip Card
      </span>
    </div>
  );
}

export default Instructions;
