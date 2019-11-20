var work = false;
var start = 0;
var mode = document.getElementById("mode");
var timer = document.getElementById("timer");
loop();
function loop() {
  var left = start - Date.now();
  if (left < 0) {
    work = !work;
    if (work) {
      document.body.style.backgroundColor = "#3F51B5";
      timer.style.color = mode.style.color = "white";
      mode.innerHTML = "WORK";
      start = Date.now() + 52 * 60000;
    }else {
      document.body.style.backgroundColor = "white";
      timer.style.color = mode.style.color = "#3F51B5";
      mode.innerHTML = "BREAK";
      start = Date.now() + 17 * 60000;
    }
    left = start - Date.now();
  }
  var sec = parseInt(left / 1000 % 60);
  var min = parseInt(left / 60000);
  timer.innerHTML = pad_zeroes(min) + ":" + pad_zeroes(sec);
  setTimeout(loop, 1000);
}
function pad_zeroes(n) {
	s = n.toString()
	return (s.length < 2 ? "0" : "") + s;
}
