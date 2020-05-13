var dialog = null;
var nextParentID = 0;
var currentAgentType = "system";
var characterGender = {
    "waiter" : "male",
    "customer" : "female"
};

var unique = (value, index, self) => {
    return self.indexOf(value) === index
}

var points = 0;

$(document).ready(function(){
    positionGameCharacter("customer", 50);
    positionGameCharacter("waiter", 50);
    
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
    next();
});

function next(){
    var url = "rest/conversation.php?parentID=" + nextParentID;
    $("#speechBubble").css({
        "visibility" : "hidden",
        "display" : "none"
    });
    $.get(url, function(data){
        if(data){
            // console.log(data);
            if(data.statements){
                $("#speechBubble").empty();
                if(data.statements.length > 0){
                    var statements = shuffle(data.statements);
                    // console.log(statements); 
                    var turnID = 0;
                    for(var i = 0; i<statements.length; i++){
                        // console.log(data.statements[i]);
                        if(turnID == 0){
                            turnID = statements[i].turnID;
                        }
                        if(statements[i].turnID == turnID){
                            nextParentID = statements[i].turnID;
                            if(statements[i].agentType == 'npc'){
                                setTimeout(next, 5000);
                            }
                            
                            $agent = $("#" + statements[i].agent);
                            
                            // console.log(data.statements[i].agent);
                            $div = $("<button></button>");
                            $div.attr("class", "statement");
                            $div.data(statements[i]);
                            $div.html("&rarr; " + statements[i].statementText);
                            
                            
                            $("#speechBubble").css({
                                "visibility" : "visible",
                                "display" : "block",
                                "left": $agent.css("left"),
                                "top":  calculatePositioningOffset($agent.css("top"), -200)
                            });
                            $div.click(speechBubbleSelector);
                            $div.mouseover(playAudio);
                            // $p = $("<p></p>");
                            // $p.append($div);
                            $("#speechBubble").append($div);
                            $("#speechBubble").append($("<br />"));
                            
                        } // end of check for turnID
                    } // end of loop
                } // end of check for empty statements array
            } // end of check for null data object
        } // end of request handler
        
        // nextParentID ++;
    });
    
}

function speechBubbleSelector(){
    var d = $(this).data();
    if(d.isCorrect == 0){
        alert("Incorrect choice!");
        points--;
    }
    else{
        points++;
        next();
    }
    $("#scoreboard").html("Score: " + points + " points");
}

function playAudio(){
    var d = $(this).data();
    var path = "audio/" + d.agent + "_" + characterGender[d.agent] + "/" + d.audioFile;
    // audio controls src="" type="audio/mpeg" autoplay="true" id=""
    $sound = $("<audio></audio>");
    $sound.attr("id", "audioSource");
    $sound.attr("src", path);
    $sound.attr("type", "audio/mpeg");
    $sound.attr("autoplay", "true");

    $("body").append($sound);

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