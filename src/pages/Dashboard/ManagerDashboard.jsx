import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './Dashboard.css';

const ManagerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [workerUsers, setWorkerUsers] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 1,
        status: 'pending',
        assigned_to: ''
    });
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const tasksPerPage = 10;
    const token = localStorage.getItem('token');
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
        fetchWorkerUsers();
    }, [token]);

    const fetchTasks = () => {
        axios.get('http://127.0.0.1:5000/tasks/all', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => setTasks(response.data))
            .catch((error) => console.error('Error fetching tasks:', error));
    };

    const fetchWorkerUsers = () => {
        axios.get('http://127.0.0.1:5000/users/worker', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => setWorkerUsers(response.data))
            .catch((error) => console.error('Error fetching worker users:', error));
    };

    const handleInputChange = (e) => {
        if (e.target.name === 'assigned_to') {
            setNewTask({ ...newTask, assigned_to: e.target.value });
        } else {
            setNewTask({ ...newTask, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newTask.title || !newTask.description || !newTask.due_date || !newTask.assigned_to) {
            setError('All fields are required.');
            return;
        }

        setError('');

        axios.post('http://127.0.0.1:5000/tasks', newTask, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                setNewTask({
                    title: '',
                    description: '',
                    due_date: '',
                    priority: 1,
                    status: 'pending',
                    assigned_to: ''
                });
                fetchTasks();
            })
            .catch((error) => {
                setError(error.response?.data?.msg || 'Error creating task');
            });
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const handleUpdateTask = (editedTask) => {
        axios.put(`http://127.0.0.1:5000/tasks/${editedTask.id}`, editedTask, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                handleCancelEdit();
                fetchTasks();
            })
            .catch((error) => {
                console.error('Error updating task:', error);
            });
    };

    const handleDeleteTask = (taskId) => {
        axios.delete(`http://127.0.0.1:5000/tasks/${taskId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                fetchTasks();
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    const handleMarkCompleted = (taskId) => {
        axios.put(`http://127.0.0.1:5000/tasks/${taskId}/complete`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                fetchTasks();
            })
            .catch((error) => {
                console.error('Error marking task as completed:', error);
            });
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const offset = currentPage * tasksPerPage;
    const currentPageTasks = tasks.slice(offset, offset + tasksPerPage);
    const pageCount = Math.ceil(tasks.length / tasksPerPage);

    const handleLogout = () => {
        localStorage.removeItem('token');

        window.location.href = '/';
    };

    return (
        <div className="dashboard">
            <div className="task-form">
                <h2>Create New Task</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleInputChange} />
                    <textarea name="description" placeholder="Description" value={newTask.description} onChange={handleInputChange} />
                    <input type="date" name="due_date" value={newTask.due_date} onChange={handleInputChange} />
                    <select
                        name="assigned_to"
                        value={newTask.assigned_to}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Assigned To</option>
                        {workerUsers.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    <input type="number" name="priority" placeholder="Priority" value={newTask.priority} onChange={handleInputChange} />
                    <button type="submit">Create Task</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="dashboard-container">
                <h2>Manager Dashboard</h2>
                <table className="dashboard-table">
                    <thead>
                    <tr>
                        <th>Task ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPageTasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>
                                {editingTask && editingTask.id === task.id ? (
                                    <input
                                        type="text"
                                        name="title"
                                        value={editingTask.title}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    task.title
                                )}
                            </td>
                            <td>
                                {editingTask && editingTask.id === task.id ? (
                                    <textarea
                                        name="description"
                                        value={editingTask.description}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    task.description
                                )}
                            </td>
                            <td>
                                {editingTask && editingTask.id === task.id ? (
                                    <input
                                        type="date"
                                        name="due_date"
                                        value={editingTask.due_date}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                due_date: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    task.due_date
                                )}
                            </td>
                            <td>
                                {editingTask && editingTask.id === task.id ? (
                                    <input
                                        type="number"
                                        name="priority"
                                        value={editingTask.priority}
                                        onChange={(e) =>
                                            setEditingTask({
                                                ...editingTask,
                                                priority: parseInt(e.target.value),
                                            })
                                        }
                                    />
                                ) : (
                                    task.priority
                                )}
                            </td>
                            <td>{task.status}</td>
                            <td>
                                {task.status === 'completed' ? (
                                    'Completed'
                                ) : (
                                    editingTask && editingTask.id === task.id ? (
                                        <>
                                            <button onClick={() => handleUpdateTask(editingTask)}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditTask(task)}>Edit</button>
                                            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                                        </>
                                    )
                                )}
                                {task.status !== 'completed' && (
                                    <button onClick={() => handleMarkCompleted(task.id)}>Mark Completed</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />
            </div>
            <div className="logout-button">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default ManagerDashboard;
