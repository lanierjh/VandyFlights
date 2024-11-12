"use client";
import Header from './Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function FlightResults() {
    const [flightData, setFlightData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchData, setSearchData] = useState({
        origin: 'BNA',
        destination: '',
        departureDate: '',
        returnDate: '',
        roundTrip: 'true',
    });
    const [sortOption, setSortOption] = useState('Top flights');
    const [resultsLimit, setResultsLimit] = useState(50);
    const router = useRouter();
    const todayDate = new Date().toISOString().split("T")[0];

    const passengers = ["James Huang", "Abdallah Safa", "Jackson Lanier", "Jane Sun", "Vikash Singh"];

    useEffect(() => {
        const storedFlightData = JSON.parse(localStorage.getItem('flightResults'));
        if (storedFlightData) {
            // Adjusting to handle both one-way and round-trip data formats
            setFlightData(storedFlightData?.outbound_flights || storedFlightData?.flights || []);
        }
        setIsLoading(false);
    }, []);
    
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
    
        if (!searchData.destination || !searchData.departureDate) {
            alert("Please provide a valid destination and departure date.");
            return;
        }

        const updatedSearchData = {
            ...searchData,
            roundTrip: searchData.returnDate ? 'true' : 'false',
        };
        
        setSearchData(updatedSearchData);
        setIsLoading(true);
    
        try {
            const endpoint = updatedSearchData.roundTrip === 'true' ? "flightsROUNDTRIP" : "flightsONEWAY";
            const response = await axios.post(`http://localhost:8001/${endpoint}`, {
                origin: updatedSearchData.origin,
                destination: updatedSearchData.destination,
                departureDate: updatedSearchData.departureDate,
                returnDate: updatedSearchData.returnDate,
                roundTrip: updatedSearchData.roundTrip === 'true',
            });
    
            localStorage.setItem('flightResults', JSON.stringify(response.data));
            setFlightData(response.data.outbound_flights || response.data.flights || []);
        } catch (error) {
            console.error("Error fetching flights:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const handleSearchChange = (e) => {
        const { name, value } = e.target;
    
        setSearchData((prevData) => {
            if (name === 'returnDate' && value === '') {
                return { ...prevData, returnDate: '', roundTrip: 'false' };
            }
            return { ...prevData, [name]: value };
        });
    };
    
    const handleSelectFlight = (flight) => {
        if (searchData.roundTrip === 'true') {
            try {
                const flightData = {
                    flight_number: flight.flightNumber,      
                    start: flight.origin,
                    destination: flight.destination,
                    departure: flight.departureDateTime,
                    arrival: flight.arrivalDateTime,
                    departure_time: new Date(flight.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    arrival_time: new Date(flight.arrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    price: flight.price,
                };
                // const response = fetch('http://localhost:8000/addFlight', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(flightData),
                // });
                // if (!response) {
                //     throw new Error(`HTTP error! status: ${response}`);
                // }
            } catch (error) {
                console.error('Error storing to the database:', error);
            }
            localStorage.setItem('selectedOutboundFlight', JSON.stringify(flight));
            router.push('/returnflightresults');
        } else {
            try {
                const flightData = {
                    flight_number: flight.flightNumber,       
                    start: flight.origin,
                    destination: flight.destination,
                    departure: flight.departureDateTime,
                    arrival: flight.arrivalDateTime,
                    departure_time: new Date(flight.departureDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    arrival_time: new Date(flight.arrivalDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    price: flight.price.toFixed(2),
                };
                // const response = fetch('http://localhost:8000/addFlight', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(flightData),
                // });
                // if (!response) {
                //     throw new Error(`HTTP error! status: ${response}`);
                // }
   
                window.open(flight.url, '_blank');
            } catch (error) {
                console.error('Error storing to the database:', error);
            }
        }
    };
    
    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        if (flightData) {
            const sortedData = [...flightData].sort((a, b) => {
                switch (e.target.value) {
                    case 'Cheapest Price':
                        return a.price - b.price;
                    case 'Earliest Departure Time': {
                        const earliestDateA = new Date(a.legs[0].departureDateTime);
                        const earliestDateB = new Date(b.legs[0].departureDateTime);
                        return earliestDateA - earliestDateB;
                    }
                    case 'Latest Departure Time': {
                        const latestDateA = new Date(a.legs[0].departureDateTime);
                        const latestDateB = new Date(b.legs[0].departureDateTime);
                        return latestDateB - latestDateA;
                    }
                    default:
                        return 0;
                }
            });
            setFlightData(sortedData);
        }
    };
    
    const handleResultsLimitChange = (e) => {
        setResultsLimit(Number(e.target.value));
    };


    const filteredFlights = Array.from(
        new Map(
            flightData.map((flight) => [
                `${flight.flightNumber}-${flight.legs[0].origin}-${flight.legs[0].destination}-${flight.legs[0].departureDateTime}`,
                flight,
            ])
        ).values()
    ).slice(0, resultsLimit);    

    if (isLoading) {
        return <div>Loading... We are pulling up the flight info right now. Hope you find the flight you're looking for!</div>;
    }

    if (!flightData || flightData.length === 0) {
        return <div>No flight data available. Please go back and search for flights again.</div>;
    }


    return (
        <div style={styles.pageContainer}>
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
        backgroundColor: '#F1D6D9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    searchSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '20px 0',
        width: '80%',
        maxWidth: '800px',
    },
    searchForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
    },
    searchInput: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '20%',
        minWidth: '130px',
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
        flexDirection: 'column',
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
        textAlign: 'left',
        padding: '0 15px',
    },
    legContainer: {
        display: 'flex',
        flexWrap: 'wrap',
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
        flexDirection: 'column',
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