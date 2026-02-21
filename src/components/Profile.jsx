import { useState, useEffect } from "react";
import Auth from "../modules/Auth";
import UserService from "../services/UserService";
import CustomPreloader from "./custom/CustomPreloader";
import styles from "./Profile.module.css";

const Profile = () => {
  const user = Auth.getUserInfo() || { id: null };
  const [state, setState] = useState({
    achievements: [],
    loading: !!user.id,
    error: user.id ? null : "No se encontró información del usuario. Por favor inicia sesión."
  });

  const { achievements, loading, error } = state;

  useEffect(() => {
    if (!user.id) return;

    UserService.getAchievements(user.id)
      .then(response => {
        setState({
          achievements: response.data,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        console.error("Error fetching achievements:", err);
        setState({
          achievements: [],
          error: "Error fetching achievements.",
          loading: false
        });
      });
  }, [user.id]);

  if (loading) {
    return (
      <div className="section center">
        <CustomPreloader size="big" />
      </div>
    );
  }

  if (error) {
    return <div className="section center red-text">{error}</div>;
  }

  return (
    <div className="section center container">
      <h4>Perfil de Usuario</h4>
      <div className={`card glass-card ${styles.cardWrapper}`}>
        <p><strong>Nombre:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Rol:</strong> <span className={`badge blue ${styles.badgePill}`}>{user.role || "player"}</span></p>

        <h5 className={styles.sectionTitle}>Logros</h5>
        {achievements.length > 0 ? (
          <ul className="collection glass-collection">
            {achievements.map(ach => (
              <li key={ach.id} className="collection-item" role="listitem">
                <span className="title"><strong>{ach.name}</strong></span>
                <p>{ach.description}</p>
                {ach.achieved_at && (
                  <span className="secondary-content green-text">
                    <i className="material-icons">check_circle</i>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="grey-text">Aún no has desbloqueado logros.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
