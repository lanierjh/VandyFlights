"use client";
import Header from './Header';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReturnFlightResults() {
    const [flightData, setFlightData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchData, setSearchData] = useState({
        origin: '',
        destination: 'BNA', // Assume this is the user's return airport
        departureDate: '',
        returnDate: '',
        roundTrip: 'true',
    });
    const [sortOption, setSortOption] = useState('Top flights');
    const [resultsLimit, setResultsLimit] = useState(50); 

    useEffect(() => {
        const storedSearchData = JSON.parse(localStorage.getItem('searchData'));
        const storedOutboundFlight = JSON.parse(localStorage.getItem('selectedOutboundFlight'));

        if (storedSearchData && storedOutboundFlight) {
            setSearchData({
                origin: storedSearchData.destination, // set origin as destination from outbound
                destination: storedSearchData.origin, // set destination as origin from outbound
                departureDate: storedSearchData.returnDate, // return date as departure for return leg
                roundTrip: 'false',
            });
        }

        const fetchReturnFlights = async () => {
            setIsLoading(true);
            try {
                const response = await axios.post(`http://localhost:8001/flightsROUNDTRIP`, {
                    origin: storedSearchData.destination,
                    destination: storedSearchData.origin,
                    departureDate: storedSearchData.returnDate,
                    roundTrip: 'false',
                });
                console.log("Return Flight Data Response:", response.data);
                setFlightData(response.data);
            } catch (error) {
                console.error("Error fetching return flights:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (storedSearchData && storedSearchData.returnDate) {
            fetchReturnFlights();
        }
    }, []);

    const handleSelectFlight = (flight) => {
        window.open(flight.url, '_blank');
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
        return <div>Loading... We are pulling up the return flight info right now.</div>;
    }

    if (!flightData || !flightData.flights || flightData.flights.length === 0) {
        return <div>No return flight data available. Please go back and search for flights again.</div>;
    }

    return (
        <div style={styles.container}>
            <Header />
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

            <main style={styles.resultsContainer}>
                {filteredFlights.map((flight, index) => (
                    <div key={index} style={styles.flightCard}>
                        <div style={styles.flightLogo}>
                            <img src={flight.logo || "/plane.png"} alt="Carrier Logo" style={styles.planeIcon} />
                        </div>

                        <div style={styles.flightDetails}>
                            <p style={styles.flightTime}><strong>{new Date(flight.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(flight.arrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                            <p style={styles.flightDuration}>{Math.floor((new Date(flight.arrivalDateTime) - new Date(flight.departureDateTime)) / (1000 * 60 * 60))} hr {((new Date(flight.arrivalDateTime) - new Date(flight.departureDateTime)) / (1000 * 60)) % 60} min</p>
                            <p style={styles.flightRoute}>{flight.origin} - {flight.destination}</p>
                            <p style={styles.flightCarrier}>{flight.carrier} - Flight {flight.flightNumber}</p>
                            <p style={styles.flightStops}>{flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                        </div>

                        <div style={styles.priceSection}>
                            <p style={styles.price}>${flight.price}</p>
                            <button style={styles.selectButton} onClick={() => handleSelectFlight(flight)}>Select</button>
                        </div>
                    </div>
                ))}
            </main>
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
        width: '100px',
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
