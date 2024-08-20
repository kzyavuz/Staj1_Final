import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress,
	Alert,
} from '@mui/material';
import axiosInstance from '../../../axiosConfig';
import NotificationSnackbar from '../Global/NotificationSnackbar';

function UpdateWork() {
	const location = useLocation();
	const { workID } = location.state || {};
	const [workName, setWorkName] = useState('');
	const [workDescription, setWorkDescription] = useState('');
	const [workPrice, setWorkPrice] = useState('');
	const [workLocal, setWorkLocal] = useState('');
	const [employeeID, setEmployeeID] = useState(null);
	const [employees, setEmployees] = useState([]);
	const [district, setDistrict] = useState('');
	const [city, setCity] = useState('');
	const [status, setStatus] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const style = {
		button: {
			width: '100px',
			height: '50px',
			display: 'flex',
			float: 'right',
			margin: '0px 10px 0px 10px',
		},
	};
	useEffect(() => {
		const fetchWorkDetails = async () => {
			try {
				const response = await axiosInstance.post('work/WorkDetails', {
					workID,
				});
				const work = response.data;
				console.log('içerik: ', work);
				setWorkName(work.workName);
				setWorkDescription(work.workDescription);
				setWorkPrice(work.workPrice);
				setWorkLocal(work.workLocal);
				setEmployeeID(work.employeeID);
				setDistrict(work.district);
				setCity(work.city);
				setStatus(work.status);
			} catch (err) {
				setErrors({ general: 'Detaylar alınırken bir hata oluştu.' });
				console.error('Error fetching work details:', err);
			} finally {
				setLoading(false);
			}
		};

		const fetchEmployees = async () => {
			try {
				const response = await axiosInstance.post('employee/EmployeeActiveList');
				setEmployees(response.data);
			} catch (err) {
				setErrors({ general: 'Çalışan listesi alınamadı' });
				console.error('Error fetching employees:', err);
			}
		};

		fetchWorkDetails();
		fetchEmployees();
	}, [workID]);

	const validateForm = () => {
		const newErrors = {};

		if (!workName) newErrors.workName = 'İş Adı boş bırakılamaz.';
		if (workName.length < 3) newErrors.workName = 'İş Adı en az 3 karakterden oluşturulmalı.';
		if (workName.length > 50) newErrors.workName = 'İş Adı en fazla 50 karakterden oluşturulmalı.';
		if (!workDescription) newErrors.workDescription = 'İş Açıklaması boş bırakılamaz.';
		if (workDescription.length < 50) newErrors.workDescription = 'İş Açıklaması en az 50 karekterden oluşmalıdır.';
		if (!workPrice) newErrors.workPrice = 'İş Fiyatı boş bırakılamaz.';
		if (!workLocal) newErrors.workLocal = 'Açık Adres boş bırakılamaz.';
		if (!city) newErrors.city = 'İl boş bırakılamaz.';
		if (!district) newErrors.district = 'İlçe boş bırakılamaz.';

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		// setLoading(true);
		setSnackbarMessage(null);
		setErrors({});

		const formData = new FormData();
		formData.append('workID', workID);
		formData.append('workName', workName);
		formData.append('workDescription', workDescription);
		formData.append('workPrice', workPrice);
		formData.append('workLocal', workLocal);
		if (employeeID !== null) formData.append('employeeID', employeeID);
		formData.append('district', district);
		formData.append('city', city);

		try {
			await axiosInstance.post('work/UpdateWork', formData);

			setSnackbarMessage('İş başarıyla güncellendi');
			setSnackbarSeverity('success');
		} catch (error) {
			if (error.response && error.response.data) {
				if (error.response.data.errors) {
					const newErrors = Object.values(error.response.data.errors).flat();
					setErrors({ general: newErrors.join('\n') });
				} else {
					setErrors({ general: error.response.data.message || 'İş bilgileri güncellenemedi' });
				}
			} else {
				setErrors({ general: 'Beklenmeyen bir hata oluştu.' });
			}

			setSnackbarMessage('İş güncellenirken hata oluştu');
			setSnackbarSeverity('error');
			console.error('Hata:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<CircularProgress />
			</div>
		);
	}

	return (
		<Card sx={{ maxWidth: 1200, mx: 'auto', p: 3, mt: 5 }}>
			<CardContent>
				<Typography variant="h5" component="div">
					İş Güncelleme Sayfası
				</Typography>
				{errors.general && <Alert severity="error">{errors.general}</Alert>}
				<form onSubmit={handleSubmit}>
					<TextField
						label="İş Adı"
						value={workName}
						onChange={(e) => setWorkName(e.target.value)}
						fullWidth
						margin="normal"
						error={!!errors.workName}
						helperText={errors.workName}
						disabled={!status}
					/>
					<TextField
						label="Açık Adres"
						value={workLocal}
						onChange={(e) => setWorkLocal(e.target.value)}
						fullWidth
						margin="normal"
						error={!!errors.workLocal}
						helperText={errors.workLocal}
						disabled={!status}
					/>
					<TextField
						label="İş Fiyatı"
						value={workPrice}
						onChange={(e) => setWorkPrice(e.target.value)}
						fullWidth
						margin="normal"
						error={!!errors.workPrice}
						helperText={errors.workPrice}
						disabled={!status}
					/>
					<TextField
						label="İl"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						fullWidth
						margin="normal"
						error={!!errors.city}
						helperText={errors.city}
						disabled={!status}
					/>
					<TextField
						label="İlçe"
						value={district}
						onChange={(e) => setDistrict(e.target.value)}
						fullWidth
						margin="normal"
						error={!!errors.district}
						helperText={errors.district}
						disabled={!status}
					/>
					<FormControl fullWidth margin="normal" error={!!errors.employeeID} disabled={!status}>
						<InputLabel>Personel Seçiniz</InputLabel>
						<Select
							label="Personel Seçiniz"
							value={employeeID}
							onChange={(e) => setEmployeeID(e.target.value)}
							disabled={!status}
						>
							<MenuItem value={null}>Personeli Kaldır</MenuItem>
							{employees.map((employee) => (
								<MenuItem key={employee.employeeID} value={employee.employeeID}>
									{employee.employeeName} {employee.employeeSurName}
								</MenuItem>
							))}
						</Select>
						{errors.employeeID && <Typography color="error">{errors.employeeID}</Typography>}
					</FormControl>

					<TextField
						label="İş Açıklaması"
						value={workDescription}
						onChange={(e) => setWorkDescription(e.target.value)}
						fullWidth
						rows={5}
						multiline
						margin="normal"
						error={!!errors.workDescription}
						helperText={errors.workDescription}
						disabled={!status}
					/>
					<Button variant="contained" color="primary" type="submit" style={style.button} disabled={!status}>
						Güncelle
					</Button>

					<Button
						variant="contained"
						color="error"
						type="button"
						onClick={() => navigate(-1)}
						style={style.button}
					>
						İptal
					</Button>
				</form>
			</CardContent>
			<NotificationSnackbar message={snackbarMessage} severity={snackbarSeverity} />
		</Card>
	);
}

export default UpdateWork;
