import Header from './Header';
import { useRouter } from 'next/router';

export default function FlightResults({ searchData }) {
    const router = useRouter();
    const { origin, destination, departureDate, returnDate, roundTrip } = router.query;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#dfd0d5', padding: '20px', minHeight: '100vh' }}>
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
