require("dotenv").config()
const express = require("express")
const app = express()



const usersRouter = require("./routes/usersRouter")

const path = require("node:path");
const assetsPath = path.join(__dirname, "public");

app.use(express.urlencoded({ extended: true }));
// static files
app.use(express.static(assetsPath));

// view: ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routers
app.use("/", usersRouter)

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`)
});

