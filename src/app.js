const express = require('express');
const app = express();
const path = require('path');
const proutes = require('./Router/information');
const bodyParser = require('body-parser');
const register = require('./models/register'); // Assuming this is your User model
// const pdfroutes = require('./Router/convert');
// const puppeteer = require('puppeteer');
require('./db/conn');

const port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
console.log(path.join(__dirname, '..', 'src', 'public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/home', (req, res) => {
    res.status(201).render('index'); // Render the combined form file
});

app.get('/login', (req, res) => {
    res.status(201).render('2signup'); // Render the combined form file
});

app.post('/signup', async (req, res) => {
    try {
        const newUser = new register({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            // Include other required fields
        });
        const savedUser = await newUser.save();
        res.status(201).redirect('/login'); // Redirect to login page after signup
    } catch (error) {
        console.log(error);
        return res.render('2signup', { error: 'Invalid username or password' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userData = await register.findOne({ username: username });

        if (!userData || userData.password !== password || username === " " || password === "" || !username || !password) {
            return res.render('2signup', { error: 'Invalid username or password' });
        } else {
            res.status(200).redirect('/home');
        }
    } catch (error) {
        console.log(error);
        // res.status(500).send("Error logging in");
        // alert('Invalid Login Credentials');
        return res.render('2signup', { error: 'Invalid username or password' });
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(proutes);
// app.use(express.static(path.join(__dirname, 'views')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Register the router
// app.use('/pdf', pdfroutes);
// app.use('/generate-pdf', pdfroutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
