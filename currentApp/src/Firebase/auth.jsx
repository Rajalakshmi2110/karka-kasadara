import React, { useState, useContext } from "react";
import { signUpUser, signInUser, signOutUser } from "./UserAuth";
import { AuthContext } from "./AuthContext"; 

const Auth = () => {
    const { login } = useContext(AuthContext); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const user = await signInUser(email, password);
                login(user, user.token); 
                alert("Signed in successfully!");
            } else {
                const user = await signUpUser(email, password, username);
                login(user, user.token);
                alert("Account created successfully!");
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
            <button onClick={signOutUser}>Sign Out</button>
        </div>
    );
};

export default Auth;
