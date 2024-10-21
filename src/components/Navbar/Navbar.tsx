import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { AppBar, Button, Divider, Skeleton } from '@mui/material';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../utils';
import Typography from '@mui/material/Typography';

export const Navbar = () => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const { currentUser, userStore, isUserAdmin, isLoading, logout } = useAuth();

	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
			<Divider />
			<MenuItem
				onClick={async () => {
					await logout();
					handleMenuClose();
				}}
			>
				<Typography color='error'>Log out</Typography>
			</MenuItem>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1, marginBottom: '2rem' }}>
			<AppBar position='static'>
				<Toolbar>
					<RouterLink to={ROUTES.home}>
						<Button
							component='span'
							variant='outlined'
							sx={{ alignSelf: 'center', color: 'white' }}
						>
							Forms App
						</Button>
					</RouterLink>

					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { md: 'flex' } }}>
						{isLoading ? (
							<Skeleton variant='rectangular' width={300} height={30} />
						) : currentUser ? (
							<>
								{isUserAdmin && (
									<RouterLink to={ROUTES.adminDashboard}>
										<Button
											component='span'
											variant='contained'
											color='secondary'
											sx={{ height: '48px', marginRight: '1.5rem' }}
										>
											Admin Dashboard
										</Button>
									</RouterLink>
								)}
								<Typography sx={{ margin: 'auto' }}>{userStore?.username}</Typography>
								<IconButton
									size='large'
									edge='end'
									aria-label='account of current user'
									aria-controls={menuId}
									aria-haspopup='true'
									onClick={handleProfileMenuOpen}
									color='inherit'
								>
									<AccountCircle />
								</IconButton>
							</>
						) : (
							<>
								<RouterLink to={ROUTES.signIn}>
									<Button
										component='span'
										variant='contained'
										sx={{ color: 'white', marginRight: '1rem' }}
									>
										Sign In
									</Button>
								</RouterLink>
								<RouterLink to={ROUTES.signUp}>
									<Button component='span' variant='contained' sx={{ color: 'white' }}>
										Register
									</Button>
								</RouterLink>
							</>
						)}
					</Box>
				</Toolbar>
			</AppBar>
			{renderMenu}
		</Box>
	);
};
