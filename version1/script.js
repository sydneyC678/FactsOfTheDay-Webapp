/*
Types of data:
category, created, text, source, interestingvotes, mindblowingvotes, falsevotes, 
*/

//array of objects for the categories
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

//Selecting DOM elements and storing them into new variables
const fact_button = document.querySelector(".fact-button");
const form = document.querySelector(".fact-form");
const fact_list = document.querySelector(".fact-list");

fact_list.innerHTML = ""; //page ready for new data

//Loading the data from Supabase
loadFacts();

async function loadFacts() {
  //Request to an API
  const res = await fetch(
    "https://jxvseqprkejktgtrcolk.supabase.co/rest/v1/Facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dnNlcXBya2Vqa3RndHJjb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTQ3MTQsImV4cCI6MjAxOTU3MDcxNH0.WnXybZU3s4LNkI4lSB-wX4URgk7OBwpn4lGK_zGtKKY",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dnNlcXBya2Vqa3RndHJjb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTQ3MTQsImV4cCI6MjAxOTU3MDcxNH0.WnXybZU3s4LNkI4lSB-wX4URgk7OBwpn4lGK_zGtKKY",
      },
    }
  );
  const data = await res.json(); //await for function that return promises

  createFactList(data);
}

//creating a function that will allow a fact to be created and listed on the website
//this function will then be used when fetching data from the database
function createFactList(dataArray) {
  const arr = dataArray.map(
    (fact) => `<li class = "fact">
        <p>
       
      ${fact.text}
        <a
          class="source"
          href=${fact.source}
          target="_blank"
          >(Source)</a>
        </p>
        <span class="tag" style="background-color: ${
          CATEGORIES.find((cat) => cat.name === fact.category).color
        }">${fact.category}</span>
      
      </li>
      `
  );
  const html = arr.join("");
  fact_list.insertAdjacentHTML("afterbegin", html);
}

//creating a button that opens and closes a form if a user clicks the "share a fact" buttton
fact_button.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    fact_button.textContent = "Close"; //chages the text of the button
  } else {
    form.classList.add("hidden");
    fact_button.textContent = "Share a fact!";
  }
});
