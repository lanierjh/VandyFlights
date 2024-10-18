import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
      vanderbiltEmail: '',
      password: '',
    });

    const inputStyles = {
        width: "100%",
        borderRadius: "10px",
        border: "none",
    };

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
    };

    const returnHomeButton = {
        position: "absolute",
        top: "20px",
        right: "20px",
        backgroundColor: "#1e3a8a",
        color: "white",
        padding: "10px 20px",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        fontSize: "1.2rem",
        fontWeight: "bold",
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          // TODO: CHANGE THIS
          const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'GET', // Simulate an OAuth GET request
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log('OAuth login successful:', data);
            window.location.href = '/mainPage'; 
          } else {
            console.error('OAuth login failed');
          }
        } catch (error) {
          console.error('Error during OAuth login:', error);
        }
    };

    return (
        <div className="row my-5">
            <button style={returnHomeButton} onClick={() => window.location.href = '/'}>
                Return to Home
            </button>

            <div className="col-md-4"></div>
            <div className="col-md-4 text-center my-5 py-5">
                <div>
                    <h1>Login</h1>

                    <div>
                        <form onSubmit={handleSubmit}>
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
