import { rtdb } from "./Firebase";
import { ref, set, onValue } from "firebase/database";

// Add an active user to the study room
export function addActiveUser(userId, name) {
  set(ref(rtdb, "activeUsers/" + userId), {
    username: name,
    online: true,
  });
}

// Listen for real-time changes in active users
export function listenForActiveUsers(callback) {
  const activeUsersRef = ref(rtdb, "activeUsers");
  onValue(activeUsersRef, (snapshot) => {
    callback(snapshot.val());
  });
}
