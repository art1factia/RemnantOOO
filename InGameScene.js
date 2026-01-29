class InGameScene extends BaseScene {
  enter(app) {
    this.app = app;
    this.orgImg = null;
    this.compImg = null;
    this.compBounds = null;
    this.loading = true;
    this.submitting = false;
    this.lastClick = null; // 마지막 클릭 좌표 저장

    // 이미지 로드
    this.loadImages(app);

    // 하단 버튼 생성
    this.actionBtn = null;
    this.updateActionButton(app);
  }

  loadImages(app) {
    const stage = app.store.currentGameStage - 1; // 0-indexed
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

  updateActionButton(app) {
    // 기존 버튼 제거
    if (this.actionBtn) {
      const idx = this.domElements.indexOf(this.actionBtn);
      if (idx > -1) {
        this.domElements.splice(idx, 1);
        this.actionBtn.remove();
      }
      this.actionBtn = null;
    }

    const isLastStage = app.store.currentGameStage >= CONFIG.TOTAL_STAGE;
    const btnLabel = isLastStage ? "결과 확인하기" : "다음 문제";

    this.actionBtn = this.createButton(
      btnLabel,
      this.pg.width / 2 - 80,
      this.pg.height - 60,
      () => this.handleNext(app),
    );
    this.actionBtn.style("background-color", "#ddd");
    this.actionBtn.style("color", "#222");
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.actionBtn) {
      this.actionBtn.position(this.pg.width / 2 - 80, this.pg.height - 60);
    }
  }

  async handleNext(app) {
    if (this.submitting) return;
    this.submitting = true;

    try {
      // 클릭 데이터 제출
      const submitPayload = {
        sessionId: app.store.sessionId,
        questionNum: app.store.questionNum,
        data: { answer: app.store.userClicks },
      };

      // 백엔드로 보내게 될 데이터 구조 콘솔 출력
      console.log("=== [InGame] 답변 제출 데이터 ===");
      console.log(`API Endpoint: POST /users/${app.store.sessionId}/${app.store.questionNum}/answers`);
      console.log("Stage:", app.store.currentGameStage);
      console.log("Player:", app.store.nickname);
      console.log("Request Body:", JSON.stringify(submitPayload, null, 2));
      console.log("=================================");

      await submitData(submitPayload);
      console.log("Submitted data for question", app.store.questionNum);

      const isLastStage = app.store.currentGameStage >= CONFIG.TOTAL_STAGE;

      if (isLastStage) {
        // 게임 결과 가져오기
        const resultResponse = await getGameResults({
          sessionId: app.store.sessionId,
        });

        if (resultResponse.isSuccess) {
          app.dispatch({
            type: ACTIONS.FINISH_GAME,
            result: resultResponse.result,
          });
        } else {
          alert("결과를 불러오는데 실패했습니다.");
        }
      } else {
        // 다음 문제로
        app.dispatch({ type: ACTIONS.NEXT_QUESTION });
        this.loadImages(app);
        this.updateActionButton(app);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("데이터 제출에 실패했습니다.");
    } finally {
      this.submitting = false;
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
      `문제 ${app.store.currentGameStage}/${CONFIG.TOTAL_STAGE}`,
      padding,
      headerHeight / 2,
    );

    // 닉네임 표시
    pg.textAlign(RIGHT, CENTER);
    pg.textSize(18);
    pg.fill(100);
    pg.text(
      `플레이어: ${app.store.nickname}`,
      pg.width - padding,
      headerHeight / 2,
    );

    if (this.loading) {
      pg.fill(30);
      pg.textAlign(CENTER, CENTER);
      pg.textSize(18);
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

    // 하단: 비교 이미지 (클릭 영역)
    const compY = headerHeight + imgHeight + padding;
    pg.fill(80);
    pg.text("비교 이미지 (틀린 부분을 클릭하세요)", padding, compY + 5);

    if (this.compImg && this.compImg.width > 0) {
      this.compBounds = this.drawImageFit(
        pg,
        this.compImg,
        padding,
        compY + 25,
        imgWidth,
        imgHeight - 25,
      );

      // 사용자 클릭 마커 표시 (파란색)
      for (const click of app.store.userClicks) {
        const pos = this.denormalizeCoord(click.x, click.y, this.compBounds);
        this.drawMarker(pg, pos.x, pos.y, CONFIG.MARKER_RADIUS, [41, 98, 255]);
      }
    }

    // 클릭 횟수 표시
    pg.fill(30);
    pg.textAlign(RIGHT, TOP);
    pg.textSize(18);
    pg.text(
      `클릭: ${app.store.userClicks.length}회`,
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
    // 비교 이미지 영역 클릭 감지
    if (!this.compBounds || this.submitting) return;

    const { x, y, w, h } = this.compBounds;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      const norm = this.normalizeCoord(mx, my, this.compBounds);

      // 마지막 클릭 좌표 저장
      this.lastClick = { x: norm.x, y: norm.y };

      // 0~1 범위 내인지 확인
      if (norm.x >= 0 && norm.x <= 1 && norm.y >= 0 && norm.y <= 1) {
        app.dispatch({ type: ACTIONS.ADD_CLICK, x: norm.x, y: norm.y });
      }
    }
  }
}
