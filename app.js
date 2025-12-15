    const form = document.getElementById('recipeForm');
    const successMsg = document.getElementById('success');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const recipe = {
        recipeName: document.getElementById('recipeName').value.trim(),
        ingredients: document
          .getElementById('ingredients')
          .value
          .split('\n')
          .map(item => item.trim())
          .filter(item => item !== ''),
        instructions: document
        .getElementById('instructions')
        .value
        .split('\n')
        .map(step => step.trim())
        .filter(step => step !== ''),
        yourName: document.getElementById('yourName').value.trim(),
        yourEmail: document.getElementById('yourEmail').value.trim(),
        agreedToTerms: document.getElementById('agree').checked,
        createdAt: new Date().toISOString()
      };

      if (!recipe.agreedToTerms) {
        alert("You must agree to the T&C");
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe)
        });

        if (response.ok) {
          successMsg.style.display = "block";
          form.reset();
          setTimeout(() => successMsg.style.display = "none", 4000);
        } else {
          alert("Failed to write to data.json");
        }
      } catch (err) {
        alert("Server not running. Start Node server first.");
        console.error(err);
      }
    });