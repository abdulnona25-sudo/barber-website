const { useState } = React;

function BookingForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        time: ""
    });

    const [showPopup, setShowPopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 👉 HANDLE INPUT CHANGE
    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (e.target.name === "phone") {
            setPhoneError("");
        }

        setErrorMessage("");
    }

    // 👉 VALIDATE UK PHONE
    function validateUKPhone(phone) {
        const ukPhoneRegex = /^(?:0|\+44)\d{9,10}$/;
        return ukPhoneRegex.test(phone.replace(/\s+/g, ""));
    }

    // 👉 FORM SUBMIT
    function handleSubmit(e) {
        e.preventDefault();

        if (!validateUKPhone(formData.phone)) {
            setPhoneError("Please enter a valid UK phone number");
            return;
        }

        if (formData.time < "09:00" || formData.time > "18:30") {
            setErrorMessage("Please choose a time during opening hours");
            return;
        }

        setShowPopup(true);
    }

    // 👉 CONFIRM BOOKING (FIXED)
    async function confirmBooking() {
        console.log("CLICKED");

        setLoading(true);

        try {
            const response = await fetch("https://barber-website-d8re.onrender.com/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            console.log("Response:", response);

            const data = await response.json();
            console.log("Data:", data);

            if (!response.ok) {
                setErrorMessage(data.message || "Booking failed");
                setShowPopup(false);
                setLoading(false);
                return;
            }

            // ✅ SUCCESS
            setShowPopup(false);
            setShowSuccess(true);
            setErrorMessage("");
            setFormData({ name: "", phone: "", time: "" });

        } catch (error) {
            console.error("ERROR:", error);
            setErrorMessage("Server error. Try again.");
        }

        setLoading(false);
    }

    // 👉 CANCEL
    function cancelBooking() {
        setShowPopup(false);
    }

    return (
        <div className="bookingPage grid md:grid-cols-3 gap-10 px-10">

            {/* LEFT */}
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

            {/* CENTER */}
            <div className="bookingCenter">
                <h1>Book Appointment</h1>

                {/* ERROR */}
                {errorMessage && (
                    <div style={{
                        background: "#ff4d4d",
                        color: "white",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px"
                    }}>
                        {errorMessage}
                    </div>
                )}

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
                        placeholder="UK Phone Number"
                        value={formData.phone}
                        required
                        onChange={handleChange}
                    />

                    {phoneError && (
                        <div style={{ color: "#ff4d4d", fontSize: "0.9rem" }}>
                            {phoneError}
                        </div>
                    )}

                    <select
                        name="time"
                        value={formData.time}
                        required
                        onChange={handleChange}
                    >
                        <option value="">Select Time</option>
                        {[
                            "09:00","09:30","10:00","10:30","11:00","11:30",
                            "12:00","12:30","13:00","13:30","14:00","14:30",
                            "15:00","15:30","16:00","16:30","17:00","17:30","18:00"
                        ].map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>

                    <button type="submit" className="btnBook">
                        Request Booking
                    </button>

                </form>
            </div>

            {/* RIGHT */}
            <div className="paymentInfo">
                <h3>Payment Methods</h3>
                <p>• Cash</p>
                <p>• Bank Transfer</p>
            </div>

            {/* CONFIRM POPUP */}
            {showPopup && (
                <div className="popupOverlay">
                    <div className="popupBox">
                        <h3>Confirm Booking</h3>

                        <p><b>Name:</b> {formData.name}</p>
                        <p><b>Phone:</b> {formData.phone}</p>
                        <p><b>Time:</b> {formData.time}</p>

                        <div className="popupButtons">
                            <button
                                type="button"
                                className="btnBook"
                                onClick={confirmBooking}
                                disabled={loading}
                            >
                                {loading ? "Booking..." : "Confirm"}
                            </button>

                            <button
                                className="btnCancel"
                                onClick={cancelBooking}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="popupOverlay">
                    <div className="popupBox">
                        <h3>Booking Sent ✅</h3>
                        <p>Barber will contact you by phone/text.</p>

                        <button
                            className="btnBook"
                            onClick={() => {
                                setShowSuccess(false);
                                setFormData({ name: "", phone: "", time: "" });
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

// RENDER
const root = ReactDOM.createRoot(document.getElementById("booking-root"));
root.render(<BookingForm />);