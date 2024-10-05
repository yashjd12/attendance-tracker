const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./config/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// User Authentication
app.post("/api/signup", async (req, res) => {
  const { name, password, role, email } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM Users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Directly store the plain password without hashing
    const newUser = await pool.query(
      "INSERT INTO Users (name, password, role, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, password, role, email]
    );

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password !== user.rows[0].password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.rows[0].user_id, role: user.rows[0].role },
      "yash1234", // Secret key
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.rows[0].role, id: user.rows[0].user_id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get Student Profile
app.get('/api/profile/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Query to fetch user profile details
      const query = `
        SELECT user_id, name, email, created_at
        FROM Users
        WHERE user_id = $1
      `;
  
      const result = await pool.query(query, [userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = result.rows[0];
  
      // Extract year from created_at for enrollmentYear
      const enrollmentYear = new Date(user.created_at).getFullYear();
  
      // Format response with profile details
      const profile = {
        id: user.user_id,
        name: user.name,
        email: user.email,
        enrollmentYear: enrollmentYear.toString(),
      };
  
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Courses Management
app.get("/api/courses/faculty/:facultyId", async (req, res) => {
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

    const formattedCourses = result.rows.map((course) => ({
      id: course.course_id,
      name: course.course_name,
      students: course.student_ids
        .map((id, index) => ({
          id: id,
          name: course.student_names[index] || "",
        }))
        .filter((student) => student.id !== null),
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/courses", async (req, res) => {
  const { courseName } = req.body;
  try {
    const newCourse = await pool.query(
      `INSERT INTO Courses (course_name) VALUES ($1) RETURNING course_id, course_name`,
      [courseName]
    );
    res.status(201).json(newCourse.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/courses/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    await pool.query(`DELETE FROM Courses WHERE course_id = $1`, [courseId]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/courses/:courseId/students", async (req, res) => {
  const courseId = req.params.courseId;
  const { studentId } = req.body;
  try {
    await pool.query(
      `INSERT INTO StudentCourses (student_id, course_id) VALUES ($1, $2)`,
      [studentId, courseId]
    );
    res.status(201).json({ message: "Student added to course successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/courses/:courseId/students/:studentId", async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.params.studentId;
  try {
    await pool.query(
      `DELETE FROM StudentCourses WHERE student_id = $1 AND course_id = $2`,
      [studentId, courseId]
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/faculty/courses", async (req, res) => {
  const { facultyId, courseId } = req.body;
  try {
    await pool.query(
      `INSERT INTO FacultyCourses (faculty_id, course_id) VALUES ($1, $2)`,
      [facultyId, courseId]
    );
    res
      .status(201)
      .json({ message: "Course assigned to faculty successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/faculty/courses", async (req, res) => {
  const { facultyId, courseId } = req.body;
  try {
    await pool.query(
      `DELETE FROM FacultyCourses WHERE faculty_id = $1 AND course_id = $2`,
      [facultyId, courseId]
    );
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Get Faculty Courses
app.get("/api/facultyCourses", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
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
    console.error("Error fetching faculty courses:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Student Courses
app.get("/api/courses/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const query = `
        SELECT c.course_id, c.course_name
        FROM studentcourses sc
        JOIN courses c ON sc.course_id = c.course_id
        WHERE sc.student_id = $1
      `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).send("Server error");
  }
});

app.post("/api/student/attendance", async (req, res) => {
  const { userId, courseId, month, date } = req.body;

  const monthDate = `${month}-01`;

  try {
    // Monthly Attendance Query
    const monthlyQuery = `
        SELECT 
            COUNT(*) AS totalattendance,
            SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) AS presentcount
        FROM Attendance a
        WHERE a.student_id = $1 
          AND a.course_id = $2
          AND a.attendance_date >= date_trunc('month', $3::date)
          AND a.attendance_date < date_trunc('month', $3::date) + INTERVAL '1 month'
      `;
    const monthlyValues = [userId, courseId, monthDate];
    const monthlyResult = await pool.query(monthlyQuery, monthlyValues);
    const { totalattendance, presentcount } = monthlyResult.rows[0] || {};
    const monthlyAttendance =
      totalattendance > 0 ? (presentcount / totalattendance) * 100 : 0;

    // Overall Attendance Query
    const overallQuery = `
        SELECT 
            COUNT(*) AS totalattendance,
            SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) AS presentcount
        FROM Attendance a
        WHERE a.student_id = $1 
          AND a.course_id = $2
          AND a.attendance_date >= '2024-01-01' 
          AND a.attendance_date <= CURRENT_DATE
      `;
    const overallValues = [userId, courseId];
    const overallResult = await pool.query(overallQuery, overallValues);
    const overallAttendance = overallResult.rows[0];

    const overallAttendancePercentage =
      overallAttendance.totalattendance > 0
        ? (overallAttendance.presentcount / overallAttendance.totalattendance) *
          100
        : 0;

    // Attendance Status for Selected Date Query
    const statusQuery = `
        SELECT is_present 
        FROM Attendance 
        WHERE student_id = $1 
          AND course_id = $2 
          AND attendance_date = $3
      `;
    const statusValues = [userId, courseId, date];
    const statusResult = await pool.query(statusQuery, statusValues);

    let attendanceStatus = "Not marked"; // Default value
    if (statusResult.rows.length > 0) {
      attendanceStatus = statusResult.rows[0].is_present ? "Present" : "Absent";
    }

    // Sending the response back
    res.json({
      monthlyAttendance,
      overallAttendance: overallAttendancePercentage,
      attendanceStatus,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).send("Server error");
  }
});

// Get Attendance
app.get("/api/attendance", async (req, res) => {
  const { course_id, attendance_date } = req.query;

  if (!course_id || !attendance_date) {
    return res
      .status(400)
      .json({ error: "course_id and attendance_date are required" });
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
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Save Attendance
app.post("/api/attendance", async (req, res) => {
  const { course_id, attendance_date, attendance_data } = req.body;

  if (!course_id || !attendance_date || !attendance_data) {
    return res
      .status(400)
      .json({
        error: "course_id, attendance_date, and attendance_data are required",
      });
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
    await pool.query("BEGIN");

    // Delete existing attendance records for the course and date
    await pool.query(deleteQuery, [course_id, attendance_date]);

    // Insert the new attendance records
    for (const student of attendance_data) {
      await pool.query(insertQuery, [
        student.id,
        course_id,
        attendance_date,
        student.is_present,
      ]);
    }

    // Commit the transaction
    await pool.query("COMMIT");

    res.status(201).json({ message: "Attendance saved successfully" });
  } catch (err) {
    console.error("Error saving attendance:", err);
    await pool.query("ROLLBACK"); // Roll back the transaction in case of error
    res.status(500).json({ error: "Server error" });
  }
});

// Get students attendance percentage
app.get("/api/students", async (req, res) => {
  const { course_id, search_name } = req.query;

  try {
    // 1. Get Students and Their Course Info
    let studentsQuery = `
            SELECT u.user_id AS id, u.name AS name, sc.course_id AS course
            FROM Users u
            JOIN StudentCourses sc ON u.user_id = sc.student_id
            WHERE u.role = 'student'
        `;

    if (course_id) {
      studentsQuery += ` AND sc.course_id = $1`;
    }

    const studentsValues = course_id ? [course_id] : [];
    const studentsResult = await pool.query(studentsQuery, studentsValues);
    const students = studentsResult.rows;

    // 2. Calculate Monthly Attendance
    const monthlyAttendanceResults = []; // Initialize an empty array to store results

    for (const student of students) {
      const attendanceQuery = `
                SELECT 
                    COUNT(*) AS totalattendance,
                    SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) AS presentcount
                FROM Attendance a
                WHERE a.student_id = $1 
                  AND a.course_id = $2
                  AND a.attendance_date >= date_trunc('month', CURRENT_DATE)
                  AND a.attendance_date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
            `;

      const attendanceValues = [student.id, student.course];

      try {
        const attendanceResult = await pool.query(
          attendanceQuery,
          attendanceValues
        );

        // Use defaults in case of no attendance records
        const { totalattendance = 0, presentcount = 0 } =
          attendanceResult.rows[0] || {};

        const monthlyAttendance =
          totalattendance > 0 ? (presentcount / totalattendance) * 100 : 0;

        // Push the result to the array
        monthlyAttendanceResults.push({
          studentId: student.id,
          monthlyAttendance,
        });
      } catch (error) {
        console.error(
          `Error fetching attendance for student ID ${student.id}:`,
          error
        );
      }
    }

    // 3. Calculate Overall Attendance
    const overallAttendancePromises = students.map(async (student) => {
      const overallQuery = `
                SELECT 
                    COUNT(*) AS totalattendance,
                    SUM(CASE WHEN a.is_present = true THEN 1 ELSE 0 END) AS presentcount
                FROM Attendance a
                WHERE a.student_id = $1 
                  AND a.course_id = $2
                  AND a.attendance_date >= '2024-10-01' -- Start of the period
                  AND a.attendance_date <= CURRENT_DATE
            `;
      const overallValues = [student.id, student.course];
      const overallResult = await pool.query(overallQuery, overallValues);

      const { totalattendance, presentcount } = overallResult.rows[0];

      return {
        studentId: student.id,
        overallAttendance:
          totalattendance > 0 ? (presentcount / totalattendance) * 100 : 0,
      };
    });

    const overallAttendanceResults = await Promise.all(
      overallAttendancePromises
    );

    // 4. Count Leaves
    const leavesPromises = students.map(async (student) => {
      const leavesQuery = `
                SELECT 
                    COUNT(*) AS leavecount
                FROM Attendance a
                WHERE a.student_id = $1 
                  AND a.course_id = $2
                  AND a.is_present = false
                  AND a.attendance_date >= date_trunc('month', CURRENT_DATE)
                  AND a.attendance_date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
            `;
      const leavesValues = [student.id, student.course];
      const leavesResult = await pool.query(leavesQuery, leavesValues);
      const leaveCount =
        leavesResult.rows.length > 0 ? leavesResult.rows[0].leavecount : 0;

      return {
        studentId: student.id,
        leaves: leaveCount,
      };
    });

    const leavesResults = await Promise.all(leavesPromises);

    // Combine results into final structure
    const studentsData = students.map((student) => {
      const monthlyAttendance =
        monthlyAttendanceResults.find((a) => a.studentId === student.id)
          ?.monthlyAttendance || 0;
      const overallAttendance =
        overallAttendanceResults.find((a) => a.studentId === student.id)
          ?.overallAttendance || 0;
      const leavesCount =
        leavesResults.find((a) => a.studentId === student.id)?.leaves || 0;

      return {
        id: student.id,
        name: student.name,
        monthlyAttendance: parseFloat(monthlyAttendance.toFixed(2)), // Round to two decimal places
        overallAttendance: parseFloat(overallAttendance.toFixed(2)), // Round to two decimal places
        leaves: leavesCount,
        course: student.course,
      };
    });

    res.json(studentsData);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Send alert for low attendance
app.post("/api/sendAlert", async (req, res) => {
  const { studentId, courseId, monthlyAttendance, selectedMonth } = req.body;

  try {
    // First, fetch the course name using the courseId
    const courseQuery = `
            SELECT course_name FROM courses WHERE course_id = $1
        `;
    const courseResult = await pool.query(courseQuery, [courseId]);

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const courseName = courseResult.rows[0].course_name;
    const comment = `Attendance:${monthlyAttendance}, Month:${selectedMonth}, Course:${courseName}`;

    const notificationQuery = `
            INSERT INTO Notifications (student_id, course_id, notification_type, comment)
            VALUES ($1, $2, 'Alert', $3)
            RETURNING notification_id
        `;

    const values = [studentId, courseId, comment];
    const result = await pool.query(notificationQuery, values);

    res.status(201).json({ notificationId: result.rows[0].notification_id });
  } catch (error) {
    console.error("Error sending alert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get leave Requests
app.get("/api/leaves/:facultyId", async (req, res) => {
  const { facultyId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT l.leave_id, u.name AS student_name, c.course_name, 
               TO_CHAR(l.leave_start_date, 'YYYY-MM-DD') AS leave_start_date, 
               TO_CHAR(l.leave_end_date, 'YYYY-MM-DD') AS leave_end_date, 
               l.reason, l.status, l.comment
        FROM Leaves l
        JOIN Courses c ON l.course_id = c.course_id
        JOIN Users u ON l.student_id = u.user_id
        JOIN FacultyCourses fc ON fc.course_id = l.course_id
        WHERE fc.faculty_id = $1 AND l.status = 'Pending'
      `,
      [facultyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update leave status and add Notification
app.put("/api/leaves/:leaveId", async (req, res) => {
  const { leaveId } = req.params;
  let { status, comment } = req.body;

  // Capitalize the first letter of status
  status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  try {
    // Update the leave status
    await pool.query(
      `UPDATE Leaves SET status = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE leave_id = $3`,
      [status, comment, leaveId]
    );

    // Fetch student_id and course_id from Leaves table
    const result = await pool.query(
      `SELECT student_id, course_id, leave_start_date, leave_end_date FROM Leaves WHERE leave_id = $1`,
      [leaveId]
    );

    // Check if the leave exists
    if (result.rows.length === 0) {
      return res.status(404).send("Leave not found");
    }

    const leave = result.rows[0];

    const formattedStartDate = new Date(leave.leave_start_date)
      .toISOString()
      .split("T")[0];
    const formattedEndDate = new Date(leave.leave_end_date)
      .toISOString()
      .split("T")[0];

    // Create the notification
    const notificationComment = `Status:${status}, Date:${formattedStartDate} to ${formattedEndDate}, Comment:${comment}`;

    await pool.query(
      `INSERT INTO Notifications (student_id, course_id, notification_type, comment) VALUES ($1, $2, $3, $4)`,
      [leave.student_id, leave.course_id, "Leave", notificationComment]
    );

    res
      .status(200)
      .send("Leave status updated and notification created successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get notifications for student
app.get("/api/notifications/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Query to fetch notifications for the user
    const notificationQuery = `
        SELECT n.notification_id, n.notification_type, n.comment, c.course_name, n.created_at
        FROM Notifications n
        LEFT JOIN Courses c ON n.course_id = c.course_id
        WHERE n.student_id = $1
        ORDER BY n.created_at DESC
      `;

    const result = await pool.query(notificationQuery, [userId]);

    // Process the result to format it according to the required output
    const notifications = result.rows.map((row) => {
      if (row.notification_type === "Alert") {
        // Extract course, month, and attendance percentage from comment
        const regex =
          /Attendance:\s*(\d+)\s*,\s*Month:\s*([A-Za-z]+)\s*,\s*Course:\s*(.+)/;
        const match = row.comment.match(regex);

        return {
          id: row.notification_id,
          type: "Alert",
          course: match ? match[3] : "Unknown Course",
          month: match ? match[2] : "Unknown Month",
          attendancePercentage: match ? parseInt(match[1], 10) : 0,
          createdAt: row.created_at,
        };
      } else if (row.notification_type === "Leave") {
        // Extract leave status, date, and comment from comment
        const leaveRegex =
          /Status:\s*(\w+),\s*Date:\s*([\d\-]+)\s*to\s*([\d\-]+),\s*Comment:\s*(.*)/;
        const leaveMatch = row.comment.match(leaveRegex);

        return {
          id: row.notification_id,
          type: "Leave",
          leaveStatus: leaveMatch ? leaveMatch[1] : "Unknown Status",
          startDate: leaveMatch ? leaveMatch[2] : null,
          endDate: leaveMatch ? leaveMatch[3] : null,
          comment: leaveMatch ? leaveMatch[4] : "No Comment",
          createdAt: row.created_at,
        };
      }
    });

    // Send the formatted notifications as the response
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
