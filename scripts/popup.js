const inputMssv = document.querySelector("#mssv");
const inputPass = document.querySelector("#pass");

async function main() {
  let setting = await getSetting();

  if (!setting) {
    const buttons = document.querySelectorAll("[data-id]");
    const buttonIds = [...buttons].map((btn) => btn.getAttribute("data-id"));
    const defaultSetting = {
      quickAccessButtons: buttonIds,
      layout: "layout-3col",
      ui: {
        newElearning: false,
      },
    };

    setting = defaultSetting;
    await chrome.storage.sync.set({ setting });
  }

  setUpInputs();
  setUpOptionsButton();
  setUpLayout(setting.layout);
  setUpQuickAccessButtons(setting.quickAccessButtons);
  await setUpHighlightButton();
}
main();

function getSetting() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("setting", (data) => {
      resolve(data.setting);
    });
  });
}

function setUpInputs() {
  chrome.storage.sync.get("loginData", (data) => {
    if (data.loginData) {
      const { mssv, pass } = data.loginData;
      inputMssv.value = mssv;
      inputPass.value = pass;
    }
  });
}

function setUpOptionsButton() {
  document.querySelector(".options").addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  });
}

function setUpLayout(layout) {
  document.querySelector(".btn-group").classList.add(layout);
}

function setUpQuickAccessButtons(buttons) {
  document.querySelectorAll(`[data-id]:not([data-id="home"])`).forEach((btn) => {
    const id = btn.getAttribute("data-id");
    if (!buttons.includes(id)) {
      btn.classList.add("hidden");
    }
  });

  document.querySelectorAll("[data-id]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const pageId = e.currentTarget.getAttribute("data-id");
      const hasInputFilled = await checkInput();
      if (hasInputFilled) {
        chrome.runtime.sendMessage({ message: "open-page", data: { pageId } });
      }
    });
  });

  async function checkInput() {
    const mssv = inputMssv.value;
    const pass = inputPass.value;

    if (!mssv) {
      inputMssv.focus();
      return false;
    }

    if (!pass) {
      inputPass.focus();
      return false;
    }

    await chrome.storage.sync.set({
      loginData: { mssv, pass },
    });

    return true;
  }
}

async function setUpHighlightButton() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const tabURL = new URL(tab.url);

  // Transforms URL to match the redirected URL
  let currentURL = tabURL.toString();
  const newElearningURL = "https://elearning.tdtu.edu.vn";
  if (currentURL.includes(newElearningURL)) {
    currentURL = "https://stdportal.tdtu.edu.vn/main/elearningv2";
  }

  const data = await chrome.runtime.sendMessage({
    message: "highlight-page",
    data: { currentURL },
  });

  if (data?.pageId) {
    highlightButton(data.pageId);

    const educationChildren = ["registration", "schedule", "exam", "map"];
    if (educationChildren.includes(data.pageId)) {
      highlightButton("education");
    }
  }

  function highlightButton(id) {
    const btn = document.querySelector(`[data-id="${id}"]`);
    const btnColor = window.getComputedStyle(btn).color;
    btn.style.setProperty("--dashed-color", btnColor);
    btn.classList.add("btn--dashed-dance");
  }
}
