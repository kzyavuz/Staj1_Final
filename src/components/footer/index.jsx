import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// assets

function Footer() {
	return (
		<Box bgcolor={(theme) => theme.palette.background.paper} py={3} borderTop={1} borderColor="cuaternary.300">
			<Container maxWidth="lg" component={Stack} direction="column" spacing={5}>
				<Grid container spacing={3} alignContent="center" justifyContent="center" alignItems="center">
					<Grid item xs={12} sm={6} md={6}>
						<Stack spacing={1}>
							<Typography variant="h6" my={1}>
								İletişim
							</Typography>
							<ContactLink
								style={{ color: 'white' }}
								Icon={LocalPhoneOutlinedIcon}
								text="+90 535 581 35 61"
							/>
							<ContactLink Icon={EmailOutlinedIcon} text="digiturkinforeactproject.com" />
							<ContactLink Icon={LocationOnOutlinedIcon} text="42322 DF ciudad paleta, Noxus, México" />
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Stack spacing={1}>
							<Typography variant="h6" my={1}>
								Hakkinda
							</Typography>
							<FooterLink text="Biz Kimiz " />
							<FooterLink text="Neden Biz" />
							<FooterLink text="Referanslar" />
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Stack spacing={1}>
							<Typography variant="h6" my={1}>
								Servis
							</Typography>
							<FooterLink text="Personel Takip Sistemi" />
							<FooterLink text="İş İstasyonu Takip Sistemi" />
							<FooterLink text="Cihaz Takip Sistemi" />
						</Stack>
					</Grid>
				</Grid>

				<Divider
					variant="middle"
					sx={{
						bgcolor: (theme) => theme.palette.secondary.main,
					}}
				/>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Typography variant="body1" textAlign="center">
						Tüm haklar 2024 © yılnda stajreactproject tarafından saklıdır. KOZLOW
					</Typography>
					<Typography variant="subtitle1" textAlign="center">
						Digiturk{' '}
						<Link
							underline="hover"
							sx={{
								cursor: 'pointer',
							}}
							href="https://www.instagram.com/kz_kozlow/"
							target="_blank"
							rel="noreferrer noopener"
							fontWeight="medium"
						>
							- @Yavuz Koz
						</Link>{' '}
					</Typography>
				</Stack>
			</Container>
		</Box>
	);
}

function ContactLink({ Icon, text }) {
	return (
		<Stack spacing={1} alignItems="center" direction="row">
			<Icon
				color="primary"
				sx={{
					mr: 3,
				}}
			/>
			<Typography variant="body1">{text}</Typography>
		</Stack>
	);
}

function FooterLink({ text }) {
	return (
		<Link
			variant="body2"
			fontWeight="300"
			href="#!"
			underline="hover"
			sx={{
				color: 'text.primary',
				'&:hover': {
					'& svg': {
						opacity: '1',
						ml: 2,
					},
				},
				'&::before': {
					content: '""',
					display: 'inline-block',
					borderRadius: '50%',
					bgcolor: 'primary.main',
					width: '4px',
					height: '4px',
					mb: '2px',
					mr: 2,
				},
			}}
		>
			{/* <span style={{ marginRight: '15px' }}>•</span> */}
			{text}
			<ArrowForwardIosIcon
				color="primary"
				sx={{
					transition: '0.3s',
					fontSize: '11px',
					ml: 0,
					opacity: '0',
				}}
			/>
		</Link>
	);
}

export default Footer;
