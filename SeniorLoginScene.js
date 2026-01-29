class SeniorLoginScene extends BaseScene {
  enter(app) {
    this.app = app;

    // 닉네임 입력
    this.nicknameLabel = this.createLabel("닉네임", 0, 0);
    this.nicknameLabel.style("color", "#333");
    this.nicknameInput = this.createInput("이름을 입력하세요", 0, 0);
    this.nicknameInput.style("width", "400px");
    this.nicknameInput.style("font-size", "20px");
    this.nicknameInput.style("padding", "16px 20px");

    // 레벨 슬라이더
    this.levelLabel = this.createLabel("난이도 레벨: 5", 0, 0);
    this.levelLabel.style("color", "#333");
    this.levelSlider = this.createSlider(0, 10, 5, 0, 0);
    this.levelSlider.style("width", "400px");
    this.levelSlider.style("height", "12px");

    // 슬라이더 값 변경 시 레이블 업데이트
    this.levelSlider.input(() => {
      this.levelLabel.html(`난이도 레벨: ${this.levelSlider.value()}`);
    });

    // 버튼 컨테이너 (나란히 배치)
    this.startBtn = this.createButton("시작하기", 0, 0, () =>
      this.handleStart(app),
    );
    this.startBtn.style("font-size", "20px");
    this.startBtn.style("padding", "16px 32px");
    this.startBtn.style("min-width", "180px");
    this.startBtn.style("background-color", "#333");
    this.startBtn.style("color", "#fff");

    this.backBtn = this.createButton("뒤로", 0, 0, () =>
      app.dispatch({ type: ACTIONS.SELECT_USER }),
    );
    this.backBtn.style("font-size", "20px");
    this.backBtn.style("padding", "16px 32px");
    this.backBtn.style("min-width", "180px");
    this.backBtn.style("background-color", "#ddd");
    this.backBtn.style("color", "#222");

    // 초기 위치 설정
    this.updateElementPositions();
  }

  updateElementPositions() {
    const centerX = this.pg.width / 2;
    const centerY = this.pg.height / 2;
    const inputWidth = 400;
    const btnWidth = 180;
    const btnGap = 20;

    this.nicknameLabel.position(centerX - inputWidth / 2, centerY - 120);
    this.nicknameInput.position(centerX - inputWidth / 2, centerY - 85);
    this.levelLabel.position(centerX - inputWidth / 2, centerY - 10);
    this.levelSlider.position(centerX - inputWidth / 2, centerY + 30);

    // 버튼 나란히 배치
    const totalBtnWidth = btnWidth * 2 + btnGap;
    this.backBtn.position(centerX - totalBtnWidth / 2, centerY + 100);
    this.startBtn.position(
      centerX - totalBtnWidth / 2 + btnWidth + btnGap,
      centerY + 100,
    );
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.nicknameLabel) {
      this.updateElementPositions();
    }
  }

  async handleStart(app) {
    const nickname = this.nicknameInput.value().trim();
    const level = this.levelSlider.value();

    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await login({ name: nickname, level: String(level) });

      if (response.isSuccess) {
        app.dispatch({
          type: ACTIONS.START_GAME,
          sessionId: response.result.sessionId,
          userId: response.result.userId,
          nickname: response.result.name,
          level: level,
        });
      } else {
        alert("로그인에 실패했습니다: " + response.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("서버 연결에 실패했습니다.");
    }
  }

  render() {
    const pg = this.pg;
    pg.clear();
    pg.background(255); // 흰색 배경

    const centerX = pg.width / 2;
    const titleY = pg.height / 4;

    // 타이틀
    pg.fill(30);
    pg.textSize(40);
    pg.textAlign(CENTER, CENTER);
    pg.text("시니어 모드", centerX, titleY);

    pg.textSize(20);
    pg.fill(100);
    pg.text("게임을 시작하기 전에 정보를 입력해주세요", centerX, titleY + 55);
  }
}
