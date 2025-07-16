import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Charts from './Charts';

const mockData = [
	{
		id: '1',
		category: 'efficiency',
		type: 'percent',
		label: 'OEE',
		value: 91.2,
		description: 'Overall Equipment Effectiveness',
	},
	{
		id: '2',
		category: 'downtime',
		type: 'minutes',
		label: 'Stop 1',
		value: 10,
		description: 'Minor stop',
	},
	{
		id: 'cln_shift',
		category: 'shift',
		type: 'seconds',
		label: 'Cleaning',
		value: 7200,
		description: 'Cleaning operation',
	},
	{
		id: 'shift_duration',
		category: 'shift',
		type: 'hours',
		label: 'Shift Duration',
		value: 8,
		description: 'Shift duration',
	},
];

it('renders no data message if data is empty', () => {
	render(<Charts data={[]} />);
	expect(
		screen.getByText(/No data available to display charts./i)
	).toBeInTheDocument();
});

it('renders chart sections for each category', () => {
	const fn = vi.fn();
	render(<Charts data={mockData} />);
	expect(screen.getByText(/Efficiency Data/i)).toBeInTheDocument();
	expect(screen.getByText(/Downtime Data/i)).toBeInTheDocument();
	expect(screen.getByText(/Shift Data/i)).toBeInTheDocument();
});

it('renders different message if selectedData is empty', () => {
	render(
		<Charts
			data={[]}
			selectedData={[]}
		/>
	);
	expect(
		screen.getByText(/No items selected in the table to display charts./i)
	).toBeInTheDocument();
});

it('renders shift pie chart data when shift info present', () => {
	render(<Charts data={mockData} />);
	expect(screen.getByText(/Shift Data/i)).toBeInTheDocument();
});
