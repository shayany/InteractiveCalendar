//noinspection JSAnnotator
/**
 * Created by shayan on 18.07.16.
 */


var month=0;

$(function () {
   createCalendar();
});

function nextMonth(){
    month++;
    deleteCalendar();
    createCalendar();
}
function previousMonth(){
    month--;
    deleteCalendar();
    createCalendar();
}

function deleteCalendar(){
    var wrapper= document.getElementById("wrapper");
    var table = document.getElementById("calendarTable");
    wrapper.removeChild(table);
}

function createCalendar() {

    //Number of days in each month
    var days = moment().add(month,"month").daysInMonth();
    var wrapper = document.getElementById("wrapper"); // This is the wrapper dive that contains the whole table


    var table = document.createElement("table");//create table node
    table.id="calendarTable";
    $(table).addClass("table");
    $(table).addClass("table-bordered");
    $(table).addClass("table-striped");
    $(table).addClass("table-hover");
    //Adding name of the month and year to the first row
    var firstRow = document.createElement("tr");
    var tableTitle = document.createElement("th");

    tableTitle.colSpan = "32";// Maximum number of columns in each table
    tableTitle.innerHTML = moment().add(month,"month").startOf("month").format("MMMM YYYY");
    firstRow.appendChild(tableTitle);
    table.appendChild(firstRow);


    var secondRow = document.createElement("tr");
    for (var i = 0; i <= days; i++) {
        var td = document.createElement("th");
        $(td).addClass("noselect"); // The first row should not be selectable
        if (i > 0) {
            td.innerText = moment().add(month,"month").startOf("month").add(i - 1, "day").format("D/M"); //These cells contain date and month
        }
        secondRow.appendChild(td);
    }
    table.appendChild(secondRow);
    var tableBody = document.createElement("tbody");
    tableBody.id="tableBody";
    table.appendChild(tableBody);
    for (var i = 0; i < 24; i++) {
        var tableRow = document.createElement("tr");

        for (var j = 0; j <= days; j++) {
            var td = document.createElement("td");
            if (j == 0) {
                $(td).addClass("noselect"); // The second row in the table should not be selectable
                td.innerText = moment(i.toString(), "hh").format("HH:mm");
            }
            td.setAttribute("hour",moment(i.toString(), "hh").format("HH"));
            td.setAttribute("date",moment().add(month,"month").startOf("month").add(j - 1, "day").format("Y-MM-DD"));
            td.setAttribute("neededDriver",0);
            td.setAttribute("shiftID","Y-MM-DD-SH-EH");
            $(td).addClass("cellsBorder");
            tableRow.appendChild(td);
        }
        tableBody.appendChild(tableRow);

    }
    table.appendChild(tableBody);
    wrapper.appendChild(table);


    //adding modal feature to td
    $( "table" ).on( "selectablestop", function( event, ui ) {

    //$('td').mousedown(function (event) {
        //The event value of the right click is 3
        //if (event.which == 3 && $(this).hasClass("ui-selected")) {

            var selectedCells = document.getElementsByClassName("ui-selected"); // capture all the cells that are highlighted
            console.log(selectedCells.length);
            //Adding the selected day's date to modal
            document.getElementById("modalDate").setAttribute("value",selectedCells[0].getAttribute("date"));

            // Regular expression for capturing the shift ID
            var patternForGroupID=/\d{4}-\d{1,2}-\d{1,2}-(\d{1,2})-(\d{1,2})/;
            //If the selected cells belong to the shift, it shows the shift details in modal
            if(patternForGroupID.test($(this).attr("shiftid"))){
                var shiftID=$(this).attr("shiftid").toString();
                var result = patternForGroupID.exec(shiftID);
                document.getElementById("modalStartHour").value = result[1].toString();
                document.getElementById("modalEndHour").value = result[2].toString();
            }else
            {
                document.getElementById("modalStartHour").value = selectedCells[0].getAttribute("hour");
                document.getElementById("modalEndHour").value = selectedCells[selectedCells.length-1].getAttribute("hour");
            }


            if (selectedCells[selectedCells.length-1].getAttribute("neededDriver") == 0 )
            {
                document.getElementById("modalDriverNumber").value = 1;
            } else {
                document.getElementById("modalDriverNumber").value = selectedCells[selectedCells.length-1].getAttribute("neededDriver");
            }

            //Active the delete button in the modal
            if( selectedCells[selectedCells.length-1].getAttribute("shiftID") != "Y-MM-DD-SH-EH")
            {
                document.getElementById("modalShiftID").setAttribute("value",selectedCells[0].getAttribute("shiftid"));
            }else{
                document.getElementById("modalShiftID").setAttribute("value",false.toString());
            }
            document.getElementById("deleteModalButton").disabled = false;
            $("#confirm").modal("show");
        //}
    });


    //Adding selectable feature to to table
    $("table").selectable({
        filter: 'td:not(.noselect)'
    });


}


$("#saveModalButton").click(function () {


    if ($("#modalShiftID").val().toString()!=false.toString())// For editing the shift, first we delete the shift and then create the new one
    {
        deleteCells($("#modalShiftID").val().toString());
    }

    var shiftDate = document.getElementById("modalDate").value;
    var startHour = Number(document.getElementById("modalStartHour").value);
    var endtHour = Number(document.getElementById("modalEndHour").value);
    var driverNumber = Number(document.getElementById("modalDriverNumber").value);

    shiftID = shiftDate + '-' + startHour + '-' + endtHour; //Creating unigue ID for each shift

    var cells = $("td[date='" + shiftDate + "']");


    if(startHour>endtHour){
        var temp=startHour;
        startHour=endtHour;
        endtHour=temp;
    }


    var patternForGroupID=/\d{4}-\d{1,2}-\d{1,2}-(\d{1,2})-(\d{1,2})/;
    var overlapFlag=false;
    for(var  i=0; i< 24;i ++){
        if (patternForGroupID.test(cells[i].getAttribute("shiftID"))){
            var result = patternForGroupID.exec(cells[i].getAttribute("shiftID"));
            if (overlap(Number(result[1]),Number(result[2]),startHour,endtHour)==true){
                alert("Please delete the previous shift!");
                overlapFlag = true;
                break;
            }
        }
    }

    if(!overlapFlag) {
        for (var i = 0; i < 24; i++) {
            if (Number(cells[i].getAttribute("hour")) >= startHour && Number(cells[i].getAttribute("hour")) <= endtHour) {
                $(cells[i]).removeClass("cellsBorder");
                if(startHour == endtHour)
                {
                    $(cells[i]).addClass("shiftCell");
                }
                else if (Number(cells[i].getAttribute("hour")) == startHour) {
                    //cells[i].className += " shiftStartCell";
                    $(cells[i]).addClass("shiftStartCell");
                }
                else if (Number(cells[i].getAttribute("hour")) == endtHour) {
                    $(cells[i]).addClass("shiftEndCell");
                    //cells[i].className += " shiftEndCell";
                }
                document.getElementById("modalShiftID").setAttribute("value", shiftID);
                cells[i].setAttribute("neededDriver", driverNumber);
                cells[i].setAttribute("shiftID", shiftID);
                $(cells[i]).addClass("availableShift");
            }
        }
        document.getElementById("deleteModalButton").disabled = false;
    }
    $("#confirm").modal("toggle");
});


$("#deleteModalButton").click(function () {
    deleteCells(false);
});


function deleteCells(shiftID){

    if (shiftID.toString() == false.toString()){
        var cells=$("[shiftID="+$("#modalShiftID").val()+"]");
    }
    else
    {
        var cells=$("[shiftID="+shiftID.toString()+"]");
    }

    $(cells).removeClass("availableShift");
    $(cells).removeClass("shiftCell");
    $(cells).removeClass("shiftStartCell");
    $(cells).removeClass("shiftEndCell");
    $(cells).removeClass("ui-selected"); //Unselect the cells after deletion
    $(cells).addClass("cellsBorder");
    $(cells).attr("neededDriver","0");
    $(cells).attr("shiftID","Y-MM-DD-SH-EH");

}


//This function check two shifts have overlap on each other or not
function overlap(startHour1,endHour1,startHour2,endHour2){

    if(startHour2>= startHour1 && endHour2 <= endHour1){
        return true;
    }

    if(startHour2<= startHour1 && endHour2 >= endHour1) {
        return true;
    }
    if( startHour2 <= endHour1 && endHour2 >= endHour1) {
        return true;
    }
    return false
}
