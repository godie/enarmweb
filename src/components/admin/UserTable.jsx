import { useState, useEffect, useCallback } from 'react';
import {
    CustomRow,
    CustomCol,
    CustomTable,
    CustomPreloader,
    CustomButton,
    CustomSelect
} from '../custom';
import UserService from '../../services/UserService';
import { alertError, alertSuccess, confirmDialog } from '../../services/AlertService';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = useCallback(async (showPreloader = true) => {
        if (showPreloader) setLoading(true);
        try {
            const res = await UserService.getUsers();
            setUsers(res.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleChangeRole = async (user, newRole) => {
        try {
            await UserService.updateUser(user.id, { role: newRole });
            alertSuccess("Usuario Actualizado", `El rol de ${user.name} ahora es ${newRole}`);
            loadUsers();
        } catch (error) {
            console.error("Error updating user role", error);
            alertError("Error", "No se pudo actualizar el rol");
        }
    };

    const handleDeleteUser = async (user) => {
        const confirm = await confirmDialog("¿Eliminar Usuario?", `¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer.`);
        if (confirm) {
            try {
                await UserService.deleteUser(user.id);
                alertSuccess("Usuario Eliminado", "El usuario ha sido eliminado correctamente");
                loadUsers();
            } catch (error) {
                console.error("Error deleting user", error);
                alertError("Error", "No se pudo eliminar el usuario");
            }
        }
    };

    if (loading) {
        return (
            <div className="center-align" style={{ padding: '50px' }}>
                <CustomPreloader active color="green" size="big" />
            </div>
        );
    }

    return (
        <div className="user-table-container">
            <CustomRow>
                <CustomCol s={12}>
                    <h4 className="grey-text text-darken-3">Gestión de Jugadores</h4>
                    <CustomTable className="highlight z-depth-1">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th className="right-align">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.username || 'N/A'}</td>
                                    <td>
                                        <div style={{ width: '120px' }}>
                                            <CustomSelect
                                                value={user.role}
                                                onChange={(e) => handleChangeRole(user, e.target.value)}
                                                noMargin
                                            >
                                                <option value="player">Jugador</option>
                                                <option value="admin">Admin</option>
                                            </CustomSelect>
                                        </div>
                                    </td>
                                    <td className="right-align">
                                        <CustomButton
                                            flat
                                            className="red-text"
                                            icon="delete"
                                            onClick={() => handleDeleteUser(user)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </CustomTable>
                </CustomCol>
            </CustomRow>
        </div>
    );
};

export default UserTable;
