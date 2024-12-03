// import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Register() {
    // const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        vanderbiltEmail: '',
        password: '',
        username: '', 
    });

    const [errorMessage, setErrorMessage] = useState('');
    const centerPage = {

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh", /* Full viewport height */

    }
    const inputStyles = {
        width: "100%",
        borderRadius: "10px",
        border: "none",
    }

    const registerButton = {
        width: "100%",
        backgroundColor: "#9b4a46",
        color: "white",
        padding: "15px 30px",
        borderRadius: "10px",
        border: "none",
        fontSize: "1.2rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.vanderbiltEmail.endsWith('@vanderbilt.edu')) {
            setErrorMessage('Email must end with @vanderbilt.edu');
            return;
        }

        if (formData.password.length < 6) {
            setErrorMessage('Password must be at least six characters');
            return;
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
            setErrorMessage('Password must have at least one letter and one number');
            return;
        }

        setErrorMessage('');

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.vanderbiltEmail,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    flight_ids: [],
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('accessToken', data.access_token);
                window.location.href = '/mainPage';
            } else {
                const errorData = await response.json();

                if (errorData.detail === "Username or email already exists") {
                    setErrorMessage('The username or email you entered is already in use.');
                } else {
                    setErrorMessage(errorData.detail || 'An error occurred. Please try again.');
                }

                console.error('Registration failed:', errorData.detail);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="row mx-3 mx-md-1" style = {centerPage}>
            <div className="col-10 col-sm-8 col-md-4 mx-auto text-center py-5">
                <div>
                    <h1>Register</h1>

                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="row py-3">
                                <div className="col-sm-12">
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="First Name"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                </div>
                                <div className="row py-3">
                                    <div className="col-sm-12">
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Last Name"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    </div>
                                </div>
                            <div className="row py-3">
                                <div className="col-sm-12">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Username"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row py-3">
                                <div className="col-sm-12">
                                    <input
                                        type="email"
                                        id="vanderbiltEmail"
                                        name="vanderbiltEmail"
                                        placeholder="Vanderbilt Email"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.vanderbiltEmail}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row py-3">
                                <div className="col-sm-12">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="Password"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={registerButton}
                                className="my-4"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
