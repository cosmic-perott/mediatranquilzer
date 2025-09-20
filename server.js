const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const app = express();
app.use(cors());

app.get("/run-python", (req, res) => {
  const urll = req.query.url;
  if (!urll) {
    return res.status(400).send("Missing URL");
  }
  const py = spawn("python3", ["server.py", urll]);
  let result = "";
  
  py.stdout.on("data", (data) => {
    result += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("Python error:", data.toString());
  });
  py.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).send("Python script failed");
    }
    console.log("Transcript received from Python:", result.trim());
    res.send(result.trim());
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
