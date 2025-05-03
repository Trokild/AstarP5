function Spot(i, j, p, hh , s){
    this.spot = s;
    this.i = i;
    this.j = j;
    this.d = hh;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.t = 1;
    
    this.neighbors = [];
    this.previous = undefined;

    this.walkable = true;
    this.slope = false;
    this.hill = false;

    this.shape;
    this.spotGround = undefined;

    this.wall = false;
    this.hastre = false;
    this.worng = false;

    if(this.d > 1){
        this.hill = true
    }

    this.x1 = (this.i + p) * w;
    this.y1 = (this.j * h) + h - this.d;
    this.x2 = ((this.i + p) * w) + w;
    this.y2 = (this.j * h) + h  - this.d;
    this.x3 = ((this.i + p) * w) +(w*2);
    this.y3 = (this.j * h)  - this.d;
    this.x4 = ((this.i + p) * w) + w;
    this.y4 = (this.j * h) - this.d;

    this.show = function(col){
        stroke(112, 117, 61);
        if(this.worng === true){
            fill(255, 0, 0);
        }else{
            fill(col);
        }
        
        if(this.wall === true){
            beginShape(QUADS);
            fill(120, 120, 120);
            vertex(this.x2, this.y2 - 10);
            vertex(this.x2, this.y2);
            vertex(this.x3, this.y3);
            vertex(this.x3, this.y3 - 10);
            endShape(CLOSE);
            beginShape(QUADS);
            fill(120, 120, 120);
            vertex(this.x1, this.y1);
            vertex(this.x1, this.y1 - 10);
            vertex(this.x2, this.y2 - 10);
            vertex(this.x2, this.y2);
            endShape(CLOSE);
            beginShape(QUADS);
            fill(120, 120, 120);
            vertex(this.x1, this.y1 - 10);
            vertex(this.x2, this.y2 - 10);
            vertex(this.x3, this.y3 - 10);
            vertex(this.x4, this.y4 - 10);

            endShape(CLOSE);
            //quad(this.x1, this.y1, this.x1, this.y1 - 10, this.x2, this.y2 - 10, this.x2, this.y2);
            //quad(this.x2, this.y2 - 10, this.x2, this.y2, this.x3, this.y3, this.x3, this.y3 - 10);
            //quad(this.x1, this.y1 - 10, this.x2, this.y2 - 10, this.x3, this.y3 - 10, this.x4, this.y4 - 10);
            return;
        }

        // if(this.hill == true && this.worng === false){
        //     fill(200);
        // }

        if(this.hastre === true){
            //image(tre, this.x1 +15, this.y1 - 35, 24, 30, 0, 0, tre.width, tre.height, BOTTOM);
            //image(building, this.x1 - 25, this.y1 - building.height); // - (building.width / 2)
            push()
            texture(building);
            noStroke();
            //this.x2 + (building.width  / 2), this.y1 - building.height, this.x2 - (building.width  / 2), this.y1 - building.height, this.x2 - (building.width  / 2), this.y1, this.x2 + (building.width  / 2), this.y1
            //this.x2 + (building.width  / 2), this.y1, this.x2 - (building.width  / 2), this.y1, this.x2 - (building.width  / 2), this.y1 - building.height, this.x2 + (building.width  / 2)
            //this.x2 - (building.width  / 2), this.y1 - building.height, this.x2 + (building.width  / 2), this.y1 - building.height, this.x2 + (building.width  / 2), this.y1, this.x2 - (building.width  / 2), this.y1
            quad(this.x2 - (building.width  / 2), this.y1 - building.height, this.x2 + (building.width  / 2), this.y1 - building.height, this.x2 + (building.width  / 2), this.y1, this.x2 - (building.width  / 2), this.y1, 2, 2);
            pop()
            this.walkable = false;
            //this.d = 1
            return;
        }
        quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4, 2, 2);
    };
    
    this.addHill = function(hgt){
        this.hill = true;
        this.d = heights[hgt];
    };

    this.createShape = function(){
        stroke(0, 255, 0);
        //strokeWeight(2);
        let nd = this.d * 0.0001 + (this.j * 0.001) + (this.i * 0.002);
        quad(this.x1, this.y1, nd, this.x2, this.y2, nd, this.x3, this.y3, nd, this.x4, this.y4, nd);
        // beginShape(QUAD_STRIP);
        // vertex(this.x1, this.y1, nd);
        // vertex(this.x4, this.y4, nd);
        // vertex(this.x2, this.y2, nd);
        // vertex(this.x3, this.y3, nd);
        // endShape();
    };

    this.addBuilding = function(){
        
    }

    this.addNeighbors = function(grid){
        var i = this.i;
        var j = this.j;
        if(i < cols - 1){
            this.neighbors.push(grid[i + 1][j]);
        }
        if(i > 0){
            this.neighbors.push(grid[i - 1][j]);
        }
        if(j < rows - 1){
            this.neighbors.push(grid[i][j + 1]);
        }
        if(j > 0){
            this.neighbors.push(grid[i][j - 1]);
        }

        //Diagonal
        if(allowDiagonal){
            if(i > 0 && j > 0){
                this.neighbors.push(grid[i - 1][j - 1]);
            }
            if(i < cols - 1 && j > 0){
                this.neighbors.push(grid[i + 1][j - 1]);
            }
            if(i > 0 && j < rows - 1){
                this.neighbors.push(grid[i - 1][j + 1]);
            }
            if(i < cols - 1 && j < rows - 1){
                this.neighbors.push(grid[i + 1][j + 1]);
            }
        }
    }

    this.adjustHeight = function(){
        if(this.neighbors.length < 1){
            return;
        }
        for ( var i = 0; i < this.neighbors.length; i++){
            if(!this.neighbors[i].hill){
                if(this.i === this.neighbors[i].i + 1 && this.j === this.neighbors[i].j - 1){;
                    this.neighbors[i].y3 = this.y1;
                }
                continue;
            }

            if(this.i === this.neighbors[i].i && this.j < this.neighbors[i].j){
                this.y1 = this.neighbors[i].y4;
                this.y2 = this.neighbors[i].y3;
                continue;
            }
            if(this.i === this.neighbors[i].i && this.j > this.neighbors[i].j){
                this.y3 = this.neighbors[i].y2;
                this.y4 = this.neighbors[i].y1;
                continue;
            }
            if(this.j === this.neighbors[i].j && this.i < this.neighbors[i].i){
                this.y2 = this.neighbors[i].y1;
                this.y3 = this.neighbors[i].y4;
                continue;
            }
            if(this.j === this.neighbors[i].j && this.i > this.neighbors[i].i){
                this.y1 = this.neighbors[i].y2;
                this.y4 = this.neighbors[i].y3;
                continue;
            }

            if(this.i === this.neighbors[i].i + 1 && this.j === this.neighbors[i].j - 1){;
                this.y1 = this.neighbors[i].y3;
                continue;
            }
            if(this.i === this.neighbors[i].i - 1 && this.j === this.neighbors[i].j - 1){
                this.y2 = this.neighbors[i].y4;
                //this.worng = true;
                //console.log(this);
                continue;
            }

            if(this.hill){
                continue;
            }

            if(this.i === this.neighbors[i].i - 1 && this.j === this.neighbors[i].j + 1){
                this.y3 = this.neighbors[i].y1;
                continue;
            }
            if(this.i === this.neighbors[i].i + 1 && this.j === this.neighbors[i].j + 1){
                this.y4 = this.neighbors[i].y2;
                continue;
            }
        }
        if(this.spotGround == 'water'){
            if(this.d > 0){
                this.t = 1
            }else{
                this.t = 0;
            }
            return;
        }

        if(this.y1 != this.y2 || this.y3 != this.y4 || this.y3 + h != this.y1){
            this.slope = true;
            this.t = 2;

            if(this.y1 == this.y2 && this.y3 != this.y4 && this.y3 + h == this.y1){
                this.t = 4;
                return;
            }

            if(this.y1 == this.y2 && this.y3 != this.y4 && this.y3 + h != this.y1){
                this.t = 5;
                return;
            }

            if(this.y1 == this.y2 && this.y3 + h > this.y1){
                this.t = 0;
                return;
            }

            if(this.y1 != this.y2 && this.y3 == this.y4 && this.y3 + h != this.y1){
                this.t = 3;
                return;
            }

            if(this.y1 > this.y2 && this.y3 < this.y4){
                this.t = 0;
                return;
            }

            if(this.y1 > this.y2 && this.y3 == this.y4){
                this.t = 6;
                return;
            }
        }
    }

    this.clicked = function(mX, mY){
        if(mX < this.x1 || mX > this.x3){
            return false;
        };

        if(mY > this.y2 || mY < this.y4){
            return false;
        };
        
        
        // Ugly, angles "works"
        let vec1 = createVector(1, 1);
        let vec2 = createVector(this.x4 - this.x1, this.y4 - this.y1);
        let vec3 = createVector(mX - this.x1, mY- this.y1);

        let angle1 = p5.Vector.angleBetween(vec1, vec2);
        let angle2 = p5.Vector.angleBetween(vec1 , vec3);

        if(angle2 < angle1){
            return false;
        }
        return true;
        let vec4 = createVector(mX - this.x3, mY- this.y3);
        let angle3 = p5.Vector.angleBetween(vec1 , vec4);
        if(angle3 < 100){
            let cntr = this.center();
            let dOld = dist(mX, mY, cntr[0], cntr[1]);
            if(dOld > 2){
                return false;
            };
        }
        //this.worng = true;
        return true
        //console.log("angle x1, x4 : " + p5.Vector.angleBetween(vec1, vec2));
        //console.log("angle x1, mouse : " + p5.Vector.angleBetween(vec1, vec3));
        //console.log("mouse + vec2 : " + (p5.Vector.angleBetween(vec1, vec2) + p5.Vector.angleBetween(vec1, vec3)));
        //console.log("angle X2 : " + p5.Vector.angleBetween(vec1, vec5));
        //console.log("angle mouse : " + p5.Vector.angleBetween(vec1 , vec4));
        //console.log(vec1 + " - " + vec2);

        //strokeWeight(5);

        // let vec11 = createVector(this.x1, this.y1);
        // let vec12 = createVector(this.x2, this.y2);

        // point(mPos);
        // point(vec11);
        // point(vec12);
        //noLoop()
    }

    this.center = function(){
        let x = (this.x1 + this.x2 + this.x3 + this.x4) / 4;
        let y = (this.y1 + this.y2 + this.y3 + this.y4) / 4;
        let vec1 = createVector(x, y);
        //console.log(vec1)
        //point(vec1);
        return [x,y];
    }

    //un-used
    this.centerDist = function(mx, my){
        let d1 = dist(mx, my, this.x1, this.y1);
        let d2 = dist(mx, my, this.x2, this.y2);
        let d3 = dist(mx, my, this.x3, this.y3);
        let d4 = dist(mx, my, this.x4, this.y4);
        return (d1 + d2 + d3 + d4);
    }

    this.DebugWrong = function(){
        this.worng = true;
    }

    this.clear = function(){
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.previous = undefined;
    }
}