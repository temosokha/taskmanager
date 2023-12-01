import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Auth from "./pages/Authorization/Auth";
import WorkerDashboard from "./pages/Dashboard/WorkerDashboard";
import ManagerDashboard from "./pages/Dashboard/ManagerDashboard";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <div className="app">
            <Router>
                <Header />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Auth />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <WorkerDashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/manager-dashboard"
                            element={
                                <PrivateRoute>
                                    <ManagerDashboard />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
                    <Footer />
            </Router>
        </div>
);
}

export default App;
