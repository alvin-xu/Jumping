var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(width, height) {
        var _this = _super.call(this) || this;
        _this.jumpHeight = 200;
        _this.jumpTime = 150; //ms
        _this.fallTime = 200;
        _this.playerRadius = 20;
        _this.playerX = 100;
        _this.isJumping = false;
        _this.areaHeight = height;
        _this.areaWidth = width;
        _this.width = width;
        _this.height = height;
        _this.playerTopY = 0;
        _this.playerBottomY = _this.areaHeight - 2 * _this.playerRadius;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Player.prototype.onAddToStage = function (event) {
        this.player = new egret.Shape();
        this.player.graphics.beginFill(0xff0000, 1);
        this.player.graphics.drawCircle(this.playerRadius, this.playerRadius, this.playerRadius);
        this.player.graphics.endFill();
        this.player.x = this.playerX;
        this.player.y = this.playerBottomY;
        // 可以滚动的可视区域，不会超过自身组件大小。？
        this.scrollRect = new egret.Rectangle(0, 0, this.areaWidth, this.areaHeight);
        this.addChild(this.player);
    };
    Player.prototype.move = function (h) {
        var rect = this.scrollRect;
        rect.y += h;
        this.scrollRect = rect;
        return rect.y;
    };
    Player.prototype.moveUp = function (h) {
        return this.move(h >= 0 ? h : -h);
    };
    Player.prototype.moveDown = function (h) {
        return this.move(h <= 0 ? h : -h);
    };
    /**
     * 判断坐标是否碰撞，true／false
     */
    Player.prototype.testHit = function (points) {
        console.log("global player, " + this.localToGlobal(this.player.x, this.player.y));
        console.log("points length: " + points.length);
        for (var i = 0; i < points.length; i++) {
            if (this.player.hitTestPoint(points[i].x, points[i].y, true))
                return true;
        }
        return false;
    };
    Player.prototype.jump = function () {
        if (this.isJumping)
            return;
        this.isJumping = true;
        //创建一个计时器对象(间隔ms，执行次数)
        var timer = new egret.Timer(10, this.jumpTime / 10);
        var everyMove = this.jumpHeight / (this.jumpTime / 10);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            this.moveUp(everyMove);
        }, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            console.log("Jump to air.");
            this.falling();
        }, this);
        //开始计时
        timer.start();
    };
    Player.prototype.falling = function () {
        var timer = new egret.Timer(10, this.fallTime / 10);
        var everyMove = this.jumpHeight / (this.fallTime / 10);
        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER, function () {
            this.moveDown(everyMove);
        }, this);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () {
            console.log("Fall back to land.");
            this.isJumping = false;
        }, this);
        //开始计时
        timer.start();
    };
    return Player;
}(egret.DisplayObjectContainer));
__reflect(Player.prototype, "Player");
//# sourceMappingURL=Player.js.map