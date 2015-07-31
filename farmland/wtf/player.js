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
        nodes.info.html('');
    },
    beAttacked: function(){
        this.turn = true;
        nodes.info.html('轮到你了！');
    },
    win: function(){
        this.result = 1;
    },
    fail: function(){
        this.result = 2;
    },
    draw: function(){
        this.result = 3;
    }
};

window.Player = Player;
    
});
