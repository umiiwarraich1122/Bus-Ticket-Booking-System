import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bus1seat.css";
import bgImage from "./images/y2.jpg";

const Bus1Seat = () => {
  const totalSeats = 41;
  const ticketPrice = 1200;

  const [seats, setSeats] = useState(Array(totalSeats).fill(null));
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
    paymentMethod: "card",
    easypaisaAccount: "",
    easypaisaName: "",
    easypaisaPin: "",
  });

  // Fetch already booked seats from MySQL using PHP API
  useEffect(() => {
    axios
      .get("http://localhost/bus_six/getSeats.php")
      .then((res) => {
        const bookedSeats = res.data;
        const updatedSeats = [...seats];
        bookedSeats.forEach((seat) => {
          updatedSeats[seat.seat_number - 1] = {
            gender: seat.gender,
            name: seat.name,
          };
        });
        setSeats(updatedSeats);
      })
      .catch((err) => console.error("Error fetching seats:", err));
    // eslint-disable-next-line
  }, []);

  // Handle seat click -> ask gender
  const handleSeatClick = (index) => {
    if (seats[index]) {
      alert("⚠️ This seat is already booked!");
      return;
    }

    const gender = window.prompt("Enter Gender: M for Male, F for Female");
    if (!gender || !["M", "F", "m", "f"].includes(gender)) {
      alert("❌ Invalid input! Please enter M or F.");
      return;
    }

    setSelectedSeat(index);

    // Temporarily set gender (name will be added after payment)
    const updatedSeats = [...seats];
    updatedSeats[index] = { gender: gender.toUpperCase(), name: null };
    setSeats(updatedSeats);
  };

  // Payment form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle payment & finalize booking
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("❌ Please enter your name!");
      return;
    }

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber || !formData.cvv || !formData.expiry) {
        alert("❌ Please fill in all card details!");
        return;
      }
      if (formData.cardNumber.length !== 16 || isNaN(formData.cardNumber)) {
        alert("❌ Card number must be 16 digits!");
        return;
      }
      if (formData.cvv.length !== 3 || isNaN(formData.cvv)) {
        alert("❌ CVV must be 3 digits!");
        return;
      }
    } else {
      if (
        !formData.easypaisaAccount ||
        !formData.easypaisaName ||
        !formData.easypaisaPin
      ) {
        alert("❌ Please fill in all EasyPaisa details!");
        return;
      }
      if (formData.easypaisaPin.length !== 5 || isNaN(formData.easypaisaPin)) {
        alert("❌ PIN code must be 5 digits!");
        return;
      }
    }

    try {
      // Save booking to MySQL using PHP API
      await axios.post("http://localhost/bus_six/bookSeat.php", {
        seat_number: selectedSeat + 1,
        name: formData.name,
        gender: seats[selectedSeat].gender,
        payment_method: formData.paymentMethod,
      });

      alert(`✅ Seat ${selectedSeat + 1} booked successfully for Rs. ${ticketPrice}!`);

      // Mark seat as booked locally
      const updatedSeats = [...seats];
      updatedSeats[selectedSeat] = {
        ...updatedSeats[selectedSeat],
        name: formData.name,
      };
      setSeats(updatedSeats);

      // Reset form
      setSelectedSeat(null);
      setFormData({
        name: "",
        cardNumber: "",
        cvv: "",
        expiry: "",
        paymentMethod: "card",
        easypaisaAccount: "",
        easypaisaName: "",
        easypaisaPin: "",
      });
    } catch (error) {
      alert("❌ Error booking seat. Please try again.");
      console.error("Booking error:", error);
    }
  };

  // Get seat class based on gender
  const getSeatClass = (seat) => {
    if (!seat) return "seat"; // White for unbooked
    if (seat.gender === "M") return "seat male"; // Yellow for male
    if (seat.gender === "F") return "seat female"; // Red for female
    return "seat";
  };

  // Render seats in proper 2x2 layout + last 5 merged seats
  const renderSeats = () => {
    const seatLayout = [];
    let seatNum = 0;

    // Add driver logo
    seatLayout.push(
      <div key="driver" className="driver-seat">
        🚌 <span>Driver</span>
      </div>
    );

    // Generate rows with 2 + gap + 2 seats
    for (let row = 0; row < 9; row++) {
      seatLayout.push(
        <div key={row} className="seat-row">
          {/* Left side 2 seats */}
          <div className="left-seats">
            {[0, 1].map((col) => {
              const index = seatNum++;
              return (
                <div
                  key={`L-${col}`}
                  className={getSeatClass(seats[index])}
                  onClick={() => handleSeatClick(index)}
                >
                  {seats[index] ? seats[index].gender : index + 1}
                </div>
              );
            })}
          </div>

          <div className="aisle-gap"></div>

          {/* Right side 2 seats */}
          <div className="right-seats">
            {[0, 1].map((col) => {
              const index = seatNum++;
              return (
                <div
                  key={`R-${col}`}
                  className={getSeatClass(seats[index])}
                  onClick={() => handleSeatClick(index)}
                >
                  {seats[index] ? seats[index].gender : index + 1}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Last 5 merged seats row
    seatLayout.push(
      <div key="last-row" className="seat-row last-row">
        <div className="merged-seats">
          {Array.from({ length: 5 }).map((_, i) => {
            const index = seatNum++;
            return (
              <div
                key={i}
                className={getSeatClass(seats[index])}
                onClick={() => handleSeatClick(index)}
              >
                {seats[index] ? seats[index].gender : index + 1}
              </div>
            );
          })}
        </div>
      </div>
    );

    return seatLayout;
  };

  return (
    <div
      className="bus-page"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="overlay"></div>
      <div className="seat-container">
        {/* Left Side - Seats */}
        <div className="seats-section">
          <h1>Aspire Transport Booking</h1>
         <h2 className="route">  Lahore → Mandi Bahauddin 5pm </h2>
          <p className="caption">
            Select your seat, choose Male or Female, and proceed with payment.
          </p>

          <div className="bus-layout">{renderSeats()}</div>

          <div className="legend">
            <h3>Seat Legend:</h3>
            <div className="legend-items">
              <div className="legend-item">
                <div className="seat-sample male-sample"></div>
                <span>Male (Yellow)</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample female-sample"></div>
                <span>Female (Red)</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample"></div>
                <span>Available (White)</span>
              </div>
            </div>
          </div>

          <div className="booking-info">
            <h2>For More Help & Support:</h2>
            <p>📞 Call our customer service: 0312-6378904</p>
            <p>📧 Email: aspiretransport@gmail.com</p>

            <h2>Payment Methods Accepted:</h2>
            <p>💳 Debit/Credit Cards</p>
            <p>📱 EasyPaisa Mobile Account</p>
            <p>🏦 Bank Transfer</p>

            <p className="help-caption">
              Our team is available 24/7 to assist you with your booking and travel needs.
              Don't hesitate to reach out for any queries or special requirements.
            </p>

            <p className="payment-note">
              ⚠️ After completing your payment, your selected seat will be officially booked.
              Please keep your payment confirmation for reference.
            </p>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        {selectedSeat !== null && (
          <div className="payment-section">
            <h2>Book Seat {selectedSeat + 1}</h2>

            <div className="price-box">
              <h3>Ticket Price</h3>
              <div className="price-amount">Rs. {ticketPrice}</div>
            </div>

            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="payment-method-selector">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                    />
                    <span>Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easypaisa"
                      checked={formData.paymentMethod === "easypaisa"}
                      onChange={handleInputChange}
                    />
                    <span>EasyPaisa</span>
                  </label>
                </div>
              </div>

              {formData.paymentMethod === "card" ? (
                <>
                  <div className="form-group">
                    <label>Debit Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      maxLength="16"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group half">
                      <label>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        maxLength="3"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </div>

                    <div className="form-group half">
                      <label>Expiry Date</label>
                      <input
                        type="month"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="easypaisa-details">
                  <h4>EasyPaisa Payment Details:</h4>
                  <div className="form-group">
                    <label>EasyPaisa Account Number</label>
                    <input
                      type="text"
                      name="easypaisaAccount"
                      value={formData.easypaisaAccount}
                      onChange={handleInputChange}
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      name="easypaisaName"
                      value={formData.easypaisaName}
                      onChange={handleInputChange}
                      placeholder="As registered in EasyPaisa"
                    />
                  </div>

                  <div className="form-group">
                    <label>5-Digit PIN Code</label>
                    <input
                      type="password"
                      name="easypaisaPin"
                      maxLength="5"
                      value={formData.easypaisaPin}
                      onChange={handleInputChange}
                      placeholder="12345"
                    />
                  </div>

                  <div className="easypaisa-caption">
                    <p>🔒 Your payment details are secure and encrypted.</p>
                    <p>💰 The amount of Rs. {ticketPrice} will be deducted from your EasyPaisa account.</p>
                  </div>
                </div>
              )}

              <button type="submit" className="pay-btn">
                {formData.paymentMethod === "card"
                  ? "Pay & Book Seat"
                  : "Confirm EasyPaisa Payment"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bus1Seat;
