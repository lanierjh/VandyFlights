export default function Register() {

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

    
  return (
    <div className="row my-5">
        <div className="col-md-4"></div>
        <div className="col-md-4 text-center my-5 py-5">
        <div>
            <h1>Register</h1>

            <div>
                <form>
                    <div className="row py-3">
                        <div className="col-sm-6">
                            <input type="text" id="firstName" name="firstName" placeholder="First Name" style={inputStyles} className="p-3"></input>
                        </div>
                        <div className="col-sm-6">
                            <input type="text" id="lastName" name="lastName" placeholder="Last Name" style={inputStyles} className="p-3"></input>
                        </div>
                    </div>
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

                    <button type="submit" style={registerButton} className="my-4">Register</button>
                </form>
            </div>
            </div>
        </div>

    </div>
    
    
  );
}