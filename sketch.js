// ====== p5.js 엔트리 ======
let app;
let lastT = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  app = new App();
  lastT = millis();
}

function draw() {
  const now = millis();
  const dt = (now - lastT) / 1000;
  lastT = now;

  app.update(dt);
  app.render();
}

function mousePressed() {
  app.mousePressed(mouseX, mouseY);
}

function keyPressed() {
  // ESC 키로 관리자 모드로 돌아가기 (개발용)
  if (keyCode === ESCAPE) app.dispatch({ type: ACTIONS.GO_ADMIN });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  app.resize(windowWidth, windowHeight);
}