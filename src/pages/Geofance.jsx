import React from 'react';
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import apiClient from "../utils/apiClient";
import Loading from "../components/Loading";
import FormDialog from "../components/geofance/FormDialog";
import { FaCog, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useStateContext } from "../utils/useContexts";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table';

const Geofance = () => {
  const navigate = useNavigate();
  const { userInfo } = useStateContext();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", latlng: "", zoom: 17 });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [sorting, setSorting] = useState([]);

  const { data: tableData, isLoading, isError, error } = useQuery({
    queryKey: ["maps"],
    queryFn: () => apiClient.get("/maps"),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, name, latlng, zoom }) => {
      const newdata = { id, name, latlng, zoom, userid: userInfo.user_id };
      const method = editMode ? "put" : "post";
      const url = editMode ? `/maps/${id}` : "/maps";
      return apiClient[method](url, newdata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["maps"]);
      setIsDialogOpen(false);
    },
  });

  const columns = React.useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'name',
        size: 250,
        headerClassName: 'font-bold text-blue-600',
      },
      {
        header: 'Location',
        accessorKey: 'latlng',
        size: 200,
        headerClassName: 'font-bold text-green-600',
        cell: ({ row }) => (
          <span className="text-gray-600">
            {row.original.latlng}
          </span>
        )
      },
      {
        header: 'Zoom',
        accessorKey: 'zoom',
        size: 80,
        headerClassName: 'font-bold text-purple-600',
        cell: ({ row }) => (
          <span className="text-gray-600">
            {row.original.zoom}x
          </span>
        )
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 50,
        minSize: 50,
        maxSize: 50,
        headerClassName: 'font-bold text-gray-600 text-right pr-8',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1 pr-6">
            <button
              className="btn-icon-secondary p-1 hover:bg-gray-100"
              onClick={() => navigate(`/builder/${row.original.id}`)}
              title="Open in Builder">
              <FaCog size={14} />
            </button>
            <button
              className="btn-icon-primary p-1 hover:bg-blue-100"
              onClick={() => openDialog(row.original)}
              title="Edit">
              <FaPencilAlt size={14} />
            </button>
            <button
              className="btn-icon-danger p-1 hover:bg-red-100"
              onClick={() => handleDelete(row.original.id)}
              title="Delete">
              <FaTrash size={14} />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: tableData || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const openDialog = (row = null) => {
    setEditMode(!!row);
    setFormData(row || { name: "", latlng: "", zoom: 17 });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this boundary?')) {
      try {
        await apiClient.delete(`/maps/${id}`);
        queryClient.invalidateQueries(["maps"]);
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete boundary');
      }
    }
  };

  const handleSave = async () => {
    const newErrors = {
      name: formData.name.trim() ? "" : "Name is required.",
      latlng: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(formData.latlng.replaceAll(" ", "").trim()) 
        ? "" 
        : "Invalid latlng format.",
      zoom: !isNaN(formData.zoom) && formData.zoom > 0 
        ? "" 
        : "Zoom must be a positive number.",
    };
  
    setErrors(newErrors);
  
    if (Object.values(newErrors).some((err) => err)) return true;
  
    const formattedLatlng = formData.latlng
      .split(",")
      .map((num) => parseFloat(num).toFixed(6))
      .join(",");
  
    await saveMutation.mutateAsync({ ...formData, latlng: formattedLatlng });
    return false;
  };

  if (isLoading) return <Loading text="Please wait, loading data..." />
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Map View</h2>
        <button
          onClick={() => openDialog()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add New Boundary
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        width: header.column.getSize(),
                        maxWidth: header.column.getSize()
                      }}
                      className={`
                        px-6 py-3 border-b border-gray-200 bg-gray-50 
                        text-left text-xs font-medium text-gray-500 
                        uppercase tracking-wider
                        ${header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100' : ''}
                        ${header.column.columnDef.headerClassName || ''}
                      `}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}</span>
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted()] ?? ' ⇅'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize()
                      }}
                      className="px-6 py-4 whitespace-nowrap border-b border-gray-200"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormDialog
        open={isDialogOpen}
        title={editMode ? "Edit Boundary" : "Add New Boundary"}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </div>
  );
};

export default Geofance;
