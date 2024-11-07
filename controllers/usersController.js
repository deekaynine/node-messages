const usersStorage = require("../storages/usersStorage");
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


module.exports = {usersListGet,usersCreateGet, 
  usersCreatePost, usersUpdateGet, 
  usersUpdatePost, usersDeletePost,
  usersSearch}