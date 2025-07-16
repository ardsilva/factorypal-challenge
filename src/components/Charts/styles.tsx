import styled from 'styled-components';
// Styled Components for Charts
export const ChartsContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;
	padding: 1rem;
	background-color: #ffffff;
	border-radius: 0.5rem;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

export const ChartSection = styled.div`
	width: 100%;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	background-color: #f9fafb;
`;

export const SectionTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: 600;
	color: #1f2937;
	margin-bottom: 1rem;
	text-align: center;
`;

export const NoDataMessage = styled.p`
	text-align: center;
	color: #6b7280;
	font-size: 1.1rem;
	padding: 2rem;
`;

// Colors for Pie Chart segments
export const PIE_COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#A28DFF',
	'#FF6B6B',
];
