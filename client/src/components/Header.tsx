// // Header.tsx
import React, {useEffect,useState} from 'react';
// import React from 'react';
import {useRouter} from "next/navigation";
import Image from 'next/image';

//
//
// export default function Header() {
//     const router = useRouter();
//
//     const handleLogout= () => {
//     // Remove the access token from local storage
//     localStorage.removeItem('accessToken');
//     console.log("token removed, redirecting to root...")
//     // Redirect to the root page
//     router.push('/');
//   };
//
//   return (
//     <header style={{
//       backgroundColor: "#f4e8f0",
//       textAlign: 'center',
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: '20px',
//         border: '1px solid red',
//     }}>
//       {/* Logo Section */}
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <img src="/vanderbilt.png" alt="VandyFlights Logo" style={{ width: '60px', marginRight: '10px' }} />
//         <h1 style={{ color: '#000', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>VandyFlights</h1>
//       </div>
//
//       {/* Navigation Links */}
//       <nav style={{ display: 'flex', alignItems: 'center' }}>
//         <a href="/mainPage" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Home</a>
//         <a href="/chat" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Chat</a>
//         <a href="/editProfile" style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>Profile</a>
//         <button onClick={handleLogout} style={{ margin: '0 20px', fontSize: '1.1rem', color: '#000', textDecoration: 'none', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>Log Out</button>
//       </nav>
//     </header>
//   );
// }
export default function Header() {
    const router = useRouter();
    const [margin, setMargin] = useState(20); // Default margin is 20

    useEffect(() => {
        const handleResize = () => {
            setMargin(window.innerWidth < 768 ? 10 : 20);
        };

        // Set initial margin
        handleResize();

        // Update margin on resize
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize); // Cleanup
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        console.log("Token removed, redirecting to root...");
        router.push("/");
    };

    return (
        <>
            {/* Inline styles with media query */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .header-title {
                        display: none;
                    }
                }
            `}</style>

            <header
                style={{
                    backgroundColor: "#f4e8f0",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                {/* Logo Section */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                        src="/vanderbilt.png"
                        alt="VandyFlights Logo"
                        style={{ width: "60px", marginRight: "10px" }}
                    />
                    <h1 className="header-title" style={{ color: "#000", fontSize: "1.8rem", fontWeight: "bold", margin: 0 }}>
                        VandyFlights
                    </h1>
                </div>

                {/* Navigation Links */}
                <nav style={{ display: "flex", alignItems: "center" }}>
                    <a
                        href="/mainPage"
                        style={{
                            margin: `0 ${margin}px`,
                            fontSize: "1.1rem",
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Home
                    </a>
                    <a
                        href="/chat"
                        style={{
                            margin: `0 ${margin}px`,
                            fontSize: "1.1rem",
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Chat
                    </a>
                    <a
                        href="/editProfile"
                        style={{
                            margin: `0 ${margin}px`,
                            fontSize: "1.1rem",
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Profile
                    </a>
                    <button
                        onClick={handleLogout}
                        style={{
                            margin: `0 ${margin}px`,
                            fontSize: "1.1rem",
                            color: "#000",
                            textDecoration: "none",
                            fontWeight: "bold",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Log Out
                    </button>
                </nav>
            </header>
        </>
    );
}
