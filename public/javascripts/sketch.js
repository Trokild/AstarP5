// need update, remove an elemet from array
function removeFromArray(arr, elmt){
    for(var i = arr.length - 1; i >= 0; i--){
        if(arr[i] == elmt){
            arr.splice(i, 1);
        }
    }
};

function between(x, min, max) {
    return x >= min && x <= max;
}

var isPathSearching = false;
const debugMode = false;
var canvasW = 1200;
var canvasH = 600;

var Obj;
var lastTime;
//let shape;
let buttonBuild;
let buttonMove;
function setup(){
    createCanvas(canvasW, canvasH, WEBGL);
    buttonBuild = createButton("Build");
    buttonBuild.size(50, 20)
    buttonBuild.position(60, 60);
    buttonBuild.mousePressed(buildBtn);

    // sel = createSelect();
    // sel.option('Red');
    // sel.option('Blue');
    // sel.option('Green');
    // sel.changed(changeBg);
    //function changeBg()

    buttonMove = createButton("Move");
    buttonMove.size(50, 20)
    buttonMove.position(60, 80);
    buttonMove.mousePressed(moveBtn);

    createMap();
    if(debugMode){
        canvasW -= 700;
        canvasH -= 200;
    }else{
        canvasW -= 2000;
        canvasH -= 200;
    }
    translate(canvasW - width, canvasH - height);

    //var posStart = grid[0][0].center();
    Obj = new UnitObject(grid[0][0], 5);
    lastTime = millis();

    //start = grid[0][0];
    //end = grid[cols - 1][rows - 1]
    //start.wall = false;
    //end.wall = false;
    //openSet.push(start);

    angleMode(DEGREES);
}

function draw(){
    background(150);

    if(keyIsDown(LEFT_ARROW) === true){
        canvasW += 2;
    }
    if (keyIsDown(RIGHT_ARROW) === true) {
        canvasW -= 2;
    }
    if(keyIsDown(UP_ARROW) === true){
        canvasH += 2;
    }
    if (keyIsDown(DOWN_ARROW) === true) {
        canvasH -= 2;
    }
    translate(canvasW - width, canvasH - height);
    //console.log("yo");
    // if(isPathSearching){
    //     pathFinding();
    // }

    // if(noPath === true || foundPath === true){
    //     if(debugMode){
    //         for (var i = 0; i < cols; i++) {
    //             for (var j = 0; j < rows; j++) {
    //                 grid[i][j].show(color(255));
    //             }
    //         }
    //     }else{
    //         texture(txtrx);
    //         model(shapeMap);
    //     }

    //     if(noPath === true){
    //         return;
    //     };

    //     if(debugMode){
    //         for (var i = 0; i < path.length; i++) {
            
    //             path[i].show(color(0, 0, 255));
                
    //         }
    //         for (var i = 0; i < cols; i++) {
    //             for (var j = 0; j < rows; j++) {
    //                 var theSpot = grid[i][j];
    //                 if(!path.includes(theSpot)){
    //                     grid[i][j].show(color(255));
    //                 }
    //             }
    //         }
    //         //end.show(color(0, 255, 0))
    //     }
    //     return;
    // };
    

    if(debugMode){
        if(foundPath === true){
            for (var i = 0; i < path.length; i++) {
            
                path[i].show(color(0, 0, 255));
                
            }
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    var theSpot = grid[i][j];
                    if(!path.includes(theSpot)){
                        grid[i][j].show(color(255));
                    }
                }
            }
        }else{
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    grid[i][j].show(color(255));
                }
            }
        }


        for (var i = 0; i < cols; i++) {
            var bldng = [];
            for (var j = 0; j < rows; j++) {
                var grd = grid[i][j];
                if(grd.hastre){
                    bldng.push(grd);
                    continue;
                }
                //grid[i][j].show(color(255));
            }
            if(bldng.length < 1){
                continue;
            }
            for (var b = 0; b < bldng.length; b++){
                bldng[b].show(color(255)); 
            }
        }
        
        // for (var i = 0; i < closedSet.length; i++) {
        //     closedSet[i].show(color(255, 0, 0))
        // }
    
        // for (var i = 0; i < openSet.length; i++) {
        //     openSet[i].show(color(0, 255, 0))
        // }
    }else{
        texture(txtrx);
        model(shapeMap);
    }

    if(debugMode){
        // for (var i = 0; i < path.length; i++) {
        //     path[i].show(color(0, 0, 255));
        // }
    }
    push();
    Obj.show();
    pop();
    Obj.move();
    noStroke();
    if (buildings.length > 0){
        for (let i = 0; i < buildings.length; i++) {
            buildings[i].show();  
        }
    }

}

class UnitObject{
    constructor(gridpos, speed) {
        var gridCntr = gridpos.center();
        this.x = gridCntr[0];
        this.y = gridCntr[1];
        this.gridSpot = gridpos;
        this.speed = speed;
        this.endPoint = [1, 0];
        this.isMoving = false;
        this.objPath = [];
        this.uv = [0, 0.5];
        this.selected = true;
    }
    show() {
        
        //circle(this.x, this.y, 20);
        texture(unitimg);
        textureMode(NORMAL);
        if(this.selected == true){
            stroke(0, 255, 0);
        }else{
            noStroke();
        }
        let nd = this.gridSpot.d * 0.0001 + (this.gridSpot.j * 0.0011) + (this.gridSpot.i * 0.002) + 0.002;

        //quad(this.x -5, this.y , 1, this.x + 5, this.y, 1, this.x + 5, this.y - 10, 1, this.x - 5, this.y - 10, 1);
        beginShape();
        vertex(this.x -5, this.y, nd, this.uv[0], 1);
        vertex(this.x + 5, this.y, nd, this.uv[1], 1);
        vertex(this.x + 5, this.y - 10, nd, this.uv[1], 0);
        vertex(this.x - 5, this.y - 10, nd, this.uv[0], 0); 
        endShape(CLOSE);
        
    }

    move(){
        var timeNow = millis();
        var dt = timeNow - lastTime;
        lastTime = timeNow;
        if(!this.isMoving){
            return;
        };
        
        if(this.objPath.length < 1 || this.endPoint == null){
            this.isMoving = false;
            this.uv = [0, 0.5];
            console.log("stop");
            return;
        }

        var dstan = dist(this.endPoint[0], this.endPoint[1], this.x, this.y);

        if(dstan < 2){
            this.newPath();
            return;
        };
        
        var dst = (dt/100) / dstan;
        this.x += (this.endPoint[0] - this.x) * dst * this.speed;
        this.y += (this.endPoint[1] - this.y) * dst * this.speed;
    }

    startMove(path){
        this.objPath = [];
        for (let i = path.length - 1; i > -1; i--) {
            var pth = path[i].center();
            pth.push(path[i]);
            this.objPath.push(pth);
        };
        this.objPath = traversify(this.objPath);
        var curPath = this.objPath[0];
        this.gridSpot = curPath[2];
        this.endPoint = curPath;
        this.isMoving = true;
        this.uv = [0.5, 1];
    }

    newPath(){
        var curSpot = this.objPath[0];
        this.gridSpot = curSpot[2];
        var remPath = this.objPath.splice(1);
        this.objPath = remPath;
        var curPath = this.objPath[0];
        this.endPoint = curPath;

        if(this.gridSpot.slope){
            this.speed = 3;
        }else{
            this.speed = 5;
        }
    }
}

var buildings = [];
class BuildingType{
    constructor(name, img, size, openSpace, ground) {
        this.name = name;
        this.texture = img;
        this.size = size;
        this.openSpace = openSpace;
        this.ground = ground;
    }
}

class Building extends BuildingType{
    constructor(bld ,gridPos) {
        super(bld.name, bld.texture, bld.size, bld.openSpace, bld.ground);

        this.gridSpot = grid[gridPos[0]][gridPos[1]];
        var x = this.gridSpot.x2;
        var y = this.gridSpot.y1;
        var txtr = this.texture;
        let nd = this.gridSpot.d * 0.0001 + (this.gridSpot.j * 0.001) + (this.gridSpot.i * 0.002) + 0.002;
        beginGeometry();
        quad(x - (txtr.width  / 2), y - txtr.height, nd, x + (txtr.width  / 2), y - txtr.height, nd, x + (txtr.width  / 2), y, nd, x - (txtr.width  / 2), y, nd, 2, 2);
        this.shape = endGeometry();
    }

    show(){
        //stroke(0);
        texture(this.texture);
        model(this.shape);
    }
}

class Tree{
    constructor(img, logs, gridSpot) {
        this.gridSpot = gridSpot;
        this.resource = logs;
        this.texture = img;
        var x = this.gridSpot.x2;
        var y = this.gridSpot.y1;
        var txtr = this.texture;
        let nd = this.gridSpot.d * 0.0001 + (this.gridSpot.j * 0.001) + (this.gridSpot.i * 0.002) + 0.002;
        beginGeometry();
        quad(x - (txtr.width  / 2), y - txtr.height, nd, x + (txtr.width  / 2), y - txtr.height, nd, x + (txtr.width  / 2), y, nd, x - (txtr.width  / 2), y, nd, 2, 2);
        this.shape = endGeometry();
    }

    show(){
        //stroke(0);
        texture(this.texture);
        model(this.shape);
    }
}


