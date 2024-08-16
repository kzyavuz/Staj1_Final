import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Grid,
	InputLabel,
	Select,
	MenuItem,
	FormControl,
	FormHelperText,
} from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from '../../../axiosConfig';
import NotificationSnackbar from '../Global/NotificationSnackbar';

function AddEmployee() {
	const [formData, setFormData] = useState({
		employeeName: '',
		employeeSurName: '',
		userName: '',
		email: '',
		registrationNumber: '',
		birthday: null,
		phoneNumber: '',
		unit: '',
		class: '',
		task: '',
		password: '',
	});
	const [profilePicture, setProfilePicture] = useState(null);
	const [profileImage, setProfileImage] = useState(null);
	const [gender, setGender] = useState(null);
	const [loading, setLoading] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const style = {
		img: {
			width: '100px',
			height: '100px',
			objectFit: 'cover',
			borderRadius: '10%',
			marginBottom: '10px',
		},
		button: {
			width: '100px',
			height: '50px',
			margin: '10px',
			display: 'flex',
			float: 'right',
		},
	};

	const handleChange = (e) => {
		const { name, value, type, files } = e.target;
		if (type === 'file') {
			setProfilePicture(files[0]);
			const reader = new FileReader();
			reader.onloadend = () => setProfileImage(reader.result);
			if (files[0]) reader.readAsDataURL(files[0]);
		} else {
			setFormData((prevState) => ({ ...prevState, [name]: value }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setLoading(true);
		setErrors({});
		setSnackbarMessage(null);

		const formDataToSend = new FormData();
		Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
		if (profilePicture) {
			formDataToSend.append('profilePicture', profilePicture);
		}
		if (gender) {
			formDataToSend.append('gender', gender === 'erkek');
		}

		try {
			await axiosInstance.post('Account/Register', formDataToSend, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			setSnackbarMessage('Personel başarıyla eklendi');
			setSnackbarSeverity('success');
			setTimeout(() => {
				navigate('/employee/Index');
			}, 1200);
		} catch (error) {
			if (error.response && error.response.data) {
				if (error.response.data.errors) {
					const newErrors = Object.values(error.response.data.errors).flat();
					setErrors({ general: newErrors.join('\n') });
				} else {
					setErrors({ general: error.response.data.message || 'Çalışanın bilgileri eklenemedi' });
				}
			} else {
				setErrors({ general: 'Beklenmeyen bir hata oluştu.' });
			}
			setSnackbarMessage('Personel eklenirken hata oluştu');
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
					Yeni Personel Ekleme Ekranı
				</Typography>
				{errors.general && (
					<div style={{ color: 'red', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{errors.general}</div>
				)}
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						{[
							{ label: 'Personel Adı', name: 'employeeName' },
							{ label: 'Personel Soyadı', name: 'employeeSurName' },
							{ label: 'Kullanıcı Adı', name: 'userName' },
							{ label: 'Telefon Numarası', name: 'phoneNumber', type: 'number' },
							{ label: 'E Posta Adresi', name: 'email' },
							{ label: 'TC Kimlik Numarası', name: 'registrationNumber', type: 'number' },
							{ label: 'Birim', name: 'unit' },
							{ label: 'Sınıf', name: 'class' },
							{ label: 'Görev', name: 'task' },
							{ label: 'Şifre', name: 'password', type: 'password' },
							{ label: 'Doğum Günü', name: 'birthday', type: 'date' },
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
							<FormControl fullWidth margin="normal" error={!!errors.gender}>
								<InputLabel>Cinsiyet</InputLabel>
								<Select name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
									<MenuItem value="erkek">Erkek</MenuItem>
									<MenuItem value="kadin">Kadın</MenuItem>
								</Select>
								<FormHelperText>{errors.gender}</FormHelperText>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							{profileImage && (
								<div>
									<img src={profileImage} alt="Profile Preview" style={style.img} />
								</div>
							)}
							<input type="file" accept="image/*" name="profilePicture" onChange={handleChange} />
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

export default AddEmployee;
