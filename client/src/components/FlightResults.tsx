"use client"; // Ensure client-side functionality
import Header from './Header';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FlightResults() {
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin') || 'BNA';
    const destination = searchParams.get('destination') || '';
    const departureDate = searchParams.get('departureDate') || '';
    const returnDate = searchParams.get('returnDate') || '';
    const roundTrip = searchParams.get('roundTrip') === 'true';

    const [flightData, setFlightData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8001/flights', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        origin,
                        destination,
                        departureDate,
                        returnDate,
                        roundTrip
                    })
                });
                const data = await response.json();
                setFlightData(data);
            } catch (error) {
                console.error("Error fetching flight data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFlights();
    }, [origin, destination, departureDate, returnDate, roundTrip]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!flightData) {
        return <div>No flight data available.</div>;
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
                        {flightData.results && flightData.results.length > 0 ? (
                            flightData.results.map((flight, index) => (
                                <p key={index}>
                                    PRICE PER PASSENGER: {flight.price_per_passenger} - <a href={flight.url} target="_blank" rel="noopener noreferrer">Flight {index + 1}</a>
                                </p>
                            ))
                        ) : (
                            <p>No flight data available.</p>
                        )}
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
    },
};
