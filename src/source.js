//noinspection JSAnnotator
/**
 * Created by shayan on 18.07.16.
 */

function createCalendar() {

    //Number of days in each mont
    var days = moment().daysInMonth();
    var wrapper = document.getElementById("wrapper");


    //create table node
    var table = document.createElement("table");
    //Adding name of the month and year to the first row
    var firstRow = document.createElement("tr");
    var tableTitle = document.createElement("th");
    tableTitle.colSpan = "32";// Maximum number of columns in each table
    tableTitle.innerHTML = moment().startOf("month").format("MMMM YYYY");
    firstRow.appendChild(tableTitle);
    table.appendChild(firstRow);


    var secondRow = document.createElement("tr");
    for (var i = 0; i <= days; i++) {
        var td = document.createElement("th");
        $(td).addClass("noselect");
        //td.setAttribute("class", "noselect");
        if (i > 0) {
            td.innerText = moment().startOf("month").add(i - 1, "day").format("D/M"); //These cells contain date and month
        }
        secondRow.appendChild(td);
    }
    table.appendChild(secondRow);


    var tableBody = document.createElement("tbody");
    for (var i = 0; i < 24; i++) {
        var tableRow = document.createElement("tr");
        for (var j = 0; j <= days; j++) {
            var td = document.createElement("td");
            //td.setAttribute("class","noselect"); if you want to make to whole cells unselectable uncomment this part
            if (j == 0) {
                //td.setAttribute("class", "noselect");
                $(td).addClass("noselect");
                td.innerText = moment(i.toString(), "hh").format("HH:mm");
            }
            td.setAttribute("hour",moment(i.toString(), "hh").format("HH"));
            td.setAttribute("date",moment().startOf("month").add(j - 1, "day").format("Y-MM-DD"));
            td.setAttribute("neededDriver",0);
            td.setAttribute("shiftID","Y-MM-DD-SH-EH");
            //td.className += " cellsBorder";
            $(td).addClass("cellsBorder");
            tableRow.appendChild(td);
        }
        table.appendChild(tableRow);
    }
    wrapper.appendChild(table);


    //adding modal feature to td
    $('td').mousedown(function (event) {
        //right click has the event value of three
        if (event.which == 3 && $(this).hasClass("ui-selected")) {
            var selectedCells = document.getElementsByClassName("ui-selected");
            document.getElementById("modalDate").setAttribute("value",selectedCells[0].getAttribute("date"));
            document.getElementById("modalStartHour").value = selectedCells[0].getAttribute("hour");
            document.getElementById("modalEndHour").value = selectedCells[selectedCells.length-1].getAttribute("hour");
            //document.getElementById("modalDriverNumber").value = selectedCells[selectedCells.length-1].getAttribute("neededDriver");
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
                document.getElementById("deleteModalButton").disabled = false;
            }else{
                document.getElementById("modalShiftID").setAttribute("value",false.toString());
                document.getElementById("deleteModalButton").disabled = true;
            }

            $("#confirm").modal("show");
        }
    });


    //Adding selectable feature to to table
    $("table").selectable({
        filter: 'td:not(.noselect)'
    });
}




$("#saveModalButton").click(function () {
    var shiftDate = document.getElementById("modalDate").value;
    var startHour = document.getElementById("modalStartHour").value;
    var endtHour = document.getElementById("modalEndHour").value;
    var driverNumber = document.getElementById("modalDriverNumber").value;
    shiftID = shiftDate+'-'+startHour+'-'+endtHour; //Creating unigue ID for each shift
    var cells = $("td[date='"+shiftDate+"']");
    for(var i = 0; i < 24; i++){
        if (cells[i].getAttribute("hour") >= startHour && cells[i].getAttribute("hour") <= endtHour){
            $(cells[i]).removeClass("cellsBorder");
            if (cells[i].getAttribute("hour") == startHour){
                //cells[i].className += " shiftStartCell";
                $(cells[i]).addClass("shiftStartCell");
            }
            if (cells[i].getAttribute("hour") == endtHour){
                $(cells[i]).addClass("shiftEndCell");
                //cells[i].className += " shiftEndCell";
            }

            document.getElementById("modalShiftID").setAttribute("value",shiftID);
            cells[i].setAttribute("neededDriver",driverNumber);
            cells[i].setAttribute("shiftID",shiftID);
            $(cells[i]).addClass("availableShift");
            $(cells[i]).addClass("shiftCells");
            //cells[i].className+=" availableShift";
            //cells[i].className += " shiftCells";
            //cells[i].style.background="red";
        }
    }
    document.getElementById("deleteModalButton").disabled = false;

});


$("#deleteModalButton").click(function(){
    //modalShiftID
    //alert($("[shiftID="+$("#modalShiftID").val()+"]").length);
    var cells=$("[shiftID="+$("#modalShiftID").val()+"]");
    $(cells).removeClass("availableShift");
    $(cells).removeClass("shiftCells");
    $(cells).removeClass("shiftStartCell");
    $(cells).removeClass("shiftEndCell");
    $(cells).removeClass("ui-selected"); //Unselect the cells after deletion
    $(cells).addClass("cellsBorder");
    $(cells).attr("neededDriver","0");
    $(cells).attr("shiftID","Y-MM-DD-SH-EH");

    /*for(var i=0;i<cells.length;i++){
        $(cells[i]).removeClass("availableShift");
        $(cells[i]).removeClass("shiftCells");
        $(cells[i]).removeClass("shiftStartCell");
        $(cells[i]).removeClass("shiftEndCell");
        $(cells[i]).addClass("cellsBorder");
        cells[i].setAttribute("neededDriver","0");
        cells[i].setAttribute("shiftID","Y-MM-DD-SH-EH");
    }*/

});
