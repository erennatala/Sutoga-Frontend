// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'home',
    path: '/home',
    icon: icon('ic_user'),
  }, {
    title: 'messages',
    path: '/messages',
    icon: icon('ic_user'),
  }, {
    title: 'games',
    path: '/games',
    icon: icon('ic_user'),
  },{
  title: 'profile',
  path: '/profile',
  icon: icon('ic_user'),
  }, {
    title: 'logout',
    path: '/login',
    icon: icon('ic_user'),
  }, {
    title: 'help',
    path: '/help',
    icon: icon('ic_user')
  },
  {
    title: 'dashboard',
    path: '/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
