class SeniorLoginScene extends BaseScene {
  enter(app) {
    this.app = app;

    // 중앙 정렬 컨테이너
    this.container = this.createCenteredContainer();

    // 타이틀
    this.title = this.createTitle("시니어 모드", this.container);

    // 부제목
    this.subtitle = this.createSubtitle(
      "게임을 시작하기 전에 정보를 입력해주세요",
      this.container,
    );

    // 폼 그룹
    const formGroup = this.createFormGroup(this.container);

    // 닉네임 입력
    this.nicknameLabel = this.createLabelElement("닉네임", formGroup);
    this.nicknameInput = this.createInputElement(
      "이름을 입력하세요",
      formGroup,
    );

    // 레벨 슬라이더
    this.levelLabel = this.createLabelElement("난이도 레벨: 1", formGroup);
    this.levelSlider = this.createSliderElement(1, 3, 1, formGroup);

    // 슬라이더 값 변경 시 레이블 업데이트
    this.levelSlider.input(() => {
      this.levelLabel.html(`난이도 레벨: ${this.levelSlider.value()}`);
    });

    // 버튼 그룹
    const buttonGroup = this.createButtonGroup(formGroup);

    // 뒤로 버튼
    this.backBtn = this.createButtonElement(
      "뒤로",
      () => app.dispatch({ type: ACTIONS.SELECT_USER }),
      buttonGroup,
    );
    this.backBtn.style("background-color", "#ddd");
    this.backBtn.style("color", "#222");

    // 시작하기 버튼
    this.startBtn = this.createButtonElement(
      "시작하기",
      () => this.handleStart(app),
      buttonGroup,
    );
    this.startBtn.style("background-color", "#333");
    this.startBtn.style("color", "#fff");
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
    pg.background(255);
  }
}
