async function loadRecipes() {
  try {
    const response = await fetch("data.json");  
    
    if (!response.ok) {
      throw new Error("Could not load data.json");
    }

    const recipes = await response.json();
    console.log(recipes);
    const container = document.getElementById("recipes-container");
    container.innerHTML = "";

    recipes.forEach(recipe => {
      // Outer wrapper
      const wrapper = document.createElement("div");
      wrapper.classList.add("recipe-block");

      // Title <h3>
      const title = document.createElement("h3");
      title.textContent = recipe.recipeName;
      wrapper.appendChild(title);

      // Recipes Main container
      const main = document.createElement("div");
      main.classList.add("recipes-main-container");

      // Image
    //   const imgDiv = document.createElement("div");
    //   imgDiv.classList.add("image-container");

    //   const img = document.createElement("img");
    //   img.src = recipe.image;
    //   img.alt = recipe.name;
    //   imgDiv.appendChild(img);

      // Recipe text
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe-container");

      // Ingredients
      const ingH2 = document.createElement("h2");
      ingH2.textContent = "Ingredients";
      recipeDiv.appendChild(ingH2);

      const ingList = document.createElement("ul");
      recipe.ingredients.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        ingList.appendChild(li);
      });
      recipeDiv.appendChild(ingList);

      // Instructions
      const instH2 = document.createElement("h2");
      instH2.textContent = "Instructions";
      recipeDiv.appendChild(instH2);

      const instList = document.createElement("ol");
      recipe.instructions.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        instList.appendChild(li);
      });
      recipeDiv.appendChild(instList);

      // Assemble
    //   main.appendChild(imgDiv);
      main.appendChild(recipeDiv);

      wrapper.appendChild(main);
      container.appendChild(wrapper);
    });
  } catch (err) {
    console.error("Error loading recipes:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadRecipes);
