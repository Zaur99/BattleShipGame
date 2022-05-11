


$(document).ready(function () {

    $("#playerOne").html($("#PlayerName").val());
    var data = JSON.parse($("#SerializedBFArray").val());
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (data[i][j] !== "") {
                $(`[px = ${i}][py = ${j}]`).attr("class", "selectedField");
            }
        }
    }

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/game")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.start().then(() => {
        connection.invoke("BindSocketAndPlayerData", $('#PlayerName').val(), $('#SerializedBFArray').val()).catch(function (err) {
            return console.error(err.toString());
        });
    });


    connection.on("ReceiveMessage", function (message) {

        if (message === true) {
            connection.invoke("StartGame");
        }
    });

    connection.on("GetMessage", function (msg) {

        var message = JSON.parse(msg);
        if (message.turn === "player") {
            $("#playerTurn").attr("class", "");
            $("#opponentTurn").attr("class", "hide");
        }
        else {
            $("#playerTurn").attr("class", "hide");
            $("#opponentTurn").attr("class", "");
        }
        if (message.connected === true) {
            $('#turnRivals').attr("class", "");
            $("#playGameContent").attr("class", "");
            $('#playersNames').attr("class", "");
            $("#playerTwo").html(message.opponentName);
            $("#loadingContainer").attr("class", "hide");
        }
    });

    $('.tableCell').click(function () {
        if (!$.trim($(this).html())) {
            console.log($(this).has());
            connection.invoke("PlayTurn", $(this).attr('ox'), $(this).attr('oy'));

        }
    });

    connection.on("UpdateShoot", function (msg) {
        var message = JSON.parse(msg);
        console.log(message);
        if (message.won !== undefined) {
            $("#winnerContainer").attr("class", "");
            $("#playGameContent").attr("class", "hide");
            $("#turnRivals").attr("class", "hide");
            $("#playersNames").attr("class", "hide");
            if (message.won)
                $("#youWonText").attr("class", "");
            else
                $("#youLostText").attr("class", "");
        }
        if (message.x !== undefined && message.y !== undefined) {
            if (message.hit) {
                if (message.previousTurn == "player") {
                    $(`[ox = ${message.x}][oy = ${message.y}]`).attr("class", "gotShot");
                }
                else {
                    $(`[px = ${message.x}][py = ${message.y}]`).attr("class", "gotShot");
                }

            }
            else {
                if (message.previousTurn == "player") {
                    $(`[ox = ${message.x}][oy = ${message.y}]`).attr("class", "missed");
                }
                else {

                    $(`[px = ${message.x}][py = ${message.y}]`).attr("class", "missed");
                }
            }

        }
        if (message.turn === "player") {
            $("#playerTurn").attr("class", "");
            $("#opponentTurn").attr("class", "hide");
        }
        else {
            $("#playerTurn").attr("class", "hide");
            $("#opponentTurn").attr("class", "");
        }

    });

    connection.on("OnDisconnected", function (msg) {
        var message = JSON.parse(msg);
        if (message.disconnected) {
            $("#playGameContent").attr("class", "hide");
            $("#turnRivals").attr("class", "hide");
            $("#playersNames").attr("class", "hide");
            $('#disconnectedContainer').attr("class", "");
        }
    });
});


