const express = require("express");
const app = express();
const PORT = 8000; //default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// data
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const checkForEmail = function(object, value) {
  let alreadyReg = false;
  for (const item in object) {
    for (let property in object[item]) {
      if (object[item][property] === value) {
        alreadyReg = true;
      }
    }
  }
  return alreadyReg;
};

function generateRandomString() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Get Routes

app.get("/urls/register",  (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = {
    urls: urlDatabase, user: users[userID],
  };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = {
    urls: urlDatabase, user: users[userID], 
  };
  res.render("urls_new", templateVars);
});
  

app.get("/urls", (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = { urls: urlDatabase, user: users[userID],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/login",  (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = { urls: urlDatabase, user: users[userID],
  };
  res.render("urls_login", templateVars);
} );

app.get('/400', (req,res) => {
  res.render('400');
  res.end();
});
  


// app.get('*', (req,res) => {
//   res.render('404');
//   res.end();
// });

 

  
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  urls: urlDatabase, user: users[userID]
  };
  res.render("urls_show", templateVars);
});

 



// Post Routes

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls/${newShortUrl}`);
});

app.post('/urls/register', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const newId = generateRandomString();
  if (checkForEmail(users, req.body.email) === true) {
    res.redirect('/400');
  }
  if (!req.body.email || !req.body.password) {
    res.redirect('/400');
  }
  if (req.body.email && req.body.password) {
    users[newId] = {id: newId, email: newEmail, password: newPassword};
    res.cookie('user_id', newId);
    res.redirect('/urls');
  }

}
);

app.post('/urls/login', (req,res) => {
if (checkForEmail(users, req.body.email) !== true)
{return res.redirect('/400') }
if (checkForEmail(users, req.body.password) !== true)
{return res.redirect('/400') }
else {
  res.cookie('user_id', req.body.email);
  // not sure how to accces ID number here, console.log is printing an object w no user_id ?
  return res.redirect('/urls'); }
});


app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");

});

app.post("/urls/:shortURL/", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");

});

app.post("/login", (req, res) => {
  res.cookie('user_id', req.body);
  (console.log(req.body))
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.body);
  res.redirect("/urls");
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
