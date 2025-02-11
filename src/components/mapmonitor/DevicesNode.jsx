import React, { useEffect, useState, useMemo } from "react";
import { useMapGuestContext } from "../../utils/useContexts";
import { useMap } from "react-leaflet";
import MeshConnections from "../MeshConnections";
import { useMqtt } from "../../utils/useContexts";
import { matchTopic } from "../../utils/components";

// Function to generate connections based on marker order
const generateOrderedConnections = (markers) => {
	if (!markers || markers.length === 0) return [];

	// Filter mesh nodes (type 2) and sort by mesh value
	const meshNodes = markers
		.filter(m => m.type === 2)
		.map(node => ({
			...node,
			meshValue: node.prop?.find(p => p.key === 'mesh')?.val || ''
		}))
		.sort((a, b) => a.meshValue.localeCompare(b.meshValue));

	if (meshNodes.length < 2) return [];

	// Create connections following marker order
	const connections = [];
	for (let i = 0; i < meshNodes.length - 1; i++) {
		connections.push([
			meshNodes[i].meshValue,
			meshNodes[i + 1].meshValue
		]);
	}

	// Close the loop by connecting back to first node
	connections.push([
		meshNodes[meshNodes.length - 1].meshValue,
		meshNodes[0].meshValue
	]);

	return connections;
};

// Function to generate MQTT connections
const generateMqttConnections = (markers, mqttData) => {
	if (!markers || markers.length === 0 || !mqttData) return [];

	try {
		// Get mesh nodes map for quick lookup
		const meshNodesMap = markers
			.filter(m => m.type === 2)
			.reduce((acc, node) => {
				const meshValue = node.prop?.find(p => p.key === 'mesh')?.val;
				if (meshValue) acc[meshValue] = node;
				return acc;
			}, {});

		// Find random_mesh topic data
		const randomMeshData = Object.entries(mqttData)
			.find(([topic]) => matchTopic(topic, 'random_mesh'));
			
			if (!randomMeshData) return [];
			
			const [_, data] = randomMeshData;

			return data.length < 2 ?  [] : data;
	} catch (error) {
		console.error('Error processing MQTT data:', error);
		return [];
	}
};

const DevicesNode = () => {
	const [meshConnections, setMeshConnections] = useState([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const { mapSelect, markers } = useMapGuestContext();
	const { mqttData } = useMqtt();
	const map = useMap();

	// Get available nodes
	const availableNodes = useMemo(() => 
		markers?.filter(m => m.mapid === mapSelect?.id) || [],
		[markers, mapSelect]
	);

	// Process MQTT connections with useMemo to prevent unnecessary recalculations
	const mqttConnections = useMemo(() => 
		generateMqttConnections(availableNodes, mqttData),
		[availableNodes, mqttData]
	);

	// Initialize with ordered connections
	useEffect(() => {
		if (mapSelect && availableNodes?.length >= 2 && !isInitialized) {
			const orderedConnections = generateOrderedConnections(availableNodes);
			setMeshConnections(orderedConnections);
			setIsInitialized(true);
		}
	}, [mapSelect, availableNodes, isInitialized]);

	// Update connections when MQTT data changes
	useEffect(() => {
		if (isInitialized && mqttConnections.length > 0) {
			setMeshConnections(mqttConnections);
		}
	}, [mqttConnections, isInitialized]);

	if (!mapSelect || availableNodes?.length === 0) return <></>;

	return (
		<>
			<MeshConnections
				markers={markers}
				meshConnections={meshConnections}
				map={map}
				lineOptions={{
					color: '#dc2626',
					weight: 5,
					dashArray: '5, 10',
					opacity: 0.7
				}}
			/>
		</>
	);
};

export default React.memo(DevicesNode);