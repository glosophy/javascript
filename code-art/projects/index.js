const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// console.log(ctx);

ctx.beginPath();
ctx.rect(100, 100, 100, 100);
// ctx.fill();
ctx.stroke();
