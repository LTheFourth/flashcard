import React, { useState, useEffect } from 'react';
import HSKLevelSelector from './components/HSKLevelSelector.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import ActionButtons from './components/ActionButtons.jsx';
import Instructions from './components/Instructions.jsx';

function App() {
  const [hskLevel, setHskLevel] = useState('hsk3');
  const [isChineseFirst, setIsChineseFirst] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Notify parent component of settings changes
  useEffect(() => {
    const settings = { hskLevel, isChineseFirst };
    console.log('Settings changed:', settings);
    
    // Trigger custom event for vanilla JS to listen to
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));
  }, [hskLevel, isChineseFirst]);

  const handleHskLevelChange = (newLevel) => {
    setHskLevel(newLevel);
  };

  const handleLanguageChange = (newLanguageState) => {
    setIsChineseFirst(newLanguageState);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`react-settings-bar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ 
        margin: '16px', 
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #30D5C8 0%, #26B5A8 100%)',
        color: 'white',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        flexDirection : 'column',
        alignItems: 'center', 
        padding: isCollapsed ? '8px 16px' : '16px',
        cursor: 'pointer'
      }}
      onClick={toggleCollapse}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          margin : '10px',
        }}>
          <i 
            className={`fas fa-${isCollapsed ? 'chevron-down' : 'chevron-up'}`}
            style={{ 
              fontSize: '14px',
              transition: 'transform 0.3s ease'
            }}
          />
          <span style={{ 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {isCollapsed ? 'Show Settings' : 'Hide Settings'}
          </span>
        </div>
        
        {!isCollapsed && (
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            alignItems: 'center', 
            flexWrap: 'wrap'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <HSKLevelSelector 
              value={hskLevel} 
              onChange={handleHskLevelChange} 
            />
            <LanguageToggle 
              isChineseFirst={isChineseFirst} 
              onChange={handleLanguageChange} 
            />
          </div>
        )}
      </div>
      
      {!isCollapsed && (
        <div 
          style={{ 
            padding: '0 16px 16px',
            animation: 'slideDown 0.3s ease'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ActionButtons />
        </div>
      )}
    </div>
  );
}

export default App;
