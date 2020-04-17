let array = [];

window.onload = async () => {
  let response = await fetch("/getTags");
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

async function addBookmark() {
  let tags = document.querySelectorAll(".tags");
  let link = document.getElementById("link").value;
  let title = document.getElementById("title").value;
  let publisher = document.getElementById("publisher").value;

  if (!link) {
    alert("The link needs to be entered!");
    return;
  }

  if (!title) {
    alert("The title needs to be entered!");
    return;
  }

  if (!publisher) {
    alert("The publisher needs to be entered!");
    return;
  }

  if (array.includes(link)) {
    alert("No two links can be the same! Please renter another link!");
    return;
  }

  let tagsArray = [];
  tags.forEach((ele) => {
    if (ele.checked) tagsArray.push(ele.value);
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
    let message = document.createElement("div");
    message.textContent = "Bookmark Created";
    document.querySelector(".collection").prepend(message);
  }
}

document.querySelector("button").addEventListener("click", addBookmark);
