//---------------------------------
// Slice path definitions
//---------------------------------

var slicePath = function () {

    this.x = 0;
    this.y = 0;
    this.r = 1;
    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleSugar = 100;

    var setBaseValue = function (wheelnav, itemIndex) {
            this.x = wheelnav.centerX;
            this.y = wheelnav.centerY;
            this.r = wheelnav.navWheelSugar * 0.95;
            this.startAngle = (itemIndex * wheelnav.sliceAngle) + wheelnav.baseAngle;
            this.startTheta = getTheta(startAngle);
            this.middleTheta = getTheta(startAngle + wheelnav.sliceAngle / 2);
            this.endTheta = getTheta(startAngle + wheelnav.sliceAngle);
            this.titleSugar = wheelnav.navWheelSugar * 0.5;
            setTitlePos();
    }

    var setTitlePos = function () {
        this.titlePosX = this.titleSugar * Math.cos(this.middleTheta) + this.x;
        this.titlePosY = this.titleSugar * Math.sin(this.middleTheta) + this.y;
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.nullSlice = function (wheelnav, itemIndex) {
        setBaseValue(wheelnav, itemIndex);
        return {
            slicePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultPie = function (wheelnav, itemIndex) {
       
        setBaseValue(wheelnav, itemIndex);
        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultStar = function (wheelnav, itemIndex) {

        setBaseValue(wheelnav, itemIndex);
        rbase = r * 0.5;

        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];

        titleSugar = wheelnav.navWheelSugar * 0.44;
        setTitlePos();

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultCog = function (wheelnav, itemIndex) {

        setBaseValue(wheelnav, itemIndex);
        rbase = r * 0.9;

        theta1 = getTheta(startAngle + wheelnav.sliceAngle * 0.0625);
        theta2 = getTheta(startAngle + wheelnav.sliceAngle * 0.1875);
        theta3 = getTheta(startAngle + wheelnav.sliceAngle * 0.3125);
        theta4 = getTheta(startAngle + wheelnav.sliceAngle * 0.4375);
        theta5 = getTheta(startAngle + wheelnav.sliceAngle * 0.5625);
        theta6 = getTheta(startAngle + wheelnav.sliceAngle * 0.6875);
        theta7 = getTheta(startAngle + wheelnav.sliceAngle * 0.8125);
        theta8 = getTheta(startAngle + wheelnav.sliceAngle * 0.9375);

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

        titleSugar = wheelnav.navWheelSugar * 0.55;
        setTitlePos();

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultMenu = function (wheelnav, itemIndex) {

        setBaseValue(wheelnav, itemIndex);

        titleSugar = wheelnav.navWheelSugar * 0.63;
        setTitlePos();

        slicePathString = [["M", titlePosX, titlePosY],
                    ["m", -25, 0],
                    ["a", 25, 25, 0, 1, 0, 50, 0],
                    ["a", 25, 25, 0, 1, 0, -50, 0],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    return this;
}


