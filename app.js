"use strict"

//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 
// app is the function called to start the entire application
function app(people){
  createTraitValueArrays(people)

  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;

  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no': //Nick - added searchByTrait that breaks down the prompt into separate searches
      let queryPrompt = promptFor("Please type in search criteria without spaces then value.\nSeperate multiple criteria by a semicolon (no spaces around semicolon).\n\nCan also select 'restart' or 'quit'\n\n(example one criteria - eyecolor brown)\n(example multiple criteria - eyecolor brown;gender female)", queryPromptValid);

      if (queryPrompt.toLowerCase() === 'quit'){
        return;
      }
      else if (queryPrompt.toLowerCase() === 'restart'){
        app(people);
      }
      else{
        let [traitSearch,traitValue] = searchByTrait(queryPrompt);
        searchResults = filterSearch(traitSearch, traitValue, people);
      };
      break;
    default:
      app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

//Nick - takes the user input for multi-trait and breaks down separate searches and criteria, then filters out people by the criteria
function filterSearch(traitSearch, traitValue, people){
  let results = people;
  let traitFilter = [];
  for (let i = 0; i < traitSearch.length; i++){
    if (traitSearch[i] === "eyecolor"){
      traitFilter = searchByEyeColor(people, traitValue[i]);
      results = results.filter(({id}) => traitFilter.some(x => x.id === id))
    }
    else if (traitSearch[i] === "occupation"){
      traitFilter = searchByOccupation(people, traitValue[i]);
      results = results.filter(({id}) => traitFilter.some(x => x.id === id))
    }
    else if (traitSearch[i] === "dob"){
      traitFilter = searchByDOB(people, traitValue[i]);
      results = results.filter(({id}) => traitFilter.some(x => x.id === id))
    }
    else if (traitSearch[i] === "height"){
      traitFilter = searchByHeight(people, traitValue[i]);
      results = results.filter(({id}) => traitFilter.some(x => x.id === id))
    }
    else if (traitSearch[i] === "weight"){
      traitFilter = searchByWeight(people, traitValue[i]);
      results = results.filter(({id}) => traitFilter.some(x => x.id === id))
    }
   
    else if (traitSearch[i] === "gender"){
      traitFilter = searchByGender(people, traitValue[i]);
      results = results.filter(({id}) => traitFilter.some(x => x.id === id))
    }
  };
  return results;
};

// Menu function to call once you find who you are looking for
function mainMenu(person, people){
  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person || person.length === 0){
    alert("Could not find that individual.");
    return app(people); // restart
  }
  
  ///Nick - added if loop to check if there is one or more people found, if more than one then display a list of them
  if (person.length === 1){

    person = person[0] // Nick - added to access person object
    
    let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", displayOptionValid);

    switch(displayOption){
      case "info":
      // TODO: get person's info
      displayPerson(person);
      break;
      case "family":
      // TODO: get person's family
      displayFamily(person, people)
      break;
      case "descendants":
      // TODO: get person's descendants
      displayDescendants(person, people);
      break;
      case "restart":
      app(people); // restart
      break;
      case "quit":
      return; // stop execution
      default:
      return mainMenu(person, people); // ask again
    }
  }
  else{
    displayPeople(person);
    app(people);
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

function searchByName(people){ 
  let firstName = firstNameValid(people);
  let lastName = lastNameValid(people);

  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.firstName).toLowerCase() === firstName && (potentialMatch.lastName).toLowerCase() === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson;
}

function searchByEyeColor(people, eyeColor){
  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.eyeColor).toLowerCase() === eyeColor){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson;
}

function searchByOccupation(people, occupation){
  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.occupation).toLowerCase() === occupation){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson;
}

function searchByGender(people, gender){
  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.gender).toLowerCase() === gender){
      return true;
    }
    else{
      return false;
    }
  }) 
  return foundPerson;
}

function searchByDOB(people, dob){
  let foundPerson = people.filter(function(potentialMatch){
    if (potentialMatch.dob === dob){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson;
}

function searchByHeight(people, height){
  height = Number(height);
  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.height === height){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson;
}

function searchByWeight(people, weight){
  weight = Number(weight);
  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.weight === weight){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson;
}

//Nick - function to read one or more searches from user input
function searchByTrait(string){
  let traitSearch =[];
  let traitValue = [];
  let searches = string.split(";");
  for (let i = 0; i < searches.length; i++){
    let searchesSplit = searches[i].split(" ");
    for (let i = 0; i < searchesSplit.length; i+=2){
      traitSearch.push(searchesSplit[i]);
      traitValue.push(searchesSplit[i+1]);
    };
  }
  return [traitSearch, traitValue];
}

//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){ //Earl - Added to display person of choice information
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "DOB: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";

  // TODO: finish getting the rest of the information to display.
alert(`Please see information below: 

${personInfo}`);
}

function displayFamily(person, people) {
  let parent = getParents(person, people);
  let children = getChildren(person, people);
  let spouse = getSpouse(person, people);//Nick - added

  let wholeFamily = "Parents: " + parent + "\n" + "Children: " + children + "\n" + "Spouse: " + spouse;

  alert(wholeFamily);
  app(people);
}

function displayDescendants(person, people) { //Earl - Added to display descendants of the person of choice
  let descendants = locateDescendants(person, people);
  if (descendants.length === 0) {
    descendants = "Descendants are not shown in data set."
  }
alert(`Descendants are displayed below: 

${descendants}`);
  app(people);
}

function locateDescendants(person, people) { //Earl - Added to locate descendants/addition of grandchildren 
  let decendants = getDescendants(person, people);
  let personDescendants = [];
  for (let index = 0; index < decendants.length; index++) {
    personDescendants = personDescendants + decendants[index].firstName + " " + decendants[index].lastName + " ";
    if (index >= 0) {
      let grandKids = locateDescendants(decendants[index], people);
      personDescendants = personDescendants + grandKids;
    }
  }
  return personDescendants;
}

function getDescendants(person, people) { //Earl - Added to access descendant object by person.id
  let descendants = [];
  descendants = people.filter(function(potentialMatch) {
    if (potentialMatch.parents.length === 0) {
      return false;
    }
    else if (potentialMatch.parents[0]=== person.id || potentialMatch.parents[1] === person.id) {
      return true;
    }
  });
  return descendants;
}

function getParents(person, people) { //Earl - added function to getParents when family is requested 
  let parents = [];
  let personParents = [];
    if (person.parents.length === 0) {
      return "There are no parents located in the database ";
    }
    else {
      parents = people.filter(function(potentialMatch) {
      if (potentialMatch.id === person.parents[0] || potentialMatch.id === person.parents[1]) {
      return true;
    }
  });
}
  for (let index = 0; index < parents.length; index++) {
    personParents = personParents + parents[index].firstName + " " + parents[index].lastName + " ";
  }
  return personParents;
}

function getChildren(person, people) { //Earl - added function to getChildren when family is requested (Function is not operational!)
  let kids = [];
  let personChildren = [];
  kids = people.filter(function(potentialMatch) {//Nick - changed the if loop
    if (potentialMatch.parents[0] === person.id || potentialMatch.parents[1] === person.id) {
      return true;
    }
  });
  if (kids.length === 0){
    return "There are no children located in the database"
  }
  else {
    for (let index = 0; index < kids.length; index++) {
      personChildren = personChildren + kids[index].firstName + " " + kids[index].lastName + " ";
    }
  }
  return personChildren;
}

function getSpouse(person, people) { 
  let spouse = [];
  let personSpouse = [];
  spouse = people.filter(function(potentialMatch) {
    if (potentialMatch.currentSpouse === person.id) {
      return true;
    }
  });
  if (spouse.length === 0){
    return "There is no spouse located in the database"
  }
  else {
    personSpouse = personSpouse + spouse[0].firstName + " " + spouse[0].lastName + " ";
  }
  
  return personSpouse;
}
//#endregion

//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } 
  while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    alert("Please enter 'yes' or 'no'.")
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Nick - name validation that creates array of the first and last names and checks if input matches a name in database
function firstNameValid(people){
  let firstNameArray = [];
  for (let i=0;i<people.length;i++){
    firstNameArray = firstNameArray.concat(people[i]["firstName"])
  }
  for (let item in firstNameArray){
    firstNameArray[item] = firstNameArray[item].toLowerCase()
  }

  let firstName = prompt("What is the person's first name?");

  if(firstNameArray.includes(firstName)){
    return firstName;
  }
  else{
    alert("Invalid first name.")
  }
}

function lastNameValid(people){
  let lastNameArray = [];
  for (let i=0;i<people.length;i++){
    lastNameArray = lastNameArray.concat(people[i]["lastName"])
  }
  for (let item in lastNameArray){
    lastNameArray[item] = lastNameArray[item].toLowerCase()
  }

  let lastName = prompt("What is the person's last name?");

  if(lastNameArray.includes(lastName)){
    return lastName;
  }
  else{
    alert("Invalid last name.")
  }
}

//Nick - display option prompt validation
function displayOptionValid(input){
  let validInput = ['info','family','descendants','restart','quit'];
  if(validInput.includes(input.toLowerCase())){
    return true;
  }
  else{
    alert("Please enter a valid input.")
    return false;
  }
}

//Nick - arrays of valid responses for traits
let traitKeyArray = ['gender', 'dob', 'height', 'weight', 'eyecolor', 'occupation'];
let traitValueArray = [];

function createTraitValueArrays(people){
  for (let i=0;i<people.length;i++){
    let individualPerson = people[i]
    traitValueArray = traitValueArray.concat(Object.values(individualPerson))
  }
  return(traitValueArray)
};

//Nick - multi-trait or single trait prompt validation
function queryPromptValid(input){
  let [traitSearch,traitValue] = searchByTrait(input)

  if(traitSearch.every(r => traitKeyArray.includes(r)) && traitValue.every(r => traitValueArray.includes(r)) || input === "quit" || input === "restart"){
    return true
  }
  else{
    alert("Please enter a valid input.")
    return false;
  }
}

//#endregion