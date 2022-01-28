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

console.log(checkForEmail(users, 'user2@example.com'));


// for(let item in json_object){
//   console.log("ITEM = " + item);

//   for(let property in json_object[item]){
//       console.log(json_object[item][property]);
//   }
// }
