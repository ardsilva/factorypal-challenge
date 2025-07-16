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

import { DataItem, formatValue } from '@/utils/types';
import {
	ChartsContainer,
	NoDataMessage,
	ChartSection,
	SectionTitle,
	PIE_COLORS,
} from './styles';
import CustomTooltip from '../CustomTooltip/CustomTooltip';

interface ChartsProps {
	data: DataItem[];
	selectedData?: DataItem[];
}

const Charts = ({ data, selectedData }: ChartsProps) => {
	const dataToDisplay =
		selectedData && selectedData.length > 0 ? selectedData : data;

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

	const shiftPieChartData = useMemo(() => {
		const shiftItems = categorizedData['shift'];
		if (!shiftItems || shiftItems.length === 0) return [];

		const cleaningInSecs =
			shiftItems.find((item) => item.id === 'cln_shift')?.value || 0;
		const shiftDurationHours =
			shiftItems.find((item) => item.id === 'shift_duration')?.value || 0;

		const cleaningInHours = cleaningInSecs / 3600;

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
				originalType: 'hours',
			});
		}
		if (nonCleaningTimeInHours > 0) {
			pieData.push({
				label: 'Non-Cleaning Time',
				value: nonCleaningTimeInHours,
				originalType: 'hours',
			});
		}

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
										`${label} (${(percent! * 100).toFixed(0)}%)`
									}
								>
									{categorizedData[category].map((_, index) => (
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
										`${label} (${(percent! * 100).toFixed(0)}%)`
									}
								>
									{shiftPieChartData.map((_, index) => (
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
