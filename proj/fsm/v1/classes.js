// classes.js

// TODO make custom "arrow" class to make arrows less buggy
//		instead of source being center of circle, it use the radian of the mouse position
//		source should be the edge of the circle, this will make it easier to position the arrow
//
// TODO make custom textfield class because the textfields suck, with all the text highlight bugginess

class State extends Sprite {
	constructor() {
		super();
		this.x = mStage.mouseX;
		this.y = mStage.mouseY;
		this.mDX = this.mDY = 0;	// mouse down position
		this.id = mStateCount;
		this.sourceArr = [];		// arrows spawning from this
		this.destArr = [];			// arrows pointing to this
		this.cents = 0;
		this.z = 0;
		this.accept = false;
		// color palette
		this.colorB1 = 0xE9E9E9;	// background def
		this.colorB2 = 0xB8B8B8;	// background onhover
		this.colorBr = 0x000000;	// border
		this.colorT1 = 0x000000;	// main text
		this.colorT2 = 0xFF0000;	// sub text
		//	hitbox - linestyle causes buggy hitbox
		this.hb = new Sprite();
		this.hb.graphics.beginFill(this.colorB1, 1);
		this.hb.graphics.drawCircle(0, 0, 50);
		this.hb.graphics.endFill();
		super.addChild(this.hb);
		//	border
		this.b = new Sprite();
		this.b.graphics.lineStyle(2, this.colorBr);
		this.b.graphics.drawCircle(0, 0, 50);
		super.addChild(this.b);
		//	inner border (accept state)
		this.b2 = new Sprite();
		this.b2.graphics.lineStyle(2, this.colorBr);
		this.b2.graphics.drawCircle(0, 0, 45);
		//	name display
		this.nD = new TextField();
		this.nD.type = "input";
		this.nD.setTextFormat(new TextFormat("Arial", 40, this.colorT1));
		this.nD.wordWrap = false;
		this.nD.text = "S" + mStateCount.toString();
		this.nD.width = 20 + this.nD.textWidth;
		this.nD.height = this.nD.textHeight;
		this.nD.x = (this.nD.width - 20) * -0.5;
		this.nD.y = this.nD.height * -0.7;
		var _this = this;
		this.nD.addEventListener(KeyboardEvent.KEY_UP, function(event) { _this.ndResize(); });
		super.addChild(this.nD);
		//	cents display
		this.cD = new TextField();
		this.cD.type = "input";
		this.cD.setTextFormat(new TextFormat("Arial", 20, this.colorT2));
		this.cD.wordWrap = false;
		this.cD.text = "0¢";
		this.cD.width = 10 + this.cD.textWidth;
		this.cD.height = this.cD.textHeight;
		this.cD.x = this.cD.width * -0.5;
		this.cD.y = 20;
		this.addChild(this.cD);
		this.cD.addEventListener(KeyboardEvent.KEY_UP, function(event) { _this.cdResize(); });
		//	mouse events
		this.addEventListener(MouseEvent.MOUSE_OVER, function(e) {	_this.onMOv(); });
		this.addEventListener(MouseEvent.MOUSE_OUT, function(e) {	_this.onMOu(); });
		this.addEventListener(MouseEvent.MOUSE_DOWN, function(e) {	_this.onMDn(); });
	}
	addArrow(arr, source) {
		if (source) {
			this.sourceArr.push(arr);
		}else {
			this.destArr.push(arr);
		}
	}
	delArrows() {
		for (let arr of this.sourceArr) {
			mStage.removeChild(arr);
			mArrows[arr.id] = null;
		}
		for (let arr of this.destArr) {
			mStage.removeChild(arr);
			mArrows[arr.id] = null;
		}
	}
	setAccept() {
		if (!this.accept) {
			this.b.addChild(this.b2);
		}else {
			this.b.removeChild(this.b2);
		}
		this.accept = !this.accept;
	}
	// RESIZE
	ndResize() {
		this.nD.width = 20 + this.nD.textWidth;
		this.nD.height = this.nD.textHeight;
		this.nD.setTextFormat(new TextFormat("Arial", 40 - this.nD.textWidth / 7, this.colorT1));
		this.nD.x = (this.nD.width - 20) * -0.5;
		this.nD.y = this.nD.height * -0.7;
	}
	cdResize() {
		this.cD.width = 10 + this.cD.textWidth;
		this.cD.x = (this.cD.width - 10) * -0.5;
	}
	// MOUSE OVER
	onMOv() {
		mHover = this.id;
		this.b.graphics.clear();
		this.b.graphics.lineStyle(2, this.colorBr);
		this.b.graphics.beginFill(this.colorB2, 1);
		this.b.graphics.drawCircle(0, 0, 50);
		this.b.graphics.endFill();
		// selectable
		this.nD.selectable = this.cD.selectable = mDrag == -1 && mArr == null;
	}
	// MOUSE OUT
	onMOu() {
		mHover = -1;
		this.b.graphics.clear();
		this.hb.graphics.beginFill(this.colorB1, 1);
		this.hb.graphics.drawCircle(0, 0, 50);
		this.hb.graphics.endFill();
		this.b.graphics.lineStyle(2, this.colorBr);
		this.b.graphics.drawCircle(0, 0, 50);
	}
	// MOUSE DOWN
	onMDn() {
		if (mShift) {	// spawn arrow from this
			mArr = new Arrow(this);
			mStage.addChild(mArr);
		}else {			// drag this
			mDrag = this.id;
			this.mDX = mStage.mouseX - this.x;
			this.mDY = mStage.mouseY - this.y;
		}
	}
	// MOUSE DRAG
	onMDr() {
		this.x = mStage.mouseX - this.mDX;
		this.y = mStage.mouseY - this.mDY;
		// arrows
		for (let arr of this.sourceArr) {
			arr.paint();
		}
		for (let arr of this.destArr) {
			arr.paint();
		}
	}
}

class Arrow extends Sprite {
	constructor(source) {
		super();
		this.id = -2;
		this.color = 0xFF0000;
		// LAYER [States, Arrows, Instruction text]
		this.z = 1;
		// source, destination (State object)
		this.s = source;
		this.d = null;
		// curve location
		this.cx = this.s.x;
		this.cy = this.s.y;
		//	loop
		this.l = new Sprite();
		this.l.visible = false;
		this.l.rad = 0;
		this.addChild(this.l);
		//	arrow
		this.a = new Sprite();
		this.a.x = this.s.x;
		this.a.y = this.s.y;
		this.addChild(this.a);
		//	text background
		this.b = new Sprite();
		this.b.width = 70;
		this.b.height = 30;
		this.addChild(this.b);
		//	text
		this.t = new TextField();
		this.t.type = "input";
		this.t.setTextFormat(new TextFormat("Arial", 20, 0x0000FF));
		this.t.text = "00";
		this.t.width = 50;
		this.t.height = 20;
		this.t.x = this.s.x - this.t.textWidth;
		this.t.y = this.s.x - 5;
		this.addChild(this.t);
		//	mouse events
		var _this = this;
		this.addEventListener(MouseEvent.MOUSE_OVER,	function(e) { _this.onMOv();	});
		this.addEventListener(MouseEvent.MOUSE_OUT,		function(e) { _this.onMOu();	});
		this.addEventListener(MouseEvent.MOUSE_DOWN,	function(e) { _this.onMD();		});
		this.addEventListener(MouseEvent.MOUSE_UP,	function(e) { onMU();		});
		// paint
		this.paint();
	}
	paint() {
		// calculate curve point
		if (mArrDrag == this.id) {
			var mx = this.s.x + (this.d.x - this.s.x) / 2;
			var my = this.s.y + (this.d.y - this.s.y) / 2;
			var dx = mStage.mouseX - mx;
			var dy = mStage.mouseY - my;
			this.cx = mStage.mouseX + Math.pow(Math.abs(dx), 1.0005) * Math.sign(dx);
			this.cy = mStage.mouseY + Math.pow(Math.abs(dy), 1.0005) * Math.sign(dy);
		}
		// calculate arrow placement
		if (mHover != -1 || mArrDrag == this.id) {
			var dx = this.d == null ? mStates[mHover].x : this.d.x;
			var dy = this.d == null ? mStates[mHover].y : this.d.y;
			var rad = Math.atan2(this.cy - dy, this.cx - dx);
			this.a.x = dx + Math.cos(rad) * 55;
			this.a.y = dy + Math.sin(rad) * 55;
		}else if (this.d == null) {
			this.a.x = mStage.mouseX;
			this.a.y = mStage.mouseY;
		}
		this.graphics.clear();
		this.graphics.moveTo(this.s.x, this.s.y);
		this.graphics.lineStyle(3, this.color);
		// line
		if ((this.d == null && this.s.id == mHover) || this.s == this.d) {
			if (this.d == null || mArrDrag == this.id) {
				this.l.rad = Math.atan2(mStage.mouseY - this.s.y, mStage.mouseX - this.s.x);
			}
			// loopback (cubic curve)
			this.l.visible = true;
			this.l.x = this.s.x;
			this.l.y = this.s.y;
			this.l.rotationZ = (this.l.rad / Math.PI) * 180;
			this.l.graphics.clear();
			this.l.graphics.moveTo(0, 0);
			this.l.graphics.lineStyle(3, this.color);
			this.l.graphics.cubicCurveTo(150,100, 150,-100, 0,0);
			// no arrow (TODO)
			this.a.visible = false;
			// text
			var tx = this.s.x + Math.cos(this.l.rad) * 120 - 10;
			var ty = this.s.y + Math.sin(this.l.rad) * 120 - 5;
			this.b.graphics.clear();
			this.b.graphics.beginFill(0x00FF00, 1);
			this.b.graphics.drawRect(tx - this.b.width * 0.5, ty - this.b.height * 0.5, this.b.width, this.b.height);
			this.b.graphics.endFill();
			this.t.x = tx - this.t.textWidth;
			this.t.y = ty - 5;
		}else {
			this.l.visible = false;
			// curved line
			this.graphics.curveTo(this.cx, this.cy, this.a.x, this.a.y);
			// arrow
			this.a.visible = true;
			this.a.rotationZ = (Math.atan2(this.cy - this.a.y, this.cx - this.a.x) / Math.PI) * 180;
			this.a.graphics.clear();
			this.a.graphics.beginFill(this.color);
			this.a.graphics.drawTriangles([(this.d == null ? 5 : -5),0, 30,-10, 30,10], [0,1,2]);
			this.a.graphics.endFill();
			// text
			var tx = ((this.s.x + this.a.x) / 2 + this.cx) / 2;
			var ty = ((this.s.y + this.a.y) / 2 + this.cy) / 2;
			this.b.graphics.clear();
			this.b.graphics.beginFill(0x000000, 1);
			this.b.graphics.drawRect(tx - this.b.width * 0.5, ty - this.b.height * 0.5, this.b.width, this.b.height);
			this.b.graphics.endFill();
			this.t.x = tx - this.t.textWidth;
			this.t.y = ty - 5;
		}
	}
	lockIn() {
		this.d = mStates[mHover];
		this.id = mArrCount++;
		this.s.addArrow(mArr, true);
		this.d.addArrow(mArr, false);
		this.cx = (this.s.x + mStage.mouseX) / 2;
		this.cy = (this.s.y + mStage.mouseY) / 2;
	}
	// MOUSE OVER
	onMOv() {
		this.color = 0x880000;
		this.t.selectable = true;
		mArrHover = this.id;
		this.paint();
	}
	// MOUSE OUT
	onMOu() {
		this.color = 0xFF0000;
		this.t.selectable = false;
		mArrHover = -1;
		this.paint();
	}
	// MOUSE DOWN
	onMD() {
		mArrDrag = mArrDrag == this.id ? -1 : this.id;
	}
}

class Tex extends Sprite {
	constructor(x, y, text, fontSize) {
		super();
		mTex.push(this);
		this.x = x;
		this.y = y;
		this.colorBg = 0x000000;
		this.opacBg = 0.1;
		this.hl = true;
		this.id = mTexCount++;
		mTexFocus = this.id;
		this.hover = false;
		// color palette
		this.colorB1 = 0x000000;	// background def
		this.colorB2 = 0x000000;	// background onhover
		this.colorBr = 0x595959;	// border
		this.colorT1 = 0x000000;	// main text
		this.colorT2 = 0xFF0000;	// sub text
		//	background
		this.b = new Sprite();
		super.addChild(this.b);
		//	text
		this.t = new TextField();
		this.t.setTextFormat(new TextFormat("Arial", fontSize, this.colorT1));
		this.t.wordWrap = this.t.selectable = false;
		this.t.text = text;
		super.addChild(this.t);
		//	cursor
		this.csr = new Sprite();
		this.csr.k = text.length;
		super.addChild(this.csr);
		//	mouse events
		var _this = this;
		this.addEventListener(MouseEvent.MOUSE_OVER, function(e) {	_this.onMOv(); });
		this.addEventListener(MouseEvent.MOUSE_OUT, function(e) {	_this.onMOu(); });
		this.addEventListener(MouseEvent.MOUSE_DOWN, function(e) {	_this.onMD(); });
		
		this.update();
		this.paint();
	}
	// UPDATE SPACING
	update() {
		// text
		this.t.width = this.t.textWidth;
		this.t.height = this.t.textHeight;
		this.t.x = this.t.width * -0.5;
		this.t.y = this.t.height * -0.4;
		// cursor
		var temp = this.t.text;
		this.t.text = this.t.text.substr(0, this.csr.k);
		this.csr.xx = this.t.x + this.t.textWidth;
		this.t.text = temp;
		// spacing
		this.px = this.t.width * 0.1;
		this.py = this.t.height * 0.1;
		this.w = this.t.width + 2 * this.px;
		this.h = this.t.height + 2 * this.py;
		// paint
		this.paint();
	}
	// PAINT
	paint() {
		var border = false;
		// opacity / border
		if (this.hover || mTexFocus == this.id) {
			border = true;
			this.opacBg = 0.3;
		}else {
			this.opacBg = 0.1;
		}
		// draw background
		this.b.graphics.clear();
		if (border) {
			this.b.graphics.lineStyle(2, this.colorBr);
		}
		this.b.graphics.beginFill(this.colorB1, this.opacBg);
		this.b.graphics.drawRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);
		this.b.graphics.endFill();
		// draw cursor
		this.csr.graphics.clear();
		this.csr.graphics.lineStyle(2, 0xFF0000);
		this.csr.graphics.moveTo(this.csr.xx, this.t.y);
		this.csr.graphics.lineTo(this.csr.xx, this.t.y + this.t.height);
	}
	// SET
	setFontSize(f) {
		this.t.setTextFormat(new TextFormat("Arial", f, this.colorT1));
	}
	// MOUSE OVER
	onMOv() {
		this.hover = true;
		this.paint();
	}
	// MOUSE OUT
	onMOu() {
		this.hover = false;
		this.paint();
	}
	// MOUSE DOWN
	onMD() {
		mTexFocus = this.id;
	}
	// KEY DOWN (called from stage key listener)
	onKD(e) {
		if (e.keyCode == 32 || (e.keyCode > 46 && e.keyCode < 91) || (e.keyCode > 93 && e.keyCode < 112) || (e.keyCode > 185 && e.keyCode < 223)) {
			var c = String.fromCharCode(e.keyCode).toLowerCase();
			// letter case
			if (e.keyCode > 46 && e.keyCode < 91 && e.shiftKey) {
				c = c.toUpperCase();
			}
			// apphend character
			this.t.text = this.t.text.substr(0, this.csr.k) + c + this.t.text.substr(this.csr.k);
			this.csr.k++;
		}else {
			// special function key
			switch (e.keyCode) {
				case 8:	// backspace
					this.t.text = this.t.text.substr(0, Math.max(0, this.csr.k - 1)) + this.t.text.substr(this.csr.k);
					break;
				case 13: case 27: // enter, escape
					mTexFocus = -1;
					break;
				case 37: // left arrow
					this.csr.k = Math.max(0, this.csr.k - 1);
					break;
				case 39: // right arrow
					this.csr.k = Math.min(this.t.text.length, this.csr.k + 1);
					break;
				case 46: // delete
					this.t.text = this.t.text.substr(0, this.csr.k) + this.t.text.substr(Math.min(this.t.text.length - 1, this.csr.k + 1));
			}
		}
		this.update();
	}
}