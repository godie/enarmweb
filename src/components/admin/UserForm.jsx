import { useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomRow, CustomCol, CustomCard, CustomTextInput, CustomSelect, CustomButton } from "../custom";
import { alertError, alertSuccess } from "../../services/AlertService";
import UserService from "../../services/UserService";

const UserForm = () => {
  const history = useHistory();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "player"
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.password_confirmation) {
      alertError("Jugadores", "La confirmación de contraseña no coincide.");
      return;
    }

    try {
      setSaving(true);
      await UserService.createUser(form);
      await alertSuccess("Jugadores", "Usuario creado correctamente.");
      history.push("/dashboard/players");
    } catch (error) {
      console.error("Error creating user", error);
      alertError("Jugadores", "No se pudo crear el usuario.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CustomRow>
      <CustomCol s={12} m={8} offset="m2">
        <CustomCard title="Agregar un nuevo jugador" className="white">
          <form onSubmit={onSubmit}>
            <CustomTextInput id="user-name" label="Nombre" name="name" value={form.name} onChange={onChange} />
            <CustomTextInput
              id="user-username"
              label="Usuario"
              name="username"
              value={form.username}
              onChange={onChange}
            />
            <CustomTextInput
              id="user-email"
              type="email"
              label="Email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
            <CustomTextInput
              id="user-password"
              type="password"
              label="Contraseña"
              name="password"
              value={form.password}
              onChange={onChange}
              required
            />
            <CustomTextInput
              id="user-password-confirm"
              type="password"
              label="Confirmar contraseña"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={onChange}
              required
            />
            <CustomSelect id="user-role" label="Rol" name="role" value={form.role} onChange={onChange}>
              <option value="player">Jugador</option>
              <option value="admin">Admin</option>
            </CustomSelect>

            <div className="right-align" style={{ marginTop: "1rem" }}>
              <CustomButton flat className="grey-text" type="button" onClick={() => history.push("/dashboard/players")}>
                Cancelar
              </CustomButton>
              <CustomButton className="green" type="submit" isPending={saving} isPendingText="GUARDANDO...">
                Guardar jugador
              </CustomButton>
            </div>
          </form>
        </CustomCard>
      </CustomCol>
    </CustomRow>
  );
};

export default UserForm;
