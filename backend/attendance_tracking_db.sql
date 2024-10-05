CREATE SEQUENCE user_id_seq
    START WITH 2024001
    INCREMENT BY 1;


CREATE TABLE Users (
    user_id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,  -- Changed to INTEGER with a sequence
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('student', 'faculty')) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE StudentCourses (
    student_id INTEGER,  -- Change back to INTEGER
    course_id INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE FacultyCourses (
    faculty_course_id SERIAL PRIMARY KEY,
    faculty_id INTEGER NOT NULL,  -- Change back to INTEGER
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE(faculty_id, course_id)  -- Ensuring a faculty can be assigned to a course only once
);

CREATE TABLE Attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INTEGER,  -- Change back to INTEGER
    course_id INT,
    attendance_date DATE NOT NULL,
    is_present BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE Leaves (
    leave_id SERIAL PRIMARY KEY,
    student_id INTEGER, 
	course_id INTEGER,
    leave_start_date DATE NOT NULL,
    leave_end_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    student_id INTEGER,  -- Change back to INTEGER
    course_id INT,
    notification_type VARCHAR(10) CHECK (notification_type IN ('Alert', 'Leave')) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE SET NULL
);



drop table notifications;
drop table leaves;
drop table attendance;
drop table studentcourses;
drop table facultycourses;
drop table courses;
drop table users;



-- Insert Faculty
INSERT INTO Users (name, password, role, email) VALUES 
('Cristiano Ronaldo', 'password123', 'faculty', 'cristiano.ronaldo@gmail.com'),
('Lionel Messi', 'password123', 'faculty', 'lionel.messi@gmail.com');

-- Insert Students
INSERT INTO Users (name, password, role, email) VALUES 
('Hardik Pandya', 'password123', 'student', 'hardik.pandya@student.com'),
('Rohit Sharma', 'password123', 'student', 'rohit.sharma@student.com'),
('Virat Kohli', 'password123', 'student', 'virat.kohli@student.com'),
('Ishan Kishan', 'password123', 'student', 'ishan.kishan@student.com'),
('Rishabh Pant', 'password123', 'student', 'rishabh.pant@student.com');

INSERT INTO Courses (course_name) VALUES 
('Engineering Mechanics'),
('Mathematics'),
('Physics'),
('Computer Science');

INSERT INTO FacultyCourses (faculty_id, course_id) VALUES 
(2024001, 1), 
(2024001, 3),
(2024002, 2),
(2024002, 4); 

INSERT INTO StudentCourses (student_id, course_id) VALUES 
(2024003, 1), -- Hardik Pandya is enrolled in Engineering Mechanics
(2024004, 1), -- Rohit Sharma is enrolled in Engineering Mechanics
(2024005, 1), -- Virat Kohli is enrolled in Engineering Mechanics
(2024006, 2), -- Ishan Kishan is enrolled in Mathematics
(2024007, 2), -- Rishabh Pant is enrolled in Mathematics
(2024003, 3), -- Hardik Pandya is enrolled in Physics
(2024004, 4); -- Rohit Sharma is enrolled in Computer Science

-- Attendance for Engineering Mechanics on '2024-10-01'
INSERT INTO Attendance (student_id, course_id, attendance_date, is_present) VALUES 
(2024003, 1, '2024-10-01', true),  -- Hardik Pandya was present
(2024004, 1, '2024-10-01', false), -- Rohit Sharma was absent
(2024005, 1, '2024-10-01', true);  -- Virat Kohli was present

-- Attendance for Mathematics on '2024-10-01'
INSERT INTO Attendance (student_id, course_id, attendance_date, is_present) VALUES 
(2024006, 2, '2024-10-01', true),  -- Ishan Kishan was present
(2024007, 2, '2024-10-01', false); -- Rishabh Pant was absent

-- Attendance for Physics on '2024-10-02'
INSERT INTO Attendance (student_id, course_id, attendance_date, is_present) VALUES 
(2024003, 3, '2024-10-02', false); -- Hardik Pandya was absent


-- Attendance for Computer Science on '2024-10-02'
INSERT INTO Attendance (student_id, course_id, attendance_date, is_present) VALUES 
(2024004, 4, '2024-10-02', true); -- Rohit Sharma was present


INSERT INTO Leaves (student_id, course_id, leave_start_date, leave_end_date, reason, status, comment)
VALUES 
(2024003, 1, '2024-10-05', '2024-10-06', 'Medical Appointment', 'Pending', NULL);
INSERT INTO Leaves (student_id, course_id, leave_start_date, leave_end_date, reason, status, comment)
VALUES 
(2024004, 1, '2024-10-06', '2024-10-08', 'Family Event', 'Pending', NULL);


     



