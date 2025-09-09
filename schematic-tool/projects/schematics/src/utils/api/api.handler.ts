import axios from 'axios';

const environment = process.env.NODE_ENV || 'dev';

let API_HOST = '';

if (environment === 'dev') {
  API_HOST = 'http://localhost:3000';
} else if (environment === 'prod') {
  API_HOST = 'https://api.example.com';
}

export async function fetchCompoentTree(id: string) {
  console.log('Fetching component tree for ID:', id);
  const url = `${API_HOST}/api/component-tree/${id}`;
  try {
    const response = await axios.get(url);
    console.log('Response from fetchCompoentTree:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching component tree:', error);
    throw new Error('Failed to fetch component tree');
  }
}
