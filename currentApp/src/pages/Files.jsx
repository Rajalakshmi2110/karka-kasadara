import React, { useState, useEffect } from "react";
import { auth, db } from "../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import uploadToCloudinary from "../Firebase/Cloudinary"; 
import { FaFileAlt, FaFileImage, FaFileVideo, FaFilePdf } from "react-icons/fa"; // Icons
import "../styles/Files.css";

const Files = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState("");
    const [files, setFiles] = useState([]); 
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        const fetchFiles = async () => {
            try {
                const filesCollection = collection(db, "users", user.uid, "files");
                const fileSnapshot = await getDocs(filesCollection);
                const fileList = fileSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFiles(fileList);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, [user]); 

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("❌ No file selected!");
            return;
        }

        setUploading(true);

        try {
            const uploadResponse = await uploadToCloudinary(file);
            if (uploadResponse?.secure_url) {
                const compactUrl = uploadResponse.secure_url.replace("/upload/", "/upload/w_100,h_100,c_fill/");
                setUploadedFileUrl(compactUrl);
            }
        } catch (error) {
            console.error("❌ Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h2 className="text-2xl font-semibold mb-4">📂 My Uploaded Files</h2>

            <input 
                type="file" 
                onChange={handleFileChange} 
                className="mb-4 border p-2 rounded" 
            />
            <button 
                onClick={handleUpload} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {uploadedFileUrl && (
                <div className="mt-4">
                    <p className="text-green-600">✅ File uploaded successfully!</p>
                    <CompactFilePreview file={{ url: uploadedFileUrl, type: file.type, name: file.name }} />
                </div>
            )}

            <h3 className="text-xl font-semibold mt-6">📄 Uploaded Files</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 w-full max-w-2xl">
                {files.map(file => (
                    <CompactFilePreview key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
};

const CompactFilePreview = ({ file }) => {
    if (!file.url) return null;

    const getFileIcon = () => {
        if (file.type.startsWith("image/")) return <FaFileImage className="text-blue-500 text-xl" />;
        if (file.type.startsWith("video/")) return <FaFileVideo className="text-red-500 text-xl" />;
        if (file.type === "application/pdf") return <FaFilePdf className="text-green-500 text-xl" />;
        return <FaFileAlt className="text-gray-500 text-xl" />;
    };

    return (
        <div className="flex items-center space-x-2 bg-white p-2 rounded-md shadow-md w-60 hover:bg-gray-200 cursor-pointer">
            {file.type.startsWith("image/") ? (
                <img 
                    src={file.url.replace("/upload/", "/upload/w_100,h_100,c_fill/")} 
                    alt={file.name} 
                    className="w-12 h-12 object-cover rounded opacity-70" 
                />
            ) : (
                getFileIcon()
            )}
            <div className="flex-1 truncate">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-gray-800 text-sm">
                    {file.name}
                </a>
            </div>
        </div>
    );
};

export default Files;
