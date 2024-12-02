import React, { useState } from 'react';
import { useRouter } from 'next/router';



const Popup = () => {
    const [popupStage, setPopupStage] = useState(0);
    const router = useRouter();

    const handleYes = () => setPopupStage(1);
    const handleNo = () => setPopupStage(2);
    const handleBackToHomepage = () => router.push('/');
    const handleTellFriends = () => router.push('/chat');

    return (
        <div style={styles.overlay}>
            <div style={styles.popup}>
                {popupStage === 0 && (
                    <>
                        <h2>Did you purchase your flight?</h2>
                        <div style={styles.buttons}>
                            <button onClick={handleYes} style={styles.button}>Yes</button>
                            <button onClick={handleNo} style={styles.button}>No</button>
                        </div>
                    </>
                )}
                {popupStage === 1 && (
                    <>
                        <h2>Congrats on Finding Your Next Travel Destination!!!</h2>
                        <div style={styles.buttons}>
                            <button onClick={handleTellFriends} style={styles.button}>Tell your Friends!!!</button>
                            <button onClick={handleBackToHomepage} style={styles.button}>Back to Homepage</button>
                        </div>
                    </>
                )}
                {popupStage === 2 && (
                    <>
                        <h2>Sorry It Didn't Work Out. Hopefully You Find Your Next Trip!</h2>
                        <button onClick={handleBackToHomepage} style={styles.button}>Homepage</button>
                    </>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    popup: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '300px',
    },
    buttons: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-around',
    },
    button: {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#0b8457',
        color: '#fff',
        fontSize: '1em',
    },
};

export default Popup;
