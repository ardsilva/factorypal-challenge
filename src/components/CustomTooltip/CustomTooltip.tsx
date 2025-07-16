import { formatValue } from '@/utils/types';

interface CustomTooltipProps {
	active?: boolean;
	payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		const item = payload[0].payload;

		if (item.originalType) {
			return (
				<div
					style={{
						backgroundColor: '#fff',
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '5px',
						boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
					}}
				>
					<p className="label">{`${item.label}`}</p>
					<p
						className="intro"
						style={{ color: payload[0].color }}
					>
						{`Value: ${formatValue(item.value, item.originalType)}`}
					</p>
				</div>
			);
		}
		return (
			<div
				style={{
					backgroundColor: '#fff',
					padding: '10px',
					border: '1px solid #ccc',
					borderRadius: '5px',
					boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
				}}
			>
				<p className="label">{`${item.label}`}</p>
				<p
					className="intro"
					style={{ color: payload[0].color }}
				>
					{`Value: ${formatValue(item.value, item.type)}`}
				</p>
				<p className="desc">{item.description}</p>
			</div>
		);
	}
	return null;
};

export default CustomTooltip;
