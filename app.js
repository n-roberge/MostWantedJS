"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 
// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  let results;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no': //Nick - added searchByTrait that breaks down the prompt into separate searches
      let queryPrompt = prompt(`Please type in search criteria without spaces then value.
      Seperate multiple criteria by a semicolon (no spaces around semicolon).
      Can also select "restart" or "quit".
      (example one criteria - eyecolor brown)
      (example multiple criteria - eyecolor brown;gender female)`);

      let [traitSearch,traitValue] = searchByTrait(queryPrompt);

      if (traitSearch = "eyecolor"){
        results = searchByEyeColor(people, traitValue);
      };
      searchResults = results;
      break;
      default:
    app(people); // restart app
      break;

  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){
  let criteriaMatch = [];

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }
  
  ///Nick - added if loop to check if there is one or more people found, if more than one then display a list of them
  if (person.length === 1){

    person = person[0] // Nick - added to access person object
    
    let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

    switch(displayOption){
      case "info":
      // TODO: get person's info
      displayPerson(person);
      break;
      case "family":
      // TODO: get person's family
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
  }

}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

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

function searchByOccupation(people){
  let occupation = promptFor("What is the person's occupation?", autoValid);

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

function searchByGender(people){
  let gender = promptFor("What is the person's gender?", autoValid);

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

function searchByDOB(people){
  let dob = promptFor("What is the person's date of birth (M/D/Y)?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.dob).toLowerCase() === dob){
      return true;
    }
    else{
      return false;
    }
  })
  
  return foundPerson;
}

function searchByHeight(people){
  let height = promptFor("What is the person's height in inches?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.height).toLowerCase() === height){
      return true;
    }
    else{
      return false;
    }
  })
  
  return foundPerson;
}

function searchByWeight(people){
  let weight = promptFor("What is the person's weight?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if((potentialMatch.weight).toLowerCase() === weight){
      return true;
    }
    else{
      return false;
    }
  })
  
  return foundPerson;
}

//TODO Working on this
function searchByTrait(string){
  let traitSearch ={}
  let traitValue = {}
  let searches = string.split(";");
  for (let i = 0; i < searches.length; i++){
    let searchesSplit = searches[i].split(" ");
    for (let i = 0; i < searchesSplit.length; i+=2){
      traitSearch = searchesSplit[i];
      traitValue = searchesSplit[i+1];
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
  alert(personInfo);
  app(people);
}

function displayDescendants(person, people) { //Earl - Added to display descendants of the person of choice
  let descendants = locateDescendants(person, people);
  if (descendants.length === 0) {
    descendants = "Descendants are not shown in data set."
  }
  alert(descendants);
  app(people);
}

function locateDescendants(person, people) { //Earl - Added to locate descendants/addition of grandchildren 
  let decendants = getDescendants(person, people);
  let personDescendants = " ";
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
  } while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  
}

//#endregion