window.onload = async () => {
  const response = await fetch("/getBookmarks");
  const bookmarksData = await response.json();

  let tableHeadings = Object.keys(bookmarksData[0]); // table headings, like id, name, etc....
  let tableRows = createTRs(bookmarksData);

  let table = document.createElement("table");
  let tr = document.createElement("tr");
  for (let tableHeading of tableHeadings) { // actually creating the tableheadings
    let th = document.createElement("th");

    th.appendChild(document.createTextNode(tableHeading));
    tr.appendChild(th);
  }
  table.appendChild(tr);

  for (let i = 0; i < tableRows.length; i++) { // creating the content
    let tr = document.createElement("tr");
    let link; // link for the title

    for (let j = 0; j < tableHeadings.length; j++) {
      let td = document.createElement("td");

      if (j === 1) { // specifying that the link column needs to lead to url when clicked
        let a = document.createElement("a");
        let text = document.createTextNode(tableRows[i][j]);
        a.appendChild(text);
        a.href = tableRows[i][j];
        link = tableRows[i][j];
        td.appendChild(a);
        tr.appendChild(td);
        continue;
      } else if (j === 2) { // specifying that the title column needs to lead to url when clicked
        console.log(link)
        let a = document.createElement("a");
        let text = document.createTextNode(tableRows[i][j]);

        a.appendChild(text);
        a.href = link; // referring it to the url link
        td.appendChild(a);
        tr.appendChild(td);
        continue;
      } else if (j === 6) { // creating the 'x' for each tag
        for (let k = 0; k < tableRows[i][j].length; k++) {
          try {
            let text = document.createTextNode(tableRows[i][j][k]);
            let xElement = document.createElement("span");
            xElement.textContent = "x";
            xElement.setAttribute("id", tableRows[i][0]);
            xElement.setAttribute(
              "class",
              "x-ele " + tableRows[i][j][k].replace(" ", "-")
            );
            td.append(text, xElement);
            tr.appendChild(td);
          } catch {
            continue;
          }
        }
        continue;
      }

      let text = document.createTextNode(tableRows[i][j]);
      td.appendChild(text);
      tr.appendChild(td);
    }
    let button = document.createElement("button");
    button.textContent = "Remove Element";
    button.setAttribute("id", tableRows[i][0]); // setting id of button to id in DB for ease when deleting/updating
    button.setAttribute("class", "butt");
    tr.append(button);

    button = document.createElement("button");
    button.textContent = "Add Tags";
    button.setAttribute("id", tableRows[i][0]);
    button.setAttribute("class", "buttToAddTags");
    tr.append(button);
    table.appendChild(tr);
  }

  document.body.appendChild(table);

  function createTRs(bookmarksData) { // returns an array of each individual 'row', or one document (for NoSQL)
    let data = [];
    for (let ele of bookmarksData) {
      data.push(Object.values(ele));
    }
    return data;
  }

  let buttons = document.getElementsByClassName("butt"); // for deleting bookmarks
  for (let i = 0; i < buttons.length; i++) { // for deleting bookmarks
    buttons[i].addEventListener("click", async (e) => {
      let id = e.target.id; // getting id of button clicked

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      };
      let resp = await fetch("/deleteBookmarks", options);
      let jso = await resp.json();

      if (jso.status === "success") {
        alert("bookmark deleted");
        window.location.reload();
      }
    });
  }

  let xEles = document.getElementsByClassName("x-ele"); // for deleting tags
  for (let i = 0; i < xEles.length; i++) { // for deleting tags
    xEles[i].addEventListener("click", async (e) => {
      let id = e.target.id;
      let name = e.target.className.split(" ")[1];
      name = name.replace("-", " ");

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name }),
      };

      let resp = await fetch("/deleteTagsFromBookmarks", options);
      let jso = await resp.json();

      if (jso.status === "success") {
        alert("tag deleted");
        window.location.reload();
      }
    });
  }

  let addingTags = document.getElementsByClassName("buttToAddTags"); // adding tags
  for (let i = 0; i < addingTags.length; i++) {
    addingTags[i].addEventListener("click", async (e) => {
      let id = e.target.id;
      let newTag = prompt("Enter 1 tag name. If one doesn't exist, it will be made: ");

      if (!newTag) {
        alert("new tag name cant be empty");
        return;
      }

      let existingTagsResp = await fetch("/getTags");
      let existingTags = await existingTagsResp.json();
      let newArray = [];

      for (let z = 0; z < existingTags.length; z++) {
        newArray.push(existingTags[z].name);
      }

      if (!newArray.includes(newTag)) {
        let name = newTag;

        const optionS = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        };

        let resp = await fetch("/createTagWith", optionS);
        let jso = await resp.json();

        if (jso.status === "success") {
          alert("tag created");
        }
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, newTag }),
      };

      let resp = await fetch("/addTagToBookmarks", options);
      let jso = await resp.json();

      if (jso.status === "success") {
        alert("tag updated");
        window.location.reload();
      }
    });
  }
};
