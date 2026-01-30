// 초기 시작 화면 설정 (개발용)
// STATES.ADMIN: 관리자 모드
// STATES.SELECT_USER: 사용자 선택 화면
// STATES.SENIOR_LOGIN: 시니어 로그인 화면
const INITIAL_STATE = STATES.SENIOR_LOGIN;

class App {
  constructor() {
    this.state = INITIAL_STATE; // 초기 상태

    this.store = {
      // ===== Admin Mode =====
      currentAdminStage: 1, // 현재 관리자 편집 중인 스테이지 (1 ~ TOTAL_STAGE)
      adminAnswers: [], // 현재 스테이지의 정답 좌표 [{id, x, y}, ...]

      // ===== Senior Game Mode =====
      sessionId: null, // API에서 받은 세션 ID
      userId: null, // 사용자 ID
      nickname: "", // 닉네임
      level: 5, // 난이도 레벨 (0~10)
      currentGameStage: 1, // 현재 게임 스테이지 (1 ~ TOTAL_STAGE)
      questionNum: 1, // 현재 문제 번호
      questionStartTime: null, // 문제 시작 시간 (클릭 시간 계산용)
      userClicks: [], // 현재 문제의 클릭 데이터 [{clickOrder, milisec, x, y}, ...]

      // ===== Game Result =====
      gameResult: null, // {totalScore, agility, judgment, graph}

      // ===== Family Report Mode =====
      guardianId: null, // 보호자 ID
      monthLists: [], // 레포트가 존재하는 월 리스트 [1, 2, 3, ...]
      selectedMonth: null, // 선택된 월
      reportData: null, // {level, graph, comment}

      // ===== Images =====
      images: {}, // 로드된 이미지들 캐싱
    };

    // Scene 인스턴스 생성
    this.scenes = {
      [STATES.ADMIN]: new AdminScene(),
      [STATES.SELECT_USER]: new SelectUserScene(),
      [STATES.SENIOR_LOGIN]: new SeniorLoginScene(),
      [STATES.FAMILY_LOGIN]: new FamilyLoginScene(),
      [STATES.INGAME]: new InGameScene(),
      [STATES.RESULT]: new ResultGameScene(),
      [STATES.REPORT_LIST]: new ReportListScene(),
      [STATES.REPORT_DETAIL]: new ReportDetailScene(),
    };

    // 초기 Scene 진입
    this.scenes[this.state].enter(this);
  }

  dispatch(action) {
    const out = reducer(this.state, this.store, action) || {};
    if (out.patch) Object.assign(this.store, out.patch);

    if (out.nextState && out.nextState !== this.state) {
      this.scenes[this.state].exit(this);
      this.state = out.nextState;
      this.scenes[this.state].enter(this, out.payload);
    }
  }

  update(dt) {
    this.scenes[this.state].update(this, dt);
  }

  render() {
    this.scenes[this.state].render(this);
    image(this.scenes[this.state].pg, 0, 0);
  }

  resize(w, h) {
    for (const key in this.scenes) {
      this.scenes[key].resize(w, h);
    }
  }

  mousePressed(mx, my) {
    this.scenes[this.state].onMousePressed(this, mx, my);
  }

  // 이미지 로드 헬퍼 (stage는 1-indexed, 파일은 0-indexed)
  getImage(stage, type) {
    const idx = stage - 1;
    const key = `${idx}_${type}`;
    if (!this.store.images[key]) {
      const filename = `${CONFIG.IMG_PATH}${idx}_${type}.jpg`;
      this.store.images[key] = loadImage(filename);
    }
    return this.store.images[key];
  }
}
