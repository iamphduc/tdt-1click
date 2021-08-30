const setting = {
  quickAccessButtons: [],
};

const saveBtn = document.getElementById("save");
const btnGroup = document.querySelectorAll(".btn[data-id]");

chrome.storage.sync.get("setting", ({ setting: _setting }) => {
  setting.quickAccessButtons = Array.isArray(_setting.quickAccessButtons)
    ? _setting.quickAccessButtons
    : [];
  render();
  initEventListeners();
});

const educationChildren = ["registration", "schedule", "exam", "map"];

function render() {
  btnGroup.forEach((btn) => {
    const { quickAccessButtons } = setting;
    const id = btn.getAttribute("data-id");
    const isSelected = quickAccessButtons.includes(id);

    if (isSelected) btn.classList.remove("btn--disabled");
    else btn.classList.add("btn--disabled");
  });
}

function initEventListeners() {
  btnGroup.forEach((btn) => {
    const id = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      const isSelected = setting.quickAccessButtons.includes(id);

      if (isSelected)
        setting.quickAccessButtons = setting.quickAccessButtons.filter(
          (e) => e !== id
        );
      else setting.quickAccessButtons.push(id);
      console.log(setting);
      // click "education" button to enable/disable all children
      if (id === "education") {
        if (!isSelected) selectEducationChildren(true);
        else selectEducationChildren(false);
      }

      if (educationChildren.includes(id)) {
        // click children to enable "education" button
        if (!isSelected) setting.quickAccessButtons.push("education");
        // disable if there is no education child
        else {
          const remain = educationChildren.filter((e) => isEnabled(e));

          if (remain.length === 0)
            setting.quickAccessButtons = setting.quickAccessButtons.filter(
              (e) => e != "education"
            );
        }
      }
      render();
    });
  });
}

// enable/disable education children depend on "education" button
function selectEducationChildren(isSelected) {
  if (isSelected)
    setting.quickAccessButtons =
      setting.quickAccessButtons.concat(educationChildren);
  else
    setting.quickAccessButtons = setting.quickAccessButtons.filter(
      (e) => !educationChildren.includes(e)
    );
}

// check if button is enabled
function isEnabled(button) {
  return setting.quickAccessButtons.includes(button);
}

saveBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    setting: setting,
  });
  alert("Đã lưu");
});
