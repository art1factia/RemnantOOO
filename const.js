const STATES = {
  ADMIN: "admin",
  INGAME: "inGame",
  RESULT: "resultGame",
  REPORT_LIST: "reportList",
  REPORT_DETAIL: "reportDetail",
  SELECT_USER: "user",
  FAMILY_LOGIN: "familyLogin",
  SENIOR_LOGIN: "seniorLogin",
};

const ACTIONS = {
  // Admin
  GO_ADMIN: "GO_ADMIN",
  SAVE_ANSWER: "SAVE_ANSWER",           // 정답 저장 후 다음 스테이지
  ADMIN_NEXT_STAGE: "ADMIN_NEXT_STAGE", // 다음 스테이지로 이동

  // User selection
  SELECT_USER: "SELECT_USER",           // admin -> user 전환
  CLICK_SENIOR: "CLICK_SENIOR",         // user -> seniorLogin
  CLICK_FAMILY: "CLICK_FAMILY",         // user -> familyLogin

  // Senior flow
  START_GAME: "START_GAME",             // seniorLogin -> inGame (세션 생성)
  NEXT_QUESTION: "NEXT_QUESTION",       // inGame -> inGame (다음 문제)
  FINISH_GAME: "FINISH_GAME",           // inGame -> resultGame (마지막 문제 완료)
  RETRY_GAME: "RETRY_GAME",             // resultGame -> seniorLogin

  // Family flow
  FAMILY_LOGIN: "FAMILY_LOGIN",         // familyLogin -> reportList
  CLICK_REPORT: "CLICK_REPORT",         // reportList -> reportDetail
  BACK_TO_REPORT_LIST: "BACK_TO_REPORT_LIST", // reportDetail -> reportList
  BACK_TO_FAMILY_LOGIN: "BACK_TO_FAMILY_LOGIN", // reportList -> familyLogin

  // Game actions
  ADD_CLICK: "ADD_CLICK",               // 클릭 데이터 추가
  ADD_ADMIN_CLICK: "ADD_ADMIN_CLICK",   // 관리자 정답 클릭 추가
  REMOVE_ADMIN_CLICK: "REMOVE_ADMIN_CLICK", // 관리자 정답 클릭 제거
};

const CONFIG = {
  TOTAL_STAGE: 2,  // 현재 이미지 2개 (fig0, fig1). 이미지 추가 시 5로 변경
  MARKER_RADIUS: 25,
  IMG_PATH: "fig/fig",  // 이미지 경로 프리픽스 (fig/fig0_org.jpg 형식)
};

/*

  [ FSM ]
  admin -> user -> seniorLogin | familyLogin
  seniorLogin -> inGame -> resultGame -> seniorLogin
  familyLogin -> reportList <-> reportDetail -> familyLogin

*/
