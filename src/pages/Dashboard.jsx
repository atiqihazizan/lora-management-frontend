import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tableHome, actionHorizontal } from "../utils/constants";
import { useNavigate } from "react-router";
import TableUI from "../components/elements/TableUI";
import apiClient from "../utils/apiClient";
import Loading from "../components/Loading";
import FormDialog from "../components/dashboard/FormDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", latlng: "", zoom: 17, bounding: "" });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);

  const { data: tableData, isLoading, isError, error } = useQuery({
    queryKey: ["mapview"],
    queryFn: () => apiClient.get("/mapview"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const method = editMode ? "put" : "post";
      const url = editMode ? `/mapview/${data.id}` : "/mapview";
      return apiClient[method](url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mapview"]);
      // queryClient.removeQueries(["mapview"]);
      setIsDialogOpen(false);
    },
  });

  const openDialog = (row = null) => {
    setEditMode(!!row);
    setFormData(row || { name: "", latlng: "", zoom: 17, bounding: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  // Fungsi untuk menambahkan data baru
  const addNew = () => {
    setEditMode(false);
    setFormData({ name: "", latlng: "", zoom: 17, bounding: "" });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const newErrors = {
      name: formData.name.trim() ? "" : "Name is required.",
      latlng: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(formData.latlng.trim()) ? "" : "Invalid latlng format.",
      zoom: !isNaN(formData.zoom) && formData.zoom > 0 ? "" : "Zoom must be a positive number.",
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
    <>
      <TableUI
        title="Map View"
        data={tableData || []}
        loading={isLoading}
        error={isError ? "Failed to load data." : null}
        columns={tableHome}
        rowStyle={(row) => ({ backgroundColor: row.id % 2 === 0 ? "#f9f9f9" : "#fff" })}
        actionColumn={actionHorizontal(navigate, openDialog)}
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

export default Dashboard;
