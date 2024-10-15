"use client"; // Ensure this is at the top for client-side functionality
import Header from './Header';
import { useSearchParams } from 'next/navigation'; // For accessing query parameters
import { useEffect, useState } from 'react';

export default function FlightResults() {
    //const searchParams = useSearchParams(); // Retrieve the query parameters from the URL
    //const origin = searchParams.get('origin');
    //const destination = searchParams.get('destination');
    //const departureDate = searchParams.get('departureDate');
    //const returnDate = searchParams.get('returnDate');
    //const roundTrip = searchParams.get('roundTrip');

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [roundTrip, setRoundTrip] = useState(false);
    //const [isLoading, setIsLoading] = useState(true);
    
    const [isLoading, setIsLoading] = useState(true); // Loading state until the query is ready

    // Effect to check when the necessary query parameters are available
    //useEffect(() => {
        //fetch("http://127.0.0.1:8000/flights")
        //if (origin && destination && departureDate && roundTrip) {
            //setIsLoading(false); // Stop loading once all required data is available
        //}
    //}, [origin, destination, departureDate, returnDate, roundTrip]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/flights");
                const data = await response.json();

                // Assuming the response data has the necessary fields
                setOrigin(data);
                //setDestination(data.destination);
                //setDepartureDate(data.departureDate);
                //setReturnDate(data.returnDate);
                //setRoundTrip(data.roundTrip);
            } catch (error) {
                console.error("Error fetching flight data:", error);
            } finally {
                setIsLoading(false); // Stop loading once data fetching is done
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once on mount

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