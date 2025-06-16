import { auth } from "./Firebase"; 
import { db } from "./Firebase"; 
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";

const uploadToCloudinary = async (file) => {
    if (!file) {
        alert("❌ No file selected.");
        return;
    }

    // Check environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        console.error("❌ Cloudinary credentials missing in .env file");
        alert("❌ Upload failed: Missing Cloudinary credentials.");
        return;
    }

    // Ensure user is authenticated
    const user = auth.currentUser;
    if (!user) {
        alert("❌ Please sign in to upload files.");
        return;
    }

    console.log("🔹 Uploading file:", file.name);
    console.log("🔹 File type:", file.type);

    // Determine upload type (image, video, or raw)
    let fileType = "raw"; // Default for non-images
    if (file.type.startsWith("image/")) {
        fileType = "image";
    } else if (file.type.startsWith("video/")) {
        fileType = "video";
    }

    // Unique filename to prevent conflicts
    const uniqueFileName = `${Date.now()}_${file.name}`;

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("public_id", `user_files/${user.uid}/${uniqueFileName}`);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/${fileType}/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        const fileURL = response.data.secure_url;
        console.log("✅ Upload Successful:", fileURL);

        // Save file info to Firestore
        const fileRef = doc(db, "users", user.uid, "files", uniqueFileName);
        await setDoc(fileRef, {
            url: fileURL,
            name: file.name,
            uploadedAt: new Date(),
            type: file.type
        });

        alert("✅ File uploaded and saved to your account!");
        return fileURL;
    } catch (error) {
        console.error("❌ Upload Error:", error.response?.data || error.message);
        alert("❌ Upload failed: " + (error.response?.data?.error?.message || "Unknown error"));
    }
};

export default uploadToCloudinary;
