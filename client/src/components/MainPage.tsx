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

    const [gridColumns, setGridColumns] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            setGridColumns(window.innerWidth <= 768 ? 2 : 4); // Switch between 2 or 4 columns
        };

        handleResize(); // Check initial screen size
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize); // Cleanup
    }, []);
    useEffect(() => {
        // Check if accessToken is in localStorage
        const token = localStorage.getItem('accessToken');
        console.log("Retrieved token:", token);

        if (!token) {
            // Redirect to login if token is missing
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
                <style jsx>{`
                    @media (max-width: 480px) {
                        .search-form {
                            grid-template-columns: 1fr; /* Stack inputs vertically */
                            gap: 15px; /* Adjust spacing */
                        }
                    }
                `}</style>
                    <div style={styles.stackContainer}>
                        <label style={styles.inputLabel}>Departure Airport</label>
                        <input
                            type="text"
                            name="origin"
                            value="BNA"
                            readOnly
                            style={styles.searchInput}
                        />
                        <label style={styles.inputLabel}>Arrival Airport</label>
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

                    {/* Departure and Return Dates */}
                    <div style={styles.stackContainer}>
                        <label style={styles.inputLabel}>Departure Date</label>
                        <input
                            type="date"
                            name="departureDate"
                            onChange={handleSearchChange}
                            min={todayDate}
                            style={styles.searchInput}
                        />
                            <label style={{
                                ...styles.inputLabel,
                                visibility: searchData.roundTrip === 'true' ? 'visible' : 'hidden', // Valid CSS value
                            }}
                            >
                                Return Date
                            </label>
                            <input
                                type="date"
                                name="returnDate"
                                onChange={handleSearchChange}
                                min={searchData.departureDate || todayDate}
                                style={{
                                    ...styles.searchInput,
                                    visibility: searchData.roundTrip === 'true' ? 'visible' : 'hidden', // Valid CSS value
                            }}
                            />

                    </div>
                    <div style={styles.stackContainer}>
                    {/* Round-Trip Selector */}
                        <label style={styles.inputLabel}>Trip Type</label>
                        <select
                        name="roundTrip"
                        onChange={handleSearchChange}
                        style={styles.tripSelector}
                    >
                        <option value="true">Round-trip</option>
                        <option value="false">One-way</option>
                    </select>

                    {/* Search Button */}
                    <div style={styles.spacer}/>
                        <button type="submit" style={styles.searchButton}>
                        Search
                        </button>
                    </div>

                </form>
            </section>

            <section style={styles.popularDestinationsSection}>
                <h3 style={styles.popularHeading}>Popular Destinations</h3>
                <div
                    style={{
                        ...styles.destinationsContainer,
                        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                    }}
                >
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
];

const styles = {
    pageContainer: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4e8f0',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    searchSection: {
        background: `linear-gradient(rgba(216,191,216, 0.5), rgba(216,191,216, 0.5)), url('/nashville.jpg')`,
        backgroundSize: 'cover',
        padding: '80px 20px',
        textAlign: 'center' as const,
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
    // searchForm: {
    //     display: 'flex',
    //     flexWrap: 'wrap', // Allows wrapping to the next line
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     gap: '10px', // Consistent spacing
    //     width: '100%',
    //     maxWidth: '1200px'
    // },
    // searchInput: {
    //
    //     padding: '15px',
    //     borderRadius: '10px',
    //     border: '1px solid #ccc',
    //     flex: '1 1 15%',
    //     minWidth: '150px', // Prevents inputs from getting too small
    //     maxWidth: '250px',
    // },
    // inputContainer: {
    //     position: 'relative' as const,
    //     flex: '1 1 15%', // Matches other inputs for uniform layout
    //     minWidth: '150px',
    //     maxWidth: '250px',
    // },
    suggestionsDropdown: {
        position: 'absolute' as const,
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
        overflowY: 'auto' as const,
        maxHeight: '150px',
    },
    suggestionItem: {
        padding: '10px',
        cursor: 'pointer',
        borderBottom: '1px solid #ccc',
    },
    // searchButton: {
    //
    //     flex: '1 1 10%',
    //     padding: '15px 30px',
    //     backgroundColor: '#6b4c4c',
    //     color: 'white',
    //     border: 'none',
    //     borderRadius: '10px',
    //     fontWeight: 'bold',
    //     cursor: 'pointer',
    //
    // },
    //     searchForm: {
    //     display: 'grid',
    //     gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns: two stacks and one selector
    //     gap: '20px', // Space between columns
    //     alignItems: 'start',
    //     width: '100%',
    //     maxWidth: '1200px',
    // },
    searchForm: {
        display: 'grid',
        gridTemplateColumns: 'minmax(80px, 1fr) minmax(80px, 1fr) minmax(80px, 1fr)', // Each column is at least 150px wide
        gap: '20px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
    },
    stackContainer: {
        display: 'flex',
        flexDirection: 'column', // Stack elements vertically
        gap: '10px', // Space between stacked inputs
    },
    searchInput: {
        // padding: '15px',
        // borderRadius: '10px',
        // border: '1px solid #ccc',
        // width: '100%',
        // boxSizing: 'border-box',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '1rem',
        lineHeight: '1.2',
        height: '50px',
    } as React.CSSProperties,
    tripSelector: {
                padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        width: '100%',
        fontSize: '1rem',
        lineHeight: '1.2',
        height: '50px',
        appearance: 'none',
        boxSizing: 'border-box',
        // padding: '15px',
        // borderRadius: '10px',
        // border: '1px solid #ccc',
        // width: '100%',
        // height: 'fit-content',
    },
    searchButton: {
        padding: '15px 30px',
        backgroundColor: '#6b4c4c',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
        gridColumn: '3', // Place in the third column (under trip selector)
        justifySelf: 'center', // Center the button within the column
    },

    popularDestinationsSection: {
        textAlign: 'center' as const,
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
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
        gap: '20px', // Space between items
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto', // Center the grid container
        padding: '20px',

    },
    inputLabel: {
        fontSize: '0.625rem', // Smaller font size (14px)
        fontWeight: 'normal', // Regular font weight for a smaller, subtle label
        marginBottom: '1px', // Minimal spacing between label and input
        textAlign: 'left', // Align the label to the left
        display: 'block', // Ensure it behaves as a block element above the input
    } as React.CSSProperties,
    spacer: {
        height: '15px', // Match the height of the label to align properly
        visibility: 'hidden', // Keeps the spacing without displaying any text
    },
    destinationCard: {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '15px',
        textAlign: 'center',
    },
    destinationImage: {
        width: '100%',
        height: '150px',
        objectFit: 'cover' as const,
        borderRadius: '10px',
    },
};

