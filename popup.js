// ===== INIT & RENDER BUTTONS ===== //
const defaultLayout = "layout-3col";
const disabledButtons = [];
const allButtons = [...document.querySelectorAll("[data-id]")]
  .map((btn) => {
    const id = btn.getAttribute("data-id");
    return id;
  })
  .filter((id) => {
    return disabledButtons.includes(id) ? false : true;
  });

const defaultSetting = {
  quickAccessButtons: allButtons,
  layout: defaultLayout,
};

chrome.storage.sync.get("setting", ({ setting }) => {
  const tmpSetting = setting || defaultSetting;

  chrome.storage.sync.set({ setting: tmpSetting });

  document.querySelector(".btn-group").classList.add(tmpSetting.layout);
  openPopupTab("popup-home");
  render(tmpSetting.quickAccessButtons);
});

function render(quickAccessButtons) {
  document
    .querySelectorAll(".btn-group .btn[data-id]:not(#home)")
    .forEach((btn) => {
      const id = btn.getAttribute("data-id");
      const selected = quickAccessButtons.includes(id);

      if (!selected) btn.classList.add("hidden");
    });
}

// ===== FILL MSSV AND PASSWORD ===== //
const mssvInput = document.getElementById("mssv");
const passInput = document.getElementById("pass");
chrome.storage.sync.get("loginData", (data) => {
  if (data.loginData) {
    const { mssv, pass } = data.loginData;
    mssvInput.value = mssv;
    passInput.value = pass;
  }
});

// ===== BUTTON CLICK EVENT ===== //
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
  if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  else window.open(chrome.runtime.getURL("options.html"));
});

// ===== POPUP TABS ===== //
const popupTabs = document.querySelectorAll(`[id^="popup-"]`);
function openPopupTab(popupTabId) {
  popupTabs.forEach((tab) => {
    const id = tab.getAttribute("id");
    tab.style.display = id === popupTabId ? "block" : "none";
  });
}

const tools = document.querySelectorAll("[data-tab-id]");
tools.forEach((tool) =>
  tool.addEventListener("click", () => {
    const toolId = tool.getAttribute("data-tab-id");
    openPopupTab(toolId);
  })
);
