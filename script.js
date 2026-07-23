const updates = document.getElementById("updatesTrack");
const prevUpdate = document.getElementById("prevUpdate");
const nextUpdate = document.getElementById("nextUpdate");
const cards = Array.from(updates.children);
let currentSlide = 0;

function visibleCards() {
  return window.matchMedia("(max-width: 560px)").matches ? 1 : window.matchMedia("(max-width: 860px)").matches ? 1 : 2;
}

function updateCarousel() {
  const card = cards[0];
  const gap = Number.parseFloat(getComputedStyle(updates).columnGap);
  const offset = currentSlide * (card.getBoundingClientRect().width + gap);
  updates.style.transform = `translateX(-${offset}px)`;
}

prevUpdate.addEventListener("click", () => {
  currentSlide = Math.max(0, currentSlide - 1);
  updateCarousel();
});

nextUpdate.addEventListener("click", () => {
  currentSlide = Math.min(cards.length - visibleCards(), currentSlide + 1);
  updateCarousel();
});

window.addEventListener("resize", () => {
  currentSlide = Math.min(currentSlide, cards.length - visibleCards());
  updateCarousel();
});

const manuals = {
  basic: {
    title: "기본 사용법",
    description: "처음 접속한 사용자가 계정을 설정하고 주요 화면을 이해할 수 있도록 안내합니다.",
    items: ["관리자 계정 생성 및 로그인", "대시보드 메뉴 구조 확인", "프로필, 언어, 알림 기본 설정"]
  },
  team: {
    title: "팀 운영",
    description: "팀원이 함께 제품을 사용할 때 필요한 초대, 권한, 알림 정책을 정리했습니다.",
    items: ["멤버 초대와 부서 그룹 설정", "역할별 접근 권한 관리", "업무 알림 채널 및 담당자 지정"]
  },
  data: {
    title: "데이터 분석",
    description: "운영 현황을 확인하고 필요한 지표를 리포트로 만드는 과정을 안내합니다.",
    items: ["주요 지표 카드 읽는 법", "기간별 필터와 세그먼트 설정", "CSV 내보내기 및 공유 리포트 생성"]
  },
  api: {
    title: "연동 설정",
    description: "외부 서비스와 데이터를 연결하기 위한 API 키, 웹훅, 인증 설정 문서입니다.",
    items: ["API 키 발급 및 보관", "웹훅 이벤트 선택과 테스트", "연동 실패 로그 확인 및 재시도"]
  }
};

const detail = document.getElementById("manualDetail");
const tabs = Array.from(document.querySelectorAll(".manual-tab"));

function renderManual(key) {
  const manual = manuals[key];
  detail.innerHTML = `
    <h4>${manual.title}</h4>
    <p>${manual.description}</p>
    <ul>${manual.items.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderManual(tab.dataset.manual);
  });
});

renderManual("basic");
