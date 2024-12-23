import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskManager from './TaskManager';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await axios.get('http://localhost:5000/projects');
            setProjects(response.data);
        };

        const fetchUsers = async () => {
            const response = await axios.get('http://localhost:5000/users');
            setUsers(response.data);
        };

        fetchProjects();
        fetchUsers();
    }, []);

    const assignProject = async (projectId) => {
        await axios.post(`http://localhost:5000/projects/${projectId}/assign`, { userId: selectedUserId });
        alert('Project assigned successfully!');
    };

    return (
        <div>
            <h1>Projects</h1>
            <select onChange={(e) => setSelectedUserId(e.target.value)}>
                <option value="">Select a candidate</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                ))}
            </select>
            <ul>
                {projects.map(project => (
                    <li key={project._id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <button onClick={() => assignProject(project._id)}>Assign to Candidate</button>
                        <TaskManager projectId={project._id} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
