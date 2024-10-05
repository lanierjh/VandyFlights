import { useState } from 'react';
import axios from 'axios';
import FlightResults from './FlightResults';
import Header from './Header';

export default function MainPage() {
    const [searchData, setSearchData] = useState({
        origin: 'Nashville (BNA)',
        destination: '',
        departureDate: '',
        returnDate: '',
        roundTrip: 'true',
    });

    const [showResults, setShowResults] = useState(false);
    const [airportSuggestions, setAirportSuggestions] = useState([]); // To store airport suggestions

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({ ...searchData, [name]: value });
        
        // Fetch airport suggestions if the user is typing in the "destination" field
        if (name === 'destination') {
            fetchAirportSuggestions(value);
        }
    };

    const fetchAirportSuggestions = async (query) => {
        if (query.length > 2) { // Only fetch suggestions if query is longer than 2 characters
            try {
                // Replace with a real API endpoint and API key for fetching airport data
                const response = await axios.get(`https://aviation-edge.com/v2/public/airportDatabase?key=YOUR_API_KEY&codeIataAirport=${query}`);
                const data = await response.json();
                if (data) {
                    setAirportSuggestions(data);
                }
            } catch (error) {
                console.error('Error fetching airport data:', error);
            }
        } else {
            setAirportSuggestions([]);
        }
    };

    const handleAirportSelect = (airport) => {
        setSearchData({ ...searchData, destination: `${airport.nameAirport} (${airport.codeIataAirport})` });
        setAirportSuggestions([]); // Clear suggestions after selection
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setShowResults(true);
        console.log('Search Data:', searchData);
    };

    if (showResults) {
        return <FlightResults searchData={searchData} />;
    }

    const imageStyle = {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '10px',
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#dfd0d5', padding: '20px', minHeight: '100vh' }}>
            <Header />

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
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Discover Your Next Adventure With Your Vandy Family</h2>
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
                        <div style={{ position: 'relative', width: '15%', margin: '0 10px', display: 'inline-block' }}>
                            <input
                                type="text"
                                name="destination"
                                placeholder="Destination"
                                onChange={handleSearchChange}
                                value={searchData.destination}
                                style={{
                                    padding: '15px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    width: '100%',
                                }}
                            />
                            {/* Suggestions Dropdown */}
                            {airportSuggestions.length > 0 && (
                                <ul style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    zIndex: 1000,
                                    listStyle: 'none',
                                    padding: '0',
                                    margin: '0',
                                    borderRadius: '10px',
                                    overflowY: 'auto',
                                    maxHeight: '150px'
                                }}>
                                    {airportSuggestions.map((airport) => (
                                        <li key={airport.codeIataAirport} 
                                            onClick={() => handleAirportSelect(airport)} 
                                            style={{
                                                padding: '10px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #ccc'
                                            }}>
                                            {airport.nameAirport} ({airport.codeIataAirport})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
                <section style={{ marginTop: '10px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: 'bold' }}>Popular Destinations</h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            maxWidth: '250px',
                            minWidth: '200px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/newyork.png"
                                alt="New York"
                                style={imageStyle}
                            />
                            <h4>New York, NY</h4>
                            <p>100 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '250px',
                            minWidth: '200px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/losangeles.jpg"
                                alt="Los Angeles"
                                style={imageStyle}
                            />
                            <h4>Los Angeles, LA</h4>
                            <p>80 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '250px',
                            minWidth: '200px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/miami.jpg"
                                alt="Miami"
                                style={imageStyle}
                            />
                            <h4>Miami, FL</h4>
                            <p>60 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '250px',
                            minWidth: '200px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/chicago.jpg"
                                alt="Chicago"
                                style={imageStyle}
                            />
                            <h4>Chicago, IL</h4>
                            <p>40 others are going</p>
                        </div>

                        <div style={{
                            maxWidth: '250px',
                            minWidth: '200px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <img
                                src="/lasvegas.jpg"
                                alt="Las Vegas"
                                style={imageStyle}
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
