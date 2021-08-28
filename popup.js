const mssvInput = document.getElementById("mssv");
const passInput = document.getElementById("pass");

// auto fill input if storage.sync have
chrome.runtime.sendMessage("onStarted", (response) => {
  if (response) {
    const { mssv, pass } = response;
    mssvInput.value = mssv;
    passInput.value = pass;
  }
});

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", async function () {
    if (await checkInput())
      chrome.runtime.sendMessage({
        message: "btnClicked",
        type: this.getAttribute("id"),
      });
  });
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
