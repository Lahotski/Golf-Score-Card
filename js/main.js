(GolfCard = function () {
    var GameData = {
        players: [],
        courseData: {},
        courseLocalData: {},
        dateOfGame: {},
        score: "",
        attest: "",
        currentHole: 1, outTotal: function (tee) {
            //tees
            var count = 0;
            for (var i = 0; i < 9; i++) {
            count += this.courseData.course.holes[i].tee_boxes[tee].yards;
            }
            return count;
        },
        inTotal: function (tee) {
            var count = 0;
            for (var i = 9; i < 18; i++) {
                count += this.courseData.course.holes[i].tee_boxes[tee].yards;
            }
            return count;
        },
        total: function (tee) {
            var count = 0;
            if (this.courseData.course.hole_count > 9) {
                count += this.inTotal(tee)
            }
            return count + this.outTotal(tee);
        },
        parOutTotal: function () {
            //par
            var count = 0;
            for (var i = 0; i < 9; i++) {
                count += this.courseData.course.holes[i].tee_boxes[0].par;
            }
            return count;
        },
        parInTotal: function () {
            var count = 0;
            for (var i = 9; i < 18; i++) {
                count += this.courseData.course.holes[i].tee_boxes[0].par;
            }
            return count;
        },
        parTotal: function () {
            var count = 0;
            if (this.courseData.course.hole_count > 9) {
                count += this.parInTotal()
            }
            return count + this.parOutTotal();
        },
        uniqueName: function (indexToIgnore, nameToCheck) {
            var unique = true;
            for (var index = 0; index < this.players.length; index++) {
                if (index == indexToIgnore) {
                    continue;
                }
                if (this.players[index].name == nameToCheck) {
                    unique = false;
                }
            }
            return unique;
        },
        teeBoxCount: function () {
            //tee Box
            var teeBoxCount = 3;
            for (var row = 0; row < GameData.courseData.course.holes[0].tee_boxes.length; row++) {
                if (GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "pro" ||
                    GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "champion" ||
                    GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "men" ||
                    GameData.courseData.course.holes[0].tee_boxes[row].tee_type == "women"
                ) {
                    teeBoxCount++;
                }
            }
            return teeBoxCount;
        }
    };
    var Player = function (name, playerNumber, teeType, scores) {
        //player
        this.name = name;
        this.playerNumber = playerNumber;
        this.teeType = teeType;
        this.scores = scores;
        this.total = function () {
            var val = 0;
            for (var i = 0; i < 18; i++) {
                val += this.scores[i];
            }
            return val;
        }
        this.outTotal = function () {
            var val = 0;
            for (var i = 0; i < 9; i++) {
                val += this.scores[i];
            }
            return val;
        }
        this.inTotal = function () {
            var val = 0;
            for (var i = 9; i < 18; i++) {
                val += this.scores[i];
            }
            return val;
        }
    };

    function resetScoreCard() {
        //Reset Score Card for every new player
        var el = $("#score-card-tbl");
        el.find("thead").html("");
        el.find("tbody").html("");
    }
    function buildCourseRow(course) {
       //course build 
        var trElement = $("<tr></tr>");
        var tdElement = $("<td></td>");
        var radButton = $('<input type="radio" name="course-selected">');
        var link;

        trElement.attr("id", "r-course-" + course.id);
        trElement.attr("data-course", course.id);
        tdElement.click(function () {
            $(".rad-" + course.id).find("input").prop("checked", true);
            $("#select-course-btn").prop("disabled", false);
        });

        radButton.attr("value", course.id);
        tdElement.addClass("rad-" + course.id);
        tdElement.append(radButton);
        trElement.append(tdElement);
        tdElement = $("<td></td>");
        link = $('<a href="' + course.website + '">' + course.name + '</a>');
        link.addClass("link");
        tdElement.append(link);
        trElement.append(tdElement);
        tdElement = $("<td></td>");
        link = $('<a href="tel:' + course.phone + '">' + course.phone + '</a>');
        tdElement.append(link);
        trElement.append(tdElement);
        tdElement = $("<td></td>");
        if (course.membership_type === "public") {
            tdElement.addClass("public");
            tdElement.html('<span class="glyphicon glyphicon-ok-sign"></span>');
        } else {
            tdElement.addClass("private");
            tdElement.html('<span class="glyphicon glyphicon-remove-sign"></span>');
        }
        trElement.append(tdElement);

        tdElement = $("<td></td>");
        tdElement.text(course.hole_count);
        trElement.append(tdElement);

        $("#select-course-tbl").find("tbody").append(trElement);
    }
    function buildHolesRow(display) {
        var tableHead = $("#score-card-tbl thead");

        var trElement = $("<tr></tr>");
        var thElement = $("<th></th>");
        trElement.attr("id", "h-row-hole");
        thElement.attr("id", "label-hole");
        thElement.addClass("header hole");
        thElement.text("Hole");
        tableHead.append(trElement);
        trElement.append(thElement);

        var rowHole = $('#h-row-hole');

        if (display === "all" || display === "front") {
            for (var i = 1; i < 10; i++) {
                thElement = $("<th></th>");
                thElement.text(i);
                thElement.attr("id", "hole" + i);
                thElement.addClass("hole");
                rowHole.append(thElement);
            }

            thElement = $("<th></th>");
            thElement.text("OUT");
            thElement.attr("id", "out-label");
            thElement.addClass("hole");
            rowHole.append(thElement);
        }
        if (display === "all") {
            thElement = $("<th></th>");
            thElement.text("INITIAL");
            thElement.attr("id", "spacer-label");
            thElement.attr("rowspan", "6")
            thElement.addClass("spacer-col empty");
            rowHole.append(thElement);
        }
        if (display === "all" || display === "back") {
            for (var i = 10; i < 19; i++) {
                thElement = $("<th></th>");
                thElement.text(i);
                thElement.attr("id", "hole" + i);
                thElement.addClass("hole");
                rowHole.append(thElement);
            }
            thElement = $("<th></th>");
            thElement.text("IN");
            thElement.attr("id", "in-label");
            thElement.addClass("hole");
            rowHole.append(thElement)
        }
        thElement = $("<th></th>");
        thElement.text("TOTAL");
        thElement.attr("id", "total-label");
        thElement.addClass("hole");
        rowHole.append(thElement);
    }
    function buildParRow(display) {
        var trElement = $("<tr></tr>");
        var thElement = $("<th></th>");

        trElement.attr("id", "h-row-par");
        thElement.attr("id", "label-par");
        thElement.addClass("header par");
        thElement.text("Par");
        tableHead.append(trElement);
        trElement.append(thElement);

        var rowPar = $('#h-row-par');

        if (display === "all" || display === "front") {
            for (var i = 1; i < 10; i++) {
                thElement = $("<th></th>");
                thElement.text("-");
                thElement.attr("id", "par" + i);
                thElement.addClass("par");
                rowPar.append(thElement);
            }
            thElement = $("<th></th>");
            thElement.text("-");
            thElement.attr("id", "out-par");
            thElement.addClass("par");
            rowPar.append(thElement);
        }
        if (display === "all" || display === "back") {
            for (i = 10; i < 19; i++) {
                thElement = $("<th></th>");
                thElement.text("-");
                thElement.attr("id", "par" + i);
                thElement.addClass("par");
                rowPar.append(thElement);
            }
            thElement = $("<th></th>");
            thElement.text("-");
            thElement.attr("id", "in-par");
            thElement.addClass("par");
            rowPar.append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text("-");
        thElement.attr("id", "total-par");
        thElement.addClass("par");
        rowPar.append(thElement);
    }

    function buildFrontNine() {
        //Front 9 Build
        var thElement, teeType, tee, hole;
        var teeBoxCount = GameData.teeBoxCount();

        for (var i = 1; i < 10; i++) {
            thElement = $("<th></th>");
            thElement.text(i);
            thElement.attr("id", "hole-" + i);
            thElement.addClass("hole hole-number");
            thElement.click(holeClick);
            $("#h-row-hole").append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text("OUT");
        thElement.attr("id", "out-label");
        thElement.addClass("hole");
        $("#h-row-hole").append(thElement)
        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            for (hole = 0; hole < 9; hole++) {
                thElement = $("<th></th>");
                thElement.attr("id", "" + teeType + hole);
                thElement.addClass(teeType);
                thElement.text(GameData.courseData.course.holes[hole].tee_boxes[tee].yards);
                $("#h-row-hole" + teeType).append(thElement);
            }
            thElement = $("<th></th>");
            thElement.text(GameData.outTotal(tee));
            thElement.attr("id", "out-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
            thElement.addClass("out " + teeType);
            $("#h-row-hole" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
        }
        for (i = 0; i < 9; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].par);
            thElement.attr("id", "par" + i);
            thElement.addClass("par");
            $("#h-row-par").append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text(GameData.parOutTotal());
        thElement.attr("id", "out-par");
        thElement.addClass("par out");
        $("#h-row-par").append(thElement);
        for (i = 0; i < 9; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].hcp);
            thElement.attr("id", "handicap" + i);
            thElement.addClass("handicap");
            $("#h-row-handicap").append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text("");
        thElement.attr("id", "out-handicap");
        thElement.addClass("handicap out");
        $("#h-row-handicap").append(thElement);
    }

    function buildBackNine() {
        //Back 9 Build
        var i, tee, teeType, thElement, hole;
        var teeBoxCount = GameData.teeBoxCount();

        for (i = 10; i < 19; i++) {
            thElement = $("<th></th>");
            thElement.text(i);
            thElement.attr("id", "hole-" + i);
            thElement.addClass("hole hole-number");
            thElement.click(holeClick);
            $("#h-row-hole").append(thElement);
        }

        thElement = $("<th></th>");
        thElement.text("IN");
        thElement.attr("id", "in-label");
        thElement.addClass("hole");
        $("#h-row-hole").append(thElement)

        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            for (hole = 10; hole < 19; hole++) {
                thElement = $("<th></th>");
                thElement.attr("id", "" + teeType + hole);
                thElement.addClass(teeType);
                thElement.text(GameData.courseData.course.holes[hole - 1].tee_boxes[tee].yards);
                $("#h-row-" + teeType).append(thElement);
            }
            thElement = $("<th></th>");
            thElement.text(GameData.inTotal(tee));
            thElement.attr("id", "in-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
            thElement.addClass("in " + teeType);
            $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
        }
        for (i = 9; i < 18; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].par);
            thElement.attr("id", "par" + i);
            thElement.addClass("par");
            $("#h-row-par").append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text(GameData.parInTotal());
        thElement.attr("id", "in-par");
        thElement.addClass("par in");
        $("#h-row-par").append(thElement);
        for (i = 9; i < 18; i++) {
            thElement = $("<th></th>");
            thElement.text(GameData.courseData.course.holes[i].tee_boxes[0].hcp);
            thElement.attr("id", "handicap" + i);
            thElement.addClass("handicap");
            $("#h-row-handicap").append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text("");
        thElement.attr("id", "in-handicap");
        thElement.addClass("handicap in");
        $("#h-row-handicap").append(thElement);
    }

    function buildSingle() {
        //Single hole build
        var thElement, currentHole, teeType, tee, teeBoxCount;
        currentHole = GameData.currentHole;
        teeBoxCount = GameData.teeBoxCount();
        thElement = $("<th></th>");
        thElement.text(currentHole);
        thElement.attr("id", "hole-" + currentHole);
        thElement.addClass("hole hole-number");
        thElement.click(holeClick);
        $("#h-row-hole").append(thElement);
        if (currentHole < 10) {
            thElement = $("<th></th>");
            thElement.text("OUT");
            thElement.attr("id", "out-label");
            thElement.addClass("hole");
            $("#h-row-hole").append(thElement)
        } else {
            thElement = $("<th></th>");
            thElement.text("IN");
            thElement.attr("id", "in-label");
            thElement.addClass("hole");
            $("#h-row-hole").append(thElement)
        }
        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            thElement = $("<th></th>");
            thElement.attr("id", "" + teeType + currentHole);
            thElement.addClass(teeType);
            thElement.text(GameData.courseData.course.holes[currentHole - 1].tee_boxes[tee].yards);
            $("#h-row-" + teeType).append(thElement);

            if (currentHole < 10) {
                thElement = $("<th></th>");
                thElement.text(GameData.outTotal(tee));
                thElement.attr("id", "out-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
                thElement.addClass("out " + teeType);
                $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
            } else {
                thElement = $("<th></th>");
                thElement.text(GameData.inTotal(tee));
                thElement.attr("id", "in-label-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type);
                thElement.addClass("in " + teeType);
                $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
            }
        }
        thElement = $("<th></th>");
        thElement.text(GameData.courseData.course.holes[GameData.currentHole - 1].tee_boxes[0].hcp);
        thElement.attr("id", "handicap" + currentHole);
        thElement.addClass("handicap");
        $("#h-row-handicap").append(thElement);

        if (currentHole < 10) {
            thElement = $("<th></th>");
            thElement.text("");
            thElement.attr("id", "out-handicap");
            thElement.addClass("handicap out");
            $("#h-row-handicap").append(thElement);
        } else {
            thElement = $("<th></th>");
            thElement.text("");
            thElement.attr("id", "in-handicap");
            thElement.addClass("handicap in");
            $("#h-row-handicap").append(thElement);
        }
        if (currentHole < 10) {
            thElement = $("<th></th>");
            thElement.text(GameData.parOutTotal());
            thElement.attr("id", "out-par");
            thElement.addClass("par out");
            $("#h-row-par").append(thElement);
        } else {
            thElement = $("<th></th>");
            thElement.text(GameData.parInTotal());
            thElement.attr("id", "in-par");
            thElement.addClass("par in");
            $("#h-row-par").append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text(GameData.courseData.course.holes[currentHole - 1].tee_boxes[0].par);
        thElement.attr("id", "par" + currentHole);
        thElement.addClass("par");
        $("#h-row-par").append(thElement);
    }

    function buildCourseInfoFromData(display) {
        //build Course Info From Collected Data
        $("#golf-course-label").text(GameData.courseData.course.name);
        var tableHead = $("#score-card-tbl thead");
        tableHead.html("");
        var teeBoxCount = GameData.teeBoxCount();
        var trElement = $("<tr></tr>");
        var thElement = $("<th></th>");
        trElement.attr("id", "h-row-hole");
        thElement.attr("id", "label-hole");
        thElement.addClass("header hole");
        thElement.text("Hole");
        tableHead.append(trElement);
        trElement.append(thElement);
        for (var tee = 0; tee < teeBoxCount; tee++) {
            var teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
            trElement = $("<tr></tr>");
            thElement = $("<th></th>");

            trElement.attr("id", "h-row-hole" + teeType);
            thElement.attr("id", "label-hole" + teeType);
            thElement.addClass("header" + teeType);
            thElement.text(teeType);
            tableHead.append(trElement);
            trElement.append(thElement);
        }
        trElement = $("<tr id='handicap'>");
        thElement = $("<th id='label-handicap' class='handicap'>Handicap</th>");
        trElement.attr("id", "h-row-handicap");
        thElement.attr("id", "label-handicap");
        thElement.addClass("header handicap");
        thElement.text("Handicap");
        tableHead.append(trElement);
        trElement.append(thElement);
        trElement = $("<tr id='handicap'>");
        thElement = $("<th id='label-handicap' class='handicap'>Handicap</th>");

        trElement.attr("id", "h-row-par");
        thElement.attr("id", "label-par");
        thElement.addClass("header par");
        thElement.text("Par");
        tableHead.append(trElement);
        trElement.append(thElement);
        if (display !== "single") {
            $("#prev-hole-btn").slideUp();
            $("#next-hole-btn").slideUp();
        } else {
            $("#prev-hole-btn").slideDown();
            $("#next-hole-btn").slideDown();
        }
        if ($("#tee-select option").length == 0) {
            var select = $("#tee-select");
            var optionElement;
            for (tee = 0; tee < teeBoxCount; tee++) {
                teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;
                optionElement = $("<option></option>");
                optionElement.attr("id", "option-" + teeType);
                optionElement.attr("value", teeType.toLowerCase());
                optionElement.text(teeType);
                select.append(optionElement);
            }
        }
        if (display === "all") {
            buildFrontNine();
            if (display === "all") {
                thElement = $("<th></th>");
                thElement.text("INITIAL");
                thElement.attr("id", "spacer-label");
                thElement.attr("rowspan", teeBoxCount + 3);
                thElement.addClass("spacer-col empty");
                $("#h-row-hole").append(thElement);
            }
            buildBackNine();

        } else if (display === "front") {
            buildFrontNine();
        } else if (display === "back") {
            buildBackNine();
        } else if (display === "single") {
            buildSingle();
        }
        thElement = $("<th></th>");
        thElement.text("Total");
        thElement.attr("id", "total-hole");
        thElement.addClass("hole");
        $("#h-row-hole").append(thElement);

        for (tee = 0; tee < teeBoxCount; tee++) {
            teeType = GameData.courseData.course.holes[0].tee_boxes[tee].tee_type;

            thElement = $("<th></th>");
            thElement.text(GameData.total(tee));
            thElement.attr("id", "total-" + teeType);
            thElement.addClass("total " + teeType);
            $("#h-row-" + GameData.courseData.course.holes[0].tee_boxes[tee].tee_type).append(thElement);
        }
        thElement = $("<th></th>");
        thElement.text("");
        thElement.attr("id", "total-handicap");
        thElement.addClass("total handicap");
        $("#h-row-handicap").append(thElement);
        thElement = $("<th></th>");
        thElement.text(GameData.parTotal());
        thElement.attr("id", "total-par");
        thElement.addClass("total par");
        $("#h-row-par").append(thElement);
    }
    //Player Score Card Build
    function buildPlayerRow(display, playerData) {
        var trElement = $("<tr></tr>");
        trElement.attr("id", "b-row-player" + playerData.playerNumber);
        trElement.addClass("player");
        $("#player-rows").append(trElement);
        var tdElement = $("<td></td>");
        tdElement.attr("id", "name-player" + playerData.playerNumber);
        tdElement.addClass("player player-name " + playerData.teeType);
        trElement.append(tdElement);
        var textInput = $("<input type='text' id='" + "txt-player" + playerData.playerNumber + "-name' placeholder='Player Name' value='" + playerData.name + "'maxlength='25'>");
        textInput.addClass("player-txt " + playerData.teeType);
        textInput.attr("data-player", playerData.playerNumber);
        textInput.blur(nameChange);
        textInput.keyup(nameChange);
        tdElement.append(textInput);


        if (display === "all" || display === "front") {
            for (var i = 1; i < 10; i++) {
                tdElement = $("<td></td>");
                tdElement.attr("id", "player" + playerData.playerNumber + "-hole" + i);
                tdElement.addClass("player hole-cell " + playerData.teeType);
                textInput = $("<input type='number' id='" + "txt-player" + playerData.playerNumber + "-hole" + i + "' placeholder='0' value='" + playerData.scores[i - 1] + "'max='99' min='0' maxlength='2' asterSize='2'>");
                textInput.addClass("player-txt-hole");
                textInput.attr("data-player", playerData.playerNumber);
                textInput.attr("data-hole", i);
                textInput.blur(holeStrokeChange);
                textInput.keyup(holeStrokeChange);
                textInput.click(selectContents);
                textInput.focusin(selectContents);
                tdElement.append(textInput);
                trElement.append(tdElement);
            }
            tdElement = $("<td></td>");
            tdElement.text(playerData.outTotal());
            tdElement.attr("id", "out-player" + playerData.playerNumber);
            tdElement.addClass("player " + playerData.teeType);
            trElement.append(tdElement);
        }
        if (display === "all") {
            tdElement = $("<td></td>");
            tdElement.text("");
            tdElement.attr("id", "spacer-player" + playerData.playerNumber);
            tdElement.addClass("player empty");
            trElement.append(tdElement);
        }

        if (display === "all" || display === "back") {
            for (i = 10; i < 19; i++) {
                tdElement = $("<td></td>");
                tdElement.attr("id", "player" + playerData.playerNumber + "-hole" + i);
                tdElement.addClass("player " + playerData.teeType);
                textInput = $("<input type='number' id='" + "txt-player-" + playerData.playerNumber + "-hole" + i + "' placeholder='0' value='" + playerData.scores[i - 1] + "' max='99' min='0' maxlength='2' asterSize='2'>");
                textInput.addClass("player-txt-hole");
                textInput.attr("data-player", playerData.playerNumber);
                textInput.attr("data-hole", i);
                textInput.blur(holeStrokeChange);
                textInput.keyup(holeStrokeChange);
                textInput.click(selectContents);
                textInput.focusin(selectContents);
                tdElement.append(textInput);
                trElement.append(tdElement);
            }
            tdElement = $("<td></td>");
            tdElement.text(playerData.inTotal());
            tdElement.attr("id", "in-player" + playerData.playerNumber);
            tdElement.addClass("player " + playerData.teeType);
            trElement.append(tdElement);
        }

        if (display === "single") {
            tdElement = $("<td></td>");
            tdElement.attr("id", "player" + playerData.playerNumber + "-hole" + GameData.currentHole - 1);
            tdElement.addClass("player " + playerData.teeType);
            textInput = $("<input type='number' id='" + "txt-player-" + playerData.playerNumber + "-hole" + (GameData.currentHole - 1) + "' placeholder='0' value='" + playerData.scores[GameData.currentHole - 1] + "' max='99' min='0' maxlength='2' asterSize='2'>");
            textInput.addClass("player-txt-hole");
            textInput.attr("data-player", playerData.playerNumber);
            textInput.attr("data-hole", GameData.currentHole);
            textInput.blur(holeStrokeChange);
            textInput.keyup(holeStrokeChange);
            textInput.on("focus", selectContents);
            tdElement.append(textInput);
            trElement.append(tdElement);
            if (GameData.currentHole < 10) {
                tdElement = $("<td></td>");
                tdElement.text(playerData.outTotal());
                tdElement.attr("id", "out-player" + playerData.playerNumber);
                tdElement.addClass("player " + playerData.teeType);
                trElement.append(tdElement);
            } else {
                tdElement = $("<td></td>");
                tdElement.text(playerData.inTotal());
                tdElement.attr("id", "in-player" + playerData.playerNumber);
                tdElement.addClass("player " + playerData.teeType);
                trElement.append(tdElement);
            }

        }
        tdElement = $("<td></td>");
        tdElement.text(playerData.total());
        tdElement.attr("id", "total-player" + playerData.playerNumber);
        tdElement.addClass("player-total player " + playerData.teeType);
        var badge = $("<span>0</span>");
        badge.addClass("badge");
        badge.attr("id", "badge-" + playerData.playerNumber);
        badge.attr("data-toggle", "tooltip");
        badge.attr("data-placement", "top");
        tdElement.append(badge);
        trElement.append(tdElement);

        var offset = (GameData.players[playerData.playerNumber].total() - GameData.parTotal());
        if (offset < 0) {
            badge.removeClass("bad-score");
            badge.addClass("good-score");
            badge.attr("title", "Welcome to the PGA Tour");

        } else if (offset == 0) {
            badge.addClass()
        } else {
            offset = "+" + offset;
            badge.removeClass("good-score");
            badge.addClass("bad-score");
            badge.attr("title", "Better luck next time");
        }
        badge.tooltip();
        $("#badge-" + playerData.playerNumber).text(offset);
    }
    function buildcard(display) {
        resetScoreCard();
        if (GameData.courseData == undefined) {
            buildHolesRow(display);
            buildParRow(display);

            var select = $("#tee-select");
            var optionElement;
            optionElement = $("<option id='tee-select' class='form-control'>Pro</option>");
            optionElement.attr("id", "option-pro");
            optionElement.attr("value", "pro");
            optionElement.text("Pro");
            select.append(optionElement);
            optionElement = $("<option id='tee-select' class='form-control'>Champion</option>");
            optionElement.attr("id", "option-champion");
            optionElement.attr("value", "champion");
            optionElement.text("Champion");
            select.append(optionElement);
            optionElement = $("<option id='tee-select' class='form-control'>Men</option>");
            optionElement.attr("id", "option-men");
            optionElement.attr("value", "men");
            optionElement.text("Men");
            select.append(optionElement);
            optionElement = $("<option id='tee-select' class='form-control'>Women</option>");
            optionElement.attr("id", "option-women");
            optionElement.attr("value", "women");
            optionElement.text("Women");
            select.append(optionElement);
        } else {
            buildCourseInfoFromData(display);
        }


        for (var i = 0; i < GameData.players.length; i++) {
            buildPlayerRow(display, GameData.players[i]);
        }

    }
    function addPlayer() {
        //add 1 player
        var checkedDisplayValue = $('input[name="hole-display-option"]:checked').val();
        var selectedTee = $("#tee-select option:selected").val();
        var playerName = $("#new-player-name").val();
        var playerNum = GameData.players.length;
        var player = new Player(playerName, playerNum, selectedTee, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        GameData.players.push(player);
        buildPlayerRow(checkedDisplayValue, GameData.players[playerNum]);
        $("#new-player-name").val("");
        $("#playerModal").modal("hide");
    }
    function nameChange(e) {
        //change name if nessisary
        var element = $(e.target);
        var playerNum = element.data("player");
        var value = e.target.value;
        if (value.length == 0) {
            $("#submit-player-btn").prop('disabled', true);
        } else {
            $("#submit-player-btn").prop('disabled', false);
        }
        if (!GameData.uniqueName(playerNum, value)) {
            element.focus();
            if (playerNum != undefined) {
                e.target.value = (GameData.players[playerNum].name);
                alert("Player Names Must Be Unique!")
            } else {
                if ($("#player-unique-error-alert").length == 0) {
                    var alert = $('<div id="player-unique-error-alert" class="alert alert-danger col-sm-10 col-md-offset-2" role="alert">Player Names Must Be Unique</div>');
                    $("#add-input-body").addClass("has-error has-feedback");
                    $("#add-input-body").append(alert);
                }
                $("#submit-player-btn").prop('disabled', true);
            }
            return;
        } else {
            if (playerNum == undefined) {
                if ($("#player-unique-error-alert").length != 0) {
                    $("#player-unique-error-alert").remove();
                    $("#add-input-body").removeClass("has-error has-feedback");
                    $("#submit-player-btn").prop('disabled', false);
                }
            }
        }

        if (playerNum != undefined) {
            GameData.players[playerNum].name = value;
        }
    }

    function holeStrokeChange(e) {
        //change the Stroke Change
        var element = $(e.target);
        var playerNum = element.data("player");
        var holeNum = +(element.data("hole")) - 1;
        var value = +e.target.value;
        if (value > 99) {
            e.target.value = 99;
            value = 99;
        } else if (value == 0) {
            e.target.value = 0;
            element.select();
        }

        GameData.players[playerNum].scores[holeNum] = value;
        if (!!$("#out-player" + playerNum).length) {
            $("#out-player" + playerNum).text(GameData.players[playerNum].outTotal());
        }
        if (!!$("#in-player" + playerNum).length) {
            $("#in-player" + playerNum).text(GameData.players[playerNum].inTotal());
        }
        $("#total-player" + playerNum).text(GameData.players[playerNum].total());
        var tdElement = $("#total-player" + playerNum);
        var badge = $("<span>0</span>");
        badge.attr("id", "badge-" + playerNum);
        badge.addClass("badge");

        var offset = (GameData.players[playerNum].total() - GameData.parTotal());
        if (offset < 0) {
            badge.removeClass("bad-score");
            badge.addClass("good-score");
            badge.attr("title", "Welcome to the PGA Tour");

        } else if (offset == 0) {
            badge.addClass()
        } else {
            offset = "+" + offset;
            badge.removeClass("good-score");
            badge.addClass("bad-score");
            badge.attr("title", "Better luck next time");
        }
        badge.tooltip();
        badge.text(offset);
        tdElement.append(badge);
    }
    function holeClick(e) {
        //Click the hole
        var element = $(e.target);
        var elementID = element.attr("id");
        var holeNumber = elementID.split('-')[1];
        var greenLoc = GameData.courseData.course.holes[holeNumber].green_location;
        var firstTeeLoc = GameData.courseData.course.holes[holeNumber].tee_boxes[0].location;
        var aLat = (greenLoc.lat + firstTeeLoc.lat) / 2;
        var aLng = (greenLoc.lng + firstTeeLoc.lng) / 2;
        console.log("alat:" + aLat + " alng:" + aLng);
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: { lat: aLat, lng: aLng },
            mapTypeId: google.maps.MapTypeId.SATELLITE
        });
        var image = 'img/GreenFlag.jpg';

        var beachMarker = new google.maps.Marker({
            position: greenLoc,
            animation: google.maps.Animation.DROP,
            label: "Green",
            map: map,
            icon: image
        });
        for (var i = 0; i < GameData.courseData.course.holes[holeNumber].tee_boxes.length; i++) {
            image = 'img/WhiteTee.jpeg';
            var tee = GameData.courseData.course.holes[holeNumber].tee_boxes[i];
            switch (tee.tee_type) {
                case "pro":
                    image = 'img/BlackTee.jpeg';
                    break;
                case "champion":
                    image = 'img/BlueTee.png';
                    break;
                case "men":
                    image = 'img/WhiteTee.jpeg';
                    break;
                case "women":
                    image = 'img/RedTee.jpeg';
                    break;
                default:
                    break
            }
            beachMarker = new google.maps.Marker({
                position: tee.location,
                animation: google.maps.Animation.DROP,
                label: tee.tee_type,
                map: map,
                icon: image
            });
        }

    }
    $("input[name='hole-display-option']").change(function () {
        $(this).prop("checked", true);
        resetScoreCard();
        buildcard(this.value);

    });
    $("#submit-player-btn").click(addPlayer);
    $("#playerModal").on('shown.bs.modal', function () {
        $("#new-player-name").focus();
    });
    $("#prev-hole-btn").click(function (e) {
        var currentHole = GameData.currentHole;
        if (currentHole <= 2) {
            GameData.currentHole = 1;
            $(e.target).prop("disabled", true);
        } else {
            GameData.currentHole -= 1;
            $("#next-hole-btn").prop("disabled", false);
        }
        buildcard($('input[name="hole-display-option"]:checked').val());
    });

    $("#next-hole-btn").click(function (e) {
        var currentHole = GameData.currentHole;
        if (currentHole >= 17) {
            GameData.currentHole = 18;
            $(e.target).prop("disabled", true);
        } else {
            GameData.currentHole += 1;
            $("#prev-hole-btn").prop("disabled", false);
        }
        buildcard($('input[name="hole-display-option"]:checked').val());
    });
    $("#new-player-name").keyup(nameChange);

    function selectContents(e) {
        $(this)
            .one('mouseup', function () {
                $(this).select();
                return false;
            })
            .select();
        var element = $(e.target);
        var holeNum = +(element.data("hole"));
        console.log(holeNum);
        GameData.currentHole = holeNum;
    }

    $(window).resize(function () {
        var w = $(window).width();

        if (w < 725) {
            $("#single").prop('checked', true).change();
        } else if (w < 1365) {
            console.log($(window).width());
            if (GameData.currentHole < 10) {
                $("#front").prop('checked', true).change();
            } else {
                $("#back").prop('checked', true).change();
            }
        } else {
            $("#all").prop('checked', true).change();
        }
    });
    $("#select-course-btn").click(function () {
        getCourseInfo($('input[name="course-selected"]:checked').val());
        $("#courseModal").modal("hide");
    });
    function getCourseInfo(courseID) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                GameData.courseData = JSON.parse(xhttp.responseText);
                if (GameData.players.length > 0) {
                    GameData.players = [];
                }
                if (GameData.courseData.course.hole_count < 10) {
                    $("#display-r-all").hide();
                    $("#display-r-back").hide();
                    $("#r-front").prop("checked", "checked");
                    buildcard("front");
                } else {
                    $("#display-r-all").show();
                    $("#display-r-back").show();
                    $("#all").prop("checked", "checked");
                    buildcard("all");
                }
            }
        };
        xhttp.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + courseID, true);
        xhttp.send();
    }
})();
function getCourse() {
    var pos = {};
    navigator.geolocation.getCurrentPosition(function (position) {
        pos.radius = 30;
        var xhr = getCourse("https://golf-courses-api.herokuapp.com/courses/", pos, "json");
        xhr.done(function (data) {
            GameData.coursesLocalData = JSON.parse(data);
            for (var i = 0; i < GameData.coursesLocalData.courses.length; i++) {
                buildCourseRow(GameData.coursesLocalData.courses[i]);
                return GolfCard;
            }
        });
    });
}