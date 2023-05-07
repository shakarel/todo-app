/* IMPORTING DEPENDENCIES */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const requireAuth = require('./middleware/requireAuth');



/* IMPORTANT CONFIGURATIONS */
const app = express();  // creating a new express app
app.use(express.json());
app.use(cors());
dotenv.config();



/* MONGOOSE SETUP */
const PORT = process.env.DB_PORT;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}, Connected To DB...`));
}).catch(error => console.log(`${error} Did Not Connect`));

const Todo = require('./models/Todo');  // accessing the task template
const User = require('./models/User');  // accessing the user template



/* CREATE JWT FUNCTION */
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '1d' });
}



/* CREATING ROUTES, HANDLING HTTP REQUESTS */
app.get('/todos', requireAuth, async (req, res) => {
    try {
        const todos = await Todo.find({ user_id: req.user._id });
        res.json(todos);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/todo/new', requireAuth, (req, res) => {
    try {
        const todo = new Todo({ text: req.body.text, user_id: req.user._id});  // creating a new 
        todo.save();
        res.json(todo);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/todo/delete/:id', requireAuth, async (req, res) => {
    try {
        const result = await Todo.findByIdAndDelete(req.params.id);
        res.json(result);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/todo/complete/:id', requireAuth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        todo.complete = !todo.complete;

        todo.save();
        res.json(todo);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/todo/edit/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const todo = await Todo.findById(id);
        todo.text = text;
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);

        const token = createToken(user._id);  // create a JWT
        res.status(200).json({ user, token });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.signup(name, email, password);

        const token = createToken(user._id);  // create a JWT
        res.status(200).json({ user, token });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
