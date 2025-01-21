import React, { useEffect, useState } from "react";

const TableRegular = ({ title, apiUrl, columns, rowStyle, actionColumn, onDataChange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data initially or when apiUrl or onDataChange changes
  useEffect(() => {
    fetchData();
  }, [apiUrl, onDataChange]);

  // Render loading and error states
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  // Render table rows
  const renderRows = () => {
    return data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
        style={rowStyle?.(row)}
      >
        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{rowIndex + 1}</td>
        {columns.map(({ key, render, className }, colIndex) => (
          <td key={colIndex} className={`px-4 py-2 text-sm text-gray-900 ${className || ''}`}>
            {render ? render(row[key], row) : row[key]}
          </td>
        ))}
        {actionColumn && (
          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
            <div className={`flex ${actionColumn.layout === "vertical" ? "flex-col space-y-2" : "space-x-2"}`}>
              {actionColumn.actions?.map((action, index) => (
                <button
                  key={index}
                  className={`flex items-center ${action.className || "text-blue-600 hover:text-blue-800"}`}
                  onClick={() => {
                    action.onClick(row);
                    onDataChange?.(); // Trigger refresh if provided
                  }}
                  title={action.tooltip || ""}
                >
                  {action.type === "icon" ? <span className="material-icons">{action.icon}</span> : action.label}
                </button>
              ))}
            </div>
          </td>
        )}
      </tr>
    ));
  };

  return (
    <div className="p-6 bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">Showing {data.length} of {data.length} records</p>
      </div>
      <div className="overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">#</th>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 text-left text-sm font-medium text-gray-500 ${col.className || ''}`}
                  style={{ width: col.width || 'auto' }}
                >
                  {col.label}
                </th>
              ))}
              {actionColumn && (
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  {actionColumn.label || "Actions"}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableRegular;
