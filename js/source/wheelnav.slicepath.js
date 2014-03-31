//---------------------------------
// Slice path definitions
//---------------------------------

var slicePath = function () {

    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleSugar = 0;
    this.r = 0;

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        this.r = rOriginal * percent;
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
        this.titleSugar = r * 0.5;
        setTitlePos(x, y);
    }

    var setTitlePos = function (x, y) {
        this.titlePosX = titleSugar * Math.cos(middleTheta) + x;
        this.titlePosY = titleSugar * Math.sin(middleTheta) + y;
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.NullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.PieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.9;
        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.PieSliceSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        var deltaTheta = (1 - percent) * (endTheta - startTheta) / 2;
        startTheta = startTheta + deltaTheta;
        endTheta = endTheta - deltaTheta;

        rOriginal = percent * rOriginal;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.DonutSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = r * 0.95;
        rbase = r * 0.37;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 0, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        titleSugar = r * 0.7;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.UmbrellaSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = r * 0.95;
        rbase = r * 0.37;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 0, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        titleSugar = r * 0.7;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.StarBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.9;
        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.StarSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        rbase = r * 0.5;

        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];

        titleSugar = r * 0.44;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.StarSliceSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        if (percent > 0.15) {
            rbase = rOriginal * 0.5;
        }
        else
        {
            rbase = r * 0.5;
        }

        slicePathString = [["M", x, y],
                         ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                         ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                         ["z"]];

        titleSugar = r * 0.44;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.CogBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.9;

        theta1 = getTheta(startAngle + sliceAngle * 0.0625);
        theta12 = getTheta(startAngle + sliceAngle * 0.125);
        theta2 = getTheta(startAngle + sliceAngle * 0.1875);
        theta22 = getTheta(startAngle + sliceAngle * 0.25);
        theta3 = getTheta(startAngle + sliceAngle * 0.3125);
        theta32 = getTheta(startAngle + sliceAngle * 0.375);
        theta4 = getTheta(startAngle + sliceAngle * 0.4375);
        theta42 = getTheta(startAngle + sliceAngle * 0.5);
        theta5 = getTheta(startAngle + sliceAngle * 0.5625);
        theta52 = getTheta(startAngle + sliceAngle * 0.625);
        theta6 = getTheta(startAngle + sliceAngle * 0.6875);
        theta62 = getTheta(startAngle + sliceAngle * 0.75);
        theta7 = getTheta(startAngle + sliceAngle * 0.8125);
        theta72 = getTheta(startAngle + sliceAngle * 0.875);
        theta8 = getTheta(startAngle + sliceAngle * 0.9375);
        theta82 = getTheta(startAngle + sliceAngle * 0.96875);

        slicePathString = [["M", x, y],
             ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta12) + x, r * Math.sin(theta12) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta22) + x, r * Math.sin(theta22) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta3) + x, r * Math.sin(theta3) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta32) + x, r * Math.sin(theta32) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta4) + x, r * Math.sin(theta4) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta42) + x, r * Math.sin(theta42) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta5) + x, r * Math.sin(theta5) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta52) + x, r * Math.sin(theta52) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta6) + x, r * Math.sin(theta6) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta62) + x, r * Math.sin(theta62) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta7) + x, r * Math.sin(theta7) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta72) + x, r * Math.sin(theta72) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta8) + x, r * Math.sin(theta8) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(theta82) + x, r * Math.sin(theta82) + y],
             ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
             ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.CogSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        rbase = r * 0.9;

        theta1 = getTheta(startAngle + sliceAngle * 0.0625);
        theta2 = getTheta(startAngle + sliceAngle * 0.1875);
        theta3 = getTheta(startAngle + sliceAngle * 0.3125);
        theta4 = getTheta(startAngle + sliceAngle * 0.4375);
        theta5 = getTheta(startAngle + sliceAngle * 0.5625);
        theta6 = getTheta(startAngle + sliceAngle * 0.6875);
        theta7 = getTheta(startAngle + sliceAngle * 0.8125);
        theta8 = getTheta(startAngle + sliceAngle * 0.9375);

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                     ["L", rbase * Math.cos(theta1) + x, rbase * Math.sin(theta1) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta2) + x, rbase * Math.sin(theta2) + y],
                     ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta3) + x, r * Math.sin(theta3) + y],
                     ["L", rbase * Math.cos(theta3) + x, rbase * Math.sin(theta3) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta4) + x, rbase * Math.sin(theta4) + y],
                     ["L", r * Math.cos(theta4) + x, r * Math.sin(theta4) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta5) + x, r * Math.sin(theta5) + y],
                     ["L", rbase * Math.cos(theta5) + x, rbase * Math.sin(theta5) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta6) + x, rbase * Math.sin(theta6) + y],
                     ["L", r * Math.cos(theta6) + x, r * Math.sin(theta6) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta7) + x, r * Math.sin(theta7) + y],
                     ["L", rbase * Math.cos(theta7) + x, rbase * Math.sin(theta7) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta8) + x, rbase * Math.sin(theta8) + y],
                     ["L", r * Math.cos(theta8) + x, r * Math.sin(theta8) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        titleSugar = r * 0.55;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.MenuSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        titleSugar = r * 0.63;
        setTitlePos(x, y);

        var menuSugar = percent * 25;

        if (menuSugar < 15)
        {
            menuSugar = 15;
        }

        if (percent == 0) {
            menuSugar = 10;
        }

        slicePathString = [["M", titlePosX - (menuSugar * Math.cos(middleTheta)), titlePosY - (menuSugar * Math.sin(middleTheta))],
                    ["A", menuSugar, menuSugar, 0, 0, 1, titlePosX + (menuSugar * Math.cos(middleTheta)), titlePosY + (menuSugar * Math.sin(middleTheta))],
                    ["A", menuSugar, menuSugar, 0, 0, 1, titlePosX - (menuSugar * Math.cos(middleTheta)), titlePosY - (menuSugar * Math.sin(middleTheta))],
                    ["z"]];

        if (percent == 0) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x+1, y+1]];
        }
        else {
            lineEndX = (titleSugar - menuSugar) * Math.cos(middleTheta) + x;
            lineEndY = (titleSugar - menuSugar) * Math.sin(middleTheta) + y;

            linePathString = [["M", x, y],
                        ["A", r / 2, r / 2, 0, 0, 1, lineEndX, lineEndY]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.FlowerSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        rbase = r * 0.65;

        slicePathString = [["M", x, y],
                     ["L", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["A", r/7, r/7, 0, 0, 1, rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.EyeSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.7;
        titleSugar = r * 0.87;
        setTitlePos(x, y);

        slicePathString = [["M", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.WheelSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = r * 0.95;

        slicePathString = [["M", (r * 0.08) * Math.cos(middleTheta) + x, (r * 0.08) * Math.sin(middleTheta) + y],
                     ["L", (r * 0.08) * Math.cos(middleTheta) + (r * 0.82) * Math.cos(startTheta) + x, (r * 0.08) * Math.sin(middleTheta) + (r * 0.82) * Math.sin(startTheta) + y],
                     ["A", (r * 0.82), (r * 0.82), 0, 0, 1, (r * 0.08) * Math.cos(middleTheta) + (r * 0.82) * Math.cos(endTheta) + x, (r * 0.08) * Math.sin(middleTheta) + (r * 0.82) * Math.sin(endTheta) + y],
                     ["z"],
                     ["M", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["A", r, r, 0, 0, 0, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.LineSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.9;

        if (sliceAngle > 60 &&
            sliceAngle < 180) {
            titleSugar = r * ((180 / sliceAngle) / 5);
            setTitlePos(x, y);
        }
        else {
            titleSugar = r * 0.5;
            setTitlePos(x, y);
        }

        if (sliceAngle < 180) {
            slicePathString = [["M", x, y],
                         ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                         ["L", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                         ["z"]];
        }
        else {
            var test1 = r * Math.cos(startTheta);
            var test2 = r * Math.sin(startTheta);
            var test3 = r * Math.cos(endTheta);
            var test4 = r * Math.sin(endTheta);

            slicePathString = [["M", x, y],
                         ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(startTheta) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(endTheta) + y],
                         ["L", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                         ["z"]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.TabSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        rOriginal = rOriginal * 0.9;
        var navItemCount = 360 / sliceAngle;
        var itemSize = 2 * rOriginal / navItemCount;

        titlePosX = x + (itemSize / 2);
        titlePosY = itemIndex * itemSize + y + (itemSize / 2) - rOriginal;

        slicePathString = [["M", x, itemIndex * itemSize + y - rOriginal],
                     ["L", itemSize + x, itemIndex * itemSize + y - rOriginal],
                     ["L", itemSize + x, (itemIndex + 1) * itemSize + y - rOriginal],
                     ["L", x, (itemIndex + 1) * itemSize + y - rOriginal],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    return this;
}


