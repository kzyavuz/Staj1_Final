import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
	Paper,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Box,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeInfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import 'bootstrap/dist/css/bootstrap.min.css';

function EmployeeIndex() {
	const [employees, setEmployees] = useState([]);
	const [listType, setListType] = useState('active');
	const [columns, setColumns] = useState([]);
	const navigate = useNavigate();

	const updateColumns = (type) => {
		const cols = [
			{ id: 'employeeID', label: '#' },
			{ id: 'profileImage', label: 'Fotoğraf' },
			{ id: 'employeeName', label: 'Ad' },
			{ id: 'employeeSurName', label: 'Soy Ad' },
			{ id: 'userName', label: 'Kullanıcı Adı' },
			{ id: 'email', label: 'Mail Adresi' },
		];
		if (type === 'all') cols.push({ id: 'createDateTime', label: 'Katılım Tarihi' });
		if (type === 'updated') cols.push({ id: 'updateDateTime', label: 'Güncellenme Tarihi' });
		if (type === 'active') cols.push({ id: 'activeDateTime', label: 'Aktif Edilme Tarihi' });
		if (type === 'passive') cols.push({ id: 'passiveDateTime', label: 'Pasif Edilme Tarihi' });
		if (type === 'deleted') cols.push({ id: 'deleteDateTime', label: 'Çıkış Yapma Tarihi' });
		cols.push({ id: 'actions', label: 'Eylemler' });
		setColumns(cols);
	};

	const fetchEmployees = async (type) => {
		try {
			const endpointMap = {
				all: 'employee/EmployeeList',
				active: 'employee/EmployeeActiveList',
				passive: 'employee/EmployeePassiveList',
				updated: 'employee/EmployeeUpdateList',
				deleted: 'employee/EmployeeDeleteList',
			};
			const endpoint = endpointMap[type] || 'employee/EmployeeList';

			const response = await axiosInstance.post(`/${endpoint}`);
			setEmployees(response.data);
			updateColumns(type);
		} catch (error) {
			console.error('Çalışanlar getirilirken hata oluştu:', error.response ? error.response.data : error.message);
		}
	};

	useEffect(() => {
		fetchEmployees(listType);
	}, [listType]);

	const handleListTypeChange = (event) => setListType(event.target.value);

	const deleteEmployee = async (employeeID) => {
		try {
			await axiosInstance.post('/employee/DeleteEmployee', { employeeID });
			fetchEmployees(listType);
		} catch (error) {
			console.error('Çalışan silinirken hata oluştu:', error.response ? error.response.data : error.message);
		}
	};

	const setConvertStatusActive = async (employeeID) => {
		try {
			await axiosInstance.post('/employee/EmployeeConvertStatusActive', { employeeID });
			fetchEmployees(listType);
		} catch (error) {
			console.error('Çalışan aktif edilirken hata oluştu:', error.response ? error.response.data : error.message);
		}
	};

	const setConvertStatusPassive = async (employeeID) => {
		try {
			await axiosInstance.post('/employee/EmployeeConvertStatusPassive', { employeeID });
			fetchEmployees(listType);
		} catch (error) {
			console.error('Çalışan pasif edilirken hata oluştu:', error.response ? error.response.data : error.message);
		}
	};

	const employeeUpdate = (employeeID) =>
		navigate('/employee/UpdateEmployee', {
			state: {
				employeeID,
			},
		});

	return (
		<Card component="section" className="mt-5">
			<CardHeader title="Personel Listesi" subheader="Personel Listesi" />
			<Box display="flex" justifyContent="space-between" alignItems="center" className="mb-3">
				<Button
					onClick={() => navigate('/employee/AddEmployee')}
					variant="contained"
					disableElevation
					endIcon={<AddIcon />}
				>
					Personel Ekle
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
						<MenuItem value="all">Tüm Personel Listesi</MenuItem>
						<MenuItem value="updated">Güncellenmiş Personel Listesi</MenuItem>
						<MenuItem value="active">Aktif Personel</MenuItem>
						<MenuItem value="passive">Devre Dışı Personel</MenuItem>
						<MenuItem value="deleted">Çıkış Yapan Personel Listesi</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column.id}>{column.label}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{employees.length > 0 ? (
							employees.map((employee) => (
								<TableRow key={employee.employeeID} hover tabIndex={-1}>
									<TableCell>{employee.employeeID}</TableCell>
									<TableCell>
										{employee.profileImage ? (
											<img
												style={{
													width: '100px',
													height: '100px',
													borderRadius: '50%',
													objectFit: 'cover',
												}}
												src={`data:image/jpeg;base64,${employee.profileImage}`}
												alt="personel fotoğrafı"
											/>
										) : (
											<p className="text-center">...</p>
										)}
									</TableCell>
									<TableCell>{employee.employeeName || '...'}</TableCell>
									<TableCell>{employee.employeeSurName || '...'}</TableCell>
									<TableCell>{employee.userName || '...'}</TableCell>
									<TableCell>{employee.email || '...'}</TableCell>
									{listType === 'all' && (
										<TableCell>
											{employee.createDateTime
												? new Date(employee.createDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: '...'}
										</TableCell>
									)}
									{listType === 'updated' && (
										<TableCell>
											{employee.updateDateTime
												? new Date(employee.updateDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: '...'}
										</TableCell>
									)}
									{listType === 'active' && (
										<TableCell>
											{employee.activeDateTime
												? new Date(employee.activeDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: ''}
										</TableCell>
									)}
									{listType === 'passive' && (
										<TableCell>
											{employee.passiveDateTime
												? new Date(employee.passiveDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: '...'}
										</TableCell>
									)}
									{listType === 'deleted' && (
										<TableCell>
											{employee.deleteDateTime
												? new Date(employee.deleteDateTime).toLocaleString('tr-TR', {
														dateStyle: 'short',
														timeStyle: 'short',
													})
												: ''}
										</TableCell>
									)}

									<TableCell>
										<Tooltip title="Personel Detay" arrow>
											<IconButton
												aria-label="update"
												color="warning"
												size="small"
												onClick={() => employeeUpdate(employee.employeeID)}
											>
												<ModeInfoOutlinedIcon fontSize="medium" />
											</IconButton>
										</Tooltip>
										{listType !== 'deleted' && (
											<Tooltip title="Personel Sil" arrow>
												<IconButton
													aria-label="delete"
													color="error"
													size="small"
													onClick={() => deleteEmployee(employee.employeeID)}
												>
													<DeleteIcon fontSize="medium" />
												</IconButton>
											</Tooltip>
										)}
										{listType === 'active' && (
											<Tooltip title="Personeli pasif yap" arrow>
												<IconButton
													aria-label="disable"
													color="default"
													size="small"
													onClick={() => setConvertStatusPassive(employee.employeeID)}
												>
													<PersonOffOutlinedIcon fontSize="medium" />
												</IconButton>
											</Tooltip>
										)}
										{listType === 'passive' && (
											<Tooltip title="Personeli aktif yap" arrow>
												<IconButton
													aria-label="active"
													color="success"
													size="small"
													onClick={() => setConvertStatusActive(employee.employeeID)}
												>
													<PersonAddIcon fontSize="medium" />
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

export default EmployeeIndex;
