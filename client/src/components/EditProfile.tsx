import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import Header from './Header';
import {useRouter} from "next/navigation";
import axios from 'axios';


export default function EditProfile() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // empty version of profile data before checking auth
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        // Check screen size on the client
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize); // Listen for resize events
        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup listener
        };
    }, []);
    const [formData, setFormData, ] = useState({
        firstName: '',
        lastName: '',
        destination: '',
        graduatingClass: '',
        email: ''
    });
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        console.log("Retrieved token:", token);

        if (!token) {
            console.log("no");

            router.push('/');
            return;
        }
        axios.get('https://vandyflights-backend.onrender.com/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const data = response.data;
            setFormData({
                firstName: data.first_name,
                lastName: data.last_name,
                destination: data.destination || '',
                graduatingClass: data.graduating_class || '',
                email: data.email
            });
        })
        .catch(error => {
            console.error("Failed to fetch profile data:", error);
            // if (error.response && error.response.status === 401) {
            //     // Token expired or invalid, redirect to login
            //     router.push('/');
            // }
        });


    }, [router]);

    const styles = {
            pageContainer: {
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f4e8f0',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column' as const,
                alignItems: 'center',
            },
            profileContainer: {
                margin: isMobile ? '20px auto' : '50px auto',
                padding: isMobile ? '30px' : '40px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                maxWidth: '900px',
                width: isMobile ? '90%' : '100%',
                boxSizing: 'border-box' as const,
            },
        profileHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
        },
        profileInfo: {
            display: 'flex',
            alignItems: 'center',
        },
        profileImage: {
            borderRadius: '50%',
            marginRight: '20px',
        },
        profileName: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
        },
        profileEmail: {
            color: '#555',
            fontSize: '1rem',
        },
            profileForm: {
                marginTop: '30px',
                padding: '10px 20px',
                boxSizing: 'border-box' as const,
            },
            row: {
                display: 'flex',
                justifyContent: 'space-between',
                gap: isMobile ? '10px' : '20px',
                flexDirection: isMobile ? 'column' as const: 'row' as const,
            },
        formGroup: {
            flex: '1',
        },
        label: {
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#333',
            display: 'block',
            marginBottom: '5px',
        },
        inputField: {
            width: '100%',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            fontSize: '1rem',
        },
        flightSection: {
            marginTop: '30px',
        },
        flightHeading: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        flightContainer: {
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column' as const,
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
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
        },
        editButton: {
            backgroundColor: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
        },
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setIsEditing(false); // Exit editing mode
        console.log('Form data saved:', formData);

        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error('No token found. Please log in again.');
            router.push('/');
            return;
        }

        if (formData.graduatingClass.length != 0) {
            if (formData.graduatingClass.length != 4 || !(formData.graduatingClass.startsWith("20"))) {
                setErrorMessage('Graduating class must be 4 digits and be within 2000-2099');
                console.error('Error updating profile');
                setIsEditing(true);
                return;
            }
        }
        setErrorMessage('');

        try {
            const response = await axios.put(
                'https://vandyflights-backend.onrender.com/editprofile',
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    destination: formData.destination,
                    graduating_class: formData.graduatingClass,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                console.log('Profile updated successfully:', response.data);
            } else {
                console.error('Failed to update profile:', response);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setIsEditing(true); // Re-enter editing mode on failure
        }
    };


    return (
        <div style={styles.pageContainer}>
            <Header />
            <div className="edit-profile-container" style={styles.profileContainer}>
                <div style={styles.profileHeader}>
                    <div style={styles.profileInfo}>
                        <Image
                            src="/newyork.png"
                            alt="Profile picture"
                            width={100}
                            height={100}
                            style={styles.profileImage}
                        />
                        <div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <h2 style={styles.profileName}>{formData.firstName} {formData.lastName}</h2>
                            <p style={styles.profileEmail}>{formData.email}</p>

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
                <form className="profile-form" style={styles.profileForm}>
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
                                disabled={true}
                                style={styles.inputField}
                            />
                        </div>
                    </div>
                </form>

                {/* Flight Section */}
                <div style={styles.flightSection}>
                    <h3 style={styles.flightHeading}>Flight</h3>
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
// const styles = {
//     pageContainer: {
//         fontFamily: 'Arial, sans-serif',
//         backgroundColor: '#f4e8f0',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column' as const,
//         alignItems: 'center',
//     },
//     profileContainer: {
//         margin: '50px auto',
//         padding: '40px',
//         backgroundColor: 'white',
//         borderRadius: '10px',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//         maxWidth: '900px',
//         width: '100%',
//         boxSizing: 'border-box',
//     },
//     profileHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '30px',
//     },
//     profileInfo: {
//         display: 'flex',
//         alignItems: 'center',
//     },
//     profileImage: {
//         borderRadius: '50%',
//         marginRight: '20px',
//     },
//     profileName: {
//         fontSize: '1.5rem',
//         fontWeight: 'bold',
//     },
//     profileEmail: {
//         color: '#555',
//         fontSize: '1rem',
//     },
//     profileForm: {
//         marginTop: '30px',
//     },
//     row: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         gap: '20px',
//     },
//     formGroup: {
//         flex: '1',
//     },
//     label: {
//         fontWeight: 'bold',
//         fontSize: '1rem',
//         color: '#333',
//         display: 'block',
//         marginBottom: '5px',
//     },
//     inputField: {
//         width: '100%',
//         padding: '15px',
//         borderRadius: '10px',
//         border: '1px solid #ccc',
//         backgroundColor: '#f9f9f9',
//         fontSize: '1rem',
//     },
//     flightSection: {
//         marginTop: '30px',
//     },
//     flightHeading: {
//         fontSize: '1.5rem',
//         fontWeight: 'bold',
//         marginBottom: '10px',
//     },
//     flightContainer: {
//         backgroundColor: '#f9f9f9',
//         padding: '15px',
//         borderRadius: '10px',
//         border: '1px solid #ccc',
//         display: 'flex',
//         flexDirection: 'column' as const,
//         gap: '10px',
//     },
//     flightDetail: {
//         fontSize: '1rem',
//         color: '#333',
//     },
//     saveButton: {
//         backgroundColor: '#28a745',
//         color: 'white',
//         border: 'none',
//         borderRadius: '10px',
//         padding: '10px 20px',
//         fontSize: '1rem',
//         cursor: 'pointer',
//     },
//     editButton: {
//         backgroundColor: '#1e3a8a',
//         color: 'white',
//         border: 'none',
//         borderRadius: '10px',
//         padding: '10px 20px',
//         fontSize: '1rem',
//         cursor: 'pointer',
//     },
//
// };

// const isMobile = window.innerWidth < 768;

