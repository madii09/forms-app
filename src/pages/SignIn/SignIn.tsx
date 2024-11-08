import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils';
import { useAuth, useLogin } from '../../hooks';
import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: 'auto',
	[theme.breakpoints.up('sm')]: {
		maxWidth: '450px',
	},
	boxShadow:
		'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
	...theme.applyStyles('dark', {
		boxShadow:
			'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
	}),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
	minHeight: '100%',
	padding: theme.spacing(2),
	[theme.breakpoints.up('sm')]: {
		padding: theme.spacing(4),
	},
	'&::before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		zIndex: -1,
		inset: 0,
		backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
		backgroundRepeat: 'no-repeat',
		...theme.applyStyles('dark', {
			backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
		}),
	},
}));

export const SignIn = () => {
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

	const navigate = useNavigate();
	const { currentUser, isUserBlocked } = useAuth();
	const { login, loading, error } = useLogin({ isRegister: false });

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (emailError || passwordError) return;
		const data = new FormData(event.currentTarget);

		await login({
			email: data.get('email') as string,
			password: data.get('password') as string,
		});
	};

	const validateInputs = () => {
		const email = document.getElementById('email') as HTMLInputElement;
		const password = document.getElementById('password') as HTMLInputElement;

		let isValid = true;

		if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
			setEmailError(true);
			setEmailErrorMessage('Please enter a valid email address.');
			isValid = false;
		} else {
			setEmailError(false);
			setEmailErrorMessage('');
		}

		if (!password.value || password.value.length < 6) {
			setPasswordError(true);
			setPasswordErrorMessage('Password must be at least 6 characters long.');
			isValid = false;
		} else {
			setPasswordError(false);
			setPasswordErrorMessage('');
		}

		return isValid;
	};

	useEffect(() => {
		if (error) {
			setEmailError(true);
			setPasswordError(true);
		}
	}, [error]);

	useEffect(() => {
		if (!isUserBlocked && currentUser) {
			navigate(ROUTES.home);
		}
	}, [currentUser, isUserBlocked, navigate]);

	return (
		<Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
			{error && (
				<Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={Boolean(error)}>
					<Alert severity='error' variant='filled' sx={{ width: '100%' }}>
						{error}
					</Alert>
				</Snackbar>
			)}
			{isUserBlocked && (
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					open={Boolean(isUserBlocked)}
				>
					<Alert severity='error' variant='filled' sx={{ width: '100%' }}>
						User is Blocked
					</Alert>
				</Snackbar>
			)}
			<CssBaseline enableColorScheme />
			<SignInContainer direction='column' justifyContent='space-between'>
				<Card variant='outlined'>
					<Typography
						component='h1'
						variant='h4'
						sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
					>
						Sign in
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							gap: 2,
						}}
					>
						<FormControl>
							<FormLabel htmlFor='email'>Email</FormLabel>
							<TextField
								error={emailError}
								helperText={emailErrorMessage}
								id='email'
								type='email'
								name='email'
								placeholder='your@email.com'
								autoComplete='email'
								autoFocus
								required
								fullWidth
								variant='outlined'
								color={emailError ? 'error' : 'primary'}
								sx={{ ariaLabel: 'email' }}
							/>
						</FormControl>
						<FormControl>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<FormLabel htmlFor='password'>Password</FormLabel>
							</Box>
							<TextField
								error={passwordError}
								helperText={passwordErrorMessage}
								name='password'
								placeholder='••••••'
								type='password'
								id='password'
								autoComplete='current-password'
								autoFocus
								required
								fullWidth
								variant='outlined'
								color={passwordError ? 'error' : 'primary'}
							/>
						</FormControl>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							onClick={validateInputs}
							disabled={loading}
						>
							Sign in
						</Button>
						<Typography sx={{ textAlign: 'center' }}>
							Don&apos;t have an account?{' '}
							<span>
								<RouterLink to={ROUTES.signUp}>
									<Link component='span' variant='body2' sx={{ alignSelf: 'center' }}>
										Sign up
									</Link>
								</RouterLink>
							</span>
						</Typography>
					</Box>
				</Card>
			</SignInContainer>
		</Box>
	);
};
