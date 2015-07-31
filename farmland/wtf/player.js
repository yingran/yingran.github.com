$(document).ready(function(){

var nodes={
    info: $('#info')
};
    
var Player = function(opts){
    opts = opts || {};
    this.id = opts.id;
    this.socket = opts.socket;
    this.result = 0;
    this.location = 0;      //0为默认，1为大厅，2为房间
    this.timeCount = 0;
};

Player.prototype = {
    ready: function(blocks, socket){
        var data = JSON.stringify({'blocks':blocks});
        this.result = 0;
        this.socket.emit('ready',data);
    },
    attack: function(pos){
        if (!this.turn || this.result){
            return;
        }
        var data = JSON.stringify({'pos':pos});
        this.socket.emit('attack',data);
        this.turn = false;
        this.clearDownTimer();
        nodes.info.html('');
    },
    beAttacked: function(){
        this.getTurn();
    },
    win: function(){
        this.result = 1;
    },
    fail: function(){
        this.result = 2;
    },
    draw: function(){
        this.result = 3;
    },
    getTurn: function(){
        this.turn = true;
        this.timeCount = 25;
        nodes.info.html('轮到你了！');
        this.downCheck();
    },
    loseTurn: function(){
        this.turn = false;
        nodes.info.html('你失去了本次攻击机会');
    },
    downTimer: null,
    downCheck: function(){
        var self = this;
        self.downTimer = setInterval(function(){
            nodes.info.html('倒计时：'+self.timeCount+'秒');
            self.timeCount--;
            if (self.timeCount<1){
                clearInterval(self.downTimer);
            }
        },1000);
    },
    clearDownTimer: function(){
        clearInterval(this.downTimer);
    }
};

window.Player = Player;
    
});
