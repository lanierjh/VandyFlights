import Header from './Header';

export default function FlightResults({ searchData }) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#dfd0d5', padding: '20px', minHeight: '100vh' }}>
            <Header />

            <main style={{ marginTop: '30px' }}>
                <h2>Flight Search Result Page</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                    <span><strong>Origin:</strong> {searchData.origin}</span>
                    <span><strong>Destination:</strong> {searchData.destination}</span>
                    <span><strong>Departure Date:</strong> {searchData.departureDate}</span>
                    {searchData.roundTrip === 'true' && <span><strong>Return Date:</strong> {searchData.returnDate}</span>}
                    <span><strong>Round-trip:</strong> {searchData.roundTrip === 'true' ? 'Yes' : 'No'}</span>
                </div>
            </main>
        </div>
    );
}
