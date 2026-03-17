const {useState} = React;

function BookingForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        time: ""
    });

    const [showPopup, setShowPopup]= useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if(e.target.name === "phone") {
            setPhoneError("");
        }
    }

    function validateUKPhone(phone) {

        const ukPhoneRegex = /^(?:0|\+44)\d{9,10}$/;

        return ukPhoneRegex.test(phone.replace(/\s+/g, ""));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!validateUKPhone(formData.phone)) {
            setPhoneError("Please enter a valid UK phone number (07123456789 or +447123456789)");
            return;
        }

        if (formData.time < "09:00" || formData.time > "18:30") {
            alert("Please choose a time during opening hours");
            return;
        }

        setShowPopup(true);
    }

    function confirmBooking() {
        setShowPopup(false);
        setShowSuccess(true);
    }

    function cancelBooking(){
        setShowPopup(false);
    }

    return (
        <div className="bookingPage grid md:grid-cols-3 gap-10 px-10">
        
        <div className="bookingHours">
            <h3>Opening Hours</h3>
            <p>Saturday: 9 am – 6 pm</p>
            <p>Sunday: 10 am – 5 pm</p>
            <p>Monday: 9 am – 6 pm</p>
            <p>Tuesday: 9 am – 6 pm</p>
            <p>Wednesday: 9 am – 6 pm</p>
            <p>Thursday: 9 am – 6:30 pm</p>
            <p>Friday: 9 am – 6:30 pm</p>
        </div>

        <div className="bookingCenter">
            <h1>Book Appointment</h1>

            <form onSubmit={handleSubmit} className="bookingForm mx-auto text-center">
                <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                required
                onChange={handleChange}
                />

                <input
                type="tel"
                name="phone"
                placeholder="UK Phone Number (e.g., 07123456789)"
                value={formData.phone}
                required
                onChange={handleChange}
                />

                {phoneError && <div style={{color: "#ff4d4d", fontSize: "0.9rem" }}>{phoneError}</div>}

                <select
                name="time"
                value={formData.time}
                required
                onChange={handleChange}
                >
                    <option value="">Select Time</option>
                    {[
                        "09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"
                    ].map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>

                <button type="submit" className="btnBook px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">Request Booking</button>

            </form>

            </div>

            <div className="paymentInfo">
                <h3>Payment Methods</h3>
                <p>You can pay in the shop using:</p>
                <p>• Cash</p>
                <p>• Bank Transfer</p>
            </div>

            {showPopup && (
                <div className="popupOverlay">
                    <div className="popupBox">
                        
                        <h3>Confirm Your Booking</h3>

                        <p>Please make sure your details are correct.</p>

                        <p>The barber will confirm your appointment by <b>phone or text message</b>.</p>
                        <div style={{marginTop:"15px", textAlign:"left"}}>
                        <p><b>Name:</b> {formData.name}</p>
                        <p><b>Phone:</b> {formData.phone}</p>
                        <p><b>Time:</b> {formData.time}</p>
                        </div>

                        <div className="popupButtons">
                        <button className="btnBook" onClick={confirmBooking}>Confirm Booking</button>
                        <button className="btnCancel" onClick={cancelBooking}>Edit Details</button>
                        </div>

                    </div>
                    </div>
                    )}


            {showSuccess && (
                <div className="popupOverlay">
                    <div className="popupBox">

                        <h3>Booking Request Sent</h3>

                        <p>Thank you for your booking request.</p>

                        <p>
                        The barber will confirm your appointment by
                        <b> phone or text message.</b>
                        </p>

                        <button
                            className="btnBook"
                            onClick={() => {
                                setShowSuccess(false);
                                setFormData({ name:"", phone:"", time:"" });
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("booking-root"));
root.render(<BookingForm />);