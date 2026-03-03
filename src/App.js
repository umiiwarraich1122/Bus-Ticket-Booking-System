import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "./bus1seat.css"; // shared CSS
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

// Import seat pages
import Bus1Seat from "./bus1seat";
import Bus2Seat from "./bus2seat";
import Bus3Seat from "./Bus3Seat";
import Bus4Seat from "./Bus4Seat";
import Bus5Seat from "./bus5seat";
import Bus6Seat from "./bus6seat";

// Home component
const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <header>
        <div className="logo-container">
          <img src="/images/logo.jfif" alt="Aspire Transport Logo" className="logo" />
          <div className="header-text">
            <h1>Welcome to Aspire Transport</h1>
            <p>Your Comfortable & Reliable Travel Partner</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Travel with Comfort & Safety</h2>
        <p>
          Our buses are always on time, neat and clean, with professional and
          respectful staff.
        </p>
      </section>

      {/* Bus Schedule Section */}
      <section className="bus-section">
        <h2>Our Bus Schedule</h2>
        <div className="bus-container">
          {/* Bus 1 */}
          <div className="bus-card" onClick={() => navigate("/bus1seat")} style={{ cursor: "pointer" }}>
            <img src="/images/y1.jfif" alt="Bus 1" />
            <h3>Mandi Bahauddin → Lahore</h3>
            <p><strong>Time:</strong> 6:00 AM</p>
            <p><strong>Bus:</strong> Yutong</p>
            <p><strong>Number:</strong> ISP 3242</p>
          </div>

          {/* Bus 2 */}
          <div className="bus-card" onClick={() => navigate("/bus2seat")} style={{ cursor: "pointer" }}>
            <img src="/images/d.jpg" alt="Bus 2" />
            <h3>Mandi Bahauddin → Lahore</h3>
            <p><strong>Time:</strong> 8:00 AM</p>
            <p><strong>Bus:</strong> Daewoo</p>
            <p><strong>Number:</strong> NUA 2372</p>
          </div>

          {/* Bus 3 */}
          <div className="bus-card" onClick={() => navigate("/Bus3Seat")} style={{ cursor: "pointer" }}>
            <img src="/images/y2.jpg" alt="Bus 3" />
            <h3>Mandi Bahauddin → Lahore</h3>
            <p><strong>Time:</strong> 10:00 AM</p>
            <p><strong>Bus:</strong> Yutong</p>
            <p><strong>Number:</strong> LEO 6738</p>
          </div>

          {/* Bus 4 */}
          <div className="bus-card" onClick={() => navigate("/bus4seat")} style={{ cursor: "pointer" }}>
            <img src="/images/y1.jfif" alt="Bus 4" />
            <h3>Lahore → Mandi Bahauddin</h3>
            <p><strong>Time:</strong> 1:00 PM</p>
            <p><strong>Bus:</strong> Yutong</p>
            <p><strong>Number:</strong> ISP 3242</p>
          </div>

          {/* Bus 5 */}
          <div className="bus-card" onClick={() => navigate("/bus5seat")} style={{ cursor: "pointer" }}>
            <img src="/images/d.jpg" alt="Bus 5" />
            <h3>Lahore → Mandi Bahauddin</h3>
            <p><strong>Time:</strong> 3:00 PM</p>
            <p><strong>Bus:</strong> Daewoo</p>
            <p><strong>Number:</strong> NUA 2372</p>
          </div>

          {/* Bus 6 */}
          <div className="bus-card" onClick={() => navigate("/bus6seat")} style={{ cursor: "pointer" }}>
            <img src="/images/y2.jpg" alt="Bus 6" />
            <h3>Lahore → Mandi Bahauddin</h3>
            <p><strong>Time:</strong> 5:00 PM</p>
            <p><strong>Bus:</strong> Yutong</p>
            <p><strong>Number:</strong> LEO 6738</p>
          </div>
        </div>
      </section>

      {/* Footer & Contact sections can remain same */}
    </>
  );
};

// App with routing
const AppWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bus1seat" element={<Bus1Seat />} />
        <Route path="/bus2seat" element={<Bus2Seat />} />
        <Route path="/bus3seat" element={<Bus3Seat />} />
        <Route path="/bus4seat" element={<Bus4Seat />} />
        <Route path="/bus5seat" element={<Bus5Seat />} />
        <Route path="/bus6seat" element={<Bus6Seat />} />
      </Routes>
    </Router>
  );
};

export default AppWrapper;
