const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// User Authentication
app.post('/api/signup', async (req, res) => {
    const { name, password, role, email } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO Users (name, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, hashedPassword, role, email]
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.rows[0].user_id, role: user.rows[0].role }, 'yash1234', { expiresIn: '1h' });

    res.json({ token, role: user.rows[0].role, id: user.rows[0].user_id });
});

// Courses Management
app.get('/api/courses/faculty/:facultyId', async (req, res) => {
    const facultyId = req.params.facultyId;
    try {
        const result = await pool.query(
            `SELECT c.course_id, c.course_name, 
                    ARRAY_AGG(u.user_id) AS student_ids, 
                    ARRAY_AGG(u.name) AS student_names
            FROM FacultyCourses fc
            JOIN Courses c ON fc.course_id = c.course_id
            LEFT JOIN StudentCourses sc ON c.course_id = sc.course_id
            LEFT JOIN Users u ON sc.student_id = u.user_id
            WHERE fc.faculty_id = $1
            GROUP BY c.course_id, c.course_name`,
            [facultyId]
        );

        const formattedCourses = result.rows.map(course => ({
            id: course.course_id,
            name: course.course_name,
            students: course.student_ids
                .map((id, index) => ({
                    id: id,
                    name: course.student_names[index] || ""
                }))
                .filter(student => student.id !== null)
        }));

        res.json(formattedCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/courses', async (req, res) => {
    const { courseName } = req.body;
    try {
        const newCourse = await pool.query(
            `INSERT INTO Courses (course_name) VALUES ($1) RETURNING course_id, course_name`,
            [courseName]
        );
        res.status(201).json(newCourse.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/courses/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    try {
        await pool.query(`DELETE FROM Courses WHERE course_id = $1`, [courseId]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/courses/:courseId/students', async (req, res) => {
    const courseId = req.params.courseId;
    const { studentId } = req.body;
    try {
        await pool.query(`INSERT INTO StudentCourses (student_id, course_id) VALUES ($1, $2)`, [studentId, courseId]);
        res.status(201).json({ message: 'Student added to course successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/courses/:courseId/students/:studentId', async (req, res) => {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    try {
        await pool.query(`DELETE FROM StudentCourses WHERE student_id = $1 AND course_id = $2`, [studentId, courseId]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/faculty/courses', async (req, res) => {
    const { facultyId, courseId } = req.body;
    try {
        await pool.query(`INSERT INTO FacultyCourses (faculty_id, course_id) VALUES ($1, $2)`, [facultyId, courseId]);
        res.status(201).json({ message: 'Course assigned to faculty successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/faculty/courses', async (req, res) => {
    const { facultyId, courseId } = req.body;
    try {
        await pool.query(`DELETE FROM FacultyCourses WHERE faculty_id = $1 AND course_id = $2`, [facultyId, courseId]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
