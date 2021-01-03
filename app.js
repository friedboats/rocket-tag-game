var fs = require('fs')
  , http = require('http')
  , socketio = require('socket.io');

var express = require('express');
var app = express();

app.use(express.static(__dirname))
 
var server = http.createServer(app).listen(8080, function() {
    console.log('- - - Listening at: http://localhost:8080 - - -');
});

var player1 = "",
    player2 = "",
    player3 = "",
    player4 = "";
    
var canTag = true;
    
    
var cur_isIt_pos;    
    
var all_players_pos = [];

var p1Pos = {top:0, left:0};    
var p2Pos = {top:600, left:0};
var p3Pos = {top:0, left:600};
var p4Pos = {top:600, left:600};

var p1NumTimesIt = 0;
var p2NumTimesIt = 0;
var p3NumTimesIt = 0;
var p4NumTimesIt = 0;

var isIt = Math.floor(Math.random() * 2) + 1;
console.log("------------------- VERSION 1 ----------------------------")


console.log("-------------------isIt:")
console.log(isIt)


socketio.listen(server).on('connection', function (socket) {
    
    console.log("********* CONNECTION OPENED *********");

    //socket.set('log level', 1);

    var playerInfo;

    //if player not set, then set
    if(!player1){
        player1 = socket;
        playerInfo = {id:player1.id, playerNum:'1'};
        console.log("Player 1 socket opened: "+playerInfo.id);
        socket.emit('player_added', playerInfo);
        socket.broadcast.emit('player_added', playerInfo);
    }
    else if(!player2){
        player2 = socket;
        playerInfo = {id:player2.id, playerNum:'2'};
        console.log("Player 2 socket opened: "+playerInfo.id);
        socket.emit('player_added', playerInfo);
        socket.broadcast.emit('player_added', playerInfo);
    }
    else if(!player3){
        player3 = socket;
        playerInfo = {id:player3.id, playerNum:'3'};
        console.log("Player 3 socket opened: "+playerInfo.id);
        socket.emit('player_added', playerInfo);
        socket.broadcast.emit('player_added', playerInfo);
    }
    else if(!player4){
        player4 = socket;
        playerInfo = {id:player4.id, playerNum:'4'};
        console.log("Player 4 socket opened: "+playerInfo.id);
        socket.emit('player_added', playerInfo);
        socket.broadcast.emit('player_added', playerInfo);
    }
    else{
        //if more people trying to join than allowed, kick them out
        socket.disconnect();
        console.log("Extra player disconnected: "+socket.id);
    }

    //mark player who is it first
    if(player1 && player2 && player3 && player4){
        socket.emit('session_start');
        socket.broadcast.emit('session_start');

        socket.emit('make_it', isIt);
        socket.broadcast.emit('make_it', isIt);

        socket.emit('message', 'Player '+isIt+' is it!', '0');

        //track numbner of times a user is it (this is off the bat)
        if(isIt == "1"){
            ++p1NumTimesIt;
        }
        else if(isIt == "2"){
            ++p2NumTimesIt;
        }
        else if(isIt == "3"){
            ++p3NumTimesIt;
        }
        else if(isIt == "4"){
            ++p4NumTimesIt;
        }
    }

    //listen for messages coming in from the chat
    socket.on('message', function (msg, playerNumber) {
        //console.log('Message Received: ', msg, playerNumber);
        socket.broadcast.emit('message', msg, playerNumber);
    });

    //listen for a players move
    socket.on('move', function (movePos) {
        //console.log('Move Received: ', movePos, playerInfo.playerNum);
        socket.broadcast.emit('move', movePos, playerInfo.playerNum);
    });


  

    //listen for a position update
    socket.on('position_update', function (top, left) {
        //console.log('Position Received: ', top, left, playerInfo.playerNum);

        if(playerInfo.playerNum == "1"){
            p1Pos.top = top;
            p1Pos.left = left;
        }
        else if(playerInfo.playerNum == "2"){
            p2Pos.top = top;
            p2Pos.left = left;
        }
        else if(playerInfo.playerNum == "3"){
            p3Pos.top = top;
            p3Pos.left = left;
        }
        else if(playerInfo.playerNum == "4"){
            p4Pos.top = top;
            p4Pos.left = left;
        }
        
        //TODO Test - Need to fix so that we don't need the setTimeout - something to do with the for loop        
        all_players_pos = [p1Pos, p2Pos, p3Pos, p4Pos];
        
        all_players_pos.forEach(function(value, index, array){
            var cur_rocket_num = index+1;
            
            //console.log("===================");
            //console.log(array);
            
            //console.log(isIt)
            
            //check who's it
            cur_isIt_pos = array[isIt-1];  
            //console.log("cur_isIt_pos:"); 
            //console.log(cur_isIt_pos);
            
            //console.log("value:"); 
            //console.log(value);  
            //console.log("first:"+isIt);
            //make sure isIt num is not the same as the cur_rocket_num
            if(isIt != cur_rocket_num){
                
                if(cur_isIt_pos.top == value.top && cur_isIt_pos.left == value.left && canTag){
                    canTag = false;
                    console.log("-------------------GADZOOKS!");
                    isIt = cur_rocket_num;
                    console.log("second:"+isIt);
                    
                    setTimeout(function(){canTag = true;}, 500);
                }
            }
            console.log("running");
                        
            socket.emit('make_it', isIt);
            socket.broadcast.emit('make_it', isIt);
            
            socket.emit('message', 'Player '+isIt+' is it!', '0');
            socket.broadcast.emit('message', 'Player '+isIt+' is it!', '0');

            //console.log(cur_isIt_pos.top, value.top, cur_isIt_pos.left, value.top)
            
        });
        
        
        
        
        
        
        //loop over all rockets
/*DELETE
        for(var i=1; i<=4; i++){

            var cur_rocket_num = i;
            var cur_play_pos = this['p'+ cur_rocket_num +'Pos'];
            var is_it_play_pos = this['p'+ isIt +'Pos'];
            
            console.log("cur_play_pos: "+cur_play_pos);
            console.log("is_it_play_pos: "+is_it_play_pos);
            
            //if the cur rocket is it, then do nothing
            if(isIt == cur_rocket_num){
                return;
            }else{
                //if isIt tagged someone then make that rocket it
                if(is_it_play_pos.top == cur_play_pos.top && is_it_play_pos.left == cur_play_pos.left){
                    isIt = cur_rocket_num;
                }
                
                socket.emit('make_it', isIt);
                socket.broadcast.emit('make_it', isIt);
                
                socket.emit('message', 'Player '+isIt+' is it!', '0');
                socket.broadcast.emit('message', 'Player '+isIt+' is it!', '0');
            }
            
        }
DELETE*/
        
/*
        if(p1Pos.top == p2Pos.top && p1Pos.left == p2Pos.left){
            if(isIt == "1"){
                isIt = "2";
                ++p2NumTimesIt;
            }
            else if(isIt == "2"){
                isIt = "1";
                ++p1NumTimesIt;
            }

            socket.emit('make_it', isIt);
            socket.broadcast.emit('make_it', isIt);
            
            socket.emit('message', 'Player '+isIt+' is it!', '0');
            socket.broadcast.emit('message', 'Player '+isIt+' is it!', '0');
        }
*/
    });//TODO Test

    //listen for a players action
    socket.on('player_action', function (playerAction) {
        //console.log('Player Action Received: ', playerAction);
        socket.broadcast.emit('player_action', playerAction);
    });
    
    //listen for end game
    socket.on('end_game', function (inTheLead, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time) {
        //console.log('End Game');

        var msg;
        var end_img;

        //console.log("typeof: "+typeof(inTheLead))

        //console.log("!!!!!!!!!!!!!! BEFORE "+inTheLead, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time);
        //console.log(p1NumTimesIt, p1NumTimesIt);

        //deternime the winner
        if(inTheLead == 1){
            end_img = "images/rocket_ship_red_lrg.png";
        }
        else if(inTheLead == 2){
            end_img = "images/rocket_ship_pink_lrg.png";
        }
        else if(inTheLead == 3){
            end_img = "images/rocket_ship_orange_lrg.png";
        }
        else if(inTheLead == 4){
            end_img = "images/rocket_ship_yellow_lrg.png";
        }
        else{
            //console.log("TIE")
            inTheLead = 0;
            end_img = "images/tie.png";
        }

        if(inTheLead != 0)
            msg = "And the winner is... player "+inTheLead+"!";
        else
            msg = "I can't believe it, you tied!";

        //console.log(end_img);

        //console.log("!!!!!!!!!!!!!! AFTER "+inTheLead, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time);
        socket.emit('show_end_msg', p1NumTimesIt, p2NumTimesIt, inTheLead, msg, end_img, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time);
    });

    //listen for a disconnect
    socket.on('disconnect', function () {
        console.log('********* CONNECTION CLOSED *********');

        //check if a player dropped off and clear their namespace
        if(player1 == socket){
            console.log("Player 1 socket closed: "+player1.id);
            player1 = "";
        }
        else if(player2 == socket){   
            console.log("Player 2 socket closed: "+player2.id);
            player2 = "";
        }
        else if(player3 == socket){   
            console.log("Player 3 socket closed: "+player3.id);
            player3 = "";
        }
        else if(player4 == socket){   
            console.log("Player 4 socket closed: "+player4.id);
            player4 = "";
        }
    });
});