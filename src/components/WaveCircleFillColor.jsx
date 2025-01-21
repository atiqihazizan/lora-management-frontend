import { useEffect } from "react";
import L from "leaflet";

const WaveCircle = ({ map, center, radius }) => {
  useEffect(() => {
    if (!radius || !map) return;

    const circleGroup = L.layerGroup().addTo(map); // Group to manage animation
    const animateCircles = () => {
      const circle = L.circle(center, {
        radius: 0,
        color: "transparent",
        fillColor: "red",
        fillOpacity: 1
      }).addTo(circleGroup);

      // Animate radius expansion
      let currentRadius = 0;
      const animation = setInterval(() => {
        if (currentRadius > radius) {
          clearInterval(animation);
          circleGroup.removeLayer(circle); // Remove circle after animation ends
          animateCircles();
        } else {
          currentRadius += (radius / 80); // 10
          // currentRadius += (radius / 50); // 10
          circle.setRadius(currentRadius);
          // circle.setStyle({
          //   opacity: 1 - currentRadius / (radius / 1.5),
          // });
          // Kira fillOpacity semakin kecil berdasarkan radius
          const newOpacity = 1 - currentRadius / radius; // Semakin jauh radius, semakin pudar
          circle.setStyle({
            fillOpacity: Math.max(newOpacity, 0) // Pastikan nilai opacity tidak negatif
          });
        }
      }, 50); // Adjust animation speed (50ms)
      // }, 50); // Adjust animation speed (50ms)

      return animation;
    };

    // fixed circle
    L.circle(center, {
      radius: radius,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.0,
    }).addTo(circleGroup);

    animateCircles();

    // // Start animation loop
    // const interval = setInterval(() => {
    //   animateCircles();
    // }, 60 * 1000); // Create new circle every second
    // // }, 900); // Create new circle every second

    return () => {
      // clearInterval(interval);
      map.removeLayer(circleGroup); // Clean up on unmount
    };
  }, [map, center, radius]);
}

export default WaveCircle;