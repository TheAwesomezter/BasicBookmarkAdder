let pageURL = new URL(window.location.href); // checking if success, or not
if (pageURL.search.split("?status=")[1] === "success") {
  let message = document.createElement("div");
  message.textContent = "Tag Created";
  document.querySelector(".collection").prepend(message);
} else {
  window.location = "/createATag"; // if not success, redirect to tag cretion page
  window.stop();
}

document.querySelector("button").addEventListener("click", async (e) => {
  e.preventDefault(); // stopping form submission
  if (!document.querySelector("#name").value) {
    alert("The tag name can't be empty!");
    return;
  }

  let array = []; // array for tag names
  const response = await fetch("/getTags");
  let json = await response.json();

  for (let tag of json) {
    array.push(tag.name);
  }

  if (array.includes(document.querySelector("#name").value)) {
    alert("This tag already exists! Please choose a different name!");
    return;
  }
  document.querySelector("form").submit(); // making form submit
});
