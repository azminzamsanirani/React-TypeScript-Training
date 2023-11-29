// header.tsx
import React from 'react';
const logo = require('../assets/cadit_logo.png');

const Header: React.FC = () => {
  return (
    <div>
      <div style={{ backgroundColor: 'white', padding: '0' }}>
        <img src={logo} alt="Logo" style={{ maxWidth: '10%', height: '70px' }} />
      </div>
      <div style={{ backgroundColor: '#00718f', padding: '10px', textAlign: 'center' }}>
        <p style={{ color: 'white', margin: 0, fontSize: '18px' }}>Historical Currency</p>
      </div>
    </div>
  );
};

export default Header;
