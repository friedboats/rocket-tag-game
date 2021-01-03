$(function(){

    gameJSFile = this;

    //game
    var MOVE_UP = "up";
    var MOVE_DOWN = "down";
    var MOVE_RIGHT = "right";
    var MOVE_LEFT = "left";    
    var playerXPositions = [0, 0, 600, 600];
    var playerYPositions = [0, 600, 0, 600];
    var playerNumber;
    var playerSessionId;
    var keyIsDown = {};
    var movingLeft = false;
    var movingRight = false;
    var movingUp = false;
    var movingDown = false;
    var KEY_UP = 38; 
    var KEY_DOWN = 40; 
    var KEY_LEFT = 37; 
    var KEY_RIGHT = 39; 
    var lastFrame = -1;
    var game_ended;
    var iosocket = io.connect();
    var game_timer;
    var rocket_1_timer_var;
    var rocket_2_timer_var;
    var rocket_3_timer_var;
    var rocket_4_timer_var;
    var inTheLead;
    var game_time = 60;


    //set params
    playerHeight = 75;
    playerWidth = 75;
    gameWindowWidth = parseFloat($(".game_window").css('width'));
    gameWindowHeight = parseFloat($(".game_window").css('height'));
    $("#rocket_1_timer .indicator_label").hide();
    $("#rocket_2_timer .indicator_label").hide();
    $("#rocket_3_timer .indicator_label").hide();
    $("#rocket_4_timer .indicator_label").hide();


    //main game timer ------------------
    
    setMainGameTimer();
    //startMainGameTimer();

    //main game countdown timer end
    this.timerEnd = function(){
        //console.log("time is up: "+rocket_1_timer.getTime()+" "+rocket_2_timer.getTime());
        
        iosocket.emit('end_game', inTheLead, rocket_1_timer_var.getTime(), rocket_2_timer_var.getTime(), rocket_3_timer_var.getTime(), rocket_4_timer_var.getTime());

        rocket_1_timer_var.stop();
        rocket_2_timer_var.stop();
        rocket_3_timer_var.stop();
        rocket_4_timer_var.stop();
    }
    
    //set main game countdown timer
    function setMainGameTimer(){
        game_timer = new _timer
        (
            function(time)
            {
                if(time == 0)
                {
                    game_timer.stop();
                    gameJSFile.timerEnd();
                }
            }
        );
        game_timer.timer_class_name("game_timer");
        game_timer.mode(0);
    }


    //start main game countdown timer
    function startMainGameTimer(){
        game_timer.reset(game_time);
        game_timer.start(1000)
    }
   



    //rocket 1 countup timer ------------------
    
    setRocket1TimerTimer();
    //startRocket1TimerTimer();
    
    //set rocket 1 countup timer
    function setRocket1TimerTimer(){
        rocket_1_timer_var = new _timer
        (
            function(time)
            {
                if(time == 0)
                {
                }
            }
        );
        rocket_1_timer_var.timer_class_name("rocket_1_timer");
        rocket_1_timer_var.mode(1);
    }


    //start rocket 1 countup timer
    function startRocket1TimerTimer(){
        //rocket_1_timer_var.reset();
        rocket_1_timer_var.start(1000);
    }
   


    //rocket 2 countup timer ------------------
    
    setRocket2TimerTimer();
    //startRocket2TimerTimer();
    
    //set rocket 2 countup timer
    function setRocket2TimerTimer(){
        rocket_2_timer_var = new _timer
        (
            function(time)
            {
                if(time == 0)
                {
                }
            }
        );
        rocket_2_timer_var.timer_class_name("rocket_2_timer");
        rocket_2_timer_var.mode(1);
    }


    //start rocket 2 countup timer
    function startRocket2TimerTimer(){
        //rocket_2_timer_var.reset();
        rocket_2_timer_var.start(1000);
    }
    
    
    
    //rocket 3 countup timer ------------------
    
    setRocket3TimerTimer();
    //startRocket3TimerTimer();
    
    //set rocket 3 countup timer
    function setRocket3TimerTimer(){
        rocket_3_timer_var = new _timer
        (
            function(time)
            {
                if(time == 0)
                {
                }
            }
        );
        rocket_3_timer_var.timer_class_name("rocket_3_timer");
        rocket_3_timer_var.mode(1);
    }


    //start rocket 3 countup timer
    function startRocket3TimerTimer(){
        //rocket_3_timer_var.reset();
        rocket_3_timer_var.start(1000);
    }


    //rocket 4 countup timer ------------------
    
    setRocket4TimerTimer();
    //startRocket4TimerTimer();
    
    //set rocket 4 countup timer
    function setRocket4TimerTimer(){
        rocket_4_timer_var = new _timer
        (
            function(time)
            {
                if(time == 0)
                {
                }
            }
        );
        rocket_4_timer_var.timer_class_name("rocket_4_timer");
        rocket_4_timer_var.mode(1);
    }


    //start rocket 4 countup timer
    function startRocket4TimerTimer(){
        //rocket_4_timer_var.reset();
        rocket_4_timer_var.start(1000);
    }



    //show end message
    function showEndMsg(p1NumTimesIt, p2NumTimesIt, p3NumTimesIt, p4NumTimesIt, inTheLead, msg, end_img, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time){
        if(!game_ended){
            game_ended = true;
            var endData = {p1NumTimesIt:p1NumTimesIt, p2NumTimesIt:p2NumTimesIt, p3NumTimesIt:p3NumTimesIt, p4NumTimesIt:p4NumTimesIt, inTheLead:inTheLead, msg:msg, end_img:end_img, rocket_1_time:rocket_1_time, rocket_2_time:rocket_2_time, rocket_3_time:rocket_3_time, rocket_4_time:rocket_4_time}
            $("#messageTemplate").tmpl(endData).appendTo( ".message_content" );
            $(".message").css( "display", "block" );
        }
    }
    
    //TODO Test
    var best_time = 0;
    var timer_array = [rocket_1_timer_var, rocket_2_timer_var, rocket_3_timer_var, rocket_4_timer_var];

    //check the player times
    //TODO fix leader time
    function checkTime(){        
        
        timer_array.forEach(function(value, index, array){
            var cur_rocket_num = index+1;
            var cur_rocket_timer = value;
            var cur_rocket_timer_time = cur_rocket_timer.getTime();
            
            //console.log(cur_rocket_timer_time);
            
            //reset and hide all 'leader' text
            //$("#rocket_"+ cur_rocket_num +"_timer .indicator_label").hide();
                        
            //console.log("getLargestValue:");                       
            //console.log(getLargestValue(timer_array));
            
            //check best time
            if(cur_rocket_timer_time > best_time){
                //set best time to rocket in the lead
                best_time = cur_rocket_timer_time;

                //show 'leader' text
                //$("#rocket_"+ cur_rocket_num +"_timer .indicator_label").show();
                
                //set cur rocket to leader
                inTheLead = cur_rocket_num;
            }else{
                inTheLead = 0;
            }
        });
        
        
        //loop over all rockets
/*
        for(var i=1; i<=4; i++){
            var cur_rocket_num = i;
            console.log("cur_rocket_num: "+cur_rocket_num);
            var cur_rocket_timer = this['rocket_'+ cur_rocket_num +'_timer_var'];
            console.log(cur_rocket_timer);
            console.log("cur_rocket_timer: "+cur_rocket_timer[0]);
            var cur_rocket_timer_time = cur_rocket_timer[0].getTime();
            
            //reset and hide all 'leader' text
            $("#rocket_"+ cur_rocket_num +"_timer .indicator_label").hide();
            
            //check best time
            if(cur_rocket_timer_time > best_time){
                //set best time to rocket in the lead
                best_time = cur_rocket_timer_time;

                //show 'leader' text
                $("#rocket_"+ cur_rocket_num +"_timer .indicator_label").show();
                
                //set cur rocket to leader
                inTheLead = cur_rocket_num;
            }else{
                inTheLead = 0;
            }
            
        }
*/
    
/*
        if(rocket_2_timer_var.getTime() > rocket_1_timer_var.getTime()){
            $("#rocket_1_timer_var .indicator_label").hide();
            $("#rocket_2_timer_var .indicator_label").show();
            console.log("");
            inTheLead = 2;
        }
        else if(rocket_2_timer_var.getTime() < rocket_1_timer_var.getTime()){
            $("#rocket_2_timer_var .indicator_label").hide();
            $("#rocket_1_timer_var .indicator_label").show();
            inTheLead = 1;
        }
        else{
            $("#rocket_2_timer_var .indicator_label").hide();
            $("#rocket_1_timer_var .indicator_label").hide();
            inTheLead = 0;
        }
*/

    }//TODO Test


    function getLargestValue(array){
        
        array.sort();
        var largest = array[0];
        
        for (var i = 0; i < array.length; i++) {
            if (largest < array[i] ) {
                largest = array[i];
            }
        }
        
        return largest;
        ///
        
        
/*
        array.sort();
        
        for ( var i = 1; i < array.length; i++ ){
            if(array[i-1] == array[i])
                return false;
        }
        
        return true;
*/
        
    }

    //socket
    iosocket.on('connect', function (client) {

        //show first text as connected for a player
        $('#incomingChatMessages').append($('<li>Connected...</li></br>'));


        //*** session start ***
        iosocket.on('session_start', function() {
            startMainGameTimer();
        });


        //*** chat message ***
        iosocket.on('message', function(message, playerNum) {
            //if 0 then a message sent from game, not from player
            if(playerNum == '0')
                $('#incomingChatMessages')
                    .append($('<li></li>')
                        .css("color", '#cccccc')
                            .text(message));
            else
                $('#incomingChatMessages').append($('<li></li>').text("P"+playerNum+": "+message));

            updateChatWindowPos();
        });


        //*** player moved ***
        iosocket.on('move', function(direction, player) {
            updatePlayerPosition(direction, player);
        });


        //*** sets a player as "it" ***
        iosocket.on('make_it', function(isIt) {
            console.log("MAKE IT!" +isIt);
            
            $('#rocket_1').css("background", 'none');
            $('#rocket_2').css("background", 'none');
            $('#rocket_3').css("background", 'none');
            $('#rocket_4').css("background", 'none');
            
            $('#rocket_'+isIt).css("background-color","yellow");


            if(isIt == "1"){
                rocket_1_timer_var.stop(1000);
                rocket_2_timer_var.start(1000);
                rocket_3_timer_var.start(1000);
                rocket_4_timer_var.start(1000);
            }
            else if(isIt == "2"){
                rocket_1_timer_var.start(1000);
                rocket_2_timer_var.stop(1000);
                rocket_3_timer_var.start(1000);
                rocket_4_timer_var.start(1000);
            }
            else if(isIt == "3"){
                rocket_1_timer_var.start(1000);
                rocket_2_timer_var.start(1000);
                rocket_3_timer_var.stop(1000);
                rocket_4_timer_var.start(1000);
            }
            else if(isIt == "4"){
                rocket_1_timer_var.start(1000);
                rocket_2_timer_var.start(1000);
                rocket_3_timer_var.start(1000);
                rocket_4_timer_var.stop(1000);
            }
            else{
                rocket_1_timer_var.stop(1000);
                rocket_2_timer_var.stop(1000);
                rocket_3_timer_var.stop(1000);
                rocket_4_timer_var.stop(1000);
            }
        });


        //*** triggers a player action ***
        iosocket.on('player_action', function(playerAction) {
            $('#incomingChatMessages').append($('<li></li>').text(playerAction));
        });


        //*** player has been added ***
        iosocket.on('player_added', function(playerInfo) {
            //this is so you only get your info and not player 2 for example
            if(iosocket.socket.sessionid == playerInfo.id){
                playerNumber = playerInfo.playerNum;
                playerSessionId = playerInfo.id;

                //reset
                iosocket.emit('position_update', playerYPositions[playerNumber-1], playerXPositions[playerNumber-1]);
            }
        });

        //*** triggers when the end message is to show up ***
        iosocket.on('show_end_msg', function(p1NumTimesIt, p2NumTimesIt, p3NumTimesIt, p4NumTimesIt, inTheLead, msg, end_img, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time) {
            showEndMsg(p1NumTimesIt, p2NumTimesIt, p3NumTimesIt, p4NumTimesIt, inTheLead, msg, end_img, rocket_1_time, rocket_2_time, rocket_3_time, rocket_4_time);
        });
       
        //*** triggers when the player is disconnected ***
        iosocket.on('disconnect', function() {
            $('#incomingChatMessages').append('<li>Disconnected...</li>');
        });
    });


    //chat
    $('#outgoingChatMessage').keypress(function(e) {
        
        //store key codes
        var enterKey = (e.keyCode == 13)

        if(enterKey) {           
            e.preventDefault();

            //send chat to app.js
            var msg = $('#outgoingChatMessage').val();
            iosocket.emit('message', msg, playerNumber);

            //display message in this users chat window
            $('#incomingChatMessages')
                .append($('<li></li>').css("color", "#39baec")
                    .text("P"+playerNumber+": "+$('#outgoingChatMessage')
                        .val()));

            updateChatWindowPos();    

            //clear input field
            $('#outgoingChatMessage').val('');
        }
    });


    //game
    $(document).keydown(function(e) {
        
        keyIsDown["k"+e.keyCode] = true;

        //store key codes
        var upArrow = (e.keyCode == KEY_UP), 
            downArrow = (e.keyCode == KEY_DOWN), 
            leftArrow = (e.keyCode == KEY_LEFT), 
            rightArrow = (e.keyCode == KEY_RIGHT);
       

        //only when these keys are hit
        //if (upArrow || downArrow || spaceBar) {
        if (upArrow || downArrow || leftArrow || rightArrow) {
            e.preventDefault();

            //check what key was clicked
            if(upArrow){
                movingUp = true;
                movingDown = false;
            }
            else if(downArrow){
                movingUp = false;
                movingDown = true;
            }
            else if(leftArrow){
                movingLeft = true;
                movingRight = false;
            }
            else if(rightArrow){
                movingLeft = false;
                movingRight = true;
            }
            /*else if(spaceBar){
                iosocket.emit('player_action', "fire");

                //display message in this users chat window
                $('#incomingChatMessages')
                    .append( $('<li></li>').text('fire') );    
            }*/
        }
    });

    $(document).keyup(function(e) {
        keyIsDown["k"+e.keyCode] = false;

        //store key codes
        var upArrow = (e.keyCode == KEY_UP), 
            downArrow = (e.keyCode == KEY_DOWN), 
            leftArrow = (e.keyCode == KEY_LEFT), 
            rightArrow = (e.keyCode == KEY_RIGHT);

        if(upArrow){
            movingUp = false;

            if(keyIsDown["k"+KEY_DOWN]){
                movingDown = true;
            }
        }
        else if(downArrow){
            movingDown = false;

            if(keyIsDown["k"+KEY_UP]){
                movingUp = true;
            }
        }
        else if(leftArrow){
            movingLeft = false;
            
            if(keyIsDown["k"+KEY_RIGHT]){
                movingRight = true;
            }
        }
        else if(rightArrow){
            movingRight = false;
            
            if(keyIsDown["k"+KEY_LEFT]){
                movingLeft = true;
            }
        }
    });

    //start enter frame timer
    setInterval(runFunc, 100);

    //enter frame
    function runFunc(){
        checkTime();
        
        //console.log("runFunc");

        /*var frameTime,
            nowTime = $.now();

        if(lastFrame == -1){
            lastFrame = nowTime;
        }

        //move player
        frameTime = nowTime - lastFrame;

        lastFrame = nowTime;*/

        var direction = "";

        //check what key was clicked
        if(movingUp){
            direction += MOVE_UP;
        }
        
        if(movingDown){
            direction += MOVE_DOWN;
        }
        
        if(movingLeft){
            direction += MOVE_LEFT;
        }
        
        if(movingRight){
            direction += MOVE_RIGHT;
        }
        
        //console.log("direction:");
        //console.log(direction);
        
        //console.log("playerNumber:");
        //console.log(playerNumber);
        
        
        /*if(spaceBar){
            iosocket.emit('player_action', "fire");

            //display message in this users chat window
            $('#incomingChatMessages')
                .append( $('<li></li>').text('fire') );   
        }*/ 

        if(direction){
            updatePlayerPosition(direction, playerNumber);
            iosocket.emit('move', direction);
            iosocket.emit('position_update', playerYPositions[playerNumber-1], playerXPositions[playerNumber-1]);
        }
    }


    //updates the players position
    function updatePlayerPosition(direction, player){
        if(direction == 'up'){
            playerYPositions[player-1] -= playerHeight;
            rotatePlayer(-90, '#rocket_'+player);
        }
        else if(direction == 'down'){
            playerYPositions[player-1] += playerHeight;
            rotatePlayer(90, '#rocket_'+player);
        }
        else if(direction == 'left'){
            playerXPositions[player-1] -= playerWidth;
            rotatePlayer(-180, '#rocket_'+player);
        }
        else if(direction == 'right'){            
            playerXPositions[player-1] += playerWidth;
            rotatePlayer(0, '#rocket_'+player);
        }
        else if(direction == 'upright'){
            playerXPositions[player-1] += playerWidth;
            playerYPositions[player-1] -= playerHeight;
            rotatePlayer(315, '#rocket_'+player);
        }
        else if(direction == 'upleft'){
            playerXPositions[player-1] -= playerWidth;
            playerYPositions[player-1] -= playerHeight;
            rotatePlayer(225, '#rocket_'+player);
        }
        else if(direction == 'downright'){
            playerXPositions[player-1] += playerWidth;
            playerYPositions[player-1] += playerHeight;
            rotatePlayer(45, '#rocket_'+player);
        }
        else if(direction == 'downleft'){
            playerXPositions[player-1] -= playerWidth;
            playerYPositions[player-1] += playerHeight;
            rotatePlayer(135, '#rocket_'+player);
        }

        if(playerXPositions[player-1] > gameWindowWidth-playerWidth){
            playerXPositions[player-1] = gameWindowWidth-playerWidth;
        }
        
        if(playerXPositions[player-1] < 0){
            playerXPositions[player-1] = 0;
        }
        
        if(playerYPositions[player-1] > gameWindowHeight-playerHeight){
            playerYPositions[player-1] = gameWindowHeight-playerHeight;
        }
        
        if(playerYPositions[player-1] < 0){
            playerYPositions[player-1] = 0;
        }

        $("#rocket_"+player).css({"top":playerYPositions[player-1], "left":playerXPositions[player-1]});
        //console.log($("#rocket_"+player));
        //console.log(playerYPositions[player-1]);
        //console.log(playerXPositions[player-1]);
        

        
    }

    //rotates the player
    function rotatePlayer(degree, player) {
        $(player).css({
                    '-webkit-transform': 'rotate(' + degree + 'deg)',
                    '-moz-transform': 'rotate(' + degree + 'deg)',
                    '-ms-transform': 'rotate(' + degree + 'deg)',
                    '-o-transform': 'rotate(' + degree + 'deg)',
                    'transform': 'rotate(' + degree + 'deg)',
                    'zoom': 1
        });
    }

    //update the caht window position to stay on the bottom
    function updateChatWindowPos(){
        var curHeight = $('#incomingChatMessages').prop('scrollHeight');
        $('.chat_window').scrollTop(curHeight);
    }
});