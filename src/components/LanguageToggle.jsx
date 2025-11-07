import React from 'react';

function LanguageToggle({ isChineseFirst, onChange }) {
  const handleLanguageChange = (e) => {
    const checked = e.target.checked;
    console.log('Language mode changed to:', checked ? 'Chinese First' : 'Vietnamese First');
    onChange(checked);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <i className="fas fa-language"></i>
      <span style={{ fontWeight: '500' }}>Language Mode</span>
      <label style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        cursor: 'pointer'
      }}>
        <input 
          type="checkbox" 
          checked={isChineseFirst} 
          onChange={handleLanguageChange}
          style={{ display: 'none' }}
        />
        <div style={{
          width: '50px',
          height: '24px',
          background: isChineseFirst ? '#52c41a' : '#1894d6',
          borderRadius: '12px',
          position: 'relative',
          transition: 'background 0.3s'
        }}>
          <div style={{
            position: 'absolute',
            top: '2px',
            left: isChineseFirst ? '26px' : '2px',
            width: '20px',
            height: '20px',
            background: 'white',
            borderRadius: '50%',
            transition: 'left 0.3s'
          }}></div>
        </div>
        <span style={{ fontSize: '12px' }}>
          {isChineseFirst ? '中文' : 'Tiếng Việt'}
        </span>
      </label>
    </div>
  );
}

export default LanguageToggle;
