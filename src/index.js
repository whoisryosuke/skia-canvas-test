const { Window } = require("skia-canvas");

let win = new Window(300, 300);
win.title = "Canvas Window";
win.on("draw", (e) => {
  let ctx = e.target.canvas.getContext("2d");
  ctx.lineWidth = 25 + 25 * Math.cos(e.frame / 10);
  ctx.beginPath();
  ctx.arc(150, 150, 50, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(150, 150, 10, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
});
