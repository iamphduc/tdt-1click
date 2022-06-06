async function main() {
  const setting = await getSetting();

  if (setting?.ui.newElearning) {
    const link = document.createElement("link");
    link.href = chrome.runtime.getURL("/features/ui-improving/new-elearning.css");
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}
main();

function getSetting() {
  return new Promise((resolve) => {
    chrome.storage.sync.get("setting", (data) => {
      resolve(data.setting);
    });
  });
}
