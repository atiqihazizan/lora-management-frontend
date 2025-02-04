export const formatLatLong = (latlong) =>
  (Array.isArray(latlong) ? latlong.join(",") : latlong)
    .split(",")
    .map((num) => parseFloat(num).toFixed(6))
    .join(",");
    
export const formatLatLonToArray = (latlong) =>
  (Array.isArray(latlong) ? latlong.join(",") : latlong)
    .split(",")
    .map((num) => parseFloat(num).toFixed(6))
    .map((num) => parseFloat(num));

export const latlngToArray = (latlong) => {
  if (typeof latlong === "string") {
    return latlong.split(",").map((num) => parseFloat(num).toFixed(6));
  }
  return latlong;
};

export const latlngToString = (latlong) => {
  if (Array.isArray(latlong)) {
    return latlong.map((num) => parseFloat(num).toFixed(6)).join(",");
  }
  return latlong;
};

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
