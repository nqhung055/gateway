// Sidebar Routers
export const menus = {
	'message.general': [
		{
			action: 'zmdi-view-dashboard',
			title: 'message.dashboard',
			active: true,
			label: 'New',
			items: [
				{ title: 'message.device', path: '/dashboard/device', exact: true,label: 'Old' }
			]
		}
	]
}
