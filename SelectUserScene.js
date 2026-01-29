class SelectUserScene extends BaseScene {
  enter(app) {
    this.btnWidth = 280;
    this.btnHeight = 70;
    this.gap = 30;

    // 시니어 모드 버튼
    this.seniorBtn = this.createButton("시니어 모드", 0, 0, () =>
      app.dispatch({ type: ACTIONS.CLICK_SENIOR }),
    );
    this.seniorBtn.style("width", this.btnWidth + "px");
    this.seniorBtn.style("font-size", "24px");
    this.seniorBtn.style("padding", "20px 40px");
    this.seniorBtn.style("background-color", "#ddd");
    this.seniorBtn.style("color", "#222");

    // 보호자 모드 버튼
    this.familyBtn = this.createButton("보호자 모드", 0, 0, () =>
      app.dispatch({ type: ACTIONS.CLICK_FAMILY }),
    );
    this.familyBtn.style("width", this.btnWidth + "px");
    this.familyBtn.style("font-size", "24px");
    this.familyBtn.style("padding", "20px 40px");
    this.familyBtn.style("background-color", "#ddd");
    this.familyBtn.style("color", "#222");

    // 초기 위치 설정
    this.updateButtonPositions();
  }

  updateButtonPositions() {
    const centerX = this.pg.width / 2;
    const centerY = this.pg.height / 2;

    this.seniorBtn.position(
      centerX - this.btnWidth / 2,
      centerY - this.btnHeight - this.gap / 2,
    );
    this.familyBtn.position(
      centerX - this.btnWidth / 2,
      centerY + this.gap / 2,
    );
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.seniorBtn && this.familyBtn) {
      this.updateButtonPositions();
    }
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255); // 흰색 배경

    const centerX = pg.width / 2;
    const titleY = pg.height / 3;

    // 타이틀
    pg.fill(30);
    pg.textSize(48);
    pg.textAlign(CENTER, CENTER);
    pg.text("사용자 선택", centerX, titleY);

    pg.textSize(22);
    pg.fill(100);
    pg.text("모드를 선택해주세요", centerX, titleY + 60);
  }
}
