"use client"; // Ensure this is at the top for client-side functionality
import Header from './Header';
import { useSearchParams } from 'next/navigation'; // For accessing query parameters
import { useEffect, useState } from 'react';

export default function FlightResults() {
    const searchParams = useSearchParams(); // Retrieve the query parameters from the URL
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const roundTrip = searchParams.get('roundTrip');
    
    const [isLoading, setIsLoading] = useState(true); // Loading state until the query is ready

    // Effect to check when the necessary query parameters are available
    useEffect(() => {
        fetch("http://127.0.0.1:8000/flights")
        if (origin && destination && departureDate && roundTrip) {
            setIsLoading(false); // Stop loading once all required data is available
        }
    }, [origin, destination, departureDate, returnDate, roundTrip]);

    if (isLoading) {
        return <div>Loading...</div>; // Loading indicator while data is being retrieved
    }

    return (
        <div style={styles.container}>
            <Header />

            <main style={{ marginTop: '30px' }}>
                <h2>Flight Search Result Page</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                    <span><strong>Origin:</strong> {origin}</span>
                    <span><strong>Destination:</strong> {destination}</span>
                    <span><strong>Departure Date:</strong> {departureDate}</span>
                    {roundTrip === 'true' && <span><strong>Return Date:</strong> {returnDate}</span>}
                    <span><strong>Round-trip:</strong> {roundTrip === 'true' ? 'Yes' : 'No'}</span>
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