const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/projectDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Models
const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tasks: [{ title: String, completed: Boolean }]
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    assignedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

const Project = mongoose.model('Project', ProjectSchema);
const User = mongoose.model('User', UserSchema);

// API Endpoints

// Get all projects
app.get('/projects', async (req, res) => {
    const projects = await Project.find().populate('candidates');
    res.status(200).send(projects);
});

// Create a new project
app.post('/projects', async (req, res) => {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send(project);
});

// Assign a candidate to a project
app.post('/projects/:id/assign', async (req, res) => {
    const project = await Project.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (project && user) {
        project.candidates.push(user._id);
        user.assignedProjects.push(project._id);
        await project.save();
        await user.save();
        res.status(200).send(project);
    } else {
        res.status(404).send('Project or User not found');
    }
});

// Get all users
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add task creation endpoint
app.post('/projects/:id/tasks', async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project) {
        project.tasks.push({ title: req.body.title, completed: false });
        await project.save();
        res.status(201).send(project);
    } else {
        res.status(404).send('Project not found');
    }
});

// Update task completion status
app.patch('/projects/:id/tasks/:taskId', async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (project) {
        const task = project.tasks.id(req.params.taskId);
        if (task) {
            task.completed = req.body.completed;
            await project.save();
            res.status(200).send(project);
        } else {
            res.status(404).send('Task not found');
        }
    } else {
        res.status(404).send('Project not found');
    }
});

