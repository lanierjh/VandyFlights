"use client";
import Header from './Header';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FlightResults() {
    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const roundTrip = searchParams.get('roundTrip');
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (origin && destination && departureDate && roundTrip) {
            setIsLoading(false);
        }
    }, [origin, destination, departureDate, returnDate, roundTrip]);

    if (isLoading) {
        return <div>Loading...</div>; 
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