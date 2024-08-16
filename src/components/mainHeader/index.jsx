import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo/png/KOZLOW.jpg';
import LoggedUser from './loggedUser';

function MainHeader() {
	const navigate = useNavigate();
	return (
		<Box bgcolor="background.paper" component="header" py={1.5} zIndex={1}>
			<Stack
				component={Container}
				maxWidth="lg"
				direction="row"
				height={60}
				justifyContent="space-between"
				alignItems="center"
				flexWrap="wrap"
				spacing={3}
				overflow="hidden"
			>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Box
						component="img"
						onClick={() => navigate('/sample/index')}
						width={{
							xs: 100,
							sm: 150,
						}}
						height={{
							xs: 40,
							sm: 60,
						}}
						src={logo}
						alt="logo"
						sx={{
							cursor: 'pointer',
						}}
					/>
					<Typography
						component="sub"
						variant="caption"
						alignSelf="self-end"
						display={{
							xs: 'none',
							sm: 'block',
						}}
					>
						KOZLOW A.Ş.
					</Typography>
				</Stack>
				{/* <SearchBar /> */}
				<LoggedUser />
			</Stack>
		</Box>
	);
}

export default MainHeader;
