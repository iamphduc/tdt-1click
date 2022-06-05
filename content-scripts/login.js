chrome.storage.sync.get("loginData", (data) => {
  const { mssv, pass } = data.loginData;

  document.querySelector("#txtUser").value = mssv;
  document.querySelector("#txtPass").value = pass;
  document.querySelector("#btnLogIn").click();
});
