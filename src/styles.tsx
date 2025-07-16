import styled from 'styled-components'; // Import styled-components for App.jsx styling

// Styled Components for App.jsx
export const AppContainer = styled.div`
	min-height: 100vh;
	background-color: #f3f4f6; /* bg-gray-100 */
	padding: 1rem;
	font-family: 'Inter', sans-serif; /* Using Inter font */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
`;

export const ContentWrapper = styled.div`
	max-width: 96rem; /* max-w-4xl (increased to 96rem for charts) */
	margin: 0 auto; /* mx-auto */
	background-color: #ffffff; /* bg-white */
	padding: 1.5rem; /* p-6 */
	border-radius: 0.5rem; /* rounded-lg */
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
`;

export const Title = styled.h1`
	font-size: 2.25rem; /* text-3xl */
	font-weight: 700; /* font-bold */
	color: #1f2937; /* text-gray-800 */
	margin-bottom: 1rem;
	text-align: center;
`;

export const Description = styled.p`
	color: #4b5563; /* text-gray-600 */
	margin-bottom: 1.5rem;
	text-align: center;
`;

export const LoadingState = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 12rem; /* h-48 */
`;

export const LoadingText = styled.p`
	font-size: 1.125rem; /* text-lg */
	color: #4b5563; /* text-gray-600 */
`;

export const SectionSeparator = styled.hr`
	margin: 2rem 0;
	border: none;
	border-top: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h2`
	font-size: 1.75rem; /* text-2xl */
	font-weight: 600; /* font-semibold */
	color: #1f2937; /* text-gray-800 */
	margin-bottom: 1.5rem;
	text-align: center;
`;
