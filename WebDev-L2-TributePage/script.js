const heroButton = document.querySelector(".hero-button");

heroButton.addEventListener("click", () => {
  const aboutSection = document.querySelector("#about");

  aboutSection.scrollIntoView({
    behavior: "smooth",
  });
});
