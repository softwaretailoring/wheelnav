/* ======================================================================================= */
/* Slice path definitions                                                                  */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var slicePath = function () {

    this.helper = new slicePathHelper();

    this.NullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.PieSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.titleRadiusPercent = 0.6;
        return custom;
    };

    this.PieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;
        helper.titleRadius = r * custom.titleRadiusPercent;

        helper.setTitlePos(x, y);

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.PieSliceSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

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
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    /* Custom properties
        - minRadiusPercent
        - maxRadiusPercent
    */
    this.DonutSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.minRadiusPercent = 0.37;
        custom.maxRadiusPercent = 0.95;

        return custom;
    };

    this.DonutSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = DonutSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;

        r = helper.sliceRadius * custom.maxRadiusPercent;
        rbase = helper.sliceRadius * custom.minRadiusPercent;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 0, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        helper.titleRadius = (r + rbase) / 2;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.UmbrellaSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.95;
        rbase = r * 0.37;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 0, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        helper.titleRadius = r * 0.7;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.StarBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.StarSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        rbase = r * 0.5;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];

        helper.titleRadius = r * 0.44;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.CogBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.0625);
        theta12 = helper.getTheta(helper.startAngle + sliceAngle * 0.125);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.1875);
        theta22 = helper.getTheta(helper.startAngle + sliceAngle * 0.25);
        theta3 = helper.getTheta(helper.startAngle + sliceAngle * 0.3125);
        theta32 = helper.getTheta(helper.startAngle + sliceAngle * 0.375);
        theta4 = helper.getTheta(helper.startAngle + sliceAngle * 0.4375);
        theta42 = helper.getTheta(helper.startAngle + sliceAngle * 0.5);
        theta5 = helper.getTheta(helper.startAngle + sliceAngle * 0.5625);
        theta52 = helper.getTheta(helper.startAngle + sliceAngle * 0.625);
        theta6 = helper.getTheta(helper.startAngle + sliceAngle * 0.6875);
        theta62 = helper.getTheta(helper.startAngle + sliceAngle * 0.75);
        theta7 = helper.getTheta(helper.startAngle + sliceAngle * 0.8125);
        theta72 = helper.getTheta(helper.startAngle + sliceAngle * 0.875);
        theta8 = helper.getTheta(helper.startAngle + sliceAngle * 0.9375);
        theta82 = helper.getTheta(helper.startAngle + sliceAngle * 0.96875);

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
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.CogSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        rbase = r * 0.9;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.0625);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.1875);
        theta3 = helper.getTheta(helper.startAngle + sliceAngle * 0.3125);
        theta4 = helper.getTheta(helper.startAngle + sliceAngle * 0.4375);
        theta5 = helper.getTheta(helper.startAngle + sliceAngle * 0.5625);
        theta6 = helper.getTheta(helper.startAngle + sliceAngle * 0.6875);
        theta7 = helper.getTheta(helper.startAngle + sliceAngle * 0.8125);
        theta8 = helper.getTheta(helper.startAngle + sliceAngle * 0.9375);

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

        helper.titleRadius = r * 0.55;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    /* Custom properties
        - menuRadius
    */
    this.MenuSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.menuRadius = 25;
        custom.titleRadiusPercent = 0.63;

        return custom;
    };

    this.MenuSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = MenuSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        var r = helper.sliceRadius;
        helper.titleRadius = r * custom.titleRadiusPercent;
        helper.setTitlePos(x, y);

        var menuRadius = percent * custom.menuRadius;

        if (menuRadius < 15) {
            menuRadius = 15;
        }

        if (percent <= 0.05) {
            menuRadius = 10;
        }

        middleTheta = helper.middleTheta;

        slicePathString = [["M", helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                    ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX + (menuRadius * Math.cos(middleTheta)), helper.titlePosY + (menuRadius * Math.sin(middleTheta))],
                    ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                    ["z"]];

        if (percent <= 0.05) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
        }
        else {
            lineEndX = (helper.titleRadius - menuRadius) * Math.cos(middleTheta) + x;
            lineEndY = (helper.titleRadius - menuRadius) * Math.sin(middleTheta) + y;

            linePathString = [["M", x, y],
                        ["A", r / 2, r / 2, 0, 0, 1, lineEndX, lineEndY]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.MenuSliceSelectedLine = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = MenuSliceCustomization();
        }

        var slicePath = MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        helper.titleRadius = r * custom.titleRadiusPercent;

        var menuRadius = percent * custom.menuRadius;

        if (menuRadius < 15) {
            menuRadius = 15;
        }

        if (percent === 0) {
            menuRadius = 10;
        }

        middleTheta = helper.middleTheta;

        if (percent === 0) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
        }
        else {
            lineEndX = (helper.titleRadius - menuRadius) * Math.cos(middleTheta) + x;
            lineEndY = (helper.titleRadius - menuRadius) * Math.sin(middleTheta) + y;

            linePathString = [["M", x, y],
                        ["A", r / 3, r / 3, 0, 0, 1, lineEndX, lineEndY]];
        }

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: linePathString,
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    this.MenuSliceWithoutLine = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        var slicePath = MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    /* Custom properties
        - menuRadius
    */
    this.MenuSquareSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.menuRadius = 30;
        custom.titleRadiusPercent = 0.63;

        return custom;
    };

    this.MenuSquareSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = MenuSquareSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        helper.titleRadius = r * custom.titleRadiusPercent;
        helper.setTitlePos(x, y);

        var menuRadius = percent * custom.menuRadius;

        if (menuRadius < 15) { menuRadius = 15; }

        if (percent <= 0.05) { menuRadius = 10; }

        slicePathString = [["M", helper.titlePosX + menuRadius, helper.titlePosY + menuRadius],
                    ["L", helper.titlePosX - menuRadius, helper.titlePosY + menuRadius],
                    ["L", helper.titlePosX - menuRadius, helper.titlePosY - menuRadius],
                    ["L", helper.titlePosX + menuRadius, helper.titlePosY - menuRadius],
                    ["z"]];

        if (percent <= 0.05) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
        }
        else {
            lineEndX = helper.titleRadius - menuRadius;
            lineEndY = helper.titleRadius - menuRadius;

            linePathString = [["M", x, y],
                        ["L", helper.titlePosX, helper.titlePosY]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.FlowerSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        rbase = r * 0.65;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["A", r / 7, r / 7, 0, 0, 1, rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.EyeSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.7;

        helper.titleRadius = r * 0.87;
        helper.setTitlePos(x, y);

        if (percent === 0) {
            r = 0.01;
        }

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.WheelSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.85;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        if (sliceAngle < 120) {
            helper.titleRadius = r * 0.62;
            slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
                         ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
                         ["A", (r * 0.97), (r * 0.97), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
                         ["z"],
                         ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];
        }
        else if (sliceAngle < 180) {
            helper.titleRadius = r * 0.56;
            slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
                         ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
                         ["A", (r * 0.95), (r * 0.95), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
                         ["z"],
                         ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];
        }
        else {
            helper.titleRadius = r * 0.5;
            slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
                         ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
                         ["A", (r * 0.905), (r * 0.905), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
                         ["z"],
                         ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];
        }

        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.LineSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        if (sliceAngle > 60 &&
            sliceAngle < 180) {
            helper.titleRadius = r * ((180 / sliceAngle) / 5);
            helper.setTitlePos(x, y);
        }
        else {
            helper.titleRadius = r * 0.55;
            helper.setTitlePos(x, y);
        }

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

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
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.TabSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        rOriginal = rOriginal * 0.9;
        var navItemCount = 360 / sliceAngle;
        var itemSize = 2 * rOriginal / navItemCount;

        titlePosX = x;
        titlePosY = itemIndex * itemSize + y + (itemSize / 2) - rOriginal;

        slicePathString = [["M", x - (itemSize / 2), itemIndex * itemSize + y - rOriginal],
                     ["L", (itemSize / 2) + x, itemIndex * itemSize + y - rOriginal],
                     ["L", (itemSize / 2) + x, (itemIndex + 1) * itemSize + y - rOriginal],
                     ["L", x - (itemSize / 2), (itemIndex + 1) * itemSize + y - rOriginal],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        };
    };

    this.YinYangSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["A", r / 2, r / 2, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["A", r / 2, r / 2, 0, 0, 0, x, y],
                     ["z"]];

        titlePosX = r / 2 * Math.cos(startTheta) + x;
        titlePosY = r / 2 * Math.sin(startTheta) + y;

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        };
    };

    /* Custom properties
        - arrowRadiusPercent
    */
    this.PieArrowSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.arrowRadiusPercent = 1.1;

        return custom;
    };

    this.PieArrowSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieArrowSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.45);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.55);

        var arrowRadius = r * custom.arrowRadiusPercent;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                     ["L", arrowRadius * Math.cos(middleTheta) + x, arrowRadius * Math.sin(middleTheta) + y],
                     ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.PieArrowBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieArrowSliceCustomization();
        }

        custom.arrowRadiusPercent = 1;
        var slicePath = PieArrowSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    return this;
};


