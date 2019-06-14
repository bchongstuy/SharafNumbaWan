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

var pxr = document.getElementById("pxr");
var pyr = document.getElementById("pyr");
var pxb = document.getElementById("pxb");
var pyb = document.getElementById("pyb");

var kr = document.getElementById("kr");
var kb = document.getElementById("kb");
var kt = document.getElementById("kt");


var pxt = document.getElementById("pxt");
var pyt = document.getElementById("pyt");

var rm = document.getElementById("rm");
var bm = document.getElementById("bm");

var c1 = document.getElementById("r");
var c2 = document.getElementById("b");

var width = parseFloat(img.getAttribute("width"));
var height = parseFloat(img.getAttribute("width"));

var id = 0;

display.remove();

var r = 40;

var touching = function(){
  return Math.pow(c1.x - c2.x, 2) +
         Math.pow(c1.y - c2.y, 2) <=
         Math.pow(2 * r, 2);
}

var arrow = document.getElementsByTagName("polygon")[0];

var line = document.getElementsByTagName("line")[0];


var toString = function(points){
  var str = "";
  for (var i = 0; i < 3; i ++)
    str += points[i][0] + "," + points[i][1] + " ";
  return str;
}

var updateLine = function(){
  line.x = c1.x;
  line.y = c1.y;
  line.setAttribute("x1", line.x);
  line.setAttribute("y1", line.y);

  var lx = line.a - line.x;
  var ly = line.b - line.y;

  var length = Math.sqrt(Math.pow(lx, 2) + Math.pow(ly, 2));
  lx /= length;
  ly /= length;
  lx *= 50;
  ly *= 50;
  var points = [];
  points.push([line.a + lx, line.b + ly]);
  lx /= 4;
  ly /= 4;
  points.push([line.a - ly, line.b + lx]);
  points.push([line.a + ly, line.b - lx]);
  arrow.setAttribute("points", toString(points));
}

var set = function(){
  c1.x = r + Math.random() * (width - 2 * r);
  c1.y = r + Math.random() * (height - 2 * r);
  c1.setAttribute("cx", c1.x);
  c1.setAttribute("cy", c1.y);
  c1.setAttribute("r", r);
  c1.dragged = false;
  c1.vx = 0;
  c1.vy = 0;

  c2.x = c1.x;
  c2.y = c1.y;
  c2.setAttribute("r", r);
  while (touching()){
    c2.x = r + Math.random() * (width - 2 * r);
    c2.y = r + Math.random() * (height - 2 * r);
  }
  c2.setAttribute("cx", c2.x);
  c2.setAttribute("cy", c2.y);
  c2.dragged = false;
  c2.vx = 0;
  c2.vy = 0;

  arrow.dragged = false;

  line.x = c1.x;
  line.y = c1.y;
  line.setAttribute("x1", line.x);
  line.setAttribute("y1", line.y);
  resetLine();
  while (line.a <= 0 || line.a >= width ||
      line.b <= 0 || line.b >= height)
      resetLine();
  line.setAttribute("x2", line.a);
  line.setAttribute("y2", line.b);
  updateLine();
}

var resetLine = function(){
  var angle = Math.random() * 2 * Math.PI;
  line.a = parseFloat(line.x) + Math.cos(angle) * 60;
  line.b = parseFloat(line.y) + Math.sin(angle) * 60;
}

set();

var dx, dy, dr;

var startDrag = function(e){
  this.dragged = true;
  dx = e.offsetX - this.x;
  dy = e.offsetY - this.y;
}

var startArrowDrag = function(e){
  this.dragged = true;
  dr = Math.sqrt( Math.pow(e.offsetX - line.a, 2) +
                  Math.pow(e.offsetY - line.b, 2));
}

var drag = function(e){

  if (c1.dragged){
    c1.x = e.offsetX - dx;
    c1.y = e.offsetY - dy;
    if (touching()){
      var offX = e.offsetX - c2.x;
      var offY = e.offsetY - c2.y;
      var length = Math.sqrt( Math.pow(offX, 2) + Math.pow(offY, 2));
      c1.x = c2.x + offX / length * 2 * r;
      c1.y = c2.y + offY / length * 2 * r;
    }
    c1.setAttribute("cx", c1.x);
    c1.setAttribute("cy", c1.y);
    updateLine();
  }

  if (c2.dragged){
    c2.x = e.offsetX - dx;
    c2.y = e.offsetY - dy;
    if (touching()){
      var offX = e.offsetX - c1.x;
      var offY = e.offsetY - c1.y;
      var length = Math.sqrt( Math.pow(offX, 2) + Math.pow(offY, 2));
      c2.x = c1.x + offX / length * 2 * r;
      c2.y = c1.y + offY / length * 2 * r;
    }
    c2.setAttribute("cx", c2.x);
    c2.setAttribute("cy", c2.y);
  }

  if (arrow.dragged){
    var lx = e.offsetX - c1.x;
    var ly = e.offsetY - c1.y;
    angle = Math.atan(ly / lx);
    if (lx < 0)
      angle += Math.PI;
    lx -= dr * Math.cos(angle);
    ly -= dr * Math.sin(angle);
    line.a = c1.x + lx;
    line.b = c1.y + ly;
    line.setAttribute("x2", line.a);
    line.setAttribute("y2", line.b);
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

  c1.m = parseFloat(rm.value);
  c2.m = parseFloat(bm.value);

  c1.vx = (line.a - line.x) / 50;
  c1.vy = (line.b - line.y) / 50;

  update();
});

var end = function(){
  window.cancelAnimationFrame(id);
  touched = false;
  display.remove();
  bar.appendChild(setup);
  img.appendChild(arrow);
  img.appendChild(line);
  set();
}

stop.addEventListener('click', end);

var touched = false;

var update = function(){
  id = window.requestAnimationFrame(update);
  // console.log(".");
  c1.x += c1.vx;
  c1.y += c1.vy;
  c2.x += c2.vx;
  c2.y += c2.vy;

  vxr.innerHTML = c1.vx.toFixed(2);
  vyr.innerHTML = -c1.vy.toFixed(2);
  vxb.innerHTML = c2.vx.toFixed(2);
  vyb.innerHTML = -c2.vy.toFixed(2);

  pxr.innerHTML = (c1.vx * c1.m).toFixed(2);
  pyr.innerHTML = (-c1.vy * c1.m).toFixed(2);
  pxb.innerHTML = (c2.vx * c2.m).toFixed(2);
  pyb.innerHTML = (-c2.vy * c2.m).toFixed(2);

  pxt.innerHTML = (c1.vx * c1.m + c2.vx * c2.m).toFixed(2);
  pyt.innerHTML = (-c1.vy * c1.m - c2.vy * c2.m).toFixed(2);

  kr.innerHTML = (0.5 * c1.m * (Math.pow(c1.vx, 2) + Math.pow(c1.vy, 2))).toFixed(2);
  kb.innerHTML = (0.5 * c2.m * (Math.pow(c2.vx, 2) + Math.pow(c2.vy, 2))).toFixed(2);
  kt.innerHTML = (0.5 * c1.m * (Math.pow(c1.vx, 2) + Math.pow(c1.vy, 2)) +
                  0.5 * c2.m * (Math.pow(c2.vx, 2) + Math.pow(c2.vy, 2))).toFixed(2);

  if (touching() && !touched){
    touched = true;
    var dir = Math.atan( (c2.y - c1.y) / (c2.x - c1.x) );
    if (c2.x < c1.x)
      dir += Math.PI;
    var dirV = Math.atan(c1.vy / c1.vx);
    if (c1.vx < 0)
      dirV += Math.PI;
    var phi = dirV - dir;
    var sumM = c1.m + c2.m;
    var v = Math.sqrt( Math.pow(c1.vx, 2) + Math.pow(c1.vy, 2));
    var v2 = 2 * c1.m * v * Math.cos(phi) / sumM;
    console.log(sumM);
    c2.vx = v2 * Math.cos(dir);
    c2.vy = v2 * Math.sin(dir);

    /* var expr = Math.sqrt( Math.pow(sumM, 2) -
               4 * c1.m * c2.m * Math.pow(Math.cos(phi), 2) );
    var v1 = v / sumM * expr;
    var theta = Math.asin(c2.m * Math.sin(2 * phi) / expr);
    var cosTheta = (c1.m * v - c2.m * v2 * Math.cos(phi)) / c1.m / v1;

    if (cosTheta < 0)
      theta = Math.PI - theta;

    dirV += theta;
    c1.vx = v1 * Math.cos(dirV);
    c1.vy = v1 * Math.sin(dirV); */
	c1.vx -= c2.vx * c2.m / c1.m;
	c1.vy -= c2.vy * c2.m / c1.m;
  }

  // if ((c1.x < -r || c1.x > width + r || c1.y < -r || c1.y > height + r) &&
  //     (c2.x < -r || c2.x > width + r || c2.y < -r || c2.y > height + r))
  //     end();

  c1.setAttribute("cx", c1.x);
  c1.setAttribute("cy", c1.y);
  c2.setAttribute("cx", c2.x);
  c2.setAttribute("cy", c2.y);
}
