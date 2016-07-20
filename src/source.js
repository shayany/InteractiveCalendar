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
        td.setAttribute("class", "noselect");
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
                td.setAttribute("class", "noselect");
                td.innerText = moment(i.toString(), "hh").format("HH:mm");
            }
            td.setAttribute("hour",moment(i.toString(), "hh").format("HH"));
            td.setAttribute("date",moment().startOf("month").add(j - 1, "day").format("Y-MM-DD"));
            td.setAttribute("neededDriver",0);
            td.setAttribute("shiftID","Y-MM-DD-SH-EH");
            tableRow.appendChild(td);
        }
        table.appendChild(tableRow);
    }
    wrapper.appendChild(table);


    //Adding selectable feature to to table
    $("table").selectable({
        filter: 'td:not(.noselect)'
    });


    //adding modal feature to td
    $('table').mousedown(function (event) {
        //right click has the event value of three
        if (event.which == 3) {
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
            $("#confirm").modal("show");
        }
    });
}


$("#saveModalButton").click(function () {
    var shiftDate = document.getElementById("modalDate").value;
    var startHour = document.getElementById("modalStartHour").value;
    var endtHour = document.getElementById("modalEndHour").value;
    var driverNumber = document.getElementById("modalDriverNumber").value;
    shiftID = shiftDate+'-'+startHour+'-'+endtHour;
    alert(shiftDate);
    var cells = $("td[date='"+shiftDate+"']");
    for(var i = 0; i < 24; i++){
        if (cells[i].getAttribute("hour") >= startHour && cells[i].getAttribute("hour") <= endtHour){
            //cells[i].className+=" availableShift";
            cells[i].setAttribute("neededDriver",driverNumber);
            cells[i].setAttribute("shiftID",shiftID);
            cells[i].style.background="red";
        }
    }
});