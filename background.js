const loginURL = "https://stdportal.tdtu.edu.vn/Login/Index";

const SCHOOL_URL = {
  // basic-theme
  home: "https://stdportal.tdtu.edu.vn/Home/Index",
  notification: "https://studentnews.tdtu.edu.vn/Home/Index",
  schedule: "https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx",
  score: "https://ketquahoctap.tdtu.edu.vn/home/diemhocky",
  train: "https://stdportal.tdtu.edu.vn/main/hoatdongphongtrao",
  "new-elearning": "https://stdportal.tdtu.edu.vn/main/elearningv2",
  exam: "https://lichhoc-lichthi.tdtu.edu.vn/xemlichthi.aspx",
  map: "https://learninginfo.tdtu.edu.vn/sv_xemctdt",
  tuition: "https://hocphilephi.tdtu.edu.vn/",
  // old-portal-theme
  elearning: "https://stdportal.tdtu.edu.vn/main/elearning",
  survey: "https://survey-beta.tdtu.edu.vn/SinhVien",
  info: "https://stdportal.tdtu.edu.vn/main/thongtinsinhvien",
  registration: "http://dkmh.tdt.edu.vn/",
  "elearning-skill": "https://elearning-ability.tdtu.edu.vn/Home",
  "student-cert": "https://cnsv.tdtu.edu.vn/",
  "apply-online": "http://nopdon.tdtu.edu.vn/",
  rule: "https://quychehocvu.tdtu.edu.vn/QuyChe/Index",
  "sport-club": "http://sport.tdtu.edu.vn/",
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == "optionsClicked") {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
    else window.open(chrome.runtime.getURL("options.html"));
    sendResponse();
  }

  if (request.message == "btnClicked") {
    openPage(SCHOOL_URL[request.type]);
    sendResponse();
    return true; // async
  }
});

function openPage(url) {
  chrome.tabs.create({ url: loginURL, active: true }, (tab) => {
    function handler(tabId, changeInfo, tabInfor) {
      if (tabId === tab.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(handler);
        if (tabInfor.url.includes(loginURL)) {
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
