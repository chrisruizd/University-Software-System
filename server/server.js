
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
      // Choose the appropriate table based on the role
      let userTable;
      if (role === 'student') userTable = 'students';
      else if (role === 'advisor' || role === 'staff' || role === 'instructor') userTable = 'employees';
      else return res.status(400).json({ error: "Invalid role" });
  
      // Verify user based on email and role
      const result = await pool.query(`SELECT * FROM ${userTable} WHERE email = $1`, [email]);
      if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });
  
      const user = result.rows[0];
  
      // Check password (assuming plaintext for simplicity)
      if (user.hashpw !== password) return res.status(400).json({ error: "Invalid password" });
  
      // Respond with success message and role
      res.json({ message: "Login successful", role });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
});
  


  


// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//frontend -> localhost:3000
//backend -> localhost:4000