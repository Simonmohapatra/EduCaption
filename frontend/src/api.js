const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function getTestData() {
    try {
        const response = await fetch(`${BASE_URL}/api/test`); // replace with your backend route
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API fetch error:', error);
        return { error: 'Failed to fetch data' };
    }
}
