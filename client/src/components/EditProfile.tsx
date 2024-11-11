import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import Header from './Header';
import {useRouter} from "next/navigation";

export default function EditProfile() {
    const router = useRouter();
        useEffect(() => {
        // Check if accessToken is in localStorage
        const token = localStorage.getItem('accessToken');
        console.log("Retrieved token:", token);

        if (!token) {
            // Redirect to login if token is missing
            router.push('/');
        }
    }, [router]);
    const [formData, setFormData] = useState({
        firstName: 'Vikash',
        lastName: 'Singh',
        destination: 'LGA',
        graduatingClass: '2025',
        email: 'vikashsingh@gmail.com'
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        console.log('Form data saved:', formData);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F1D6D9', minHeight: '100vh' }}>
            <Header />
            <div className="edit-profile-container" style={styles.profileContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image 
                            src="/newyork.png"
                            alt="Profile picture"
                            width={100}
                            height={100}
                            style={{ borderRadius: '50%', marginRight: '20px' }}
                        />
                        <div>
                            <h2>{formData.firstName} {formData.lastName}</h2>
                            <p>{formData.email}</p>
                        </div>
                    </div>
                    {isEditing ? (
                        <button 
                            type="button" 
                            onClick={handleSaveClick}
                            style={styles.saveButton}>
                            Save
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            onClick={handleEditClick}
                            style={styles.editButton}>
                            Edit
                        </button>
                    )}
                </div>

                {/* Profile Form */}
                <form className="profile-form" style={{ marginTop: '30px' }}>
                    <div className="row" style={styles.row}>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="firstName" style={styles.label}>First Name</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange} 
                                placeholder="Your First Name"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="lastName" style={styles.label}>Last Name</label>
                            <input 
                                type="text" 
                                id="lastName"
                                name="lastName" 
                                value={formData.lastName}
                                onChange={handleChange} 
                                placeholder="Your Last Name"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                    </div>
                    <div className="row" style={styles.row}>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="destination" style={styles.label}>Destination</label>
                            <input 
                                type="text" 
                                id="destination" 
                                name="destination" 
                                value={formData.destination}
                                onChange={handleChange} 
                                placeholder="Your Destination"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="graduatingClass" style={styles.label}>Graduating Class</label>
                            <input 
                                type="text" 
                                id="graduatingClass"
                                name="graduatingClass" 
                                value={formData.graduatingClass}
                                onChange={handleChange} 
                                placeholder="Your Graduating Class"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="email" style={styles.label}>Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange} 
                                placeholder="Your Email"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                    </div>
                </form>

                {/* Flight Section as a single entity */}
                <div style={{ marginTop: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Flight</h3>
                    <div style={styles.flightContainer}>
                        <div style={styles.flightDetail}>
                            <span style={styles.label}>Flight Number:</span> AA123
                        </div>
                        <div style={styles.flightDetail}>
                            <span style={styles.label}>Departure:</span> 10:00 AM, Dec 15, 2024
                        </div>
                        <div style={styles.flightDetail}>
                            <span style={styles.label}>Arrival:</span> 1:30 PM, Dec 15, 2024
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles
const styles = {
    profileContainer: {
        margin: '50px auto',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    formGroup: {
        flex: '0 0 48%',
    },
    label: {
        fontWeight: 'bold',
        fontSize: '1rem', // Ensure all labels have the same font size
        color: '#333',
    },
    inputField: {
        width: '100%',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
    },
    flightContainer: {
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    flightDetail: {
        fontSize: '1rem',
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '15px 30px',
        cursor: 'pointer',
    },
    editButton: {
        backgroundColor: '#1e3a8a',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        padding: '15px 30px',
        cursor: 'pointer',
    },
};
