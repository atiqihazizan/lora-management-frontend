import { renderToString } from "react-dom/server";
import { ICONS } from "../utils/icons";
import L from "leaflet";

const IconMarker = ({ id, name, latlng, prop = [], icon }) => {
  const props = Array.isArray(prop)
    ? prop.map((p) => `<tr><td><b>${p.label}</b></td><td>:</td><td class="whitespace-nowrap">${p.val} ${p?.unit}</td></tr>`).join("")
    : "";

  // const wave = radius > 0 ? `<div class="wave-effect" style="width: ${100 * 13}; height: ${100 * 13};"></div>` : "";

  return new L.DivIcon({
    className: "custom-marker",
    html: `
      <div id="marker-${id}" style="position: relative;">
        <div class="tooltip-body text-[9px]">
          <h4 class="text-nowrap text-[10px]"><b>${name ? name.toUpperCase() : ""}</b></h4>
          <table cellspacing="12">
            <tr><td colspan="3" class="pt-1 pb-2"><b>[${latlng ? latlng.toString() : ""}]</b></td></tr>
            ${props}
          </table>
        </div>
        <div class="text-[25px]">
          ${icon && ICONS[icon] ? renderToString(ICONS[icon]) : ""}
        </div>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [13, 23],
    popupAnchor: [0, -20],
  });
};

export default IconMarker;
