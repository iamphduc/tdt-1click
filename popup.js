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
const defaultButtons = ["notification", "schedule", "score", "elearning"];

chrome.storage.sync.get("quickAccessButtons", (res) => {
  const data = res ? res.quickAccessButtons : defaultButtons;
  render(data);
});

function render(quickAccessButtons) {
  document.querySelectorAll(".main, .ghost").forEach((btn) => {
    const id = btn.getAttribute("data-id");
    const isSelected = quickAccessButtons.find((e) => e === id);

    if (!isSelected) btn.classList.add("hidden");
  });
}

// ===== BUTTON CLICK ===== //
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", async function () {
    const message = "btnClicked";
    const type = this.getAttribute("data-id");

    if (type == "options") chrome.runtime.sendMessage("optionsClicked");
    else if (await checkInput()) chrome.runtime.sendMessage({ message, type });
  });
});

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
