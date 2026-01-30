class ResultGameScene extends BaseScene {
  // 개발용 변수: true면 상세 결과 표시, false면 감사 메시지만 표시
  showResult = false;

  enter(app) {
    this.app = app;

    // 다시하기 버튼
    this.retryBtn = this.createButton("다시하기", 0, 0, () => {
      app.dispatch({ type: ACTIONS.RETRY_GAME });
    });
    this.retryBtn.style("font-size", "22px");
    this.retryBtn.style("padding", "18px 36px");
    this.retryBtn.style("min-width", "200px");
    this.retryBtn.style("background-color", "#ddd");
    this.retryBtn.style("color", "#222");

    this.updateButtonPosition();
  }

  updateButtonPosition() {
    this.retryBtn.position(this.pg.width / 2 - 60, this.pg.height - 80);
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.retryBtn) {
      this.updateButtonPosition();
    }
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255); // 흰색 배경

    // showResult가 false면 감사 메시지만 표시
    if (!this.showResult) {
      pg.fill(30);
      pg.textAlign(CENTER, CENTER);
      pg.textSize(36);
      pg.text("감사합니다!", pg.width / 2, pg.height / 2 - 40);
      pg.fill(100);
      pg.textSize(20);
      pg.text("테스트에 참여해 주셔서 감사합니다.", pg.width / 2, pg.height / 2 + 20);
      return;
    }

    const result = app.store.gameResult;
    if (!result) {
      pg.fill(50);
      pg.textAlign(CENTER, CENTER);
      pg.textSize(20);
      pg.text("결과를 불러오는 중...", pg.width / 2, pg.height / 2);
      return;
    }

    const padding = 40;
    let y = 60;

    // 타이틀
    pg.fill(30);
    pg.textSize(40);
    pg.textAlign(CENTER, TOP);
    pg.text("게임 결과", pg.width / 2, y);
    y += 80;

    // 점수 정보
    pg.textAlign(LEFT, TOP);
    pg.textSize(26);

    // 종합 점수
    pg.fill(245, 124, 0); // 주황색
    pg.text(`종합 점수: ${result.totalScore}점`, padding, y);
    pg.fill(100);
    pg.textSize(18);
    pg.text("전체적인 게임 수행 능력을 나타냅니다", padding, y + 35);
    y += 85;

    // 민첩성
    pg.fill(41, 98, 255); // 파란색
    pg.textSize(26);
    pg.text(`민첩성: ${result.agility}점`, padding, y);
    pg.fill(100);
    pg.textSize(18);
    pg.text("틀린 부분을 얼마나 빠르게 찾았는지를 나타냅니다", padding, y + 35);
    y += 85;

    // 판단력
    pg.fill(46, 125, 50); // 초록색
    pg.textSize(26);
    pg.text(`판단력: ${result.judgment}점`, padding, y);
    pg.fill(100);
    pg.textSize(18);
    pg.text("정확하게 틀린 부분을 클릭했는지를 나타냅니다", padding, y + 35);
    y += 95;

    // 그래프
    if (result.graph && result.graph.length > 0) {
      this.drawGraph(pg, result.graph, padding, y, pg.width - padding * 2, 180);
      y += 200;

      // 경향성 분석 텍스트
      pg.fill(30);
      pg.textSize(20);
      pg.textAlign(CENTER, TOP);
      const trend = this.analyzeTrend(result.graph);
      pg.text(`경향성 분석: ${trend}`, pg.width / 2, y);
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
