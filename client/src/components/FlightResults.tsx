"use client";
import Header from './Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function FlightResults() {
    const [flightData, setFlightData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchData, setSearchData] = useState({
        origin: 'BNA',
        destination: '',
        departureDate: '',
        returnDate: '',
        roundTrip: 'true',
    });
    const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
    const [sortOption, setSortOption] = useState('Top flights');
    const [resultsLimit, setResultsLimit] = useState(50); 
    const router = useRouter();
    const todayDate = new Date().toISOString().split("T")[0];

    const passengers = ["James Huang", "Abdallah Safa", "Jackson Lanier", "Jane Sun", "Vikash Singh"];

    useEffect(() => {
        const storedFlightData = localStorage.getItem('flightResults');
        if (storedFlightData) {
            setFlightData(JSON.parse(storedFlightData));
        }
        setIsLoading(false);
    }, []);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData({ ...searchData, [name]: value });
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchData.destination || !searchData.departureDate) {
            alert("Please provide a valid destination and departure date.");
            return;
        }
        
        setIsLoading(true);
        try {
            const endpoint = searchData.roundTrip === 'true' ? "flightsROUNDTRIP" : "flightsONEWAY";
            const response = await axios.post(`http://localhost:8000/${endpoint}`, {
                origin: searchData.origin,
                destination: searchData.destination,
                departureDate: searchData.departureDate,
                returnDate: searchData.returnDate,
                roundTrip: searchData.roundTrip,
            });
            console.log("Flight Data Response:", response.data);
            localStorage.setItem('flightResults', JSON.stringify(response.data));
            localStorage.setItem('searchData', JSON.stringify(searchData));
            setFlightData(response.data);
        } catch (error) {
            console.error("Error fetching flights:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectFlight = (flight) => {
        if (searchData.roundTrip === 'false') {
            window.open(flight.url, '_blank');
        } else {
            setSelectedOutboundFlight(flight);
            localStorage.setItem('selectedOutboundFlight', JSON.stringify(flight));
            router.push('/returnflightresults');
        }
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        if (flightData) {
            const sortedData = [...flightData.flights].sort((a, b) => {
                switch (e.target.value) {
                    case 'Price':
                        return a.price - b.price;
                    case 'Departure time':
                        return new Date(a.departureDateTime) - new Date(b.departureDateTime);
                    case 'Arrival time':
                        return new Date(a.arrivalDateTime) - new Date(b.arrivalDateTime);
                    default:
                        return 0;
                }
            });
            setFlightData({ ...flightData, flights: sortedData });
        }
    };

    const handleResultsLimitChange = (e) => {
        setResultsLimit(Number(e.target.value));
    };

    const filteredFlights = flightData?.flights.slice(0, resultsLimit);

    if (isLoading) {
        return <div>Loading... We are pulling up the flight info right now. Hope you find the flight you're looking for!</div>;
    }

    if (!flightData || !flightData.flights || flightData.flights.length === 0) {
        return <div>No flight data available. Please go back and search for flights again.</div>;
    }

    return (
        <div style={styles.container}>
            <Header />
            <section style={styles.searchSection}>
                <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                    <input
                        type="text"
                        name="origin"
                        value={searchData.origin}
                        readOnly
                        style={styles.searchInput}
                    />
                    <input
                        type="text"
                        name="destination"
                        placeholder="Destination"
                        onChange={handleSearchChange}
                        value={searchData.destination}
                        style={styles.searchInput}
                    />
                    <input
                        type="date"
                        name="departureDate"
                        onChange={handleSearchChange}
                        value={searchData.departureDate}
                        min={todayDate}
                        style={styles.searchInput}
                    />
                    {searchData.roundTrip === 'true' && (
                        <input
                            type="date"
                            name="returnDate"
                            onChange={handleSearchChange}
                            value={searchData.returnDate}
                            min={searchData.departureDate || todayDate}
                            style={styles.searchInput}
                        />
                    )}
                    <select
                        name="roundTrip"
                        onChange={handleSearchChange}
                        value={searchData.roundTrip}
                        style={styles.searchInput}
                    >
                        <option value="true">Round-trip</option>
                        <option value="false">One-way</option>
                    </select>
                    <button type="submit" style={styles.searchButton}>Search</button>
                </form>
            </section>

            <section style={styles.sortSection}>
                <label htmlFor="sort" style={styles.sortLabel}>Sort by:</label>
                <select id="sort" value={sortOption} onChange={handleSortChange} style={styles.sortSelect}>
                    <option>Top flights</option>
                    <option>Price</option>
                    <option>Departure time</option>
                    <option>Arrival time</option>
                </select>
                <label htmlFor="resultsLimit" style={styles.resultsLimitLabel}>Show:</label>
                <select id="resultsLimit" value={resultsLimit} onChange={handleResultsLimitChange} style={styles.resultsLimitSelect}>
                    <option value={10}>10 flights</option>
                    <option value={20}>20 flights</option>
                    <option value={50}>50 flights</option>
                </select>
            </section>

            <div style={styles.content}>
                <aside style={styles.sidebar}>
                    <h3>People Going to {searchData.destination}</h3>
                    <ul>
                        {passengers.map((name, index) => (
                            <li key={index} style={styles.passengerItem}>{name}</li>
                        ))}
                    </ul>
                </aside>

                <main style={styles.resultsContainer}>
                    {filteredFlights.map((flight, index) => (
                        <div key={index} style={styles.flightCard}>
                            {/* Left section for logo */}
                            <div style={styles.flightLogo}>
                                <img src={flight.logo || "/plane.png"} alt="Carrier Logo" style={styles.planeIcon} />
                            </div>

                            {/* Middle section for flight details */}
                            <div style={styles.flightDetails}>
                                <p style={styles.flightTime}><strong>{new Date(flight.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(flight.arrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                                <p style={styles.flightDuration}>{Math.floor((new Date(flight.arrivalDateTime) - new Date(flight.departureDateTime)) / (1000 * 60 * 60))} hr {((new Date(flight.arrivalDateTime) - new Date(flight.departureDateTime)) / (1000 * 60)) % 60} min</p>
                                <p style={styles.flightRoute}>{flight.origin} - {flight.destination}</p>
                                <p style={styles.flightCarrier}>{flight.carrier} - Flight {flight.flightNumber}</p>
                                <p style={styles.flightStops}>{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                            </div>

                            {/* Right section for price and select button */}
                            <div style={styles.priceSection}>
                                <p style={styles.price}>${flight.price}</p>
                                <button style={styles.selectButton} onClick={() => handleSelectFlight(flight)}>Select</button>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#F1D6D9',
        minHeight: '100vh',
        padding: '20px',
    },
    searchSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '20px auto',
        width: '90%',
        maxWidth: '700px',
    },
    searchForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    searchInput: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '18%',
        minWidth: '120px',
    },
    searchButton: {
        padding: '10px 20px',
        backgroundColor: '#6b4c4c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    sortSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
        gap: '10px',
    },
    sortLabel: {
        marginRight: '5px',
    },
    sortSelect: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    resultsLimitLabel: {
        marginLeft: '15px',
    },
    resultsLimitSelect: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    content: {
        display: 'flex',
        gap: '20px',
        marginTop: '20px',
    },
    sidebar: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '250px',
    },
    passengerItem: {
        listStyleType: 'none',
        padding: '8px 0',
        borderBottom: '1px solid #ddd',
    },
    flightInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    flightIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    resultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    flightCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px 0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '700px',
    },
    flightLogo: {
        flex: '0 0 auto',
        marginRight: '20px',
    },
    planeIcon: {
        width: '100px', // Increased size for the logo
        height: '100px',
    },
    flightDetails: {
        flex: '1 1 auto',
        textAlign: 'center',
    },
    flightTime: {
        fontSize: '1.2em',
        fontWeight: 'bold',
    },
    flightDuration: {
        fontSize: '1em',
        color: '#666',
    },
    flightRoute: {
        fontSize: '1em',
        color: '#333',
    },
    flightCarrier: {
        fontSize: '1em',
        color: '#333',
        fontStyle: 'italic',
    },
    flightStops: {
        fontSize: '0.9em',
        color: '#999',
    },
    priceSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    price: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#333',
    },
    selectButton: {
        backgroundColor: '#0b8457',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
};
