import styled from 'styled-components';

// Styled Components Definitions
export const TableContainer = styled.div`
	padding: 1rem;
	background-color: #f9fafb; /* bg-gray-50 */
	border-radius: 0.5rem; /* rounded-lg */
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
`;

export const SearchInput = styled.input`
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

export const StyledTableWrapper = styled.div`
	overflow-x: auto;
	border-radius: 0.5rem; /* rounded-lg */
	border: 1px solid #e5e7eb; /* border border-gray-200 */
`;

export const StyledTable = styled.table`
	min-width: 100%;
	border-collapse: collapse; /* Ensure borders collapse properly */
	border-spacing: 0;
	background-color: #ffffff; /* bg-white */
`;

export const TableHead = styled.thead`
	background-color: #f3f4f6; /* bg-gray-100 */
`;

export const TableHeader = styled.th`
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

export const SortIndicator = styled.span`
	margin-left: 0.5rem; /* ml-2 */
`;

export const TableBody = styled.tbody`
	background-color: #ffffff; /* bg-white */
	border-top: 1px solid #e5e7eb; /* divide-y divide-gray-200 */
`;

export const TableRow = styled.tr`
	&:hover {
		background-color: #f9fafb; /* hover:bg-gray-50 */
	}
`;

export const TableCell = styled.td`
	padding: 1rem 1.5rem; /* px-6 py-4 */
	white-space: nowrap;
	font-size: 0.875rem; /* text-sm */
	color: #1f2937; /* text-gray-900 */

	&.checkbox-cell {
		padding-right: 0.5rem;
	}
`;

export const NoDataCell = styled.td`
	padding: 1rem 1.5rem;
	text-align: center;
	color: #6b7280; /* text-gray-500 */
`;
