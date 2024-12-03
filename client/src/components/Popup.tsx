"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PopupProps {
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
    const [popupStage, setPopupStage] = useState(0);
    const router = useRouter();

    const handleYes = () => setPopupStage(1);
    const handleNo = () => setPopupStage(2);
    const handleBackToHomepage = () => {
        try {
            router.push('/');
            onClose();
        } catch (error) {
            console.error('Failed to navigate:', error);
        }
    };
    const handleTellFriends = () => {
        try {
            router.push('/chat');
            onClose(); 
        } catch (error) {
            console.error('Failed to navigate:', error);
        }
    };

    return (
        <div style={styles.overlay} aria-modal="true" role="dialog" aria-labelledby="popup-title">
            <div style={styles.popup}>
                {popupStage === 0 && (
                    <>
                        <h2 id="popup-title">Did you purchase your flight?</h2>
                        <div style={styles.buttons}>
                            <button onClick={handleYes} style={styles.button}>Yes</button>
                            <button onClick={handleNo} style={styles.button}>No</button>
                        </div>
                    </>
                )}
                {popupStage === 1 && (
                    <>
                        <h2 id="popup-title">Congrats on Finding Your Next Travel Destination!!!</h2>
                        <div style={styles.buttons}>
                            <button onClick={handleTellFriends} style={styles.button}>
                                Tell your Friends!!!
                            </button>
                            <button onClick={handleBackToHomepage} style={styles.button}>
                                Back to Homepage
                            </button>
                        </div>
                    </>
                )}
                    {popupStage === 2 && (
                        <>
                            <h2 id="popup-title">Sorry It Didn&#39;t Work Out. Hopefully You Find Your Next Trip!</h2>
                            <button onClick={handleBackToHomepage} style={styles.button}>Homepage</button>
                        </>
                    )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
    },
    popup: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center' as const,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '300px',
        transform: 'scale(0.9)',
        animation: 'scaleUp 0.3s ease forwards',
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
        transition: 'background-color 0.3s',
    },
    '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 },
    },
    '@keyframes scaleUp': {
        from: { transform: 'scale(0.9)' },
        to: { transform: 'scale(1)' },
    },
};

export default Popup;
