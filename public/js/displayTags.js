window.onload = async () => {
  const response = await fetch("/getTags");
  const json = await response.json();

  for (let data of json) {
    let div = document.createElement("div");
    div.textContent = data.name;
    let button = document.createElement("button");
    button.textContent = "Remove Tag";
    button.setAttribute("id", data._id); // setting id of button to be that of corresponding DB document
    button.setAttribute("class", "butt");
    div.append(button);
    document.body.append(div);
  }

  let buttons = document.getElementsByClassName("butt"); // for deleting tags
  for (let i = 0; i < buttons.length; i++) { // for deleting tags
    buttons[i].addEventListener("click", async (e) => {
      let id = e.target.id;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      };
      let resp = await fetch("/deleteTags", options);
      let jso = await resp.json();

      if (jso.status === "success") {
        alert("tag deleted");
        window.location.reload();
      }
    });
  }
};
