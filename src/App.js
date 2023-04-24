// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import {Provider} from "react-redux";
import ThemeProvider from "./theme";
import ScrollToTop from "./components/scroll-to-top";
import {StyledChart} from "./components/chart";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import LoadingScreen from "./pages/LoadingScreen";
import store from "./store";


const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        async function checkToken() {
            try {
                const { token, userId, userName } = await ipcRenderer.invoke('getCredentials');

                if (token) {
                    // Validate the JWT token here (e.g., by calling an API endpoint)
                    const isValid = true; // Replace this with the actual validation result

                    if (isValid) {
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Error retrieving JWT token:', error);
            } finally {
                setIsLoading(false);
            }
        }
        checkToken();
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Provider store={store}>
            <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router>
                    <Routes>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </Provider>
    );
};

export default App;
