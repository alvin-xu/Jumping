class Player extends egret.DisplayObjectContainer {
    private jumpHeight:number = 200;
    private jumpTime:number = 150; //ms
    private fallTime:number = 200;

    private areaHeight:number;
    private areaWidth:number;
    
    private player:egret.Shape;
    private playerRadius:number = 20;

    private playerTopY:number;
    private playerBottomY:number;
    private playerX:number = 100;

    private isJumping:boolean = false;

    public constructor(width:number, height:number) {
        super();
        this.areaHeight = height;
        this.areaWidth = width;

        this.width = width;
        this.height = height;

        this.playerTopY = 0;
        this.playerBottomY = this.areaHeight - 2*this.playerRadius;

        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event)
    {
        this.player = new egret.Shape();
        this.player.graphics.beginFill( 0xff0000, 1);
        this.player.graphics.drawCircle(this.playerRadius, this.playerRadius, this.playerRadius);
        this.player.graphics.endFill();

        this.player.x = this.playerX;
        this.player.y = this.playerBottomY;
     
        // 可以滚动的可视区域，不会超过自身组件大小。？
        this.scrollRect = new egret.Rectangle(0,0,this.areaWidth,this.areaHeight);

        this.addChild( this.player );
    }

    private move(h:number): number {
        var rect: egret.Rectangle = this.scrollRect;
        rect.y += h;
        this.scrollRect = rect;
        return rect.y;
    }

    private moveUp(h: number) :number {
        return this.move(h>=0? h : -h);
    }
    private moveDown(h: number) :number {
        return this.move(h<=0? h : -h);
    }
    
    /**
     * 判断坐标是否碰撞，true／false
     */
    public testHit(points:Array<egret.Point>):boolean {
        console.log("global player, " + this.localToGlobal(this.player.x,this.player.y));
        console.log("points length: " + points.length);
        for(var i=0;i<points.length ;i ++) {
            if(this.player.hitTestPoint(points[i].x, points[i].y, true)) return true;
        }
        return false;
    }

    public jump() {
        if(this.isJumping) return;
        this.isJumping = true;

        //创建一个计时器对象(间隔ms，执行次数)
        var timer:egret.Timer = new egret.Timer(10, this.jumpTime/10);
        var everyMove = this.jumpHeight/(this.jumpTime/10);

        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER,function() {
            this.moveUp(everyMove)
        },this);

        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,function() {
            console.log("Jump to air.")
            this.falling();
        },this);

        //开始计时
        timer.start();
    }

    private falling() {
        var timer:egret.Timer = new egret.Timer(10, this.fallTime/10);
        var everyMove = this.jumpHeight/(this.fallTime/10);

        //注册事件侦听器
        timer.addEventListener(egret.TimerEvent.TIMER,function() {
            this.moveDown(everyMove)
        },this);

        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,function() {
            console.log("Fall back to land.")
            this.isJumping = false;
        },this);

        //开始计时
        timer.start();
    }
}