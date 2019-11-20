// FSM Builder
// Chris Hayes
// Libraries: ivank.js 2D graphics library

// main.js

// globals
var mStateCount, mArrCount, mTexCount, mArr, mDrag, mArrDrag, mHover, mArrHover, mLastClick, mMoveX, mMoveY, mTexFocus; // integers
var mStates;		// array of State objects
var mArrows;		// array of Arrow objects
var mTex;			// array of Tex objects
var mStage;			// ivank Stage object
var mShift, mMouseDown;	// boolean
var mBG;
//var BGS =	["http://i1298.photobucket.com/albums/ag54/resource0/bg_grid_1_zpsf5d35sts.png", "http://i1298.photobucket.com/albums/ag54/resource0/bg_grid_2_zpsiuxxnsyz.png", "http://i1298.photobucket.com/albums/ag54/resource0/bg_grid_3_zpssci4gqmw.png"];
var BGS2 =	["", "http://i1298.photobucket.com/albums/ag54/resource0/bg_grid2_1_zps3jzexsou.png", "http://i1298.photobucket.com/albums/ag54/resource0/bg_grid2_2_zpsjbn4ilau.png", "http://i1298.photobucket.com/albums/ag54/resource0/bg_grid2_3_zps82raki5u.png"];

var test;

// ivank init
function start() {
	mStage = new Stage("source");
	mStateCount = mArrCount = mTexCount = mLastClick = mBG = 0;
	mDrag = mArrDrag = mHover = mArrHover = mMoveX = mMoveY = mTexFocus = -1;
	mArr = null;
	mStates = [];
	mArrows = [];
	mTex = [];
	mShift = mMouseDown = false;
	
	// instructions
	var d = new TextField();
	d.selectable = false;
	d.wordWrap = true;
	d.setTextFormat(new TextFormat("Arial", 20, 0xAAAAAA));
	d.text = "Double Click to create new state.\nDrag state to move.\nPress Delete while hovering state or connection to delete.\nShift + Drag from state to create connection.\nDouble Click state to set accept state.\nDrag screen to move camera.";
	d.width = 600;
	d.height = 500;
	d.x = 200;
	d.y = 200;
	d.z = 3;
	mStage.addChild(d);
	
	document.getElementById("source").addEventListener("wheel", onMW);
	document.getElementById("source").addEventListener("mousemove", onMM);
	mStage.addEventListener(MouseEvent.CLICK,		onCL);
	mStage.addEventListener(MouseEvent.MOUSE_UP,	onMU);
	mStage.addEventListener(MouseEvent.MOUSE_DOWN,	onMD);
	mStage.addEventListener(KeyboardEvent.KEY_DOWN,	onKD);
	mStage.addEventListener(KeyboardEvent.KEY_UP,	onKU);
}
// UPDATE BG
function updateBG() {
	document.getElementById("source").style.backgroundImage = "url('" + BGS2[mBG] + "')";
}
// CLICK
function onCL(e) {
	var now = (new Date()).getTime();
	if (now - mLastClick < 200) {
		if (mHover == -1) {
			var s = new State();
			mStates.push(s);
			mStateCount++;
			mStage.addChild(s);
		}else {
			mStates[mHover].setAccept();
		}
		mLastClick = now - 200;
	}else {
		mLastClick = now;
	}
}
// MOUSE MOVE
function onMM(e) {
	if (mArr != null) {
		mArr.paint();
	}else if (mDrag != -1) {
		mStates[mDrag].onMDr();
	}else if (mArrDrag != -1) {
		mArrows[mArrDrag].paint();
	}else if (mMouseDown) {
		mMoveX = mMoveX == -1 ? e.clientX : mMoveX;
		mMoveY = mMoveY == -1 ? e.clientY : mMoveY;
		mStage.x += e.clientX - mMoveX;
		mStage.y += e.clientY - mMoveY;
		mMoveX = e.clientX;
		mMoveY = e.clientY;
	}
}
// MOUSE UP
function onMU(e) {
	mMouseDown = false;
	mMoveX = mMoveY = mDrag = mArrDrag = -1;
	if (mArr != null) {
		if (mHover != -1) {
			mArr.lockIn();
			var clone = Object.assign(mArr);
			mArrows.push(clone);
			mStage.addChild(clone);
			clone.paint();
		}
		mStage.removeChild(mArr);
		mArr = null;
	}
}
// MOUSE DOWN
function onMD(e) {
	mMouseDown = true;
	if (mTexFocus != -1 && !mTex[mTexFocus].hover) {
		var temp = mTexFocus;
		mTexFocus = -1;
		mTex[temp].update();
	}
}
// MOUSE WHEEL
function onMW(e) {
	// offset
	var x = (e.clientX / e.target.clientWidth + 0.5) * 2 - 1;
	var y = (e.clientY / e.target.clientHeight + 0.5) * 2 - 1;
	mStage.x += x * mStage.width * 0.055 * (e.deltaY > 0 ? 1 : -1);
	mStage.y += y * mStage.height * 0.055 * (e.deltaY > 0 ? 1 : -1);
	// scale
	mStage.scaleX = mStage.scaleY *= e.deltaY > 0 ? 0.95 : 1.05;
}
// KEY DOWN
function onKD(e) {
	mShift	= e.shiftKey;
	// delete
	if (e.keyCode == 46 && mHover != -1) {
		mStates[mHover].delArrows();
		mStage.removeChild(mStates[mHover]);
		mStates[mHover] = null;
	}else if (e.keyCode == 46 && mArrHover != -1) {
		mStage.removeChild(mArrows[mArrHover]);
		mArrows[mArrHover] = null;
	}
	// Tex
	if (mTexFocus != -1) {
		mTex[mTexFocus].onKD(e);
	}
}

// KEY UP
function onKU(e) {
	mShift	= e.shiftKey;
	// grid
	if (e.ctrlKey && e.keyCode == 71) {
		mBG = (mBG + 1) % 4;
		updateBG();
	}
}