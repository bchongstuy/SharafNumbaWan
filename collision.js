var img = document.getElementById("img");
var bar = document.getElementById("bar");

var setup = document.getElementById("setup");
var display = document.getElementById("display");

var start = document.getElementById("start");
var stop = document.getElementById("stop");

var vxr = document.getElementById("vxr");
var vyr = document.getElementById("vyr");
var vxb = document.getElementById("vxb");
var vyb = document.getElementById("vyb");

var rm = document.getElementById("rm");
var bm = document.getElementById("bm");

var c1 = document.getElementById("r");
var c2 = document.getElementById("b");

var id = 0;

display.remove();

var r = 40;

c1.setAttribute("cx", r + Math.random() * (img.getAttribute("width") - 2 * r));
c1.setAttribute("cy", r + Math.random() * (img.getAttribute("height") - 2 * r));
c1.setAttribute("r", r);
c1.vx = 1;
c1.vy = 1;
c1.dragged = false;

var touching = function(){
  return Math.pow(c1.getAttribute("cx") - c2.getAttribute("cx"), 2) +
         Math.pow(c1.getAttribute("cy") - c2.getAttribute("cy"), 2) <=
         Math.pow(2 * r, 2);
}

c2.setAttribute("cx", c1.getAttribute("cx"));
c2.setAttribute("cy", c1.getAttribute("cy"));
c2.setAttribute("r", r);
while (touching()){
  // console.log(".");
  c2.setAttribute("cx", r + Math.random() * (img.getAttribute("width") - 2 * r));
  c2.setAttribute("cy", r + Math.random() * (img.getAttribute("height") - 2 * r));
}
c2.vx = 0;
c2.vy = 0;
c2.dragged = false;


var arrow = document.getElementsByTagName("polygon")[0];
arrow.dragged = false;

var line = document.getElementsByTagName("line")[0];
line.setAttribute("x1", c1.getAttribute("cx"));
line.setAttribute("y1", c1.getAttribute("cy"));
var angle = Math.random() * 2 * Math.PI;
line.setAttribute("x2", parseFloat(line.getAttribute("x1")) + Math.cos(angle) * 60);
line.setAttribute("y2", parseFloat(line.getAttribute("y1")) + Math.sin(angle) * 60);

var toString = function(points){
  var str = "";
  for (var i = 0; i < 3; i ++)
    str += points[i][0] + "," + points[i][1] + " ";
  return str;
}

var updateLine = function(){
  line.setAttribute("x1", c1.getAttribute("cx"));
  line.setAttribute("y1", c1.getAttribute("cy"));
  var x1 = parseFloat(line.getAttribute("x1"));
  var y1 = parseFloat(line.getAttribute("y1"));
  var x2 = parseFloat(line.getAttribute("x2"));
  var y2 = parseFloat(line.getAttribute("y2"));

  var lx = x2 - x1;
  var ly = y2 - y1;

  var length = Math.sqrt(Math.pow(lx, 2) + Math.pow(ly, 2));
  lx /= length;
  ly /= length;
  lx *= 50;
  ly *= 50;
  var points = [];
  points.push([x2 + lx, y2 + ly]);
  lx /= 4;
  ly /= 4;
  points.push([x2 - ly, y2 + lx]);
  points.push([x2 + ly, y2 - lx]);
  arrow.setAttribute("points", toString(points));
}

updateLine();


var dx, dy, dr;

var startDrag = function(e){
  this.dragged = true;
  dx = e.offsetX - this.getAttribute("cx");
  dy = e.offsetY - this.getAttribute("cy");
}

var startArrowDrag = function(e){
  this.dragged = true;
  dr = Math.sqrt( Math.pow(e.offsetX - line.getAttribute("x2"), 2) +
                  Math.pow(e.offsetY - line.getAttribute("y2"), 2));
}

var drag = function(e){
  if (c1.dragged){
    c1.setAttribute("cx", e.offsetX - dx);
    c1.setAttribute("cy", e.offsetY - dy);
    updateLine();
  }

  if (c2.dragged){
    c2.setAttribute("cx", e.offsetX - dx);
    c2.setAttribute("cy", e.offsetY - dy);
  }

  if (arrow.dragged){
    var x1 = parseFloat(line.getAttribute("x1"));
    var y1 = parseFloat(line.getAttribute("y1"));
    var lx = e.offsetX - x1;
    var ly = e.offsetY - y1;
    angle = Math.atan(ly / lx);
    if (lx < 0)
      angle += Math.PI;
    lx -= dr * Math.cos(angle);
    ly -= dr * Math.sin(angle);
    line.setAttribute("x2", x1 + lx);
    line.setAttribute("y2", y1 + ly);
    updateLine();
  }
}

var endDrag = function(){
  this.dragged = false;
}

c1.addEventListener('mousedown', startDrag);
c1.addEventListener('mouseup', endDrag);

c2.addEventListener('mousedown', startDrag);
c2.addEventListener('mouseup', endDrag);

arrow.addEventListener('mousedown', startArrowDrag);
arrow.addEventListener('mouseup', endDrag);

img.addEventListener('mousemove', drag);

start.addEventListener('click', function(){
  window.cancelAnimationFrame(id);

  setup.remove();
  line.remove();
  arrow.remove();
  bar.appendChild(display);

  c1.m = rm.getAttribute("value");
  c2.m = bm.getAttribute("value");

  c1.vx = (parseFloat(line.getAttribute("x2")) - parseFloat(line.getAttribute("x1"))) / 50;
  c1.vy = (parseFloat(line.getAttribute("y1")) - parseFloat(line.getAttribute("y2"))) / 50;

  update();
});

stop.addEventListener('click', function(){
  window.cancelAnimationFrame(id);
  display.remove();
  bar.appendChild(setup);
  img.appendChild(arrow);
  img.appendChild(line);
  updateLine();
});

var update = function(){
  id = window.requestAnimationFrame(update);
  // console.log(".");
  c1.setAttribute("cx", parseFloat(c1.getAttribute("cx")) + c1.vx);
  c1.setAttribute("cy", parseFloat(c1.getAttribute("cy")) - c1.vy);
  vxr.innerHTML = c1.vx;
  vyr.innerHTML = c1.vy;

  c2.setAttribute("cx", parseFloat(c2.getAttribute("cx")) + c2.vx);
  c2.setAttribute("cy", parseFloat(c2.getAttribute("cy")) - c2.vy);
  vxb.innerHTML = c2.vx;
  vyb.innerHTML = c2.vy;
}
