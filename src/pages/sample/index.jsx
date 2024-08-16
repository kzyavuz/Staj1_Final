import { CardHeader, CardContent, Card, Breadcrumbs, CardMedia, Typography, Container } from '@mui/material';
import PageHeader from '@/components/pageHeader';
import imag from '@/assets/images/kozlow_AS.jpg';

function SamplePage() {
	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<PageHeader title="KOZLOW A.Ş."> </PageHeader>
			<Card
				sx={{
					minHeight: '60vh',
					p: 4,
					borderRadius: 2,
					boxShadow: 3,
				}}
			>
				{' '}
				<CardContent>
					<CardHeader
						title="BİZ KİMİZ"
						subheader="Hakkımızda"
						sx={{
							borderBottom: '1px solid',
							borderColor: 'divider',
							mb: 2,
						}}
					/>
					<CardMedia
						component="img"
						height="300"
						image={imag}
						alt="Kozlow A.Ş. Logo"
						style={{ marginBottom: '30px' }}
					/>

					<Typography variant="body1" paragraph>
						Kozlow A.Ş., teknoloji alanında yenilikçi çözümler sunan bir liderdir. 1994 yılında kurulan
						şirketimiz, sektördeki en son teknolojileri kullanarak müşterilerimize yüksek kaliteli ürün ve
						hizmetler sunmaktadır.
					</Typography>
					<Typography variant="body1" paragraph>
						Misyonumuz, müşterilerimizin iş süreçlerini optimize etmelerine ve rekabet avantajı elde
						etmelerine yardımcı olmaktır. Bu hedef doğrultusunda, yazılım geliştirme, sistem entegrasyonu,
						veri analitiği ve bulut çözümleri gibi çeşitli alanlarda uzmanlaşmış bir ekibe sahibiz.
					</Typography>
					<Typography variant="body1" paragraph>
						Kozlow A.Ş. olarak, müşteri memnuniyetini her şeyin üzerinde tutuyoruz. Bu nedenle,
						projelerimizi müşterilerimizin ihtiyaçlarına göre özelleştiriyor ve her aşamada yüksek kalite
						standartlarına odaklanıyoruz. Teknolojik gelişmeleri yakından takip ederek, en son yenilikleri
						projelerimize entegre ediyor ve sektördeki en iyi uygulamaları sunuyoruz.
					</Typography>
					<Typography variant="body1" paragraph>
						Şirketimiz, sektördeki öncü projeleriyle tanınmakta ve bu projelerdeki başarılarıyla adından söz
						ettirmektedir. Teknoloji alanında sağladığımız çözümlerle, müşterilerimize hem verimlilik hem de
						yenilikçi bir bakış açısı kazandırmayı amaçlıyoruz.
					</Typography>
					<Typography variant="body1" paragraph>
						Kozlow A.Ş. olarak vizyonumuz, teknolojinin gücünü kullanarak iş dünyasında fark yaratmak ve
						global ölçekte tanınan bir teknoloji markası olmaktır. Bizi tercih eden tüm müşterilerimize
						teşekkür eder, teknoloji alanındaki ihtiyaçlarınıza yönelik en iyi çözümleri sunmak için
						sizlerle çalışmayı dört gözle bekleriz.
					</Typography>
				</CardContent>
			</Card>
		</Container>
	);
}

export default SamplePage;
