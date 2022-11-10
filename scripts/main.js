import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";
// Reusable function to get the cards on the DOM
// .forEach() iterates through every item in an array
const renderCards = (array) => {
  let refStuff = "";

  array.forEach((item) => {
    refStuff += card(item); 
  });
  renderToDom("#cards", refStuff);
} // .foreEach() gives us access to the item to manipulate it in how we see fit based on the problem we are trying to solve

// UPDATE/ADD ITEMS TO CART. 
//.includes compares primitve values to see if it is included in either a string or array
// .findIndex() & (.includes() - string method || array method)
const toggleCart = (event) => { //console.log(event.target.id); Destructuring !! .split js turns a string into an array of values
  if (event.target.id.includes("fav-btn")) { 
    const [, id] = event.target.id.split('--');
    const index = referenceList.findIndex(taco => taco.id === Number(id));

    referenceList[index].inCart = !referenceList[index].inCart
    cartTotal();
    renderCards(referenceList);
  } // primitive values: string, integer, boolean, undefined, null
} //sometimes less code is not the best code, js needs to tell a story and be readable, youre writing code for your teammates 

// SEARCH 
// .filter() creates a new array and returns a new array of values based on a condition
const search = (event) => { // callback function !!! 
  console.log(event);
  const userInput = event.target.value.toLowerCase(); //target is an element inside of an object. value is an attribute inside of target
  //console.log(eventLC); 
  const searchResult = referenceList.filter(taco => //taco is an argument were giving the filter ~1hr 26 min.
    taco.title.toLowerCase().includes(userInput) || // we need a function or a method to return something
    taco.author.toLowerCase().includes(userInput) || //anything immediately after => it's gonna return it
    taco.description.toLowerCase().includes(userInput) //if we use a code block, then we have to use the return keyword 
  )// can do event.which.keycode = or w/e enter, then if they push enter, something else will happen
  renderCards(searchResult);
} //.toLowerCase is a method so we have to use () 

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  const cart = referenceList.filter(taco => taco.inCart);
  const total = cart.reduce ((value1, value2) => value1 + value2.price, 0); 
  const free = cart.some(taco => taco.price <= 0); 
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free) {
    document.querySelector('#includes-free').innerHTML = 'INCLUDES FREE ITEMS'
  } else {
    document.querySelector('#includes-free').innerHTML = ''
  }
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining 2hr. 14 min. 11 sec.
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    const free = referenceList.filter(item => item.price <= 0);
    renderCards(free); 
    //console.log(free) to check it 
  }
  if(event.target.id.includes('cartFilter')) {
    const wishlist = referenceList.filter(item => item.inCart);
    renderCards(wishlist); 
  }
  if(event.target.id.includes('books')) {
    const books = referenceList.filter(item => item.type.toLowerCase() === 'book');
    renderCards(books);
  }
  if(event.target.id.includes('clearFilter')) {
    renderCards(referenceList);
  }
  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    
    productList().sort((a, b) => a.type.localeCompare(b.type)).forEach(item => {   //forEach is an array method 
      table += tableRow(item);
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// RESHAPE DATA TO RENDER TO DOM
// .map() always returns whatever logic we pass for it to do 
const productList = () => {
  //return [{ title: "SAMPLE TITLE", price: 45.00, type: "SAMPLE TYPE" }]
  return referenceList.map(item => ({   //item is a "taco" 
    title: item.title, 
    price: item.price, 
    type: item.type 
  })); //we are creating an array! 
} //.map returns a new array and manipulates data on our determination


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector('#searchInput').addEventListener('keyup', search)  //Callback function !! 
  // document.querySelector('#searchInput').addEventListener('keyup', (event) => {
  //   search(event)
  // })  //this is the longhand way. event is taco, you have to pass the event 
  //anytime I type and release the key which is what keyup is, it's going to run the search function.  The search function is up there on line 28
  //this is a callback function.  when you use a callback function, the function gets access to whatever arguments/properties, of the event 
  //you can pass an event listener as an anonymous function 
  //when you pass a function/a method to an event listener, the event listener automatically gets access to the event as an argument
  //anytime you add addEventListener to anything you slected on the DOM, the callback ALWAYS has access to the event
  //because the callback, the function that we're calling is search, it automatically gets access to the event
  //i want to use the event to capture the input that the user is typing into the input

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();

//querySelector is newer
//back in the day get element by ID or get element by class name
//a query selector only selects the first thing! only the first thing with that ID or class, or w/e we're targeting 
//# means ID 
