const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Redirect to different HTML pages
app.get("/", (req, res) => {
  res.redirect("public/index.html");
});

app.get("/about", (req, res) => {
  res.redirect("public/about.html");
});

app.get("/article", (req, res) => {
  res.redirect("public/article.html");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
