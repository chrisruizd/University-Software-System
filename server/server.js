
const express = require("express")
const cors = require("cors")
const pool = require("./database");

const app = express()

app.use(cors());
app.use(express.json())



// Login route
app.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (role === 'student') {
      // Directly check in the Students table
      const studentResult = await pool.query(`SELECT * FROM Students WHERE email = $1`, [email]);
      if (studentResult.rows.length === 0) return res.status(400).json({ error: "User not found in the student role" });

      const student = studentResult.rows[0];
      //let userID = student.eid;

      // Check password (assuming plaintext for simplicity)
      if (student.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      // If successful, respond with a success message and role
      return res.json({ message: "Login successful", role });
    } else {
      // Check in the Employees table for advisors, staff, and instructors
      const employeeResult = await pool.query(`SELECT * FROM Employees WHERE email = $1`, [email]);
      if (employeeResult.rows.length === 0) return res.status(400).json({ error: "User not found in the selected role" });

      const employee = employeeResult.rows[0];
      let userEID = employee.eid;

      // Check password (assuming plaintext for simplicity)
      if (employee.hashpw !== password) return res.status(400).json({ error: "Invalid password" });

      // Role-specific checks for advisor, staff, and instructor
      if (role === 'advisor') {
        const advisorResult = await pool.query(`SELECT * FROM Advisors WHERE eid = $1`, [employee.eid]);
        if (advisorResult.rows.length === 0) return res.status(400).json({ error: "User is not an advisor" });
      } else if (role === 'staff') {
        const staffResult = await pool.query(`SELECT * FROM Staff WHERE eid = $1`, [employee.eid]);
        if (staffResult.rows.length === 0) return res.status(400).json({ error: "User is not staff" });
      } else if (role === 'instructor') {
        const instructorResult = await pool.query(`SELECT * FROM Instructors WHERE eid = $1`, [employee.eid]);
        if (instructorResult.rows.length === 0) return res.status(400).json({ error: "User is not an instructor" });
      } else {
        return res.status(400).json({ error: "Invalid role selected" });
      }

      // If all checks pass, respond with a success message and role
      return res.json({ message: "Login successful", role, userEID });
    }
  } catch (error) {
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
app.get("/advisor-info", async (req, res) => {
  const { email } = req.query;

  try {
    // Join Advisors with Employees based on EID and filter by email
    const advisor = await pool.query(
      `SELECT e.EID, e.FirstName, e.LastName, e.Email, a.*
       FROM Employees e
       JOIN Advisors a ON e.EID = a.EID
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

  try {
    // Query to get the student's enrolled courses
    const coursesResult = await pool.query(
      `SELECT c.Name, c.CRN, c.Credits, c.Semester, c.Year, e.Grade, e.Completed
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

app.post("/add-course", async (req, res) => {
  const { advisorEID, studentUID, crn } = req.body;

  try {
    // Step 1: Check if advisor and student belong to the same department
    const departmentCheck = await pool.query(
      `SELECT 1
       FROM Advisors a
       JOIN Advises adv ON a.EID = adv.EID
       JOIN Students s ON s.UID = $1
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE a.EID = $2 AND m.DepartmentID = adv.DepartmentID`,
      [studentUID, advisorEID]
    );

    if (departmentCheck.rows.length === 0) {
      return res.status(403).json({ error: "Advisor not authorized to add courses for this student" });
    }

    // Step 2: Check if the student is already enrolled in the course
    const enrollmentCheck = await pool.query(
      `SELECT 1 FROM Enrolled_In WHERE UID = $1 AND CRN = $2`,
      [studentUID, crn]
    );

    if (enrollmentCheck.rows.length > 0) {
      return res.status(400).json({ error: "Student is already enrolled in this course" });
    }

    // Step 3: Add the course to the student's enrollment
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
    // Step 1: Check if advisor and student belong to the same department
    const departmentCheck = await pool.query(
      `SELECT 1
       FROM Advisors a
       JOIN Advises adv ON a.EID = adv.EID
       JOIN Students s ON s.UID = $1
       JOIN Majors m ON s.MajorIn = m.Name
       WHERE a.EID = $2 AND m.DepartmentID = adv.DepartmentID`,
      [studentUID, advisorEID]
    );

    if (departmentCheck.rows.length === 0) {
      return res.status(403).json({ error: "Advisor not authorized to drop courses for this student" });
    }

    // Step 2: Check if the student is currently enrolled in the course
    const enrollmentCheck = await pool.query(
      `SELECT 1 FROM Enrolled_In WHERE UID = $1 AND CRN = $2`,
      [studentUID, crn]
    );

    if (enrollmentCheck.rows.length === 0) {
      return res.status(400).json({ error: "Student is not currently enrolled in this course" });
    }

    // Step 3: Drop the course for the student
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
// Get student data by UID
app.get("/students/:uid", async (req, res) => {
  const { uid } = req.params;
  
  try {
    const result = await pool.query("SELECT * FROM Students WHERE UID = $1", [uid]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new student
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
  } = req.body;

  try {
    // Check if the major exists
    const majorCheck = await pool.query("SELECT 1 FROM Majors WHERE Name = $1", [majorin]);
    if (majorCheck.rows.length === 0) {
      return res.status(400).json({ error: "Major does not exist" });
    }

    // Check if the advisor exists (if provided)
    if (advised_by) {
      const advisorCheck = await pool.query("SELECT 1 FROM Advisors WHERE EID = $1", [advised_by]);
      if (advisorCheck.rows.length === 0) {
        return res.status(400).json({ error: "Advisor does not exist" });
      }
    }

    // Insert the new student into the Students table
    await pool.query(
      `INSERT INTO Students (UID, HashPW, Email, FirstName, LastName, MajorIn, GPA, Advised_By, Credits)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [uid, hashpw, email, firstname, lastname, majorin, gpa, advised_by || null, credits || 0]
    );

    res.json({ message: "Student added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


    //Instructor
// Get instructor data by EID
app.get("/instructors/:eid", async (req, res) => {
  const { eid } = req.params;

  try {
    const result = await pool.query(
      `SELECT e.*, i.DepartmentID
       FROM Employees e
       JOIN Instructors i ON e.EID = i.EID
       WHERE e.EID = $1`,
      [eid]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Instructor not found" });
    res.json(result.rows[0]);
  } catch (error) {
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

// Get advisor data by EID
app.get("/advisors/:eid", async (req, res) => {
  const { eid } = req.params;

  try {
    const result = await pool.query(
      `SELECT e.*, a.DepartmentID
       FROM Employees e
       JOIN Advises a ON e.EID = a.EID
       WHERE e.EID = $1`,
      [eid]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Advisor not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new advisor
app.post("/advisors", async (req, res) => {
  const { eid, hashpw, email, firstname, lastname, departmentid, staffEID } = req.body;

  try {
    const staffCheck = await pool.query(
      `SELECT 1 FROM Staff WHERE EID = $1 AND DepartmentID = $2`,
      [staffEID, departmentid]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to add advisor for this department" });
    }

    await pool.query(
      `INSERT INTO Employees (EID, HashPW, Email, FirstName, LastName) VALUES ($1, $2, $3, $4, $5)`,
      [eid, hashpw, email, firstname, lastname]
    );
    await pool.query(
      `INSERT INTO Advisors (EID) VALUES ($1)`,
      [eid]
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

// Update advisor data
app.put("/advisors/:eid", async (req, res) => {
  const { eid } = req.params;
  const { email, firstname, lastname, departmentid, staffEID } = req.body;

  try {
    const staffCheck = await pool.query(
      `SELECT 1 FROM Staff WHERE EID = $1 AND DepartmentID = $2`,
      [staffEID, departmentid]
    );
    if (staffCheck.rows.length === 0) {
      return res.status(403).json({ error: "Unauthorized to update advisor for this department" });
    }

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



// Department -------------------------------


// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

