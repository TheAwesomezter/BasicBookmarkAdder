let array = []; // array to store name of already existing bookmark links

let tags;
let link;
let title;
let publisher;

window.onload = async () => {
  let response = await fetch("/getTags"); // adding already added tags
  let tags = await response.json();
  console.log(tags);

  for (let tag of tags) {
    document.querySelector(".tagsDisplay").append(createTag(tag));
  }

  getBookmarks();
};

function createTag(tagName) {
  let div = document.createElement("div");
  let tag = document.createElement("input");
  tag.setAttribute("type", "checkbox");
  tag.setAttribute("class", "tags");
  tag.value = tagName.name;
  div.textContent = tagName.name;
  div.append(tag);

  return div;
}

async function getBookmarks() {
  const response = await fetch("/getBookmarks");
  let bookmarks = await response.json();

  for (let bookmark of bookmarks) {
    array.push(bookmark["link"]);
  }
}

function checking() {
  if (!link || !title || !publisher) {
    alert("Fields marked with an asterisk can't be blank!");
    return false;
  }

  if (array.includes(link)) {
    alert("No two links can be the same! Please renter another link!");
    return false;
  }

  return true;
}

async function addBookmark() {
  tags = document.querySelectorAll(".tags");
  link = document.getElementById("link").value;
  title = document.getElementById("title").value;
  publisher = document.getElementById("publisher").value;

  if (!checking()) {
    return;
  }

  let tagsArray = [];
  tags.forEach((ele) => {
    if (ele.checked) tagsArray.push(ele.value); // adding all selected tags to an array for ease
  });

  let data = {
    tagsArray,
    link,
    title,
    publisher,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch("/createBookmark", options);
  const json = await response.json();

  if (json.status === "success") {
    alert("bookmark created");
    return;
  }
}

document.querySelector("button").addEventListener("click", addBookmark);
