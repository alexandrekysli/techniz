/* by Alexandre kYsLi for NaN
      ,-.                         ,--,
  ,--/ /|      ,---,            ,--.'|     ,--,
,--. :/ |     /_ ./|            |  | :   ,--.'|
:  : ' /,---, |  ' :  .--.--.   :  : '   |  |,
|  '  //___/ \.  : | /  /    '  |  ' |   `--'_
'  |  : .  \  \ ,' '|  :  /`./  '  | |   ,' ,'|
|  |   \ \  ;  `  ,'|  :  ;_    |  | :   '  | |
'  : |. \ \  \    '  \  \    `. '  : |__ |  | :
|  | ' \ \ '  \   |   `----.   \|  | '.'|'  : |__
'  : |--'   \  ;  ;  /  /`--'  /;  :    ;|  | '.'|
;  |,'       :  \  \'--'.     / |  ,   / ;  :    ;
'--'          \  ' ;  `--'---'   ---`-'  |  ,   /
               `--`                       ---`-'
*/
$(document).ready(function () {
    var mapCode = new Array(6);
    for (let i = 0; i < 6; i++) mapCode[i] = new Array(4);
    //-> Codage dans le tableau
    mapCode[0][0] = "a";
    mapCode[0][1] = "b";
    mapCode[0][2] = "c";
    mapCode[0][3] = "d";
    mapCode[1][0] = "e";
    mapCode[1][1] = "f";
    mapCode[1][2] = "g";
    mapCode[1][3] = "h";
    mapCode[2][0] = "i";
    mapCode[2][1] = "j";
    mapCode[2][2] = "k";
    mapCode[2][3] = "l";
    mapCode[3][0] = "m";
    mapCode[3][1] = "n";
    mapCode[3][2] = "o";
    mapCode[3][3] = "p";
    mapCode[4][0] = "q";
    mapCode[4][1] = "r";
    mapCode[4][2] = "s";
    mapCode[4][3] = "t";
    mapCode[5][0] = "u";
    mapCode[5][1] = "v";
    mapCode[5][2] = "w";
    mapCode[5][3] = "x";
    console.log(mapCode);


    $(".controls .aBtn").on("click", function (e) {
        e.preventDefault();
        if ($(this).attr("action") === "noall") {
            $(".aBtn").removeClass("fcs");
            $(this).addClass("fcs");
        } else {
            $(this).parent().children(".aBtn").removeClass("fcs");
            $(this).addClass("fcs");
        }
    })

    //-> Markage des lil
    $(".lilbox .lil").on("click", function (e) {
        e.preventDefault();
        var result = getCodeLetter();
        if (result !== "false") {
            if (result === "reset") {
                $(this).removeClass().addClass("lil")
            } else {
                $(this).removeClass().addClass("lil").addClass(result);
                if (result === "i" || result === "j" || result === "k" || result === "l")
                    $(this).addClass("usT");
                else if (result === "a" || result === "b" || result === "c" || result === "d")
                    $(this).addClass("apple");
                else if (result === "m" || result === "n" || result === "o" || result === "p")
                    $(this).addClass("usB");
                else if (result === "q" || result === "r" || result === "s" || result === "t")
                    $(this).addClass("usL");
                else if (result === "u" || result === "v" || result === "w" || result === "x")
                    $(this).addClass("usR");
            }
        }
    })
    //-> Suppresison d'une case
    $(".lilbox .lil").on("mousedown ", function (e) {
        e.preventDefault()
        switch (event.which) {
            case 3:
                $(this).removeClass().addClass("lil")
                break;
        }
    })
    //-> Generation du Code
    $(".two .make").on("click", function (e) {
        e.preventDefault();
        let lil = document.querySelectorAll(".lilbox .lil");
        let map = "";
        for (let i = 0; i < lil.length; i++) {
            if (lil[i].classList[1] === undefined)
                map = map + "Z";
            else
                map = map + lil[i].classList[1].toUpperCase()
        }
        $(".two .out code").text(map);
    })

    //-> Fonction de codage des instrutions
    function getCodeLetter() {
        var ins = $(".controls .fcs").attr("action")
        var req = $(".color .fcs").attr("action");


        switch (ins) {
            case "apple":
                ins = 0;
                break;
            case "botup":
                ins = 2;
                break;
            case "botbt":
                ins = 3;
                break;
            case "botlt":
                ins = 4;
                break;
            case "botrg":
                ins = 5;
                break;
            default:
                ins = 1;
                break;
        }
        switch (req) {
            case "colorange":
                req = 1;
                break;
            case "colblue":
                req = 2;
                break;
            case "colgreen":
                req = 3;
                break;
            case "noall":
                req = "reset";
                break;
            default:
                req = 59;
                break;
        }
        if (req === 59) {
            return "false";
        } else if (req === "reset") {
            return req;
        } else {
            return mapCode[ins][req];
        }

    }
})