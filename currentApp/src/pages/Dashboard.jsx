import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchUserFiles from "../utils/FetchUserFiles"; // Utility to fetch user files
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getFiles = async () => {
      const userFiles = await fetchUserFiles();
      setFiles(userFiles);
    };
    getFiles();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">
        <button className="dashboard-btn profile" onClick={() => navigate("/profile")}>Profile</button>
        <button className="dashboard-btn files" onClick={() => navigate("/files")}>Files</button>
        <button className="dashboard-btn schedule" onClick={() => navigate("/schedule")}>Schedule</button>
        <button className="dashboard-btn settings" onClick={() => navigate("/settings")}>Settings</button>
        <button className="dashboard-btn analytics" onClick={() => navigate("/analytics")}>Analytics</button>
        <button className="dashboard-btn study-planner" onClick={() => navigate("/study-planner")}>Study Planner</button>
      </div>

      <h2 className="uploaded-title">My Uploaded Files</h2>
      <div className="files-grid">
        {files.length === 0 ? (
          <p className="no-files">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="file-card">
              <p className="file-name">{file.name}</p>
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">View File</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;