"use client";
import Header from './Header';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

export default function ReturnFlightResults() {
    const [outboundFlight, setOutboundFlight] = useState(null);
    const [returnFlights, setReturnFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState('Top flights');
    const [resultsLimit, setResultsLimit] = useState(50);
    // const router = useRouter();
    const passengers = ["James Huang", "Abdallah Safa", "Jackson Lanier", "Jane Sun", "Vikash Singh"];

    useEffect(() => {
        const storedOutboundFlight = JSON.parse(localStorage.getItem('selectedOutboundFlight'));
        const storedFlightResults = JSON.parse(localStorage.getItem('flightResults'));

        if (storedOutboundFlight) {
            setOutboundFlight(storedOutboundFlight);
        }

        if (storedFlightResults?.return_flights) {
            setReturnFlights(storedFlightResults.return_flights);
        } else {
            console.error("No return flight data found.");
        }
        setIsLoading(false);
    }, []);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);

        const sortedData = [...returnFlights].sort((a, b) => {
            switch (e.target.value) {
                case 'Cheapest Price':
                    return a.price - b.price;
                case 'Earliest Departure Time': {
                    const earliestDateA = new Date(a.legs[0].departureDateTime).getTime();
                    const earliestDateB = new Date(b.legs[0].departureDateTime).getTime();
                    return earliestDateA - earliestDateB;
                }
                case 'Latest Departure Time': {
                    const latestDateA = new Date(a.legs[0].departureDateTime).getTime();
                    const latestDateB = new Date(b.legs[0].departureDateTime).getTime();
                    return latestDateB - latestDateA;
                }
                default:
                    return 0;
            }
        });

        setReturnFlights(sortedData);
    };



    const handleResultsLimitChange = (e) => {
        setResultsLimit(Number(e.target.value));
    };

    const handleSelectFlight = (flight) => {
        window.open(flight.url, '_blank');
    };

    const filteredFlights = Array.from(
        new Map(
            returnFlights.map((flight) => [
                `${flight.flightNumber}-${flight.legs[0].origin}-${flight.legs[0].destination}-${flight.legs[0].departureDateTime}`,
                flight,
            ])
        ).values()
    ).slice(0, resultsLimit);

    if (isLoading) {
        return <div>Loading... We are pulling up the return flight info right now. Please wait.</div>;
    }

    if (!returnFlights || returnFlights.length === 0) {
        return <div>No return flight data available. Please go back and search for flights again.</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <Header />

            <section style={styles.optionsSection}>
                <label htmlFor="sort" style={styles.optionLabel}>Sort by:</label>
                <select id="sort" value={sortOption} onChange={handleSortChange} style={styles.optionSelect}>
                    <option>Top Flights</option>
                    <option>Cheapest Price</option>
                    <option>Earliest Departure Time</option>
                    <option>Latest Departure Time</option>
                </select>
                <label htmlFor="resultsLimit" style={styles.optionLabel}>Show:</label>
                <select id="resultsLimit" value={resultsLimit} onChange={handleResultsLimitChange} style={styles.optionSelect}>
                    <option value={10}>10 flights</option>
                    <option value={20}>20 flights</option>
                    <option value={50}>50 flights</option>
                </select>
            </section>

            <div style={styles.content}>
                <aside style={styles.sidebar}>
                    <h3>People Going to {outboundFlight?.destination || "your destination"}</h3>
                    <ul>
                        {passengers.map((name, index) => (
                            <li key={index} style={styles.passengerItem}>{name}</li>
                        ))}
                    </ul>
                </aside>

                <main style={styles.resultsContainer}>
                    {filteredFlights.map((flight, index) => (
                        <div key={index} style={styles.flightCard}>
                            <div style={styles.flightLogo}>
                                <img src={flight.legs[0]?.logo || "/plane.png"} alt="Carrier Logo" style={styles.planeIcon} />
                            </div>

                            <div style={styles.flightDetails}>
                                <h4>VandyFlight Details:</h4>
                                <div style={styles.legContainer}>
                                    {flight.legs && flight.legs.map((leg, legIndex) => (
                                        <div key={legIndex} style={styles.legDetails}>
                                            <p style={styles.legRoute}><strong>{leg.origin} → {leg.destination}</strong></p>
                                            <p>Departure: {new Date(leg.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>Arrival: {new Date(leg.arrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p>Carrier: {leg.carrier}</p>
                                            <p>Flight Number: {leg.flightNumber}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
    pageContainer: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4e8f0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    optionsSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginTop: '10px',
    },
    optionLabel: {
        marginRight: '5px',
    },
    optionSelect: {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    content: {
        display: 'flex',
        gap: '20px',
        width: '80%',
        maxWidth: '1000px',
        marginTop: '20px',
    },
    sidebar: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '200px',
    },
    passengerItem: {
        listStyleType: 'none',
        padding: '8px 0',
        borderBottom: '1px solid #ddd',
    },
    resultsContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        flex: 1,
    },
    flightCard: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        margin: '10px 0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '800px',
    },
    flightLogo: {
        flex: '0 0 100px',
        marginRight: '20px',
    },
    planeIcon: {
        width: '80px',
        height: '80px',
    },
    flightDetails: {
        flex: '1 1 auto',
        textAlign: 'left' as const,
        padding: '0 15px',
    },
    legContainer: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '20px',
    },
    legDetails: {
        flex: '0 0 calc(50% - 20px)',
        marginBottom: '10px',
    },
    legRoute: {
        fontSize: '1.1em',
        fontWeight: 'bold',
    },
    priceSection: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        width: '100px',
    },
    price: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#333',
    },
    selectButton: {
        backgroundColor: '#0b8457',
        color: '#fff',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};
