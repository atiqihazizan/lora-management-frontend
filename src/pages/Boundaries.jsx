import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import TableUI from "../components/elements/TableUI";
import apiClient from "../utils/apiClient";
import Loading from "../components/Loading";
import FormDialog from "../components/boundaries/FormDialog";
import { FaCog,  FaPencilAlt, FaTrash } from "react-icons/fa";
import { useStateContext } from "../utils/useContexts";

const Boundaries = () => {
  const { userInfo } = useStateContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", latlng: "", zoom: 17 });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);

  const { data: tableData, isLoading, isError, error } = useQuery({
    queryKey: ["boundaries"],
    queryFn: () => apiClient.get("/boundaries"),
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, name, latlng, zoom }) => {
      const newdata = { id, name, latlng, zoom , userid: userInfo.user_id };
      const method = editMode ? "put" : "post";
      const url = editMode ? `/boundaries/${id}` : "/boundaries";
      return apiClient[method](url, newdata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["boundaries"]);
      // queryClient.removeQueries(["mapview"]);
      setIsDialogOpen(false);
    },
  });

  const openDialog = (row = null) => {
    const { path = "", ...rest } = row || {};
    setEditMode(!!row);
    setFormData(rest || { name: "", latlng: "", zoom: 17 });
    setErrors({});
    setIsDialogOpen(true);
  };

  // Fungsi untuk menambahkan data baru
  const addNew = () => {
    setEditMode(false);
    setFormData({ name: "", latlng: "", zoom: 17 });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    
    // Validasi Nama, LatLng & Zoom
    const newErrors = {
      name: formData.name.trim() ? "" : "Name is required.",
      latlng: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(formData.latlng.replaceAll(" ", "").trim()) ? "" : "Invalid latlng format.",
      zoom: !isNaN(formData.zoom) && formData.zoom > 0 ? "" : "Zoom must be a positive number.",
    };
  
    // **Validasi Fail**
    if (formData.path) {
      const file = formData.path;
      const allowedTypes = ["application/json"];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      if (!allowedTypes.includes(file.type)) {
        newErrors.path = "Invalid file type. Only JSON is allowed.";
      } else if (file.size > maxSize) {
        newErrors.path = "File size must be less than 5MB.";
      } else {
        newErrors.path = "";
      }
    } else {
      newErrors.path = ""; // Boleh kosong jika tidak wajib
    }
  
    setErrors(newErrors);
  
    // Jika ada error, hentikan proses simpan
    if (Object.values(newErrors).some((err) => err)) return true;
  
    // Formatkan latlng sebelum simpan
    const formattedLatlng = formData.latlng
      .split(",")
      .map((num) => parseFloat(num).toFixed(6))
      .join(",");
  
    // Simpan data (ini boleh disesuaikan dengan API atau local state)
    await saveMutation.mutateAsync({ ...formData, latlng: formattedLatlng });
  
    return false;
  };

  if (isLoading) return <Loading text="Please wait, loading data..." />
  if (isError) return <div>Error: {error.message}</div>;

  const tableHome = [
    { key: "name", label: "Title", font: "Verdana" },
    {
      key: "action",
      label: "Action",
      className: "text-center !w-32 pr-0",
      render: (data, row) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              className="btn-icon-secondary"
              onClick={() => navigate(`/builder/${row.id}`)}>
              <FaCog />
            </button>
            <button
              className="btn-icon-primary"
              onClick={() => openDialog(row)}>
              <FaPencilAlt />
            </button>
            <button
              className="btn-icon-danger"
              onClick={() => alert(`Deleted: ${row.id}`)}>
              <FaTrash />
            </button>
          </div>
        );
      },
    },
  ];
  
  return (
    <>
      <TableUI
        title="Map View"
        data={tableData || []}
        loading={isLoading}
        error={isError ? "Failed to load data." : null}
        columns={tableHome}
        rowStyle={(row) => ({ backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "#fff" })}
        customButtons={[
          {
            label: "Add New",
            onClick: addNew,
            className: "button-primary",
            tooltip: "Add a new record",
          },
        ]}
      />
      <FormDialog
        isDialogOpen={isDialogOpen}
        editMode={editMode}
        closeDialog={() => setIsDialogOpen(false)}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </>
  );
};

export default Boundaries;
