import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import NotificationSnackbar from '../Global/NotificationSnackbar';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Avatar,
	Box,
	Grid,
	TextField,
	Button,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from '@mui/material';

function EmployeeUpdate() {
	const location = useLocation();
	const { employeeID } = location.state || {};
	const [employeeName, setEmployeeName] = useState('');
	const [employeeSurName, setEmployeeSurName] = useState('');
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setUserPassword] = useState('');
	const [registrationNumber, setRegistrationNumber] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [birthday, setBirthday] = useState(null);
	const [unit, setUnit] = useState('');
	const [age, setAge] = useState('');
	const [theClass, setClass] = useState('');
	const [task, setTask] = useState('');
	const [gender, setGender] = useState(null);
	const [roleID, setRoleID] = useState('');
	const [profilePicture, setProfilePicture] = useState(null);
	const [profileImage, setProfileImage] = useState(null);
	const isEdit = true;
	const [works, setWorks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const style = {
		button: {
			width: '100px',
			height: '50px',
			display: 'flex',
			float: 'right',
			margin: '0px 10px 30px 10px',
		},
	};

	useEffect(() => {
		const fetchEmployeeDetails = async () => {
			try {
				const response = await axiosInstance.post('employee/EmployeeDetailsList', { employeeID });
				const employee = response.data;
				setEmployeeName(employee.employeeName);
				setEmployeeSurName(employee.employeeSurName);
				setUserName(employee.userName);
				setEmail(employee.email);
				setRegistrationNumber(employee.registrationNumber);
				setPhoneNumber(employee.phoneNumber);
				setBirthday(employee.birthday ? new Date(employee.birthday).toISOString().split('T')[0] : '');
				setGender(employee.gender ? 'erkek' : 'kadin');
				setAge(employee.age);
				setUnit(employee.unit);
				setClass(employee.class);
				setTask(employee.task);
				setRoleID(employee.roleID);
				setUserPassword('');
				if (employee.profileImage) {
					setProfileImage(`data:image/jpeg;base64,${employee.profileImage}`);
				}
			} catch (err) {
				setErrors('Çalışan bilgileri alınamadı');
				console.error('Error fetching employee details:', err);
			} finally {
				setLoading(false);
			}
		};

		const fetchEmployeeWorks = async () => {
			try {
				const response = await axiosInstance.post('employee/EmployeeWorksList', {
					employeeID,
				});
				const worksData = response.data;
				setWorks(worksData);
			} catch (err) {
				setErrors('Çalışanın iş bilgileri alınamadı');
				console.error('Çalısan İş Hata:', err);
			}
		};

		fetchEmployeeDetails();
		fetchEmployeeWorks();
	}, [employeeID]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setProfilePicture(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setProfileImage(reader.result);
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setLoading(true);
		setErrors({});
		setSnackbarMessage(null);
		const formData = new FormData();

		formData.append('employeeID', employeeID);
		formData.append('employeeName', employeeName);
		formData.append('employeeSurName', employeeSurName);
		formData.append('registrationNumber', registrationNumber);
		formData.append('phoneNumber', phoneNumber);
		formData.append('birthday', birthday);
		formData.append('unit', unit);
		formData.append('age', age);
		formData.append('class', theClass);
		formData.append('task', task);
		formData.append('gender', gender === 'erkek');
		formData.append('userName', userName);
		formData.append('roleID', roleID);
		formData.append('email', email);
		formData.append('password', password);

		if (profilePicture) {
			formData.append('profilePicture', profilePicture);
		}

		try {
			await axiosInstance.post('/employee/UpdateEmployee', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setSnackbarMessage('Personel başarıyla güncellendi');
			setSnackbarSeverity('success');
		} catch (error) {
			if (error.response && error.response.data) {
				if (error.response.data.errors) {
					const newErrors = Object.values(error.response.data.errors).flat();
					setErrors({ general: newErrors.join('\n') });
				} else {
					setErrors({ general: error.response.data.message || 'Çalışanın bilgileri güncellenemedi' });
				}
			} else {
				setErrors({ general: 'Beklenmeyen bir hata oluştu.' });
			}
			setSnackbarMessage('Personel güncellenirken hata oluştu');
			setSnackbarSeverity('error');
			console.error('Hata personel güncellenmedi:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Yükleniyor...</div>;
	}
	return (
		<Card sx={{ maxWidth: 1200, mx: 'auto', p: 3, mt: 5 }}>
			<NotificationSnackbar message={snackbarMessage} severity={snackbarSeverity} />
			<CardContent>
				<Typography variant="h5" component="div" gutterBottom>
					Personel Detay Ekranı
				</Typography>
				{errors.general && (
					<div style={{ color: 'red', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{errors.general}</div>
				)}
				<Box sx={{ textAlign: 'center', mb: 2 }} style={{ display: 'inline-block' }}>
					{profileImage ? (
						<Avatar src={profileImage} sx={{ width: 120, height: 120 }} />
					) : (
						<Avatar sx={{ width: 120, height: 120, mx: 'auto' }}>N/A</Avatar>
					)}
				</Box>

				<Grid item xs={12}>
					<input style={{ marginBottom: '20px' }} type="file" onChange={handleFileChange} />
				</Grid>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Personel Adı"
								value={employeeName}
								onChange={(e) => setEmployeeName(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.employeeName}
								helperText={errors.employeeName}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Personel Soyadı"
								value={employeeSurName}
								onChange={(e) => setEmployeeSurName(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.employeeSurName}
								helperText={errors.employeeSurName}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Kullanıcı Adı"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.userName}
								helperText={errors.userName}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Doğum Günü"
								value={birthday}
								onChange={(e) => setBirthday(e.target.value)}
								fullWidth
								margin="normal"
								type="date"
								error={!!errors.birthday}
								helperText={errors.birthday}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="normal" error={!!errors.gender}>
								<InputLabel>Cinsiyet</InputLabel>
								<Select value={gender} onChange={(e) => setGender(e.target.value)}>
									<MenuItem value="erkek">Erkek</MenuItem>
									<MenuItem value="kadin">Kadın</MenuItem>
								</Select>
								{errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
							</FormControl>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								label="Yaş"
								value={age}
								onChange={(e) => setAge(e.target.value)}
								fullWidth
								margin="normal"
								disabled={isEdit}
								error={!!errors.age}
								helperText={errors.age}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								label="TC Kimlişk Numarası"
								value={registrationNumber}
								onChange={(e) => setRegistrationNumber(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.registrationNumber}
								helperText={errors.registrationNumber}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								label="Telefon Numarası"
								value={phoneNumber}
								onChange={(e) => setPhoneNumber(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.phoneNumber}
								helperText={errors.phoneNumber}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								label="Birim"
								value={unit}
								onChange={(e) => setUnit(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.unit}
								helperText={errors.unit}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Sınıf"
								value={theClass}
								onChange={(e) => setClass(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.theClass}
								helperText={errors.theClass}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Görev"
								value={task}
								onChange={(e) => setTask(e.target.value)}
								fullWidth
								margin="normal"
								error={!!errors.task}
								helperText={errors.task}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								fullWidth
								margin="normal"
								type="email"
								error={!!errors.email}
								helperText={errors.email}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Şifre"
								value={password}
								onChange={(e) => setUserPassword(e.target.value)}
								fullWidth
								margin="normal"
								type="password"
								error={!!errors.password}
								helperText={errors.password}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<FormControl fullWidth margin="normal" error={!!errors.roleID}>
								<InputLabel>Rol</InputLabel>
								<Select value={roleID} onChange={(e) => setRoleID(e.target.value)}>
									<MenuItem value="1">Kullanıcı</MenuItem>
									<MenuItem value="2">Admin</MenuItem>
								</Select>
								{errors.roleID && <FormHelperText>{errors.roleID}</FormHelperText>}
							</FormControl>
						</Grid>
					</Grid>

					<Box mt={3}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							style={style.button}
							disabled={loading}
						>
							Güncelle
						</Button>
					</Box>

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

				<Box mt={5}>
					<Typography variant="h6">Çalışanın İş Listesi</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>İş İsmi</TableCell>
								<TableCell>Başlangıç Tarihi</TableCell>
								<TableCell>Bitiş Tarihi</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{works.map((work, index) => (
								<TableRow key={index}>
									<TableCell>{work.workName}</TableCell>
									<TableCell>
										{work.createDateTime
											? new Date(work.createDateTime).toLocaleString('tr-TR', {
													dateStyle: 'short',
													timeStyle: 'short',
												})
											: '...'}
									</TableCell>
									<TableCell>
										{work.passiveDateTime
											? new Date(work.passiveDateTime).toLocaleString('tr-TR', {
													dateStyle: 'short',
													timeStyle: 'short',
												})
											: '...'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			</CardContent>
		</Card>
	);
}

export default EmployeeUpdate;
