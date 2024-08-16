import { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import { Card, CardHeader } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyWorkInfo() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [works, setWorks] = useState([]);

	useEffect(() => {
		const fetchWorks = async () => {
			try {
				const response = await axiosInstance.post('account/GetUserWorkProfile');
				setWorks(response.data);
				setLoading(false);
			} catch (err) {
				setError('Çalışanın iş bilgileri alınamadı');
				console.error('Çalışan İş Hata:', err);
			} finally {
				setLoading(false);
			}
		};
		fetchWorks();
	}, []);

	if (loading) {
		return <div>Yükleniyor...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<Card component="section" className="mt-5">
			<CardHeader title="İş Listesi" subheader="İş Listem" />
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>İş Adı</TableCell>
							<TableCell>Açıklama</TableCell>
							<TableCell>Başlangıç Tarihi</TableCell>
							<TableCell>Bitiş Tarihi</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{works.map((work) => (
							<TableRow key={work.workID}>
								<TableCell>{work.workName}</TableCell>
								<TableCell>{work.workDescription}</TableCell>
								<TableCell>{work.workPrice}</TableCell>
								<TableCell>
									{work.createDateTime
										? new Date(work.createDateTime).toLocaleString('tr-TR', {
												dateStyle: 'short',
												timeStyle: 'short',
											})
										: ''}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	);
}

export default MyWorkInfo;
