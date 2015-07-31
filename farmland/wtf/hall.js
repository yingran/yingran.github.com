$(document).ready(function(){

var nodes = {
    userPanel: $('#user-panel'),
    hallPanel: $('#hall-panel'),
    gamePanel: $('#game-panel')
};

var Hall = function(opts){
    this.location = 0;
};

Hall.prototype = {
    setList: function(list, socket){
        var html=[], key,
            self = this;
        for (key in list){
            html.push('<div class="player" player-id="' + key + '">' + list[key]['nick'] + '</div>');
        }
        $('#player-list').html(html.join('')).find('.player').click(function(){
            self.challenge($(this).attr('player-id'), socket);
        });
    },
    challenge: function(id, socket){
        var data = JSON.stringify({'enemy': id});
        socket.emit('challenge', data);
    },
    goField: function(id){
        nodes.hallPanel.hide();
        nodes.gamePanel.show();
        this.location = 2;
    },
    goHall: function(){
        nodes.userPanel.hide();
        nodes.hallPanel.show();
        this.location = 1;
    },
    addPlayer: function(data, socket){
        var node = $('#player-list div[player-id="' + data['id'] + '"]'),
            self = this;
        if (node.length==0){
            $('<div class="player" player-id="' + data['id'] + '">' + data['nick'] + '</div>')
                .appendTo('#player-list')
                .click(function(){
                    self.challenge($(this).attr('player-id'), socket);
                });
        }
    },
    removePlayer: function(data){
        var node = $('#player-list div[player-id="' + data['id'] + '"]');
        if (node.length>0){
            node.remove();
        }
    }
};

window.Hall = Hall;
    
});
