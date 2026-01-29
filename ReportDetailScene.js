class ReportDetailScene extends BaseScene {
  enter(app) {
    this.app = app;
    this.animationStartTime = millis();
    this.animationDuration = 1000; // 1초 동안 애니메이션

    // 목록으로 버튼
    this.backBtn = this.createButton("목록으로", 0, 0, () => {
      app.dispatch({ type: ACTIONS.BACK_TO_REPORT_LIST });
    });
    this.backBtn.style("font-size", "22px");
    this.backBtn.style("padding", "18px 36px");
    this.backBtn.style("min-width", "200px");
    this.backBtn.style("background-color", "#ddd");
    this.backBtn.style("color", "#222");

    this.updateButtonPosition();
  }

  updateButtonPosition() {
    this.backBtn.position(this.pg.width / 2 - 100, this.pg.height - 80);
  }

  resize(w, h) {
    super.resize(w, h);
    if (this.backBtn) {
      this.updateButtonPosition();
    }
  }

  update(app, dt) {
    // 애니메이션 진행 중이면 계속 렌더링
  }

  render(app) {
    const pg = this.pg;
    pg.clear();
    pg.background(255); // 흰색 배경

    const report = app.store.reportData;
    const month = app.store.selectedMonth;

    if (!report) {
      pg.fill(50);
      pg.textAlign(CENTER, CENTER);
      pg.textSize(20);
      pg.text("레포트를 불러오는 중...", pg.width / 2, pg.height / 2);
      return;
    }

    const padding = 40;
    let y = 50;

    // 연월 타이틀
    pg.fill(30);
    pg.textSize(36);
    pg.textAlign(CENTER, TOP);
    pg.text(`${report.targetMonth} 리포트`, pg.width / 2, y);
    y += 60;

    // 이번달 인지 건강 점수
    pg.fill(50);
    pg.textSize(20);
    pg.text("이번달 인지 건강 점수", pg.width / 2, y);
    y += 35;

    pg.fill(30);
    pg.textSize(48);
    pg.textStyle(BOLD);
    pg.text(`${report.summary.avgTotalScore}점`, pg.width / 2, y);
    pg.textStyle(NORMAL);

    // 점수 변화 표시
    const changeColor =
      report.summary.scoreChange >= 0 ? [46, 125, 50] : [198, 40, 40];
    const changeSign = report.summary.scoreChange >= 0 ? "+" : "";
    pg.fill(changeColor[0], changeColor[1], changeColor[2]);
    pg.textSize(18);
    pg.text(
      `(${changeSign}${report.summary.scoreChange}점)`,
      pg.width / 2,
      y + 50,
    );
    y += 95;

    // 위험 레벨
    const levelInfo = this.getLevelInfo(report.summary.riskLevel);
    pg.fill(levelInfo.color[0], levelInfo.color[1], levelInfo.color[2]);
    pg.textSize(24);
    pg.text(`위험도: ${levelInfo.label}`, pg.width / 2, y);
    y += 45;

    // 한줄평
    pg.fill(80);
    pg.textSize(16);
    const maxWidth = pg.width - padding * 2;
    this.drawWrappedTextCentered(
      pg,
      report.summary.comment,
      pg.width / 2,
      y,
      maxWidth,
      24,
    );
    y += 60;

    // 인지 오각형 그래프
    pg.fill(30);
    pg.textSize(20);
    pg.text("인지 능력 분석", pg.width / 2, y);
    y += 30;

    const radarCenterX = pg.width / 2;
    const radarCenterY = y + 120;
    const radarRadius = 100;

    this.drawRadarChart(
      pg,
      report.currentRadar,
      report.previousRadar,
      radarCenterX,
      radarCenterY,
      radarRadius,
    );
    y = radarCenterY + radarRadius + 50;

    // 변화 추이 그래프
    if (report.scoreTrend && report.scoreTrend.length > 0) {
      pg.fill(30);
      pg.textSize(20);
      pg.textAlign(CENTER, TOP);
      pg.text("점수 변화 추이", pg.width / 2, y);
      y += 35;

      this.drawGraph(
        pg,
        report.scoreTrend,
        padding,
        y,
        pg.width - padding * 2,
        140,
      );
    }
  }

  getLevelInfo(level) {
    switch (level) {
      case 0:
        return { label: "정상", color: [46, 125, 50] }; // 초록
      case 1:
        return { label: "주의", color: [245, 124, 0] }; // 주황
      case 2:
        return { label: "위험", color: [198, 40, 40] }; // 빨강
      default:
        return { label: "알 수 없음", color: [100, 100, 100] };
    }
  }

  drawRadarChart(pg, currentData, previousData, centerX, centerY, radius) {
    const labels = ["정확도", "안정성", "실행력", "억제력", "효율성"];
    const keys = [
      "accuracy",
      "stability",
      "execution",
      "inhibition",
      "efficiency",
    ];
    const angleOffset = -HALF_PI; // 12시 방향 시작
    const numPoints = 5;

    // 애니메이션 진행률 계산
    const elapsed = millis() - this.animationStartTime;
    const progress = constrain(elapsed / this.animationDuration, 0, 1);
    const easedProgress = this.easeOutCubic(progress);

    // 배경 그리드 그리기
    pg.stroke(200);
    pg.strokeWeight(1);
    pg.noFill();

    // 동심원 그리드 (5단계)
    for (let i = 1; i <= 5; i++) {
      const r = (radius / 5) * i;
      pg.beginShape();
      for (let j = 0; j < numPoints; j++) {
        const angle = angleOffset + (TWO_PI / numPoints) * j;
        const x = centerX + cos(angle) * r;
        const y = centerY + sin(angle) * r;
        pg.vertex(x, y);
      }
      pg.endShape(CLOSE);
    }

    // 축 그리기
    for (let i = 0; i < numPoints; i++) {
      const angle = angleOffset + (TWO_PI / numPoints) * i;
      const x = centerX + cos(angle) * radius;
      const y = centerY + sin(angle) * radius;
      pg.line(centerX, centerY, x, y);
    }

    // 레이블 그리기
    pg.fill(50);
    pg.noStroke();
    pg.textSize(14);
    pg.textAlign(CENTER, CENTER);
    for (let i = 0; i < numPoints; i++) {
      const angle = angleOffset + (TWO_PI / numPoints) * i;
      const labelRadius = radius + 25;
      const x = centerX + cos(angle) * labelRadius;
      const y = centerY + sin(angle) * labelRadius;
      pg.text(labels[i], x, y);
    }

    // 지난달 데이터 (스트로크만, previousData가 있을 때만)
    if (previousData) {
      pg.stroke(180);
      pg.strokeWeight(2);
      pg.noFill();
      pg.beginShape();
      for (let i = 0; i < numPoints; i++) {
        const angle = angleOffset + (TWO_PI / numPoints) * i;
        const value = previousData[keys[i]] / 100;
        const animatedValue = lerp(0, value, easedProgress);
        const r = animatedValue * radius;
        const x = centerX + cos(angle) * r;
        const y = centerY + sin(angle) * r;
        pg.vertex(x, y);
      }
      pg.endShape(CLOSE);
    }

    // 이번달 데이터 (스트로크 + 반투명 fill)
    pg.stroke(41, 98, 255); // 파란색
    pg.strokeWeight(2);
    pg.fill(41, 98, 255, 80); // 반투명 파란색
    pg.beginShape();
    for (let i = 0; i < numPoints; i++) {
      const angle = angleOffset + (TWO_PI / numPoints) * i;
      const value = currentData[keys[i]] / 100;
      const animatedValue = lerp(0, value, easedProgress);
      const r = animatedValue * radius;
      const x = centerX + cos(angle) * r;
      const y = centerY + sin(angle) * r;
      pg.vertex(x, y);
    }
    pg.endShape(CLOSE);

    // 이번달 데이터 포인트
    pg.fill(41, 98, 255);
    pg.noStroke();
    for (let i = 0; i < numPoints; i++) {
      const angle = angleOffset + (TWO_PI / numPoints) * i;
      const value = currentData[keys[i]] / 100;
      const animatedValue = lerp(0, value, easedProgress);
      const r = animatedValue * radius;
      const x = centerX + cos(angle) * r;
      const y = centerY + sin(angle) * r;
      pg.ellipse(x, y, 8, 8);
    }

    // 범례
    const legendY = centerY + radius + 10;
    pg.textSize(12);
    pg.textAlign(LEFT, CENTER);

    // 이번달 범례
    pg.fill(41, 98, 255);
    pg.rect(centerX - 80, legendY, 12, 12);
    pg.fill(50);
    pg.text("이번달", centerX - 65, legendY + 6);

    // 지난달 범례 (데이터가 있을 때만)
    if (previousData) {
      pg.stroke(180);
      pg.strokeWeight(2);
      pg.noFill();
      pg.rect(centerX + 10, legendY, 12, 12);
      pg.noStroke();
      pg.fill(50);
      pg.text("지난달", centerX + 25, legendY + 6);
    }
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
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

    // X축 레이블 (주차)
    pg.fill(100);
    pg.textAlign(CENTER, TOP);
    for (let i = 0; i < points.length; i++) {
      pg.text(`${i + 1}주`, points[i].x, y + h - 20);
    }
  }

  drawWrappedTextCentered(pg, text, centerX, y, maxWidth, lineHeight) {
    const chars = text.split("");
    let line = "";
    const lines = [];

    for (const char of chars) {
      const testLine = line + char;
      const testWidth = pg.textWidth(testLine);

      if (testWidth > maxWidth && line.length > 0) {
        lines.push(line);
        line = char;
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      lines.push(line);
    }

    for (let i = 0; i < lines.length; i++) {
      pg.text(lines[i], centerX, y + i * lineHeight);
    }
  }

  drawWrappedText(pg, text, x, y, maxWidth, lineHeight) {
    const words = text.split("");
    let line = "";
    let currentY = y;

    for (const char of words) {
      const testLine = line + char;
      const testWidth = pg.textWidth(testLine);

      if (testWidth > maxWidth && line.length > 0) {
        pg.text(line, x, currentY);
        line = char;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    if (line.length > 0) {
      pg.text(line, x, currentY);
    }
  }
}
