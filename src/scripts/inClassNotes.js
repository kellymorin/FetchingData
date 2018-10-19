let elementFactory = (el, content, {id, clazz}, ...children)=>{
  let elemtnt = document.createElement(el)
  elementFactory.innerHTML = content || null
  children.forEach( child => {
    elemtnt.appendChild(child)
  })
  element.setAttribute("id", id)
  elemtnt.setAttribute("class", clazz)
  return elemtnt
}

// pull keys out of an object to use as variables
let obj = {name: "Fred", age: 13}
let myname = obj.name
let {name} = obj

fetch(myapi)
.then((fooddata)= fooddata.json())
.then((realdata)=>{
  realdata.forEach((food)=>{
    localFood = food
    fetch(theirapi)
    .then((apiFoodItem)=> apiFoodItem.json())
    .then((convertedFood => {
      let fragment = document.createDocumentFragment()
      let title = elementFactory ("h3", food.name, {
        id: null,
        class: "foodTitle"
      })
      let ingredients = elementFacotry ("p", convertedFood.product.ingredients_text, {
        id: null,
        class: "foodIngredients"
      })
      let foodListItem = elementFactory ("li", null, {id: "foodItem", clazz: "foodItem"}, title, ingredients)

      fragment.appendChild(foodListItem)

      foodList.appendChild (fragment)
    }))
  })
})

// for every single food item we're creating we are pinging the DOM, it's not an ideal structure

// A different approach 

// PROMISES.all method

let elementFactory = (el, content, {id, clazz}, ...children)=>{
  let element = document.createElement(el)
  element.innerHTML = content || null
  children.forEach(child => {
    element.appendChild(child)
  })
  element.setAttribute("id", id)
  element.setAttribute("class", clazz)
  return element
}

let foodList = document.querySelector("#foodList")

let localFood = []

let apiPromises = []

fetch(myApiData)
  .then((foodDataJson)=>foodDataJson.json())
  .then((foodData)=>{ //loop over the converted js array of objects to query 3rd-party API
    foodData.forEach((food)=>{
      localFood.push(food)
      
      // Add each fetch to an array that we can pass to Promise.all
      apiPromises.push(fetch(outsideAPI).then((foodItem)=>foodItem.json()))
    })
    // return all of the fetch promises at once
    return Promise.all(apiPromises)
  })
  .then((resolvedPromisesArr)=>{
    let fragment = document.createDocumentFragment()
    localFood.forEach((food, index)=>{
      
      // Make an h3 element
      let title = elementFactory("h3", food.name, {
        id: null,
        class: "foodTitle"
      })
      
      // make a p element to contain the ingredients list
      let ingredients = elementFactory("p", resolvedPromisesArr[index].product.ingredients_text,{
        id: null,
        class: "foodIngredients"
      })
      
      // Make list item component composed of the h3 and p elements
      let listItem = elementFactory("li", null, {
        id: "foodItem",
        clazz: "foodItem"
      }, title, ingredients)

      // Attach the new list item to the fragment
      fragment.appendChild(listItem)
    })
    
    // Insert the list items into the DOM as children of the ul in index.html
    foodList.appendChild(fragment)
  })