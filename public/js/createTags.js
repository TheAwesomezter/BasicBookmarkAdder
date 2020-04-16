let pageURL = new URL(window.location.href);
if (pageURL.search.split("?status=")[1] === "success") {
  let message = document.createElement("div");
  message.textContent = "Tag Created";
  document.querySelector(".collection").prepend(message);
} else {
  window.location = "/createATag";
  window.stop();
}
