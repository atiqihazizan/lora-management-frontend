import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { MdOutlineSave } from "react-icons/md";
import { renderToString } from "react-dom/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMapContext } from "../../utils/useContexts";
import L from "leaflet";
import PropTypes from 'prop-types';
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";
import apiClient from "../../utils/apiClient";
// import geojsonValidation from "geojson-validation";

const BoundariesMap = ({ mapview }) => {
  const queryClient = useQueryClient();
  const map = useMap();
  const { geoJsonData, setGeoJsonData } = useMapContext();
  const featureGroupRef = useRef(L.featureGroup());
  const saveControlRef = useRef(null);

  const saveGeoJson = useMutation({
    mutationFn: (data) => {
      return apiClient.put(`/mapview/${mapview.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mapview"]);
    },
  });

  useEffect(() => {
    featureGroupRef.current.clearLayers();

    L.geoJSON(geoJsonData).addTo(featureGroupRef.current);

    if (!map.hasLayer(featureGroupRef.current)) {
      featureGroupRef.current.addTo(map);
    }

    map.pm.addControls({
      position: "topleft",
      drawCircle: false,
      drawMarker: false,
    });

    const saveControl = L.Control.extend({
      onAdd: function () {
        const button = L.DomUtil.create("button", "leaflet-bar");
        button.innerHTML = renderToString(<MdOutlineSave className="w-5 h-5" />);
        button.style.cursor = "pointer";
        button.classList = "bg-white p-[.35rem] border border-gray-500 rounded shadow-md";

        button.onclick = () => {
          console.log(geoJsonData);
          // saveGeoJson.mutateAsync({ bounding: JSON.stringify(geoJsonData) });
        };

        return button;
      },
    });

    if (!saveControlRef.current) {
      saveControlRef.current = new saveControl({ position: "topleft" });
      map.addControl(saveControlRef.current);
    }

    map.on("pm:create", (e) => {
      const layer = e.layer;
      featureGroupRef.current.addLayer(layer);
      const newFeature = layer.toGeoJSON();
      setGeoJsonData((prev) => ({
        type: "FeatureCollection",
        features: [...prev.features, newFeature],
      }));
    });

    map.on("pm:edit", (e) => {
      const updatedFeatures = [];
      e.layers.eachLayer((layer) => {
        updatedFeatures.push(layer.toGeoJSON());
      });
      setGeoJsonData({
        type: "FeatureCollection",
        features: updatedFeatures,
      });
    });

    map.on("pm:remove", (e) => {
      const layerGeoJson = e.layer.toGeoJSON();
      setGeoJsonData((prev) => ({
        type: "FeatureCollection",
        features: prev.features.filter(
          (feature) =>
            JSON.stringify(feature.geometry.coordinates) !==
            JSON.stringify(layerGeoJson.geometry.coordinates)
        ),
      }));
    });

    return () => {
      map.pm.removeControls();
      map.off("pm:create");
      map.off("pm:edit");
      map.off("pm:remove");

      if (saveControlRef.current) {
        map.removeControl(saveControlRef.current);
        saveControlRef.current = null;
      }
    };
  }, [geoJsonData, map]);

  return null;
};

BoundariesMap.propTypes = {
  mapview: PropTypes.object
}

export default BoundariesMap;
