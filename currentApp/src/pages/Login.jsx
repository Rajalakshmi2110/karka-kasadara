import { useState } from "react";
import { auth, googleProvider } from "../Firebase/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import socket from './socket';

// ✅ Avoid re-declaring auth – already imported from Firebase.js
auth.onAuthStateChanged(user => {
  if (user) {
    socket.emit('join', user.uid);
  }
});

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("✅ Login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Login Error:", error.message);
            setErrorMessage("❌ " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            await signInWithPopup(auth, googleProvider);
            alert("✅ Google login successful!");
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Google Login Error:", error.message);
            setErrorMessage("❌ " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        alert("⚠️ You're using Guest Mode. Some features may be limited.");
        navigate("/dashboard");
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const navigateToSignUp = () => {
        navigate("/register");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Login</h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />

                    <div className="password-input-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                        <button
                            type="button"
                            className="password-visibility-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {passwordVisible ? "Hide" : "Show"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="divider">or</div>

                <button
                    onClick={handleGoogleLogin}
                    className="google-button"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in with Google"}
                </button>

                <button
                    onClick={handleGuestLogin}
                    className="guest-button"
                    disabled={loading}
                >
                    Continue as Guest
                </button>

                <div className="sign-up-link">
                    <p>
                        Don't have an account?
                        <span
                            onClick={navigateToSignUp}
                            style={{ color: "blue", cursor: "pointer" }}
                        >
                            {" "}Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
