import React, { useState, useEffect } from "react";
import Auth from "../modules/Auth";
import UserService from "../services/UserService"; // Import UserService

const Profile = () => {
  const [fbUser, setFbUser] = useState({ name: "", email: "", facebook_id: null }); // Add id to user state
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let user = { name: "", email: "", id: null };
    let userToSet = null; // Temporary variable to hold the user object

    if (Auth.isFacebookUser()) {
      const fbUserObject = Auth.getFacebookUser(); // Auth.getFacebookUser() already parses JSON
      if (fbUserObject) {
        userToSet = JSON.parse(fbUserObject); // Assign parsed object directly
      } else {
        console.error("Error parsing Facebook user data from Auth module: No user data found");
        setError("Error loading user data.");
      }
    } else if (Auth.isUserAuthenticated()) { // Check for regular authenticated user
      const userStr = localStorage.getItem('user'); // Assuming 'user' is the key for regular user data
      if (userStr) {
        try {
          userToSet = JSON.parse(userStr);
        } catch (e) {
          console.error("Error parsing user data from localStorage:", e);
          setError("Error loading user data.");
        }
      }
    }

    if (userToSet) {
      setFbUser(userToSet); // Set state once after determining user type
      user = userToSet; // Ensure 'user' variable for API call is updated
      user.id  = userToSet.facebook_id
    }


    if (user && user.id) {
      UserService.getAchievements(user.id)
        .then(response => {
          setAchievements(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching achievements:", err);
          setError("Error fetching achievements.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      // setError("User ID not found, cannot fetch achievements."); // Optional: set error if no user ID
    }
  }, []);


  if (loading) {
    return <div className="section center">Loading...</div>;
  }

  if (error) {
    return <div className="section center red-text">{error}</div>;
  }

  return (
    <div className="section center container">
      <h4>Player Profile</h4>
      <div className="card" style={{ padding: "20px" }}>
        <p><strong>Name:</strong> {fbUser.name || "N/A"}</p>
        <p><strong>Email:</strong> {fbUser.email || "N/A"}</p>
        <h5>Achievements</h5>
        {achievements.length > 0 ? (
          <ul className="collection">
            {achievements.map(ach => (
              <li key={ach.id} className="collection-item" role="listitem">
                <strong>{ach.name}</strong>: {ach.description}
                {ach.unlocked_at && <span className="new badge" data-badge-caption="Unlocked"></span>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No achievements yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
