
function $(id){
    return document.getElementById(id);
}
function $q(s){
    return document.querySelector(s);
}
function $qa(s){
    return document.querySelectorAll(s);
}

(function(){

var Hall = function(socket){
    this.socket = socket;
    this.nodes = {
        "con": $("hall"),
        "rooms": $("roomList")
    };
};
Hall.prototype = {
    show: function(){
        this.nodes.con.style.display = "block";
    },
    hidden: function(){
        this.nodes.con.style.display = "none";
    },
    rooms: null,
    addRoom: function(id){
        this.rooms[id] = id;
        var li = document.createElement("li");
        li.id = "room"+id;
        li.innerHTML = "<label><input type=\"radio\" value=\"" + id + "\" name=\"rooms\" /><span>" +id + "号房间</span></label>";
        this.nodes.rooms.appendChild(li);
    },
    removeRoom: function(id){
        var node = $("room" + id);
        delete this.rooms[id];
        if (node){
            this.nodes.rooms.removeChild(node);
        }
    },
    setRooms: function(rooms){
        this.rooms = rooms;
        var key, html=[];
        for (key in rooms){
            html.push("<li id=\"room" + key + "\"><label>");
            html.push("<input type=\"radio\" value=\"" + key + "\" name=\"rooms\" />");
            html.push("<span>" + key + "号房间</span>");
            html.push("</li></label>");
        }
        this.nodes.rooms.innerHTML = html.join("");
    }
};

var Room = function(id, owner, socket){
    this.id = id;
    this.owner = owner;
    this.socket = socket;
    this.nodes = {
        "con": $("room"),
        "roomTitle": $("roomTitle"),
        "roles": $("roleList")
    }
};
Room.prototype = {
    show: function(){
        this.nodes.roomTitle.innerHTML = this.id + "号房间成员";
        this.nodes.con.style.display = "block";
    },
    hidden: function(){
        this.nodes.con.style.display = "none";
    },
    add: function(role){
        var id = role["id"];
        var li = document.createElement("li");
        li.id = "role"+id;
        li.innerHTML = "<label><span>" + role["nick"] + "</span></label>";
        this.nodes.roles.appendChild(li);
    },
    remove: function(id){
        var node = $("role" + id);
        if (node){
            this.nodes.roles.removeChild($("role" + id));
        }
    },
    setRoles: function(roles){
        var key, html=[];
        for (key in roles){
            html.push("<li id=\"role" + roles[key]["id"] + "\"><label>");
            html.push("<span>" + roles[key]["nick"] + "</span>");
            html.push("</li></label>");
        }
        this.nodes.roles.innerHTML = html.join("");
    }
};

window.Hall = Hall;
window.Room = Room;
    
})();