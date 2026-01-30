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

  // 전체 화면 중앙 정렬 컨테이너 생성
  createCenteredContainer() {
    const container = createDiv("");
    container.class("centered-container");
    container.style("position", "fixed");
    container.style("top", "0");
    container.style("left", "0");
    container.style("width", "100%");
    container.style("height", "100%");
    container.style("display", "flex");
    container.style("flex-direction", "column");
    container.style("justify-content", "center");
    container.style("align-items", "center");
    container.style("pointer-events", "none");
    this.domElements.push(container);
    return container;
  }

  // 컨테이너 내부에 타이틀 생성
  createTitle(text, container) {
    const title = createP(text);
    title.class("scene-title");
    title.style("font-size", "clamp(32px, 5vw, 48px)");
    title.style("font-weight", "bold");
    title.style("color", "#1e1e1e");
    title.style("margin", "0 0 10px 0");
    title.style("text-align", "center");
    title.style("pointer-events", "auto");
    if (container) container.child(title);
    this.domElements.push(title);
    return title;
  }

  // 컨테이너 내부에 부제목 생성
  createSubtitle(text, container) {
    const subtitle = createP(text);
    subtitle.class("scene-subtitle");
    subtitle.style("font-size", "clamp(16px, 2.5vw, 22px)");
    subtitle.style("color", "#666");
    subtitle.style("margin", "0 0 40px 0");
    subtitle.style("text-align", "center");
    subtitle.style("pointer-events", "auto");
    if (container) container.child(subtitle);
    this.domElements.push(subtitle);
    return subtitle;
  }

  // 컨테이너 내부에 폼 그룹 생성
  createFormGroup(container) {
    const group = createDiv("");
    group.class("form-group");
    group.style("display", "flex");
    group.style("flex-direction", "column");
    group.style("align-items", "center");
    group.style("width", "100%");
    group.style("max-width", "440px");
    group.style("padding", "0 20px");
    group.style("box-sizing", "border-box");
    group.style("pointer-events", "auto");
    if (container) container.child(group);
    this.domElements.push(group);
    return group;
  }

  // 버튼 그룹 (가로 배치)
  createButtonGroup(container) {
    const group = createDiv("");
    group.class("button-group");
    group.style("display", "flex");
    group.style("flex-wrap", "wrap");
    group.style("justify-content", "center");
    group.style("gap", "16px");
    group.style("margin-top", "30px");
    group.style("pointer-events", "auto");
    if (container) container.child(group);
    this.domElements.push(group);
    return group;
  }

  // 컨테이너에 추가할 수 있는 버튼 생성
  createButtonElement(label, onClick, parent) {
    const btn = createButton(label);
    btn.mousePressed(onClick);
    btn.class("scene-button");
    btn.style("font-size", "clamp(16px, 2vw, 20px)");
    btn.style("padding", "16px 32px");
    btn.style("min-width", "160px");
    btn.style("border", "none");
    btn.style("border-radius", "8px");
    btn.style("cursor", "pointer");
    btn.style("transition", "background-color 0.2s");
    if (parent) parent.child(btn);
    this.domElements.push(btn);
    return btn;
  }

  // 컨테이너에 추가할 수 있는 입력창 생성
  createInputElement(placeholder, parent) {
    const inp = createInput("");
    inp.attribute("placeholder", placeholder);
    inp.class("scene-input");
    inp.style("width", "100%");
    inp.style("font-size", "clamp(16px, 2vw, 20px)");
    inp.style("padding", "16px 20px");
    inp.style("border", "1px solid #ccc");
    inp.style("border-radius", "8px");
    inp.style("box-sizing", "border-box");
    inp.style("margin-bottom", "20px");
    if (parent) parent.child(inp);
    this.domElements.push(inp);
    return inp;
  }

  // 컨테이너에 추가할 수 있는 레이블 생성
  createLabelElement(text, parent) {
    const lbl = createP(text);
    lbl.class("scene-label");
    lbl.style("font-size", "clamp(14px, 1.8vw, 18px)");
    lbl.style("color", "#333");
    lbl.style("margin", "0 0 8px 0");
    lbl.style("align-self", "flex-start");
    if (parent) parent.child(lbl);
    this.domElements.push(lbl);
    return lbl;
  }

  // 컨테이너에 추가할 수 있는 슬라이더 생성
  createSliderElement(min, max, value, parent) {
    const slider = createSlider(min, max, value);
    slider.class("scene-slider");
    slider.style("width", "100%");
    slider.style("height", "12px");
    slider.style("margin-bottom", "20px");
    if (parent) parent.child(slider);
    this.domElements.push(slider);
    return slider;
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
