var dialog = null;
var parentObj = null;
var currentAgentType = "system";
var characterGender = {
    "waiter" : "male",
    "customer" : "female"
};

var unique = (value, index, self) => {
    return self.indexOf(value) === index
}

var points = 0;
var treeData = null;
var gameLevel = 1;

const msg = new SpeechSynthesisUtterance();
var playerVoice, npcVoice = null;

$(document).ready(function(){
    
    positionGameCharacter("customer", 50);
    positionGameCharacter("waiter", 50);

    getAgentVoices();   

    // console.log(playerVoice);
    
    $(document).keydown(function(e){
        $("#speechBubble").css({
            "visibility" : "hidden",
            "display" : "none"
        });
        $player = $("#customer");
        var pos = parseInt($player.css("left").replace("px", ""));
        
        switch(e.keyCode){
            case 37: // left
                pos-=5;
                $player.css({
                    "left": pos+"px",
                    "-webkit-transform" : "scaleX(-1)",
                    "transform" : "scaleX(-1)"
                });
                break;
            case 38: // up
                break;
            case 39: // right
                pos+=5;
                $player.css({
                    "left": pos+"px",
                    "-webkit-transform" : "scaleX(1)",
                    "transform" : "scaleX(1)"
                });
                break;
            case 40: // down
                break;
        }
    });
    
    $("#speechBubble").css({
        "visibility" : "hidden",
        "display" : "none"
    });

    // var url = "data/conversation.json";
    var url = "rest/statements.php?parentID=";
    $.get(url, function(data){
        if(data){
            next(data.statements[0]);
            // console.log(data);
            
        
            
            
        }
    });
});

function next(d){
    // console.log(d);
    // console.log("called");
    $("#speechBubble").empty();
    if(d){
        var isCorrect = parseInt(d.isCorrect);
        if(isCorrect == 0){
            // points --;
            alert("Incorrect choice");
        }
        else{
            // points++;
        }
    }

    var url = "rest/statements.php?parentID=" + d.name;
    
    $.get(url, function(data){

        // console.log(data);
        // console.log(data.statements);
        if(data.statements.length != 0){
            var statements = shuffle(data.statements);
            // console.log(statements); 
            if(gameLevel == 2 && statements[0].agentType == 'player'){
                $agent = $("#" + statements[0].agentName);
                $q = $("<input />");
                $q.attr("type", "text");
                $q.attr("id", "question");
                $q.attr("class", "question");
                $q.data(statements);
                    
                $("#speechBubble").css({
                     "visibility" : "visible",
                    "display" : "block",
                    "left": $agent.css("left"),
                    "top":  calculatePositioningOffset($agent.css("top"), -150)
                });
                $q.blur(validateInput);

                $("#speechBubble").append($q);
                
            }
            else{
                for(var i = 0; i<statements.length; i++){
                    // console.log(data.statements[i]);
                    
                    
                    if(statements[i].agentType == 'npc'){
                        // setTimeout(next, 5000);
                    }

                    
                    
                    $agent = $("#" + statements[i].agentName);
                    
                    
                    $div = $("<button></button>");
                    $div.attr("class", "statement");
                    $div.data(statements[i]);
                    $div.html("&rarr; " + statements[i].statementText);
                    
                    
                    $("#speechBubble").css({
                        "visibility" : "visible",
                        "display" : "block",
                        "left": $agent.css("left"),
                        "top":  calculatePositioningOffset($agent.css("top"), -150)
                    });
                    $div.click(speechBubbleSelector);
                    // $div.mouseover(playAudio);

                    $("#speechBubble").append($div);
                    $("#speechBubble").append($("<br />"));
                        
                    
                } // end of loop
            }
        } // end of check for empty statements array
		
    });
    
    
    
}

function validateInput(){
    var d = $(this).data();
    console.log(d);
}
function speechBubbleSelector(){
    var d = $(this).data();
    
    msg.text = d.statementText;
   
    if(d.agentType == "player"){
        msg.voice = playerVoice;
        if(d.isCorrect == 0){
            alert("Incorrect choice!");
            points--;
        }
        else{
            points++;
            parentObj = d;
            next(d);
        }
        $("#scoreboard").html("Score: " + points + " points");
    }
    else{
        msg.voice = npcVoice;
        parentObj = d;
        next(d);
    }
    speechSynthesis.speak(msg);
    
}

function getAgentVoices(){
    window.speechSynthesis.onvoiceschanged = function() {
        var voices = this.getVoices();
        playerVoice = voices.filter(voice => (voice.lang.includes('it') && voice.name == 'Alice'))[0];
        npcVoice = voices.filter(voice => (voice.lang.includes('it') && voice.name == 'Luca'))[0];

    }
}

function playAudio(){
    /*
    var d = $(this).data();
    var path = "audio/" + d.agent + "_" + characterGender[d.agent] + "/" + d.audioFile;
    // audio controls src="" type="audio/mpeg" autoplay="true" id=""
    $sound = $("<audio></audio>");
    $sound.attr("id", "audioSource");
    $sound.attr("src", path);
    $sound.attr("type", "audio/mpeg");
    $sound.attr("autoplay", "true");

    $("body").append($sound);
    */

   

}

function calculatePositioningOffset(pos, offset){
    
    nPos = parseInt(pos.replace("px", ""));
    nPos = nPos + offset;
    return nPos + "px";
    
}

function move(e){
    // $(obj)
    console.log(e.keyCode());
}

function positionGameCharacter(characterID, offset){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var characterHeight = $("#" + characterID).height();
    var characterWidth = $("#" + characterID).width();
    var characterPosY = windowHeight - characterHeight + offset;
    $("#" + characterID).css("top", characterPosY + "px");
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}