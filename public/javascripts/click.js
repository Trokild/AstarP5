let clickPos = null;
let clickPosStart = null;
let clickPosEnd = null;
let startClick = false;
let clickState = 0;
let selector_bldTyp = 1;

function mouseClicked() {
    var clickAble = gridClick();
    if(!clickAble){
        console.log("shant click here");
        return;
    }
    // Obj.endPoint = grid[clickPos[0]][clickPos[1]].center();
    // Obj.isMoving = true;
    // grid[clickPos[0]][clickPos[1]].DebugWrong();
    // console.log(Obj);
    //grid[clickPos[0]][clickPos[1]].worng = true;

    switch (clickState){
        case 0:
            clickPathfind();
            break;
        case 1:
            buildBuilding(selector_bldTyp);
            break;
        default:
            console.log("No valid clickState: " + clickState);
    }
}

function gridClick(){
    //console.log("X: " + (mouseX - ((width) / 2) - (canvasW - width)));
    //console.log("Y: " + (mouseY - ((height) / 2)- (canvasH - height)));
    let mcX = (mouseX - ((width) / 2) - (canvasW - width));
    let mcY = (mouseY - ((height) / 2)- (canvasH - height));
    var newClickPos = null;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if(grid[i][j].clicked(mcX, mcY) == false){
                continue;
            };
            if(clickPos != null){
                let centerOld = grid[clickPos[0]][clickPos[1]].center();
                let centerNew = grid[i][j].center();
                let centerOld1 = grid[clickPos[0]][clickPos[1]].centerDist(mcX, mcY);
                let centerNew1 = grid[i][j].centerDist(mcX, mcY);
                let debugfda = [i, j];
                let dOld = dist(mcX, mcY, centerOld[0], centerOld[1]);
                let dNew = dist(mcX, mcY, centerNew[0], centerNew[1]);
                //console.log(clickPos + " dist: " + dOld + ", "+ debugfda +" new dist: " + dNew);
                //console.log(clickPos + " centerdist: " + centerOld1 + ", "+ debugfda +" new centerdist: " + centerNew1);
                if(dOld < dNew){
                    continue;
                }
            };
            newClickPos = [i, j];
            clickPos = newClickPos;
        }
    }
    if(newClickPos == null){
        return false;
    }
    return true;
}

function buildBtn(){
    console.log("build");
    clickState = 1;
}

function buildBuilding(ty){
    if(clickPos == null){ return };
    var bldTyp = buildingTypes[ty];
    if(bldTyp == undefined){ return };
    var buildGrid = grid[clickPos[0]][clickPos[1]];
    if(!checkBuildingSpot(buildGrid)){ return }
    if(bldTyp.size > 1){
        var buildGrid1;
        var buildGrid2;
        var buildGrid3;
        if(clickPos[0] > 0){
            buildGrid1 = grid[clickPos[0] - 1][clickPos[1]];
            if(!checkBuildingSpot(buildGrid1)){ return }
        } else return;
        if(clickPos[1] > 0){
            buildGrid2 = grid[clickPos[0]][clickPos[1] - 1];
            if(!checkBuildingSpot(buildGrid2)){ return }
        } else return;
        buildGrid3 = grid[clickPos[0] - 1][clickPos[1] - 1];
        if(!checkBuildingSpot(buildGrid3)){ return };

        buildGrid.walkable = false;
        buildGrid1.walkable = false;
        buildGrid2.walkable = false;
        buildGrid3.walkable = false;
    }else{buildGrid.walkable = false}

    var bldng = new Building(bldTyp, clickPos);
    
    if(buildings.length > 0){
        for (let i = 0; i < buildings.length; i++) {
            let bldSpot = buildings[i].gridSpot.spot;
            if(bldSpot > buildGrid.spot){
                buildings.splice(i, 0, bldng);
                return;
            }
        }
    }
    buildings.push(bldng);
}

function checkBuildingSpot(gridSpot){
    if(gridSpot.spotGround != 'grass' && debugMode == false){ console.log("only grass"); return false };
    if(gridSpot.slope){ console.log("must be flat"); return false };
    if(!gridSpot.walkable){ console.log("something in the way"); return false };
    return true;
}

function moveBtn(){
    console.log("move");
    clickState = 0;
}

function clickPathfind(){
    if(startClick == false){
        clickPosStart = clickPos;
        startClick = true;
        //console.log(Obj);
    }else{
        clickPosEnd = clickPos;
        //check walkable start and endpoints
        if(!grid[clickPosStart[0]][clickPosStart[1]].walkable){
            startClick = false;
            return;
        };
        if(!grid[clickPosEnd[0]][clickPosEnd[1]].walkable){
            startClick = false;
            return;
        };;

        var pth = findPath(clickPosStart, clickPosEnd);
        //console.log(pth);
        console.log(Obj);
        Obj.startMove(pth);
        startClick = false;
    }
}

