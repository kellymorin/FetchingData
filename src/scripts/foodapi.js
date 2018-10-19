// Create elements that will be built up later based on the query and added to the DOM
let foodList = document.querySelector(".foodList")
let fragment = document.createDocumentFragment()

let elementFactory = (el, title, content, {id, clazz}, ...children)=>{
  let element = document.createElement(el)
  if(title === null && content === null){
    element.innerHTML = null
  } else if(title === null){
    element.innerHTML = content
  } else {
    element.innerHTML = `<span>${title}:</span> ${content}` || null
  }
  children.forEach(child => {
    element.appendChild(child)
  })
  element.setAttribute("id", id)
  element.setAttribute("class", clazz)
  return element
}

// Set blank arrays to capture information
let localFood = []
let apiPromises = []

// Fetch data from database.json (owned data source)
fetch("http://localhost:8088/food")
  .then((foods)=> foods.json()) // Transition fetch response from JSON to JS
  .then((parsedFoods)=>{
    // Loop over converted JS array of objects to query 3rd-party API 
    parsedFoods.forEach((food)=>{
      localFood.push(food)

      // Add each fetch to an array that we can pass to promise.all
      apiPromises.push(fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`).then((foodItem)=>foodItem.json()))
    })
       // Return all of the fetch promises at once
       return Promise.all(apiPromises)
  })
  .then((resolvedPromisesArr)=>{
    localFood.forEach((food, index)=>{
      
      // Make h3 element with title
      let title = elementFactory("h3", null, food.name, {
        id: null,
        clazz: "foodName",
      })

      // Make a p element to contain the food ethnicity
      let ethnicity = elementFactory("p", "Ethnicity", food.ethnicity, {
        id: null,
        clazz: null,
      })
      
      // Make a p element to contain the food type
      let type = elementFactory("p", "Type", food.type, {
        id: null,
        clazz: null,
      })

      // Make a p element to contain the ingredients
      let ingredients = elementFactory("p", "Ingredients", resolvedPromisesArr[index].product.ingredients_text, {
        id: null,
        clazz: null,
      })

      // Make a p element to contain the country of origin
      let country = elementFactory("p", "Country", resolvedPromisesArr[index].product.countries, {
        id: null,
        clazz: null,
      })

      // Make a p element to distinguish nutrition information
      let nutrition = elementFactory("p", null, "Nutrition Information", {
        id: null,
        clazz: "nutrition",
      })

      // Make a p element to contain the calories per serving
      let calories = elementFactory("p", "Calories per Serving", resolvedPromisesArr[index].product.nutriments.energy_serving, {
        id: null,
        clazz: null,
      })

      // Make a p element to contain the fat per serving
      let fat = elementFactory("p", "Fat per Serving", `${resolvedPromisesArr[index].product.nutriments.fat_serving} ${resolvedPromisesArr[index].product.nutriments.fat_unit}`, {
        id: null,
        clazz: null,
      })

      // Make a p element to contain the sugar per serving
      let sugar = elementFactory("p", "Sugar per Serving", `${resolvedPromisesArr[index].product.nutriments.sugars_serving} ${resolvedPromisesArr[index].product.nutriments.sugars_unit}`, {
        id: null,
        clazz: null,
      })
      
      // Make section composed of the h3 and p elements
      let foodItem = elementFactory("section", null, null, {
        id: null,
        clazz: "foodItem",
      }, title, ethnicity, type, ingredients, country, nutrition, calories, fat, sugar)

      // Attach the new section to the fragment
      fragment.appendChild(foodItem)

    })

    // Insert the section into the DOM as children of the fragment in index.html
    foodList.appendChild(fragment)
  });




      
      
      
      










// fetch("http://localhost:8088/food")
//     .then((foods) => foods.json())
//     .then((parsedFoods) => {
//         console.table(parsedFoods)
//         parsedFoods.forEach((food) =>{
//           let listItem = document.createElement("section");
//           let foodName= document.createElement("p");
//           let foodEthnicity = document.createElement("p");
//           let foodType = document.createElement("p");
//           foodName.textContent = `${food.name}`
//           foodName.className="foodName"
//           foodEthnicity.textContent = `${food.ethnicity}`
//           foodType.textContent = `${food.type}`
//           listItem.className= "listItem"
//           listItem.appendChild(foodName);
//           listItem.appendChild(foodEthnicity);
//           listItem.appendChild(foodType);
//           fragment.appendChild(listItem);
//           foodList.appendChild(fragment);
//         })
//     })

// fetch("http://localhost:8088/food")
//   .then((foods)=> foods.json())
//   .then((parsedFoods)=>{
//     parsedFoods.forEach((foodItem)=> {
//       let url = foodItem.barcode
//       fetch(`https://world.openfoodfacts.org/api/v0/product/${url}.json`)
//       .then((response)=> response.json())
//       .then((parsedResponse)=>{
//         parsedResponse.forEach((food)=>{
//           let outsideInfo = document.createElement("section")
//           let ingredients = document.createElement("p")
//           // let country = document.createElement("p")
//           // let fat = document.createElement("p")
//           // let sugar = document.createElement("p")
//           ingredients.textContent = `${food.product.ingredients}`
//           // country.textContent = `${food.product.countries_tags}`
//           // fat.textContent = `${food.product.nutriments.fat_serving}`
//           // sugar.textContent = `${food.product.nutriments.sugars_serving}`
//           outsideInfo.appendChild(ingredients)
//           // outsideInfo.appendChild(country)
//           // outsideInfo.appendChild(fat)
//           // outsideInfo.appendChild(sugar)
//           fragment.appendChild(outsideInfo)
//           foodList.appendChild(fragment)
//         })
//       })
//     })
//   })
  
  // calories.textContent =
  // let calories = document.createElement("p")
// Your job is to query the Open Food Facts API for each of your products, and list the following additional information.

// Ingredients
// Country of origin
// Calories per serving
// Fat per serving
// Sugar per 