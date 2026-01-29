class CanvasButton {
  constructor(x, y, w, h, label, onClickAction) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.label = label;
    this.onClickAction = onClickAction; // {type: "...", ...}
  }
  draw(pg) {
    pg.push();
    pg.rectMode(CORNER);
    pg.stroke(255);
    pg.noFill();
    pg.rect(this.x, this.y, this.w, this.h, 10);
    pg.noStroke();
    pg.fill(255);
    pg.textAlign(CENTER, CENTER);
    pg.textSize(18);
    pg.text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    pg.pop();
  }
  hit(mx, my) {
    return mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h;
  }
}