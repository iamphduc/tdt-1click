let quickAccessButtons = [];

chrome.storage.sync.get("quickAccessButtons", (res) => {
  const data = res.quickAccessButtons;
  quickAccessButtons = Array.isArray(data) ? data : quickAccessButtons;
  render();
});

const saveBtn = document.getElementById("save");
const btnGroup = document.querySelectorAll(".btn[data-id]");

const educationChildren = ["registration", "schedule", "exam", "map"];

function render() {
  btnGroup.forEach((btn) => {
    const id = btn.getAttribute("data-id");
    const isSelected = quickAccessButtons.find((e) => e === id);

    if (isSelected) btn.classList.remove("btn--disabled");
    else btn.classList.add("btn--disabled");
  });
}

btnGroup.forEach((btn) => {
  const id = btn.getAttribute("data-id");
  btn.addEventListener("click", () => {
    const isSelected = quickAccessButtons.find((e) => e === id);

    if (isSelected)
      quickAccessButtons = quickAccessButtons.filter((e) => e !== id);
    else quickAccessButtons.push(id);

    // click "education" button to enable/disable all children
    if (id === "education") {
      if (!isSelected) selectEducationChildren(true);
      else selectEducationChildren(false);
    }

    if (educationChildren.includes(id)) {
      // click children to enable "education" button
      if (!isSelected) quickAccessButtons.push("education");
      // disable if there is no education child
      else {
        const remain = educationChildren.filter((e) => isEnabled(e));

        if (remain.length === 0)
          quickAccessButtons = quickAccessButtons.filter(
            (e) => e != "education"
          );
      }
    }

    render();
  });
});

// enable/disable education children depend on "education" button
function selectEducationChildren(isSelected) {
  if (isSelected)
    quickAccessButtons = quickAccessButtons.concat(educationChildren);
  else
    quickAccessButtons = quickAccessButtons.filter(
      (e) => !educationChildren.includes(e)
    );
}

// check if button is enabled
function isEnabled(button) {
  return quickAccessButtons.includes(button);
}

saveBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    quickAccessButtons: quickAccessButtons,
  });
  alert("Đã lưu");
});
