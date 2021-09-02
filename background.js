const LOGIN_URL = "https://stdportal.tdtu.edu.vn/Login/Index";

const SCHOOL_URL = {
  // basic-theme
  notification: "https://studentnews.tdtu.edu.vn",
  education: "https://old-stdportal.tdtu.edu.vn/dkmh-main",
  schedule: "https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx",
  score: "https://ketquahoctap.tdtu.edu.vn/home",
  train: "https://stdportal.tdtu.edu.vn/main/hoatdongphongtrao",
  "new-elearning": "https://stdportal.tdtu.edu.vn/main/elearningv2",
  exam: "https://lichhoc-lichthi.tdtu.edu.vn/xemlichthi.aspx",
  map: "https://learninginfo.tdtu.edu.vn/sv_xemctdt",
  tuition: "https://hocphilephi.tdtu.edu.vn",
  // old-portal-theme
  elearning: "https://stdportal.tdtu.edu.vn/main/elearning",
  survey: "https://survey-beta.tdtu.edu.vn",
  info: "https://stdportal.tdtu.edu.vn/main/thongtinsinhvien",
  registration: "http://dkmh.tdt.edu.vn/default.aspx",
  "elearning-skill": "https://elearning-ability.tdtu.edu.vn",
  "student-cert": "https://cnsv.tdtu.edu.vn",
  "apply-online": "http://nopdon.tdtu.edu.vn",
  rule: "https://quychehocvu.tdtu.edu.vn/QuyChe",
  "sport-club": "http://sport.tdtu.edu.vn",
  home: "https://stdportal.tdtu.edu.vn",
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message == "btnClicked") {
    openPage(SCHOOL_URL[request.type]);
    sendResponse();
    return true; // async
  }

  if (request.message == "highlightPage") {
    const id = Object.keys(SCHOOL_URL).find((key) =>
      request.currentURL.includes(SCHOOL_URL[key])
    );
    sendResponse(id);
  }
});

function openPage(url) {
  chrome.tabs.create({ url: LOGIN_URL, active: true }, (tab) => {
    function handler(tabId, changeInfo, tabInfor) {
      if (tabId === tab.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(handler);
        if (tabInfor.url.includes(LOGIN_URL)) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content-script.js"],
          });
          chrome.tabs.onUpdated.addListener(handler);
        } else {
          // chrome.tabs.create({ url });
          // chrome.tabs.remove(tabInfor.id);
          chrome.tabs.update(tabInfor.id, { url });
        }
      }
    }
    chrome.tabs.onUpdated.addListener(handler);
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabInfor) => {
  const NEW_ELEARNNG_URL = "https://elearning.tdtu.edu.vn/";
  if (
    tabInfor.url.includes(NEW_ELEARNNG_URL) &&
    changeInfo.status === "complete"
  ) {
    chrome.storage.sync.get("setting", ({ setting }) => {
      const enhanceCSS_NE = setting?.enhanceCSS_NE || false;
      if (enhanceCSS_NE) {
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ["/css_injection/new_elearning.css"],
        });
      }
    });
  }
});
