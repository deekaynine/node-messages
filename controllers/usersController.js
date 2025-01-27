const usersStorage = require("../storages/usersStorage");
const db = require("../db/queries")
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const numErr = "must be numeric."

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .isEmail(),
  body("age").trim()
  .isNumeric().withMessage(`Age ${numErr} `)
  .isLength({min: 1, max: 130}).withMessage(`Age must be from 1 to 130.`),
];

const usersListGet = (req,res) => {
    res.render("index", {
        title: "User list",
        users: usersStorage.getUsers(),
      })
}

const usersCreateGet = (req, res) => {
    res.render("createUser", {
      title: "Create user",
    });
  };

const usersCreatePost = [validateUser, 
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
        const { firstName, lastName, email, age } = req.body;
        usersStorage.addUser({ firstName, lastName, email, age });
        res.redirect("/");
}
]

const usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
      title: "Update user",
      user: user,
    });
  };

const usersUpdatePost = [
    validateUser,
    (req, res) => {
      const user = usersStorage.getUser(req.params.id);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("updateUser", {
          title: "Update user",
          user: user,
          errors: errors.array(),
        });
      }
      const { firstName, lastName, email, age } = req.body;
      usersStorage.updateUser(req.params.id, { firstName, lastName, email, age });
      res.redirect("/");
    }
  ];

  const usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
  };

  const usersSearch = (req, res) => {
    const {searchUser} = req.query
    const results = usersStorage.searchUser(searchUser)
    res.render("searchResults", {title: "Search Results", results: results})
  }

  async function getUsernames(req, res) {
    const { search } = req.query
    
    if(search){
      const results = await db.getUsersBySearch(search)
      console.log("Results:", results)
      // Remember to add return since res.send doesnt end the function
      // Will throw an error since another res will not overwrite the current one without return
      return res.send("Search Results: " + results.map(user => user.username).join(", "))
    }

    const usernames = await db.getAllUsernames();
    res.send("Usernames: " + usernames.map(user => user.username).join(", "));
  }
  
  async function createUsernameGet(req, res) {
    // render the form
  }
  
  async function createUsernamePost(req, res) {
    const { username } = req.body;   
    await db.insertUsername(username);
    res.redirect("/");
  }

   async function deleteUsers(req, res) {
    await db.deleteUsers()
    res.send("Users deleted successfully.")
   }




module.exports = {usersListGet,usersCreateGet, 
  usersCreatePost, usersUpdateGet, 
  usersUpdatePost, usersDeletePost,
  usersSearch,  getUsernames,
  createUsernameGet,
  createUsernamePost}