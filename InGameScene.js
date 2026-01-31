class InGameScene extends BaseScene {
  enter(app) {
    this.app = app;
    this.orgImg = null;
    this.compImg = null;
    this.compBounds = null;
    this.loading = true;
    this.submitting = false;
    this.lastClick = null;

    // DOM 요소 생성
    this.createDomElements(app);

    // 이미지 로드
    this.loadImages(app);
  }

  createDomElements(app) {
    // 상단 헤더 컨테이너
    this.header = createDiv("");
    this.header.class("scene-header");
    this.header.style("position", "fixed");
    this.header.style("top", "0");
    this.header.style("left", "0");
    this.header.style("right", "0");
    this.header.style("height", "60px");
    this.header.style("background", "rgba(255,255,255,0.95)");
    this.header.style("display", "flex");
    this.header.style("justify-content", "space-between");
    this.header.style("align-items", "center");
    this.header.style("padding", "0 20px");
    this.header.style("box-sizing", "border-box");
    this.header.style("z-index", "100");
    this.header.style("border-bottom", "1px solid #eee");
    this.domElements.push(this.header);

    // 타이틀 (문제 번호)
    this.titleEl = createP(
      `문제 ${app.store.currentGameStage}/${CONFIG.TOTAL_STAGE}`
    );
    this.titleEl.style("font-size", "clamp(18px, 3vw, 28px)");
    this.titleEl.style("font-weight", "bold");
    this.titleEl.style("color", "#1e1e1e");
    this.titleEl.style("margin", "0");
    this.header.child(this.titleEl);
    this.domElements.push(this.titleEl);

    // 우상단 정보 그룹
    const headerRight = createDiv("");
    headerRight.style("display", "flex");
    headerRight.style("align-items", "center");
    headerRight.style("gap", "15px");
    this.header.child(headerRight);
    this.domElements.push(headerRight);

    // 플레이어 이름
    this.playerEl = createP(`플레이어: ${app.store.nickname}`);
    this.playerEl.style("font-size", "14px");
    this.playerEl.style("color", "#666");
    this.playerEl.style("margin", "0");
    headerRight.child(this.playerEl);
    this.domElements.push(this.playerEl);

    // 하단 푸터 컨테이너
    this.footer = createDiv("");
    this.footer.class("scene-footer");
    this.footer.style("position", "fixed");
    this.footer.style("bottom", "0");
    this.footer.style("left", "0");
    this.footer.style("right", "0");
    this.footer.style("height", "70px");
    this.footer.style("background", "rgba(255,255,255,0.95)");
    this.footer.style("display", "flex");
    this.footer.style("justify-content", "center");
    this.footer.style("align-items", "center");
    this.footer.style("gap", "20px");
    this.footer.style("z-index", "100");
    this.footer.style("border-top", "1px solid #eee");
    this.domElements.push(this.footer);

    // 클릭 횟수 표시
    this.clickCountEl = createP(`클릭: ${app.store.userClicks.length}회`);
    this.clickCountEl.style("font-size", "16px");
    this.clickCountEl.style("color", "#333");
    this.clickCountEl.style("margin", "0");
    this.footer.child(this.clickCountEl);
    this.domElements.push(this.clickCountEl);

    // 틀린 그림 개수
    this.targetCountEl = createP("틀린 그림 개수: 5개");
    this.targetCountEl.style("font-size", "16px");
    this.targetCountEl.style("color", "#666");
    this.targetCountEl.style("margin", "0");
    this.footer.child(this.targetCountEl);
    this.domElements.push(this.targetCountEl);

    // 액션 버튼
    this.updateActionButton(app);
  }

  updateActionButton(app) {
    if (this.actionBtn) {
      this.actionBtn.remove();
      const idx = this.domElements.indexOf(this.actionBtn);
      if (idx > -1) this.domElements.splice(idx, 1);
    }

    const isLastStage = app.store.currentGameStage >= CONFIG.TOTAL_STAGE;
    const btnLabel = isLastStage ? "결과 확인하기" : "다음 문제";

    this.actionBtn = createButton(btnLabel);
    this.actionBtn.mousePressed(() => this.handleNext(app));
    this.actionBtn.style("padding", "12px 24px");
    this.actionBtn.style("font-size", "16px");
    this.actionBtn.style("background-color", "#333");
    this.actionBtn.style("color", "#fff");
    this.actionBtn.style("border", "none");
    this.actionBtn.style("border-radius", "6px");
    this.actionBtn.style("cursor", "pointer");
    this.footer.child(this.actionBtn);
    this.domElements.push(this.actionBtn);
  }

  updateDisplay(app) {
    if (this.titleEl) {
      this.titleEl.html(`문제 ${app.store.currentGameStage}/${CONFIG.TOTAL_STAGE}`);
    }
    if (this.clickCountEl) {
      this.clickCountEl.html(`클릭: ${app.store.userClicks.length}회`);
    }
  }

  loadImages(app) {
    const stage = app.store.currentGameStage - 1;
    this.loading = true;

    this.orgImg = loadImage(
      `${CONFIG.IMG_PATH}${stage}_org.jpg`,
      () => this.checkLoaded(),
      () => console.error("Failed to load org image:", stage)
    );
    this.compImg = loadImage(
      `${CONFIG.IMG_PATH}${stage}_comp.jpg`,
      () => this.checkLoaded(),
      () => console.error("Failed to load comp image:", stage)
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

  async handleNext(app) {
    if (this.submitting) return;
    this.submitting = true;

    try {
      const submitPayload = {
        sessionId: app.store.sessionId,
        questionNum: app.store.questionNum,
        data: { answer: app.store.userClicks },
      };

      console.log("=== [InGame] 답변 제출 데이터 ===");
      console.log(
        `API Endpoint: POST /users/${app.store.sessionId}/${app.store.questionNum}/answers`
      );
      console.log("Stage:", app.store.currentGameStage);
      console.log("Player:", app.store.nickname);
      console.log("Request Body:", JSON.stringify(submitPayload, null, 2));
      console.log("=================================");

      await submitData(submitPayload);
      console.log("Submitted data for question", app.store.questionNum);

      const isLastStage = app.store.currentGameStage >= CONFIG.TOTAL_STAGE;

      if (isLastStage) {
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
        app.dispatch({ type: ACTIONS.NEXT_QUESTION });
        this.loadImages(app);
        this.updateActionButton(app);
        this.updateDisplay(app);
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
    pg.background(255);

    // 헤더/푸터 공간 확보
    const headerHeight = 70;
    const footerHeight = 80;
    const padding = 20;
    const availableHeight = pg.height - headerHeight - footerHeight - padding * 2;
    const imgHeight = (availableHeight - padding) / 2;
    const imgWidth = pg.width - padding * 2;

    // 정보 업데이트
    this.updateDisplay(app);

    if (this.loading) {
      pg.fill(30);
      pg.textAlign(CENTER, CENTER);
      pg.textSize(18);
      pg.text("이미지 로딩 중...", pg.width / 2, pg.height / 2);
      return;
    }

    // 상단: 원본 이미지
    const orgY = headerHeight;
    pg.fill(80);
    pg.textSize(16);
    pg.textAlign(LEFT, TOP);
    pg.text("원본 이미지", padding, orgY + 5);

    if (this.orgImg && this.orgImg.width > 0) {
      this.drawImageFit(
        pg,
        this.orgImg,
        padding,
        orgY + 25,
        imgWidth,
        imgHeight - 25
      );
    }

    // 하단: 비교 이미지
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
        imgHeight - 25
      );

      // 사용자 클릭 마커 표시 (파란색)
      for (const click of app.store.userClicks) {
        const pos = this.denormalizeCoord(click.x, click.y, this.compBounds);
        this.drawMarker(pg, pos.x, pos.y, CONFIG.MARKER_RADIUS, [41, 98, 255]);
      }
    }
  }

  onMousePressed(app, mx, my) {
    if (!this.compBounds || this.submitting) return;

    const { x, y, w, h } = this.compBounds;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      const norm = this.normalizeCoord(mx, my, this.compBounds);

      this.lastClick = { x: norm.x, y: norm.y };

      if (norm.x >= 0 && norm.x <= 1 && norm.y >= 0 && norm.y <= 1) {
        app.dispatch({ type: ACTIONS.ADD_CLICK, x: norm.x, y: norm.y });
        this.updateDisplay(app);
      }
    }
  }
}
