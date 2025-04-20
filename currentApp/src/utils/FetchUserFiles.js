import { db, auth } from "../Firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";

const fetchUserFiles = async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("❌ Please sign in to view your files.");
        return [];
    }

    try {
        const filesCollection = collection(db, "users", user.uid, "files");
        const snapshot = await getDocs(filesCollection);

        let files = [];
        snapshot.forEach(doc => {
            files.push({ id: doc.id, ...doc.data() });
        });

        return files;
    } catch (error) {
        console.error("❌ Error fetching files:", error);
        return [];
    }
};

export default fetchUserFiles;
