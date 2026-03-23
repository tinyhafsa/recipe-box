import axios from "axios";
import "./RecipeCard.css";
import { useState, useEffect } from "react";

// API
const mealToRecipe = (meal) => {
  const ingredients = [];

  // ingredients + measurements
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    // add only valid ingredients
    if (ingredient && ingredient.trim()) {
      ingredients.push(
        `${measure ? measure.trim() : ""} ${ingredient.trim()}`.trim()
      );
    }
  }

  // API object converted into recipe structure
  return {
    title: meal.strMeal || "",
    image: meal.strMealThumb || "",
    ingredients,
    instructions: meal.strInstructions || "",
  };
};

// edit mode function
function RecipeCard({ recipe, editMode: propEditMode = false, onSave, onDelete }) {
  const [flipped, setFlipped] = useState(false); // card front and back
  const [localRecipe, setLocalRecipe] = useState(recipe); // editable copy
  const [editMode, setEditMode] = useState(propEditMode); // edit mode

  useEffect(() => {
    setLocalRecipe(recipe);
  }, [recipe]);
 
  // recipe search, loading, errors and results
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  // close pop-up
  const closeModal = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    setSearchError("");
  };

  // search recipes from API
  const searchMeals = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError("");

      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
      );

      setSearchResults(res.data.meals || []);
    } catch (err) {
      setSearchError("Failed to search recipes");
    } finally {
      setSearchLoading(false);
    }
};

  // select recipe and import it into recipe card
  const handleSelectMeal = (meal) => {
    const mapped = mealToRecipe(meal);
    setLocalRecipe((prev) => ({ ...prev, ...mapped }));
    setSearchResults([]);
    setSearchQuery("");
};

  // save recipe
  const handleSave = () => {
  onSave(localRecipe); 
  setEditMode(false);
  };
  // delete recipe
  const handleDelete = () => {
    onDelete(recipe._id);
  };

  return (
    <div className={`recipe-card ${flipped ? "flipped" : ""}`}>

      {/* CARD FRONT */}
      <div
        className="front"
        onClick={!editMode ? () => setFlipped(true) : undefined} 
      >
        {/* EDIT MODE */}
        {editMode ? (
          <>
            {/* title */}
            <input className="recipe-title-input"
              value={localRecipe.title}
              onChange={(e) =>
                setLocalRecipe({ ...localRecipe, title: e.target.value })
              }
              placeholder="Recipe title"
            />
            {/* image url */}
            <input
              value={localRecipe.image}
              onChange={(e) =>
                setLocalRecipe({ ...localRecipe, image: e.target.value })
              }
              placeholder="Image URL"
            />
            {/* image */}
            {localRecipe.image && (
              <img src={localRecipe.image} alt="recipe preview"
              className="recipe-image" />
            )}
            {/* buttons */}
            <div className="button-group">
              <button type="button" onClick={() => setFlipped(true)}>
                Add Ingredients & Instructions
              </button> 

              {/* search API */}
              <button
              type="button"
              className="import-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowSearchModal(true);
              }}
              >
                Search List
              </button>
            </div>
          </>
        ) : (
          <>
          {/* DISPLAY MODE */}
            {/* title */}
            <h3>{recipe.title}</h3>
            {/* image */}
            {recipe.image && <img src={recipe.image} alt="recipe" className="recipe-image"/>}
            {/* edit button */}
            <button
              className="edit-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation(); 
                setEditMode(true);
              }}
            >
              Edit Recipe
            </button>
          </>
        )}
      </div>

      {/* BACK */}
      <div className="back" onClick={!editMode ? () => setFlipped(false) : undefined}>
        {/* EDIT MODE */}
        {editMode ? (
          <>
            <div className="edit-columns">
              {/* ingredients */}
              <div className="ingredients-section">
                <h4>Ingredients</h4>
                <textarea
                  value={localRecipe.ingredients.join("\n")}
                  onChange={(e) =>
                    setLocalRecipe({
                      ...localRecipe,
                      ingredients: e.target.value.split("\n"),
                    })
                  }
                  placeholder="One ingredient per line"
                />
              </div>

              {/* instructions */}
              <div className="instructions-section">
                <h4>Instructions</h4>
                <textarea
                  value={localRecipe.instructions}
                  onChange={(e) =>
                    setLocalRecipe({
                      ...localRecipe,
                      instructions: e.target.value,
                    })
                  }
                  placeholder="Cooking steps..."
                />
              </div>
            </div>
            {/* button group */}
            <div className="button-group">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleDelete}>Delete</button>
              <button type="button" onClick={() => setFlipped(false)}>
                Back to Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocalRecipe(recipe);
                  setEditMode(false);
                }}
              >
                Cancel Edit
              </button>
            </div>
          </>
        ) : (
          // DISPLAY MODE
          <div
            className="display-sections"
            style={{ display: "flex", gap: "1rem" }}
          >
            {/* ingredients */}
            <div
              className="ingredients-section"
              style={{ maxWidth: "200px", overflowY: "auto" }}
            >
              <h4>Ingredients</h4>
              <ul>
                {recipe.ingredients.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </div>
            {/* instructions */}
            <div
              className="instructions-section"
              style={{ flex: 1, overflowY: "auto" }}
            >
              <h4>Instructions</h4>
              <ul>
                {recipe.instructions
                  .split("\n")
                  .filter((line) => line.trim() !== "") // remove empty lines
                  .map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* API popup to search recipes */}
      {showSearchModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* title */}
            <h3>Search TheMealDB</h3>
            {/* search bar */}
            <div className="search-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipe title..."
              />
              {/* search button */}
              <button type="button" onClick={searchMeals}>
                Search
              </button>
            </div>

            {/* loading */}
            {searchLoading && <p>Searching...</p>}
            {searchError && <p className="error">{searchError}</p>}

            {/* search results */}
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((meal) => (
                  <li key={meal.idMeal}>
                    <span>{meal.strMeal}</span>
                    
                    {/* button to put searched recipe into card */}
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectMeal(meal);
                        closeModal();
                      }}
                    >
                      Use
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* close button */}
            <button
              type="button"
              className="close-btn"
              onClick={() => closeModal()}
            >
              Close
            </button>
          </div>
        </div>
      )}
  

    </div>
  );
}

// export card
export default RecipeCard;