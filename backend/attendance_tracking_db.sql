CREATE SEQUENCE user_id_seq 
    START WITH 2024001 
    INCREMENT BY 1;

CREATE TABLE Users (
    user_id INTEGER DEFAULT nextval('user_id_seq') PRIMARY KEY,
    name VARCHAR(100) NOT NULL,  -- Added the name field
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('student', 'faculty')) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,  -- Email is unique
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    faculty_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES Users(user_id) ON DELETE SET NULL
);


CREATE TABLE StudentCourses (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
);

CREATE TABLE FacultyCourses (
    faculty_course_id SERIAL PRIMARY KEY,
    faculty_id INT NOT NULL,
    course_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
    UNIQUE(faculty_id, course_id)  -- Ensuring a faculty can be assigned to a course only once
);


CREATE TABLE Attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT,
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
    student_id INT,
    leave_start_date DATE NOT NULL,
    leave_end_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    student_id INT,
    course_id INT,
    notification_type VARCHAR(10) CHECK (notification_type IN ('Alert', 'Leave')) NOT NULL,
    leave_status VARCHAR(10) CHECK (leave_status IN ('Pending', 'Approved', 'Rejected')),
    comment TEXT,
    month VARCHAR(20),
    attendance_percentage INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE SET NULL
);