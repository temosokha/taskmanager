import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const WorkerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({ id: '', title: '', description: '', due_date: '', priority: '', status: '' });
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/tasks', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setTasks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
            });
    }, [token]);

    const handleFilterChange = (e, field) => {
        setFilters({ ...filters, [field]: e.target.value });
    };

    const filteredTasks = tasks.filter(task =>
        Object.keys(filters).every(key =>
            task[key].toString().toLowerCase().includes(filters[key].toLowerCase()))
    );

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">My Tasks</h2>
            <button onClick={handleLogout} className="dashboard-logout">Logout</button>
            <table className="dashboard-table">
                <thead>
                <tr>
                    <th>
                        <input
                            placeholder="Filter ID"
                            onChange={(e) => handleFilterChange(e, 'id')}
                        />
                    </th>
                    <th>
                        <input
                            placeholder="Filter Title"
                            onChange={(e) => handleFilterChange(e, 'title')}
                        />
                    </th>
                    <th>
                        <input
                            placeholder="Filter Description"
                            onChange={(e) => handleFilterChange(e, 'description')}
                        />
                    </th>
                    <th>
                        <input
                            placeholder="Filter Due Date"
                            onChange={(e) => handleFilterChange(e, 'due_date')}
                        />
                    </th>
                    <th>
                        <input
                            placeholder="Filter Priority"
                            onChange={(e) => handleFilterChange(e, 'priority')}
                        />
                    </th>
                    <th>
                        <input
                            placeholder="Filter Status"
                            onChange={(e) => handleFilterChange(e, 'status')}
                        />
                    </th>
                </tr>
                </thead>
                <tbody>
                {filteredTasks.map((task) => (
                    <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.due_date}</td>
                        <td>{task.priority}</td>
                        <td>{task.status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WorkerDashboard;
