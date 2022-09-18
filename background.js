const LOGIN_URL = "https://stdportal.tdtu.edu.vn/Login/Index";
const TEACHING_QUALITY_SURVEY_URL = "https://teaching-quality-survey.tdtu.edu.vn";
const PORTAL_URL = {
  "notification": "https://studentnews.tdtu.edu.vn",
  "survey": "https://survey-beta.tdtu.edu.vn",
  "info": "https://stdportal.tdtu.edu.vn/main/thongtinsinhvien",
  "tuition": "https://hocphilephi.tdtu.edu.vn",

  "elearning": "https://stdportal.tdtu.edu.vn/main/elearningv2",
  "elearning-skill": "https://elearning-ability.tdtu.edu.vn",
  "score": "https://ketquahoctap.tdtu.edu.vn/home",

  "student-cert": "https://cnsv.tdtu.edu.vn",
  "apply-online": "http://nopdon.tdtu.edu.vn",
  "train": "https://stdportal.tdtu.edu.vn/main/hoatdongphongtrao",
  "rule": "https://quychehocvu.tdtu.edu.vn",

  "sport-club": "http://sport.tdtu.edu.vn",
  "education": "https://old-stdportal.tdtu.edu.vn/dkmh-main",
  "registration": "http://dkmh.tdt.edu.vn/default.aspx",
  "schedule": "https://lichhoc-lichthi.tdtu.edu.vn/tkb2.aspx",

  "exam": "https://lichhoc-lichthi.tdtu.edu.vn/xemlichthi.aspx",
  "map": "https://learninginfo.tdtu.edu.vn/sv_xemctdt",

  "home": "https://stdportal.tdtu.edu.vn",
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message, data } = request;

  if (message === "open-page") {
    openPage(PORTAL_URL[data.pageId]);
    sendResponse();
    return true; // Keep the message channel open
  }

  if (message === "highlight-page") {
    const pageIds = Object.keys(PORTAL_URL);
    const pageId = pageIds.find((id) => data.currentURL.includes(PORTAL_URL[id]));
    sendResponse({ pageId });
  }
});

function openPage(url) {
  chrome.tabs.create({ url, active: true }, (tab) => {
    function handler(tabId, changeInfo, tabInfor) {
      if (tabId === tab.id && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(handler);

        // Injects script if login page
        if (tabInfor.url.includes(LOGIN_URL)) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content-scripts/login.js"],
          });
          chrome.tabs.onUpdated.addListener(handler);
          return;
        }

        if (tabInfor.url.includes(TEACHING_QUALITY_SURVEY_URL)) {
          chrome.tabs.onUpdated.removeListener(handler);
          return;
        }

        // Redirects til tabInfor is matched with destination url
        if (!tabInfor.url.includes(url)) {
          chrome.tabs.update(tabInfor.id, { url });
        }
      }
    }
    chrome.tabs.onUpdated.addListener(handler);
  });
}
