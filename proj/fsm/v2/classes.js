class State extends PIXI.Container {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.z = 0;
        this.dX = this.dY = -1;
        this.accept = false;
        // background
        this.bg = new Graphics();
        this.bg.x = this.bg.y = 0;
        this.bg.interactive = true;
        this.bg.beginFill(0xD8D8D8);
        this.bg.lineStyle(1, 0xA1A1A1);
        this.bg.drawCircle(0, 0, 50);
        this.bg.endFill();
        super.addChild(this.bg);
        // text
        this.t = new Text("State", {fontFamily: "Arial", fontSize: 24, fill: "black"});
        this.t.position.set(0, -10);
        this.t.anchor.set(0.5, 0.5);
        super.addChild(this.t);
        // sub text
        this.st = new Text("content", {fontFamily: "Arial", fontSize: 14, fill: "black"});
        this.st.position.set(0, 20);
        this.st.anchor.set(0.5, 0.5);
        super.addChild(this.st);
        // events
        var _this = this;
        this.bg.on("mouseover",         function(e) { _this.onMOv(); });
        this.bg.on("mouseout",          function(e) { _this.onMOu(); });
        this.bg.on("mousedown",         function(e) { _this.onMD(e); });
        this.bg.on("mouseup",           function(e) { _this.onMU();  });
        this.bg.on("mouseupoutside",    function(e) { _this.onMU();  });
        this.bg.on("mousemove",         function(e) { _this.onMM(e); });
        this.bg.on("click",             function(e) { _this.onCL();  });
        
        mFocus = this;
        document.getElementById("topBar").style.top = "0";
    }
    // PAINT
    paint() {
        this.bg.clear();
        this.bg.beginFill(mFocus === this ? 0x9ac2f2 : 0xD8D8D8, mHover === this ? 1.0 : 0.7);
        this.bg.lineStyle(1, 0x8d8d8d);
        this.bg.drawCircle(0, 0, 50);
        this.bg.endFill();
        if (this.accept) {
            this.bg.drawCircle(0, 0, 45);
        }
        renderer.render(stage);
    }
    // MOUSE OVER
    onMOv() {
        mHover = this;
        this.paint();
    }
    // MOUSE OUT
    onMOu() {
        mHover = null;
        this.paint();
    }
    // MOUSE DOWN
    onMD(e) {
        document.getElementById("mainText").value = this.t.text;
        document.getElementById("subText").value = this.st.text;
        mFocus = this;
        document.getElementById("topBar").style.top = "0";
        mDrag = this;
        this.dX = e.data.originalEvent.clientX - this.x;
        this.dY = e.data.originalEvent.clientY - this.y;
    }
    // MOUSE UP
    onMU() {
        mDrag = null;
    }
    // MOUSE MOVE
    onMM(e) {
        if (mDrag === this) {
            this.x = e.data.originalEvent.clientX - this.dX;
            this.y = e.data.originalEvent.clientY - this.dY;
        }
        this.paint();
    }
    // CLICK
    onCL() {
        var now = (new Date()).getTime();
        // double click
        if (now - mLastClick < 200) {
            this.accept = !this.accept;
            this.paint();
            now -= 200;
        }
        mLastClick = now;
    }
}

class Link extends PIXI.Container {
    constructor() {
        super();
        
    }
}