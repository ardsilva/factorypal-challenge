import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

vi.mock('@/mocks/data.json', () => ({
	data: [
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
	],
}));

describe('App', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('shows loading state, then renders Table and Charts', async () => {
		render(<App />);
		expect(screen.getByTestId('loading-state')).toBeInTheDocument();
		act(() => {
			vi.runAllTimers();
		});

		expect(screen.getByText('Data Table')).toBeInTheDocument();
		expect(screen.getByText('Data Charts')).toBeInTheDocument();
		expect(screen.getByText('OEE')).toBeInTheDocument();
		expect(screen.getByText('Stop 1')).toBeInTheDocument();
	});

	it('when rows selected in Table, Charts updates with selection', async () => {
		render(<App />);
		act(() => {
			vi.runAllTimers();
		});

		const checkboxes = screen.getAllByRole('checkbox');
		fireEvent.click(checkboxes[1]);

		expect(screen.getByText('Efficiency Data')).toBeInTheDocument();
		expect(screen.getByText('OEE')).toBeInTheDocument();
	});
});
