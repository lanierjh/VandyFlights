// Header.tsx
import React from 'react';

export default function Header() {
  return (
    <header style={{
      backgroundColor: '#F1D6D9', 
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '2px solid #ccc',
    }}>
      {/* Logo Section */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/vanderbilt.png" alt="VandyFlights Logo" style={{ width: '60px', marginRight: '10px' }} />
        <h1 style={{ color: '#000', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>VandyFlights</h1>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/mainPage" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Home</a>
        <a href="/chat" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Chat</a>
        <a href="/editProfile" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Profile</a>
        <a href="/" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Log Out</a>
      </nav>
    </header>
  );
}
