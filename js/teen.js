var subjectCalendarData = null;
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
    encounterDate = getUrlParam("encounterDate", "");
    
    
    // buildForm("#main");
    
    if(subjectID != "" && encounterDate != ""){
        $("#txtSubjectID").val(subjectID);
        $("#txtDateSelector").val(encounterDate);
        searchCalendar();
    }
});

	
function buildForm(div){
	
    $.getJSON("formteen.json",function(data){
        $table=$("<table class='list_table'></table>");
        //CREATING ROW AND FIRST CELL EMPTY
        $tr=$("<tr></tr>");
        $th=$("<th>&nbsp;</th>");
        $tr.append($th);
						
        //CREATING TABLE HEADERS USING THE TIMELINE ITEMS
        for(i=0;i<data.timeline.length;i++){
            $th=("<th>"+data.timeline[i].timeItemLabel+"</th>");
            $tr.append($th);
        }
        $table.append($tr);
						
        //NOW WE ARE CREATING THE ROWS WITH THE QUESTIONS AND EMPTY CELLS
        for(j=0;j<data.topics.length;j++){
            $tr=$("<tr></tr>");
            for(i=0;i<=data.timeline.length;i++){
				if(i==0){
                    $td=$("<td class='questioncol'>"+data.topics[j].topicLabel+"</td>");
                    $tr.append($td);
                } 
                else{
                    $td=$("<td class='responseval' id='"+data.topics[j].topicID+"_"+data.timeline[i-1].timeItemID+"'></td>");
                    $td.click(function(){
                        if($(this).children().length==0){
                            $input=$("<textarea>");
                            $input.css("width","100%");
                            $(this).append($input);
                            $input.focus();
                            $input.focusout(function(){
                                var arr = $input.parent().attr("id").split('_');
                                var dataToSend={
                                    "topicID":arr[0],
                                    "timeItemID": arr[1],
                                    "textValue": $input.val(),
                                    "subjectID": $("#txtSubjectID").val(),
                                    "encounterType" : 1, 
                                    "encounterDate": $('#txtDateSelector').val()
                                };
                                console.log(dataToSend);
                                $.post('rest/updateAdultEhcData.php', dataToSend, function(data){
                                    console.log(data);
                                });
                                $input.parent().html($input.val());
                                $input.remove();
                            });   
                                                
                                               
                            if($(this).html()){
                                var content = $(this).text();
                                $(this).contents().filter(function(){
                                    return (this.nodeType == 3);
                                }).remove();
                                $input.val(content);
                            } // if($(this).html())
                        } // if($(this).children().length==0)

                    });
                    $tr.append($td);
                } 
            }
            $table.append($tr);
        }
						
        $(div).append($table);
        
        
        
						
    });
}



function populateTable(calendarData){
    // alert(selectedDate);
    $('.responseval').empty();
    for(i=0;i<calendarData.caldata.length;i++){
        $("#"+calendarData.caldata[i].topicID + "_" + calendarData.caldata[i].timeItemID).text(calendarData.caldata[i].textValue);
    }
}

function clearSearch(){
    $("#txtDateSelector").val('');
    $("#txtSubjectID").val('');
}

function searchCalendar(){
    buildForm("#main");
    var subjectID = $("#txtSubjectID").val();
    var encounterDate = $('#txtDateSelector').val();
    if(subjectID != "" && encounterDate != ""){
        $('.responseval').empty();

        var dataUrl = "rest/getEhcData.php?subjectID="+subjectID + "&encounterDate="+ encounterDate + "&encounterType=1";
        console.log(dataUrl);
        $.getJSON(dataUrl, function(calendarData){
            
            console.log(calendarData);
            subjectCalendarData = calendarData;
            /*
            if(subjectCalendarData.caldata.length == 0){
                alert("Sorry, we could not find an encounter for subject ID = " + subjectID + " on " + encounterDate);
            }*/
            
            
            
            if(encounterDate != ""){
                $('#txtDateSelector').val(encounterDate);
                
                populateTable(subjectCalendarData);
            }
        });
    }
    else{
        alert("You must provide a valid subject ID and select a valid encounter date");
    }
}