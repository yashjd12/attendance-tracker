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

        // Directly store the plain password without hashing
        const newUser = await pool.query(
            'INSERT INTO Users (name, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, password, role, email]
        );

        res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (password !== user.rows[0].password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user.rows[0].user_id, role: user.rows[0].role },
            'yash1234',  // Secret key
            { expiresIn: '1h' } 
        );

        res.json({ token, role: user.rows[0].role, id: user.rows[0].user_id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
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


//Get Faculty Courses
app.get('/api/facultyCourses', async (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
  
    const query = `
      SELECT c.course_id AS value, c.course_name AS label
      FROM FacultyCourses fc
      JOIN Courses c ON fc.course_id = c.course_id
      WHERE fc.faculty_id = $1
    `;
  
    try {
      // Execute the query
      const result = await pool.query(query, [user_id]);
  
      // Return the courses in the format of courseOptions
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching faculty courses:', err);
      res.status(500).json({ error: 'Server error' });
    }
});



// Get Attendance
app.get('/api/attendance', async (req, res) => {
    const { course_id, attendance_date } = req.query;
  
    if (!course_id || !attendance_date) {
      return res.status(400).json({ error: 'course_id and attendance_date are required' });
    }
  
    const query = `
      SELECT u.user_id AS id, u.name AS name, 
             COALESCE(a.is_present, FALSE) AS is_present
      FROM Users u
      JOIN StudentCourses sc ON u.user_id = sc.student_id
      LEFT JOIN Attendance a 
        ON u.user_id = a.student_id 
        AND a.course_id = $1
        AND a.attendance_date = $2
      WHERE u.role = 'student' 
        AND sc.course_id = $1;
    `;
  
    try {
      // Execute the query
      const result = await pool.query(query, [course_id, attendance_date]);
  
      // Send the rows back to the client
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
 
  
// Save Attendance
app.post('/api/attendance', async (req, res) => {
    const { course_id, attendance_date, attendance_data } = req.body;
  
    if (!course_id || !attendance_date || !attendance_data) {
      return res.status(400).json({ error: 'course_id, attendance_date, and attendance_data are required' });
    }
  
    const deleteQuery = `
      DELETE FROM Attendance 
      WHERE course_id = $1 AND attendance_date = $2;
    `;
  
    const insertQuery = `
      INSERT INTO Attendance (student_id, course_id, attendance_date, is_present)
      VALUES ($1, $2, $3, $4);
    `;
  
    try {
      // Start a transaction
      await pool.query('BEGIN');
  
      // Delete existing attendance records for the course and date
      await pool.query(deleteQuery, [course_id, attendance_date]);
  
      // Insert the new attendance records
      for (const student of attendance_data) {
        await pool.query(insertQuery, [student.id, course_id, attendance_date, student.is_present]);
      }
  
      // Commit the transaction
      await pool.query('COMMIT');
  
      res.status(201).json({ message: 'Attendance saved successfully' });
    } catch (err) {
      console.error('Error saving attendance:', err);
      await pool.query('ROLLBACK'); // Roll back the transaction in case of error
      res.status(500).json({ error: 'Server error' });
    }
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
