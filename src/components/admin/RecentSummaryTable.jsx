import { Link } from 'react-router-dom';
import { CustomButton, CustomTable, CustomCol } from '../custom';

const RecentSummaryTable = ({ title, items, headers, renderRow, addItemLink, viewAllLink }) => (
    <CustomCol s={12} m={6}>
        <div className="card-panel white">
            <div className="valign-wrapper" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h5 className="grey-text text-darken-3" style={{ margin: 0 }}>{title}</h5>
                <CustomButton
                    href={addItemLink}
                    node='a'
                    className="green darken-1 btn white-text"
                    icon="add"
                />
            </div>
            <CustomTable className="highlight">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} className={index > 0 && index === headers.length - 1 ? "right-align" : ""}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => renderRow(item))}
                </tbody>
            </CustomTable>
            <div className="center-align" style={{ marginTop: '1.5rem' }}>
                <Link to={viewAllLink} className="green-text" style={{ fontWeight: '500' }}>VER TODO(A)S</Link>
            </div>
        </div>
    </CustomCol>
);

export default RecentSummaryTable;
