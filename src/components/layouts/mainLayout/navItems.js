import { v4 as uuid } from 'uuid';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

const getNavItems = (role) => {
	const ADMIN_NAV_LINKS = [
		{
			id: uuid(),
			type: 'item',
			title: 'Personel Listeleri',
			Icon: BarChartOutlinedIcon,
			href: '/employee/index',
		},
		{
			id: uuid(),
			type: 'item',
			title: 'İş İşlemleri',
			Icon: BarChartOutlinedIcon,
			href: '/work/index',
		},
	];

	const USER_NAV_LINKS = [
		{
			id: uuid(),
			type: 'item',
			title: 'KOZOLOW AŞ.',
			Icon: BarChartOutlinedIcon,
			href: '/sample/index',
		},
		{
			id: uuid(),
			type: 'item',
			title: 'İş Listem',
			Icon: BarChartOutlinedIcon,
			href: '/work/myWorkInfo',
		},
	];

	return role === 'admin' ? ADMIN_NAV_LINKS : USER_NAV_LINKS;
};

export default getNavItems;
