const HORIZONTAL_MULTIPLIER = 120;
const VERTICAL_MULTIPLIER = 300;
const POSITION_OFFSET = 20;

var moveInterval = 0;
var gameObjects = [];
var moveDirection = {};

function renderGameObject(gameObjectID, gameObjectClass, x, y, parentObject){
    $obj = $("<div></div>");
    $obj.attr("class", gameObjectClass);
    $obj.attr("id", gameObjectID)
    $obj.css({
        'left' : x + 'px',
        'top' : y + "px"
    });
    parentObject.append($obj);
    return $obj;
}

function renderInteractableObject(gameObjectID, gameObjectClass, gameObjectSrc, x, y, parentObject){
    $obj = $("<img />");
    $obj.attr({
        "class" : gameObjectClass,
        "id" : gameObjectID,
        "src" : gameObjectSrc
    });


    $obj.css({
        'left' : x + 'px',
        'top' : y + "px"
    });
    parentObject.append($obj);
    return $obj;
}


function checkCollisions(obj){
    onSidewalk, onRoad, onCrosswalk = false;
    var rect1 = obj[0].getBoundingClientRect();
    var area1 = Math.abs(rect1.right - rect1.left) * Math.abs(rect1.bottom - rect1.top);
    for(var i = 0; i<gameObjects.length; i++){
        var rect2 = gameObjects[i][0].getBoundingClientRect();
        var overlap = !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom)

        if(overlap){
            var x_overlap = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
            var y_overlap = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
            var overlapArea = x_overlap * y_overlap;

            var intersectionRatio = overlapArea / area1;
            if(intersectionRatio >= 0.75){
                // console.log(gameObjects[i].attr("id") + ": " + intersectionRatio);
                if(gameObjects[i].attr("id").indexOf("sidewalk") != -1){
                    onSidewalk = true;
                    console.log("ON SIDEWALK");
                }
                else if(gameObjects[i].attr("id").indexOf("road") != -1){
                    onRoad = true;
                    console.log("ON ROAD");
                }
                else if(gameObjects[i].attr("id").indexOf("car") != -1){
                    console.log("HIT BY CAR");
                }
                else if(gameObjects[i].attr("id").indexOf("pizzeria") != -1){
                    // console.log("EXIT");
                    document.location.href = "restaurant1.html"
                }

            }
        }

    }
}

function flipObjectX(obj, dir){
    obj.css({
        '-webkit-transform' : 'scaleX(' + dir + ')',
        'transform' : 'scaleX(' + dir + ')'
    });
}


function autoMoveObject(obj){
    var pos = obj.css("left");
    pos = pos.replace("px");
    if(moveDirection[obj.attr("id")] == 1){
        pos = parseInt(pos) + 1;
    }
    else{
        pos = parseInt(pos) - 1;
    }
    if(pos < 0){
        moveDirection[obj.attr("id")] = 1;
        flipObjectX(obj, 1);

    }
    if(pos > 1000){
        moveDirection[obj.attr("id")] = 0;
        flipObjectX(obj, -1);

    }
    obj.css("left", pos + "px");
}


function movePlayer(evt){
    hideSpeechBubble();
    $player = $('#player');
    var x = parseInt($player.css("left").replace('px'));
    var y = parseInt($player.css("top").replace('px'));
    // console.log(evt.keyCode);
    switch(evt.keyCode){
        case 38:
            y = y - 5;
            break;
        case 40:
            y = y + 5;
            break;
        case 39:
            x = x + 5;
            flipObjectX($player, 1);
            break;
        case 37:
            x = x - 5;
            flipObjectX($player, -1);
            break;
    }
    $player.css({
        "left" : x + "px",
        "top" : y + "px"
    });
    // checkCollisions($player);


}

function movePlayerByTextInput($player, dir, delta){
    var pos = parseInt($player.css(dir).replace('px'));

    $player.css(dir, (pos + delta) + "px");
}

function captureTextInput(evt){
    $in = $('#responseText');
    if (evt.keyCode == 13){
        processTextInput($in.val());
        $in.val('');
    }

}

function processTextInput(txt){
    hideSpeechBubble();
    $player = $('#player');
    var x = parseInt($player.css("left").replace('px'));
    var y = parseInt($player.css("top").replace('px'));

    txt = txt.toLowerCase();
    switch(txt){
        case 'su': // go up
            clearInterval(moveInterval);
            moveInterval = setInterval(movePlayerByTextInput, 100, $player, 'top', -1);
            console.log("Go up");
            break;
        case 'destra': // go right
            clearInterval(moveInterval);
            moveInterval = setInterval(movePlayerByTextInput, 100, $player, 'left', 1);
            console.log("Go right");
            flipObjectX($player, 1);
            break;
        case 'sinistra': // go left
            clearInterval(moveInterval);
            moveInterval = setInterval(movePlayerByTextInput, 100, $player, 'left', -1);
            console.log("Go left");
            flipObjectX($player, -1);
            break;
        case 'scendere': // go down
            clearInterval(moveInterval);
            moveInterval = setInterval(movePlayerByTextInput, 100, $player, 'top', 1);
            console.log("Go down");
            break;
        case 'fermare':
            clearInterval(moveInterval);
            console.log('Stop');
            break;


    }

}

function hideSpeechBubble(){
    $s = $("#speechBubble");
    if($s){
        $s.css({
            "visibility" : "hidden",
            "display" : "none"
        });
    }
}
