import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
      identifier: '', // Changed from vanderbiltEmail to identifier
      password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const inputStyles = {
        width: "100%",
        borderRadius: "10px",
        border: "none",
    }

    const logInButton = {
        width: "100%",
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "15px 30px",
        borderRadius: "30px",
        border: "none",
        fontSize: "1.2rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: formData.identifier, // Send identifier instead of email
                    password: formData.password
                }),
            });
            console.log("response", response.status);
            if (response.ok) {
                console.log('Login successful:', formData);
                window.location.href = '/mainPage';
            } else if (response.status === 401) {
                setErrorMessage('Your username/email or password is invalid.');
                console.error('Login failed: Invalid identifier or password');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || 'An error occurred. Please try again.');
                console.error('Login failed:', errorData.detail);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    }

    return (
        <div className="row my-5">
            <div className="col-md-4"></div>
            <div className="col-md-4 text-center my-5 py-5">
                <div>
                    <h1>Login</h1>
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
                                        id="identifier"
                                        name="identifier"
                                        placeholder="Username or Email"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.identifier}
                                        onChange={handleChange}
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
                                    />
                                </div>
                            </div>
                            <button type="submit" style={logInButton} className="my-4">Log In</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}