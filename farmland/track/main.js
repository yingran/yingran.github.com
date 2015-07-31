(function(){

var role = null;
var hall = null;
var room = null;
var terrain = null;
var nodes = null;


function main(){
    nodes = {
        loading: $("loading"),
        hall: $("hall"),
        roomList: $("roomList"),
        room: $("room"),
        roomTitle: $("roomTitle"),
        roleList: $("roleList"),
        terrainList: $("terrainList"),
        terrain: $("terrain"),
        
        btnCreateRoom: $("btnCreateRoom"),
        btnEnterRoom: $("btnEnterRoom"),
        btnStart: $("btnStart"),
        btnOutRoom: $("btnOutRoom"),
        nickname: $qa(".nickname")
    };
    observer();
    addEvents();
}

function loadRs(fn){
    var key, imgs=resources["textures"], len=0, loadedLen=0;
    for (key in imgs){
        imgs[key]["imgObj"] = new Image();
        imgs[key]["imgObj"].onload = loaded;
        imgs[key]["imgObj"].src = imgs[key]["file"];
        len++;
    }
    
    function loaded(){
        loadedLen++;
        if (len == loadedLen){
            fn();
        }
    }
}


function addEvents(){
    nodes.btnCreateRoom.addEventListener("click", function(){
        nodes.btnCreateRoom.disabled=true;
        nodes.btnEnterRoom.disabled=true;
        role.createRoom();
    });
    nodes.btnEnterRoom.addEventListener("click", function(){
        var node = $q('input[type="radio"][name="rooms"]:checked');
        if (node){
            nodes.btnCreateRoom.disabled=true;
            nodes.btnEnterRoom.disabled=true;
            role.enterRoom(node.value);
        }
    });
    nodes.btnOutRoom.addEventListener("click", function(){
        nodes.btnStart.disabled=true;
        nodes.btnOutRoom.disabled=true;
        role.outRoom(room.id);
    });
    nodes.btnStart.addEventListener("click", function(){
        var node = $q('input[type="radio"][name="terrains"]:checked');
        if (node){
            nodes.btnStart.disabled=true;
            nodes.btnOutRoom.disabled=true;
            role.enterTerrain(node.value);
        }
    });
}

function observer(){
    var socket = io.connect("http://123.57.13.28:8000");
    hall = new Hall(socket);
    socket.on("private", function (data) {
        data = JSON.parse(data);
        switch(data.type){
            case "declare":
                role = new Role({"id":data["id"], "socket":socket});
                role.location = 1;
                room&&room.hidden();
                terrain&&terrain.hidden();
                nodes.nickname[0].innerHTML = "我的昵称：player-"+role.id;
                nodes.nickname[1].innerHTML = "我的昵称：player-"+role.id;
                nodes.loading.style.display="none";
                nodes.btnCreateRoom.disabled=false;
                nodes.btnEnterRoom.disabled=false;
                hall.show();
                break;
            case "enter":
                room = new Room(data["id"], data["owner"], socket);
                role.location = 2;
                hall.hidden();
                if (room.owner == role.id){
                    nodes.btnStart.style.display = "";
                    nodes.terrainList.style.display = "";
                    nodes.btnStart.disabled=false;
                } else {
                    nodes.btnStart.style.display = "none";
                    nodes.terrainList.style.display = "none";
                }
                nodes.btnOutRoom.disabled=false;
                room.show();
                room.setRoles(data["roles"]);
                break;
            case "out":
                role.location = 1;
                room.hidden();
                room = null;
                hall.show();
                nodes.btnCreateRoom.disabled=false;
                nodes.btnEnterRoom.disabled=false;
                break;
            case "error":
                alert(data["msg"]);
                break;
            case "arrive":
                terrain.warn(data["ranking"]);
                break;
        }
    });
    socket.on("hall", function (data) {
        if (role.location != 1){        //不在大厅
            return;
        }
        data = JSON.parse(data);
        switch(data.type){
            case "roomList":
                hall.setRooms(data["list"]);
                break;
            case "declareRoom":
                if (!$("room" + data["id"])){
                    hall.addRoom(data["id"]);
                }
                break;
            case "destroyRoom":
                hall.removeRoom(data["id"]);
                break;
        }
    });

    socket.on("room", function (data) {
        if (role.location != 2){        //不在房间界面
            return;
        }
        data = JSON.parse(data);
        switch(data.type){
            case "add":
                room.add({"id":data["id"], "nick":data["nick"]});
                break;
            case "remove":
                room.remove(data["id"]);
                break;
            case "enterTerrain":
                terrain = new Terrain({"major":role, "boys":data["roles"], "terrid":data["terrid"]});
                room.hidden();
                terrain.show();
                break;
            case "ready":
                terrain.warn(data["readyNumber"]);
                break;
            case "start":
                terrain.start();
                break;
            case "translate":
                terrain.translate(data["pos"]);
                break;
            case "stop":
                terrain.showRanking(data["ranking"]);
                break;
            case "outTerrain":
                terrain.hidden();
                terrain.destory();
                room.show();
                nodes.btnStart.disabled=false;
                nodes.btnOutRoom.disabled=false;
                break;
        }
    });
}

window.addEventListener("load", function(){
    loadRs(main);
},false);
    
})();