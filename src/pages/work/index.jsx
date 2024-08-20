import { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosConfig';
import {
	Button,
	Card,
	CardHeader,
	TableRow,
	TableCell,
	Tooltip,
	IconButton,
	Table,
	TableBody,
	TableContainer,
	TableHead,
	Select,
	Box,
	FormControl,
	MenuItem,
	InputLabel,
	Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import ModeInfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function WorkIndex() {
	const [work, setWork] = useState([]);
	const [listType, setListType] = useState('active');
	const [columns, setColumns] = useState([]);
	const navigate = useNavigate();

	const updateColumns = (type) => {
		const baseColumns = [
			{ id: 'workID', label: '#' },
			{ id: 'workName', label: 'İş Adı' },
			{ id: 'district', label: 'İl' },
			{ id: 'city', label: 'İlçe' },
			{ id: 'employeeName', label: 'Personel Adı' },
			{ id: 'employeeSurName', label: 'Personel Soyadı' },
		];

		const extraColumns = {
			all: { id: 'createDateTime', label: 'Katılım Tarihi' },
			active: { id: 'activeDateTime', label: 'Aktif Edilme Tarihi' },
			passive: { id: 'passiveDateTime', label: 'Pasif Edilme Tarihi' },
			deleted: { id: 'deleteDateTime', label: 'İş Silinme Tarihi' },
		};

		const columnsToDisplay =
			type in extraColumns
				? [...baseColumns, extraColumns[type], { id: 'actions', label: 'Eylemler' }]
				: [...baseColumns, { id: 'actions', label: 'Eylemler' }];

		setColumns(columnsToDisplay);
	};

	const fetchWork = async (type) => {
		try {
			const endpointMap = {
				all: 'work/ListWork',
				active: 'work/ListWorkActive',
				passive: 'work/ListWorkPassive',
				deleted: 'work/ListDeleteWork',
			};
			const endpoint = endpointMap[type] || 'work/ListWork';

			const response = await axiosInstance.post(`/${endpoint}`);
			setWork(response.data);
			updateColumns(type);
		} catch (error) {
			console.error('Error fetching work:', error.response?.data || error.message);
		}
	};

	useEffect(() => {
		fetchWork(listType);
	}, [listType]);

	const handleListTypeChange = (event) => {
		setListType(event.target.value);
	};

	const deleteWork = async (workID) => {
		try {
			await axiosInstance.post('work/DeleteWork', { workID });
			fetchWork(listType);
		} catch (error) {
			console.error('Error deleting work:', error.response?.data || error.message);
		}
	};

	const setConvertStatusActive = async (workID) => {
		try {
			await axiosInstance.post('work/WorkConvertStatusActive', { workID });
			fetchWork(listType);
		} catch (error) {
			console.error('Error converting work to active:', error.response?.data || error.message);
		}
	};

	const setConvertStatusPassive = async (workID) => {
		try {
			await axiosInstance.post('work/WorkConvertStatusPassive', { workID });
			fetchWork(listType);
		} catch (error) {
			console.error('Error converting work to passive:', error.response?.data || error.message);
		}
	};

	const workUpdate = (workID) => {
		navigate('/work/UpdateWork', { state: { workID } });
	};

	return (
		<Card component="section" className="mt-5">
			<CardHeader title="İş Listesi" subheader="İş Listesi" />
			<Box display="flex" justifyContent="space-between" alignItems="center" className="mb-3">
				<Button
					className="mb-3"
					onClick={() => navigate('/work/AddWork')}
					variant="contained"
					disableElevation
					endIcon={<AddIcon />}
				>
					İş Ekle
				</Button>
				<FormControl variant="outlined">
					<InputLabel id="list-type-label">Tablo Seçin</InputLabel>
					<Select
						labelId="list-type-label"
						id="list-type"
						value={listType}
						onChange={handleListTypeChange}
						label="Tablo Seçin"
					>
						<MenuItem value="all">Tüm İş Listesi</MenuItem>
						<MenuItem value="active">Aktif İş Listesi</MenuItem>
						<MenuItem value="passive">Pasif İş Listesi</MenuItem>
						<MenuItem value="deleted">Silinmiş İş Listesi</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<TableCell key={col.id}>{col.label}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{work.length > 0 ? (
							work.map((item) => (
								<TableRow key={item.workID} hover tabIndex={-1}>
									<TableCell>{item.workID}</TableCell>
									<TableCell>{item.workName || ''}</TableCell>
									<TableCell>{item.city || ''}</TableCell>
									<TableCell>{item.district || ''}</TableCell>
									<TableCell>{item.employeeName}</TableCell>
									<TableCell>{item.employeeSurName}</TableCell>
									{listType === 'all' && (
										<TableCell>
											{item.createDateTime
												? new Date(item.createDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: ''}
										</TableCell>
									)}
									{listType === 'active' && (
										<TableCell>
											{item.activeDateTime
												? new Date(item.activeDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: ''}
										</TableCell>
									)}
									{listType === 'passive' && (
										<TableCell>
											{item.passiveDateTime
												? new Date(item.passiveDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: ''}
										</TableCell>
									)}
									{listType === 'deleted' && (
										<TableCell>
											{item.deleteDateTime
												? new Date(item.deleteDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: ''}
										</TableCell>
									)}

									<TableCell>
										<Tooltip title="İş Detayı" arrow>
											<IconButton
												aria-label="info"
												color="warning"
												size="small"
												onClick={() => workUpdate(item.workID)}
											>
												<ModeInfoOutlinedIcon fontSize="medium" />
											</IconButton>
										</Tooltip>
										{listType !== 'deleted' && (
											<Tooltip title="Sil" arrow>
												<IconButton
													aria-label="delete"
													color="error"
													size="small"
													onClick={() => deleteWork(item.workID)}
												>
													<DeleteIcon fontSize="medium" />
												</IconButton>
											</Tooltip>
										)}
										{listType === 'active' && (
											<Tooltip title="İş pasif yap" arrow>
												<IconButton
													aria-label="disable"
													color="default"
													size="small"
													onClick={() => setConvertStatusPassive(item.workID)}
												>
													<WorkOffIcon fontSize="medium" />
												</IconButton>
											</Tooltip>
										)}
										{listType === 'passive' && (
											<Tooltip title="İş aktif yap" arrow>
												<IconButton
													aria-label="active"
													color="success"
													size="small"
													onClick={() => setConvertStatusActive(item.workID)}
												>
													<WorkIcon fontSize="medium" />
												</IconButton>
											</Tooltip>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} align="center">
									Veri bulunamadı
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Card>
	);
}

export default WorkIndex;
