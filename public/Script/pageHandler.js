document.addEventListener("DOMContentLoaded", () => {

  const pageType = document.body.getAttribute("data-page");

  if (pageType === "login" || pageType === "register") {
    document.body.classList.add("auth-page");
  } else {
    document.body.classList.remove("auth-page");
  }

});
