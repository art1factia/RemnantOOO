class AdminScene extends BaseScene {
  enter(app) {
    this.app = app;
    this.orgImg = null;
    this.compImg = null;
    this.compBounds = null;
    this.loading = true;
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

    // 타이틀
    this.titleEl = createP(
      `관리자 모드 - 스테이지 ${app.store.currentAdminStage}/${CONFIG.TOTAL_STAGE}`
    );
    this.titleEl.style("font-size", "clamp(18px, 3vw, 28px)");
    this.titleEl.style("font-weight", "bold");
    this.titleEl.style("color", "#1e1e1e");
    this.titleEl.style("margin", "0");
    this.header.child(this.titleEl);
    this.domElements.push(this.titleEl);

    // 우상단 버튼 그룹
    const headerRight = createDiv("");
    headerRight.style("display", "flex");
    headerRight.style("align-items", "center");
    headerRight.style("gap", "15px");
    this.header.child(headerRight);
    this.domElements.push(headerRight);

    // 클릭 좌표 표시
    this.coordEl = createP("");
    this.coordEl.style("font-size", "14px");
    this.coordEl.style("color", "#2962FF");
    this.coordEl.style("margin", "0");
    headerRight.child(this.coordEl);
    this.domElements.push(this.coordEl);

    // 사용자로 전환 버튼
    this.switchBtn = createButton("사용자로 전환");
    this.switchBtn.mousePressed(() => app.dispatch({ type: ACTIONS.SELECT_USER }));
    this.switchBtn.style("padding", "10px 20px");
    this.switchBtn.style("font-size", "14px");
    this.switchBtn.style("background-color", "#ddd");
    this.switchBtn.style("color", "#222");
    this.switchBtn.style("border", "none");
    this.switchBtn.style("border-radius", "6px");
    this.switchBtn.style("cursor", "pointer");
    headerRight.child(this.switchBtn);
    this.domElements.push(this.switchBtn);

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

    // 정답 개수 표시
    this.answerCountEl = createP(`정답 포인트: ${app.store.adminAnswers.length}개`);
    this.answerCountEl.style("font-size", "16px");
    this.answerCountEl.style("color", "#333");
    this.answerCountEl.style("margin", "0");
    this.footer.child(this.answerCountEl);
    this.domElements.push(this.answerCountEl);

    // 저장 버튼
    this.updateSaveButton(app);
  }

  updateSaveButton(app) {
    if (this.saveBtn) {
      this.saveBtn.remove();
      const idx = this.domElements.indexOf(this.saveBtn);
      if (idx > -1) this.domElements.splice(idx, 1);
    }

    const isLastStage = app.store.currentAdminStage >= CONFIG.TOTAL_STAGE;
    const btnLabel = isLastStage ? "저장 후 완료" : "저장 (다음 사진으로)";

    this.saveBtn = createButton(btnLabel);
    this.saveBtn.mousePressed(() => this.handleSave(app));
    this.saveBtn.style("padding", "12px 24px");
    this.saveBtn.style("font-size", "16px");
    this.saveBtn.style("background-color", "#333");
    this.saveBtn.style("color", "#fff");
    this.saveBtn.style("border", "none");
    this.saveBtn.style("border-radius", "6px");
    this.saveBtn.style("cursor", "pointer");
    this.footer.child(this.saveBtn);
    this.domElements.push(this.saveBtn);
  }

  updateDisplay(app) {
    if (this.titleEl) {
      this.titleEl.html(
        `관리자 모드 - 스테이지 ${app.store.currentAdminStage}/${CONFIG.TOTAL_STAGE}`
      );
    }
    if (this.answerCountEl) {
      this.answerCountEl.html(`정답 포인트: ${app.store.adminAnswers.length}개`);
    }
    if (this.coordEl && this.lastClick) {
      this.coordEl.html(
        `클릭 좌표: (${this.lastClick.x.toFixed(3)}, ${this.lastClick.y.toFixed(3)})`
      );
    }
  }

  loadImages(app) {
    const stage = app.store.currentAdminStage - 1;
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

  async handleSave(app) {
    try {
      const answerData = {
        answer: app.store.adminAnswers.map((a) => ({
          id: a.id,
          x: a.x,
          y: a.y,
        })),
      };

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
        this.updateDisplay(app);
      }
    } catch (err) {
      console.error("Failed to save answer:", err);
      alert("정답 저장에 실패했습니다.");
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
    pg.text("비교 이미지 (클릭하여 정답 표시)", padding, compY + 5);

    if (this.compImg && this.compImg.width > 0) {
      this.compBounds = this.drawImageFit(
        pg,
        this.compImg,
        padding,
        compY + 25,
        imgWidth,
        imgHeight - 25
      );

      // 정답 마커 표시
      for (const ans of app.store.adminAnswers) {
        const pos = this.denormalizeCoord(ans.x, ans.y, this.compBounds);
        this.drawMarker(pg, pos.x, pos.y);
      }
    }
  }

  onMousePressed(app, mx, my) {
    if (!this.compBounds) return;

    const { x, y, w, h } = this.compBounds;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      const norm = this.normalizeCoord(mx, my, this.compBounds);

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

        this.updateDisplay(app);
      }
    }
  }
}
