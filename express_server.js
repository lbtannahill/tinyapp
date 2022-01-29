const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const PORT = 8000; //default port 8080

const app = express();
app.set("view engine", "ejs");

//middlewear

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//data 

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

const users = {
  // "userRandomID": {
  //   id: "aJ48lW",
  //   email: "user@example.com",
  //   password: "asdf"
  // },
  // "user2RandomID": {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk"
  // }
};


const generateRandomString = (len) => {
	let randomString = "";
	for (let i = 0; i < len; i++) {
		let rndm = Math.floor(Math.random() * 62);
		if (rndm <= 9) {
			randomString += String.fromCharCode(rndm + 48);
		} else if (rndm >= 36) {
			randomString += String.fromCharCode(rndm + 61);
		} else {
			randomString += String.fromCharCode(rndm + 55);
		}
	}

	return randomString;
};

const getUrlsForUser = function(userID) {
  const results = {}
  const shortUrls = Object.keys(urlDatabase);

  for (const shortUrl of shortUrls) {
    const url = urlDatabase[shortUrl];
    if(url.userID === urlDatabase.id) {
      results[shortUrl] = url; 
    }
  }
return results
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


const getUserByEmail = function (email) {
const keys = Object.keys(users)
  for (let key of keys) {
    const user = users[key];
    if(user.email === email) {
      return user; 
    }
} 
return null;
}


// Routes



app.get("/urls", (req, res) => {
  const userID = req.cookies['user_id']
  const user = users[userID];
  if(!user)
    {return res.redirect('/urls/login') };
  const urls1 = getUrlsForUser(userID)
  const templateVars = { urls: urls1, user: users[userID]};
  res.render("urls_index", templateVars);
  res.end();
});

app.post("/urls", (req, res) => {
  let newShortUrl = generateRandomString();
  const userID = req.cookies['user_id']
  const templateVars = { urls: urlDatabase, user: users[userID],
  };
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
  res.end();
});


// LOGIN

app.get("/urls/login",  (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = { urls: urlDatabase, user: users[userID],
  };
  const user = users[userID]
  // if (user) {
  //   return res.redirect("/urls");
  // }
  res.render("urls_login", templateVars);
} );

app.post('/urls/login', (req,res) => {
    const email = req.body.email
    const password = req.body.password
    const user = getUserByEmail(email);

  if (checkForEmail(users, email) !== true)
  {return res.redirect('/urls/register') };
  
  if (!bcrypt.compareSync(password, user[email]) )
      { return res.redirect('/400') }
  
    res.cookie('user_id', user.id);
    res.redirect('/urls'); 
  });
  
// register 


app.get("/urls/register",  (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = {
    urls: urlDatabase, user: users[userID],
  };
  res.render("urls_register", templateVars);
});

app.post('/urls/register', (req,res) => {
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  const newId = generateRandomString(6);

  if (checkForEmail(users, newEmail) === true) {
    res.redirect('/400');
  }
  if (!newEmail || !newPassword) {
    res.redirect('/400');
  }
    users[newId] = {id: newId, email: newEmail, password: bcrypt.hashSync(newPassword, 10)};
    res.cookie('user_id', newId);
    res.redirect('/urls');
}
);

// logout

app.post("/logout", (req, res) => {
  res.clearCookie('user_id', req.body);
  res.redirect("/urls");
});


// create new URL

app.get("/urls/new", (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = {
    urls: urlDatabase, user: users[userID], 
  };
  if (!userID) {
  res.redirect('/urls/login')}
  else {
  res.render("urls_new", templateVars);}
});

// create short URL Show Pge
  
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['user_id']
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],  urls: urlDatabase, user: users[userID]
  };
  res.render("urls_show", templateVars);
});

// send data to short URL Show Page

app.post("/urls/:shortURL/", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");

});

// delete short URL 

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");

});


// error pages 

app.get('/400', (req,res) => {
  res.render('400');
  res.end();
});
  
// app.get('*', (req,res) => {
//   res.render('404');
//   res.end();
// });


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

