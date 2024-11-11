import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from './Header';

export default function MainPage() {
    const [searchData, setSearchData] = useState({
        origin: 'BNA',
        destination: '',
        departureDate: '',
        returnDate: '',
        roundTrip: 'true',
    });

    const [airportSuggestions, setAirportSuggestions] = useState([]); 
    const router = useRouter();
    const todayDate = new Date().toISOString().split("T")[0];

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
    
        setSearchData((prevData) => {
            if (name === "roundTrip" && value === "false") {
                return { ...prevData, [name]: value, returnDate: "" };
            }
            return { ...prevData, [name]: value };
        });
    };
    

    const handleAirportSelect = (airport) => {
        setSearchData({ ...searchData, destination: `${airport.nameAirport} (${airport.codeIataAirport})` });
        setAirportSuggestions([]); 
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
    
        if (!searchData.destination || !searchData.departureDate) {
            alert("Please provide a valid destination and departure date.");
            return;
        }
    
        // Set roundTrip to false if returnDate is empty
        const updatedSearchData = {
            ...searchData,
            roundTrip: searchData.returnDate ? searchData.roundTrip : 'false',
        };
    
        console.log("Submitting search data:", updatedSearchData);
    
        if (updatedSearchData.roundTrip === 'true') {
            try {
                const response = await axios.post('http://localhost:8001/flightsROUNDTRIP', {
                    origin: updatedSearchData.origin,
                    destination: updatedSearchData.destination,
                    departureDate: updatedSearchData.departureDate,
                    returnDate: updatedSearchData.returnDate,
                    roundTrip: updatedSearchData.roundTrip === 'true',
                });
                console.log("Flight Data Response:", response.data);
    
                localStorage.setItem('flightResults', JSON.stringify(response.data));
                router.push('/flightResults');
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:8001/flightsONEWAY', {
                    origin: updatedSearchData.origin,
                    destination: updatedSearchData.destination,
                    departureDate: updatedSearchData.departureDate,
                    roundTrip: false,
                });
                console.log("Flight Data Response:", response.data);
    
                localStorage.setItem('flightResults', JSON.stringify(response.data));
                router.push('/flightResults');
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        }
    };
    

    const handlePopularDestinationClick = async (destination) => {
        const departureDate = new Date().toISOString().split("T")[0];
        const returnDate = new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split("T")[0];
        
        try {
            const response = await axios.post('http://localhost:8001/flightsROUNDTRIP', {
                origin: searchData.origin,
                destination,
                departureDate,
                returnDate,
                roundTrip: true,
            });
            console.log("Flight Data Response:", response.data);
    
            // Store the flight results in localStorage
            localStorage.setItem('flightResults', JSON.stringify(response.data));
    
            // Navigate to the flightResults page
            router.push('/flightResults');
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const imageStyle = {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '10px',
    };

    return (
        <div style={styles.container}>
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
                            min={todayDate}
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
                                min={searchData.departureDate || todayDate}
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
                            cursor: 'pointer',
                        }}onClick={() => handlePopularDestinationClick('LGA')}
                        >
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
                            cursor: 'pointer',
                        }}onClick={() => handlePopularDestinationClick('LAX')}
                        >
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
                            cursor: 'pointer',
                        }}onClick={() => handlePopularDestinationClick('MIA')}
                        >
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
                            cursor: 'pointer',
                        }}
                        onClick={() => handlePopularDestinationClick('ORD')}
                        >
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
                            cursor: 'pointer',
                        }}
                        onClick={() => handlePopularDestinationClick('LAS')}
                        >
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

const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#F1D6D9', 
      minHeight: '100vh',
    },
};