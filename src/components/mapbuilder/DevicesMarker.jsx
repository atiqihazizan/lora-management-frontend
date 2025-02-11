import React, { useEffect, useState } from "react";
import NodeMarker from "./NodeMarker";
import { useMapContext } from "../../utils/useContexts";
import { useMap } from "react-leaflet";
import MeshConnections from "../MeshConnections";

// Available mesh nodes
const MESH_NODES = ['A', 'B', 'C', 'E', 'F', 'G'];

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

		console.log(meshNodes);

	if (meshNodes.length < 2) return [];

	// Create connections following marker order
	const connections = [];
	for (let i = 0; i < meshNodes.length - 1; i++) {
		connections.push([
			meshNodes[i].meshValue,
			meshNodes[i + 1].meshValue
		]);
		console.log(meshNodes[i].meshValue, meshNodes[i + 1].meshValue);
	}

	// Close the loop by connecting back to first node
	connections.push([
		meshNodes[meshNodes.length - 1].meshValue,
		meshNodes[0].meshValue
	]);

	return connections;
};

// Function to generate random mesh connections
const generateRandomConnections = () => {
	const availableNodes = [...MESH_NODES];
	const connections = [];
	let currentNode = 'A'; // Always start with A

	// Remove A from available nodes as it's our starting point
	availableNodes.splice(availableNodes.indexOf('A'), 1);

	// Generate random connections until we have used all nodes
	while (availableNodes.length > 0) {
		// Get random next node
		const randomIndex = Math.floor(Math.random() * availableNodes.length);
		const nextNode = availableNodes[randomIndex];

		// Add connection
		connections.push([currentNode, nextNode]);

		// Update current node and remove used node from available nodes
		currentNode = nextNode;
		availableNodes.splice(randomIndex, 1);
	}

	// Close the loop by connecting back to A
	connections.push([currentNode, 'A']);

	return connections;
};

const DevicesMarker = () => {
	const { markers } = useMapContext();
	const [nodes, setNodes] = useState([]);
	const [meshConnections, setMeshConnections] = useState([]);
	const map = useMap();

	// Effect to update mesh connections every 10 seconds
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		setMeshConnections(generateRandomConnections());
	// 	}, 10000);

	// 	return () => clearInterval(interval);
	// }, []);

	// Log current mesh connections whenever they change
	useEffect(() => {
		console.log('Current mesh connections:', JSON.stringify(meshConnections));
	}, [meshConnections]);

	// Update nodes when markers change
	useEffect(() => {

		if (markers.length >= 2) {
			const orderedConnections = generateOrderedConnections(markers);
			setMeshConnections(orderedConnections);
		}

		setNodes(markers);
	}, [markers]);

	return (
		<>
			{/* Render mesh connections */}
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

			{/* Render markers */}
			{nodes?.map((node, idx) => (
				<NodeMarker key={idx} marker={node} accept="marker" />
			))}
		</>
	);
};

export default React.memo(DevicesMarker);