class FamilyLoginScene extends BaseScene {
  enter(app) {
    this.app = app;

    // 중앙 정렬 컨테이너
    this.container = this.createCenteredContainer();

    // 타이틀
    this.title = this.createTitle("보호자 모드", this.container);

    // 부제목
    this.subtitle = this.createSubtitle(
      "레포트를 확인하려면 보호자 ID를 입력하세요",
      this.container
    );

    // 폼 그룹
    const formGroup = this.createFormGroup(this.container);

    // 보호자 ID 입력
    this.idLabel = this.createLabelElement("보호자 ID", formGroup);
    this.idInput = this.createInputElement("보호자 ID를 입력하세요", formGroup);

    // 버튼 그룹
    const buttonGroup = this.createButtonGroup(formGroup);

    // 뒤로 버튼
    this.backBtn = this.createButtonElement(
      "뒤로",
      () => app.dispatch({ type: ACTIONS.SELECT_USER }),
      buttonGroup
    );
    this.backBtn.style("background-color", "#ddd");
    this.backBtn.style("color", "#222");

    // 레포트 확인 버튼
    this.confirmBtn = this.createButtonElement(
      "레포트 확인",
      () => this.handleLogin(app),
      buttonGroup
    );
    this.confirmBtn.style("background-color", "#333");
    this.confirmBtn.style("color", "#fff");
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
    pg.background(255);
  }
}
