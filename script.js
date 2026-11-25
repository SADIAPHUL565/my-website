let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;

  mouseTouchX = 0;
  mouseTouchY = 0;

  mouseX = 0;
  mouseY = 0;

  prevMouseX = 0;
  prevMouseY = 0;

  velX = 0;
  velY = 0;

  rotation = Math.random() * 30 - 15;

  currentPaperX = 0;
  currentPaperY = 0;

  init(paper) {

    /* 🖱️ MOUSE MOVE */
    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      this.handleMove(e.clientX, e.clientY, paper);

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    });

    /* 📱 TOUCH MOVE */
    document.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;

      let touch = e.touches[0];

      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      this.handleMove(touch.clientX, touch.clientY, paper);

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    });

    /* 🖱️ MOUSE DOWN */
    paper.addEventListener('mousedown', (e) => {
      this.startDrag(e.clientX, e.clientY, e.button, paper);
    });

    /* 📱 TOUCH START */
    paper.addEventListener('touchstart', (e) => {
      let touch = e.touches[0];
      this.startDrag(touch.clientX, touch.clientY, 0, paper);
    });

    /* 🛑 STOP DRAG */
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }

  /* 🔥 DRAG START */
  startDrag(x, y, button, paper) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;

    paper.style.zIndex = highestZ;
    highestZ++;

    this.mouseTouchX = x;
    this.mouseTouchY = y;

    this.prevMouseX = x;
    this.prevMouseY = y;

    if (button === 2) {
      this.rotating = true;
    }
  }

  /* 🔄 MOVE FUNCTION */
  handleMove(x, y, paper) {

    const dirX = x - this.mouseTouchX;
    const dirY = y - this.mouseTouchY;

    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);

    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper && !this.rotating) {
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    }

    paper.style.transform =
      `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }
}

/* 📄 INIT PAPERS */
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});