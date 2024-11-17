
const express = require("express")
const cors = require("cors")
const pool = require("./database");

const app = express()

app.use(cors());
app.use(express.json())


// login
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (role === 'student') {
      // Check if the user is a student
      const studentResult = await pool.query(`SELECT * FROM Students WHERE email = $1`, [email]);
      if (studentResult.rows.length === 0) return res.status(400).json({ error: "User not found in the student role" });

      const student = studentResult.rows[0];
      if (student.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      return res.json({ message: "Login successful", role, userEID: student.uid });
    } 
    else if (role === 'advisor') {
      // Check if the user is an advisor
      const advisorResult = await pool.query(
        `SELECT e.*, a.*
         FROM Employees e
         JOIN Advisors a ON e.EID = a.EID
         WHERE e.email = $1`, [email]
      );
      if (advisorResult.rows.length === 0) return res.status(400).json({ error: "User not found in the advisor role" });

      const advisor = advisorResult.rows[0];
      if (advisor.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      return res.json({ message: "Login successful", role, userEID: advisor.eid });
    } 
    else if (role === 'instructor') {
      // Check if the user is an instructor
      const instructorResult = await pool.query(
        `SELECT e.*, i.*
         FROM Employees e
         JOIN Instructors i ON e.EID = i.EID
         WHERE e.email = $1`, [email]
      );
      if (instructorResult.rows.length === 0) return res.status(400).json({ error: "User not found in the instructor role" });

      const instructor = instructorResult.rows[0];
      if (instructor.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      return res.json({ message: "Login successful", role, userEID: instructor.eid });
    } 
    else if (role === 'staff') {
      // Check if the user is staff
      const staffResult = await pool.query(`SELECT * FROM Employees WHERE email = $1`, [email]);
      if (staffResult.rows.length === 0) return res.status(400).json({ error: "User not found in the staff role" });

      const staff = staffResult.rows[0];
      if (staff.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      return res.json({ message: "Login successful", role, userEID: staff.eid });
    } 
    else if (role === 'system_admin') {
      // Check if the user is a system admin
      const adminResult = await pool.query(`SELECT * FROM Employees WHERE email = $1`, [email]);
      if (adminResult.rows.length === 0) return res.status(400).json({ error: "System admin not found" });

      const admin = adminResult.rows[0];
      if (admin.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      return res.json({ message: "Login successful", role });
    } 
    else {
      return res.status(400).json({ error: "Invalid role selected" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





// Route to get student information
app.get("/student-info", async (req, res) => {
  const { email } = req.query;

  try {
    const student = await pool.query("SELECT * FROM students WHERE email = $1", [email]);
    if (student.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(student.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
})


// Route to get advisor information
// Updated route to get advisor information with department name
app.get("/advisor-info", async (req, res) => {
  const { email } = req.query;

  try {
    const advisor = await pool.query(
      `SELECT e.EID, e.FirstName, e.LastName, e.Email, a.DepartmentID, d.Name AS DepartmentName
       FROM Employees e
       JOIN Advisors a ON e.EID = a.EID
       JOIN Departments d ON a.DepartmentID = d.DepartmentID
       WHERE e.Email = $1`, 
      [email]
    );

    if (advisor.rows.length === 0) return res.status(404).json({ error: "Advisor not found" });
    res.json(advisor.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});



// Route to get instructor information
app.get("/instructor-info", async (req, res) => {
  const { email } = req.query;

  try {
    // Join Instructors with Employees based on EID and filter by email
    const instructor = await pool.query(
      `SELECT e.EID, e.FirstName, e.LastName, e.Email, i.DepartmentID
       FROM Employees e
       JOIN Instructors i ON e.EID = i.EID
       WHERE e.Email = $1`, 
      [email]
    );

    if (instructor.rows.length === 0) return res.status(404).json({ error: "Instructor not found" });
    res.json(instructor.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Route to get staff information
app.get("/staff-info", async (req, res) => {
  const { email } = req.query;

  try {
    // Join Staff with Employees based on EID and filter by email
    const staff = await pool.query(
      `SELECT e.EID, e.FirstName, e.LastName, e.Email, s.DepartmentID
       FROM Employees e
       JOIN Staff s ON e.EID = s.EID
       WHERE e.Email = $1`, 
      [email]
    );

    if (staff.rows.length === 0) return res.status(404).json({ error: "Staff not found" });
    res.json(staff.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


  
// Route to get enrolled courses for a student
// for student dashboard
app.get("/student-courses", async (req, res) => {
  const { email } = req.query;

  try {
    // Find the student's UID based on email
    const studentResult = await pool.query("SELECT UID FROM Students WHERE email = $1", [email]);
    if (studentResult.rows.length === 0) return res.status(404).json({ error: "Student not found" });

    const uid = studentResult.rows[0].uid;

    // Query to get the student's enrolled courses
    const coursesResult = await pool.query(
      `SELECT c.Name, c.CRN, c.StartTime, c.EndTime, c.Credits, c.Semester, c.Year, e.Grade, e.Completed
       FROM Enrolled_In e
       JOIN Courses c ON e.CRN = c.CRN
       WHERE e.UID = $1`, 
      [uid]
    );

    // Return the enrolled courses
    res.json(coursesResult.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});



// Route to get courses taught by an instructor
app.get("/instructor-courses", async (req, res) => {
  const { email } = req.query;

  try {
    // Find the instructor's EID based on email
    const instructorResult = await pool.query("SELECT EID FROM Employees WHERE email = $1", [email]);
    if (instructorResult.rows.length === 0) return res.status(404).json({ error: "Instructor not found" });

    const eid = instructorResult.rows[0].eid;

    // Query to get the courses taught by the instructor
    const coursesResult = await pool.query(
      `SELECT c.Name, c.CRN, c.StartTime, c.EndTime, c.Credits, c.Semester, c.Year
       FROM Teaches t
       JOIN Courses c ON t.CRN = c.CRN
       WHERE t.EID = $1`, 
      [eid]
    );

    // Return the courses taught by the instructor
    res.json(coursesResult.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


//-----------------------------------
// Route to get current courses for a student
app.get("/student-courses/:uid", async (req, res) => {
  const { uid } = req.params;
  const { advisorEID } = req.query;

  try {
    // Check if the advisor and student belong to the same department
    const departmentCheck = await pool.query(
      `SELECT 1
       FROM Advisors a
       JOIN Students s ON s.UID = $1
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE a.EID = $2 AND a.DepartmentID = m.DepartmentID`,
      [uid, advisorEID]
    );

    if (departmentCheck.rows.length === 0) {
      return res.status(403).json({ error: "Advisor not authorized to view courses for this student" });
    }

    // Get the student's enrolled courses
    const coursesResult = await pool.query(
      `SELECT c.Name, c.CRN, c.Credits, c.Semester, c.Year, e.Grade, e.Completed
       FROM Enrolled_In e
       JOIN Courses c ON e.CRN = c.CRN
       WHERE e.UID = $1`,
      [uid]
    );

    res.json(coursesResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/add-course", async (req, res) => {
  const { advisorEID, studentUID, crn } = req.body;

  try {
    // Check if the advisor and student belong to the same department
    const departmentCheck = await pool.query(
      `SELECT 1
       FROM Advisors a
       JOIN Students s ON s.UID = $1
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE a.EID = $2 AND a.DepartmentID = m.DepartmentID`,
      [studentUID, advisorEID]
    );

    if (departmentCheck.rows.length === 0) {
      return res.status(403).json({ error: "Advisor not authorized to add courses for this student" });
    }

    // Check if the student is already enrolled in the course
    const enrollmentCheck = await pool.query(
      `SELECT 1 FROM Enrolled_In WHERE UID = $1 AND CRN = $2`,
      [studentUID, crn]
    );

    if (enrollmentCheck.rows.length > 0) {
      return res.status(400).json({ error: "Student is already enrolled in this course" });
    }

    // Add the course to the student's enrollment
    await pool.query(
      `INSERT INTO Enrolled_In (UID, CRN, Completed)
       VALUES ($1, $2, FALSE)`,
      [studentUID, crn]
    );

    res.json({ message: "Course added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});






// Drop course from student enrollment by an advisor
app.post("/drop-course", async (req, res) => {
  const { advisorEID, studentUID, crn } = req.body;

  try {
    // Check if the advisor and student belong to the same department
    const departmentCheck = await pool.query(
      `SELECT 1
       FROM Advisors a
       JOIN Students s ON s.UID = $1
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE a.EID = $2 AND a.DepartmentID = m.DepartmentID`,
      [studentUID, advisorEID]
    );

    if (departmentCheck.rows.length === 0) {
      return res.status(403).json({ error: "Advisor not authorized to drop courses for this student" });
    }

    // Check if the student is currently enrolled in the course
    const enrollmentCheck = await pool.query(
      `SELECT 1 FROM Enrolled_In WHERE UID = $1 AND CRN = $2`,
      [studentUID, crn]
    );

    if (enrollmentCheck.rows.length === 0) {
      return res.status(400).json({ error: "Student is not currently enrolled in this course" });
    }

    // Drop the course for the student
    await pool.query(
      `DELETE FROM Enrolled_In WHERE UID = $1 AND CRN = $2`,
      [studentUID, crn]
    );

    res.json({ message: "Course dropped successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});





//-------------Staff Actions---------------------------------------


    //Sudent
// Get student data by UID with staff department validation
app.get("/students/:uid", async (req, res) => {
  const { uid } = req.params;
  const { staffEID } = req.query;

  try {
    // Get the department of the logged-in staff member
    const staffDepartmentResult = await pool.query(
      `SELECT DepartmentID FROM Staff WHERE EID = $1`,
      [staffEID]
    );

    if (staffDepartmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const staffDepartmentID = staffDepartmentResult.rows[0].departmentid;

    // Get student data and check if the major belongs to the same department
    const result = await pool.query(
      `SELECT s.*, m.DepartmentID
       FROM Students s
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE s.UID = $1 AND m.DepartmentID = $2`,
      [uid, staffDepartmentID]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to view student data or student does not exist" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update student data with staff and advisor validation
app.put("/students/:uid", async (req, res) => {
  const { uid } = req.params;
  const { hashpw, email, firstname, lastname, majorin, gpa, advised_by, credits, staffEID } = req.body;

  try {
    // Step 1: Get the department of the logged-in staff member
    const staffDepartmentResult = await pool.query(
      `SELECT DepartmentID FROM Staff WHERE EID = $1`,
      [staffEID]
    );

    if (staffDepartmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Staff not found" });
    }

    const staffDepartmentID = staffDepartmentResult.rows[0].departmentid;

    // Step 2: Check if the major belongs to the same department as the staff
    const majorCheck = await pool.query(
      `SELECT DepartmentID FROM Majors WHERE Name = $1`,
      [majorin]
    );

    if (majorCheck.rows.length === 0) {
      return res.status(400).json({ error: "Major does not exist" });
    }

    const majorDepartmentID = majorCheck.rows[0].departmentid;

    if (staffDepartmentID !== majorDepartmentID) {
      return res.status(403).json({ error: "Unauthorized to update student data" });
    }

    // Step 3: Validate that the advisor belongs to the same department as the major (if provided)
    if (advised_by) {
      const advisorCheck = await pool.query(
        `SELECT a.EID
         FROM Advisors a
         JOIN Employees e ON a.EID = e.EID
         JOIN Departments d ON a.DepartmentID = d.DepartmentID
         WHERE a.EID = $1 AND d.DepartmentID = $2`,
        [advised_by, majorDepartmentID]
      );
      if (advisorCheck.rows.length === 0) {
        return res.status(400).json({ error: "Advisor does not belong to the same department as the student's major" });
      }
    }

    // Step 4: Update student data
    await pool.query(
      `UPDATE Students
       SET HashPW = $1,
           Email = $2,
           FirstName = $3,
           LastName = $4,
           MajorIn = $5,
           GPA = $6,
           Advised_By = $7,
           Credits = $8
       WHERE UID = $9`,
      [hashpw, email, firstname, lastname, majorin, gpa, advised_by, credits, uid]
    );

    res.json({ message: "Student data updated successfully" });
  } catch (error) {
    console.error("Failed to update student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// staff delete student
// Route to delete a student (restricted by department)
app.delete("/students/:uid", async (req, res) => {
  const { uid } = req.params;
  const { staffEID } = req.body;

  try {
    // Step 1: Get the department of the staff member
    const staffDeptResult = await pool.query(
      "SELECT DepartmentID FROM Staff WHERE EID = $1",
      [staffEID]
    );
    if (staffDeptResult.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized staff member" });
    }

    const staffDepartmentID = staffDeptResult.rows[0].departmentid;

    // Step 2: Get the department of the student's major
    const studentDeptResult = await pool.query(
      `SELECT m.DepartmentID
       FROM Students s
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE s.UID = $1`,
      [uid]
    );
    if (studentDeptResult.rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentDepartmentID = studentDeptResult.rows[0].departmentid;

    // Step 3: Check if the staff and student departments match
    if (staffDepartmentID !== studentDepartmentID) {
      return res.status(403).json({ error: "Staff not authorized to delete this student" });
    }

    // Step 4: Delete the student from the database
    await pool.query("DELETE FROM Students WHERE UID = $1", [uid]);

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Failed to delete student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Add a new student (restricted by department and advisor validation)
app.post("/students", async (req, res) => {
  const {
    uid,
    hashpw,
    email,
    firstname,
    lastname,
    majorin,
    gpa,
    advised_by,
    credits,
    staffEID,
  } = req.body;

  try {
    // Step 1: Verify that the major exists
    const majorCheck = await pool.query(
      "SELECT DepartmentID FROM Majors WHERE Name = $1",
      [majorin]
    );
    if (majorCheck.rows.length === 0) {
      return res.status(400).json({ error: "Major does not exist" });
    }

    const majorDepartmentID = majorCheck.rows[0].departmentid;

    // Step 2: Verify that the staff member exists and get their department
    const staffCheck = await pool.query(
      "SELECT DepartmentID FROM Staff WHERE EID = $1",
      [staffEID]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized staff member" });
    }

    const staffDepartmentID = staffCheck.rows[0].departmentid;

    // Step 3: Check if the staff member's department matches the major's department
    if (staffDepartmentID !== majorDepartmentID) {
      return res.status(403).json({ error: "Staff not authorized to add a student for this major" });
    }

    // Step 4: Validate that the advisor belongs to the same department as the major (if provided)
    if (advised_by) {
      const advisorCheck = await pool.query(
        `SELECT a.EID
         FROM Advisors a
         JOIN Employees e ON a.EID = e.EID
         JOIN Departments d ON a.DepartmentID = d.DepartmentID
         WHERE a.EID = $1 AND d.DepartmentID = $2`,
        [advised_by, majorDepartmentID]
      );
      if (advisorCheck.rows.length === 0) {
        return res.status(400).json({ error: "Advisor does not belong to the same department as the student's major" });
      }
    }

    // Step 5: Insert the new student into the Students table
    await pool.query(
      `INSERT INTO Students (UID, HashPW, Email, FirstName, LastName, MajorIn, GPA, Advised_By, Credits)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [uid, hashpw, email, firstname, lastname, majorin, gpa, advised_by || null, credits || 0]
    );

    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error("Failed to add student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




    //Instructor
// Get instructor data by EID
// Get instructor data by EID (restricted to staff's department)
app.get("/instructors/:eid", async (req, res) => {
  const { eid } = req.params;
  const { staffEID } = req.query; // Include staffEID in the query parameters

  try {
    // Step 1: Get the department of the staff member
    const staffCheck = await pool.query(
      "SELECT DepartmentID FROM Staff WHERE EID = $1",
      [staffEID]
    );

    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized staff member" });
    }

    const staffDepartmentID = staffCheck.rows[0].departmentid;

    // Step 2: Get the instructor data and verify the department
    const result = await pool.query(
      `SELECT e.*, i.DepartmentID
       FROM Employees e
       JOIN Instructors i ON e.EID = i.EID
       WHERE e.EID = $1 AND i.DepartmentID = $2`,
      [eid, staffDepartmentID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Instructor not found or not in your department" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch instructor data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new instructor
app.post("/instructors", async (req, res) => {
  const { eid, hashpw, email, firstname, lastname, departmentid, staffEID } = req.body;

  try {
    // Verify if the staff member and instructor belong to the same department
    const staffCheck = await pool.query(
      `SELECT 1 FROM Staff WHERE EID = $1 AND DepartmentID = $2`,
      [staffEID, departmentid]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to add instructor for this department" });
    }

    // Insert into Employees and Instructors tables
    await pool.query(
      `INSERT INTO Employees (EID, HashPW, Email, FirstName, LastName) VALUES ($1, $2, $3, $4, $5)`,
      [eid, hashpw, email, firstname, lastname]
    );
    await pool.query(
      `INSERT INTO Instructors (EID, DepartmentID) VALUES ($1, $2)`,
      [eid, departmentid]
    );

    res.json({ message: "Instructor added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update instructor data
app.put("/instructors/:eid", async (req, res) => {
  const { eid } = req.params;
  const { email, firstname, lastname, departmentid, staffEID} = req.body;
  
  console.log(req.body);
  try {
    // Check if staff and instructor belong to the same department
    const staffCheck = await pool.query(
      `SELECT 1 FROM Staff WHERE EID = $1 AND DepartmentID = $2`,
      [staffEID, departmentid]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update instructor for this department" });
    }

    // Update Employees and Instructors tables
    await pool.query(
      `UPDATE Employees SET Email = $1, FirstName = $2, LastName = $3 WHERE EID = $4`,
      [email, firstname, lastname, eid]
    );
    await pool.query(
      `UPDATE Instructors SET DepartmentID = $1 WHERE EID = $2`,
      [departmentid, eid]
    );

    res.json({ message: "Instructor updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});




// Advisor ---------------------

// server.js

// Get advisor data by EID (restricted by staff department)
app.get("/advisors/:eid", async (req, res) => {
  const { eid } = req.params;
  const staffEID = req.query.staffEID;

  try {
    // Check the staff's department
    const staffDepartment = await pool.query(
      `SELECT DepartmentID FROM Staff WHERE EID = $1`,
      [staffEID]
    );

    if (staffDepartment.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const departmentID = staffDepartment.rows[0].departmentid;

    // Fetch advisor data only if they belong to the same department
    const result = await pool.query(
      `SELECT e.*, a.DepartmentID
       FROM Employees e
       JOIN Advisors a ON e.EID = a.EID
       WHERE e.EID = $1 AND a.DepartmentID = $2`,
      [eid, departmentID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Advisor not found or unauthorized access" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Add a new advisor (restricted by staff department)
app.post("/advisors", async (req, res) => {
  const { eid, hashpw, email, firstname, lastname, departmentid, staffEID } = req.body;

  try {
    // Verify that the staff and department match
    const staffCheck = await pool.query(
      `SELECT 1 FROM Staff WHERE EID = $1 AND DepartmentID = $2`,
      [staffEID, departmentid]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to add advisor for this department" });
    }

    // Insert into Employees and Advisors tables
    await pool.query(
      `INSERT INTO Employees (EID, HashPW, Email, FirstName, LastName) VALUES ($1, $2, $3, $4, $5)`,
      [eid, hashpw, email, firstname, lastname]
    );
    await pool.query(
      `INSERT INTO Advisors (EID, DepartmentID) VALUES ($1, $2)`,
      [eid, departmentid]
    );
    await pool.query(
      `INSERT INTO Advises (EID, DepartmentID) VALUES ($1, $2)`,
      [eid, departmentid]
    );

    res.json({ message: "Advisor added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update advisor data (restricted by staff department)
app.put("/advisors/:eid", async (req, res) => {
  const { eid } = req.params;
  const { email, firstname, lastname, departmentid, staffEID } = req.body;

  try {
    // Verify staff's department matches the advisor's department
    const staffCheck = await pool.query(
      `SELECT 1 FROM Staff WHERE EID = $1 AND DepartmentID = $2`,
      [staffEID, departmentid]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update advisor for this department" });
    }

    // Update Employees and Advises tables
    await pool.query(
      `UPDATE Employees SET Email = $1, FirstName = $2, LastName = $3 WHERE EID = $4`,
      [email, firstname, lastname, eid]
    );
    await pool.query(
      `UPDATE Advises SET DepartmentID = $1 WHERE EID = $2`,
      [departmentid, eid]
    );

    res.json({ message: "Advisor updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// get course information
// Get course data by CRN (restricted to staff's department)
app.get("/courses/:crn", async (req, res) => {
  const { crn } = req.params;
  const { staffEID } = req.query;

  try {
    // Get the department ID of the staff member
    const staffResult = await pool.query(
      "SELECT DepartmentID FROM Staff WHERE EID = $1",
      [staffEID]
    );

    if (staffResult.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized staff member" });
    }

    const staffDepartmentID = staffResult.rows[0].departmentid;

    // Fetch the course data and check if it belongs to the staff's department
    const result = await pool.query(
      `SELECT crn, name, credits, departmentid, semester, year, starttime, endtime
       FROM Courses
       WHERE crn = $1 AND departmentid = $2`,
      [crn, staffDepartmentID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found or not in your department" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update course data by CRN (restricted to staff's department)
app.put("/courses/:crn", async (req, res) => {
  const { crn } = req.params;
  const { name, credits, semester, year, starttime, endtime, staffEID } = req.body;

  try {
    // Get the department ID of the staff member
    const staffResult = await pool.query(
      "SELECT DepartmentID FROM Staff WHERE EID = $1",
      [staffEID]
    );

    if (staffResult.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized staff member" });
    }

    const staffDepartmentID = staffResult.rows[0].departmentid;

    // Ensure the course belongs to the staff's department
    const departmentCheck = await pool.query(
      "SELECT 1 FROM Courses WHERE CRN = $1 AND DepartmentID = $2",
      [crn, staffDepartmentID]
    );

    if (departmentCheck.rows.length === 0) {
      return res.status(403).json({ error: "You are not authorized to edit this course" });
    }

    // Update the course data
    await pool.query(
      `UPDATE Courses
       SET Name = $1, Credits = $2, Semester = $3, Year = $4, StartTime = $5, EndTime = $6
       WHERE CRN = $7`,
      [name, credits, semester, year, starttime, endtime, crn]
    );

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Failed to update course data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Add a new course (restricted to staff's department)
app.post("/courses", async (req, res) => {
  const {
    crn,
    name,
    credits,
    departmentid,
    semester,
    year,
    starttime,
    endtime,
    staffEID
  } = req.body;

  try {
    // Get the department ID of the staff member
    const staffResult = await pool.query(
      "SELECT DepartmentID FROM Staff WHERE EID = $1",
      [staffEID]
    );

    if (staffResult.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized staff member" });
    }

    const staffDepartmentID = staffResult.rows[0].departmentid;

    // Ensure the new course belongs to the staff's department
    if (departmentid !== staffDepartmentID) {
      return res.status(403).json({ error: "You can only add courses to your own department" });
    }

    // Insert the new course into the Courses table
    await pool.query(
      `INSERT INTO Courses (CRN, Name, Credits, DepartmentID, Semester, Year, StartTime, EndTime)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [crn, name, credits, departmentid, semester, year, starttime, endtime]
    );

    res.json({ message: "Course added successfully" });
  } catch (error) {
    console.error("Failed to add course:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Department -------------------------------
// Get department details for the logged-in staff member
app.get("/department-info", async (req, res) => {
  const { staffEID } = req.query;

  try {
    // Get the department ID of the logged-in staff member
    const staffResult = await pool.query("SELECT DepartmentID FROM Staff WHERE EID = $1", [staffEID]);
    if (staffResult.rows.length === 0) return res.status(404).json({ error: "Staff not found" });

    const departmentID = staffResult.rows[0].departmentid;

    // Get the department details
    const departmentResult = await pool.query(
      `SELECT * FROM Departments WHERE DepartmentID = $1`,
      [departmentID]
    );
    if (departmentResult.rows.length === 0) return res.status(404).json({ error: "Department not found" });

    res.json(departmentResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update department details
app.put("/edit-department", async (req, res) => {
  const { staffEID, name, abbreviation, building, office } = req.body;

  try {
    // Get the department ID of the logged-in staff member
    const staffResult = await pool.query("SELECT DepartmentID FROM Staff WHERE EID = $1", [staffEID]);
    if (staffResult.rows.length === 0) return res.status(404).json({ error: "Staff not found" });

    const departmentID = staffResult.rows[0].departmentid;

    // Update the department details
    await pool.query(
      `UPDATE Departments
       SET Name = $1,
           Abbreviation = $2,
           Building = $3,
           Office = $4
       WHERE DepartmentID = $5`,
      [name, abbreviation, building, office, departmentID]
    );

    res.json({ message: "Department details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get GPA statistics for each major
app.get('/api/gpa-by-major', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.Name AS major,
        MAX(s.GPA) AS highestGPA,
        MIN(s.GPA) AS lowestGPA,
        ROUND(AVG(s.GPA), 2) AS averageGPA
      FROM Students s
      JOIN Majors m ON s.MajorIn = m.Name
      GROUP BY m.Name
      ORDER BY m.Name;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// server.js
// get department rank by GPA system report
app.get("/api/department-rank-by-gpa", async (req, res) => {
  try {
    // Query to get the average GPA for each department
    const result = await pool.query(
      `SELECT d.Name AS department, 
              ROUND(AVG(s.GPA), 2) AS averagegpa
       FROM Students s
       JOIN Majors m ON s.MajorIn = m.Name
       JOIN Departments d ON m.DepartmentID = d.DepartmentID
       GROUP BY d.Name
       ORDER BY averagegpa DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch department GPA data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all students by major, sorted by total credits
app.get("/api/students-by-major-credits", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.Name AS major,
        s.UID AS studentid,
        CONCAT(s.FirstName, ' ', s.LastName) AS studentname,
        s.Credits AS totalcredits
      FROM Students s
      JOIN Majors m ON s.MajorIn = m.Name
      ORDER BY m.Name, s.Credits DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch student data by major:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get instructor course enrollment by major
app.get("/api/instructor-course-enrollment", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.EID AS instructorid,
        CONCAT(e.FirstName, ' ', e.LastName) AS instructorname,
        c.CRN AS coursecode,
        m.Name AS major,
        COUNT(ei.UID) AS totalstudents
      FROM Instructors i
      JOIN Employees e ON i.EID = e.EID
      JOIN Teaches t ON i.EID = t.EID
      JOIN Courses c ON t.CRN = c.CRN
      JOIN Enrolled_In ei ON c.CRN = ei.CRN
      JOIN Students s ON ei.UID = s.UID
      JOIN Majors m ON s.MajorIn = m.Name
      GROUP BY i.EID, e.FirstName, e.LastName, c.CRN, m.Name
      ORDER BY i.EID, c.CRN, m.Name;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch instructor course enrollment data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// server.js

// Get course enrollments and average grades by semester
app.get("/api/course-enrollments", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          c.Semester,
          c.CRN AS CourseID,
          c.Name AS CourseName,
          COUNT(e.UID) AS TotalEnrollments,
          ROUND(AVG(e.Grade), 2) AS AverageGrade
      FROM Courses c
      JOIN Enrolled_In e ON c.CRN = e.CRN
      WHERE e.Grade IS NOT NULL
      GROUP BY c.Semester, c.CRN, c.Name
      ORDER BY c.Semester, c.CRN;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch course enrollments data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});







// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




