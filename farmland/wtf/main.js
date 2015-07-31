$(document).ready(function(){

    var SERVER = 'http://123.57.13.28:8001';

    var nodes = {
        fighter: $('.fighter-icon'),
        field1: $('#my-field'),
        field2: $('#enemy-field'),
        userPanel: $('#user-panel'),
        hallPanel: $('#hall-panel'),
        gamePanel: $('#game-panel'),
        nick: $('#user-nick'),
        info: $('#info')
    };
    var field1 = new Field({
            parent: $('#my-field')
        });
    var field2 = new Field({
            parent: $('#enemy-field')
        });
    var fighter = new Fighter(),
        hall, p1,
        socket;
    
    function main(){
        addEvents();
        observer();
    }
    
    function rotateFightIcon(node, ori){
        node.css({
            'transform': 'rotate(' + ori*90 + 'deg)',
            '-webkit-transform': 'rotate(' + ori*90 + 'deg)'
        }).data('ori', ori%4);
    }
    
    function checkUser(){
        if (localStorage.id && localStorage.nick){
            socket.emit('create-user', JSON.stringify({'id':localStorage.id, 'nick':localStorage.nick}));
        } else {
            nodes.userPanel.show();
        }
    }
    
    function createUser(){
        var id = (new Date()).getTime().toString() + '-' + parseInt(Math.random()*100),
            nick = nodes.nick.val();
        if (!nick){
            alert('请输入昵称！');
            return;
        }
        localStorage.id = id;
        localStorage.nick = nick;
        socket.emit('create-user', JSON.stringify({'id':id, 'nick':nick}));
    }
    
    function observer(){
    	socket = io.connect(SERVER);
    	hall = new Hall(socket);
    	socket.on('connect', function(){
            checkUser();
    	});
	    socket.on('private', function (data) {
            data = JSON.parse(data);
            switch(data.type){
                case 'declare':
                    p1 = new Player({"id":data["id"], "socket":socket});
                    p1.location = 1;
                    hall.goHall();
                    break;
                case 'player-list':
                    hall.setList(data.list, socket);
                    break;
                case 'go-field':
                    hall.goField();
                    $('#enemy-nick').html(data['enemy']);
                    break;
                case 'attack-result':
                    field2.showResult(data);
                    break;
                case 'win':
                    p1.win();
                    alert('你胜利了！');
                    break;
                case 'fail':
                    p1.fail();
                    alert('你失败了！');
                    break;
                case 'be-attacked':
                    field1.showResult({'status':0, 'pos':data.pos});
                    p1.beAttacked();
                    break;
                case 'draw':
                    p1.draw();
                    alert('平局！');
                    break;
            }
        });
    	
        socket.on('hall', function (data) {
            data = JSON.parse(data);
            switch(data.type){
                case 'player-list':
                    hall.setList(data.list);
                    break;
                case 'declare':
                    if (hall.location==1&&data['id']!=p1.id){
                        hall.addPlayer(data, socket);
                    }
                    break;
                case 'leave':
                    if (hall.location==1&&data['id']!=p1.id){
                        hall.removePlayer(data);
                    }
                    break;
            }
        });
        
        socket.on('room', function (data) {
            data = JSON.parse(data);
            switch(data.type){
                case 'start-fight':
                    nodes.field1.animate({
                        'left': 600
                    });
                    nodes.field2.animate({
                        'left': 0
                    });
                    $('#clear-shadow-btn').show();
                    if (p1.id == data['turn']){
                        p1.getTurn();
                    }
                    break;
                case 'change-turn':
                    if (data['turn'] == p1.id){
                        p1.getTurn();
                    } else {
                        p1.loseTurn();
                    }
                    break;
            }
        });
    }
    
    function addEvents(){
        $('.rotate-left').click(function(){
            var node = $(this).parent().find('.fighter-icon'),
                ori = (node.data('ori')||4000)-1;
            rotateFightIcon(node, ori);
        });
        $('.rotate-right').click(function(){
            var node = $(this).parent().find('.fighter-icon'),
                ori = (node.data('ori')||0)+1;
            rotateFightIcon(node, ori);
        });
        $('#ready-btn').click(function(){
            if (field1.max == field1.num){
                p1.ready(field1.blocks);
                $('#ready-btn').hide();
                $('#clear-btn').hide();
            }
        });
        $('#create-user').click(function(){
            createUser();
        });
        $('#clear-btn').click(function(){
        	field1.clear();
        });
        $('#clear-shadow-btn').click(function(){
            field2.clear();
        });
        nodes.fighter.draggable({revert: 'invalid', helper: "clone"});
        nodes.field1.droppable({
            accept:nodes.fighter,
            activate: function(evt, ui){
                fighter.setType(ui.draggable.attr('fighter-type')+(ui.draggable.data('ori')||0));
            },
            over: function(evt, ui){
                nodes.field1.bind('mousemove', function(){
                    field1.checkFighter(ui, fighter);
                });
            },
            deactivate: function(evt, ui){
                $(field1.bricks).removeClass('brick-hover');
            },
            out: function(evt, ui){
                nodes.field1.unbind('mousemove');
            },
            drop: function(evt, ui){
                field1.addFighter(fighter);
                $(field1.bricks).removeClass('brick-hover');
            }
        });
        nodes.field2.droppable({
            accept:nodes.fighter,
            activate: function(evt, ui){
                fighter.setType(ui.draggable.attr('fighter-type')+(ui.draggable.data('ori')||0));
                ui.helper.css('opacity', '0.5');
            },
            over: function(evt, ui){
                nodes.field2.bind('mousemove', function(){
                    field2.checkFighter(ui, fighter);
                });
            },
            deactivate: function(evt, ui){
                $(field2.bricks).removeClass('brick-hover');
            },
            out: function(evt, ui){
                nodes.field2.unbind('mousemove');
            },
            drop: function(evt, ui){
                field2.addFighterShadow(fighter);
                $(field2.bricks).removeClass('brick-hover');
            }
        });
        $(field2.bricks).each(function(index, elem){
            var pos = index.toString().split('');
            if(!pos[1]){
                pos[1] = pos[0];
                pos[0] = 0;
            }
            $(elem).click(function(){
                p1.attack({'x':pos[1], 'y':pos[0]});
            });
        });
    }
    
    main();
});
