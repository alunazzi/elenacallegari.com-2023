// NAVBAR MANAGER ///////////////////////////////////////////////////////////////////////
const navToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.primary-navigation');

navToggle.addEventListener('click', () => {
  primaryNav.hasAttribute('data-visible') 
    ? navToggle.setAttribute('aria-expanded', false)
    : navToggle.setAttribute('aria-expanded', true);
  primaryNav.toggleAttribute('data-visible');
})



// THEME SWITCHER ///////////////////////////////////////////////////////////////////////
let theme = localStorage.getItem('theme');
const btnSwitch = document.querySelector("#btn-switch");
const themeswitcherbtn = document.querySelector('#img-themeswitcher');
const logoNavbar = document.querySelector("#logo-navbar");
const logoFooter = document.querySelector("#logo-footer");

// theme switch logic
const switchTheme = () => {
  console.log("pressed");
  theme = localStorage.getItem('theme');
  // if the variable does not exist force the value for the light theme (firefox fix)
  if (theme === null) {   // BEGIN: firefox fix
    theme = 'light';
  }   // END: firefox fix
  if (theme === 'light') {
    activateDarkTheme();
    console.log("Activate DARK");
  } else if (theme === 'dark'){
    activateLightTheme();
    console.log("Activate LIGHT");
  }
}

// steps to activate the dark theme
const activateDarkTheme = () => {
  localStorage.setItem('theme', 'dark')
  themeswitcherbtn.src = 'images/sun.png';
  logoNavbar.src = "images/logo_dark.png";
  logoFooter.src = "images/logo_dark.png";
  document.documentElement.setAttribute('data-theme', 'dark');
}

// steps to activate the light theme
const activateLightTheme = () => {
  localStorage.setItem('theme', 'light')
  themeswitcherbtn.src = 'images/moon.png';
  logoNavbar.src = "images/logo_bright.png";
  logoFooter.src = "images/logo_bright.png";
  document.documentElement.setAttribute('data-theme', 'light');
}

// if the active theme is the dark one, then activate it on page load
if (theme === 'dark') {
  activateDarkTheme();
}

// event handler for the button
btnSwitch.addEventListener('click', switchTheme);



// DOCUMENT MANAGER (show more / show less) /////////////////////////////////////////////
const NUMBER_OF_ITEMS = 6;
// targeting the container inside the "#papers" div
const papersContainer = document.querySelectorAll('#papers .container');
// getting all the publication cards
const publications = document.querySelectorAll('.publication-card');
// counting all the publication cards
const initialPublicationNo = document.querySelectorAll('.publication-card').length;
let currentPublicationNo = initialPublicationNo;

initializeLayout();

function initializeLayout() {

  const actionContainer = document.createElement('div');
  actionContainer.setAttribute("id", "action-container");
  actionContainer.innerHTML = (`
    <div id="number-of-items">
    </div>
    <div id="message">
      <p></p>
    </div>
    <div id="actions">
    </div>
  `);

  papersContainer[0].appendChild(actionContainer);

  // targeting the created divs (se above)
  const actionsDiv = document.getElementById('actions');
  const itemNoDiv = document.getElementById('number-of-items');

  // create a p tag
  const numberOfItems = document.createElement('p');
  numberOfItems.innerText = 'Showing ' + currentPublicationNo + ' of ' + initialPublicationNo + ' items.';

  // append the buttons to the "#actions" div
  itemNoDiv.appendChild(numberOfItems);

  // create the action buttons
  const btnMore = document.createElement('button');
  const btnLess = document.createElement('button');
  const btnAll = document.createElement('button');
  const btnReset = document.createElement('button');

  // assign the text and the function to the action buttons
  btnMore.innerText = 'Show More';
  btnMore.setAttribute('onclick','javascript: showMore(NUMBER_OF_ITEMS)');

  btnAll.innerText = 'Show All';
  btnAll.setAttribute('onclick','javascript: showAll()');

  btnLess.innerText = 'Show Less';
  btnLess.setAttribute('onclick','javascript: showLess(NUMBER_OF_ITEMS)');

  btnReset.innerText = 'Reset';
  btnReset.setAttribute('onclick','javascript: initializeAndReset(NUMBER_OF_ITEMS)');

  // append the buttons to the "#actions" div
  actionsDiv.appendChild(btnMore);
  actionsDiv.appendChild(btnAll);
  actionsDiv.appendChild(btnLess);
  actionsDiv.appendChild(btnReset);

  initializeAndReset(NUMBER_OF_ITEMS, true);

}

function showAll() {
  publications.forEach(publication => { publication.classList.add('card-shown');
                                        publication.classList.remove('card-hidden'); });
  updateNumberOfItems(publications.length, initialPublicationNo);
}

function initializeAndReset(howMany, skipChecks) {
  for(i = 0; i < initialPublicationNo; i++) {
    if (i < howMany) {
      publications[i].classList.add('card-shown');
      publications[i].classList.remove('card-hidden');
    } else {
      publications[i].classList.add('card-hidden');
      publications[i].classList.remove('card-shown');
    }
  }
  updateNumberOfItems(howMany, initialPublicationNo, skipChecks);
  // if the button is pressed it takes the user back to the papers section
  if (!skipChecks) {
    window.location.href = '#papers';
  }
}

function showMore(howMany) {
  currentPublicationNo = document.querySelectorAll('.card-shown').length;
  for(i = currentPublicationNo; i <= currentPublicationNo + (howMany - 1); i++) {
    if (i < initialPublicationNo) {
      publications[i].classList.remove('card-hidden');
      publications[i].classList.add('card-shown');
    }
  }
  currentPublicationNo = currentPublicationNo + howMany;
  // currentPubblicationNo cannot be higher than the initial number of publications (initialiPublicationNo)
  if (currentPublicationNo > initialPublicationNo) {
    currentPublicationNo = initialPublicationNo;
  }
  updateNumberOfItems(currentPublicationNo, initialPublicationNo, false);
}

function showLess(howMany) {
  currentPublicationNo = document.querySelectorAll('.card-shown').length;
  if (currentPublicationNo > howMany) {
    // "reverse for loop" to target the last items of the array
    for(i = currentPublicationNo - 1; i >= currentPublicationNo - howMany; i--) {
      publications[i].classList.remove('card-shown');
      publications[i].classList.add('card-hidden');
    }
    currentPublicationNo = currentPublicationNo - howMany;
  }
  updateNumberOfItems(currentPublicationNo, initialPublicationNo, false);
}

function updateNumberOfItems(currentItemsNo, maxItemsNo, skipChecks) {
  // updating the inner text of the p tag inside the div "#number-of-items"
  document.querySelectorAll('#number-of-items p')[0].innerText = 'Showing ' + currentItemsNo + ' of ' + maxItemsNo + ' items.';
  message(currentItemsNo, maxItemsNo, skipChecks);
}

async function message(currentItemsNo, maxItemsNo, skipChecks) {  
  if (skipChecks === true) {
    document.querySelectorAll('#message p')[0].innerText = 'Click on the buttons to see more.';
    document.querySelectorAll('#message p')[0].classList.remove('red-message');
  } else {
    if (currentItemsNo >= maxItemsNo){
      console.log("a");
      document.querySelectorAll('#message p')[0].innerText = 'All documents are listed.';
      document.querySelectorAll('#message p')[0].classList.add('red-message');
      document.querySelectorAll('#message p')[0].classList.add('shake');
      await sleep(500);
      document.querySelectorAll('#message p')[0].classList.remove('shake');
    } else if (currentItemsNo <= NUMBER_OF_ITEMS) { 
      console.log("b");
      document.querySelectorAll('#message p')[0].innerText = 'Cannot show fewer documents.';
      document.querySelectorAll('#message p')[0].classList.add('red-message');
      document.querySelectorAll('#message p')[0].classList.add('shake');
      await sleep(500);
      document.querySelectorAll('#message p')[0].classList.remove('shake');
    } else {
      document.querySelectorAll('#message p')[0].innerText = 'Click on the buttons to see more.';
      document.querySelectorAll('#message p')[0].classList.remove('red-message');
    }
  }
}

// sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}