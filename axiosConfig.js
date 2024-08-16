import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://localhost:44352/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const updatedConfig = { ...config };

		const token = localStorage.getItem('token');
		if (token) {
			updatedConfig.headers.Authorization = `Bearer ${token}`;
		}

		return updatedConfig;
	},
	(error) => Promise.reject(error),
);

export default axiosInstance;
