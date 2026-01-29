class BaseScene {
  constructor() {
    this.pg = createGraphics(windowWidth, windowHeight);
    this.domElements = []; // DOM 요소들을 추적
  }

  resize(w, h) {
    this.pg = createGraphics(w, h);
  }

  enter(app, payload) {
    // 서브클래스에서 오버라이드
  }

  exit(app) {
    // Scene 전환 시 모든 DOM 요소 제거
    this.clearDomElements();
  }

  update(app, dt) {
    // 서브클래스에서 오버라이드
  }

  render(app) {
    // 서브클래스에서 오버라이드
  }

  onMousePressed(app, mx, my) {
    // 서브클래스에서 오버라이드
  }

  // ===== DOM 요소 헬퍼 메서드 =====

  // 버튼 생성
  createButton(label, x, y, onClick) {
    const btn = createButton(label);
    btn.position(x, y);
    btn.mousePressed(onClick);
    btn.class("scene-button");
    this.domElements.push(btn);
    return btn;
  }

  // 텍스트 입력 생성
  createInput(placeholder, x, y) {
    const inp = createInput("");
    inp.attribute("placeholder", placeholder);
    inp.position(x, y);
    inp.class("scene-input");
    this.domElements.push(inp);
    return inp;
  }

  // 슬라이더 생성
  createSlider(min, max, value, x, y) {
    const slider = createSlider(min, max, value);
    slider.position(x, y);
    slider.class("scene-slider");
    this.domElements.push(slider);
    return slider;
  }

  // 레이블/텍스트 생성
  createLabel(text, x, y) {
    const lbl = createP(text);
    lbl.position(x, y);
    lbl.class("scene-label");
    lbl.style("font-size", "18px");
    lbl.style("color", "#ddd");
    this.domElements.push(lbl);
    return lbl;
  }

  // Div 컨테이너 생성
  createContainer(x, y) {
    const div = createDiv("");
    div.position(x, y);
    div.class("scene-container");
    this.domElements.push(div);
    return div;
  }

  // 모든 DOM 요소 제거
  clearDomElements() {
    for (const el of this.domElements) {
      el.remove();
    }
    this.domElements = [];
  }

  // DOM 요소 숨기기/보이기
  hideAllDom() {
    for (const el of this.domElements) {
      el.hide();
    }
  }

  showAllDom() {
    for (const el of this.domElements) {
      el.show();
    }
  }

  // ===== 유틸리티 메서드 =====

  // 정답/클릭 마커 그리기
  drawMarker(pg, x, y, radius = CONFIG.MARKER_RADIUS, color = [255, 0, 0]) {
    pg.push();
    pg.noFill();
    pg.stroke(color[0], color[1], color[2]);
    pg.strokeWeight(3);
    pg.ellipse(x, y, radius * 2, radius * 2);
    pg.pop();
  }

  // 이미지를 영역에 맞게 그리기 (비율 유지)
  drawImageFit(pg, img, x, y, w, h) {
    if (!img || img.width === 0) return;

    const imgRatio = img.width / img.height;
    const areaRatio = w / h;

    let drawW, drawH, drawX, drawY;

    if (imgRatio > areaRatio) {
      // 이미지가 더 넓음 -> 너비에 맞춤
      drawW = w;
      drawH = w / imgRatio;
      drawX = x;
      drawY = y + (h - drawH) / 2;
    } else {
      // 이미지가 더 높음 -> 높이에 맞춤
      drawH = h;
      drawW = h * imgRatio;
      drawX = x + (w - drawW) / 2;
      drawY = y;
    }

    pg.image(img, drawX, drawY, drawW, drawH);

    // 실제 그려진 영역 반환 (클릭 좌표 계산용)
    return { x: drawX, y: drawY, w: drawW, h: drawH };
  }

  // 클릭 좌표를 정규화된 좌표(0~1)로 변환
  normalizeCoord(clickX, clickY, imgBounds) {
    const relX = (clickX - imgBounds.x) / imgBounds.w;
    const relY = (clickY - imgBounds.y) / imgBounds.h;
    return { x: relX, y: relY };
  }

  // 정규화된 좌표를 실제 픽셀 좌표로 변환
  denormalizeCoord(normX, normY, imgBounds) {
    const pixelX = imgBounds.x + normX * imgBounds.w;
    const pixelY = imgBounds.y + normY * imgBounds.h;
    return { x: pixelX, y: pixelY };
  }
}
