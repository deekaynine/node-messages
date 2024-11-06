const express = require("express")
const authorRouter = require("./routes/authorRouter")
const bookRouter = require("./routes/bookRouter")

require("dotenv").config()
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");


const app = express()

app.use(express.urlencoded({ extended: true }));
// static files
app.use(express.static(assetsPath));

// view: ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routers
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

const links = [
    { href: "/", text: "Home" },
    { href: "about", text: "About" },
  ];

  const messages = [
    {
      text: "Hi there!",
      user: "Amando",
      added: new Date().toLocaleDateString()
    },
    {
      text: "Hello World!",
      user: "Charles",
      added: new Date().toLocaleDateString()
    }
  ];

// root routes
app.get("/", (req, res) => {
    res.render("index", { messages:messages, links: links });
  });

app.get("/new",(req,res)=>{
    res.render("form")
})

app.post("/new",(req,res)=>{
    const {authorName, message} = req.body
    messages.push({ text: message, user: authorName, added: new Date().toLocaleTimeString() });
    res.redirect("/")
})
  
app.get('*', (req, res)=>{
    res.send("Unknown Router ERROR")
})

app.get('/:username/messages',(req,res)=>{
    res.json({
        params: req.params,
        query : req.query
    })

})

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Listening on port: ${PORT}`)
});

