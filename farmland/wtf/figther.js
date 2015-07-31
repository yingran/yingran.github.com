$(document).ready(function(){
    
var BRICK_WIDTH = 50;
    
var Fighter = function(opts){
    opts = opts || {};
};

Fighter.prototype = {
    setType: function(type){
        if (!list[type]){
            console.log('无此型号');
            return;
        }
        this.type = type;
        this.key = list[type]['k'];
        this.parts = list[type]['p'];
        this.w = list[type]['w'];
        this.h = list[type]['h'];
        this.point = [];
    },
    setOri: function(ori){
        this.ori = ori||0;
        this.calculatePoint();
    },
    calculatePoint: function(){
        switch(this.ori){
            case 1:
                this.point=[BRICK_WIDTH*3.5, BRICK_WIDTH*2.5];
                break;
            case 2:
                this.point=[BRICK_WIDTH*2.5, BRICK_WIDTH*3.5];
                break;
            case 3:
                this.point=[BRICK_WIDTH*0.5, BRICK_WIDTH*2.5];
                break;
            default:
                this.point=[BRICK_WIDTH*2.5, BRICK_WIDTH*0.5];
                break;
        }
    }
};

var list = {
    'a0':{'w':5,'h':4,
        'k':[[2,0]],
        'p':[[2,0,1],[0,1],[1,1],[2,1],[3,1],[4,1],[2,2],[1,3],[2,3],[3,3]]
    },
    'a1':{'w':4,'h':5,
        'k':[[3,2]],
        'p':[[3,2,1],[2,0],[2,1],[2,2],[2,3],[2,4],[1,2],[0,1],[0,2],[0,3]]
    },
    'a2':{'w':5,'h':4,
        'k':[[2,3]],
        'p':[[2,3,1],[0,2],[1,2],[2,2],[3,2],[4,2],[2,1],[1,0],[2,0],[3,0]]
    },
    'a3':{'w':4,'h':5,
        'k':[[0,2]],
        'p':[[0,2,1],[1,0],[1,1],[1,2],[1,3],[1,4],[2,2],[3,1],[3,2],[3,3]]
    },
    'b0':{'w':5,'h':5,
        'k':[[2,0]],
        'p':[[2,0,1],[2,1],[0,2],[1,2],[2,2],[3,2],[4,2],[2,3],[1,4],[2,4],[3,4]]
    },
    'b1':{'w':5,'h':5,
        'k':[[4,2]],
        'p':[[4,2,1],[3,2],[2,0],[2,1],[2,2],[2,3],[2,4],[1,2],[0,1],[0,2],[0,3]]
    },
    'b2':{'w':5,'h':5,
        'k':[[2,4]],
        'p':[[2,4,1],[2,3],[0,2],[1,2],[2,2],[3,2],[4,2],[2,1],[1,0],[2,0],[3,0]]
    },
    'b3':{'w':5,'h':5,
        'k':[[0,2]],
        'p':[[0,2,1],[1,2],[2,0],[2,1],[2,2],[2,3],[2,4],[3,2],[4,1],[4,2],[4,3]]
    }
};

window.Fighter = Fighter;
    
});
