import React, { useState, useEffect } from 'react';
import {Provider, useDispatch} from "react-redux";
import ThemeProvider from "./theme";
import ScrollToTop from "./components/scroll-to-top";
import {StyledChart} from "./components/chart";
import LoadingScreen from "./pages/LoadingScreen";
import store from "./store";
import Router from './routes';
import { useSelector } from 'react-redux';
import { setAuthenticated, setToken, setUserName } from './actions/authActions';

const { ipcRenderer } = window.electron;

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        async function checkToken() {
            try {
                const { token, userId, userName } = await ipcRenderer.invoke('getCredentials');

                if (token) {
                    // Dispatch the setToken, setUserName, and setAuthenticated actions
                    dispatch(setToken(token));
                    dispatch(setUserName(userName));
                    dispatch(setAuthenticated(true));
                }
            } catch (error) {
                console.error('Error retrieving JWT token:', error);
            } finally {
                setIsLoading(false);
            }
        }
        checkToken();
    }, [dispatch]);



    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Provider store={store}>
            <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router isLoading={isLoading} isAuthenticated={isAuthenticated} />
            </ThemeProvider>
        </Provider>
    );
};

export default App;