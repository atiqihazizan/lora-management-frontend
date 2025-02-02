import PropTypes from "prop-types";

const TableUI = ({
  title,
  data = [],
  loading = false,
  error = null,
  columns,
  rowStyle = null,
  actionColumn = null,
  customButtons = [],
  tableClassName = "",
  headerClassName = "",
}) => {
  if (loading) return <div className="text-center py-4">Loading Data...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="p-6 bg-white shadow-sm w-full border-gray-200">
      <Header title={title} totalRecords={data.length} customButtons={customButtons} />
      <div className="overflow-hidden rounded-lg">
        <table className={`min-w-full divide-y divide-gray-200 ${tableClassName}`}>
          <TableHeader
            columns={columns}
            actionColumn={actionColumn}
            headerClassName={headerClassName}
          />
          <TableBody
            data={data}
            columns={columns}
            rowStyle={rowStyle}
            actionColumn={actionColumn}
          />
        </table>
      </div>
    </div>
  );
};

const Header = ({ title, totalRecords, customButtons }) => (
  <div className="flex justify-between items-center mb-4">
    <div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">Showing {totalRecords} of {totalRecords} records</p>
    </div>
    <div className="flex space-x-2">
      {customButtons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`px-4 py-2 rounded text-white ${button.className || "bg-blue-500 hover:bg-blue-600"}`}
          title={button.tooltip || ""}
        >
          {button.label}
        </button>
      ))}
    </div>
  </div>
);

const TableHeader = ({ columns, actionColumn, headerClassName }) => (
  <thead className={`bg-gray-50 ${headerClassName}`}>
    <tr>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 w-10">#</th>
      {columns.map((col, index) => (
        <th
          key={index}
          className={`px-4 py-2 text-left text-sm font-medium text-gray-500 ${col.className || ""} ${col?.classNameHeader || ""}`}
          style={{ width: col.width || "auto" }}
        >
          {col.renderHeader ? col.renderHeader(col.label) : col.label}
        </th>
      ))}
      {actionColumn && (
        <th
          className={`px-4 py-2 text-left text-sm font-medium text-gray-500 ${actionColumn.className || ""}`}
          style={{ width: actionColumn.width || "auto" }}
        >
          {actionColumn.label || "Actions"}
        </th>
      )}
    </tr>
  </thead>
);

const TableBody = ({ data, columns, rowStyle, actionColumn }) => (
  <tbody className="bg-white divide-y divide-gray-200">
    {data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
        style={rowStyle?.(row)}
      >
        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
          {rowIndex + 1}
        </td>
        {columns.map(({ key, render, className, classNameRow }, colIndex) => (
          <td key={colIndex} className={`px-4 py-2 text-sm text-gray-900 ${className || ""} ${classNameRow || ""}`}>
            {render ? render(row[key], row, colIndex) : row[key]}
          </td>
        ))}
        {actionColumn && (
          <td
            className={`px-4 py-2 whitespace-nowrap text-sm text-gray-900 ${actionColumn.className || ""}`}
          >
            <ActionsColumn actions={actionColumn.actions} layout={actionColumn.layout} row={row} />
          </td>
        )}
      </tr>
    ))}
  </tbody>
);

const ActionsColumn = ({ actions, layout = "horizontal", row = {} }) => (
  <div className={`flex ${layout === "vertical" ? "flex-col space-y-2" : "space-x-2"}`}>
    {actions?.map((action, index) => (
      <button
        key={index}
        className={`flex items-center ${action.className || "text-blue-600 hover:text-blue-800"}`}
        onClick={() => action.onClick?.(row)}
        title={action.tooltip || ""}
      >
        {action.icon ? action.icon : action.label}
      </button>
    ))}
  </div>
);

const columnShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  render: PropTypes.func,
  className: PropTypes.string,
  width: PropTypes.string,
});

const actionShape = PropTypes.shape({
  icon: PropTypes.element,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  tooltip: PropTypes.string,
});

const actionColumnShape = PropTypes.shape({
  label: PropTypes.string,
  layout: PropTypes.oneOf(["vertical", "horizontal"]),
  actions: PropTypes.arrayOf(actionShape),
  className: PropTypes.string,
  width: PropTypes.string,
});

TableUI.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  error: PropTypes.string,
  columns: PropTypes.arrayOf(columnShape).isRequired,
  rowStyle: PropTypes.func,
  actionColumn: actionColumnShape,
  customButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
      tooltip: PropTypes.string,
    })
  ),
  tableClassName: PropTypes.string,
  headerClassName: PropTypes.string,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  totalRecords: PropTypes.number.isRequired,
  customButtons: TableUI.propTypes.customButtons,
};

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(columnShape).isRequired,
  actionColumn: actionColumnShape,
  headerClassName: PropTypes.string,
};

TableBody.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(columnShape).isRequired,
  rowStyle: PropTypes.func,
  actionColumn: actionColumnShape,
};

ActionsColumn.propTypes = {
  actions: PropTypes.arrayOf(actionShape).isRequired,
  layout: PropTypes.oneOf(["vertical", "horizontal"]),
  row: PropTypes.object,
};

export default TableUI;
