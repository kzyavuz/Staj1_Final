import { lazy, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTopOnRouteChange from '@hocs/withScrollTopOnRouteChange';
import withLazyLoadably from '@hocs/withLazyLoadably';
import MainLayout from '@/components/layouts/mainLayout';
import MinimalLayout from '@/components/layouts/minimalLayout';
import Token from '@/utils/routes/Token';

const SamplePage = withLazyLoadably(lazy(() => import('@/pages/sample/index')));
const EmployeeIndex = withLazyLoadably(lazy(() => import('@/pages/employee/index')));
const EmplyeeAdd = withLazyLoadably(lazy(() => import('@/pages/employee/AddEmployee')));
const Profile = withLazyLoadably(lazy(() => import('@/pages/user/Profile')));
const MyWorkInfo = withLazyLoadably(lazy(() => import('@/pages/work/MyWorkInfo')));
const EmployeeUpdate = withLazyLoadably(lazy(() => import('@/pages/employee/UpdateEmployee')));
const WorkIndex = withLazyLoadably(lazy(() => import('@/pages/work/index')));
const AddWork = withLazyLoadably(lazy(() => import('@/pages/work/AddWork')));
const UpdateWork = withLazyLoadably(lazy(() => import('@/pages/work/UpdateWork')));
const Login = withLazyLoadably(lazy(() => import('@/pages/login/SignIn')));

function Router() {
	const [role, setRole] = useState(null);

	return (
		<BrowserRouter>
			<ScrollToTopOnRouteChange>
				<Token setRole={setRole} />
				<Routes>
					{role === 'admin' && (
						<Route path="/" element={<MainLayout />}>
							<Route path="employee/">
								<Route path="index" element={<EmployeeIndex />} />
								<Route path="AddEmployee" element={<EmplyeeAdd />} />
								<Route path="UpdateEmployee/:id" element={<EmployeeUpdate />} />
							</Route>
							<Route path="work/">
								<Route path="index" element={<WorkIndex />} />
								<Route path="AddWork" element={<AddWork />} />
								<Route path="UpdateWork/:id" element={<UpdateWork />} />
							</Route>
							<Route path="user/">
								<Route path="Profile" element={<Profile />} />
							</Route>
							<Route path="sample/">
								<Route path="index" element={<SamplePage />} />
							</Route>
						</Route>
					)}
					{role === 'user' && (
						<Route path="/" element={<MainLayout />}>
							<Route path="user/">
								<Route path="Profile" element={<Profile />} />
							</Route>
							<Route path="work/">
								<Route path="MyWorkInfo" element={<MyWorkInfo />} />
							</Route>
							<Route path="sample/">
								<Route path="index" element={<SamplePage />} />
							</Route>
						</Route>
					)}
					{!role && (
						<Route>
							<Route path="*" element={<MinimalLayout />}>
								<Route path="*" element={<Login />} />
								<Route path="login/SignIn" element={<Login />} />
							</Route>
						</Route>
					)}
				</Routes>
			</ScrollToTopOnRouteChange>
		</BrowserRouter>
	);
}

export default Router;
