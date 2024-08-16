import { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';
import {
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationSnackbar from '../Global/NotificationSnackbar';

function AddWork() {
	const [formData, setFormData] = useState({
		workName: '',
		workDescription: '',
		workPrice: '',
		district: '',
		city: '',
		workLocal: '',
		employeeID: '',
	});
	const [employees, setEmployees] = useState([]);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const style = {
		button: {
			width: '100px',
			height: '50px',
			margin: '10px',
			display: 'flex',
			float: 'right',
		},
	};

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				const response = await axiosInstance.post('employee/EmployeeActiveList');
				setEmployees(response.data);
			} catch (err) {
				setErrors({ general: 'Çalışan listesi alınamadı' });
				console.error('Error fetching employees:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchEmployees();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setLoading(true);
		setSnackbarMessage(null);
		setErrors({});

		const formattedFormData = {
			...formData,
			workPrice: parseFloat(formData.workPrice) || 0,
			employeeID: formData.employeeID === '' ? null : formData.employeeID,
		};
		try {
			await axiosInstance.post('work/CreateWork', formattedFormData);

			setSnackbarMessage('İş ekleme başarılı');
			setSnackbarSeverity('success');
			setTimeout(() => {
				navigate('/work/Index');
			}, 1200);
		} catch (error) {
			if (error.response && error.response.data) {
				if (error.response.data.errors) {
					const newErrors = Object.values(error.response.data.errors).flat();
					setErrors({ general: newErrors.join('\n') });
				} else {
					setErrors({ general: error.response.data.message || 'İş bilgileri eklenemedi' });
				}
			} else {
				setErrors({ general: 'Beklenmeyen bir hata oluştu.' });
			}
			setSnackbarMessage('İş eklenirken hata oluştu');
			setSnackbarSeverity('error');
			console.error('Hata:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Yükleniyor...</div>;
	}

	return (
		<Card sx={{ maxWidth: 1200, mx: 'auto', p: 3, mt: 5 }}>
			<CardContent>
				<Typography variant="h5" component="div" gutterBottom>
					Yeni İş Ekleme Ekranı
				</Typography>
				{errors.general && (
					<div style={{ color: 'red', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{errors.general}</div>
				)}
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{[
							{ label: 'İş Adı', name: 'workName' },
							{ label: 'Ücret', name: 'workPrice', type: 'number' },
							{ label: 'İlçe', name: 'district' },
							{ label: 'İl', name: 'city' },
							{ label: 'İş Lokasyonu', name: 'workLocal' },
						].map(({ label, name, type = 'text' }, index) => (
							<Grid item xs={12} sm={6} key={index}>
								<TextField
									label={label}
									name={name}
									type={type}
									value={formData[name]}
									onChange={handleChange}
									fullWidth
									margin="normal"
									error={!!errors[name]}
									helperText={errors[name]}
								/>
							</Grid>
						))}
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="normal">
								<InputLabel>Personel Seçiniz</InputLabel>
								<Select
									label="Personel Seçinizvv"
									name="employeeID"
									value={formData.employeeID}
									onChange={handleChange}
								>
									<MenuItem value="">Personel Seçiniz</MenuItem>
									{employees.map((employee) => (
										<MenuItem key={employee.employeeID} value={employee.employeeID}>
											{employee.employeeName} {employee.employeeSurName}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								label="Iş Acıklaması"
								name="workDescription"
								value={formData.workDescription}
								onChange={handleChange}
								fullWidth
								rows={5}
								margin="normal"
								multiline
								error={!!errors[formData.workDescription]}
								helperText={errors[formData.workDescription]}
							/>
						</Grid>
					</Grid>

					<Button type="submit" variant="contained" color="primary" style={style.button}>
						{loading ? 'Yükleniyor...' : 'Ekle'}
					</Button>
					<Button
						type="button"
						variant="contained"
						color="error"
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

export default AddWork;
