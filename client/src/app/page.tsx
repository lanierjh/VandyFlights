'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import './globals.css';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null); // Ref for the text width
  const [buttonWidth, setButtonWidth] = useState('auto'); // Dynamic button width

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Update button width based on text width
      if (textRef.current) {
        setButtonWidth(`${textRef.current.offsetWidth}px`);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row', // Row on larger screens, column on mobile
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100vh', // Full viewport height
    width: '100vw', // Full viewport width
    padding: '0 2vw', // Prevent content from touching screen edges
    boxSizing: 'border-box',
  };

  const logoStyle: React.CSSProperties = {
    position: isMobile ? 'absolute' : 'static', // Move to top of the screen on mobile
    top: isMobile ? '20px' : 'auto', // Add margin from the top on mobile
    left: isMobile ? '50%' : 'auto', // Center horizontally on mobile
    transform: isMobile ? 'translateX(-50%)' : 'none', // Align center on mobile
    zIndex: 3, // Ensure it appears above other elements
    marginBottom: isMobile ? '0' : '20px', // Add margin on larger screens
  };

  const photoStyle: React.CSSProperties = {
    flex: '1', // Take half the screen when not mobile
    textAlign: 'center',
    marginBottom: isMobile ? '20px' : '0',
  };

  const contentStyle: React.CSSProperties = {
    flex: '1',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // For stacking logo above buttons on mobile
  };

  const buttonStyle: React.CSSProperties = {
    width: buttonWidth, // Match button width to the text
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '15px 30px',
    borderRadius: '30px',
    border: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '15px',
  };

  const registerButton: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#9b4a46',
  };

  return (
    <div style={containerStyle}>
      {!isMobile && (
        <div style={photoStyle}>
          <Image
            src="/zeppos.jpg"
            alt="Zeppos Tower"
            width={400}
            height={600}
            style={{ borderRadius: '20px', maxWidth: '100%' }}
          />
        </div>
      )}
      <div style={contentStyle}>
        <div style={logoStyle}>
          <Image
            src="/VandyFlightsLogo.png"
            alt="VandyFlights Logo"
            width={isMobile ? 120 : 150} // Smaller logo on mobile
            height={isMobile ? 120 : 150}
          />
        </div>
        <h1 ref={textRef} style={{ fontWeight: 'bold', marginBottom: '30px' }}>
          VandyFlights
        </h1>
        <a href="/login">
          <button style={buttonStyle}>Log In</button>
        </a>
        <a href="/register">
          <button style={registerButton}>Register</button>
        </a>
      </div>
    </div>
  );
}

//code without logo
// 'use client';
//
// import Image from 'next/image';
// import React, { useState, useEffect } from 'react';
// import './globals.css';
//
// export default function Home() {
//   const [isMobile, setIsMobile] = useState(false);
//
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     handleResize(); // Set initial state
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//
//   const containerStyle: React.CSSProperties = {
//     display: 'flex',
//     flexDirection: isMobile ? 'column' : 'row', // Stack items on mobile
//     alignItems: 'center',
//     justifyContent: 'space-around', // Space between photo and buttons
//     height: '100vh', // Full viewport height
//     width: '100vw', // Full viewport width
//     padding: '0 2vw', // Add small padding to prevent edge overflow
//     boxSizing: 'border-box',
//   };
//
//   const photoStyle: React.CSSProperties = {
//     flex: isMobile ? 'none' : '1', // Take half the screen when not mobile
//     textAlign: 'center',
//     marginBottom: isMobile ? '20px' : '0', // Add spacing on mobile
//   };
//
//   const contentStyle: React.CSSProperties = {
//     flex: isMobile ? 'none' : '1', // Take half the screen when not mobile
//     textAlign: 'center',
//   };
//
//   const logInButton: React.CSSProperties = {
//     width: isMobile ? '70%' : '50%', // Adjust button width based on screen size
//     backgroundColor: '#1e3a8a',
//     color: 'white',
//     padding: '15px 30px',
//     borderRadius: '30px',
//     border: 'none',
//     fontSize: '1.2rem',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     marginBottom: '15px', // Add space between buttons
//   };
//
//   const registerButton: React.CSSProperties = {
//     ...logInButton,
//     backgroundColor: '#9b4a46',
//   };
//
//   return (
//     <div style={containerStyle}>
//       {!isMobile && (
//         <div style={photoStyle}>
//           <Image
//             src="/zeppos.jpg"
//             alt="Vanderbilt Tower"
//             width={400}
//             height={600}
//             style={{ borderRadius: '20px', maxWidth: '100%' }}
//           />
//         </div>
//       )}
//       <div style={contentStyle}>
//         <h1 style={{ fontWeight: 'bold', marginBottom: '30px' }}>VandyFlights</h1>
//         <a href="/login">
//           <button style={logInButton}>Log In</button>
//         </a>
//         <div></div>
//         <a href="/register">
//           <button style={registerButton}>Register</button>
//         </a>
//       </div>
//     </div>
//   );
// }

//og code

// import Image from 'next/image';
// import './globals.css';
//
// export default function Home() {
//   const homeContent = {
//     height: '50vh',
//     marginTop: '25vh',
//   };
//
//   const rightSide = {
//     height: "50%",
//     marginTop: "4%"
//   }
//
//   const logInButton = {
//     width: "30%",
//     backgroundColor: "#1e3a8a",
//     color: "white",
//     padding: "15px 30px",
//     borderRadius: "30px",
//     border: "none",
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//   }
//
//   const registerButton = {
//     width: "30%",
//     backgroundColor: "#9b4a46",
//     color: "white",
//     padding: "15px 30px",
//     borderRadius: "30px",
//     border: "none",
//     fontSize: "1.2rem",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//   }
//
//   const vanderbiltPlaneRow = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '200px',
//   };
//
//   return (
//     <div className="row" id="HomeContent" style={homeContent}>
//       <div className="col-sm-2"></div>
//       <div className="col-sm-3">
//         <div >
//           <Image
//             src="/zeppos.jpg"
//             alt="Vanderbilt Tower"
//             width={300}
//             height={450}
//               style={{ borderRadius: "20px" }}
//             />
//           </div>
//         </div>
//         <div className="col-sm-1">
//           <div style={vanderbiltPlaneRow}>
//             <Image
//               src="/vanderbilt.png"
//               alt="Vanderbilt Logo"
//               width={100}
//               height={50}
//             />
//
//             <svg height="600" width="300">
//             <path
//               d="M0 250 Q 50 0 65 250"
//               stroke="gray"
//               strokeWidth="4"
//               fill="transparent"
//               strokeDasharray="5,5"
//             />
//           </svg>
//
//           <Image
//             src="/plane.png"
//             alt="Airplane Logo"
//             width={100}
//             height={50}
//           />
//           </div>
//       </div>
//       <div className="col-sm-4 text-center" style={rightSide}>
//         <h1 className="my-5" style={{ fontWeight: 'bold' }}>VandyFlights</h1>
//         <div className="my-5">
//           <a href="/login">
//           <button className="p-3" style={logInButton}>Log In</button>
//           </a>
//         </div>
//         <div className="my-5">
//           <a href="/register">
//             <button className="p-3" style={registerButton}>Register</button>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }
