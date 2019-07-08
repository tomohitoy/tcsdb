// client-side js
// run by the browser each time your view template referencing it is loaded

console.log('hello world :o');

let dreams = [];

// define variables that reference elements on our page
const dreamsList = document.getElementById('dreams');
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements['dream'];

// a helper function to call when our request for dreams is done
const getDreamsListener = function() {
  // parse our response to convert to JSON
  dreams = JSON.parse(this.responseText);
  console.log(dreams);

  // iterate through every dream and add it to our page
  dreams.forEach( function(row) {
    appendNewDream(row);
  });
}

// request the dreams from our app's sqlite database
const dreamRequest = new XMLHttpRequest();
dreamRequest.onload = getDreamsListener;
dreamRequest.open('get', '/getDreams');
dreamRequest.send();

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = dream.dream;
  newListItem.setAttribute('id',dream.id);  
  dreamsList.appendChild(newListItem);
  
  document.getElementById(dream.id).addEventListener("click",function(){
    let xhr3 = new XMLHttpRequest();
    xhr3.open('post', '/deleteOne');
    xhr3.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    xhr3.send(`id=${dream.id}`);
    document.getElementById(dream.id).remove();
  });
}

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
  
  let xhr = new XMLHttpRequest();
  xhr.open('post', '/createDream');
  xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
  xhr.send(`dream=${dreamInput.value}`);
  
  dreamsList.innerHTML = "";
  
  const dreamRequest = new XMLHttpRequest();
  dreamRequest.onload = getDreamsListener;
  dreamRequest.open('get', '/getDreams');
  dreamRequest.send();

  // reset form 
  dreamInput.value = '';
  dreamInput.focus();
};

let deleteButton = document.getElementById('delete-all')
deleteButton.addEventListener('click', function(){
  let xhr2 = new XMLHttpRequest();
  xhr2.open('get', '/deleteAll');
  xhr2.onloadend = getDreamsListener;
  xhr2.send();
});