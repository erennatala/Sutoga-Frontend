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
    title: 'help',
    path: '/help',
    icon: alternativeIcon('material-symbols:live-help-outline')
  }
];

export default navConfig;

// {
//     title: 'register',
//     path: '/register',
//     icon: alternativeIcon('material-symbols:live-help-outline')
//   },