import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log("Retrieved token:", token);

        if (!token) {
            router.push('/');
        }
    }, [router]);
    
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
        const updatedSearchData = {
            ...searchData,
            roundTrip: searchData.returnDate ? 'true' : 'false',
        };
        
        console.log("Submitting search data:", updatedSearchData);
        try {
            const endpoint = updatedSearchData.roundTrip === 'true' ? "flightsROUNDTRIP" : "flightsONEWAY";
            const response = await axios.post(`http://localhost:8000/${endpoint}`, {
                origin: updatedSearchData.origin,
                destination: updatedSearchData.destination,
                departureDate: updatedSearchData.departureDate,
                returnDate: updatedSearchData.returnDate,
                roundTrip: updatedSearchData.roundTrip === 'true',
            });
            localStorage.setItem('flightResults', JSON.stringify(response.data));
            router.push('/flightResults');
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    const handlePopularDestinationClick = async (destination) => {
        const departureDate = new Date().toISOString().split("T")[0];
        const returnDate = new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split("T")[0];
        try {
            const response = await axios.post('http://localhost:8000/flightsROUNDTRIP', {
                origin: searchData.origin,
                destination,
                departureDate,
                returnDate,
                roundTrip: true,
            });
            console.log("Flight Data Response:", response.data);
            if (response.data && (response.data.outbound_flights || response.data.flights)) {
                localStorage.setItem('flightResults', JSON.stringify(response.data));
                router.push('/flightResults');
            } else {
                alert("No flights found for this search.");
            }
        } catch (error) {
            console.error("Error fetching flights:", error);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <Header />
            <section style={styles.searchSection}>
                <h2 style={styles.mainHeading}>Discover Your Next Adventure With Your Vandy Family</h2>
                <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
                    <input
                        type="text"
                        name="origin"
                        value={searchData.origin}
                        readOnly
                        style={styles.searchInput}
                    />
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            name="destination"
                            placeholder="Destination"
                            onChange={handleSearchChange}
                            value={searchData.destination}
                            style={styles.searchInput}
                        />
                        {airportSuggestions.length > 0 && (
                            <ul style={styles.suggestionsDropdown}>
                                {airportSuggestions.map((airport) => (
                                    <li
                                        key={airport.codeIataAirport}
                                        onClick={() => handleAirportSelect(airport)}
                                        style={styles.suggestionItem}
                                    >
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
                        style={styles.searchInput}
                    />
                    {searchData.roundTrip === 'true' && (
                        <input
                            type="date"
                            name="returnDate"
                            onChange={handleSearchChange}
                            min={searchData.departureDate || todayDate}
                            style={styles.searchInput}
                        />
                    )}
                    <select
                        name="roundTrip"
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                    >
                        <option value="true">Round-trip</option>
                        <option value="false">One-way</option>
                    </select>
                    <button type="submit" style={styles.searchButton}>Search</button>
                </form>
            </section>

            <section style={styles.popularDestinationsSection}>
                <h3 style={styles.popularHeading}>Popular Destinations</h3>
                <div style={styles.destinationsContainer}>
                    {popularDestinations.map((destination) => (
                        <div
                            key={destination.code}
                            style={styles.destinationCard}
                            onClick={() => handlePopularDestinationClick(destination.code)}
                        >
                            <img src={destination.image} alt={destination.name} style={styles.destinationImage} />
                            <h4>{destination.name}</h4>
                            <p>{destination.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const popularDestinations = [
    { code: 'LGA', name: 'New York, NY', description: '100 others are going', image: '/newyork.png' },
    { code: 'LAX', name: 'Los Angeles, CA', description: '80 others are going', image: '/losangeles.jpg' },
    { code: 'MIA', name: 'Miami, FL', description: '60 others are going', image: '/miami.jpg' },
    { code: 'ORD', name: 'Chicago, IL', description: '40 others are going', image: '/chicago.jpg' },
    { code: 'LAS', name: 'Las Vegas, NV', description: '20 others are going', image: '/lasvegas.jpg' },
];

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
        backgroundImage: `url('/nashville.jpg')`,
        backgroundSize: 'cover',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '1200px',
        marginBottom: '30px',
    },
    mainHeading: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    searchForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap',
    },
    searchInput: {
        padding: '15px',
        borderRadius: '10px',
        border: 'none',
        width: '15%',
        minWidth: '130px',
    },
    inputContainer: {
        position: 'relative',
        width: '15%',
        margin: '0 10px',
        display: 'inline-block',
    },
    suggestionsDropdown: {
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
        maxHeight: '150px',
    },
    suggestionItem: {
        padding: '10px',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',
    },
    searchButton: {
        padding: '15px 30px',
        backgroundColor: '#6b4c4c',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    popularDestinationsSection: {
        textAlign: 'center',
        width: '100%',
        maxWidth: '1200px',
        marginTop: '10px',
    },
    popularHeading: {
        fontSize: '2rem',
        marginBottom: '20px',
        fontWeight: 'bold',
    },
    destinationsContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '10px',
        flexWrap: 'wrap',
    },
    destinationCard: {
        flex: '1 1 18%',
        maxWidth: '250px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        textAlign: 'center',
    },
    destinationImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '10px',
    },
};

