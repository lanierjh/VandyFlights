import { useState } from 'react';

export default function MainPage() {
    const [searchData, setSearchData] = useState({
        origin: 'Nashville (BNA)',
        destination: '',
        departureDate: '',
        returnDate: '',
        roundTrip: 'true',
    });

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({ ...searchData, [name]: value });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Handle search submission logic, perhaps call an API with searchData
        console.log('Search Data:', searchData);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', padding: '20px' }}>
            {/* Header Section */}
            <header style={{
                backgroundColor: '#f3d9db', 
                padding: '10px 0',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '20px',
            }}>
                <h1 style={{ marginLeft: '20px', color: '#2f2f2f' }}>VandyFlights</h1>
                <nav style={{ marginRight: '20px' }}>
                    <a href="/" style={{ margin: '0 10px' }}>Home</a>
                    <a href="/chat" style={{ margin: '0 10px' }}>Chat</a>
                    <a href="/profile" style={{ margin: '0 10px' }}>Profile</a>
                    <a href="/logout" style={{ margin: '0 10px' }}>Log Out</a>
                </nav>
            </header>

            {/* Main Section */}
            <main style={{ marginTop: '30px' }}>
                {/* Search Section */}
                <section style={{
                    backgroundImage: `url('/nashville.jpg')`,
                    backgroundSize: 'cover',
                    padding: '100px 0',
                    textAlign: 'center',
                    color: 'white',
                }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Explore the world with your Vandy community</h2>
                    <form onSubmit={handleSearchSubmit} style={{ marginTop: '30px' }}>
                        <input
                            type="text"
                            name="origin"
                            value={searchData.origin}
                            readOnly
                            style={{
                                padding: '15px',
                                borderRadius: '10px',
                                border: 'none',
                                margin: '0 10px',
                                width: '15%',
                            }}
                        />
                        <input
                            type="text"
                            name="destination"
                            placeholder="Destination"
                            onChange={handleSearchChange}
                            style={{
                                padding: '15px',
                                borderRadius: '10px',
                                border: 'none',
                                margin: '0 10px',
                                width: '15%',
                            }}
                        />
                        <input
                            type="date"
                            name="departureDate"
                            onChange={handleSearchChange}
                            style={{
                                padding: '15px',
                                borderRadius: '10px',
                                border: 'none',
                                margin: '0 10px',
                                width: '15%',
                            }}
                        />
                        
                        {/* Conditionally render the return date input based on round-trip selection */}
                        {searchData.roundTrip === 'true' && (
                            <input
                                type="date"
                                name="returnDate"
                                onChange={handleSearchChange}
                                style={{
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    margin: '0 10px',
                                    width: '15%',
                                }}
                            />
                        )}
                        
                        <select
                            name="roundTrip"
                            onChange={handleSearchChange}
                            style={{
                                padding: '15px',
                                borderRadius: '10px',
                                border: 'none',
                                margin: '0 10px',
                                width: '15%',
                            }}
                        >
                            <option value="true">Round-trip</option>
                            <option value="false">One-way</option>
                        </select>
                        
                        <button type="submit" style={{
                            padding: '15px 30px',
                            backgroundColor: '#6b4c4c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}>Search</button>
                    </form>
                </section>

                {/* Popular Destinations Section */}
                <section style={{ marginTop: '50px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '20px' }}>Popular Destinations</h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            maxWidth: '300px',
                            minWidth: '250px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/newyork.png"
                                alt="New York"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                            />
                            <h4>New York, NY</h4>
                            <p>100 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '300px',
                            minWidth: '250px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/losangeles.jpg"
                                alt="Los Angeles"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                            />
                            <h4>Los Angeles, LA</h4>
                            <p>80 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '300px',
                            minWidth: '250px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/miami.jpg"
                                alt="Miami"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                            />
                            <h4>Miami, FL</h4>
                            <p>60 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '300px',
                            minWidth: '250px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/chicago.jpg"
                                alt="Chicago"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                            />
                            <h4>Chicago, IL</h4>
                            <p>40 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '300px',
                            minWidth: '250px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/lasvegas.jpg"
                                alt="Las Vegas"
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                }}
                            />
                            <h4>Las Vegas, NV</h4>
                            <p>20 others are going</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
