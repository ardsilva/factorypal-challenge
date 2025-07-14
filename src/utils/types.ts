type DataItemType = 'number' | 'percentage' | 'secs' | 'hours';

export interface DataItem {
	id: string;
	label: string;
	value: number;
	type: DataItemType;
	description: string;
	category: string;
}

/**
 * Formats a numeric value based on its specified type.
 * @param value The numeric value to format.
 * @param type The type of the value (e.g., 'percentage', 'secs', 'hours').
 * @returns A formatted string with appropriate units or symbols.
 */
export const formatValue = (value: number, type: DataItem['type']): string => {
	switch (type) {
		case 'percentage':
			// Assuming value is already a decimal (e.g., 0.68 for 68%)
			return `${(value * 100).toFixed(2)}%`;
		case 'secs':
			return `${value} seconds`;
		case 'hours':
			return `${value} hours`;
		case 'number':
		default:
			return value.toFixed(2); // Default to two decimal places for generic numbers
	}
};
