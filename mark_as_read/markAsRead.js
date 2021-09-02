const phongbanMap = {
  "Khoa Ngoại ngữ": "0",
  "Khoa Mỹ thuật Công nghiệp": "1",
  "Khoa Kế toán": "2",
  "Khoa Khoa học xã hội và nhân văn": "3",
  "Khoa Điện - Điện tử": "4",
  "Khoa Công nghệ thông tin": "5",
  "Khoa Khoa học ứng dụng": "6",
  "Khoa Quản trị kinh doanh": "7",
  "Khoa Kỹ thuật công trình": "8",
  "Khoa Môi trường và Bảo hộ lao động": "9",
  "Khoa Lao động công đoàn": "A",
  "Khoa Tài chính ngân hàng": "B",
  "Khoa Toán thống kê": "C",
  "Khoa Khoa học thể thao": "D",
  "Khoa Luật": "E",
  Saxion: "F",
  "Trung tâm tin học": "G",
  "Khoa Dược": "H",
  "Khoa Giáo dục quốc tế": "I",
  "Trung tâm giáo dục quốc phòng - an ninh": "K",
  "Phòng CTHSSV": "P02",
  "Phòng Đại học": "P03",
  "Phòng Sau đại học": "P04",
  "Phòng Điện toán và máy tính": "P05",
  "Phòng Quản lý phát triển KHCN": "P06",
  "Phòng Khảo thí và KĐCL": "P07",
  "Phòng Quản trị thiết bị": "P08",
  "Phòng Tài chính": "P09",
  "Phòng Tổ chức hành chính": "P10",
  "Phòng TT, PC và An ninh": "P11",
  "Ban ký túc xá": "P12",
  "Viện INCOS": "P13",
  "Viện INCREDI": "P14",
  "TDT Creative Language Center": "P15",
  "VP Đảng ủy và Công đoàn": "P16",
  "T. TCCN TĐT": "P17",
  "Cơ sở Cà Mau": "P18",
  "Cơ sở Nha Trang": "P19",
  "Tổ tư vấn học đường": "P20",
  "Ban PR": "P21",
  "Trung tâm tư vấn và kiểm định xây dựng": "P22",
  "Trung tâm thực hành, dịch vụ và đào tạo, chuyển giao công nghệ (Cepsatt)":
    "P26",
  "Trung tâm đào tạo phát triển xã hội (SDTC)": "P27",
  "Trung tâm Việt Nam học": "P28",
  "Trung tâm nghiên cứu và đào tạo kinh tế ứng dụng (Caer)": "P29",
  "Thư viện": "P30",
  "Trung tâm an toàn lao động và công nghệ môi trường (Cosent)": "P31",
  "Trung tâm phát triển khoa học quản lý và công nghệ ứng dụng (Atem)": "P32",
  "Trung tâm ứng dụng và phát triển mỹ thuật công nghiệp (ADA)": "P33",
  "Trung tâm hợp tác Châu Âu (ECC)": "P34",
  "TT Hợp tác doanh nghiệp và cựu sinh viên": "P35",
  "Ban quản lý dự án": "P36",
  "Cơ sở Bảo Lộc": "P37",
  "TT Ngoại ngữ - Tin học - Bồi dưỡng Văn hóa (CIFLEET)": "P38",
  "Trung tâm ứng dụng - Đào tạo và phát triển các giải pháp kinh tế (CATDES)":
    "P39",
  "Trung tâm chuyên gia Hàn Quốc": "P42",
  "Trung tâm Bata": "P43",
  "Viện AIMAS": "P44",
  "Công ty TĐT": "P45",
  VFIS: "P46",
  "Viện GRIS": "P47",
  "Viện chính sách kinh tế và kinh doanh (IBEP)": "P48",
  "Viện Hợp tác, Nghiên cứu và Đào tạo quốc tế": "P50",
};

function createBtn(noti = document.getElementById("")) {
  const markAsReadBtn = document.createElement("button");
  markAsReadBtn.innerText = "Đánh dấu đã đọc";
  markAsReadBtn.classList.add("mar-btn");
  const unread = noti.querySelector('img[src="/images/new.png"]')
    ? true
    : false;
  if (!unread) markAsReadBtn.disabled = true;

  markAsReadBtn.addEventListener("click", async () => {
    try {
      const url = noti
        .querySelector("a")
        .getAttribute("onclick")
        .split("('")[1]
        .split("')")[0];
      const tinTucID = url.split("/").pop();
      const phongBanString = noti
        .querySelector(".khoa-phong > i")
        .textContent.trim();
      const phongBanID = phongbanMap[phongBanString];
      let res = await fetch(
        `/ThongBao/UpdateDaXem?tinTucID=${tinTucID}&phongBanID=${phongBanID}`
      ).catch((e) => console.log(e));

      if (res.status === 200) {
        const img = noti.querySelector('img[src="/images/new.png"]');
        if (img) {
          img.style.display = "none";
        }
        markAsReadBtn.disabled = true;
      }
    } catch (e) {
      console.log(e);
    }
  });

  return markAsReadBtn;
}

function addBtn() {
  const notiList = document.querySelectorAll(
    "#div_lstThongBao > div.list.box.text-shadow > div"
  );
  notiList.forEach((noti) => {
    const markAsReadBtn = createBtn(noti);

    noti.appendChild(markAsReadBtn);
  });
}
addBtn();

const targetNode = document.getElementById("div_lstThongBao");
const config = { childList: true, subtree: true };

const callback = function (mutationsList, observer) {
  observer.disconnect();
  addBtn();
  observer.observe(targetNode, config);
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
