import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-polylinedecorator';

const MeshConnections = ({ markers, meshConnections, map, lineOptions = {} }) => {
	const decoratorRefs = useRef([]);
	const polylineRefs = useRef([]);
	const [connections, setConnections] = useState([]);

	// Cleanup function to remove all lines and decorators
	const cleanupLines = () => {
		// Clear decorators
		decoratorRefs.current.forEach(decorator => {
			if (decorator) {
				decorator.remove();
			}
		});
		decoratorRefs.current = [];

		// Clear polylines
		polylineRefs.current.forEach(polyline => {
			if (polyline) {
				polyline.remove();
			}
		});
		polylineRefs.current = [];
	};

	// Process markers and create connections
	useEffect(() => {
		if (!markers || markers.length === 0) return;
		
		// Filter mesh nodes (type 2)
		const meshNodes = markers.filter(m => m.type === 2);

		if (meshNodes.length >= 2 && meshConnections) {
			// Create a map of mesh values to nodes
			const meshMap = new Map();
			meshNodes.forEach(node => {
				const meshProp = node.prop?.find(p => p.key === 'mesh');
				if (meshProp?.val) {
					meshMap.set(meshProp.val, node);
				}
			});

			// Create connections based on meshConnections array
			const lines = [];
			meshConnections.forEach(([from, to]) => {
				const node1 = meshMap.get(from);
				const node2 = meshMap.get(to);

				if (node1 && node2) {
					// Ensure latlng is in array format
					const pos1 = Array.isArray(node1.latlng) ? node1.latlng : node1.latlng.split(',').map(Number);
					const pos2 = Array.isArray(node2.latlng) ? node2.latlng : node2.latlng.split(',').map(Number);
					
					lines.push({
						id: `${node1.id}-${node2.id}`,
						positions: [pos1, pos2],
						mesh1: from,
						mesh2: to
					});
				}
			});

			setConnections(lines);
		}
	}, [markers, meshConnections]);

	// Add arrow decorators when connections change
	useEffect(() => {
		// Cleanup old lines first
		cleanupLines();

		// Default line options
		const defaultOptions = {
			color: '#dc2626',
			weight: 2,
			dashArray: '5, 10',
			opacity: 0.7
		};

		// Merge default options with provided options
		const finalOptions = { ...defaultOptions, ...lineOptions };

		// Add new decorators
		connections.forEach(line => {
			const polyline = L.polyline(line.positions, finalOptions).addTo(map);

			polylineRefs.current.push(polyline);

			const decorator = L.polylineDecorator(polyline, {
				patterns: [
					{
						offset: '33%',
						repeat: 0,
						symbol: L.Symbol.arrowHead({
							pixelSize: 15,
							polygon: false,
							pathOptions: {
								color: finalOptions.color,
								fillOpacity: finalOptions.opacity,
								weight: finalOptions.weight
							}
						})
					},
					{
						offset: '66%',
						repeat: 0,
						symbol: L.Symbol.arrowHead({
							pixelSize: 15,
							polygon: false,
							pathOptions: {
								color: finalOptions.color,
								fillOpacity: finalOptions.opacity,
								weight: finalOptions.weight
							}
						})
					}
				]
			}).addTo(map);

			decoratorRefs.current.push(decorator);
		});

		// Cleanup on unmount
		return () => {
			cleanupLines();
		};
	}, [connections, map, lineOptions]);

	return null; // This component doesn't render anything
};

export default React.memo(MeshConnections);
