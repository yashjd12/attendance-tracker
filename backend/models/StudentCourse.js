const pool = require('../config/db');

class StudentCourse {
    static async addStudentToCourse(studentId, courseId) {
        await pool.query(
            `INSERT INTO StudentCourses (student_id, course_id) VALUES ($1, $2)`,
            [studentId, courseId]
        );
    }

    static async deleteStudentFromCourse(studentId, courseId) {
        await pool.query(
            `DELETE FROM StudentCourses WHERE student_id = $1 AND course_id = $2`,
            [studentId, courseId]
        );
    }
}

module.exports = StudentCourse;