let setting = {
  quickAccessButtons: [],
  layout: "layout-3col",
  enhanceCSS_NE: false,
};

const enhanceCSS_NE_input = document.getElementById("enhanceCSS-ne-input");
enhanceCSS_NE_input.addEventListener("click", () => {
  setting.enhanceCSS_NE = enhanceCSS_NE_input.checked;
  console.log(enhanceCSS_NE_input.checked);
});

// ===== INIT SETTING ===== //
chrome.storage.sync.get("setting", ({ setting: _setting }) => {
  setting = _setting || setting;

  document.querySelector(`[value="${setting.layout}"]`).click();
  enhanceCSS_NE_input.checked = setting.enhanceCSS_NE;
  render();
  initEventListeners();
});
// ===== INIT SETTING ===== //

const educationChildren = ["registration", "schedule", "exam", "map"];

const btnGroup = document.querySelectorAll(".btn[data-id]");
function render() {
  btnGroup.forEach((btn) => {
    const { quickAccessButtons } = setting;
    const id = btn.getAttribute("data-id");
    const selected = quickAccessButtons.includes(id);

    if (selected) btn.classList.remove("btn--disabled");
    else btn.classList.add("btn--disabled");
  });
}

function initEventListeners() {
  btnGroup.forEach((btn) => {
    const id = btn.getAttribute("data-id");
    btn.addEventListener("click", () => {
      const selected = setting.quickAccessButtons.includes(id);

      if (selected)
        setting.quickAccessButtons = setting.quickAccessButtons.filter(
          (e) => e !== id
        );
      else setting.quickAccessButtons.push(id);
      // click "education" button to enable/disable all children
      if (id === "education") {
        if (!selected) selectEducationChildren(true);
        else selectEducationChildren(false);
      }

      if (educationChildren.includes(id)) {
        // click children to enable "education" button
        if (!selected) setting.quickAccessButtons.push("education");
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

  const layoutRadios = document.querySelectorAll(`[name="layout"]`);
  layoutRadios.forEach((rad) => {
    rad.addEventListener("click", (e) => {
      setting.layout = e.target.getAttribute("value");
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

const saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    setting: setting,
  });
  alert("Đã lưu");
});
