chrome.storage.sync.get("loginData", (data) => {
  const { mssv, pass } = data.loginData;
  submit(mssv, pass);
  // chrome.storage.sync.remove("loginData");
});

function submit(user, pass) {
  document.getElementById("txtUser").value = user;
  document.getElementById("txtPass").value = pass;
  document.getElementById("btnLogIn").click();
}
