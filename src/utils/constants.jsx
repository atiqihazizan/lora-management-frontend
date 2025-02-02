import { FaMapMarked, FaPencilAlt, FaTrash } from "react-icons/fa";

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
