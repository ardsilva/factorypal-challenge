import { useEffect, useState, useCallback } from 'react';
import { data as apiData } from '@/mocks/data.json';
import { DataItem } from '@/utils/types';
import Charts from '@/components/Charts/Charts';
import Table from '@/components/Table/Table';
import {
	AppContainer,
	ContentWrapper,
	Title,
	Description,
	LoadingState,
	LoadingText,
	SectionSeparator,
	SectionTitle,
} from './styles';

const App = () => {
	const [data, setData] = useState<DataItem[]>([]); // Initialize as an empty array for table data
	const [isLoading, setIsLoading] = useState(true);
	const [selectedTableItems, setSelectedTableItems] = useState<DataItem[]>([]); // New state for selected items from the table

	useEffect(() => {
		const getData = () => {
			setTimeout(() => {
				setData(
					apiData.map((item) => ({
						...item,
						type: item.type as DataItem['type'],
					}))
				);
				setIsLoading(false);
			}, 2000);
		};

		getData();
	}, []);

	const handleTableSelectionChange = useCallback((items: DataItem[]) => {
		setSelectedTableItems(items);
	}, []);

	return (
		<AppContainer data-testid="app-container">
			<ContentWrapper>
				<Title>Data Dashboard</Title>
				<Description>
					Explore and visualize your operational data with search, sorting, and
					interactive charts. Select rows in the table to update the charts
					dynamically.
				</Description>

				{isLoading ? (
					<LoadingState data-testid="loading-state">
						<LoadingText>Loading data...</LoadingText>
					</LoadingState>
				) : (
					<>
						<SectionTitle>Data Table</SectionTitle>
						<Table
							data={data}
							onSelectionChange={handleTableSelectionChange}
						/>

						<SectionSeparator />

						<SectionTitle>Data Charts</SectionTitle>
						<Charts
							data={data}
							selectedData={selectedTableItems}
						/>
					</>
				)}
			</ContentWrapper>
		</AppContainer>
	);
};

export default App;
