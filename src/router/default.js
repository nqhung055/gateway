import Full from 'Container/Full'

// dashboard components
const Device = () => import('Views/dashboard/Device');

export default {
   path: '/',
   component: Full,
   redirect: '/dashboard/device',
   children: [
      {
        path: '/dashboard/device',
        component: Device,
        meta: {
          requiresAuth: true,
          title: 'message.device',
          breadcrumb: null
        }
      }
    ]
}
