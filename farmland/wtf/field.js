$(document).ready(function(){
        
var BRICK_WIDTH = 50;

var Field = function(opts){
    this.column = 10;
    this.parent = opts['parent'];
    this.max = 3;
    this.num = 0;
    this.blocks = [];
    this.init();
};

Field.prototype = {
    init: function(){
        var html = [],
            i, j, len = this.column;
        for (i=0; i<len; i++){
            for (j=0; j<len; j++){
                html.push('<div class="brick"></div>');
            }
        }
        this.parent.html(html.join(''));
        this.bricks = this.parent.find('.brick');
    },
    checkFighter: function(ui,fighter){
        var pos = ui.helper.offset(),
            x, y,
            body = [
                {'left':pos['left'], 'top':pos['top']},
                {'left':pos['left']+BRICK_WIDTH*fighter.w, 'top':pos['top']+BRICK_WIDTH*fighter.h}
            ],
            range = this.getRange();
        if (!(body[0]['left']>range[0]['left']&&body[0]['top']>range[0]['top']&&body[1]['left']<range[1]['left']&&body[1]['top']<range[1]['top'])){
            return;
        }
        //point = [pos['left']-range[0]['left']+fighter.point[0], pos['top']-range[0]['top']+fighter.point[1]];
        x = Math.round((pos['left']-range[0]['left'])/BRICK_WIDTH);
        y = Math.round((pos['top']-range[0]['top'])/BRICK_WIDTH);
        this.parent.find('>.brick-hover').removeClass('brick-hover');
        this.calculateBricks(fighter, x, y);
    },
    calculateBricks: function(fighter, x, y){
        var bricks = this.bricks,
            blocks = this.blocks,
            points = [],
            parts = fighter.parts,
            i, len=parts.length;
        if (blocks.indexOf($(bricks[parseInt(y+''+x)]))!=-1){
        	return;
        }
        for (i=0; i<len; i++){
            points.push([parts[i][0]+x,parts[i][1]+y,(parts[i][2]||0)]);
        }
        fighter.points = points;
        fighter.left = x;
        fighter.top = y;
        this.checkPoints(fighter);
    },
    checkPoints: function(fighter){
    	var i, j, points=fighter.points, len1=points.length, blocks=this.blocks, len2=blocks.length, bricks=this.bricks;
    	for (i=0; i<len1; i++){
    		for (j=0; j<len2; j++){
    			if (points[i][0] == blocks[j][0] && points[i][1] == blocks[j][1]){
    				this.droppable = false;
    				return false;
    			}
    		}
    	}
    	for (i=0; i<len1; i++){
        	$(bricks[parseFloat(points[i][1]+''+points[i][0])]).addClass('brick-hover');
    	}
		this.droppable = true;
		return true;
    },
    addFighter: function(fighter){
        if (this.num>=this.max || !this.droppable){
        	return;
        }
        var l = fighter.left*BRICK_WIDTH,
            t = fighter.top*BRICK_WIDTH,
            cls='fighter-'+fighter.type;
		this.blocks = this.blocks.concat(fighter.points);
        this.parent.append('<div class="fighter '+ cls +'" style="left:'+l+'px;top:'+t+'px;"></div>');
        this.num+=1;
    },
    addFighterShadow: function(fighter){
        this.addFighter(fighter);
        this.parent.find('.fighter').addClass('shadow');
    },
    getRange: function(){
        var offset = this.parent.offset();
        return [
            {'left':offset['left'], 'top':offset['top']},
            {'left':offset['left']+this.parent.width(), 'top':offset['top']+this.parent.height()}
        ];
    },
    showResult: function(data){
        var pos = data.pos,
            index = pos.y=="0"?parseInt(pos.x):parseInt(pos.y+pos.x),
            cls;
        switch(data.state){
            case 1:
                cls = 'brick-attacked';
                break;
            case 2:
                cls = 'brick-killed';
                break;
            default:
                cls = 'brick-attack';
                break;
        }
        $(this.bricks[index]).addClass(cls);
    },
    clear: function(){
    	if (!this.blocks){
    	    return;
    	}
    	this.blocks.length=0;
    	this.num=0;
    	this.parent.find('.fighter').remove();
    }
};

window.Field = Field;
    
});
