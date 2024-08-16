import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import axiosInstance from '../../../axiosConfig';
// MUI
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function LoggedUser() {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const [user, setUser] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const LoginClose = () => {
		localStorage.removeItem('token');
		window.location.href = '/login/SignIn';
	};

	const goToProfilePage = () => navigate(`/user/Profile/`);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await axiosInstance.post('/Account/GetUserProfile');
				setUser(response.data);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};

		fetchUserProfile();
	}, []);

	return (
		<>
			<Menu
				elevation={26}
				sx={{
					'& .MuiMenuItem-root': {
						mt: 0.5,
					},
				}}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				<MenuList
					sx={{
						p: 1,
						'& .MuiMenuItem-root': {
							borderRadius: 2,
						},
					}}
				>
					<Stack px={3}>
						<Typography variant="subtitle1" textAlign="center">
							{user ? user.userName : 'Yükleniyor...'}
						</Typography>
						<Typography variant="subtitle2" textAlign="center">
							{user ? `${user.employeeName} ` : 'Yükleniyor...'}
							{user ? user.employeeSurName : 'Yükleniyor...'}
						</Typography>
					</Stack>
					<Divider
						sx={{
							borderColor: 'primary.light',
							my: 1,
						}}
					/>
					<MenuItem onClick={goToProfilePage}>
						<ListItemIcon>
							<Person2OutlinedIcon fontSize="small" />
						</ListItemIcon>
						Profil Sayfam
					</MenuItem>
					<MenuItem onClick={LoginClose} component={RouterLink}>
						<ListItemIcon>
							<ExitToAppIcon fontSize="small" />
						</ListItemIcon>
						Çıkıs Yap
					</MenuItem>
				</MenuList>
			</Menu>
			<Stack height="100%" direction="row" flex={1} justifyContent="flex-end" alignItems="center" spacing={0}>
				<ButtonBase
					onClick={handleClick}
					variant="outlined"
					sx={{
						ml: 1,
						height: '100%',
						overflow: 'hidden',
						borderRadius: '25px',
						transition: '.2s',
						px: 1,
						transitionProperty: 'background,color',
						'&:hover': {
							bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
						},
						'&:hover .MuiSvgIcon-root': {
							opacity: '1',
						},
					}}
				>
					<Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
						<Avatar
							alt="User Img"
							src={`data:image/jpeg;base64,${user ? user.profileImage : 'Yükleniyor...'}`}
							sx={{
								width: 35,
								height: 35,
								boxShadow: (theme) =>
									`0px 0px 0px 4px ${theme.palette.background.paper} ,0px 0px 0px 5px ${theme.palette.primary.main} `,
							}}
						/>
						<Typography
							variant="body2"
							display={{
								xs: 'none',
								sm: 'inline-block',
							}}
						>
							{user ? user.employeeName : 'Yükleniyor...'}
						</Typography>
						<ExpandMoreIcon
							fontSize="small"
							sx={{
								transition: '0.2s',
								opacity: '0',
							}}
						/>
					</Stack>
				</ButtonBase>
			</Stack>
		</>
	);
}

export default LoggedUser;
