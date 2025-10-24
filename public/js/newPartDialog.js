const addNew = document.querySelector(".addNewPart");
const dialog = document.querySelector(".partDialog");
const newPartForm = document.querySelector(".partForm");
const fileInput = document.querySelector("#partImg");

addNew.addEventListener("click", (e) => {
  dialog.showModal();
});

newPartForm.addEventListener("submit", () => {
  dialog.close();
});
