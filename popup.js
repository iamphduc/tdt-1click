// ===== USER INPUT ===== //
const mssvInput = document.getElementById("mssv");
const passInput = document.getElementById("pass");

chrome.storage.sync.get("loginData", (data) => {
  if (data.loginData) {
    const { mssv, pass } = data.loginData;
    mssvInput.value = mssv;
    passInput.value = pass;
  }
});

// ===== BUTTON RENDER ===== //
const disabledButtons = [];
let defaultButtons = [];
document.querySelectorAll("[data-id]").forEach((btn) => {
  defaultButtons.push(btn.getAttribute("data-id"));
});
const defaultLayout = "layout-3col";

chrome.storage.sync.get("setting", ({ setting }) => {
  const tmpSetting = setting ? setting : {};
  if (!setting?.quickAccessButtons) {
    tmpSetting.quickAccessButtons = defaultButtons;
  }
  tmpSetting.layout = setting?.layout ? setting?.layout : defaultLayout;
  document.querySelector(".btn-group").classList.add(tmpSetting.layout);

  chrome.storage.sync.set({ setting: tmpSetting });
  console.log(tmpSetting);
  openPopupTab("popup-home");
  render(tmpSetting.quickAccessButtons);
});

function render(quickAccessButtons) {
  document
    .querySelectorAll(".btn-group .btn[data-id]:not(#home)")
    .forEach((btn) => {
      const id = btn.getAttribute("data-id");
      const isSelected = quickAccessButtons.find((e) => e === id);

      if (!isSelected) btn.classList.add("hidden");
    });
}

// ===== BUTTON CLICK ===== //
async function checkInput() {
  const mssvVal = mssvInput.value;
  const passVal = passInput.value;

  if (!mssvVal) {
    mssvInput.focus();
    return false;
  }

  if (!passVal) {
    passInput.focus();
    return false;
  }

  await chrome.storage.sync.set({
    loginData: { mssv: mssvVal, pass: passVal },
  });

  return true;
}

document.querySelectorAll("[data-id]").forEach((btn) => {
  btn.addEventListener("click", async function () {
    const message = "btnClicked";
    const type = this.getAttribute("data-id");

    if (await checkInput()) chrome.runtime.sendMessage({ message, type });
  });
});

document.getElementById("options").addEventListener("click", () => {
  chrome.runtime.sendMessage("optionsClicked");
});

// ===== POPUP TABS ===== //
const popupTabs = document.querySelectorAll(`[id^="popup-"]`);
function openPopupTab(popupTabId) {
  popupTabs.forEach((tab) => {
    tab.style.display =
      tab.getAttribute("id") === popupTabId ? "block" : "none";
  });
}

const tools = document.querySelectorAll("[data-tab-id]");
tools.forEach((tool) =>
  tool.addEventListener("click", () => {
    const toolId = tool.getAttribute("data-tab-id");
    openPopupTab(toolId);
  })
);
