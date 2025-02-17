import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-polylinedecorator';
import PropTypes from 'prop-types';

const MeshConnections = ({ 
	markers, 
	meshConnections, 
	map, 
	lineOptions = {},
	showArrows = false 
}) => {
	const decoratorRefs = useRef([]);
	const polylineRefs = useRef([]);
	const [connections, setConnections] = useState([]);

	// Cleanup function to remove all lines and decorators
	const cleanupLines = () => {
		decoratorRefs.current.forEach(decorator => {
			if (decorator) {
				decorator.remove();
			}
		});
		decoratorRefs.current = [];

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
		
		const meshNodes = markers.filter(m => m.type === 2);

		if (meshNodes.length >= 2 && meshConnections) {
			const meshMap = new Map();
			meshNodes.forEach(node => {
				const meshProp = node.prop?.find(p => p.key === 'mesh');
				if (meshProp?.val) {
					meshMap.set(meshProp.val, node);
				}
			});

			const lines = [];
			meshConnections.forEach(([from, to]) => {
				const node1 = meshMap.get(from);
				const node2 = meshMap.get(to);

				if (node1 && node2) {
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

	// Draw lines and decorators
	useEffect(() => {
		if (!map || !connections.length) return;

		cleanupLines();

		const defaultOptions = {
			color: '#dc2626',
			weight: 2,
			dashArray: '5, 10',
			opacity: 0.7
		};

		const finalOptions = { ...defaultOptions, ...lineOptions };

		connections.forEach(line => {
			// Create and add polyline
			const polyline = L.polyline(line.positions, finalOptions).addTo(map);
			polylineRefs.current.push(polyline);

			// Create and add arrow decorator if enabled
			if (showArrows) {
				try {
					const arrowHead = L.polylineDecorator(polyline, {
						patterns: [
							{
								offset: '33%',
								repeat: 0,
								symbol: L.Symbol.arrowHead({
									pixelSize: 20,
									polygon: true,
									pathOptions: {
										stroke: true,
										color: finalOptions.color,
										opacity: 1,
										fill: true,
										fillColor: finalOptions.color,
										fillOpacity: 1,
										weight: 2
									}
								})
							},
							{
								offset: '66%',
								repeat: 0,
								symbol: L.Symbol.arrowHead({
									pixelSize: 20,
									polygon: true,
									pathOptions: {
										stroke: true,
										color: finalOptions.color,
										opacity: 1,
										fill: true,
										fillColor: finalOptions.color,
										fillOpacity: 1,
										weight: 2
									}
								})
							}
						]
					}).addTo(map);

					decoratorRefs.current.push(arrowHead);
					console.log('Arrow decorator added:', arrowHead);
				} catch (error) {
					console.error('Error adding arrow decorator:', error);
				}
			}
		});

		return () => {
			cleanupLines();
		};
	}, [connections, map, lineOptions, showArrows]);

	return null;
};

MeshConnections.propTypes = {
	markers: PropTypes.arrayOf(PropTypes.object).isRequired,
	meshConnections: PropTypes.arrayOf(PropTypes.array).isRequired,
	map: PropTypes.object.isRequired,
	lineOptions: PropTypes.object,
	showArrows: PropTypes.bool
};

export default React.memo(MeshConnections);
