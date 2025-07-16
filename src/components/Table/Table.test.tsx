import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Table from './Table';

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
];

it('renders table headers and rows', () => {
	const fn = vi.fn();
	render(
		<Table
			data={mockData}
			onSelectionChange={fn}
		/>
	);
	expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
	expect(screen.getByText('Id')).toBeInTheDocument();
	expect(screen.getByText('OEE')).toBeInTheDocument();
	expect(screen.getByText('Stop 1')).toBeInTheDocument();
});

it('filters data with search', () => {
	const fn = vi.fn();
	render(
		<Table
			data={mockData}
			onSelectionChange={fn}
		/>
	);
	fireEvent.change(screen.getByPlaceholderText(/search/i), {
		target: { value: 'OEE' },
	});
	expect(screen.getByText('OEE')).toBeInTheDocument();
	expect(screen.queryByText('Stop 1')).not.toBeInTheDocument();
});

it('shows no data when filter does not match', () => {
	const fn = vi.fn();
	render(
		<Table
			data={mockData}
			onSelectionChange={fn}
		/>
	);
	fireEvent.change(screen.getByPlaceholderText(/search/i), {
		target: { value: 'XYZ' },
	});
	expect(screen.getByText('No data found.')).toBeInTheDocument();
});

it('calls onSelectionChange when selecting rows', () => {
	const fn = vi.fn();
	render(
		<Table
			data={mockData}
			onSelectionChange={fn}
		/>
	);
	const firstCheckbox = screen.getAllByRole('checkbox')[1];
	fireEvent.click(firstCheckbox);
	expect(fn).toHaveBeenCalledWith([mockData[0]]);
	const selectAll = screen.getAllByRole('checkbox')[0];
	fireEvent.click(selectAll);
	expect(fn).toHaveBeenCalled();
});

it('sorts columns when header is clicked', () => {
	const fn = vi.fn();
	render(
		<Table
			data={mockData}
			onSelectionChange={fn}
		/>
	);
	const labelHeader = screen.getByText('Label');
	fireEvent.click(labelHeader);
	fireEvent.click(labelHeader);
	expect(labelHeader.querySelector('svg,span')).toBeTruthy();
});
