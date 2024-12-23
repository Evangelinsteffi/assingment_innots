import React, { useState } from 'react';
import axios from 'axios';

const TaskManager = ({ projectId }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [tasks, setTasks] = useState([]);

    const addTask = async () => {
        const response = await axios.post(`http://localhost:5000/projects/${projectId}/tasks`, { title: taskTitle });
        setTasks(response.data.tasks);
        setTaskTitle('');
    };

    const toggleTaskCompletion = async (taskId) => {
        const response = await axios.patch(`http://localhost:5000/projects/${projectId}/tasks/${taskId}`, { completed: true });
        setTasks(response.data.tasks);
    };

    return (
        <div>
            <h2>Task Manager</h2>
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New Task" />
            <button onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task._id}>
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
                        {!task.completed && <button onClick={() => toggleTaskCompletion(task._id)}>Complete</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
