let quickAccessButtons = [];

chrome.storage.sync.get("quickAccessButtons", (res) => {
  const data = res.quickAccessButtons;
  quickAccessButtons = Array.isArray(data) ? data : quickAccessButtons;
  render();
});

const saveBtn = document.getElementById("save");
const btnGroup = document.querySelectorAll(".btn[data-id]");

function render() {
  btnGroup.forEach((btn) => {
    const id = btn.getAttribute("data-id");
    const isSelected = quickAccessButtons.find((e) => e === id);

    isSelected
      ? btn.classList.add("btn--active")
      : btn.classList.remove("btn--active");
  });
}

btnGroup.forEach((btn) => {
  const id = btn.getAttribute("data-id");
  btn.addEventListener("click", () => {
    const isSelected = quickAccessButtons.find((e) => e === id);
    if (isSelected) {
      quickAccessButtons = quickAccessButtons.filter((e) => e !== id);
    } else {
      quickAccessButtons.push(id);
    }
    render();
  });
});

saveBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    quickAccessButtons: quickAccessButtons,
  });
  alert("Saved");
});
