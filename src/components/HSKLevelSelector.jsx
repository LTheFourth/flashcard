import React from 'react';

function HSKLevelSelector({ value, onChange }) {
  const handleHskChange = (e) => {
    const newValue = e.target.value;
    console.log('HSK Level changed to:', newValue);
    onChange(newValue);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <i className="fas fa-graduation-cap"></i>
      <span style={{ fontWeight: '500' }}>HSK Level</span>
      <select 
        value={value} 
        onChange={handleHskChange}
        style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          border: 'none',
          background: 'rgba(255,255,255,0.9)',
          color: '#333'
        }}
      >
        <option value="hsk3">📚 HSK 3</option>
        <option value="hsk4">📖 HSK 4</option>
      </select>
    </div>
  );
}

export default HSKLevelSelector;
