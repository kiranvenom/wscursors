import React, { useState, useEffect, useRef } from 'react';
import CustomCursor from './components/CustomCursor';

const App = () => {
	const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const [otherCursors, setOtherCursors] = useState([]);
	const ws = useRef(null);

	useEffect(() => {
		// Initialize WebSocket connection
		ws.current = new WebSocket('ws://localhost:8080');

		// Listen for cursor data from other users
		ws.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setOtherCursors((prevCursors) => {
				// Update existing user or add new user cursor
				const updatedCursors = prevCursors.filter(
					(c) => c.id !== data.id,
				);
				return [...updatedCursors, data];
			});
		};

		// Clean up WebSocket connection on component unmount
		return () => ws.current.close();
	}, []);

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const position = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			id: 'user1', // Assign a unique ID to each user (can be generated dynamically)
			color: 'blue', // Assign a color to each user (could also be dynamic)
		};
		setCursorPos({ x: position.x, y: position.y });

		// Send cursor position to the server
		if (ws.current.readyState === WebSocket.OPEN) {
			ws.current.send(JSON.stringify(position));
		}
	};

	return (
		<div className='center wh'>
			<div
				className='w-[400px] h-[500px] bg-slate-200 cursor-none relative overflow-hidden'
				onMouseMove={handleMouseMove}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}>
				{/* Render the current user's cursor */}
				{isHovering && (
					<CustomCursor
						posX={cursorPos.x}
						posY={cursorPos.y}
						color='blue'
						label='You'
					/>
				)}

				{/* Render other users' cursors */}
				{otherCursors.map((cursor) => (
					<CustomCursor
						key={cursor.id}
						posX={cursor.x}
						posY={cursor.y}
						color={cursor.color}
						label={cursor.id}
					/>
				))}
			</div>
		</div>
	);
};

export default App;
