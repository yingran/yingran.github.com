(function(){

var _nodes = {},
    _inited = false,   
    _state = 0,   //0为非竞技状态,1预备中,2竞赛中.
    curKeys = {},
    boys = {}, character,  
    pMatrix, vWorld, mWorld, vCharacter,
    persHeight=-0.25, persDistance=-0.8;

function _init(){
    _nodes = {
        terrain: $("terrain"),
        gl: $("glcanvas"),
        warn: $("warn"),
        ranking: $("ranking")
    };
    document.addEventListener("keydown", getKeyDown);
    document.addEventListener("keyup", getKeyUp);
}
    
function drawInterval(){
    if (_state){
        okRequestAnimationFrame(drawInterval);
        slgl.draw();
    }
};

var Terrain = function(opts){
    if (!_inited){
        _init();
    }
    _state = 1;
    this.lastTime = 0;
    this.barriers = [];
    this.major = opts["major"];
    this.terrain = resources["terrain"][opts["terrid"]];
    this.initMatrix();
    this.initTerrain();
    this.initBoys(opts["boys"]);
    this.freshModel();
    
    drawInterval();
};
Terrain.prototype = {
    show: function(){
        _nodes.terrain.style.display = "block";
        _nodes.ranking.style.display = "none";
        _nodes.warn.style.display = "none";
    },
    hidden: function(){
        _nodes.terrain.style.display = "none";
    },
    start: function(){
        _state = 2;
        var major = this.major,
            self = this,
            lastTime = (new Date()).getTime();
            transInterval = function(){
                var nowTime;
                if (_state == 2){
                    nowTime = (new Date()).getTime();
                    okRequestAnimationFrame(transInterval);
                    handleKeys();
                    character.checkCrash();
                    self.animate();
                    lastTime=nowTime;
                }
            };
        this.reportInterval = setInterval(function(){
            self.report();
        }, 100);
        transInterval();
        this.report();
        this.warn("GO");
        setTimeout(function(){
            _nodes.warn.style.display = "none";
        },1000);
    },
    showRanking: function(data){
        var i, len=data.length, info=[];
        for (i=0; i<len; i++){
            info.push(data[i]["ranking"] + " ： " + data[i]["nick"] + "<br/>");
        }
        _nodes.ranking.innerHTML = info.join("");
        _nodes.warn.style.display = "none";
        _nodes.ranking.style.display = "block";
    },
    warn: function(msg){
        _nodes.warn.innerHTML = msg;
        _nodes.warn.style.display = "block";
    },
    destory: function(){
        _state = 0;
        clearInterval(this.reportInterval);
        slgl.reset();
    },
    initBoys: function(boys){
        var key;
        for (key in boys){
            if (this.major.id == boys[key]["id"]){
                this.initCharacter(boys[key]);
            } else {
                this.createBoys(boys[key]);
            }
        }
    },
    
    initMatrix: function(){
        pMatrix = okMat4Proj(60, 1.5, 0.001, 600.0);
        
        vWorld = new okMat4();
        vWorld.translate(OAK.SPACE_WORLD, 0.0, persHeight, 0.0, true);
        
        mWorld = new okMat4();
        mWorld.identity();
        
        vCharacter = new okMat4();
        vCharacter.translate(OAK.SPACE_LOCAL, 0.0, persHeight, persDistance, true);
    },
    initTerrain: function(){
        this.terrain["blocks"].forEach(this.initBlocks, this);
    },
    initBlocks: function(data){
        var rsMod=resources["models"][data["mod"]], rsTex=resources["textures"][data["tex"]], rsAmbient=data["ambient"]||this.terrain["ambient"],
            block, i, j, posArr=data["pos"], pos, len=posArr.length, barr, barriers=rsMod["barriers"], bLen=barriers?barriers.length:0;
        for (i=0; i<len; i++){
            pos=posArr[i];
            block = new Block({"x":pos.x, "y":pos.y, "z":pos.z});
            slgl.addModel(rsMod["model"], rsTex, vWorld, block.mMatrix, rsAmbient);
            
            if (!bLen){
                continue;
            }
            for (j=0; j<bLen; j++){
                barr=barriers[j];
                this.barriers.push([
                    [barr[0]["0"]+pos.x, barr[0]["1"]+pos.z], [barr[1]["0"]+pos.x, barr[1]["1"]+pos.z]
                ]);
            }
        }
    },
    freshModel: function(){
        slgl.init(_nodes.gl);
        character.translate();
        slgl.draw(pMatrix);
    },
    createBoys: function(data){
        var boy = boys[data.id] = new BrickBoy({
            x: data.pos.x,
            z: data.pos.z,
            yaw: data.pos.yaw,
            barriers: this.barriers,
            model: resources["models"]["brickboy"]["model"],
            tex: resources["textures"]["auto1"]
        });
        boy.mData = slgl.addModel(boy.model, boy.tex, vWorld, boy.mMatrix, this.terrain["ambient"]);
    },
    
    initCharacter: function(data){
        character = new BrickBoy({
            x: data.pos.x,
            z: data.pos.z,
            yaw: data.pos.yaw,
            mMatrix: vWorld,
            barriers: this.barriers,
            model: resources["models"]["brickboy"]["model"],
            tex: resources["textures"]["auto1"]
        });
        character.translate = function(x, y, z){
            y = y||0;
            this.mMatrix.identity();
            this.mMatrix.translate(OAK.SPACE_LOCAL, 0.0, 0.0, persDistance, true);
            this.mMatrix.rotY(OAK.SPACE_LOCAL, -this.pos.yaw, true);
            this.mMatrix.translate(OAK.SPACE_LOCAL, -this.pos.x, persHeight, -this.pos.z, true);
        }
        slgl.addModel(character.model, character.tex, vCharacter, mWorld, this.terrain["ambient"]);
    },

    translate: function(data){
        var i, len=data.length, boy, pos;
        for(i=0; i<len; i++){
            boy = boys[data[i]["id"]];
            if (!boy){
                continue;
            }
            pos = data[i]["pos"];
            boy.speed = pos.speed;
            boy.pos.x = pos.x;
            boy.pos.z = pos.z;
            boy.pos.yaw = pos.yaw;
            boy.translate();
        }
    },
    
    animate: function(){
        var key, timeNow = new Date().getTime(),
            elapsed = timeNow - this.lastTime;
        if (this.lastTime == 0){
            this.lastTime = timeNow;
            return;
        }
        if (elapsed > 200){
            clearKeys();
            this.lastTime = timeNow;
            return;
        }
        character.animate(elapsed);
        for (key in boys){
            boys[key].animate(elapsed);
        }
        this.lastTime = timeNow;
    },
    
    report: function(){
        this.major.socket.emit("translate", JSON.stringify({"x": character.pos.x, "z": character.pos.z, "yaw":character.pos.yaw, "speed":character.speed}));
    }
};

var BrickBoy = function(opts){
    opts = opts || {};
    this.id = opts.id;
    this.barriers = opts.barriers;
    this.pos = {x:opts.x, z:opts.z, yaw:opts.yaw};
    this.model = opts.model;
    this.tex = opts.tex;
    if (opts.mMatrix){
        this.mMatrix = opts.mMatrix;
    } else {
        this.mMatrix = new okMat4();
        this.mMatrix.translate(OAK.SPACE_LOCAL, this.pos.x, 0, this.pos.z, true);
    }
}
BrickBoy.prototype = {
    speed: 0,
    yawRate: 0,
    xSnip: 0,
    zSnip: 0,
    lastTime: 0,
    
    animate: function(elapsed){
        if (this.speed != 0){
            this.xSnip = Math.sin(this.pos.yaw*Math.PI/180)*this.speed*elapsed;
            this.zSnip = Math.cos(this.pos.yaw*Math.PI/180)*this.speed*elapsed;
            this.pos.x -= this.xSnip;
            this.pos.z -= this.zSnip;
        }
        this.pos.yaw += this.yawRate*elapsed;
        this.translate();
    },
    
    translate: function(x, y, z){
        y = y||0;
        this.mMatrix.identity();
        this.mMatrix.translate(OAK.SPACE_LOCAL, this.pos.x, y, this.pos.z, true);
        this.mMatrix.rotY(OAK.SPACE_LOCAL, this.pos.yaw, true);
    },
    
    destroy: function(){
        var id = this.id;
        slgl.removeModel(this.mData);
        boys[id] = null;
        delete boys[id];
    },
    
    checkCrash: function(){
        if (this.barriers.some(this._checkDis, this)){
            this.speed = 0;
            this.pos.x += this.xSnip;
            this.pos.z += this.zSnip;
        }
    },
    _checkDis: function(line){
        var dis = this._getPointToLine([this.pos.x, this.pos.z], line[0], line[1]);
        return dis<0.11;
    },
    _getPointToLine: function(p1, p2, p3){
        var a, b, c, p, x;
        a = Math.sqrt(Math.pow((p2[0]-p1[0]),2)+Math.pow((p2[1]-p1[1]),2));
        b = Math.sqrt(Math.pow((p3[0]-p1[0]),2)+Math.pow((p3[1]-p1[1]),2));
        c = Math.sqrt(Math.pow((p3[0]-p2[0]),2)+Math.pow((p3[1]-p2[1]),2));
        if (a>c){
            return b;
        }
        if (b>c){
            return a;
        }
        p = (a+b+c)/2;
        return 2*Math.sqrt(p*(p-a)*(p-b)*(p-c))/c;
    }
}


var Block = function(opts){
    this.mMatrix = new okMat4();
    this.mMatrix.translate(OAK.SPACE_LOCAL, opts.x, opts.y||0, opts.z, true);
};


function handleKeys(){
    if (curKeys[87] || curKeys[38]){
        character.speed = 0.003;
    } else if (curKeys[83] || curKeys[40]){
        character.speed = -0.003;
    } else {
        character.speed = 0;
    }
    if (curKeys[68] || curKeys[39]){
        character.yawRate = -0.1;
    } else if (curKeys[65] || curKeys[37]){
        character.yawRate = 0.1;
    } else {
        character.yawRate = 0;
    }
}

function clearKeys(){
    curKeys[83] = false;
    curKeys[87] = false;
    curKeys[65] = false;
    curKeys[68] = false;
    curKeys[37] = false;
    curKeys[38] = false;
    curKeys[39] = false;
    curKeys[40] = false;
}
       
function getKeyDown(e){
    curKeys[e.keyCode] = true;
}

function getKeyUp(e){
    curKeys[e.keyCode] = false;
}


window.Terrain = Terrain;
    
})();