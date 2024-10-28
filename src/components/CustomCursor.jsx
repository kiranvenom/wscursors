import React from 'react';

const CustomCursor = ({ posX, posY, color, label }) => {
	return (
		<div
			style={{
				position: 'absolute',
				top: posY,
				left: posX,
				width: '20px',
				height: '20px',
				backgroundColor: color,
				borderRadius: '50%',
				transform: 'translate(-50%, -50%)',
				pointerEvents: 'none',
			}}>
			<span
				style={{
					position: 'absolute',
					top: '-1.5em',
					color,
					fontSize: '12px',
					fontWeight: 'bold',
				}}>
				{label}
			</span>
		</div>
	);
};

export default CustomCursor;
