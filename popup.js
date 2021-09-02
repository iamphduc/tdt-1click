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
const defaultLayout = "layout-3col";
const disabledButtons = [
  "survey",
  "elearning",
  "student-cert",
  "apply-online",
  "rule",
  "sport-club",
];
let defaultButtons = [];
document.querySelectorAll("[data-id]").forEach((btn) => {
  const id = btn.getAttribute("data-id");

  if (disabledButtons.includes(id)) return;

  defaultButtons.push(id);
});

chrome.storage.sync.get("setting", ({ setting }) => {
  const tmpSetting = setting ? setting : {};
  if (!setting?.quickAccessButtons) {
    tmpSetting.quickAccessButtons = defaultButtons;
  }
  tmpSetting.layout = setting?.layout ? setting?.layout : defaultLayout;
  document.querySelector(".btn-group").classList.add(tmpSetting.layout);

  chrome.storage.sync.set({ setting: tmpSetting });

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

// ===== HIGHLIGHT BUTTON ===== //
chrome.tabs.query({ active: true }, (tabs) => {
  // get tab url then remove query string
  let tabURL = new URL(tabs[0].url);
  tabURL.search = "";

  const elearningURL = {
    "http://elearning.tdt.edu.vn/course/index.php":
      "https://stdportal.tdtu.edu.vn/main/elearning",
    "https://elearning.tdtu.edu.vn/course/index.php":
      "https://stdportal.tdtu.edu.vn/main/elearningv2",
  };

  let currentURL = tabURL.toString();
  if (currentURL in elearningURL) currentURL = elearningURL[currentURL];

  const message = "highlightPage";
  chrome.runtime.sendMessage({ message, currentURL }, (res) => {
    if (res) {
      setDashedDance(res);

      const educationChildren = ["registration", "schedule", "exam", "map"];
      if (educationChildren.includes(res)) setDashedDance("education");
    }
  });
});

function setDashedDance(id) {
  const btn = document.querySelector(`[data-id="${id}"]`);
  const color = window.getComputedStyle(btn).color;
  btn.style.setProperty("--dashed-color", color);
  btn.classList.add("dashed-dance");
}
