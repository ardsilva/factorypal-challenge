import { useEffect, useState, useCallback } from 'react';
import { data as apiData } from './mocks/data.json'; // Adjust the path as necessary
import Table from './components/Table'; // Adjusted import path
import Charts from './components/Charts'; // Adjusted import path
import styled from 'styled-components'; // Import styled-components for App.jsx styling
import { DataItem } from './utils/types'; // Adjusted import path

// Styled Components for App.jsx
const AppContainer = styled.div`
	min-height: 100vh;
	background-color: #f3f4f6; /* bg-gray-100 */
	padding: 1rem;
	font-family: 'Inter', sans-serif; /* Using Inter font */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
`;

const ContentWrapper = styled.div`
	max-width: 96rem; /* max-w-4xl (increased to 96rem for charts) */
	margin: 0 auto; /* mx-auto */
	background-color: #ffffff; /* bg-white */
	padding: 1.5rem; /* p-6 */
	border-radius: 0.5rem; /* rounded-lg */
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
`;

const Title = styled.h1`
	font-size: 2.25rem; /* text-3xl */
	font-weight: 700; /* font-bold */
	color: #1f2937; /* text-gray-800 */
	margin-bottom: 1rem;
	text-align: center;
`;

const Description = styled.p`
	color: #4b5563; /* text-gray-600 */
	margin-bottom: 1.5rem;
	text-align: center;
`;

const LoadingState = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 12rem; /* h-48 */
`;

const LoadingText = styled.p`
	font-size: 1.125rem; /* text-lg */
	color: #4b5563; /* text-gray-600 */
`;

const SectionSeparator = styled.hr`
	margin: 2rem 0;
	border: none;
	border-top: 1px solid #e5e7eb;
`;

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

	// Callback to receive selected items from the Table component
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
						{/* Table Section */}
						<SectionTitle>Data Table</SectionTitle>
						<Table
							data={data}
							onSelectionChange={handleTableSelectionChange}
						/>

						<SectionSeparator />

						{/* Charts Section */}
						<SectionTitle>Data Charts</SectionTitle>
						{/* Pass the selectedTableItems to the Charts component */}
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

const SectionTitle = styled.h2`
	font-size: 1.75rem; /* text-2xl */
	font-weight: 600; /* font-semibold */
	color: #1f2937; /* text-gray-800 */
	margin-bottom: 1.5rem;
	text-align: center;
`;

export default App;
