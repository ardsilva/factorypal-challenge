import { useState, useMemo, useEffect } from 'react';
import { DataItem } from '@/utils/types';
import {
	TableContainer,
	SearchInput,
	StyledTableWrapper,
	StyledTable,
	TableHead,
	TableHeader,
	SortIndicator,
	TableBody,
	TableRow,
	TableCell,
	NoDataCell,
} from './styles';

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
