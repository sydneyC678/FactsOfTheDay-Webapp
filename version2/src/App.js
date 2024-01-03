import "./style.css";
import { useEffect, useState } from "react";
import supabase from "./supabase";

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

function App() {
  //defs
  const [show, set] = useState(false);
  const display = () => set(!show);
  const [facts, setFacts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentCategory, setCategory] = useState("all");

  //fetching the data from supabase as soon as the application loads --> only once
  useEffect(
    function () {
      async function getFacts() {
        setLoading(true);

        let query = supabase.from("Facts").select("*");

        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }

        const { data: Facts, error } = await query
          .order("interestingvotes", { ascending: false })
          .limit(500); //methods from supabase library

        //error handling
        if (!error) setFacts(Facts);
        else alert("Error! Problem loading the data");
        setFacts(Facts);
        setLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  ); //empty array allows for it to load once it renders (just once) --> adding currentCategory so that the data is loaded again on a button click

  return (
    <>
      {/* Header */}
      <Header display={display} show={show} />
      {/* Child Components */}
      {show && <NewFact setFacts={setFacts} set={set} />}{" "}
      {/* if "show" is true -> display the new fact, if "show" is false, it does not render*/}
      <main className="main">
        <Category setCategory={setCategory} />
        {isLoading ? <Load /> : <FactList facts={facts} setFacts={setFacts} />}
      </main>
    </>
  );
}

//Javascript functions that will be used in the root App() function
//Making them all return the different layouts (original --> html document) + CSS styling
//helps organize the code
function Load() {
  return <p className="load">Loading..</p>;
}
function Header({ display, show }) {
  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <img src="logo.png" alt="Logo of Fun Facts of the Day!" />
        <h1>Fun Facts of the Day!</h1>
      </div>
      {/* "Share a Fact!" Button */}
      <button className="btn large-button fact-button" onClick={display}>
        {" "}
        {/* Updating the state of the variable on the click of the button */}
        {show ? "Close" : "Share a Fact!"}
      </button>
    </header>
  );
}
//function that checks if URL is valid
function URLValidity(text) {
  let url;
  try {
    url = new URL(text);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https";
}
function NewFact({ setFacts, set }) {
  //Form that is created when the "Share a Fact!" button is clicked
  //FIX -> Block user from typing more than 200 words
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  async function Submission(e) {
    //preventing the page from reloading after the submission
    e.preventDefault();

    //Checking if the data is valid, if its valid create a new fact
    /*
    - text has to be less than or equal to 200
    - has to have valid source (URL)
    
    */
    if (text && URLValidity(source) && category && textLength <= 200) {
      //Creating a new fact object

      //Loading a fact to supabase -> get the new fact
      const { data: newFact, error } = await supabase
        .from("Facts")
        .insert([{ text, source, category }])
        .select();

      //Add the new fact to the state
      if (!error) setFacts((facts) => [newFact[0], ...facts]); //appending the newFact to the other facts, so the newFact is added at the begining
      //and setFacts is updating it

      //Reset the input fields to empty
      setText("");
      setSource("");
      setCategory("");

      //Close the form
      set(false);
    } else {
      alert("Please enter a valid field!");
    }
  }
  return (
    <form className="fact-form" onSubmit={Submission}>
      <input
        type="text"
        placeholder="Share a fun fact!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <span>{200 - textLength}</span>
      <input
        //make sure input follows the write categories of
        type="text"
        placeholder="Trustworthy source"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category:</option>
        {CATEGORIES.map((category) => (
          <option key={category.name} value={category.name}>
            {category.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button type="submit" className="btn large-button">
        Post
      </button>
    </form>
  );
}

function FactList({ facts, setFacts }) {
  //Displays the list of facts

  if (facts.length === 0) {
    return <p className="load">No facts in this category!</p>;
  }
  return (
    <section>
      <ul className="fact-list">
        {facts.map((fact) => (
          <Fact
            key={fact.id} //for optimization
            factObj={fact}
            setFacts={setFacts}
          />
        ))}
      </ul>
    </section>
  );
}

//Function that makes each fact its own component
function Fact({ factObj, setFacts }) {
  async function Votes(string) {
    const { data: update, error } = await supabase
      .from("Facts")
      .update({ [string]: factObj[string] + 1 })
      .eq("id", factObj.id)
      .select();

    if (!error) {
      setFacts((facts) =>
        facts.map((f) =>
          f.id === factObj.id
            ? { ...f, [string]: update[0][string] } // Fixed syntax here
            : f
        )
      );
    }
  }

  return (
    <li className="fact">
      <p>
        {factObj.text};
        <a
          className="source"
          href={factObj.source}
          rel="noreferrer"
          target="_blank"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find(
            (cat) => cat.name === factObj.category
          ).color,
        }}
      >
        {factObj.category}
      </span>

      <div className="reactions">
        <button onClick={() => Votes("interestingvotes")}>
          <span role="img" aria-label="thumbs-up">
            👍
          </span>
          {factObj.interestingvotes}
        </button>
        <button onClick={() => Votes("mindblowingvotes")}>
          <span role="img" aria-label="mind-blown">
            🤯
          </span>{" "}
          {factObj.mindblowingvotes}
        </button>
        <button onClick={() => Votes("falsevotes")}>
          <span role="img" aria-label="false">
            ⛔️
          </span>
          {factObj.falsevotes}
        </button>
      </div>
    </li>
  );
}

function Category({ setCategory }) {
  //The side navigation that contains the different category sections

  //render a list of the categries using the CATEGORIES array

  return (
    <aside className="nav">
      <ul>
        <li className="category">
          <button className="btn all-button" onClick={() => setCategory("all")}>
            All
          </button>
        </li>
        {CATEGORIES.map((categories) => (
          <li key={categories.name} clasName="category">
            <button
              className="btn category-button"
              style={{ backgroundColor: categories.color }}
              onClick={() => setCategory(categories.name)}
            >
              {categories.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default App;

