import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Auth.css";
import {jwtDecode} from "jwt-decode";

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e, type) => {
        if (type === 'username') setUsername(e.target.value);
        if (type === 'password') setPassword(e.target.value);
        if (type === 'repeatPassword') setRepeatPassword(e.target.value);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)(?=.*[A-Z]).{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!username || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (!isLogin && (!validatePassword(password) || password !== repeatPassword)) {
            setErrorMessage('Invalid password. It must be at least 6 characters long, contain at least one uppercase letter, and include a number. Passwords must match.');
            return;
        }

        const url = `http://127.0.0.1:5000/${isLogin ? 'login' : 'register'}`;
        try {
            const response = await axios.post(url, { username, password });
            if (isLogin) {
                const token = response.data.access_token;
                localStorage.setItem('token', token);
                const decodedToken = jwtDecode(token);
                navigate(decodedToken.role === 'manager' ? '/manager-dashboard' : '/dashboard');
            } else {
                setIsLogin(true);
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setErrorMessage(message);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">{isLogin ? 'Login' : 'Registration'}</h2>
            {errorMessage && <p className="auth-error">{errorMessage}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleInputChange(e, 'username')}
                />
                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handleInputChange(e, 'password')}
                />
                {!isLogin && (
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) => handleInputChange(e, 'repeatPassword')}
                    />
                )}
                <button className="auth-button" type="submit">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <button className="switch-button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need to register?' : 'Already registered?'}
            </button>
        </div>
    );
};

export default Auth;
