import { useMemo } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';

import { DataItem, formatValue } from '../../utils/types'; // Adjusted import path
import {
	ChartsContainer,
	NoDataMessage,
	ChartSection,
	SectionTitle,
} from './styles';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		const item = payload[0].payload; // Get the original data item
		// Handle specific formatting for shift pie chart data
		if (item.originalType) {
			// Check if it's our specially formatted shift data
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

// Colors for Pie Chart segments
const PIE_COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#A28DFF',
	'#FF6B6B',
];

interface ChartsProps {
	data: DataItem[];
	selectedData?: DataItem[]; // Optional prop for selected data from the table
}

const Charts = ({ data, selectedData }: ChartsProps) => {
	// Determine which data set to use: selectedData if available and not empty, otherwise all data
	const dataToDisplay =
		selectedData && selectedData.length > 0 ? selectedData : data;

	// Group data by category for different charts
	const categorizedData = useMemo(() => {
		const categories: { [key: string]: DataItem[] } = {};
		dataToDisplay.forEach((item) => {
			if (!categories[item.category]) {
				categories[item.category] = [];
			}
			categories[item.category].push(item);
		});
		return categories;
	}, [dataToDisplay]);

	// Prepare data for the 'shift' category pie chart
	const shiftPieChartData = useMemo(() => {
		const shiftItems = categorizedData['shift'];
		if (!shiftItems || shiftItems.length === 0) return [];

		const cleaningInSecs =
			shiftItems.find((item) => item.id === 'cln_shift')?.value || 0;
		const shiftDurationHours =
			shiftItems.find((item) => item.id === 'shift_duration')?.value || 0;

		const cleaningInHours = cleaningInSecs / 3600; // Convert seconds to hours

		// Ensure shiftDurationHours is positive and cleaningInHours doesn't exceed it
		const actualShiftDuration = Math.max(0, shiftDurationHours);
		const actualCleaningInHours = Math.min(
			cleaningInHours,
			actualShiftDuration
		);

		const nonCleaningTimeInHours = actualShiftDuration - actualCleaningInHours;

		const pieData = [];
		if (actualCleaningInHours > 0) {
			pieData.push({
				label: 'Cleaning Time',
				value: actualCleaningInHours,
				originalType: 'hours', // Custom property to help tooltip formatting
			});
		}
		if (nonCleaningTimeInHours > 0) {
			pieData.push({
				label: 'Non-Cleaning Time',
				value: nonCleaningTimeInHours,
				originalType: 'hours', // Custom property to help tooltip formatting
			});
		}

		// If total shift duration is 0 or no meaningful data, return empty
		if (actualShiftDuration === 0 && pieData.length === 0) return [];

		return pieData;
	}, [categorizedData]);

	if (dataToDisplay.length === 0) {
		return (
			<ChartsContainer>
				<NoDataMessage>
					{selectedData && selectedData.length === 0
						? 'No items selected in the table to display charts.'
						: 'No data available to display charts.'}
				</NoDataMessage>
			</ChartsContainer>
		);
	}

	return (
		<ChartsContainer>
			{Object.keys(categorizedData).map((category) => (
				<ChartSection key={category}>
					<SectionTitle>
						{category.charAt(0).toUpperCase() + category.slice(1)} Data
					</SectionTitle>
					{/* Bar Chart for 'efficiency' and 'downtime' categories */}
					{(category === 'efficiency' || category === 'downtime') && (
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<BarChart
								data={categorizedData[category]}
								margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="label" />
								<YAxis
									// Format Y-axis ticks based on the type of the first item in the category
									tickFormatter={(value) =>
										formatValue(
											value,
											categorizedData[category][0]?.type || 'number'
										)
									}
								/>
								<Tooltip content={<CustomTooltip />} />
								<Legend />
								<Bar
									dataKey="value"
									fill="#8884d8"
									name="Value"
								/>
							</BarChart>
						</ResponsiveContainer>
					)}

					{/* Pie Chart for 'downtime' to show proportions */}
					{category === 'downtime' && (
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<PieChart>
								<Pie
									data={categorizedData[category]}
									dataKey="value"
									nameKey="label"
									cx="50%"
									cy="50%"
									outerRadius={100}
									fill="#8884d8"
									label={({ label, percent }) =>
										`${label} (${(percent * 100).toFixed(0)}%)`
									}
								>
									{categorizedData[category].map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={PIE_COLORS[index % PIE_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					)}

					{/* Pie Chart for 'shift' category (Cleaning vs Non-Cleaning Time) */}
					{category === 'shift' && shiftPieChartData.length > 0 && (
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<PieChart>
								<Pie
									data={shiftPieChartData}
									dataKey="value"
									nameKey="label"
									cx="50%"
									cy="50%"
									outerRadius={100}
									fill="#8884d8"
									label={({ label, percent }) =>
										`${label} (${(percent * 100).toFixed(0)}%)`
									}
								>
									{shiftPieChartData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={PIE_COLORS[index % PIE_COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					)}
					{category === 'shift' && shiftPieChartData.length === 0 && (
						<NoDataMessage>No sufficient data for Shift chart.</NoDataMessage>
					)}
				</ChartSection>
			))}
		</ChartsContainer>
	);
};

export default Charts;
