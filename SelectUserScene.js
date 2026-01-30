class SelectUserScene extends BaseScene {
  enter(app) {
    // 중앙 정렬 컨테이너
    this.container = this.createCenteredContainer();

    // 타이틀
    this.title = this.createTitle("사용자 선택", this.container);

    // 부제목
    this.subtitle = this.createSubtitle("모드를 선택해주세요", this.container);

    // 버튼 그룹
    const buttonGroup = this.createButtonGroup(this.container);
    buttonGroup.style("flex-direction", "column");
    buttonGroup.style("gap", "20px");

    // 시니어 모드 버튼
    this.seniorBtn = this.createButtonElement(
      "시니어 모드",
      () => app.dispatch({ type: ACTIONS.CLICK_SENIOR }),
      buttonGroup
    );
    this.seniorBtn.style("width", "280px");
    this.seniorBtn.style("padding", "20px 40px");
    this.seniorBtn.style("font-size", "clamp(20px, 2.5vw, 24px)");
    this.seniorBtn.style("background-color", "#333");
    this.seniorBtn.style("color", "#fff");

    // 보호자 모드 버튼
    this.familyBtn = this.createButtonElement(
      "보호자 모드",
      () => app.dispatch({ type: ACTIONS.CLICK_FAMILY }),
      buttonGroup
    );
    this.familyBtn.style("width", "280px");
    this.familyBtn.style("padding", "20px 40px");
    this.familyBtn.style("font-size", "clamp(20px, 2.5vw, 24px)");
    this.familyBtn.style("background-color", "#ddd");
    this.familyBtn.style("color", "#222");
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255);
  }
}
