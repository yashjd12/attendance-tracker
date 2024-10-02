const pool = require('../config/db');

class FacultyCourse {
    static async assignCourseToFaculty(facultyId, courseId) {
        await pool.query(
            `INSERT INTO FacultyCourses (faculty_id, course_id) VALUES ($1, $2)`,
            [facultyId, courseId]
        );
    }

    // New method to deassign a course from a faculty member
    static async deassignCourseFromFaculty(facultyId, courseId) {
        await pool.query(
            `DELETE FROM FacultyCourses WHERE faculty_id = $1 AND course_id = $2`,
            [facultyId, courseId]
        );
    }
}

module.exports = FacultyCourse;