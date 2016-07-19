//noinspection JSAnnotator
/**
 * Created by shayan on 18.07.16.
 */

function changeBackgroundColor() {
    document.getElementById("wrapper").style.backgroundColor="red";
}

function createCalendar(){

    //Number of days in each month

    var days = moment().daysInMonth();
    var wrapper = document.getElementById("wrapper");
    //create table node
    var table = document.createElement("table");

    //Adding name of the month and year to the first row
    var firstRow =document.createElement("tr");
    var header = document.createElement("th");
    header.colSpan = "32";
    header.innerHTML = moment().startOf("month").format("MMMM YYYY");
    firstRow.appendChild(header);
    table.appendChild(firstRow);

    var tableRow = document.createElement("tr");
    for(var i = 0; i <= days; i++){
        var td = document.createElement("th");
        td.setAttribute("class","noselect");
        if ( i > 0){
            td.innerText = moment().startOf("month").add(i-1,"day").format("D/M");
        }
        tableRow.appendChild(td);
    }

    table.appendChild(tableRow);

    for(var i = 0; i < 24; i++){
        var tableRow = document.createElement("tr");
        for(var j = 0; j <= days; j++){
            var td = document.createElement("td");
            td.setAttribute("class","noselect");
            if( j== 0){
                td.innerText = moment(i.toString(),"hh").format("HH:mm");
            }
            tableRow.appendChild(td);
        }
        table.appendChild(tableRow);
    }

    wrapper.appendChild(table);
}



