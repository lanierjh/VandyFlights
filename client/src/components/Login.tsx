import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
      username: '',
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
                'Content-Type': "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: formData.username,
                password: formData.password
            }),
        });

            if (response.ok) {
                // console.log('Login successful:', formData);
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('accessToken', data.access_token);
                window.location.href = '/mainPage';
            } else if (response.status === 401) {
                setErrorMessage('Invalid login credentials');
                console.error('Login failed: Invalid login credentials');
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
                                        id="username"
                                        name="username"
                                        placeholder="Username or Email"
                                        style={inputStyles}
                                        className="p-3"
                                        value={formData.username}
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