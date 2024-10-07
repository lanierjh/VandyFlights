import React, { useState } from 'react';
import Image from 'next/image';
import Header from './Header'; 

export default function EditProfile() {
    const [formData, setFormData] = useState({
        firstName: 'Alexa',
        lastName: 'Rawles',
        gender: 'female',
        graduatingClass: '2025',
        email: 'alexarawles@gmail.com'
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
        // Logic to save data (e.g., API call)
        console.log('Form data saved:', formData);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F1D6D9', minHeight: '100vh' }}>
            {/* Header Component at the top */}
            <Header /> {/* The header spans the top, just like on the chat page */}

            <div className="edit-profile-container" style={styles.profileContainer}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Profile Picture and Info */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image 
                            src="/newyork.png" // Replace with actual profile image path
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
                    {/* Edit / Save Button */}
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
                            <label htmlFor="gender">Gender</label>
                            <select 
                                id="gender" 
                                name="gender" 
                                value={formData.gender}
                                onChange={handleChange} 
                                disabled={!isEditing}
                                style={styles.inputField}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
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

// Styles
const styles = {
    profileContainer: {
        margin: '50px auto',
        padding: '40px', // Increased padding for more spacious layout
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '900px', // Increased max width to make the container bigger
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
        padding: '15px', // Increased padding for bigger input fields
        borderRadius: '10px',
        border: '1px solid #ccc',
    },
    saveButton: {
        backgroundColor: '#28a745', 
        color: 'white', 
        border: 'none', 
        borderRadius: '10px', 
        padding: '15px 30px', // Bigger button
        cursor: 'pointer',
    },
    editButton: {
        backgroundColor: '#1e3a8a', 
        color: 'white', 
        border: 'none', 
        borderRadius: '10px', 
        padding: '15px 30px', // Bigger button
        cursor: 'pointer',
    },
};
