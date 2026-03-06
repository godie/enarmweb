import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CustomRow, CustomCol, CustomCard, CustomTextInput, CustomTextarea, CustomButton } from "../custom";
import { alertError, alertSuccess } from "../../services/AlertService";
import AchievementService from "../../services/AchievementService";

const AchievementForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    icon_url: "",
    points: 0
  });

  useEffect(() => {
    const loadAchievement = async () => {
      if (!isEdit) return;
      try {
        const response = await AchievementService.getAchievements();
        const data = Array.isArray(response.data) ? response.data : [];
        const current = data.find((achievement) => String(achievement.id) === String(id));
        if (!current) {
          alertError("Logros", "No se encontró el logro solicitado.");
          history.push("/dashboard/logros");
          return;
        }
        setForm({
          name: current.name || "",
          description: current.description || "",
          icon_url: current.icon_url || "",
          points: current.points || 0
        });
      } catch (error) {
        console.error("Error loading achievement", error);
        alertError("Logros", "No se pudo cargar el logro.");
      } finally {
        setLoading(false);
      }
    };
    loadAchievement();
  }, [history, id, isEdit]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        await AchievementService.updateAchievement(id, form);
      } else {
        await AchievementService.createAchievement(form);
      }
      await alertSuccess("Logros", `Logro ${isEdit ? "actualizado" : "creado"} correctamente.`);
      history.push("/dashboard/logros");
    } catch (error) {
      console.error("Error saving achievement", error);
      alertError("Logros", "No se pudo guardar el logro.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <CustomRow>
      <CustomCol s={12} m={8} offset="m2">
        <CustomCard title={isEdit ? "Editar logro" : "Agregar un nuevo logro"} className="white">
          <form onSubmit={onSubmit}>
            <CustomTextInput id="achievement-name" label="Nombre" name="name" value={form.name} onChange={onChange} required />
            <CustomTextarea
              id="achievement-description"
              label="Descripción"
              name="description"
              value={form.description}
              onChange={onChange}
            />
            <CustomTextInput
              id="achievement-icon-url"
              label="Icon URL"
              name="icon_url"
              value={form.icon_url}
              onChange={onChange}
            />
            <CustomTextInput
              id="achievement-points"
              type="number"
              min={0}
              label="Puntos"
              name="points"
              value={form.points}
              onChange={onChange}
              required
            />

            <div className="right-align" style={{ marginTop: "1rem" }}>
              <CustomButton flat className="grey-text" type="button" onClick={() => history.push("/dashboard/logros")}>
                Cancelar
              </CustomButton>
              <CustomButton className="green" type="submit" isPending={saving} isPendingText="GUARDANDO...">
                Guardar logro
              </CustomButton>
            </div>
          </form>
        </CustomCard>
      </CustomCol>
    </CustomRow>
  );
};

export default AchievementForm;
