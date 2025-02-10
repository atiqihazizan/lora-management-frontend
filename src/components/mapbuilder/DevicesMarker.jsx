import React, { useEffect, useState, useRef } from "react";
import NodeMarker from "./NodeMarker";
import { useMapContext } from "../../utils/useContexts";
import { useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet-polylinedecorator';

const DevicesMarker = () => {
	const { markers } = useMapContext();
	const [nodes, setNodes] = useState([]);
	const [meshes, setMeshes] = useState([]);
	const [connections, setConnections] = useState([]);
	const map = useMap();
	const decoratorRefs = useRef([]);
	const polylineRefs = useRef([]);

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

	useEffect(() => {
		// Cleanup old lines first
		cleanupLines();

		if(markers.length === 0) return;
		
		// Filter mesh nodes (type 2)
		const meshNodes = markers.filter(m => m.type === 2);

		if (meshNodes.length >= 2) {
			// Sort nodes by mesh ID
			const sortedNodes = [...meshNodes].sort((a, b) => {
				const meshA = a.prop?.find(p => p.key === 'mesh')?.val || '';
				const meshB = b.prop?.find(p => p.key === 'mesh')?.val || '';
				return meshA.localeCompare(meshB);
			});

			// Create connections between consecutive nodes
			const lines = [];
			for (let i = 0; i < sortedNodes.length; i++) {
				const node1 = sortedNodes[i];
				const node2 = sortedNodes[(i + 1) % sortedNodes.length]; // Use modulo to loop back to first node
				
				// Ensure latlng is in array format
				const pos1 = Array.isArray(node1.latlng) ? node1.latlng : node1.latlng.split(',').map(Number);
				const pos2 = Array.isArray(node2.latlng) ? node2.latlng : node2.latlng.split(',').map(Number);
				
				lines.push({
					id: `${node1.id}-${node2.id}`,
					positions: [pos1, pos2],
					mesh1: node1.prop?.find(p => p.key === 'mesh')?.val,
					mesh2: node2.prop?.find(p => p.key === 'mesh')?.val
				});
			}

			setConnections(lines);
		}

		setNodes(markers);
	}, [markers]);

	// Add arrow decorators when connections change
	useEffect(() => {
		// Cleanup old lines first
		cleanupLines();

		// Add new decorators
		connections.forEach(line => {
			const polyline = L.polyline(line.positions, {
				color: '#dc2626',
				weight: 2,
				dashArray: '5, 10',
				opacity: 0.7
			}).addTo(map);

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
								color: '#dc2626',
								fillOpacity: 0.7,
								weight: 2
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
								color: '#dc2626',
								fillOpacity: 0.7,
								weight: 2
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
	}, [connections, map]);

	return (
		<>
			{/* Render markers */}
			{nodes?.map((node, idx) => (
				<NodeMarker key={idx} marker={node} accept="marker" />
			))}
		</>
	);
};

export default React.memo(DevicesMarker);