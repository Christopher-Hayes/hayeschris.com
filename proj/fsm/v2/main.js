/*jslint node: true */
'use strict';
// PIXI aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    Graphics = PIXI.Graphics,
    Text = PIXI.Text,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;
// globals
var mStates = [];   // State objects
var mHover = null;
var mDrag = null;
var mFocus = null;
var mLastClick = 0;
var mMapDrag = false;
var mMapX = 0;
var mMapY = 0;
// stage, renderer
var stage = new Container(),
    renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: true, transparent: true});
document.body.appendChild(renderer.view);
stage.hitArea = new PIXI.Rectangle(-5000, -5000, 10000, 10000);
stage.interactive = true;
stage.on("mousedown", onMD);
stage.on("mouseup", onMU);
stage.on("mouseupoutside", onMU);
stage.on("click", onMC);
window.addEventListener("mousemove", onMM);
renderer.render(stage);

// MOUSE DOWN
function onMD(e) {
    if (e.target === stage) {
        mMapX = e.data.global.clientX;
        mMapY = e.data.global.clientY;
        mMapDrag = true;
    }
}
// MOUSE UP
function onMU(e) {
    //stage.scale *= 1.01;
    mMapDrag = false;
}
// MOUSE CLICK
function onMC(e) {
    if (e.target === stage) {
        mFocus = null;
        document.getElementById("topBar").style.top = "-50px";
        var now = (new Date()).getTime();
        // double click
        if (now - mLastClick < 200) {
            if (mHover === null) {
                var test = new State(e.data.getLocalPosition(stage).x, e.data.getLocalPosition(stage).y);
                stage.addChild(test);
                test.paint();
            }
            now -= 200;
        }
        mLastClick = now;
    }
}
// MOUSE MOVE
function onMM(e) {
    // State drag
    if (mMapDrag) {
        if (mMapX === undefined) {
            mMapX = e.clientX;
        }
        if (mMapY === undefined) {
            mMapY = e.clientY;
        }
        stage.x += e.clientX - mMapX;
        stage.y += e.clientY - mMapY;
        mMapX = e.clientX;
        mMapY = e.clientY;
    }
}
// text update from DOM overlay
function textUpdate() {
    if (mFocus !== null) {
        mFocus.t.text = document.getElementById("mainText").value;
        mFocus.st.text = document.getElementById("subText").value;
        mFocus.paint();
    }
}