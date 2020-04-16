window.onload = async () => {
  let response = await fetch("/getTags");
  let tags = await response.json();
  console.log(tags);

  for (let tag of tags) {
    document.querySelector(".tagsDisplay").append(createTag(tag));
  }
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

async function addBookmark() {
  let tags = document.querySelectorAll(".tags");
  let link = document.getElementById("link").value;
  let title = document.getElementById("title").value;
  let publisher = document.getElementById("publisher").value;

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
