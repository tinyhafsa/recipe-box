import { useState, useEffect } from "react"; // react hooks for states
import RecipeCard from "../../components/RecipeCard/RecipeCard"; // recipe card component
import API from "../../api"; // axios for backend requests
import Tabs from "../../components/Tabs/Tabs"; // category tabs
import './RecipeBox.css' // styling

function RecipeBox() {
  // welcome screen when no tab is selected
  const [defaultView, setDefaultView] = useState(true);
  // all user recipes
  const [recipes, setRecipes] = useState([]);
  // initial selected tab
  const [category, setCategory] = useState("Breakfast");
  // recipe being edited
  const [editRecipe, setEditRecipe] = useState(null);
  // recipe being viewed
  const [selectedRecipe, setSelectedRecipe] = useState(null); 
  // get logged in user id
  const userId = localStorage.getItem("userId");

  // sets category, removed recipe card, hides welcome card
  const handleTabSelect = (cat) => {
    setCategory(cat);
    setSelectedRecipe(null);
    setDefaultView(false); 
  };

  // box opening animation - classes added
  useEffect(() => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      const handleClick = () => {
        if (!box.classList.contains('active')) {
          box.classList.add('active');
        }
      };
      box.addEventListener('click', handleClick);
      return () => box.removeEventListener('click', handleClick);
    });
  }, []);

  // get all recipes of logged in user
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await API.get(`/recipes/${userId}`);
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipes();
  }, [userId]);

  // creates blank recipe card
  const handleAddRecipe = () => {
    const storedUserId = localStorage.getItem("userId");
    setEditRecipe({
      userId: storedUserId,
      title: "",
      image: "",
      category,
      ingredients: [],
      instructions: ""
    });
    setSelectedRecipe(null);
    setDefaultView(false); // editing → not default view
  };

  // saves and updates recipe card
  const handleSaveRecipe = async (recipeData) => {
    try {
      let res;
      if (recipeData._id) {
        res = await API.put(`/recipes/${recipeData._id}`, recipeData);
      } else {
        res = await API.post("/recipes", recipeData);
      }

      if (!res.data || !res.data._id) {
        console.error("Invalid response from server:", res.data);
        return;
      }

      // updates recipe list in the tab
      setRecipes((prev) =>
        recipeData._id
          ? prev.map((r) => (r._id === res.data._id ? res.data : r))
          : [...prev, res.data]
      );

      setEditRecipe(null);
      setSelectedRecipe(res.data);
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  // deletes recipe - removes ui
  const handleDeleteRecipe = async (recipeId) => {
    try {
      await API.delete(`/recipes/${recipeId}`);
      setRecipes(recipes.filter(r => r._id !== recipeId));
      setSelectedRecipe(null);
    } catch (err) {
      console.error(err);
    }
  };

  // logout handling - clears login data
  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div className="body">
      {/* logout button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      {/* recipe container */}
      <div className="container">
        <div className="box">
          <div className="box-inside">
            {/* tabs */}
            <Tabs
              categories={["Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"]}
              current={category}
              onSelect={handleTabSelect}
              activeColor="#e0d0ce"
            />
            {/* welcome card */}
            <div className="content">
              {defaultView && !editRecipe && !selectedRecipe && (
                <div className="welcome-card">
                  <h1>My Recipe Box</h1>
                </div>
              )}
              {/* recipe card container */}
              {editRecipe && (
                <div className="recipe-card-container">
                  <RecipeCard
                    recipe={editRecipe}
                    editMode={true}
                    onSave={handleSaveRecipe}
                    onDelete={() => setEditRecipe(null)}
                  />
                </div>
              )}

                {/* recipe list */}
                {!defaultView && !selectedRecipe && !editRecipe && (
                  <div className="tab-card">
                    <div className="tab-grid">
                      <div className="recipe-grid-box add-recipe">
                        <button onClick={handleAddRecipe}>
                          + add recipe
                        </button>
                      </div>  
                      {recipes
                        .filter(r => r.category === category)
                        .map(recipe => (
                          <div
                            key={recipe._id}
                            className="recipe-grid-box"
                            onClick={() => setSelectedRecipe(recipe)}
                          >
                            {recipe.title || "Untitled Recipe"}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              
              {/* recipe card view */}
              {selectedRecipe && (
                <div className="recipe-card-container">
                  <RecipeCard
                    recipe={selectedRecipe}
                    onSave={handleSaveRecipe}
                    onDelete={handleDeleteRecipe}
                  />
                </div>
              )}
            </div>
          </div>

          {/* box top and bottom for animation */}
          <div className="box-top"></div>
          <div className="box-bottom"></div>
        </div>
      </div>
    </div>
  );
}

export default RecipeBox;