class ReportListScene extends BaseScene {
  enter(app) {
    this.app = app;
    this.loading = false;
    this.monthButtons = [];

    // 뒤로가기 버튼
    this.backBtn = this.createButton("뒤로", 20, 20, () => {
      app.dispatch({ type: ACTIONS.BACK_TO_FAMILY_LOGIN });
    });
    this.backBtn.style("font-size", "18px");
    this.backBtn.style("padding", "14px 28px");
    this.backBtn.style("background-color", "#ddd");
    this.backBtn.style("color", "#222");

    // 월별 버튼 생성
    this.createMonthButtons(app);
  }

  createMonthButtons(app) {
    const months = app.store.monthLists;
    const btnWidth = 200;
    const btnHeight = 50;
    const gap = 15;

    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const btn = this.createButton(`${month}월 레포트`, 0, 0, () =>
        this.handleSelectMonth(app, month),
      );
      btn.style("width", btnWidth + "px");
      btn.style("font-size", "20px");
      btn.style("padding", "16px 32px");
      btn.style("background-color", "#ddd");
      btn.style("color", "#222");
      this.monthButtons.push({ btn, index: i });
    }

    this.updateButtonPositions();
  }

  updateButtonPositions() {
    const centerX = this.pg.width / 2;
    const startY = 150;
    const btnWidth = 200;
    const btnHeight = 50;
    const gap = 15;

    for (const { btn, index } of this.monthButtons) {
      const y = startY + (btnHeight + gap) * index;
      btn.position(centerX - btnWidth / 2, y);
    }
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.monthButtons.length > 0) {
      this.updateButtonPositions();
    }
  }

  async handleSelectMonth(app, month) {
    if (this.loading) return;
    this.loading = true;

    try {
      const response = await getData({
        userId: app.store.userId,
        month_: month,
      });

      if (response.isSuccess) {
        app.dispatch({
          type: ACTIONS.CLICK_REPORT,
          month: month,
          reportData: response.result,
        });
      } else {
        alert("레포트를 불러오는데 실패했습니다: " + response.message);
      }
    } catch (err) {
      console.error("Get report error:", err);
      alert("서버 연결에 실패했습니다.");
    } finally {
      this.loading = false;
    }
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255); // 흰색 배경

    const centerX = pg.width / 2;

    // 타이틀
    pg.fill(30);
    pg.textSize(40);
    pg.textAlign(CENTER, TOP);
    pg.text("레포트 목록", centerX, 60);

    pg.textSize(20);
    pg.fill(100);
    pg.text("확인할 월을 선택하세요", centerX, 110);

    if (app.store.monthLists.length === 0) {
      pg.fill(100);
      pg.textSize(22);
      pg.textAlign(CENTER, CENTER);
      pg.text("레포트가 없습니다", centerX, pg.height / 2);
    }

    if (this.loading) {
      pg.fill(30);
      pg.textSize(18);
      pg.textAlign(CENTER, BOTTOM);
      pg.text("로딩 중...", centerX, pg.height - 40);
    }
  }
}
