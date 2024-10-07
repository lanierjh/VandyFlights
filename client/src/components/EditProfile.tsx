import { useState } from 'react';
import Image from 'next/image';
import Header from './Header'; // Assuming you have a header component

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
        // Here, you can add logic to save the updated info, e.g., making a POST request to update the data.
        console.log('Form data saved:', formData);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#dfd0d5', padding: '20px', minHeight: '100vh' }}>
            <Header />
            <div className="edit-profile-container" style={{ marginTop: '50px', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Profile Picture and Info */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image 
                            src="/newyork.png" // Path to the uploaded image
                            alt="Profile picture"
                            width={80}
                            height={80}
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
                            style={{
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '10px', 
                                padding: '10px 20px', 
                                cursor: 'pointer'
                            }}>
                            Save
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            onClick={handleEditClick}
                            style={{
                                backgroundColor: '#1e3a8a', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '10px', 
                                padding: '10px 20px', 
                                cursor: 'pointer'
                            }}>
                            Edit
                        </button>
                    )}
                </div>
                <form className="profile-form" style={{ marginTop: '30px' }}>
                    <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="form-group" style={{ flex: '0 0 48%' }}>
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange} 
                                placeholder="Your First Name"
                                disabled={!isEditing}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: '0 0 48%' }}>
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                type="text" 
                                id="lastName"
                                name="lastName" 
                                value={formData.lastName}
                                onChange={handleChange} 
                                placeholder="Your Last Name"
                                disabled={!isEditing}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>
                    <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <div className="form-group" style={{ flex: '0 0 48%' }}>
                            <label htmlFor="gender">Gender</label>
                            <select 
                                id="gender" 
                                name="gender" 
                                value={formData.gender}
                                onChange={handleChange} 
                                disabled={!isEditing}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: '0 0 48%' }}>
                            <label htmlFor="graduatingClass">Graduating Class</label>
                            <input 
                                type="text" 
                                id="graduatingClass"
                                name="graduatingClass" 
                                value={formData.graduatingClass}
                                onChange={handleChange} 
                                placeholder="Your Graduating Class"
                                disabled={!isEditing}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
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
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
