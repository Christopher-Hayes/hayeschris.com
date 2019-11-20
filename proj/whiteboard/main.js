/*jslint devel: true*/
'use strict';
var canvas, ctx;
var mouseDown = false;
var prevX = -1, prevY = -1;
var cR = 0, cG = 0, cB = 0;
var tool = 0; // { pen, eraser }

function onload() {
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
// Bresenham line
function bline(x0, y0, x1, y1) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
    var err = (dx>dy ? dx : -dy)/2;        
    while (true) {
        if (tool == 0) {
            // pen
            ctx.fillStyle = "rgb(" + cR + "," + cG + "," + cB + ")";
            ctx.fillRect(x0, y0, 2, 2);
        }else if (tool == 1) {
            // eraser
            ctx.fillStyle = "white";
            ctx.fillRect(x0 - 20, y0 - 20, 40, 40);
        }else if (tool == 2) {
            // pen
            ctx.fillStyle = "rgb(" + cR + "," + cG + "," + cB + ")";
            ctx.fillRect(x0 - 2, y0 - 2, 5, 5);
        }
    
    if (x0 === x1 && y0 === y1) break;
    var e2 = err;
    if (e2 > -dx) { err -= dy; x0 += sx; }
    if (e2 < dy) { err += dx; y0 += sy; }
  }
}
// draw
function draw(x, y) {
    //ctx.strokeStyle = "rgb(0, 0, 0)";
    bline(prevX, prevY, x, y);
}
// on mouse down (canvas)
function onMD(e) {
    mouseDown = true;
    prevX = e.offsetX;
    prevY = e.offsetY;
    draw(prevX + 1, prevY + 1);
}
// on mouse up (canvas)
function onMU(e) {
    mouseDown = false;
}
// on mouse move (canvas)
function onMM(e) {
    var x = e.offsetX, y = e.offsetY;
    if (mouseDown) {
        draw(x, y);
    }
    prevX = x;
    prevY = y;
}
// on mouse out (canvas)
function onMO(e) {
    mouseDown = false;
}
function setTool( k ) {
    if( k != 4 && k!= 3 ) {
        var tools = document.getElementById( "toolPreset" ).getElementsByTagName( "li" );
        var bkrnd = window.getComputedStyle( tools[ k ] ,null ).getPropertyValue('background-image');
        document.getElementById( "toolCurrent" ).style.backgroundImage = bkrnd;
    }
    switch( k ) {
        case 0: 
            tool = 2;
            break;
        case 1: 
            tool = 0;
            break;
        case 2:
            tool = 1;
            break;
        case 3:
            alert( "The text tool is not quite ready for primetime yet." );
            break;
        case 4:
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
}
function setColorPreset( k ) {
    var colors = document.getElementById( "colorPreset" ).getElementsByTagName( "li" );
    var clr = window.getComputedStyle( colors[ k ] ,null).getPropertyValue('background-color');
    document.getElementById( "colorCurrent" ).style.background = clr;
    var c1 = clr.indexOf( "," );
    var c2 = clr.indexOf( ",", c1 + 1 );
    cR = clr.substr( 4, c1 - 4 );
    cG = clr.substr( c1 + 2, c2 - (c1 + 2) );
    cB = clr.substr( c2 + 2, clr.length - 1 - (c2 + 2) );
}
/*
function saveCanvas(canvas, path, type, options) {
    return Task.spawn(function *() {
        var reader = new FileReader;
        var blob = yield new Promise(accept => canvas.toBlob(accept, type, options));
        reader.readAsArrayBuffer(blob);

        yield new Promise(accept => { reader.onloadend = accept });

        return yield OS.File.writeAtomic(path, new Uint8Array(reader.result),
                                         { tmpPath: path + '.tmp' });
    });
}
*/