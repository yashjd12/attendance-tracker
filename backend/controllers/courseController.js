const Course = require('../models/Courses');
const StudentCourse = require('../models/StudentCourse');
const FacultyCourse = require('../models/FacultyCourse');

exports.getCoursesByFaculty = async (req, res) => {
    const facultyId = req.params.facultyId;
    try {
        const courses = await Course.getCoursesByFaculty(facultyId);
        res.json(courses); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createCourse = async (req, res) => {
    const { courseName } = req.body;
    try {
        const newCourse = await Course.createCourse(courseName);
        res.status(201).json(newCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCourse = async (req, res) => {
    const courseId = req.params.courseId;
    try {
        await Course.deleteCourse(courseId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addStudentToCourse = async (req, res) => {
    const courseId = req.params.courseId;
    const { studentId } = req.body;
    try {
        await StudentCourse.addStudentToCourse(studentId, courseId);
        res.status(201).json({ message: 'Student added to course successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteStudentFromCourse = async (req, res) => {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    try {
        await StudentCourse.deleteStudentFromCourse(studentId, courseId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.assignCourseToFaculty = async (req, res) => {
    const { facultyId, courseId } = req.body;
    try {
        await FacultyCourse.assignCourseToFaculty(facultyId, courseId);
        res.status(201).json({ message: 'Course assigned to faculty successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deassignCourseFromFaculty = async (req, res) => {
    const { facultyId, courseId } = req.body;
    try {
        await FacultyCourse.deassignCourseFromFaculty(facultyId, courseId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
