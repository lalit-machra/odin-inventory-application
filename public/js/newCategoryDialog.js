const addNew = document.querySelector(".addNewCategory");
const dialog = document.querySelector(".categoryDialog");
const newCategForm = document.querySelector(".categoryForm");
const fileInput = document.querySelector("#categoryImg");

addNew.addEventListener("click", (e) => {
  dialog.showModal();
});

newCategForm.addEventListener("submit", () => {
  dialog.close();
});

