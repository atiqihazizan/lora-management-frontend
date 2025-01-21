import { FaMapMarked, FaPencilAlt, FaTrash } from "react-icons/fa";

export const tableHome = [
  { key: "name", label: "Title", font: "Verdana" },
  { key: "latlng", label: "Center" },
  { key: "zoom", label: "Zoom Map", font: "Verdana" },
];

export const actionHorizontal = (navi, openDialog) => ({
  label: "Actions",
  layout: "horizontal",
  width: "50px",
  className: "text-center",
  actions: [
    {
      type: "icon",
      icon: <FaMapMarked />,
      tooltip: "View Map",
      onClick: (row) => navi(`/builder/${row.id}`),
      className: "btn-icon-primary",
    },
    {
      type: "icon",
      icon: <FaPencilAlt />,
      tooltip: "Edit",
      onClick: openDialog,
      className: "btn-icon-secondary",
    },
    {
      type: "icon",
      icon: <FaTrash />,
      tooltip: "Delete",
      onClick: (row) => alert(`Deleted: ${row.id}`),
      className: "btn-icon-danger",
    },
  ],
});

export const formatLatLong = (latlong) =>
  (Array.isArray(latlong) ? latlong.join(",") : latlong)
    .split(",")
    .map((num) => parseFloat(num).toFixed(6))
    .join(",");

export const isObjectNotEmpty = (obj) => !!obj && !!Object.keys(obj).length;

export const matchTopic = (received, subscribed) => {
  const regex = new RegExp(
    `^${subscribed.replace(/\+/g, "[^/]+").replace(/#/g, ".*")}$`
  );
  return regex.test(received);
};

export const matchTopicsGroup = (received, subscribed) =>
  received.filter((topic) =>
    new RegExp(
      `^${subscribed.replace(/\+/g, "[^/]+").replace(/#/g, ".*")}$`
    ).test(topic)
  );
