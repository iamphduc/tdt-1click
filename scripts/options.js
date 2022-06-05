let setting = null;

async function main() {
  setting = await getSetting();

  renderLayout();
  renderUI();
  renderQuickAccessButtons();
  renderActions();
}
main();

function getSetting() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("setting", (data) => {
      resolve(data.setting);
    });
  });
}

function renderLayout() {
  document.querySelector(`[value="${setting.layout}"]`).click();
  document.querySelectorAll(`[name="layout"]`).forEach((rad) => {
    rad.addEventListener("click", (e) => {
      setting.layout = e.target.getAttribute("value");
    });
  });
}

function renderUI() {
  const inputNewElearning = document.querySelector("#ui__new-elearning");
  inputNewElearning.checked = setting.ui.newElearning;
  inputNewElearning.addEventListener("click", () => {
    setting.ui.newElearning = inputNewElearning.checked;
  });
}

function renderQuickAccessButtons() {
  const educationChildIds = ["registration", "schedule", "exam", "map"];
  const btnEducation = document.querySelector(`[data-id="education"]`);
  const btnEducationChildren = educationChildIds.map((id) =>
    document.querySelector(`[data-id="${id}"]`)
  );

  document.querySelectorAll(".btn[data-id]").forEach((btn) => {
    const id = btn.getAttribute("data-id");

    // Render buttons based on setting
    const selected = setting.quickAccessButtons.includes(id);
    if (selected) {
      btn.classList.remove("btn--disabled");
    } else {
      btn.classList.add("btn--disabled");
    }

    // Enable/disable button when clicked
    btn.addEventListener("click", () => {
      const selected = setting.quickAccessButtons.includes(id);

      if (selected) {
        setting.quickAccessButtons = setting.quickAccessButtons.filter((e) => e !== id);
      } else {
        setting.quickAccessButtons.push(id);
      }

      if (id === "education") {
        if (!selected) {
          selectEducationChildren(true);
        } else {
          selectEducationChildren(false);
        }
      }

      if (educationChildIds.includes(id)) {
        // Click on any child button to enable "education"
        if (!selected) {
          btnEducation.classList.remove("btn--disabled");
          setting.quickAccessButtons.push("education");
        }

        // If there is no children selected, disable "education"
        else {
          const remainEducationChildren = educationChildIds.filter((btn) =>
            setting.quickAccessButtons.includes(btn)
          );

          if (remainEducationChildren.length === 0) {
            btnEducation.classList.add("btn--disabled");
            setting.quickAccessButtons = setting.quickAccessButtons.filter(
              (btn) => btn !== "education"
            );
          }
        }
      }

      if (btn.classList.contains("btn--disabled")) {
        btn.classList.remove("btn--disabled");
      } else {
        btn.classList.add("btn--disabled");
      }
    });
  });

  // Enable/disable children on "education"
  function selectEducationChildren(isSelected) {
    if (isSelected) {
      btnEducationChildren.forEach((btn) => {
        btn.classList.remove("btn--disabled");
      });
      setting.quickAccessButtons = setting.quickAccessButtons.concat(educationChildIds);
    } else {
      btnEducationChildren.forEach((btn) => {
        btn.classList.add("btn--disabled");
      });
      setting.quickAccessButtons = setting.quickAccessButtons.filter(
        (e) => !educationChildIds.includes(e)
      );
    }
  }
}

function renderActions() {
  document.querySelector(`[data-id="save"]`).addEventListener("click", async () => {
    await chrome.storage.sync.set({ setting });
    alert("Đã lưu cài đặt của bạn!");
  });
}
