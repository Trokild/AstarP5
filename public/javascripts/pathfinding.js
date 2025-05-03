// var openSet = [];
// var closedSet = [];
// var start;
// var end;
// var path = [];

var searchPath = false;
var allowDiagonal = true;
var foundPath = false;
var noPath = false;

function pathFinding() {
    if(openSet.length > 0){
        var winr = 0;
        for (var i = 0; i < openSet.length; i++) {
            if(openSet[i].f < openSet[winr].f){
                winr = i;
            }
        }
        var current = openSet[winr];

        if(current === end){
            foundPath = true;
            console.log("DONE");
            Obj.startMove(ski(current));
            console.log(Obj);
            stopPathfinding();
            return;
        };

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if(!closedSet.includes(neighbor) && neighbor.walkable){
                var factor = 0;
                if(current.i != neighbor.i && current.j != neighbor.j){
                    var _neighbors = neighbor.neighbors;
                    var wls = 0;
                    for (var j = 0; j < _neighbors.length; j++){
                        if(neighbors.includes(_neighbors[j])){
                            if(_neighbors[j].walkable === false){
                                wls += 1;
                            }
                        }
                    }
                    
                    if(wls > 1){
                        console.log("this spot cannot be crossed because wls: " + wls +".");
                        console.log(neighbor);
                        continue;
                    }
                    factor += 0.1;
                }
                if(neighbor.slope){
                    factor += 0.3;
                }

                var tempG = current.g + 1 + factor;
                var newPath = false;
                if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g = tempG;
                        newPath = true;
                    }
                }else{
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if(newPath){
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }   
        }
    }else{
        console.log("No path");
        noPath = true;
        stopPathfinding();
        return;
    }

    if(!noPath){
        path = [];
        var temp = current;
        path.push(temp);
        while(temp.previous){
            path.push(temp.previous);
            temp = temp.previous;
        }
        if(foundPath)
        {
            console.log("foundPath in !noPath");
            console.log(noPath);
        }
    }
}

function findPath(startSpot, endSpot){
    clearGrid();
    var openSet = [];
    var closedSet = [];
    var end;
    //var path = [];
  
    end = grid[endSpot[0]][endSpot[1]];
    openSet.push(grid[startSpot[0]][startSpot[1]]);
    var pap = pathLoop();
    //console.log(pap);
    return pap;

    function pathLoop(){
        if(openSet.length > 0){
            var winr = 0;
            for (var i = 0; i < openSet.length; i++) {
                if(openSet[i].f < openSet[winr].f){
                    winr = i;
                }
            }
            var current = openSet[winr];
    
            if(current === end){
                foundPath = true;
                var pathReturn = ski(current);
                //stopPathfinding();
                //console.log(pathReturn);
                return pathReturn;
            };
    
            removeFromArray(openSet, current);
            closedSet.push(current);
    
            var neighbors = current.neighbors;
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if(!closedSet.includes(neighbor) && neighbor.walkable){
                    var factor = 0;
                    if(current.i != neighbor.i && current.j != neighbor.j){
                        var _neighbors = neighbor.neighbors;
                        var wls = 0;
                        for (var j = 0; j < _neighbors.length; j++){
                            if(neighbors.includes(_neighbors[j])){
                                if(_neighbors[j].walkable === false){
                                    wls += 1;
                                }
                            }
                        }
                        
                        if(wls > 1){
                            console.log("this spot cannot be crossed because wls: " + wls +".");
                            console.log(neighbor);
                            continue;
                        }
                        factor += 0.1;
                    }
                    if(neighbor.slope){
                        factor += 0.3;
                    }
    
                    var tempG = current.g + 1 + factor;
                    var newPath = false;
                    if(openSet.includes(neighbor)){
                        if(tempG < neighbor.g){
                            neighbor.g = tempG;
                            newPath = true;
                        }
                    }else{
                        neighbor.g = tempG;
                        newPath = true;
                        openSet.push(neighbor);
                    }
    
                    if(newPath){
                        neighbor.h = heuristic(neighbor, end);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.previous = current;
                    }
                }   
            }
        }else{
            console.log("No path");
            noPath = true;
            stopPathfinding();
            return false;
        }
    
        // if(!noPath){
        //     path = [];
        //     var temp = current;
        //     path.push(temp);
        //     while(temp.previous){
        //         path.push(temp.previous);
        //         temp = temp.previous;
        //     }
        //     if(foundPath)
        //     {
        //         console.log("foundPath in !noPath");
        //         console.log(noPath);
        //     }
        // }
        return pathLoop();
    };
}

function startPathfinding(startPos, endPos){
    stopPathfinding();
    isPathSearching = true;
    path = [];
    end = grid[endPos[0]][endPos[1]];
    openSet.push(grid[startPos[0]][startPos[1]]);
}

function stopPathfinding(){
    openSet = [];
    closedSet = [];
    noPath = false;
    foundPath = false;
    isPathSearching = false;
    clearGrid();
}

function clearGrid(){
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].clear();
        }
    }
}

function ski(current){
    path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }
    return path;
}

function heuristic(a, b){
    if(allowDiagonal){
        var d = dist(a.i, a.j, b.i, b.j)
    }else{
        var d = abs(a.i-b.i) + abs(a.j-b.j);
    }
    return d;
}

function traversify(travelPath){
    if(travelPath.length < 2){
        console.log("travelPath 1 or less");
        return travelPath;
    };
    var newTravelPath = [];
    for (let i = 0; i < travelPath.length; i++) {
        newTravelPath.push(travelPath[i]);
        if(i + 2 > travelPath.length){
            continue;
        };
        var curSpot = travelPath[i][2];
        var nextSpot = travelPath[i + 1][2];

        if(curSpot.slope == nextSpot.slope){
            continue;
        };

        var direction = directionSpots(curSpot, nextSpot);
        console.log(direction);
        
        if(!direction){
            continue;
        };
        var newTravelSpot = [];
        let x;
        let y;

        switch (direction) {
            case "RIGHT":
                x = (curSpot.x3 + curSpot.x2) / 2;
                y = (curSpot.y3 + curSpot.y2) / 2;
            break;

            case "LEFT":
                x = (curSpot.x4 + curSpot.x1) / 2;
                y = (curSpot.y4 + curSpot.y1) / 2;
            break;

            case "DOWN":
                x = (curSpot.x1 + curSpot.x2) / 2;
                y = (curSpot.y1 + curSpot.y2) / 2;
            break;

            case "UP":
                x = (curSpot.x3 + curSpot.x4) / 2;
                y = (curSpot.y3 + curSpot.y4) / 2;
            break;
        
            default:
            break;
        };
        newTravelSpot.push(x, y, curSpot);
        newTravelPath.push(newTravelSpot);
    };
    return newTravelPath;
}

function directionSpots(spotA, spotB){
    var a_i = spotA.i;
    var a_j = spotA.j;
    var b_i = spotB.i;
    var b_j = spotB.j;

    //left
    if(a_i + 1 == b_i && a_j == b_j){
        return "RIGHT";
    };

    if(a_i - 1 == b_i && a_j == b_j){
        return "LEFT";
    };

    if(a_i == b_i && a_j + 1 == b_j){
        return "DOWN";
    };

    if(a_i == b_i && a_j - 1 == b_j){
        return "UP";
    };
    return false;
}