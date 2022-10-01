// * ------------------ Variables ---------------- * //
// Array that holds the participants as the user types them in
let participants = [];

// Show/hide errors
let showError = false;

// Show/hide message
let showMessage = true;

// * ------------------ Event Listeners ---------------- * //
// Listen for the 'enter' key for quick data entry
document.getElementById("name").addEventListener("keyup", keyCheck);
document.getElementById("exclusions").addEventListener("keyup", keyCheck);
document.getElementById("editName").addEventListener("keyup", keyCheck);
document.getElementById("editExclusions").addEventListener("keyup", keyCheck);

// * ------------------ Utility Functions ---------------- * //
// Check for the 'enter' key, if pressed, add participant
function keyCheck(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		if(event.currentTarget.id.includes('edit')){
			handleSave();
		} else {
			handleAdd();
		}
	}
}

// Capitalize function to keep our names uniform
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

// Clears the form and moves focus back to the first name
function clearForm() {
	document.getElementById("name").value = "";
	document.getElementById("exclusions").value = "";
	document.getElementById("name").focus();
}

// Resets entire page
function handleReset() {
	participants = [];
	showMessage = true;
	document.getElementById("message").classList.remove("hide");
	let table = document.getElementById("list");
	table.innerHTML = "";
	clearForm();
	updateGenerateButtonStatus();
}

// Close modal
function closeModal(){
	document.getElementById("editModal").classList.add('hide');
}

// Enables/disables the generate matches button depending on if we have enough participants
function updateGenerateButtonStatus() {
	let generateButton = document.getElementById("generateButton");
	if (participants.length >= 3) {
		generateButton.removeAttribute("disabled");
	} else {
		generateButton.setAttribute("disabled", true);
	}
}

// Creates dom elements and returns them to the calling function
function createElement(type, classes, text) {
	let element = document.createElement(type);
	if (classes) {
		if(classes.includes(" ")){
			classArray = classes.split(" ");
			classArray.forEach(className => {
				element.classList.add(className);
			});
		} else {
			element.classList.add(classes);
		}
	}
	if (text) {
		element.appendChild(document.createTextNode(text));
	}
	return element;
}

// Returns a random person from the supplied list
function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Remove a specified element from a list
function removeElementFromList(element, list) {
	list.forEach((item, index) => {
		if (item.name === element.name) {
			list.splice(index, 1);
		}
	});
	return list;
}

// * ------------------ Data Entry Functions ---------------- * //
// Adds participants to the list
function handleAdd() {
	document.getElementById('error').classList.add('hide');
	// get name value and capitalize it
	let name = document.getElementById("name").value.capitalize();
	// get exclusions and format
	let exclusions = document.getElementById("exclusions").value;
	if (name) {
		let exclusionsArray = exclusions.split(",");
		let formattedExclusions = [];
		exclusionsArray.forEach((exclusion) => {
			formattedExclusions.push(exclusion.trim().capitalize());
		});
		// create our person object to be stored in participants
		let person = {
			name,
			match: null,
			exclusionsString: formattedExclusions.join(", ")
		};
		// Add the participant to their list of exclusions as they should never be able to pick themselves
		formattedExclusions.push(name);
		person.exclusions = formattedExclusions; // adding it here so it doesn't show in the exclusions string

		// push person to participants
		participants.push(person);
		updateGenerateButtonStatus();
		// refresh our table of participants
		refreshListOfParticipants();
		// clear the form
		clearForm();
	}
}

// * ------------------ View Functions ---------------- * //
// Refreshes the table of participants to keep our data updated
// This is NOT sustainable if there will be a ton of data. Don't do this.
function refreshListOfParticipants(list = null) {
	let participantsList = document.getElementById("list");
	// clear the list
	participantsList.innerHTML = "";

	if (list === null) {
		let participants = list;
	}

	// Show/hide message
	if (participants.length > 0) {
		showMessage = false;
		document.getElementById("message").classList.add("hide");
	} else {
		showMessage = true;
		document.getElementById("message").classList.remove("hide");
	}

	// Sort through the list of participants and create table rows
	participants.forEach((person, index) => {
		let personElement = createElement("tr", "participant");
		let indexElement = createElement("td", "num", (index + 1).toString());
		let nameElement = createElement("td", "name", person.name);
		let exclusionElement = createElement(
			"td",
			"exclusions",
			person.exclusionsString
		);
		let matchElement = createElement(
			"td",
			"match",
			person.match !== null ? person.match.name : ""
		);

		// Set up controls
		let controlElement = createElement("td", "util");
		// Edit
		let editElement = createElement("button");
		editElement.appendChild(createElement('i','icon-pencil icon'));
		editElement.setAttribute("id", "edit-" + index);
		editElement.addEventListener("click", handleEdit);
		// Delete
		let deleteElement = createElement("button");
		deleteElement.appendChild(createElement('i','icon-trash icon'));
		deleteElement.setAttribute("id", "delete-" + index);
		deleteElement.addEventListener("click", handleDelete);

		// Add edit/delete buttons to control
		controlElement.appendChild(editElement);
		controlElement.appendChild(deleteElement);

		// create row
		personElement.appendChild(indexElement);
		personElement.appendChild(nameElement);
		personElement.appendChild(exclusionElement);
		personElement.appendChild(matchElement);
		personElement.appendChild(controlElement);
		participantsList.appendChild(personElement);
	});
}

// allows user to edit participants
function handleEdit(event) {
	let idString = event.currentTarget.id;
	let index = idString.slice((idString.indexOf("-")+1));
	let participant = participants[index];
	document.getElementById('saveButton').setAttribute('data-index',index);
	document.getElementById('editName').value = participant.name;
	document.getElementById('editExclusions').value = participant.exclusionsString;
document.getElementById('editModal').classList.remove('hide');
	document.getElementById("editName").focus();
}

function handleSave(event){
	let index = document.getElementById('saveButton').getAttribute('data-index');
	let name = document.getElementById("editName").value.capitalize();
	// get exclusions and format
	let exclusions = document.getElementById("editExclusions").value;
	let participantList = JSON.parse(JSON.stringify(participants));
	participantList[index].name = name;
	if(name){
		// Format exclusions
		let exclusionsArray = exclusions.split(",");
		let formattedExclusions = [];
		exclusionsArray.forEach((exclusion) => {
			formattedExclusions.push(exclusion.trim().capitalize());
		});
		participantList[index].exclusionsString = formattedExclusions.join(", ");
		if(!formattedExclusions.includes(name)){
			exclusionsArray.push(name);
		}
		participantList[index].exclusions = exclusionsArray;
		
		// Update participants list
		participants = participantList;
		document.getElementById('editModal').classList.add('hide');
		refreshListOfParticipants();
	}
}

// Deletes participants from the list
function handleDelete(event) {
	let idString = event.currentTarget.id;
	let index = idString.slice((idString.indexOf("-")+1));
	participants.splice(index,1);
	refreshListOfParticipants();
}

// * ------------------ Picker Functions ---------------- * //
// Generate matches, ensuring that no one gets matched with someone in their exclusions list
function generateMatches() {
	let matchesArePossible = areMatchesPossible();
	if (matchesArePossible) {
		// Create clones for our participant list and picker list
		let participantList = JSON.parse(JSON.stringify(participants));
		let pickerList = JSON.parse(JSON.stringify(participants));
		let stalemate;
		// Go through the list of participants to choose a match for each picker
		participants.forEach((picker) => {
			let pick = getRandomElement(participantList);
			let isExcluded = isPickExcluded(pick, picker);
			while (isExcluded === true) {
				pick = getRandomElement(participantList);
				isExcluded = isPickExcluded(pick, picker);
				stalemate = checkForStalemate(picker, participantList);
				if (stalemate === true) {
					break;
				}
			}
			if (stalemate === true) {
				generateMatches();
			} else {
				if (!isExcluded) {
					applyPick(picker, pick);
					// Remove the participant so they can't be chosen again
					participantList = removeElementFromList(pick, participantList);
				}
			}
		});
		showError = false;
		document.getElementById("error").classList.add("hide");
	} else {
		showError = true;
		document.getElementById("error").classList.remove("hide");
	}
}

// Add the picked person to the picker's object, then update the particpants table
function applyPick(picker, name) {
	let newList = [];
	const people = JSON.parse(JSON.stringify(participants));
	people.forEach((person) => {
		if (person.name === picker.name) {
			person.match = name;
		}
		newList.push(person);
	});
	participants = newList;
	refreshListOfParticipants(newList);
}

// Checks to see if the pick is in the excluded list
function isPickExcluded(pick, picker) {
	return picker.exclusions.includes(pick.name);
}

// Compares the picker's exclusions to the participant list to check for a stalemate
function checkForStalemate(picker, participantList) {
	let exclusions = picker.exclusions;
	let options = [];
	participantList.forEach((person) => options.push(person.name));
	return options.every((option) => exclusions.includes(option));
}

// Loops through all of the participants to determine if any two
// participants have the same list of potential matches
function areMatchesPossible() {
	let people = [];
	// create people list with potential matches
	participants.forEach((person) => {
		let possibleMatches = [];
		participants.forEach((potentialMatch) => {
			if (!person.exclusions.includes(potentialMatch.name)) {
				possibleMatches.push(potentialMatch.name);
			}
		});
		people.push({ name: person.name, possibleMatches: possibleMatches.sort() });
	});

	let areMatchesPossible = true;
	people.forEach((person) => {
		if (person.possibleMatches.length === 1) {
			people.forEach((match) => {
				if (person.name != match.name) {
					// if the person only has 1 potential match, we could have a stalemate if
					// someone else also only has 1 potential match and they have the same one as
					// the original person
					if (
						JSON.stringify(person.possibleMatches) ===
						JSON.stringify(match.possibleMatches)
					) {
						areMatchesPossible = false;
					}
				}
			});
		}
	});

	return areMatchesPossible;
}