const express = require("express");
const app = express();
const PORT = 8000; //default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs")

// data
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.floor(100000 + Math.random() * 900000);
  }
// Get Routes

  app.get("/urls/new", (req, res) => {
    const templateVars = {
      username: req.cookies["username"],
    };
    res.render("urls_new", templateVars);
  });
  
   app.get("/urls", (req, res) => {
    const templateVars = { urls: urlDatabase, username: req.cookies["username"],
  };
    res.render("urls_index", templateVars);
  });
  
  app.get("/urls/:shortURL", (req, res) => {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"]
    };
    res.render("urls_show", templateVars);
  });

// Post Routes

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString()
  urlDatabase[newShortUrl] = req.body.longURL
  console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls/${newShortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
res.redirect("/urls");

})

app.post("/urls/:shortURL/", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
res.redirect("/urls");

})

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('username', req.body.username)
  res.redirect("/urls");
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
