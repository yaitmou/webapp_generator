// Import the main style
require("./style/index.scss");
// The main container
let container_el = document.createElement("div");
container_el.classList.add("container");
container_el.innerHTML =
  "CONGRATS! You have just built your first simple web applications";

// The app title
let title_el = document.createElement("h1");
title_el.classList.add("title");
title_el.innerHTML = "Simple Web App Builder";

// Append the container element to the body
container_el.prepend(title_el);
document.body.appendChild(container_el);
