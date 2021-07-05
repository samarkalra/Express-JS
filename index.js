const Joi = require('joi'); //returns a class
const express = require('express'); //returns a function
const app = express();

app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
];

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(course => course.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('The course with given ID was not found.');

    res.send(course);
});

app.post('/api/courses', (req, res) => {
    // input validation using joi
    const { error } = validateCourse(req.body); //object destructuring
    if (error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);

    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given ID was not found.');

    // Validate
    // If invalid, return 400
    const { error } = validateCourse(req.body); //object destructuring
    if (error) return res.status(400).send(error.details[0].message);

    // Update course
    course.name = req.body.name;

    // Return the updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(course => course.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with given ID was not found.');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course);
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

//Environment Variable
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});