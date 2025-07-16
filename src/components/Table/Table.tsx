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

interface TableProps {
	data: DataItem[];
	onSelectionChange: (selectedItems: DataItem[]) => void;
}

const Table = ({ data, onSelectionChange }: TableProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortColumn, setSortColumn] = useState<keyof DataItem | null>(null); // Use keyof DataItem for type safety
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

	const filteredAndSortedData = useMemo(() => {
		let currentData = [...data];

		if (searchTerm) {
			const lowercasedSearchTerm = searchTerm.toLowerCase();
			currentData = currentData.filter((item) =>
				Object.values(item).some((value) =>
					String(value).toLowerCase().includes(lowercasedSearchTerm)
				)
			);
		}

		if (sortColumn) {
			currentData.sort((a, b) => {
				const aValue = a[sortColumn];
				const bValue = b[sortColumn];

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortDirection === 'asc'
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue);
				} else if (typeof aValue === 'number' && typeof bValue === 'number') {
					return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
				}

				return sortDirection === 'asc'
					? String(aValue).localeCompare(String(bValue))
					: String(bValue).localeCompare(String(aValue));
			});
		}

		return currentData;
	}, [data, searchTerm, sortColumn, sortDirection]);

	const areAllRowsSelected = useMemo(() => {
		if (filteredAndSortedData.length === 0) return false;
		return filteredAndSortedData.every((item) => selectedRowIds.has(item.id));
	}, [filteredAndSortedData, selectedRowIds]);

	useEffect(() => {
		const selectedItems = data.filter((item) => selectedRowIds.has(item.id));
		onSelectionChange(selectedItems);
	}, [selectedRowIds, data, onSelectionChange]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleSort = (columnId: keyof DataItem) => {
		if (sortColumn === columnId) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortColumn(columnId);
			setSortDirection('asc');
		}
	};

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

	const handleSelectAll = (isChecked: boolean) => {
		if (isChecked) {
			const allIds = new Set(filteredAndSortedData.map((item) => item.id));
			setSelectedRowIds(allIds);
		} else {
			setSelectedRowIds(new Set());
		}
	};

	const headers =
		data.length > 0 ? (Object.keys(data[0]) as Array<keyof DataItem>) : [];

	return (
		<TableContainer>
			<SearchInput
				type="text"
				placeholder="Search..."
				value={searchTerm}
				onChange={handleSearchChange}
			/>

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
									{header.charAt(0).toUpperCase() + header.slice(1)}
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
