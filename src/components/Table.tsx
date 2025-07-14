import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { DataItem } from '../utils/types'; // Adjusted import path

// Styled Components Definitions
const TableContainer = styled.div`
	padding: 1rem;
	background-color: #f9fafb; /* bg-gray-50 */
	border-radius: 0.5rem; /* rounded-lg */
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
`;

const SearchInput = styled.input`
	width: 100%;
	padding: 0.5rem;
	margin-bottom: 1rem;
	border: 1px solid #d1d5db; /* border-gray-300 */
	border-radius: 0.375rem; /* rounded-md */
	&:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 */
	}
`;

const StyledTableWrapper = styled.div`
	overflow-x: auto;
	border-radius: 0.5rem; /* rounded-lg */
	border: 1px solid #e5e7eb; /* border border-gray-200 */
`;

const StyledTable = styled.table`
	min-width: 100%;
	border-collapse: collapse; /* Ensure borders collapse properly */
	border-spacing: 0;
	background-color: #ffffff; /* bg-white */
`;

const TableHead = styled.thead`
	background-color: #f3f4f6; /* bg-gray-100 */
`;

const TableHeader = styled.th`
	padding: 0.75rem 1.5rem; /* px-6 py-3 */
	text-align: left;
	font-size: 0.75rem; /* text-xs */
	font-weight: 500; /* font-medium */
	color: #6b7280; /* text-gray-500 */
	text-transform: uppercase;
	letter-spacing: 0.05em; /* tracking-wider */
	cursor: pointer;
	user-select: none; /* select-none */
	white-space: nowrap; /* Prevent wrapping */

	&:hover {
		background-color: #e5e7eb; /* Slightly darker on hover */
	}

	&.checkbox-header {
		width: 1%; /* Small width for checkbox column */
		padding-right: 0.5rem;
		cursor: default;
		&:hover {
			background-color: #f3f4f6; /* No hover effect for checkbox header */
		}
	}
`;

const SortIndicator = styled.span`
	margin-left: 0.5rem; /* ml-2 */
`;

const TableBody = styled.tbody`
	background-color: #ffffff; /* bg-white */
	border-top: 1px solid #e5e7eb; /* divide-y divide-gray-200 */
`;

const TableRow = styled.tr`
	&:hover {
		background-color: #f9fafb; /* hover:bg-gray-50 */
	}
`;

const TableCell = styled.td`
	padding: 1rem 1.5rem; /* px-6 py-4 */
	white-space: nowrap;
	font-size: 0.875rem; /* text-sm */
	color: #1f2937; /* text-gray-900 */

	&.checkbox-cell {
		padding-right: 0.5rem;
	}
`;

const NoDataCell = styled.td`
	padding: 1rem 1.5rem;
	text-align: center;
	color: #6b7280; /* text-gray-500 */
`;

// Define a interface para as propriedades do componente Table
interface TableProps {
	data: DataItem[]; // A propriedade 'data' deve ser um array de DataItem
	onSelectionChange: (selectedItems: DataItem[]) => void; // Callback para itens selecionados
}

const Table = ({ data, onSelectionChange }: TableProps) => {
	// State for the search term
	const [searchTerm, setSearchTerm] = useState('');
	// State for sorting: column ID and direction ('asc' or 'desc')
	const [sortColumn, setSortColumn] = useState<keyof DataItem | null>(null); // Use keyof DataItem for type safety
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	// State for selected row IDs
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

	// Memoize filtered and sorted data to optimize performance
	const filteredAndSortedData = useMemo(() => {
		let currentData = [...data]; // Create a mutable copy of the data

		// 1. Filter data based on search term
		if (searchTerm) {
			const lowercasedSearchTerm = searchTerm.toLowerCase();
			currentData = currentData.filter((item) =>
				Object.values(item).some((value) =>
					String(value).toLowerCase().includes(lowercasedSearchTerm)
				)
			);
		}

		// 2. Sort data based on sortColumn and sortDirection
		if (sortColumn) {
			currentData.sort((a, b) => {
				const aValue = a[sortColumn];
				const bValue = b[sortColumn];

				// Handle different data types for sorting
				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortDirection === 'asc'
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue);
				} else if (typeof aValue === 'number' && typeof bValue === 'number') {
					return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
				}
				// Fallback for other types or mixed types (e.g., convert to string)
				return sortDirection === 'asc'
					? String(aValue).localeCompare(String(bValue))
					: String(bValue).localeCompare(String(aValue));
			});
		}

		return currentData;
	}, [data, searchTerm, sortColumn, sortDirection]); // Re-run when these dependencies change

	// Check if all visible rows are selected
	const areAllRowsSelected = useMemo(() => {
		if (filteredAndSortedData.length === 0) return false;
		return filteredAndSortedData.every((item) => selectedRowIds.has(item.id));
	}, [filteredAndSortedData, selectedRowIds]);

	// Effect to call onSelectionChange whenever selectedRowIds or data changes
	useEffect(() => {
		const selectedItems = data.filter((item) => selectedRowIds.has(item.id));
		onSelectionChange(selectedItems);
	}, [selectedRowIds, data, onSelectionChange]);

	// Handle changes in the search input
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	// Handle column header clicks for sorting
	const handleSort = (columnId: keyof DataItem) => {
		// If clicking the same column, toggle direction; otherwise, set new column to 'asc'
		if (sortColumn === columnId) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortColumn(columnId);
			setSortDirection('asc');
		}
	};

	// Handle individual row checkbox change
	const handleRowSelect = (id: string, isChecked: boolean) => {
		setSelectedRowIds((prev) => {
			const newSet = new Set(prev);
			if (isChecked) {
				newSet.add(id);
			} else {
				newSet.delete(id);
			}
			return newSet;
		});
	};

	// Handle "select all" checkbox change
	const handleSelectAll = (isChecked: boolean) => {
		if (isChecked) {
			// Select all currently filtered and sorted items
			const allIds = new Set(filteredAndSortedData.map((item) => item.id));
			setSelectedRowIds(allIds);
		} else {
			// Deselect all
			setSelectedRowIds(new Set());
		}
	};

	// Define table headers based on the structure of your data
	// Assuming all items have the same keys. We'll use the first item's keys.
	const headers =
		data.length > 0 ? (Object.keys(data[0]) as Array<keyof DataItem>) : [];

	return (
		<TableContainer>
			{/* Search Bar */}
			<SearchInput
				type="text"
				placeholder="Search..."
				value={searchTerm}
				onChange={handleSearchChange}
			/>

			{/* Table */}
			<StyledTableWrapper>
				<StyledTable>
					<TableHead>
						<tr>
							<TableHeader
								as="th"
								className="checkbox-header"
							>
								<input
									type="checkbox"
									onChange={(e) => handleSelectAll(e.target.checked)}
									checked={areAllRowsSelected}
									// Indeterminate state if some but not all are selected
									ref={(input) => {
										if (input) {
											input.indeterminate =
												selectedRowIds.size > 0 && !areAllRowsSelected;
										}
									}}
								/>
							</TableHeader>
							{headers.map((header) => (
								<TableHeader
									key={header}
									onClick={() => handleSort(header)}
								>
									{/* Capitalize first letter for display */}
									{header.charAt(0).toUpperCase() + header.slice(1)}
									{/* Sort indicator */}
									{sortColumn === header && (
										<SortIndicator>
											{sortDirection === 'asc' ? '▲' : '▼'}
										</SortIndicator>
									)}
								</TableHeader>
							))}
						</tr>
					</TableHead>
					<TableBody>
						{filteredAndSortedData.map((item) => (
							<TableRow key={item.id}>
								<TableCell className="checkbox-cell">
									<input
										type="checkbox"
										checked={selectedRowIds.has(item.id)}
										onChange={(e) => handleRowSelect(item.id, e.target.checked)}
									/>
								</TableCell>
								{headers.map((header) => (
									<TableCell key={`${item.id}-${header}`}>
										{item[header]}
									</TableCell>
								))}
							</TableRow>
						))}
						{filteredAndSortedData.length === 0 && (
							<tr>
								<NoDataCell colSpan={headers.length + 1}>
									{' '}
									{/* +1 for the checkbox column */}
									No data found.
								</NoDataCell>
							</tr>
						)}
					</TableBody>
				</StyledTable>
			</StyledTableWrapper>
		</TableContainer>
	);
};

export default Table;
