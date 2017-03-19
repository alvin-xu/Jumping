var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PlayArea = (function (_super) {
    __extends(PlayArea, _super);
    function PlayArea(width, height) {
        var _this = _super.call(this) || this;
        _this.obstacleWidth = 50;
        _this.obstacleMaxHeight = 120;
        _this.obstacleMinHeight = 50;
        _this.obstacleStartX = 0;
        _this.obstacleMinSpace = 200;
        _this.obstacleMaxSpace = 250;
        _this.dangerMinX = 100;
        _this.dangerMaxX = 100 + 40 + _this.obstacleMinSpace;
        _this.width = width;
        _this.height = height;
        _this.createScene();
        return _this;
    }
    PlayArea.prototype.createScene = function () {
        this.clearObstacles();
        var x = this.getNextX(this.obstacleStartX);
        for (;;) {
            if (x + this.obstacleWidth > this.width)
                break; // 下一个障碍物将超出画布
            this.createObstacle(x);
            x = this.getNextX(x);
        }
    };
    PlayArea.prototype.createObstacle = function (x) {
        var shp = new egret.Shape();
        shp.graphics.beginFill(0xff0000, 1);
        var rH = this.getRandomHeight();
        shp.graphics.drawRect(0, 0, this.obstacleWidth, rH);
        shp.graphics.endFill();
        shp.x = x;
        shp.y = this.height - rH;
        this.addChild(shp);
    };
    PlayArea.prototype.getPoints = function () {
        var points = new Array();
        for (var i = 0; i < this.numChildren; i++) {
            var child = this.getChildAt(i);
            var gPoint = this.localToGlobal(child.x, child.y);
            console.log("global obstacle: " + gPoint);
            if (gPoint.x >= this.dangerMinX && gPoint.x <= this.dangerMaxX) {
                var pointNum = child.height / 20; //20, Player半径
                console.log("point num: " + pointNum);
                for (var j = 0; j < pointNum; j++) {
                    points.push(new egret.Point(gPoint.x, gPoint.y + j * 20));
                }
                return points;
            }
        }
        return points;
    };
    PlayArea.prototype.clearObstacles = function () {
        this.obstacleStartX = 0;
        this.removeChildren();
    };
    PlayArea.prototype.getRandom = function (n, m) {
        //省略特殊情形下的处理过程，比如n>m，或者n、m之一无法转化为有效数字；
        return Math.round(Math.random() * (m - n) + n);
    };
    PlayArea.prototype.getRandomHeight = function () {
        return this.getRandom(this.obstacleMinHeight, this.obstacleMaxHeight);
    };
    PlayArea.prototype.getNextX = function (lastX) {
        return lastX + this.obstacleWidth + this.getRandom(this.obstacleMinSpace, this.obstacleMaxSpace);
    };
    return PlayArea;
}(egret.DisplayObjectContainer));
__reflect(PlayArea.prototype, "PlayArea");
//# sourceMappingURL=PlayArea.js.map