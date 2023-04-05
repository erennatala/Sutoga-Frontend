// routes
import { Provider } from 'react-redux';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import store from './store'; // your Redux store
// ----------------------------------------------------------------------

export default function App() {
  return (
      <Provider store={store}>
        <ThemeProvider>
            <ScrollToTop />
            <StyledChart />
            <Router />
        </ThemeProvider>
    </Provider>
  );
}
