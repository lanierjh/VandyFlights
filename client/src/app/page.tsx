import Image from 'next/image';
import './globals.css';

export default function Home() {
  const homeContent = {
    height: 50 + "vh",
    marginTop: 25 + "vh"
  };

  const rightSide = {
    height: "50%",
    marginTop: "4%"
  }

  const logInButton = {
    width: "30%",

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

  const registerButton = {
    width: "30%",
    backgroundColor: "#9b4a46",
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
    <div className="row" id="HomeContent" style={homeContent}>
      <div className="col-sm-2"></div>
      <div className="col-sm-4">
        <div >
          <Image
            src="/zeppos.jpg"
            alt="Vanderbilt Tower"
            width={300}
            height={450}
            
          />
        </div>
      </div>
      <div className="col-sm-4 text-center" style={rightSide}>
        <h1 className=" my-5">VandyFlights</h1>
        <div className=" my-5">
          <button className = "p-3" style={logInButton}>Log In</button>
        </div>
        <div className=" my-5">
          <a href = "/register"><button className = "p-3" style={registerButton}>Register</button></a>
        </div>
        
      </div>
    </div>
  );
}
