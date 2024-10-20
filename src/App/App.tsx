import { Route, Routes } from 'react-router-dom';
import { Home, SignUp, SignIn, AdminDashboard } from '../pages';
import { ROUTES } from '../utils';
import { AuthProvider } from '../Providers/AuthProvider';

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route path={ROUTES.adminDashboard} element={<AdminDashboard />} />
				<Route path={ROUTES.home} element={<Home />} />
				<Route path={ROUTES.signUp} element={<SignUp />} />
				<Route path={ROUTES.signIn} element={<SignIn />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
