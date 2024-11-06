
const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors());
app.use(express.json())


  


app.get("/adduser", (req, res) => {
    console.log(req.body);
    res.send("Response received: " + req.body);
});



// Start the server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//frontend -> localhost:3000
//backend -> localhost:4000