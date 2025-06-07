var cols = 50;
var rows = 20;
var w, h;
var grid = new Array();
var pixelMap = new Array();
var uvCords = new Array();
var heights = [0, 10, 20, 30];
var groundsUV = new Map();
let shapeMap;

var heightMap;
var groundMap;
var groundMaptes;
var treImg;
var unitimg;

//var buildingJson;
var buildingTypes = [];

function preload() {
    treImg = loadImage('./public/images/_forrest1x1.png');
    unitimg = loadImage('./public/images/unit_test.png');
    if(debugMode){
        heightMap = loadImage('./public/images/mapDebug.jpg');
    }else{
        heightMap = loadImage('./public/images/heightMap.png');
        groundMap = loadImage('./public/images/groundMap.png');
    }
    txtrx = loadImage('./public/images/textureMap.png');

    building = loadImage('./public/images/building2x2.png');
    loadDataJson('buildings');
    //console.log();
    groundsUV.set("grass", [0, 1, 2, 3, 4 ,5, 6]);
    groundsUV.set("tree", [0, 1, 2, 3, 4 ,5, 6]);
    groundsUV.set("sand",[7, 8, 9, 10, 11, 12, 13]);
    groundsUV.set("stone",[14, 15, 16, 17, 18, 19, 20]);
    groundsUV.set("water",[98, 99]);
}

function handleJson(data){
    switch (true) {
        case data.building != 'undefined':
            var bld = data.building;
            for (let i = 0; i < bld.length; i++) {
                let imgName = bld[i].Texture;
                let imgTemp = loadImageFile(imgName);
                let bType = new BuildingType(bld[i].Name, imgTemp, bld[i].Size, bld[i].OpenSpace, bld[i].Ground);
                buildingTypes.push(bType);
            }
            break;
        default:
            console.log("undefined datatype");
            break;
    }
}

function loadDataJson(name){
    if(name == null || name == 'undefined'){
        console.log("No 'name'");
        return false;
    };
    var dataFile = loadJSON('public/json/' + name + '.json', handleJson);
    if(dataFile == null || dataFile == 'undefined'){
        console.log("No json with name: " + name);
        return false;
    };
    return dataFile;
}

function loadImageFile(name){
    if(name == null || name == 'undefined'){
        console.log("No 'name'");
        return false;
    };
    var imgFile = loadImage('public/images/' + name + '.png');
    if(imgFile == null || imgFile == 'undefined'){
        console.log("No image with name: " + name);
        return false;
    };
    return imgFile;
}

function getImgData(img){
    console.log(img.loadPixels());
}

function createUvCords(){
    let x = 0;
    let y = 0;
    let uvi = 0
    const incr = 0.1;
    for (let j = 0; j < 10; j++) {
        for (let i = 0; i < 10; i++) {
            uvCords[uvi] = new Array(4);
            uvCords[uvi][0] = [x, y];
            uvCords[uvi][1] = [x + incr, y];
            uvCords[uvi][2] = [x, y + incr];
            uvCords[uvi][3] = [x + incr, y + incr];
            x += incr;
            uvi++;
        }
        x = 0;
        y += incr;
    }
    //console.log(uvCords)
    return;
    //#region Hardcoded uvcords
    let vd = 0;
    let vdc = 0;
    vd += 1;
    let cvd = [vd, vdc];
    console.log(cvd);

    uvCords[0] = new Array(4);
    uvCords[0][0] = [0, 0];
    uvCords[0][1] = [0.1, 0];
    uvCords[0][2] = [0, 0.1];
    uvCords[0][3] = [0.1, 0.1];

    uvCords[1] = new Array(4);
    uvCords[1][0] = [0.1, 0];
    uvCords[1][1] = [0.2, 0];
    uvCords[1][2] = [0.1, 0.1];
    uvCords[1][3] = [0.2, 0.1];

    uvCords[2] = new Array(4);
    uvCords[2][0] = [0.2, 0];
    uvCords[2][1] = [0.3, 0];
    uvCords[2][2] = [0.2, 0.1];
    uvCords[2][3] = [0.3, 0.1];

    uvCords[3] = new Array(4);
    uvCords[3][0] = [0.3, 0];
    uvCords[3][1] = [0.4, 0];
    uvCords[3][2] = [0.3, 0.1];
    uvCords[3][3] = [0.4, 0.1];

    uvCords[4] = new Array(4);
    uvCords[4][0] = [0.4, 0];
    uvCords[4][1] = [0.5, 0];
    uvCords[4][2] = [0.4, 0.1];
    uvCords[4][3] = [0.5, 0.1];

    uvCords[5] = new Array(4);
    uvCords[5][0] = [0.5, 0];
    uvCords[5][1] = [0.6, 0];
    uvCords[5][2] = [0.5, 0.1];
    uvCords[5][3] = [0.6, 0.1];

    uvCords[6] = new Array(4);
    uvCords[6][0] = [0.6, 0];
    uvCords[6][1] = [0.7, 0];
    uvCords[6][2] = [0.6, 0.1];
    uvCords[6][3] = [0.7, 0.1];
    //#endregion
}

function createMap(){
    heightMap.loadPixels();
    if(debugMode == false){
        groundMap.loadPixels();
        if(groundMap.width != heightMap.width || groundMap.height != heightMap.height){
            console.log("groundMap and heightMap is not the same size");
        }
    }

    for (let i = 0; i < heightMap.width; i ++) {
        pixelMap[i] = new Array(heightMap.height);
    };
    let jb = 0;
    let ib = 0;
    for ( var i = 0; i < heightMap.pixels.length; i+= 4){
        if(i >= (heightMap.width * 4)* (jb + 1)){
            jb++;
            ib = 0;
        }
        let rgbI = [heightMap.pixels[i], heightMap.pixels[i+1], heightMap.pixels[i+2]];
        pixelMap[ib][jb] = new mapSpot(rgbI);

        if(debugMode == false){
            let rgbJ = [groundMap.pixels[i], groundMap.pixels[i+1], groundMap.pixels[i+2]];
            pixelMap[ib][jb].addType(rgbJ);
        }
        //console.log(pixelMap[ib][jb]);
        ib ++;
    };

    cols = heightMap.width;
    rows = heightMap.height;
    w =  25;    //(width / (cols + rows)); //(1+(1/cols)
    h =  20;    //(height / rows);

    for ( var i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    };
    var p = rows - 1;
    let spotIdx = 0;
    for ( var i = 0; i < cols; i++){
        for ( var j = 0; j < rows; j++){
            let hgt = 0;
            if(pixelMap[i][j].isHeight && pixelMap[i][j].groundType != 'water'){
                hgt = heights[pixelMap[i][j].spotHeight]
            }
            let namTypeGrnd = pixelMap[i][j].groundType;
            //console.log(namTypeGrnd);
            let valGround = groundsUV.get(namTypeGrnd);
            //console.log(valGround);
            grid[i][j] = new Spot(i, j, p, hgt, spotIdx);
            grid[i][j].spotGround = namTypeGrnd;
            spotIdx ++;
            p--;
        }
        p = rows - 1;
    };

    for ( var i = 0; i < cols; i++){
        for ( var j = 0; j < rows; j++){
            grid[i][j].addNeighbors(grid);
        }
    };

    for ( var i = 0; i < cols; i++){
        for ( var j = 0; j < rows; j++){
            grid[i][j].adjustHeight();
        }
    };
    //console.log(pixelMap);
    //console.log(grid);
    if(!debugMode){
        beginGeometry();
        for ( var i = 0; i < cols; i++){
            for ( var j = 0; j < rows; j++){
                grid[i][j].createShape();
            }
        };
        shapeMap = endGeometry();
        //shapeMap.clearColors();
        //console.log(shapeMap);
        createUvCords();

        for ( var i = 0; i < cols; i++){
            for ( var j = 0; j < rows; j++){
                let grd = grid[i][j];
                let idx = (grd.spot) * 4;
                let uvSet = groundsUV.get(grd.spotGround);
                let uvId = uvSet[grd.t];
                //console.log(uvId);
                if(uvId == undefined){
                    console.log(grd);
                    console.log(uvSet);
                    console.log(uvId);
                }
                shapeMap.uvs[idx] = uvCords[uvId][0];
                shapeMap.uvs[idx + 1] = uvCords[uvId][1];
                shapeMap.uvs[idx + 2] = uvCords[uvId][2];
                shapeMap.uvs[idx + 3] = uvCords[uvId][3];

                if(grd.spotGround == 'water'){
                    shapeMap.vertexStrokeColors.push(0, 1, 1, .1);
                    shapeMap.vertexStrokeColors.push(0, 1, 1, .1);
                    shapeMap.vertexStrokeColors.push(0, 1, 1, .1);
                    shapeMap.vertexStrokeColors.push(0, 1, 1, .1);
                }else if(grd.spotGround == 'sand'){
                    shapeMap.vertexStrokeColors.push(1, 1, 1, .1);
                    shapeMap.vertexStrokeColors.push(1, 1, 1, .1);
                    shapeMap.vertexStrokeColors.push(1, 1, 1, .1);
                    shapeMap.vertexStrokeColors.push(1, 1, 1, .1);
                }else if(grd.spotGround == 'grass'){
                    shapeMap.vertexStrokeColors.push(0, .7, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, .7, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, .7, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, .7, 0, .1);
                }else if(grd.spotGround == 'tree'){
                    grd.walkable = false;
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);

                    var _tree = new Tree(treImg, 100, grd);
                    if(buildings.length > 0){
                        for (let i = 0; i < buildings.length; i++) {
                            let bldSpot = buildings[i].gridSpot.spot;
                            if(bldSpot > grd.spot){
                                buildings.splice(i, 0, _tree);
                                return;
                            }
                        }
                    }
                    buildings.push(_tree);
                }else{
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                    shapeMap.vertexStrokeColors.push(0, 0, 0, .1);
                }
            }
        };
    }
};

function mapSpot(mp){
    var _r = mp[0];
    var _g = mp[1];
    var _b = mp[2];

    this.isHeight = false;
    this.spotHeight = 0;
    this.groundType = "undefined";

    this.addType = function(mpT){
        var mpR = mpT[0];
        var mpG  = mpT[1];
        var mpB  = mpT[2];
        switch (true) {
            case mpR == 0 && mpG == 255 && mpB == 0:
                //console.log("Green");
                this.groundType = "grass";
                break;
            case mpR == 255 && mpG == 255 && mpB == 0:
                //console.log("Yellow");
                this.groundType = "sand";
                break;
            case mpR == 120 && mpG == 120 && mpB == 120:
                //console.log("Gray");
                this.groundType = "stone";
                break;
            case mpR == 0 && mpG == 0 && mpB == 255:
                //console.log("Blue");
                this.groundType = "water";
                break;
            case mpR == 0 && mpG == 100 && mpB == 0:
                //console.log("Dark Green");
                this.groundType = "tree";
                break;
            default:
                console.log("undefined Color: " + mpT);
                break;
        }
    };

    if(_r !== _g && _b !== _g){
        console.log("Not height RGB")
        return;
    };
    const nr = _r;

    if(nr < 90){
        this.isHeight = true;
        this.spotHeight = 3;
        return;
    }
    if(between(nr, 90, 180)){
        this.isHeight = true;
        this.spotHeight = 2;
        return;
    }
    if(between(nr, 181, 245)){
        this.isHeight = true;
        this.spotHeight = 1;
        return;
    }
    if(nr > 245){
        this.isHeight = false;
        this.spotHeight = 0;
        return;
    }
}