// admin, user, seniorLogin, familyLogin, inGame, resultGame, reportList, reportDetail
let mode = "admin";

// l ~ totalStage
let gameStage = 1;
let totalStage = 1;

let answers = [];
let inputs = [];
// ex.
// answers =  [{x:100,y:200},{x:300,y:400}];
// inputs =  [{x:110,y:205},{x:800,y:100}];

let imgList = [];
// imgList = [ {imgOrg: 이미지, imgComp: 이미지}, {imgOrg: 이미지, imgComp: 이미지}, ...]
// data = [{milisec: 걸린시간(millis), absError:number[], relError: number[], wrongCount }]
function preload() {
  for (let i = 0; i < totalStage - 1; i++) {
    let imgOrg = loadImage("./fig/fig" + i + "_org.jpg");
    let imgComp = loadImage("./fig/fig" + i + "_comp.jpg");
    imgList.push({ imgOrg, imgComp });
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  admin = createGraphics(windowWidth, windowHeight);
  user = createGraphics(windowWidth, windowHeight);
  startGame = createGraphics(windowWidth, windowHeight);
  inGame = createGraphics(windowWidth, windowHeight);
  resultGame = createGraphics(windowWidth, windowHeight);
  reportList = createGraphics(windowWidth, windowHeight);
  reportDetail = createGraphics(windowWidth, windowHeight);
}

function draw() {
  background(220);
}

function switchMode(target) {
  mode = target;
}

function nextStage() {
  if (mode === "startGame") {
    // before game
    switchMode("inGame");
    gameStage = 1;
  } else if (mode === "inGame") {
    if (gameStage !== totalStage) {
      // in game, not last stage
      gameStage++;
    } else {
      // last stage
      loadGameResult();
      switchMode("resultGame");
    }
  } else if (mode === "resultGame") {
    // result, back to start
    switchMode("startGame");
    gameStage = 1;
  }
}

function AppendGameData(
  gameStage,
  clickOrder,
  startMillis,
  imgX,
  imgY,
  imgWidth,
  imgHeight,
) {
  gameData.push({
    clickOrder,
    millisec: millis() - startMillis,
    x: (mouseX - imgX) / imgWidth, // image 크기에 따른 상대 좌표 (0~1)
    y: (mouseY - imgY) / imgHeight, // image 크기에 따른 상대 좌표 (0~1)
  });
}
