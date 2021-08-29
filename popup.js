const mssvInput = document.getElementById("mssv");
const passInput = document.getElementById("pass");

chrome.storage.sync.get("quickAccessButtons", (res) => {
  const data = res.quickAccessButtons;
  render(data);
});

function render(quickAccessButtons) {
  document.querySelectorAll(".btn:not(#options)").forEach((btn) => {
    const id = btn.getAttribute("id");
    const isSelected = quickAccessButtons.find((e) => e === id);

    if (!isSelected) btn.classList.add("hidden");
  });
}

// auto fill input if storage.sync have
chrome.runtime.sendMessage("onStarted", (response) => {
  if (response) {
    const { mssv, pass } = response;
    mssvInput.value = mssv;
    passInput.value = pass;
  }
});

document.querySelectorAll(".btn:not(#options)").forEach((btn) => {
  btn.addEventListener("click", async function () {
    if (await checkInput())
      chrome.runtime.sendMessage({
        message: "btnClicked",
        type: this.getAttribute("id"),
      });
  });
});

document.getElementById("options").addEventListener("click", () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
});

async function checkInput() {
  const mssvVal = mssvInput.value;
  const passVal = passInput.value;

  if (mssvVal && passVal) {
    await chrome.storage.sync.set({
      loginData: { mssv: mssvVal, pass: passVal },
    });
    return true;
  }

  if (!mssvVal) {
    mssvInput.focus();
    return false;
  }

  passInput.focus();
  return false;
}
