			//document.addEventListener("deviceready", function(){
var subjectCalendarData = null;
var childrenEhcItems = null;

var subjectID = "";
var encounterDate = "";

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

$(document).ready(function(){
    $( "#txtDateSelector" ).datepicker({ dateFormat: 'yy-mm-dd' });
    subjectID = getUrlParam("subjectID", "");
    encounterDate = getUrlParam("encounterDate", "").toString();
    
    if(subjectID != "" && encounterDate != ""){
        $("#txtSubjectID").val(subjectID);
        $("#txtDateSelector").val(encounterDate);
        searchCalendar();
    }
    
});// end ready
			
function saveItemData(controlID, val){
    
    var topicID, timeItemID;
    var idArray = controlID.split('_');
    var dataToSave = {};
    if(idArray.length == 3){
        topicID = idArray[2];
        timeItemID = idArray[1];
					
        dataToSave.topicID = topicID;
        dataToSave.timeItemID = timeItemID;
        dataToSave.textValue = val;
        dataToSave.subjectID = $("#txtSubjectID").val();
        dataToSave.encounterType = 2;
        dataToSave.encounterDate = $('#txtDateSelector').val();
					
        
        console.log(dataToSave);
        $.post('rest/updateChildrenEhcData.php', dataToSave, function(resp){
            console.log(resp);
        });
    }
}

function deleteItemData(controlID, val){
    var topicID, timeItemID;
    var idArray = controlID.split('_');
    var dataToDelete = {};
    if(idArray.length == 3){
        topicID = idArray[2];
        timeItemID = idArray[1];

        dataToDelete.topicID = topicID;
        dataToDelete.timeItemID = timeItemID;
        dataToDelete.textValue = val;
        dataToDelete.subjectID = $("#txtSubjectID").val();
        dataToDelete.encounterDate = $('#txtDateSelector').val();

        //console.log("DELETE");
        //console.log(dataToDelete);					
        $.post('rest/deleteChildrenEhcData.php', dataToDelete, function(resp){
            console.log(resp);
        });
    }			
}	

function loadCalendar(calendarData){
    // console.log(calendarData);
    
    var original_H = 0;				
    var savedItem = "";
				
    
    //Draw table and items
    
    $.getJSON("formchildren.json", function(data){
        console.log(data);
        childrenEhcItems = data;
        //Draw table
        var table = "";
        var color = ["#5c91c6","#aac368","907ab0","cc665d","f9a757"]
        table+="<table id='tblChildrenCalendar' border='1'><tr><td colspan='"+(data.topics.length+1)+"'>";
        table+="<div id='choiceItemsList' style='display: none;'>";
    
        itemList = {}
        //Load pictures
        for(i=0;i<data.items.length;i++){
            
            table += "<img src='images/calendar_icons/"+data.items[i].imageFile+"' class='drag-image' id='d"+i+"' alt='"+data.items[i].itemName+"' title='"+data.items[i].itemName+"' name='"+data.items[i].itemName+"' height='60' hspace='10' style='visibility: hidden; float: left; border: 1px solid #000000; border-radius: 10px; margin: 5px 5px 5px 5px; padding: 2px 2px 2px 2px;' />";		
        
            itemList[data.items[i].itemName] = data.items[i];
            // console.log(table);
        }
        console.log(itemList);
						
        table+="</div></td></tr><tr><td id='top'><img src='images/pitt.png' alt='Pitt Logo' width='100' height='100' /></td>";
        //First Row
        for(i=0;i<data.topics.length;i++){						
            table += "<td bgcolor='"+color[i%5]+"'><img id='topic_" + data.topics[i].topicID + "' src='images/"+data.topics[i].image+"'  width='40' height='40' onclick='showChoices(" + data.topics[i].topicID + ");' /></br>"+data.topics[i].topicLabel+"</td>";
        }					
        table += "</tr>";
        
        for(i=0;i<data.timeline.length;i++){
            //First Column
            table += "<tr><td bgcolor='"+color[i%5]+"'><img src='images/"+data.timeline[i].image+"'  height='40' /></br>"+data.timeline[i].timeItemLabel+"</td>";
							
            for(j=0;j<data.topics.length;j++){								
				//Load data if avaiable
				var aux_class_table = "";
				var aux_table = "";
				var id_cell = "";
                if(calendarData != null){
				    for(k=0;k<calendarData.caldata.length;k++){
				        if(data.topics[j].topicID == calendarData.caldata[k].topicID && data.timeline[i].timeItemID == calendarData.caldata[k].timeItemID){
				            savedItem = calendarData.caldata[k].itemName;
                            savedItemImage = itemList[savedItem].imageFile;
                            // console.log(savedItemImage);
				            id_cell = "c_"+data.timeline[i].timeItemID+"_"+data.topics[j].topicID;
				            aux_table += "<img src='images/calendar_icons/"+savedItemImage+"' id='d"+i+"' name='"+savedItem+"' alt='"+id_cell+"' class='dropped' width='40' height='40' hspace='10' style='float: left; border: 1px solid #000000; border-radius: 10px; margin: 2px 2px 2px 2px; padding: 2px 2px 2px 2px;'/>";
				            //Record item in the cell class										
				            aux_class_table += " " + savedItem
										
				        }
                    }	
                } // check if calendar data is null
                id_cell = "c_"+data.timeline[i].timeItemID+"_"+data.topics[j].topicID;
				table += "<td class ='responseval drop-cell"+aux_class_table+"' id='" + id_cell + "'>"
				table += aux_table;
				table +="</td>";							
            }						
							
            table += "</tr>";
        }
						
        table+="</table>";
        $("#calendarPlaceholder").append(table);
		
        
        //Get original size of the top cell
        original_H = $('#top').height() - 36;						
						
        //Make each item draggable			
        $(".drag-image").draggable({						
            helper: "clone",
            scroll: false
        });					
						
						
        //Make each cell droppable											
        $( ".drop-cell" ).droppable({
        
            //Drop event
            drop: function( event, ui ) {														
                var name = ui.helper[0].name;
				$obj = $(this);
				var id_cell = $obj.attr('id');
								
				//Check if the item was not dropped in the cell yet
				if(!$('#'+id_cell).hasClass(name)){									
									
                    //Make a clone of the item inside the cell
				    $(this).append($(ui.draggable).clone());
				    $('#'+id_cell).addClass(name); //cell		
				    $('#'+id_cell+" .drag-image").attr({
                        "alt":  id_cell,
                        "height" : "40px"
                    });	
                    $('#'+id_cell+" .drag-image").css({
                        "padding" : "2px",
                        "margin" : "2px"
                    });
				    $('#'+id_cell+" .drag-image").removeClass("drag-image").addClass("dropped"); //dropped item								
									
				    //Fix cell height after item is dropped in								
				    $('#'+id_cell).attr("height", original_H);
                    
                    
				    
                    //Method to request record insertion
				    saveItemData(id_cell, name);
                }
            }						
        }); // end droppable event

            
        //Make items removable	
        $('body').on('click', '.dropped', function() {						
            $obj = $(this);
            var name = $obj.attr('name');
            var loadedCell = $obj.attr('alt');
            var r = confirm("Delete " +name+"?");
            if (r == true) {										
                //Remove item from the cell										
				$obj.remove(); //loaded item																		
				$('#'+loadedCell).removeClass(name); //cell
								
				//Fix cell height after item is removed	
				$('#'+loadedCell).attr("height", original_H);
								
				//Method to request record deletion
				deleteItemData(loadedCell, name);
            }							
        });
    });//end load saved data
}

function searchCalendar(){
    $("#calendarPlaceholder").empty();
    var subjectID = $("#txtSubjectID").val();
    var encounterDate = $('#txtDateSelector').val();
    if(subjectID != ""){
        $('.responseval').empty();
        
        // var dataUrl = "rest/getEhcData.php?subjectID="+subjectID + "&encounterType=2";
        var dataUrl = "rest/getEhcData.php?subjectID="+subjectID + "&encounterDate="+ encounterDate + "&encounterType=2";
        console.log(dataUrl);
        $.getJSON(dataUrl, function(calendarData){
            
            // console.log(calendarData);
            if(calendarData != null){
                subjectCalendarData = calendarData;
            }
                
            if(typeof encounterDate == "string" && encounterDate != ""){
                loadCalendar(subjectCalendarData);
            }
            
        });
        
        
        
        
    }
    else{
        alert("You must provide a valid subject ID");
    }
}




function clearSearch(){
    $("#txtDateSelector").val('');
    $("#txtSubjectID").val('');
    $("#calendarPlaceholder").empty();
}


function showChoices(topicID){
    $('#choiceItemsList').css({'display' : 'none' });
    for(t=0; t<childrenEhcItems.topics.length;t++){
        if(childrenEhcItems.topics[t].topicID == topicID){
            
            for(i=0;i<childrenEhcItems.items.length;i++){
                $('#d'+i).css({'visibility' : 'hidden', 'display': 'none'});
                if(childrenEhcItems.topics[t].relatedItems.includes(childrenEhcItems.items[i].itemName)){
                    
                    $('#d'+i).css({'visibility' : 'visible', 'display': 'block'});
                }

                
            }
        }
    }
    $('#choiceItemsList').css({'display' : 'block' });
    
    
}
