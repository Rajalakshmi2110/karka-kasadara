import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "./Firebase/auth";
import { auth, db } from "./Firebase";
import { doc, setDoc } from "./Firestore";

// Sign up new users
export const signUpUser = async (email, password, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            username,
            email,
            uid: user.uid
        });

        return user;
    } catch (error) {
        console.error("Signup Error:", error);
        throw error;
    }
};

// Sign in users
export const signInUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Sign-in Error:", error);
        throw error;
    }
};

// Sign out users
export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign-out Error:", error);
    }
};
