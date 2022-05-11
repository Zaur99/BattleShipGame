

$(document).ready(function () {
    var maxFieldsCounter = 0;
    var arr = [];
    var countForStart = 0;
    var shipLength = 0;
    //Destroyer Count
    var destroyerCount = 1;
    //Submarine count
    var submarineCount = 2;
    //Carrier count
    var carrierCount = 2;

    var arr = [];
    var firstX = [];
    var firstY = [];
    var carrier = $('#carrier');
    var submarine = $('#submarine');
    var destroyer = $('#destroyer');

    function logic(shipCount, length, currentShip, nextShip) {



        $(".tableCell").on("mousedown mouseover", function (e) {
            //If player placed one ship, determine border around it for not placing another ship 
            if (maxFieldsCounter == length) {
                countForStart++;
                firstX.sort(function (a, b) { return a - b });
                firstY.sort(function (a, b) { return a - b });
                if (firstX.length > 1) {
                    $(`[px=${parseInt(firstX[0]) - 1}][py=${arr[1]}]`).attr("class", "no-tableCell");
                    $(`[px=${parseInt(firstX[firstX.length - 1]) + 1}][py=${arr[1]}]`).attr("class", "no-tableCell");
                    for (var i = parseInt(firstX[0]) - 1; i <= parseInt(firstX[firstX.length - 1]) + 1; i++) {
                        $(`[px=${i}][py=${parseInt(arr[1]) + 1}]`).attr("class", "no-tableCell");
                        $(`[px=${i}][py=${parseInt(arr[1]) - 1}]`).attr("class", "no-tableCell");
                    }

                }
                else {
                    $(`[px=${arr[0]}][py=${parseInt(firstY[0]) - 1}]`).attr("class", "no-tableCell");
                    $(`[px=${arr[0]}][py=${parseInt(firstY[firstY.length - 1]) + 1}]`).attr("class", "no-tableCell");
                    for (var i = parseInt(firstY[0]) - 1; i <= parseInt(firstY[firstY.length - 1]) + 1; i++) {
                        $(`[px=${parseInt(arr[0]) + 1}][py=${i}]`).attr("class", "no-tableCell");
                        $(`[px=${parseInt(arr[0]) - 1}][py=${i}]`).attr("class", "no-tableCell");
                    }

                }

                //After player located ship, check possibility of placing another one

                if (shipCount > 1) {
                    maxFieldsCounter = 0;
                    arr = [];
                    firstX = [];
                    firstY = [];
                    shipCount--;
                } else {
                    currentShip.prop('disabled', true);
                    nextShip.prop('disabled', false);
                }
                return;
            }


            else if (e.type === "mousedown") {
                firstX.sort(function (a, b) { return a - b });
                firstY.sort(function (a, b) { return a - b });
                //Check if player placed any cubes

                if (arr.length > 0) {
                    //Check if player place horizantally

                    if ((String(parseInt(e.target.getAttribute("px")) - 1) == firstX[firstX.length - 1] ||
                        (String(parseInt(e.target.getAttribute("px")) + 1) == firstX[0]) && e.target.getAttribute("py") == arr[1])) {
                        if ($(this).attr("class") != "no-tableCell") {
                            $(this).attr("class", "selectedField");
                            arr = [];
                            firstY = [];
                            arr.push(e.target.getAttribute("px"));
                            arr.push(e.target.getAttribute("py"));
                            firstX.push(e.target.getAttribute("px"));
                            maxFieldsCounter++;
                        }

                    }
                    //Check if player place vertically

                    if ((String(parseInt(e.target.getAttribute("py")) - 1) == firstY[firstY.length - 1] ||
                        (String(parseInt(e.target.getAttribute("py")) + 1) == firstY[0]) && e.target.getAttribute("px") == arr[0])) {

                        if ($(this).attr("class") != "no-tableCell") {
                            $(this).attr("class", "selectedField");
                            arr = [];
                            firstX = [];
                            arr.push(e.target.getAttribute("px"));
                            arr.push(e.target.getAttribute("py"));
                            firstY.push(e.target.getAttribute("py"));
                            maxFieldsCounter++;
                        }
                    }
                }
                else {
                    if ($(this).attr("class") != "no-tableCell") {
                        $(this).attr("class", "selectedField");
                        arr.push(e.target.getAttribute("px"));
                        arr.push(e.target.getAttribute("py"));
                        firstX.push(e.target.getAttribute("px"));
                        firstY.push(e.target.getAttribute("py"));
                        maxFieldsCounter++;
                    }
                }



            }


        });


    }
    $(document).on("click", "input[type='button']", function (ev) {
        if (ev.target.id == 'carrier') {
            shipLength = 4;

            logic(carrierCount, shipLength, carrier, submarine);






        }



        else if (ev.target.id == 'submarine') {

            if (maxFieldsCounter == 4) {
                maxFieldsCounter = 0;
                shipLength = 3;
                arr = [];
                firstX = [];
                firstY = [];

                logic(submarineCount, shipLength, submarine, destroyer);

            }


        }
        else if (ev.target.id == 'destroyer') {

            if (maxFieldsCounter == 3) {
                maxFieldsCounter = 0;
                shipLength = 2;
                arr = [];
                firstX = [];
                firstY = [];
                logic(destroyerCount, shipLength, destroyer);



            }
        }

    });


});

//Completed Board
function matrix() {

    var arr = [];

    // Creates all lines:
    for (var i = 0; i < 10; i++) {

        // Creates an empty line
        arr.push([]);

        // Adds cols to the empty line:
        arr[i].push(new Array(10));

        for (var j = 0; j < 10; j++) {
            // Initializes:
            if ($(`[px = ${i}][py = ${j}]`).attr("class") === "selectedField") {
                arr[i][j] = "x";
            }
            else {
                arr[i][j] = "";
            }

        }
    }

    return arr;
}

//Function for sending complete board to server
function mapArray() {
    $("#serializedBattleFieldArray").val(JSON.stringify(matrix()));

}

