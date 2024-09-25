import Image from 'next/image';
import './globals.css';

export default function Home() {
  const homeContent = {
    height: '50vh',
    marginTop: '25vh',
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


  const vanderbiltPlaneRow = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '200px',
  };

  return (
    <div className="row" id="HomeContent" style={homeContent}>
      <div className="col-sm-2"></div>
      <div className="col-sm-3">
        <div >
          <Image
            src="/zeppos.jpg"
            alt="Vanderbilt Tower"
            width={300}
            height={450}
              style={{ borderRadius: "20px" }}
            />
          </div>
        </div>
        <div className="col-sm-1">
          <div style={vanderbiltPlaneRow}>
            <Image
              src="/vanderbilt.png"
              alt="Vanderbilt Logo"
              width={100}
              height={50}
            />

            <svg height="600" width="300">
            <path
              d="M0 250 Q 50 0 65 250"
              stroke="gray"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="5,5"
            />
          </svg>

          <Image
            src="/plane.png"
            alt="Airplane Logo"
            width={100}
            height={50}
          />
          </div>
      </div>
      <div className="col-sm-4 text-center" style={rightSide}>
        <h1 className="my-5" style={{ fontWeight: 'bold' }}>VandyFlights</h1>
        <div className="my-5">
          <button className="p-3" style={logInButton}>Log In</button>
        </div>
        <div className="my-5">
          <a href="/register">
            <button className="p-3" style={registerButton}>Register</button>
          </a>
        </div>
      </div>
    </div>
  );
}