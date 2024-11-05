"use client"; // Ensure client-side functionality
import Header from './Header';
import { useEffect, useState } from 'react';

export default function FlightResults() {
    const [flightData, setFlightData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if 'localStorage' is available and fetch flight data
        try {
            const storedFlightData = localStorage.getItem('flightResults');
            if (storedFlightData) {
                setFlightData(JSON.parse(storedFlightData));
            } else {
                console.error("No flight data found in localStorage.");
            }
        } catch (error) {
            console.error("Error retrieving flight data from localStorage:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div>Loading... We are pulling up the flight info right now. Hope you find the flight you're looking for.</div>;
    }

    if (!flightData || !flightData.flights || flightData.flights.length === 0) {
        return <div>No flight data available. Please go back and search for flights again.</div>;
    }

    return (
        <div style={styles.container}>
            <Header />
            <main style={{ marginTop: '30px' }}>
                <h2>Flight Search Result Page</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
                    <span><strong>Origin:</strong> {flightData.start}</span>
                    <span><strong>Destination:</strong> {flightData.destination}</span>
                    <div>
                        {flightData.flights.map((flight, index) => (
                            <div key={index} style={styles.flightCard}>
                                <p><strong>Price per Passenger:</strong> {flight.price || "Variable"}</p>
                                <p><strong>Carrier:</strong> {flight.carrier}</p>
                                <p><strong>Flight Number:</strong> {flight.flightNumber}</p>
                                <p>
                                    <a href={flight.url} target="_blank" rel="noopener noreferrer">
                                        Book Flight {index + 1}
                                    </a>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
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
    flightCard: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px 0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '300px',
        textAlign: 'left',
    },
};
