import Image from 'next/image';
import './globals.css';

export default function Home() {
  return (
    <div className="container">
      <div className="left-side">
        <div className="image-container">
          <Image
            src="/zeppos.jpg"
            alt="Vanderbilt Tower"
            width={300}
            height={450}
            className="tower-image"
          />
        </div>
      </div>
      <div className="right-side">
        <h1 className="title">VandyFlights</h1>
        <div className="buttons">
          <button className="login-button">Log In</button>
          <button className="register-button">Register</button>
        </div>
      </div>
    </div>
  );
}
