class AdminScene extends BaseScene {
  enter(app) {
    this.app = app;
    this.orgImg = null;
    this.compImg = null;
    this.compBounds = null;
    this.loading = true;
    this.lastClick = null; // 마지막 클릭 좌표 저장

    // 이미지 로드
    this.loadImages(app);

    // 우상단: 사용자로 전환 버튼
    this.switchBtn = this.createButton("사용자로 전환", 0, 0, () => {
      app.dispatch({ type: ACTIONS.SELECT_USER });
    });
    this.switchBtn.style("background-color", "#ddd");
    this.switchBtn.style("color", "#222");

    // 하단: 저장(다음사진으로) 버튼
    this.saveBtn = null;
    this.updateSaveButton(app);

    // 버튼 위치 설정
    this.updateButtonPositions();
  }

  updateButtonPositions() {
    // 우상단 버튼
    this.switchBtn.position(this.pg.width - 150, 10);

    // 저장 버튼
    if (this.saveBtn) {
      const isLastStage =
        this.app.store.currentAdminStage >= CONFIG.TOTAL_STAGE;
      const offset = isLastStage ? 80 : 100;
      this.saveBtn.position(this.pg.width / 2 - offset, this.pg.height - 60);
    }
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.switchBtn) {
      this.updateButtonPositions();
    }
  }

  loadImages(app) {
    const stage = app.store.currentAdminStage - 1; // 0-indexed
    this.loading = true;

    this.orgImg = loadImage(
      `${CONFIG.IMG_PATH}${stage}_org.jpg`,
      () => this.checkLoaded(),
      () => console.error("Failed to load org image:", stage),
    );
    this.compImg = loadImage(
      `${CONFIG.IMG_PATH}${stage}_comp.jpg`,
      () => this.checkLoaded(),
      () => console.error("Failed to load comp image:", stage),
    );
  }

  checkLoaded() {
    if (
      this.orgImg &&
      this.compImg &&
      this.orgImg.width > 0 &&
      this.compImg.width > 0
    ) {
      this.loading = false;
    }
  }

  updateSaveButton(app) {
    // 기존 저장 버튼 제거
    if (this.saveBtn) {
      const idx = this.domElements.indexOf(this.saveBtn);
      if (idx > -1) {
        this.domElements.splice(idx, 1);
        this.saveBtn.remove();
      }
      this.saveBtn = null;
    }

    const isLastStage = app.store.currentAdminStage >= CONFIG.TOTAL_STAGE;
    const btnLabel = isLastStage ? "저장 후 완료" : "저장 (다음 사진으로)";

    this.saveBtn = this.createButton(btnLabel, 0, 0, () =>
      this.handleSave(app),
    );
    this.saveBtn.style("background-color", "#ddd");
    this.saveBtn.style("color", "#222");
    this.updateButtonPositions();
  }

  async handleSave(app) {
    try {
      const answerData = {
        answer: app.store.adminAnswers.map((a) => ({
          id: a.id,
          x: a.x,
          y: a.y,
        })),
      };

      // 백엔드로 보내게 될 데이터 구조 콘솔 출력
      console.log("=== [Admin] 정답 저장 데이터 ===");
      console.log("API Endpoint: POST /staff/answers");
      console.log("Stage:", app.store.currentAdminStage);
      console.log("Request Body:", JSON.stringify(answerData, null, 2));
      console.log("================================");

      await saveAnswer(answerData);
      console.log("Answer saved for stage", app.store.currentAdminStage);

      const isLastStage = app.store.currentAdminStage >= CONFIG.TOTAL_STAGE;

      app.dispatch({ type: ACTIONS.ADMIN_NEXT_STAGE });

      if (!isLastStage) {
        this.loadImages(app);
        this.updateSaveButton(app);
      }
    } catch (err) {
      console.error("Failed to save answer:", err);
      alert("정답 저장에 실패했습니다.");
    }
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255); // 흰색 배경

    const padding = 20;
    const headerHeight = 50;
    const footerHeight = 80;
    const availableHeight =
      pg.height - headerHeight - footerHeight - padding * 3;
    const imgHeight = availableHeight / 2;
    const imgWidth = pg.width - padding * 2;

    // 헤더
    pg.fill(30);
    pg.textSize(28);
    pg.textAlign(LEFT, CENTER);
    pg.text(
      `관리자 모드 - 스테이지 ${app.store.currentAdminStage}/${CONFIG.TOTAL_STAGE}`,
      padding,
      headerHeight / 2,
    );

    if (this.loading) {
      pg.textAlign(CENTER, CENTER);
      pg.text("이미지 로딩 중...", pg.width / 2, pg.height / 2);
      return;
    }

    // 상단: 원본 이미지
    pg.fill(80);
    pg.textSize(18);
    pg.textAlign(LEFT, TOP);
    pg.text("원본 이미지", padding, headerHeight + 5);

    if (this.orgImg && this.orgImg.width > 0) {
      this.drawImageFit(
        pg,
        this.orgImg,
        padding,
        headerHeight + 25,
        imgWidth,
        imgHeight - 25,
      );
    }

    // 하단: 비교 이미지 (정답 클릭 영역)
    const compY = headerHeight + imgHeight + padding;
    pg.fill(80);
    pg.text("비교 이미지 (클릭하여 정답 표시)", padding, compY + 5);

    if (this.compImg && this.compImg.width > 0) {
      this.compBounds = this.drawImageFit(
        pg,
        this.compImg,
        padding,
        compY + 25,
        imgWidth,
        imgHeight - 25,
      );

      // 정답 마커 표시
      for (const ans of app.store.adminAnswers) {
        const pos = this.denormalizeCoord(ans.x, ans.y, this.compBounds);
        this.drawMarker(pg, pos.x, pos.y);
      }
    }

    // 정답 개수 표시
    pg.fill(30);
    pg.textAlign(RIGHT, TOP);
    pg.textSize(18);
    pg.text(
      `정답 포인트: ${app.store.adminAnswers.length}개`,
      pg.width - padding,
      compY + 5,
    );

    // 마지막 클릭 좌표 표시 (우상단)
    if (this.lastClick) {
      pg.fill(41, 98, 255);
      pg.textSize(20);
      pg.textAlign(RIGHT, TOP);
      pg.text(
        `클릭 좌표: (${this.lastClick.x.toFixed(3)}, ${this.lastClick.y.toFixed(3)})`,
        pg.width - padding,
        headerHeight + 10,
      );
    }
  }

  onMousePressed(app, mx, my) {
    if (!this.compBounds) return;

    const { x, y, w, h } = this.compBounds;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      const norm = this.normalizeCoord(mx, my, this.compBounds);

      // 마지막 클릭 좌표 저장
      this.lastClick = { x: norm.x, y: norm.y };

      if (norm.x >= 0 && norm.x <= 1 && norm.y >= 0 && norm.y <= 1) {
        const existingIdx = app.store.adminAnswers.findIndex((ans) => {
          const dx = ans.x - norm.x;
          const dy = ans.y - norm.y;
          return Math.sqrt(dx * dx + dy * dy) < 0.05;
        });

        if (existingIdx >= 0) {
          app.dispatch({
            type: ACTIONS.REMOVE_ADMIN_CLICK,
            x: norm.x,
            y: norm.y,
          });
        } else {
          app.dispatch({ type: ACTIONS.ADD_ADMIN_CLICK, x: norm.x, y: norm.y });
        }
      }
    }
  }
}
