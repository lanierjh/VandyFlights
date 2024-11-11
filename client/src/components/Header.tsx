// Header.tsx
import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";


export default function Header() {
    const router = useRouter();

    const handleLogout= () => {
    // Remove the access token from local storage
    localStorage.removeItem('accessToken');
    console.log("token removed, redirecting to root...")
    // Redirect to the root page
    router.push('/');
  };

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
        <button onClick={handleLogout} style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Log Out</button>
      </nav>
    </header>
  );
}
