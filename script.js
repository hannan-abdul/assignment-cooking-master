const search = document.getElementById("search");
const submit = document.getElementById("submit");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementsByClassName(
  "result-heading"
);
const single_mealEl = document.getElementById(
  "single-meal"
);

//SearchMeal from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single Meal
  single_mealEl.innerHTML = "";

  //search meal
  const mealValue = search.value;

  //Check for empty
  if (mealValue.trim()) {
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result For ${mealValue} : </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<h2> There are No Search results for ${mealValue}</h2>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                 <div class="meal">
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                      <h3>${meal.strMeal}</h3>
                    </div>
                </div>
                `
            )
            .join("");
        }
      });

    //Clear Search mealValue
    search.value = "";
  } else {
    alert("please enter valid meal name");
  }
}

function getElementById(mealID) {
  fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  )
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      displayMeal(meal);
    });
}

// display meal to document 

function displayMeal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${
          meal[`strMeasure${i}`]
        }`
      );
    }else{
        break;
    }
  }

  single_mealEl.innerHTML = `
  <div class="single-meal">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h1>${meal.strMeal}</h1>
  <div class="main">
    <h2>Ingredients</h2>
    <ol>
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ol>
  </div>
  </div>
  `
}

//Event Listerner
submit.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute(
      "data-mealid"
    );
    getElementById(mealID);
  }
});
