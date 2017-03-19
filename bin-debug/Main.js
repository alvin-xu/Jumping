//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.gameover = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        console.log("Hello World!!");
        console.log("width: " + this.stage.stageWidth);
        console.log("height: " + this.stage.stageHeight);
        var bg = new egret.Shape();
        bg.graphics.beginFill(0xFFFFFF);
        bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        bg.graphics.endFill();
        this.stage.addChild(bg);
        this.img = new egret.Bitmap();
        this.img.texture = RES.getRes("bg_jpg");
        this.img.width = (this.stage.stageWidth);
        this.img.scrollRect = new egret.Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.stage.addChild(this.img);
        this.img2 = new egret.Bitmap();
        this.img2.texture = RES.getRes("bg_jpg");
        this.img2.width = (this.stage.stageWidth);
        this.img2.scrollRect = new egret.Rectangle(-this.stage.stageWidth, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.stage.addChild(this.img2);
        //创建一个按钮,点击后控制文本内容向左移动
        var btnLeft = new egret.Shape();
        btnLeft.graphics.beginFill(0xcccc01);
        btnLeft.graphics.drawRect(0, 0, 50, 50);
        btnLeft.graphics.endFill();
        btnLeft.x = 50;
        btnLeft.y = 100;
        this.stage.addChild(btnLeft);
        btnLeft.touchEnabled = true;
        btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, onScroll, this);
        //创建一个按钮,点击后控制文本内容向右移动
        var btnRight = new egret.Shape();
        btnRight.graphics.beginFill(0x01cccc);
        btnRight.graphics.drawRect(0, 0, 50, 50);
        btnRight.graphics.endFill();
        btnRight.x = 150;
        btnRight.y = 100;
        this.stage.addChild(btnRight);
        btnRight.touchEnabled = true;
        btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, onScroll, this);
        //点击按钮后,控制文本向左右移动的方法
        function onScroll(e) {
            this.moveBackGround();
            // var rect: egret.Rectangle = this.img.scrollRect;
            // var rect2: egret.Rectangle = this.img2.scrollRect;
            // switch (e.currentTarget) {
            //     case btnLeft:
            //     rect.x += 20;
            //     rect2.x += 20;
            //     if(rect.x >= this.stage.stageWidth) {
            //         rect.x = -this.stage.stageWidth;
            //     }
            //     if(rect2.x >= this.stage.stageWidth) {
            //         rect2.x = -this.stage.stageWidth;
            //     }
            //     break;
            //     case btnRight:
            //     rect.x -= 20;
            //     rect2.x -= 20;
            //     break;
            // }
            // this.img.scrollRect = rect;
            // this.img2.scrollRect = rect2;
        }
        egret.startTick(this.tick, this);
        this.playScene = new PlayArea(this.stage.stageWidth, this.stage.stageHeight / 2);
        this.playScene.x = 0;
        this.playScene.y = this.stage.stageHeight / 4;
        this.playScene.scrollRect = new egret.Rectangle(0, 0, this.stage.stageWidth, this.stage.stageHeight / 2);
        this.stage.addChild(this.playScene);
        this.currentScene = this.playScene;
        this.playScene2 = new PlayArea(this.stage.stageWidth, this.stage.stageHeight / 2);
        this.playScene2.x = 0;
        this.playScene2.y = this.stage.stageHeight / 4;
        this.playScene2.scrollRect = new egret.Rectangle(-this.stage.stageWidth, 0, this.stage.stageWidth, this.stage.stageHeight / 2);
        this.stage.addChild(this.playScene2);
        this.player = new Player(this.stage.stageWidth, this.stage.stageHeight / 2);
        this.player.x = 0;
        this.player.y = this.stage.stageHeight / 4;
        console.log("player width: " + this.player.width);
        console.log("player height: " + this.player.height);
        this.stage.addChild(this.player);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        console.log("end.");
    };
    Main.prototype.onTouchTap = function (evt) {
        if (evt.currentTarget == this.stage) {
            console.log("touch");
        }
        this.player.jump();
    };
    Main.prototype.tick = function (timestamp) {
        if (this.gameover) {
            console.log("Game Over =@=");
            return false;
        }
        this.moveBackGround();
        return true;
    };
    Main.prototype.moveBackGround = function () {
        var rect = this.img.scrollRect;
        var rect2 = this.img2.scrollRect;
        rect.x += 5;
        rect2.x += 5;
        if (rect.x >= this.stage.stageWidth) {
            rect.x = -this.stage.stageWidth;
        }
        if (rect2.x >= this.stage.stageWidth) {
            rect2.x = -this.stage.stageWidth;
        }
        this.img.scrollRect = rect;
        this.img2.scrollRect = rect2;
        var prect = this.playScene.scrollRect;
        var prect2 = this.playScene2.scrollRect;
        prect.x += 5;
        prect2.x += 5;
        if (prect.x >= this.stage.stageWidth) {
            prect.x = -this.stage.stageWidth;
            this.playScene.createScene();
            this.currentScene = this.playScene2;
        }
        if (prect2.x >= this.stage.stageWidth) {
            prect2.x = -this.stage.stageWidth;
            this.playScene2.createScene();
            this.currentScene = this.playScene;
        }
        this.playScene.scrollRect = prect;
        this.playScene2.scrollRect = prect2;
        this.checkResult();
        return true;
    };
    Main.prototype.checkResult = function () {
        if (this.player.testHit(this.currentScene.getPoints())) {
            console.log("hit");
            this.gameover = true;
        }
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map