class ResultGameScene extends BaseScene {
  // 개발용 변수: true면 상세 결과 표시, false면 감사 메시지만 표시
  showResult = false;

  enter(app) {
    this.app = app;

    // 중앙 정렬 컨테이너
    this.container = this.createCenteredContainer();

    if (!this.showResult) {
      // 감사 메시지 모드
      this.createThankYouView(app);
    } else {
      // 결과 표시 모드
      this.createResultView(app);
    }
  }

  createThankYouView(app) {
    // 타이틀
    this.title = this.createTitle("감사합니다!", this.container);
    this.title.style("font-size", "clamp(32px, 5vw, 48px)");

    // 부제목
    this.subtitle = this.createSubtitle(
      "테스트에 참여해 주셔서 감사합니다.",
      this.container
    );

    // 버튼 그룹
    const buttonGroup = this.createButtonGroup(this.container);

    // 다시하기 버튼
    this.retryBtn = this.createButtonElement(
      "다시하기",
      () => app.dispatch({ type: ACTIONS.RETRY_GAME }),
      buttonGroup
    );
    this.retryBtn.style("padding", "18px 36px");
    this.retryBtn.style("font-size", "clamp(18px, 2.5vw, 22px)");
    this.retryBtn.style("min-width", "200px");
    this.retryBtn.style("background-color", "#333");
    this.retryBtn.style("color", "#fff");
  }

  createResultView(app) {
    // 결과 컨테이너
    const resultContainer = createDiv("");
    resultContainer.style("display", "flex");
    resultContainer.style("flex-direction", "column");
    resultContainer.style("align-items", "center");
    resultContainer.style("width", "100%");
    resultContainer.style("max-width", "600px");
    resultContainer.style("padding", "20px");
    resultContainer.style("box-sizing", "border-box");
    resultContainer.style("pointer-events", "auto");
    this.container.child(resultContainer);
    this.domElements.push(resultContainer);

    // 타이틀
    this.title = this.createTitle("게임 결과", resultContainer);

    // 점수 영역
    const scoreContainer = createDiv("");
    scoreContainer.style("width", "100%");
    scoreContainer.style("margin", "20px 0");
    resultContainer.child(scoreContainer);
    this.domElements.push(scoreContainer);

    // 결과 데이터가 있으면 표시
    const result = app.store.gameResult;
    if (result) {
      this.createScoreItem(scoreContainer, "종합 점수", result.totalScore, "#F57C00", "전체적인 게임 수행 능력을 나타냅니다");
      this.createScoreItem(scoreContainer, "민첩성", result.agility, "#2962FF", "틀린 부분을 얼마나 빠르게 찾았는지를 나타냅니다");
      this.createScoreItem(scoreContainer, "판단력", result.judgment, "#2E7D32", "정확하게 틀린 부분을 클릭했는지를 나타냅니다");
    }

    // 버튼 그룹
    const buttonGroup = this.createButtonGroup(resultContainer);

    // 다시하기 버튼
    this.retryBtn = this.createButtonElement(
      "다시하기",
      () => app.dispatch({ type: ACTIONS.RETRY_GAME }),
      buttonGroup
    );
    this.retryBtn.style("padding", "18px 36px");
    this.retryBtn.style("font-size", "clamp(18px, 2.5vw, 22px)");
    this.retryBtn.style("min-width", "200px");
    this.retryBtn.style("background-color", "#333");
    this.retryBtn.style("color", "#fff");
  }

  createScoreItem(container, label, score, color, description) {
    const item = createDiv("");
    item.style("margin-bottom", "20px");
    item.style("padding", "15px");
    item.style("background", "#f9f9f9");
    item.style("border-radius", "8px");
    item.style("border-left", `4px solid ${color}`);
    container.child(item);
    this.domElements.push(item);

    const scoreText = createP(`${label}: ${score}점`);
    scoreText.style("font-size", "clamp(20px, 3vw, 26px)");
    scoreText.style("font-weight", "bold");
    scoreText.style("color", color);
    scoreText.style("margin", "0 0 8px 0");
    item.child(scoreText);
    this.domElements.push(scoreText);

    const descText = createP(description);
    descText.style("font-size", "clamp(14px, 2vw, 18px)");
    descText.style("color", "#666");
    descText.style("margin", "0");
    item.child(descText);
    this.domElements.push(descText);
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255);

    // showResult가 true이고 그래프가 있으면 캔버스에 그래프 그리기
    if (this.showResult) {
      const result = app.store.gameResult;
      if (result && result.graph && result.graph.length > 0) {
        const padding = 40;
        const graphY = pg.height - 280;
        this.drawGraph(pg, result.graph, padding, graphY, pg.width - padding * 2, 180);

        // 경향성 분석 텍스트
        pg.fill(30);
        pg.textSize(18);
        pg.textAlign(CENTER, TOP);
        const trend = this.analyzeTrend(result.graph);
        pg.text(`경향성 분석: ${trend}`, pg.width / 2, graphY + 190);
      }
    }
  }

  drawGraph(pg, data, x, y, w, h) {
    if (data.length === 0) return;

    // 그래프 배경
    pg.fill(245);
    pg.noStroke();
    pg.rect(x, y, w, h, 8);

    // 그리드 라인
    pg.stroke(220);
    pg.strokeWeight(1);
    for (let i = 0; i <= 4; i++) {
      const gy = y + (h / 4) * i;
      pg.line(x, gy, x + w, gy);
    }

    // 데이터 포인트 계산
    const points = [];
    const graphPadding = 30;
    const graphW = w - graphPadding * 2;
    const graphH = h - graphPadding * 2;
    const maxVal = Math.max(...data, 100);
    const minVal = 0;

    for (let i = 0; i < data.length; i++) {
      const px = x + graphPadding + (graphW / (data.length - 1 || 1)) * i;
      const py =
        y +
        graphPadding +
        graphH -
        ((data[i] - minVal) / (maxVal - minVal)) * graphH;
      points.push({ x: px, y: py, value: data[i] });
    }

    // 선 그리기
    pg.stroke(41, 98, 255);
    pg.strokeWeight(3);
    pg.noFill();
    pg.beginShape();
    for (const p of points) {
      pg.vertex(p.x, p.y);
    }
    pg.endShape();

    // 포인트 그리기
    pg.fill(41, 98, 255);
    pg.noStroke();
    for (const p of points) {
      pg.ellipse(p.x, p.y, 10, 10);
    }

    // 값 표시
    pg.fill(30);
    pg.textSize(12);
    pg.textAlign(CENTER, BOTTOM);
    for (const p of points) {
      pg.text(p.value, p.x, p.y - 8);
    }

    // X축 레이블 (문제 번호)
    pg.fill(100);
    pg.textAlign(CENTER, TOP);
    for (let i = 0; i < points.length; i++) {
      pg.text(`Q${i + 1}`, points[i].x, y + h - 20);
    }
  }

  analyzeTrend(data) {
    if (data.length < 2) return "데이터가 충분하지 않습니다";

    const first = data.slice(0, Math.ceil(data.length / 2));
    const second = data.slice(Math.ceil(data.length / 2));

    const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
    const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;

    const diff = secondAvg - firstAvg;

    if (diff > 5) {
      return "점점 실력이 향상되고 있습니다! 좋은 추세입니다.";
    } else if (diff < -5) {
      return "후반부에 집중력이 다소 떨어졌습니다. 휴식이 필요할 수 있습니다.";
    } else {
      return "일관된 수행 능력을 보여주고 있습니다.";
    }
  }
}
