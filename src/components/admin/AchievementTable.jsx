import { useCallback, useEffect, useState } from "react";
import { CustomRow, CustomCol, CustomTable, CustomPreloader, CustomButton } from "../custom";
import { alertError, alertSuccess, confirmDialog } from "../../services/AlertService";
import AchievementService from "../../services/AchievementService";

const AchievementTable = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AchievementService.getAchievements();
      setAchievements(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading achievements", error);
      alertError("Logros", "No se pudieron cargar los logros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const handleDelete = async (achievement) => {
    const accepted = await confirmDialog(
      "Eliminar logro",
      `¿Deseas eliminar el logro "${achievement.name}"?`
    );
    if (!accepted) return;

    try {
      await AchievementService.deleteAchievement(achievement.id);
      await alertSuccess("Logros", "Logro eliminado.");
      loadAchievements();
    } catch (error) {
      console.error("Error deleting achievement", error);
      alertError("Logros", "No se pudo eliminar el logro.");
    }
  };

  if (loading) {
    return (
      <div className="center-align" style={{ padding: "50px" }}>
        <CustomPreloader active color="green" size="big" />
      </div>
    );
  }

  return (
    <div className="achievement-table-container">
      <CustomRow>
        <CustomCol s={12}>
          <h4 className="grey-text text-darken-3">Gestión de Logros</h4>
          <div className="right-align" style={{ marginBottom: "1rem" }}>
            <CustomButton
              node="a"
              href="#/dashboard/logros/new"
              className="green"
              icon="emoji_events"
              iconPosition="right"
            >
              Agregar un nuevo logro
            </CustomButton>
          </div>
          <CustomTable className="highlight z-depth-1">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Puntos</th>
                <th className="right-align">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {achievements.length === 0 ? (
                <tr>
                  <td colSpan="4" className="center-align">
                    No hay logros configurados.
                  </td>
                </tr>
              ) : (
                achievements.map((achievement) => (
                  <tr key={achievement.id}>
                    <td>{achievement.name}</td>
                    <td>{achievement.description}</td>
                    <td>{achievement.points}</td>
                    <td className="right-align">
                      <CustomButton
                        flat
                        node="a"
                        href={`#/dashboard/logros/edit/${achievement.id}`}
                        className="blue-text"
                        icon="edit"
                        tooltip="Editar logro"
                      />
                      <CustomButton
                        flat
                        className="red-text"
                        icon="delete"
                        tooltip="Eliminar logro"
                        onClick={() => handleDelete(achievement)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </CustomTable>
        </CustomCol>
      </CustomRow>
      <CustomButton
        node="a"
        href="#/dashboard/logros/new"
        className="red"
        large
        floating
        fab
        icon="add"
        tooltip={{ text: "Agregar un nuevo logro", position: "top" }}
        waves="light"
      />
    </div>
  );
};

export default AchievementTable;
