var express = require('express');
var router = express.Router();
const userModel = require("./users")
const add = require("./add")
const passport = require("passport")
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", isLoggedIn, function (req, res) {
  userModel.find()
    .then(function (all) {
      res.render("index", { all })
    })
})

router.post("/register", function (req, res) {
  const userData = new userModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile
  })
  userModel.register(userData, req.body.password)
    .then(function (registerUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    }).catch(function (err) {
      res.redirect("/login")
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function (req, res) { })

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) throw err;
    res.redirect("/login")
  });
})

router.get("/login", function (req, res) {
  res.render("login")
})

router.get("/add", function (req, res) {
  res.render("add")
})
router.post("/add", isLoggedIn, async function (req, res) {
  add.create({
    date: req.body.date,
    subject: req.body.subject,
    textarea: req.body.textarea,
    email: req.body.email,
    mobile: req.body.mobile,
    sms: req.body.sms,
    days: req.body.days
  }).then(function (data) {
    res.redirect("/profile")
  }).catch(function (e) {
    res.send(e)
  })
})

router.get("/list", isLoggedIn, function (req, res) {
  add.find()
    .then(function (data) {
      res.render("list", { data })
    })
})
router.get('/delete/:id', async function (req, res, next) {
  add.findOneAndDelete({ _id: req.params.id })
    .then(function (data) {
      res.redirect(req.headers.referer)
    })
});

router.get("/update", function (req, res) {
  res.render("update")
})
router.get("/dis", function (req, res) {
  res.render("dis");

})
router.get("/en", function (req, res) {
  res.render("en")
})
router.get('/update/:id', function (req, res, next) {
  add.updateOne(
    { textarea: req.params.textarea }
  )
    .then(function (data) {
      res.redirect("list")
    })
})

router.get("/register", function (req, res) {
  res.render("register")
})

router.get("/profile", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      res.render("profile", { foundUser })
    })
})
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) throw err;
    res.redirect("/")
  });
});

router.get("/delete/:id", function (req, res) {
  userModel.findOne({ _id: req.params.id })
    .then(function (deleteUser) {
      if (deleteUser.username === req.session.passport.user) {
        userModel.findOneAndDelete({ _id: req.params.id })
          .then(function (delet) {
            res.redirect(req.headers.referer);
          })
      } else {
        res.send("Bhai Mt Presan Ho Kuch Hoga Nhi Tere se ?")
      }
    })
})

router.get("/forget", function (req, res) {
  res.render("forget")
})


router.get("/reset/password/:id/:otp", function (req, res) {
  userModel.findOne({ _id: req.params.id })
    .then(function (user) {
      if (user.expiresAt < Date.now()) {
        res.send("Sorrry")
      } else {
        if (user.otp === req.params.otp) {
          res.render("setpass", { user })
        }
      }
    })
})




module.exports = router;