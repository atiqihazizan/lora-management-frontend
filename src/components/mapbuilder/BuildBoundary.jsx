import { useEffect, useMemo, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMapContext, useStateContext } from "../../utils/useContexts";
import L from "leaflet";
import PropTypes from 'prop-types';
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";
import apiClient from "../../utils/apiClient";
import { ToggleButton, SaveButton, DeviceButton } from "./MapControls";
import { ICONS } from "../../utils/icons";

const BuildBoundary = ({ id }) => {
  const queryClient = useQueryClient();
  const map = useMap();
  const { devices } = useStateContext();
  const { geoJsonData, setGeoJsonData } = useMapContext();
  const featureGroupRef = useRef(L.featureGroup());
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  const saveGeoJson = useMutation({
    mutationFn: (data) => {
      return apiClient.put(`/boundary/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mapview"]);
    },
  });

  const toggleControls = () => {
    setIsControlsVisible(!isControlsVisible);
    if (!isControlsVisible) {
      map.pm.addControls({
        position: "topleft",
        drawCircle: false,
        drawCircleMarker: false,
        drawMarker: false,
        drawText: false,
        drawRectangle: true,
        drawPolygon: true,
        drawPolyline: true,
      });
      
      // Get the control container and adjust its position
      setTimeout(() => {
        const pmControls = document.querySelector('.leaflet-pm-toolbar');
        if (pmControls) {
          // pmControls.style.marginTop = '80px';
        }
      }, 0);
    } else {
      map.pm.removeControls();
    }
  };

  useEffect(() => {
    featureGroupRef.current.clearLayers();

    L.geoJSON(geoJsonData).addTo(featureGroupRef.current);

    if (!map.hasLayer(featureGroupRef.current)) {
      featureGroupRef.current.addTo(map);
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
    };
  }, [map, geoJsonData, setGeoJsonData]);

  return (
    <>
      {
        !isControlsVisible && devices?.map((device, idx) => {
          const top = 5.5 + (2.5 * idx);
          return (
            <DeviceButton
              key={idx}
              name={device.name}
              className="left-[10px]"
              style={{ top: `${top}rem` }}
              icon={ICONS[device.icon]}
              data={device}
              label={device.name}
              // onClick={() => {}}
            />
          );
        })
      }
      {isControlsVisible && (
        <SaveButton
          onClick={() => saveGeoJson.mutateAsync({ bounding: JSON.stringify(geoJsonData) })}
          className="top-[22rem] left-[10px]"
        />
      )}
      <ToggleButton 
        onClick={toggleControls}
        className="bottom-[7.5rem] left-[10px]"
        isActive={isControlsVisible}
      />
    </>
  );
};

BuildBoundary.propTypes = {
  id: PropTypes.number
};

export default BuildBoundary;
