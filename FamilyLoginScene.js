class FamilyLoginScene extends BaseScene {
  enter(app) {
    this.app = app;

    // 보호자 ID 입력
    this.idLabel = this.createLabel("보호자 ID", 0, 0);
    this.idLabel.style("color", "#333");
    this.idInput = this.createInput("보호자 ID를 입력하세요", 0, 0);
    this.idInput.style("width", "400px");
    this.idInput.style("font-size", "20px");
    this.idInput.style("padding", "16px 20px");

    // 버튼 (나란히 배치)
    this.confirmBtn = this.createButton("레포트 확인", 0, 0, () =>
      this.handleLogin(app),
    );
    this.confirmBtn.style("font-size", "20px");
    this.confirmBtn.style("padding", "16px 32px");
    this.confirmBtn.style("min-width", "180px");
    this.confirmBtn.style("background-color", "#333");
    this.confirmBtn.style("color", "#fff");

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

    this.idLabel.position(centerX - inputWidth / 2, centerY - 60);
    this.idInput.position(centerX - inputWidth / 2, centerY - 25);

    // 버튼 나란히 배치
    const totalBtnWidth = btnWidth * 2 + btnGap;
    this.backBtn.position(centerX - totalBtnWidth / 2, centerY + 60);
    this.confirmBtn.position(
      centerX - totalBtnWidth / 2 + btnWidth + btnGap,
      centerY + 60,
    );
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.idLabel) {
      this.updateElementPositions();
    }
  }

  async handleLogin(app) {
    const guardianId = this.idInput.value().trim();

    if (!guardianId) {
      alert("보호자 ID를 입력해주세요.");
      return;
    }

    try {
      const response = await familyLogin({ guardianId });

      if (response.isSuccess) {
        app.dispatch({
          type: ACTIONS.FAMILY_LOGIN,
          guardianId: guardianId,
          userId: response.result.userId,
          monthLists: response.result.lists,
        });
      } else {
        alert("로그인에 실패했습니다: " + response.message);
      }
    } catch (err) {
      console.error("Family login error:", err);
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
    pg.text("보호자 모드", centerX, titleY);

    pg.textSize(20);
    pg.fill(100);
    pg.text("레포트를 확인하려면 보호자 ID를 입력하세요", centerX, titleY + 55);
  }
}
