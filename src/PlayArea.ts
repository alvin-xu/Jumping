class PlayArea extends egret.DisplayObjectContainer {
    private obstacleWidth:number = 50;
    
    private obstacleMaxHeight:number = 120;
    private obstacleMinHeight:number = 50;
    
    private obstacleStartX:number = 0;

    private obstacleMinSpace:number = 200;
    private obstacleMaxSpace:number = 250;

    private dangerMinX: number = 100;
    private dangerMaxX: number = 100 + 40 + this.obstacleMinSpace;

    public constructor (width:number,height:number) {
        super();
        this.width = width;
        this.height = height;     
        this.createScene();
    }

    public createScene() {
        this.clearObstacles();
        var x = this.getNextX(this.obstacleStartX);
        
        for(;;){
            if(x + this.obstacleWidth > this.width) break;    // 下一个障碍物将超出画布
            this.createObstacle(x);
            x = this.getNextX(x);
        }
    }

    private createObstacle(x:number) {
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.beginFill( 0xff0000, 1);
        var rH = this.getRandomHeight();
        shp.graphics.drawRect( 0, 0, this.obstacleWidth, rH );
        shp.graphics.endFill();
        
        shp.x = x;
        shp.y = this.height - rH;
        this.addChild( shp );
    }

    public getPoints():Array<egret.Point> {
        var points:Array<egret.Point> = new Array();
        for(var i=0; i<this.numChildren; i++) {
            var child = this.getChildAt(i);

            var gPoint:egret.Point = this.localToGlobal(child.x, child.y);
            console.log("global obstacle: " + gPoint);
            
            if(gPoint.x >= this.dangerMinX && gPoint.x <= this.dangerMaxX) {
                var pointNum = child.height / 20;   //20, Player半径
                console.log("point num: " + pointNum);
                for(var j=0; j<pointNum; j++) {
                    points.push(new egret.Point(gPoint.x, gPoint.y + j * 20));
                }
                return points;    
            }        
        }
        return points;
    }

    private clearObstacles() {
        this.obstacleStartX = 0;
        this.removeChildren();
    }

    private getRandom(n,m){
        //省略特殊情形下的处理过程，比如n>m，或者n、m之一无法转化为有效数字；
        return Math.round(Math.random()*(m-n)+n);
    }

    private getRandomHeight() {
        return this.getRandom(this.obstacleMinHeight,this.obstacleMaxHeight);
    }

    private getNextX(lastX:number) {
        return lastX + this.obstacleWidth + this.getRandom(this.obstacleMinSpace,this.obstacleMaxSpace);
    }
}