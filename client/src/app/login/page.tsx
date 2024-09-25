export default function Login() {

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
    
  return (
    <div className="row my-5">
        <div className="col-md-4"></div>
        <div className="col-md-4 text-center my-5 py-5">
        <div>
            <h1>Login</h1>

            <div>
                <form>
                    <div className="row py-3">
                        <div className="col-sm-12">
                        <input type="email" id="vanderbiltEmail" name="vanderbiltEmail" placeholder="Vanderbilt Email" style={inputStyles} className="p-3"></input>
                        </div>
                    </div>
                    <div className="row py-3">
                        <div className="col-sm-12">
                        <input type="password" id="password" name="password" placeholder="Password" style={inputStyles} className="p-3"></input>
                        </div>
                    </div>
                        <a href="/mainPage">
                            <button type="submit" style={logInButton} className="my-4">Log In</button>
                        </a>
                </form>
            </div>
            </div>
        </div>

    </div>
    
    
  );
}
