function callDelAjax(id, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(this.responseText);
    };
    xhttp.open("POST", "/delete", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`num=${id}`);
}

function del(button) {
    let id = button.id;
    var res = confirm("Вы действительно хотите удалить книгу?");
    if (res) {
        callDelAjax(id, (response) => {
            document.getElementById('table1').innerHTML = response;
        })
    }
}

function callAjax(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
            callback(this.responseText);
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function showAvailable(){
    callAjax("/available",(response)=>{
        document.getElementById('table1').innerHTML = response;
        document.getElementById('table2').style.visibility='hidden';
    });
}

function showExpired(){
    callAjax("/expired",(response)=>{
        document.getElementById('table1').innerHTML = response;
        document.getElementById('table2').style.visibility='hidden';
    });
}

function showAll(){
    callAjax("/all",(response)=>{
        document.getElementById('table1').innerHTML = response;
        document.getElementById('table2').style.visibility='visible';
    });
}