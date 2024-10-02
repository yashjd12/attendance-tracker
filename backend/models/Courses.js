const pool = require('../config/db');

class Course {
    static async createCourse(courseName) {
        const result = await pool.query(
            `INSERT INTO Courses (course_name) VALUES ($1) RETURNING course_id, course_name`,
            [courseName]
        );
        return result.rows[0];
    }

    static async deleteCourse(courseId) {
        await pool.query(
            `DELETE FROM Courses WHERE course_id = $1`,
            [courseId]
        );
    }

    static async getCoursesByFaculty(facultyId){
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
    
            // Map the result rows to include a 'students' array
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
    
            return formattedCourses; 
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
    
}

module.exports = Course;
