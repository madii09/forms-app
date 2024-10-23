export const ROUTES = {
	home: '/',
	signIn: '/sign-in',
	signUp: '/sign-up',
	adminDashboard: '/admin-dashboard',
	createTemplate: '/create-template',
	editTemplate: {
		route: '/edit-template/:id',
		link: '/edit-template/',
	},
	templateInfo: {
		route: '/template-info/:id',
		link: '/template-info/',
	},
	requests: {
		route: '/requests',
		request: {
			route: '/requests/request/:id',
			link: '/requests/request/',
		},
	},
} as const;
