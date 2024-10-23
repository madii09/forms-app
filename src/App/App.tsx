import { Route, Routes } from 'react-router-dom';
import {
	Home,
	SignUp,
	SignIn,
	AdminDashboard,
	CreateTemplate,
	EditTemplate,
	Requests,
	RequestDetails,
	TemplateInfo,
} from '../pages';
import { ROUTES } from '../utils';
import { AuthProvider } from '../Providers/AuthProvider';
import { Navbar } from '../components';

import './globalStyles/globalStyles.module.scss';

function App() {
	return (
		<AuthProvider>
			<Navbar />

			<Routes>
				<Route path={ROUTES.home} element={<Home />} />
				<Route path={ROUTES.signUp} element={<SignUp />} />
				<Route path={ROUTES.signIn} element={<SignIn />} />
				<Route path={ROUTES.adminDashboard} element={<AdminDashboard />} />
				<Route path={ROUTES.createTemplate} element={<CreateTemplate />} />
				<Route path={ROUTES.editTemplate.route} element={<EditTemplate />} />
				<Route path={ROUTES.requests.route} element={<Requests />} />
				<Route path={ROUTES.requests.request.route} element={<RequestDetails />} />
				<Route path={ROUTES.templateInfo.route} element={<TemplateInfo />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
