var express = require("express");
var User = require("./models/users");
var passport = require("passport");


var router = express.Router();

router.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});


//home page
router.get("/", function(req, res, next) {
	User.find()
	.sort({ createdAt: "descending" })
	.exec(function(err, users) {
	if (err) { return next(err); }
	res.render("index", { users: users });
	});
});

//sign up
router.get("/signup", function(req, res) {
	res.render("signup");
});

//save new username and password
router.post("/signup", function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	User.findOne({ username: username }, function(err, user) {
		if (err) { return next(err); }
		if (user) {
			req.flash("error", "User already exists");
			return res.redirect("/signup");
		}
		var newUser = new User({
			username: username,
			password: password
		});
		newUser.save(next);
	});
}, passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/signup",
	failureFlash: true
}));


//View my (a user's) page
router.get("/users/:username", function(req, res, next) {
	User.findOne({ username: req.params.username }, function(err, user) {
		if (err) { return next(err); }
		if (!user) { return next(404); }
		res.render("profile", { user: user });
	});
});

//Render Login page
router.get("/login", function(req, res) {
	res.render("login");
});

//Authenticate user and login
router.post("/login", passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}));

//logout and redirect to home
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		req.flash("info", "You must be logged in to see this page.");
		res.redirect("/login");
	}
}

//Edit page makes sure you are authenticated before edit
router.get("/edit", ensureAuthenticated, function(req, res) {
	res.render("edit");
});

router.put("/edit", ensureAuthenticated, function(req, res, next) {
	console.log(req.params.userId);
	
// This would likely be inside of a PUT request, since we're updating an existing document, hence the req.params.todoId.
// Find the existing resource by ID
User.findById(req.params.userId, (err, user) => {  
    // Handle any possible database errors
    if (err) {
        res.status(500).send(err);
    } else {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.
        console.log(user);
    }
});


		req.flash("info", "Profile updated!");
		req.logout();
		res.redirect("/");
	



});








module.exports = router;














