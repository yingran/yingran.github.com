(function(){

var Role = function(opts){
    opts = opts || {};
    this.id = opts.id;
    this.socket = opts.socket;
    this.location = 0;      //0为默认，1为大厅，2为房间，3为赛场
}
Role.prototype = {
    setNick: function(){
        
    },
    createRoom: function(){
        var data = JSON.stringify({});
        this.socket.emit("createRoom",data);
    },
    enterRoom: function(roomId){
        var data = JSON.stringify({"roomId": roomId});
        this.socket.emit("enterRoom",data);
    },
    outRoom: function(){
        var data = JSON.stringify({});
        this.socket.emit("outRoom",data);
    },
    enterTerrain: function(terrid){
        var terrain = resources["terrain"][terrid],
            data = JSON.stringify({"terrid":terrid, "origin": terrain["origin"], "terminal":terrain["terminal"]});
        this.socket.emit("enterTerrain",data);
    }
};

window.Role = Role;
})();