// component
import SvgColor from '../../../components/svg-color';
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const alternativeIcon = (name) => <Iconify icon={name} />

const navConfig = [
  {
    title: 'home',
    path: '/home',
    icon: alternativeIcon("material-symbols:home"),
  }, {
    title: 'messages',
    path: '/messages',
    icon: alternativeIcon("material-symbols:chat-bubble-outline"),
  }, {
    title: 'games',
    path: '/games',
    icon: alternativeIcon('ph:game-controller-fill'),
  },{
  title: 'profile',
  path: '/profile',
  icon: alternativeIcon('gg:profile'),
  }, {
    title: 'logout',
    path: '/login',
    icon: alternativeIcon('material-symbols:logout'),
  },
  {
    title: 'register',
    path: '/register',
    icon: alternativeIcon('material-symbols:live-help-outline')
  },
  {
    title: 'help',
    path: '/help',
    icon: alternativeIcon('material-symbols:live-help-outline')
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
