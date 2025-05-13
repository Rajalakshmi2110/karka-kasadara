import React, { useState, useEffect } from "react";
import { auth, db } from "../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import uploadToCloudinary from "../Firebase/Cloudinary";
import { FaFileAlt, FaFileImage, FaFileVideo, FaFilePdf } from "react-icons/fa";
import "../styles/Files.css"; // Custom styles

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
        <div className="files-container">
            <h2 className="title">📂 My Uploaded Files</h2>

            <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
            />
            <button
                onClick={handleUpload}
                className="upload-btn"
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {uploadedFileUrl && (
                <div className="upload-success">
                    <p>✅ File uploaded successfully!</p>
                    <CompactFilePreview file={{ url: uploadedFileUrl, type: file.type, name: file.name }} />
                </div>
            )}

            <h3 className="subtitle">📄 Uploaded Files</h3>
            <div className="file-grid">
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
        if (file.type.startsWith("image/")) return <FaFileImage className="file-icon image" />;
        if (file.type.startsWith("video/")) return <FaFileVideo className="file-icon video" />;
        if (file.type === "application/pdf") return <FaFilePdf className="file-icon pdf" />;
        return <FaFileAlt className="file-icon default" />;
    };

    return (
        <div className="file-card">
            {file.type.startsWith("image/") ? (
                <img
                    src={file.url.replace("/upload/", "/upload/w_100,h_100,c_fill/")}
                    alt={file.name}
                    className="thumbnail"
                />
            ) : (
                getFileIcon()
            )}
            <div className="file-name">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.name}
                </a>
            </div>
        </div>
    );
};

export default Files;
