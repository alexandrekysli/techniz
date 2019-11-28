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
  var niveau = "";
  var lilbox = 0;
  var lilB = 0;
  var zzlemap = new Array(14);
  for (let i = 0; i < 14; i++) zzlemap[i] = new Array(15);

  var stackSize = 0;
  var all = true;
  var appleG = 0;
  var appleP = [];
  var lvlPass = false;
  var times = 0;
  var levelN = 0;
  var theft = false;
  var gisFinish = false;
  var interval = 200;
  var intervalF = 0;
  var next = 0;
  var endState = "";
  var stepB = [];
  var funcStack = {
    f1: [],
    f2: [],
    f3: [],
    f4: [],
    f5: []
  };
  var levelStack = [];
  var json0;
  var levelO;
  var chrono;
  var libTime = document.querySelector(".head .times");
  var appleV = document.querySelector(".head .apples h2");
  var levelV = document.querySelector(".head .logo .stage span");
  var secondeT = 0;
  const niveauF = 0;

  /* -> Chargement du JSON
   * Ici d'st via JQuery car le fichier est local mais avec
   * la dynamisation sous mongoose, vous devez envoyer tout les stage dans un JSON
   * Et reecrir cette partie
   */
  $.getJSON("level.json", function (jsonF) {
    console.log("Fichier JSON chargé avec Succès");
    json0 = jsonF;
    levelO = getNiveau(jsonF);
    //-> Initialisation du Compte a rebour
    times = jsonF.time * 60;
    secondeT = 1;
    libTime.classList.add("tplay");
    chrono = setInterval(() => {
      secondeT++;
      //-> Mise en forme du temps
      var minute = parseInt((times - secondeT + 1) / 60);
      var ssec = (times - secondeT + 1) % 60;

      libTime.innerText =
        (minute < 10 ? "0" + minute : minute) +
        ":" +
        (ssec < 10 ? "0" + ssec : ssec);
      if (times - secondeT < 0) {
        libTime.classList.remove("tplay");
        endStage("over");
      }
    }, 1000);
    levelN = 1;
    levelV.innerText = levelN;
    gameInit();
  });

  //-> Fin du chargement du JSON

  function gameInit() {
    //-> Chargement du niveau
    if (lvlPass) {
      //-> Si niveau actuelle terminé
      levelO = getNiveau(json0);
      levelN++;
      levelV.innerText = levelN;
    }
    niveau = levelO.map;
    lilbox = 0;
    lilB = 0;
    appleV.innerText = "0";
    $(".controls .aBtn").removeClass("active");
    if (all || lvlPass) {
      $(".stp")
        .children()
        .html("")
        .removeClass();

      //-> Mise en forme des fonctions
      var inpFunc = document.querySelector(".fonctions .inputs");
      var actFunc = document.querySelector(".actions .dir");
      //-> Supprimer les anciens elements
      $(".inputs .fonction").remove();
      $(".dir .function").remove();

      for (let i = 0; i < levelO.fct.length; i++) {
        let item = i;
        //-> Liste d'Action
        let actDiv = document.createElement("div");
        actDiv.classList.add("fonction", "f" + (i + 1));
        let lib = document.createElement("div");
        lib.className = "lib";
        lib.innerText = "F" + (i + 1);
        let stp = document.createElement("div");
        stp.className = "stp";
        for (let i = 0; i < levelO.fct[item].lgt; i++) {
          let child = document.createElement("button");
          stp.appendChild(child);
        }
        actDiv.appendChild(lib);
        actDiv.appendChild(stp);
        //-> Button d'Action
        let button = document.createElement("button");
        button.classList.add("function", "aBtn");
        button.setAttribute("action", "function");
        button.innerHTML = "F" + (i + 1);

        //-> Injection HTML
        inpFunc.appendChild(actDiv);
        actFunc.appendChild(button);
      }
      all = false;
    }
    lvlPass = false;

    clearTimeout(intervalF);
    //-> Mise en forme du plateau
    lilbox = document.querySelector(".one .lilbox");
    lilbox.innerHTML = "";
    for (let i = 0; i < 210; i++) {
      let lil = document.createElement("div");
      lil.className = "lil";
      lilbox.appendChild(lil);
    }
    lilB = document.querySelectorAll(".lilbox .lil");
    for (let i = 0; i < niveau.length; i++) {
      var car = niveau.charAt(i);
      switch (car) {
        case "A":
          lilB[i].classList.add("apple");
          lilB[i].classList.add("a");
          lilB[i].setAttribute("clr", "a");
          break;
        case "B":
          lilB[i].classList.add("apple");
          lilB[i].classList.add("b");
          lilB[i].setAttribute("clr", "b");
          break;
        case "C":
          lilB[i].classList.add("apple");
          lilB[i].classList.add("c");
          lilB[i].setAttribute("clr", "c");
          break;
        case "D":
          lilB[i].classList.add("apple");
          lilB[i].classList.add("d");
          lilB[i].setAttribute("clr", "d");
          break;
        case "E":
          lilB[i].classList.add("case");
          lilB[i].classList.add("e");
          lilB[i].setAttribute("clr", "e");
          break;
        case "F":
          lilB[i].classList.add("case");
          lilB[i].classList.add("f");
          lilB[i].setAttribute("clr", "f");
          break;
        case "G":
          lilB[i].classList.add("case");
          lilB[i].classList.add("g");
          lilB[i].setAttribute("clr", "g");
          break;
        case "H":
          lilB[i].classList.add("case");
          lilB[i].classList.add("h");
          lilB[i].setAttribute("clr", "h");
          break;
        case "I":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usT");
          lilB[i].classList.add("i");
          lilB[i].setAttribute("clr", "i");
          break;
        case "J":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usT");
          lilB[i].classList.add("j");
          lilB[i].setAttribute("clr", "j");
          break;
        case "K":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usT");
          lilB[i].classList.add("k");
          lilB[i].setAttribute("clr", "k");
          break;
        case "L":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usT");
          lilB[i].classList.add("l");
          lilB[i].setAttribute("clr", "l");
          break;
        case "M":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usB");
          lilB[i].classList.add("m");
          lilB[i].setAttribute("clr", "m");
          break;
        case "N":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usB");
          lilB[i].classList.add("n");
          lilB[i].setAttribute("clr", "n");
          break;
        case "O":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usB");
          lilB[i].classList.add("o");
          lilB[i].setAttribute("clr", "o");
          break;
        case "P":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usB");
          lilB[i].classList.add("p");
          lilB[i].setAttribute("clr", "p");
          break;
        case "Q":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usL");
          lilB[i].classList.add("q");
          lilB[i].setAttribute("clr", "q");
          break;
        case "R":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usL");
          lilB[i].classList.add("r");
          lilB[i].setAttribute("clr", "r");
          break;
        case "S":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usL");
          lilB[i].classList.add("s");
          lilB[i].setAttribute("clr", "s");
          break;
        case "T":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usL");
          lilB[i].classList.add("t");
          lilB[i].setAttribute("clr", "t");
          break;
        case "U":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usR");
          lilB[i].classList.add("u");
          lilB[i].setAttribute("clr", "u");
          break;
        case "V":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usR");
          lilB[i].classList.add("v");
          lilB[i].setAttribute("clr", "v");
          break;
        case "W":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usR");
          lilB[i].classList.add("w");
          lilB[i].setAttribute("clr", "w");
          break;
        case "X":
          lilB[i].classList.add("user");
          lilB[i].classList.add("usR");
          lilB[i].classList.add("x");
          lilB[i].setAttribute("clr", "x");
          break;
      }
    }

    //-> Creation de la carte + mappage du DOM
    var pos = 0;
    for (let i = 0; i < 14; i++) {
      for (let j = 0; j < 15; j++) {
        zzlemap[i][j] = niveau.charAt(pos);
        lilB[pos].setAttribute("y", i);
        lilB[pos].setAttribute("x", j);
        pos++;
      }
    }

    //-> Determination du nombre d'apple + position de chacune
    appleG = document.querySelectorAll(".lilbox .apple").length;
    appleV.innerText = appleG;

    let appleC = document.querySelectorAll(".lilbox .apple");
    appleP = [];
    for (let i = 0; i < appleC.length; i++) {
      appleP.push({
        x: appleC[i].getAttribute("x"),
        y: appleC[i].getAttribute("y")
      });
    }
    theft = false;

    //-> Les StepLil
    document.querySelector(".stepslil").innerHTML = "";
  }

  //-> Execution du script
  $(".runControl button").on("click", function (e) {
    //-> Retirer le focus sur un les boutons
    $(this)
      .parent()
      .children("button")
      .removeClass("active");

    $(this).addClass("active");

    let action = $(this).attr("action");

    //-> Executer toute les instructions
    if (action === "all") {
      document.querySelector(".stepslil").innerHTML = "";
      stepB = [];
      stackMaker(document.querySelectorAll(".inputs .fonction"));
    } else if (action === "stop") {
      btnState(false);
    } else if (action === "reset") {
      all = true;
      btnState(false);
    } else if (action === "pause") {
      clearInterval(intervalF);
    }
    //-> Changer vitesse d'execution dus programme
    if (action === "low") {
      interval = 200;
    } else if (action === "medium") {
      interval = 50;
    } else if (action === "fast") {
      interval = 15;
    } else if (action === "slow") {
      interval = 1000;
    }
  });

  //-> Selection d'une case d'instruction
  $(".inputs").on("click", ".stp button", function (e) {
    $(".stp button").removeClass("btnsel");
    $(this).toggleClass("btnsel");
  });
  //-> Ajout d'une instruction par case
  $(".actions").on("click", "button", function (e) {
    if ($(".stp .btnsel").length) {
      let action = $(this).attr("action");

      if (action === "toup") {
        $(".stp .btnsel").html(`<i class="fas fa-arrow-up"></i>`);
      } else if (action === "toleft") {
        $(".stp .btnsel").html(`<i class="fas fa-reply"></i>`);
      } else if (action === "toright") {
        $(".stp .btnsel").html(`<i class="fas fa-share"></i>`);
      } else if (action === "function") {
        $(".stp .btnsel")
          .html("<span>" + $(this).text() + "</span>")
          .children()
          .addClass("yix " + $(this).text());
      } else if (action === "colorange") {
        $(".stp .btnsel")
          .removeClass("btnblue")
          .removeClass("btngreen")
          .addClass("btnorange");
      } else if (action === "colblue") {
        $(".stp .btnsel")
          .removeClass("btnorange")
          .removeClass("btngreen")
          .addClass("btnblue");
      } else if (action === "colgreen") {
        $(".stp .btnsel")
          .removeClass("btnorange")
          .removeClass("btnblue")
          .addClass("btngreen");
      } else if (action === "nocol") {
        $(".stp .btnsel")
          .removeClass("btnorange")
          .removeClass("btnblue")
          .removeClass("btngreen");
      } else if (action === "noall") {
        $(".stp .btnsel")
          .removeClass("btnorange")
          .removeClass("btnblue")
          .removeClass("btngreen")
          .html("");
      }
    }
  });

  //-> Creation de la pile de Instructions
  function stackMaker(funcDiv) {
    let funcNum = $(funcDiv).length;

    for (let i = 0; i < funcNum; i++) {
      let fonction = $(funcDiv)[i];
      let funcName = fonction.classList[1];
      //-> Vider le tableau de ses elements
      funcStack[funcName] = [];

      //-> Parcour des instructions formulée
      //-> Recuperation du nombre d'instruction max de la fonction
      let max = $(fonction)
        .children(".stp")
        .children().length;

      for (let i = 0; i < max; i++) {
        let step = $(fonction)
          .children(".stp")
          .children()[i];
        let stepReq = step.classList.value;
        let stepI;
        if ($(step).children().length)
          stepI = $(step).children()[0].classList[1];

        //-> Mis een forme des instructions
        //-> Conditions
        if (stepReq.includes("btngreen")) stepReq = "GC";
        else if (stepReq.includes("btnblue")) stepReq = "BC";
        else if (stepReq.includes("btnorange")) stepReq = "OC";
        else stepReq = "NC";

        //-> Instructions
        if (stepI) {
          if (stepI.includes("fa-arrow-up")) stepI = "MV";
          else if (stepI.includes("fa-reply")) stepI = "TL";
          else if (stepI.includes("fa-share")) stepI = "TR";
          else if (stepI.includes("F1")) stepI = "F1";
          else if (stepI.includes("F2")) stepI = "F2";
          else if (stepI.includes("F3")) stepI = "F3";
          else if (stepI.includes("F4")) stepI = "F4";
          else if (stepI.includes("F5")) stepI = "F5";
        } else stepI = "";

        if (stepI != "") {
          funcStack[funcName].push({
            req: stepReq,
            act: stepI
          });
        }
      }
    }
    if (funcStack.f1.length) makeStep(funcStack);
  }

  //-> Fonction qui retourne les coordonnées du personnage
  function userPos() {
    return {
      x: $(".lilbox .user").attr("x"),
      y: $(".lilbox .user").attr("y")
    };
  }

  //-> Tableau d'instruction et mise en forme du DOM
  function makeStep(funcStack) {
    stackSize = 2000;
    finish = false;
    addfunction(funcStack.f1);
    playBot();
  }

  function addfunction(funcSO) {
    let frontStack = document.querySelector(".stepslil");
    let burn = false;
    let wd = "";
    for (let i = 0; i < funcSO.length; i++) {
      if (stackSize) {
        var stepBloc = document.createElement("div");
        stepBloc.classList.add("slil");
        wd = "";
        var step = funcSO[i];

        switch (step.req) {
          case "NC":
            stepBloc.classList.add("nc");
            wd = "nc";
            break;
          case "GC":
            stepBloc.classList.add("gc");
            wd = "gc";
            break;
          case "BC":
            stepBloc.classList.add("bc");
            wd = "bc";
            break;
          case "OC":
            stepBloc.classList.add("oc");
            wd = "oc";
            break;
        }
        switch (step.act) {
          case "MV":
            stepBloc.classList.add("mv");
            wd += "mv";
            burn = true;
            stackSize--;
            break;
          case "TL":
            stepBloc.classList.add("tl");
            wd += "tl";
            burn = true;
            stackSize--;
            break;
          case "TR":
            stepBloc.classList.add("tr");
            wd += "tr";
            burn = true;
            stackSize--;
            break;
          case "F1":
            //addfunction(funcStack.f1);
            stepBloc.classList.add("f1");
            wd += "f1";
            burn = true;
            break;
          case "F2":
            //addfunction(funcStack.f2);
            stepBloc.classList.add("f2");
            wd += "f2";
            burn = true;
            break;
          case "F3":
            //addfunction(funcStack.f3);
            stepBloc.classList.add("f3");
            wd += "f3";
            burn = true;
            break;
          case "F4":
            //addfunction(funcStack.f4);
            stepBloc.classList.add("f4");
            wd += "f4";
            burn = true;
            break;
          case "F5":
            //addfunction(funcStack.f5);
            stepBloc.classList.add("f5");
            wd += "f5";
            burn = true;
            break;
          default:
            burn = false;
        }
        if (burn && stackSize) {
          if (wd.length > 2) {
            frontStack.appendChild(stepBloc);
            stepB.push(wd);
          }
        }
      }
    }
  }

  //-> Phase d'execution du Jeu
  function playBot() {
    intervalF = setTimeout(() => {
      let result = moveBot(stepB[0]);
      if (result === false) {
        endStage("sameO");
      } else {
        if (!appleG) {
          endStage("next");
          //alert("NIVEAU TERMINE BRAVO");
        } else if (!stepB.length) {
          endStage("sameS");
        } else {
          if (!theft) {
            playBot();
          } else {
            endStage("theft");
          }
        }
      }
    }, interval);
  }

  //-> Deplacement du perso + Verification
  function moveBot(stepE) {
    let req = stepE.toUpperCase().slice(0, 2);
    let ins = stepE.toUpperCase().slice(2, 4);
    let bot = document.querySelector(".lilbox .user");
    var frontStack = document.querySelector(".stepslil");

    //-> Verification de la contrainte
    let caseCLr = colinker(bot.getAttribute("clr"));

    if (caseCLr === req || req === "NC") {
      if (ins === "MV") {
        //-> Deplacement
        let botD = bot.classList;
        if (botD.value.includes("usR")) {
          var newPos = document.querySelector(
            '[x="' + changeXY("usR").x + '"][y="' + changeXY("usR").y + '"]'
          );
          //-> Deplacement du Bot
          if (newPos.classList.contains("apple")) {
            theft = areTheft(newPos);
            newPos.classList.remove("apple");
            newPos.classList.add("user");
            newPos.classList.add("usR");
          } else if (newPos.classList.contains("case")) {
            newPos.classList.add("user");
            newPos.classList.add("usR");
          } else {
            return false;
          }
          bot.classList.add("case");
          bot.classList.remove("user");
          bot.classList.remove("usR");
        } else if (botD.value.includes("usT")) {
          var newPos = document.querySelector(
            '[x="' + changeXY("usT").x + '"][y="' + changeXY("usT").y + '"]'
          );
          //-> Deplacement du Bot
          if (newPos.classList.contains("apple")) {
            theft = areTheft(newPos);
            newPos.classList.remove("apple");
            newPos.classList.add("user");
            newPos.classList.add("usT");
          } else if (newPos.classList.contains("case")) {
            newPos.classList.add("user");
            newPos.classList.add("usT");
          } else {
            return false;
          }
          bot.classList.add("case");
          bot.classList.remove("user");
          bot.classList.remove("usT");
        } else if (botD.value.includes("usL")) {
          var newPos = document.querySelector(
            '[x="' + changeXY("usL").x + '"][y="' + changeXY("usL").y + '"]'
          );
          //-> Deplacement du Bot
          if (newPos.classList.contains("apple")) {
            theft = areTheft(newPos);
            newPos.classList.remove("apple");
            newPos.classList.add("user");
            newPos.classList.add("usL");
          } else if (newPos.classList.contains("case")) {
            newPos.classList.add("user");
            newPos.classList.add("usL");
          } else {
            return false;
          }
          bot.classList.add("case");
          bot.classList.remove("user");
          bot.classList.remove("usL");
        } else if (botD.value.includes("usB")) {
          var newPos = document.querySelector(
            '[x="' + changeXY("usB").x + '"][y="' + changeXY("usB").y + '"]'
          );
          //-> Deplacement du Bot
          if (newPos.classList.contains("apple")) {
            theft = areTheft(newPos);
            newPos.classList.remove("apple");
            newPos.classList.add("user");
            newPos.classList.add("usB");
          } else if (newPos.classList.contains("case")) {
            newPos.classList.add("user");
            newPos.classList.add("usB");
          } else {
            return false;
          }
          bot.classList.add("case");
          bot.classList.remove("user");
          bot.classList.remove("usB");
        }
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);
      } else if (ins === "TL") {
        //-> Tourner a Gauche
        let botD = bot.classList;
        if (botD.value.includes("usR")) {
          bot.classList.remove("usR");
          bot.classList.add("usT");
        } else if (botD.value.includes("usT")) {
          bot.classList.remove("usT");
          bot.classList.add("usL");
        } else if (botD.value.includes("usL")) {
          bot.classList.remove("usL");
          bot.classList.add("usB");
        } else if (botD.value.includes("usB")) {
          bot.classList.remove("usB");
          bot.classList.add("usR");
        }
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);
      } else if (ins === "TR") {
        //-> Tourner a Gauche
        let botD = bot.classList;

        if (botD.value.includes("usR")) {
          bot.classList.remove("usR");
          bot.classList.add("usB");
        } else if (botD.value.includes("usT")) {
          bot.classList.remove("usT");
          bot.classList.add("usR");
        } else if (botD.value.includes("usL")) {
          bot.classList.remove("usL");
          bot.classList.add("usT");
        } else if (botD.value.includes("usB")) {
          bot.classList.remove("usB");
          bot.classList.add("usL");
        }
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);
      } else if (ins === "F1") {
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);

        addfunction(funcStack.f1);
      } else if (ins === "F2") {
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);

        addfunction(funcStack.f2);
      } else if (ins === "F3") {
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);

        addfunction(funcStack.f3);
      } else if (ins === "F4") {
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);

        addfunction(funcStack.f4);
      } else if (ins === "F5") {
        stepB.shift();
        frontStack.removeChild(frontStack.firstChild);

        addfunction(funcStack.f5);
      }
    } else {
      stepB.shift();
      frontStack.removeChild(frontStack.firstChild);
    }
  }

  function colinker(key) {
    switch (key) {
      case "a":
      case "e":
      case "i":
      case "m":
      case "q":
      case "u":
        return "NC";
      case "b":
      case "f":
      case "j":
      case "n":
      case "r":
      case "v":
        return "OC";
      case "c":
      case "g":
      case "k":
      case "o":
      case "s":
      case "w":
        return "BC";
      case "d":
      case "h":
      case "l":
      case "p":
      case "t":
      case "x":
        return "GC";
    }
  }

  function changeXY(direction) {
    if (direction === "usB") {
      return {
        x: parseInt(userPos().x),
        y: parseInt(userPos().y) + 1
      };
    } else if (direction === "usT") {
      return {
        x: parseInt(userPos().x),
        y: parseInt(userPos().y) - 1
      };
    } else if (direction === "usL") {
      return {
        x: parseInt(userPos().x) - 1,
        y: parseInt(userPos().y)
      };
    } else if (direction === "usR") {
      return {
        x: parseInt(userPos().x) + 1,
        y: parseInt(userPos().y)
      };
    }
  }

  function btnState(state) {
    if (state) {
      $(".aBtn")
        .prop("disabled", true)
        .addClass("disabled");
    } else {
      $(".controls .aBtn")
        .prop("disabled", false)
        .removeClass("disabled")
        .removeClass("active");
      $(".speed .aBtn")
        .prop("disabled", false)
        .removeClass("disabled");
      $("#reset").removeClass("active");
      gameInit();
    }
  }

  function areTheft(position) {
    var check = true;
    for (let i = 0; i < appleP.length; i++) {
      if (
        position.getAttribute("x") === appleP[i].x &&
        position.getAttribute("y") === appleP[i].y
      )
        check = false;
    }
    if (!check) {
      appleG--;
      appleV.innerText = appleG;
    }
    return check;
  }

  function getNiveau(json0) {
    //-> Tirer un nombre aleatoire afin de melanger les niveaus
    var nombreX = 0;
    do {
      nombreX =
        Math.floor(Math.random() * (json0.level.length - 1 - 0 + 1)) + 0;
    } while (levelStack.includes(nombreX));
    levelStack.push(nombreX);
    let levelNum = nombreX;

    //-> Renvoi du niveau
    return json0.level[nombreX];
  }

  function endStage(state) {
    let result = document.querySelector(".box0 .results");
    let logI = document.querySelector(".results .log i");
    let logL = document.querySelector(".results .log .lib");
    let info = document.querySelector(".results .info");
    let button = document.querySelector(".results .controls button");

    //-> Fonction de fin de stage
    if (state === "next") {
      //-> Niveau Terminé
      //-> Verification si plus de Niveau
      if (json0.level.length === levelStack.length) {
        gisFinish = true;
        endStage("over");
      } else {
        logI.classList.remove("fa-exlamation-circle");
        logI.classList.add("fa-check-circle");
        logL.innerText = "Niveau Validé";
        info.innerText =
          "Votre robot a recuperé toutes les energies de ce niveau";
        button.innerText = "Suivant";
        $(result).fadeIn("slow");
        endState = state;
      }
    } else if (state === "sameO") {
      //-> Niveau Echoué -> Sortie des case
      logI.classList.remove("fa-check-circle");
      logI.classList.add("fa-exclamation-circle");
      logL.innerText = "Niveau Echoué";
      info.innerText =
        "Votre robot s'est perdu - Tachez de le maintenir dans des cases de couleur";
      button.innerText = "Reprendre";
      $(result).fadeIn("slow");
      endState = state;
    } else if (state === "sameS") {
      //-> Niveau Echoué -> Stack vide
      logI.classList.remove("fa-check-circle");
      logI.classList.add("fa-exclamation-circle");
      logL.innerText = "Niveau Echoué";
      info.innerText =
        "Votre robot a executé trop d'action - Batterie Dechargée";
      button.innerText = "Reprendre";
      $(result).fadeIn("slow");
      endState = state;
    } else if (state === "over") {
      //-> Niveau Echoué -> Temp Ecoulé
      if (gisFinish) {
        logI.classList.remove("fa-exlamation-circle");
        logI.classList.add("fa-check-circle");
        logL.innerText = "Evaluation Terminée";
        info.innerText =
          "Vous avez terminez tous les niveaux - Félicitation à vous !!!";
        endState = "over";
        button.innerText = "Valider";
      } else {
        logI.classList.remove("fa-check-circle");
        logI.classList.add("fa-exclamation-circle");
        logL.innerText = "Partie Terminée";
        info.innerText = "Plus de temps disponible - Merci de votre Temps";
        button.innerText = "Valider";
        endState = state;
      }
      //-> Enregistrement du Niveau et du temps mis en secondes -> Partie Terminée
      console.log(
        "Partie Terminée au Niveau [" +
        levelV.textContent +
        "] en [" +
        secondeT +
        "] Secondes"
      );
      clearInterval(chrono);

      $(result).fadeIn("slow");
    } else if (state === "theft") {
      //-> Niveau Echoué -> Triche
      logI.classList.remove("fa-check-circle");
      logI.classList.add("fa-exclamation-circle");
      logL.innerText = "Partie Terminée";
      info.innerText = "NaN ne tolère pas la Tricherie - Vous etes Banni";
      button.innerText = "Fermer";
      $(result).fadeIn("slow");
      endState = state;
    }
  }

  //-> Bouton de la bulle d'information
  $(".state .controls button").on("click", function () {
    if (endState === "next") {
      $(".box0 .results").fadeOut("slow");
      lvlPass = true;
      gameInit();
    } else if (endState === "sameO" || endState === "sameS") {
      $(".box0 .results").fadeOut("slow");
      lvlPass = false;
      gameInit();
    } else if (endState === "over") {
      //-> Instruction a executer en fin de partie
    } else if (endState === "theft") {
      //-> Instruction a executer si l'utilisateur a Triché
    }
  });
});