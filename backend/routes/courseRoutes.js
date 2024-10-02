const express = require('express');
const {
    getCoursesByFaculty,
    createCourse,
    deleteCourse,
    addStudentToCourse,
    deleteStudentFromCourse,
    assignCourseToFaculty, // Add this line
    deassignCourseFromFaculty
} = require('../controllers/courseController');

const router = express.Router();

router.get('/courses/:facultyId', getCoursesByFaculty);
router.post('/courses', createCourse);
// router.delete('/courses/:courseId', deleteCourse);
router.post('/courses/:courseId/students', addStudentToCourse);
router.delete('/courses/:courseId/students/:studentId', deleteStudentFromCourse);
router.post('/courses/assign', assignCourseToFaculty); // Add this line for course assignment
router.delete('/courses/deassign', deassignCourseFromFaculty);

module.exports = router;