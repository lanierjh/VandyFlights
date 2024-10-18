import React, { useState } from 'react';
import Image from 'next/image';
import Header from './Header';

export default function EditProfile() {
    const [formData, setFormData] = useState({
        firstName: 'Vikash',
        lastName: 'Singh',
        nextTrip: 'Fall Break',
        graduatingClass: '2025',
        email: 'Vikash@gmail.com',
        currentTripDestination: 'New York, NY',
        nextTripDestination: 'Miami, FL',
    });

    const [isEditing, setIsEditing] = useState(false);

    const tripOptions = [
        'Fall Break',
        'Thanksgiving',
        'Winter Break',
        'Spring Break',
        'Summer Break',
    ];

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
                            src="/newyork.png" // TODO NEED TO CHANGE
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
                <form className="profile-form" style={{ marginTop: '30px' }}>
                    <div className="row" style={styles.row}>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="firstName">First Name</label>
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
                            <label htmlFor="lastName">Last Name</label>
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
                            <label htmlFor="nextTrip">Next Break</label>
                            <select 
                                id="nextTrip" 
                                name="nextTrip" 
                                value={formData.nextTrip}
                                onChange={handleChange}
                                disabled={!isEditing}
                                style={styles.inputField}
                            >
                                {tripOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="graduatingClass">Graduating Class</label>
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
                    <div className="row" style={styles.row}>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="currentTripDestination">Current Trip Destination</label>
                            <input 
                                type="text" 
                                id="currentTripDestination" 
                                name="currentTripDestination" 
                                value={formData.currentTripDestination}
                                onChange={handleChange} 
                                placeholder="Current Trip Destination"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                        <div className="form-group" style={styles.formGroup}>
                            <label htmlFor="nextTripDestination">Next Trip Destination</label>
                            <input 
                                type="text" 
                                id="nextTripDestination"
                                name="nextTripDestination" 
                                value={formData.nextTripDestination}
                                onChange={handleChange} 
                                placeholder="Next Trip Destination"
                                disabled={!isEditing}
                                style={styles.inputField}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="form-group" style={{ width: '100%' }}>
                            <label htmlFor="email">Email</label>
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
            </div>
        </div>
    );
}

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
    inputField: {
        width: '100%',
        padding: '15px', 
        borderRadius: '10px',
        border: '1px solid #ccc',
        appearance: 'none',
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
