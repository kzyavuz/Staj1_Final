import { useEffect, useState } from 'react';
import { TextField, Grid, Box, Typography, Paper, Avatar, Button } from '@mui/material';
import axiosInstance from '../../../axiosConfig';
import NotificationSnackbar from '../Global/NotificationSnackbar';
import { useNavigate } from 'react-router-dom';

function Profile() {
	const [profile, setProfile] = useState(null);
	const [password, setUserPassword] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState({});
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const isEditable = true;
	const navigate = useNavigate();

	const style = {
		button: {
			width: '100px',
			height: '50px',
			margin: '10px',
		},
	};
	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axiosInstance.post('account/GetUserProfile');
				setProfile(response.data);
			} catch (err) {
				setError({ general: 'Çalışan bilgileri alınamadı' });
				console.error('Error fetching employee details:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// setLoading(true);
		setError({});
		setSnackbarMessage(null);

		try {
			await axiosInstance.post('/employee/MyPasswordEdit', { password });
			setSnackbarMessage('Şifre başarıyla güncellendi');
			setSnackbarSeverity('success');
		} catch (error) {
			if (error.response && error.response.data) {
				if (error.response.data.errors) {
					const newErrors = Object.values(error.response.data.errors).flat();
					setError({ general: newErrors.join('\n') });
				} else {
					setError({ general: error.response.data.message || 'Şifre güncellenemedi' });
				}
			} else {
				setError({ general: 'Beklenmeyen bir hata oluştu.' });
			}
			setSnackbarMessage('Şifre güncellenirken hata oluştu');
			setSnackbarSeverity('error');
			console.error('Hata Şifre güncellenmedi:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Yükleniyor...</div>;
	}

	return (
		<Box sx={{ flexGrow: 1, padding: 2 }}>
			<Paper elevation={3} sx={{ padding: 3 }}>
				<Typography variant="h6" gutterBottom>
					Profil Sayfam
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<h4>Kişisel Bilgilerim</h4>
						<TextField
							fullWidth
							label="Personel No"
							value={profile?.employeeID || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Sicil No"
							value={profile?.registrationNumber || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Ad"
							value={profile?.employeeName || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Soyad"
							value={profile?.employeeSurName || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Doğum Günü"
							value={profile?.birthday || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Yaş"
							value={profile?.age || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Cinsiyet"
							value={profile?.gender || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="E-mail"
							value={profile?.email || ''}
							margin="normal"
							disabled={isEditable}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<Box sx={{ textAlign: 'center', mb: 2 }} style={{ display: 'flex', float: 'right' }}>
							{profile?.profileImage ? (
								<Avatar
									src={`data:image/jpeg;base64,${profile.profileImage}`}
									sx={{ width: 120, height: 120 }}
								/>
							) : (
								<Avatar sx={{ width: 120, height: 120, mx: 'auto' }}>N/A</Avatar>
							)}
						</Box>
						<h4 style={{ marginTop: '166px' }}>İş Bilgilerim</h4>

						<TextField
							fullWidth
							label="Birim"
							value={profile?.unit || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Sınıfı"
							value={profile?.class || ''}
							margin="normal"
							disabled={isEditable}
						/>
						<TextField
							fullWidth
							label="Görevi"
							value={profile?.task || ''}
							margin="normal"
							disabled={isEditable}
						/>
					</Grid>
				</Grid>
				<form onSubmit={handleSubmit}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Şifre"
							value={password}
							onChange={(e) => setUserPassword(e.target.value)}
							fullWidth
							margin="normal"
							type="password"
						/>
					</Grid>
					{error.general && (
						<div style={{ color: 'red', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
							{error.general}
						</div>
					)}
					<Button type="submit" variant="contained" color="primary" style={style.button}>
						Güncelle
					</Button>

					<Button
						type="button"
						variant="contained"
						color="error"
						style={style.button}
						onClick={() => navigate(-1)}
					>
						İptal
					</Button>
					<NotificationSnackbar message={snackbarMessage} severity={snackbarSeverity} />
				</form>
			</Paper>
		</Box>
	);
}

export default Profile;
