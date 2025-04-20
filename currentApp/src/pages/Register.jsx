import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            // Make a POST request to your backend API
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password,
            });

            alert("✅ Registered successfully!");
            navigate("/login"); // Redirect to Login page after successful registration
        } catch (err) {
            console.error("❌ Registration Error:", err);
            setErrorMessage("❌ " + err.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register</h2>

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="register-input"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-input"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-input"
                        required
                    />

                    <button type="submit" className="register-button" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default Register;
