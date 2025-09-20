let state = 'mouse'

let wave1;
let wave2;

let colorR;
let colorL;

let x = 200;
let y = 200;

let intervals = [
  {
    title: "P1",
    num: 1,
    den: 1,
  },
  {
    title: "m2",
    num: 16,
    den: 15,
  },  
  {
    title: "M2",
    num: 9,
    den: 8,
  },
  {
    title: "m3",
    num: 6,
    den: 5,
  },
    {
    title: "M3",
    num: 5,
    den: 4,
  },
    {
    title: "P4",
    num: 4,
    den: 3,
  },
  {
    title: "TT",
    num: 45,
    den: 32,
  },
  {
    title: "P5",
    num: 3,
    den: 2,
  },
  {
    title: "m6",
    num: 8,
    den: 5,
  },
  {
    title: "M6",
    num: 5,
    den: 3,
  },
  {
    title: "m7",
    num: 16,
    den: 9,
  },
  {
    title: "M7",
    num: 15,
    den: 8,
  },
  {
    title: "P8",
    num: 2,
    den: 1,
  },
]

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  colorMode(RGB);
  
  wave1 = new p5.Oscillator();
  wave1.setType('sine');
  wave1.amp(1);
  wave1.freq(300);
  wave1.start();
  wave1.pan(1);
  
  wave2 = new p5.Oscillator();
  wave2.setType('sine');
  wave2.amp(1);
  wave2.freq(300);
  wave2.start();
  wave2.pan(-1);
  
  let mouseBtn = createButton('MOUSE');
  mouseBtn.mousePressed(() => {
    state = 'mouse'; 
    console.log('state', state);
  })
  
  let intervalButtons = []
  
  for(let i = 0; i < intervals.length; i++) {
    intervalButtons[i] = createButton(intervals[i].title);
    intervalButtons[i].mousePressed(() => {
      state = 'interval';
      let ratio = intervals[i].num / intervals[i].den;
      let maxLowerFreq = Math.floor(400 / ratio);
      let minLowerFreq = Math.ceil(200 / intervals[i].den) * intervals[i].den;
      x = Math.floor(random(minLowerFreq, maxLowerFreq) / intervals[i].den) * intervals[i].den;
      // x = 200;
      y = x * ratio;
    })
  }
}

function draw() {
  // Style
  background(0);
  stroke('fuchsia');
  strokeWeight(1);
  noFill();
  
  wave1.freq(x);
  wave2.freq(y);
  
  colorR = getColor(x,199,401);
  colorL = getColor(y,199,401);
  
  // Text
  addText(x,y);
  
  if(state == 'mouse') {
    x = Math.min(400, Math.max(200, (Math.round(mouseX / 3 + 200))));
    y = Math.min(400, Math.max(200, (Math.round(mouseY / 3 + 200))));    
  }
  
  // Define Radius
  let radius = 150;
  
  // Looping
  // Shape
  
  let prevX;
  let prevY;
  
  for(let angle = 0; angle <= 360; angle += 1) { 
    let pointX = radius * cos(angle*x) + width/2;
    let pointY = radius * sin(angle*y) + height/2;
    
    if(prevX && prevY) {
      stroke(lerpColor(colorR,colorL,angle/360));
      line(pointX, pointY, prevX, prevY)
    }
    
    prevX = pointX;
    prevY = pointY;
  }
}

function simplify(num1, num2) {
  for (let i = Math.max(num1, num2); i > 1; i--) { 
    if ((num1 % i == 0) && (num2 % i == 0)) { 
      num1 /= i; 
      num2 /= i; 
    } 
  } 
  return [num1, num2]
}

function getColor(value, minValue, maxValue) {
  let range = maxValue - minValue;
  let sectionSize = range / 6;
  let section = Math.floor((value - minValue) / sectionSize);
  let preSection = minValue + section * sectionSize;
  
  let offset = (value - preSection) / sectionSize * 255;
  
  let r = 0;
  let g = 0;
  let b = 0;
  
  switch(section) {
    case 0:
      r = 255;
      g = offset;
      b = 0;
      break;
    case 1:
      r = 255 - offset;
      g = 255;
      b = 0;
      break;
    case 2:
      r = 0;
      g = 255;
      b = offset;
      break;
    case 3:
      r = 0;
      g = 255 - offset;
      b = 255;
      break;
    case 4:
      r = offset;
      g = 0;
      b = 255;
      break;
    case 5:
      r = 255;
      g = 0;
      b = 255 - offset;
      break; 
  } 
  
  return color(r,g,b, 255)
}

function addText(r,l) {
  noStroke();
  fill('white');
  textAlign('center');
  textSize(20);
  text(":", width/2, 50)
  
  fill(colorR);
  textAlign('left');
  text(r  + 'Hz', width/2 + 10, 50);
  
  fill(colorL);
  textAlign('right');
  text(l + 'Hz', width/2 - 10, 50);
  
  [simpleR, simpleL] = simplify(r,l)
  
  fill('white');
  textAlign('center');
  textSize(40);
  text(":", width/2, 100)
  
  fill(colorR);
  textAlign('left');
  text(simpleR, width/2 + 10, 100);
  
  fill(colorL);
  textAlign('right');
  text(simpleL, width/2 - 10, 100);

}
