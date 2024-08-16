import { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Card, Stack, CircularProgress, Typography } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationSnackbar from '../Global/NotificationSnackbar';

function SignIn() {
	return (
		<Card
			elevation={20}
			sx={{
				display: 'block',
				width: {
					xs: '95%',
					sm: '55%',
					md: '35%',
					lg: '25%',
				},
				margin: 'auto',
				mt: 8,
				p: 4,
			}}
		>
			<Stack direction="column" spacing={5}>
				<div>
					<Typography variant="h1">GİRİŞ SAYFASI</Typography>
					<Typography variant="body2" color="textSecondary">
						Hesap bilgilerinizi kullanarak giriş yapın.
					</Typography>
				</div>
				<LoginForm />
			</Stack>
		</Card>
	);
}

function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [snackbarMessage, setSnackbarMessage] = useState(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState('success');
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setSnackbarMessage(null);
		try {
			const response = await axios.post('https://localhost:44352/api/account/Login', {
				email,
				password,
			});
			localStorage.setItem('token', response.data.token);
			setIsLoading(false);
			setSnackbarMessage('Giriş Başarılı');
			setSnackbarSeverity('success');
			setTimeout(() => {
				navigate('/sample/index');
			}, 300);
		} catch (error) {
			setSnackbarMessage('Kullanıcı adı veya sifre hatalı');
			setSnackbarSeverity('error');
			setIsLoading(false);
		}
	};

	return (
		<>
			<NotificationSnackbar message={snackbarMessage} severity={snackbarSeverity} />
			<form onSubmit={handleSubmit}>
				<TextField
					autoFocus
					color="primary"
					name="email"
					label="E-posta"
					margin="normal"
					variant="outlined"
					fullWidth
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<TextField
					color="primary"
					name="password"
					type="password"
					margin="normal"
					label="Şifre"
					variant="outlined"
					fullWidth
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<Button
					sx={{
						mt: 2,
						textTransform: 'uppercase',
						color: 'primary.contrastText',
						'&:not(:disabled)': {
							background: (theme) =>
								`linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.tertiary.main} 100%)`,
						},
						'&:hover': {
							background: (theme) =>
								`linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.tertiary.dark} 100%)`,
						},
					}}
					type="submit"
					variant="contained"
					disabled={isLoading}
					endIcon={
						isLoading ? (
							<CircularProgress
								color="secondary"
								size={25}
								sx={{
									my: 'auto',
								}}
							/>
						) : (
							<LoginIcon />
						)
					}
					fullWidth
					color="primary"
				>
					Giriş Yap
				</Button>
			</form>
		</>
	);
}

export default SignIn;
