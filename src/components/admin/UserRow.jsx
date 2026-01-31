import React from 'react';
import PropTypes from 'prop-types';
import { CustomButton, CustomSelect } from '../custom';

const UserRow = ({ user, onRoleChange, onDelete }) => {
    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.username || 'N/A'}</td>
            <td>
                <div style={{ width: '120px' }}>
                    <CustomSelect
                        value={user.role}
                        onChange={(e) => onRoleChange(user, e.target.value)}
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
                    onClick={() => onDelete(user)}
                />
            </td>
        </tr>
    );
};

UserRow.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string,
        email: PropTypes.string,
        username: PropTypes.string,
        role: PropTypes.string,
    }).isRequired,
    onRoleChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default UserRow;
