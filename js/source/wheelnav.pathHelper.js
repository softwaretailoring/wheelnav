/* ======================================================================================= */
/* Slice path helper functions                                                                  */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var pathHelper = function () {

    this.sliceRadius = 0;
    this.startAngle = 0;
    this.middleAngle = 0;
    this.endAngle = 0;
    this.sliceAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleRadius = 0;
    this.titleTheta = 0;
    this.titleAngle = 0;
    this.custom = null;
    this.centerX = 0;
    this.centerY = 0;
    this.wheelRadius = 0;
    this.itemIndex = 0;
    this.navItemCount = 0;
    this.navAngle = 0;
    this.titleCurvedClockwise = false;

    this.setBaseValue = function (percent, custom) {

        if (custom === null) {
            custom = new slicePathCustomization();
        }
        else {
            this.custom = custom;
        }

        this.sliceRadius = this.wheelRadius * percent * 0.9;

        this.middleAngle = this.startAngle + this.sliceAngle / 2;
        this.endAngle = this.startAngle + this.sliceAngle;

        this.startTheta = this.getTheta(this.startAngle);
        this.middleTheta = this.getTheta(this.middleAngle);
        this.endTheta = this.getTheta(this.endAngle);

        if (custom !== null) {
            if (custom.titleRadiusPercent !== null) {
                this.titleRadius = this.sliceRadius * custom.titleRadiusPercent;
            }
            if (custom.titleSliceAnglePercent !== null) {
                this.titleTheta = this.getTheta(this.startAngle + this.sliceAngle * custom.titleSliceAnglePercent);
                this.titleAngle = this.startAngle + this.sliceAngle * custom.titleSliceAnglePercent;
            }
        }
        else {
            this.titleRadius = this.sliceRadius * 0.5;
            this.titleTheta = this.middleTheta;
            this.titleAngle = this.middleAngle;
        }

        this.setTitlePos();
    };

    this.setTitlePos = function () {
        this.titlePosX = this.titleRadius * Math.cos(this.titleTheta) + this.centerX;
        this.titlePosY = this.titleRadius * Math.sin(this.titleTheta) + this.centerY;
    };

    this.getX = function (angle, length) {
        return length * Math.cos(this.getTheta(angle)) + this.centerX;
    };

    this.getY = function (angle, length) {
        return length * Math.sin(this.getTheta(angle)) + this.centerY;
    };

    this.MoveTo = function (angle, length) {
        return ["M", this.getX(angle, length), this.getY(angle, length)];
    };

    this.MoveToXY = function (posX, posY) {
        return ["M", posX, posY];
    };

    this.MoveToCenter = function () {
        return ["M", this.centerX, this.centerY];
    };

    this.LineTo = function (angle, length, angleY, lengthY) {
        if (angleY === undefined) { angleY = angle; }
        if (lengthY === undefined) { lengthY = length; }
        return ["L", this.getX(angle, length), this.getY(angleY, lengthY)];
    };

    this.LineToXY = function (posX, posY) {
        return ["L", posX, posY];
    };

    this.ArcTo = function (arcRadius, angle, length) {
        return ["A", arcRadius, arcRadius, 0, 0, 1, this.getX(angle, length), this.getY(angle, length)];
    };

    this.ArcToXY = function (arcRadius, posX, posY) {
        return ["A", arcRadius, arcRadius, 0, 0, 1, posX, posY];
    };

    this.ArcBackTo = function (arcRadius, angle, length) {
        return ["A", arcRadius, arcRadius, 0, 0, 0, this.getX(angle, length), this.getY(angle, length)];
    };

    this.ArcBackToXY = function (arcRadius, posX, posY) {
        return ["A", arcRadius, arcRadius, 0, 0, 0, posX, posY];
    };

    this.CubicBezierTo = function (assist1Angle, assist1Length, assist2Angle, assist2Length, endAngle, endLength) {
        return ["C", this.getX(assist1Angle, assist1Length), this.getY(assist1Angle, assist1Length), this.getX(assist2Angle, assist2Length), this.getY(assist2Angle, assist2Length), this.getX(endAngle, endLength), this.getY(endAngle, endLength)];
    };
   
    this.CubicBezierToXY = function (assist1X, assist1Y, assist2X, assist2Y, endX, endY) {
        return ["C", assist1X, assist1Y, assist2X, assist2Y, endX, endY];
    };

    this.StartSpreader = function (spreaderPathString, angle, length) {
        if (this.endAngle - this.startAngle === 360) {
            spreaderPathString.push(this.MoveTo(angle, length));
        }
        else {
            spreaderPathString.push(this.MoveToCenter());
            spreaderPathString.push(this.LineTo(angle, length));
        }
    };

    this.getCurvedTitlePathString = function () {
        var startAngle = this.titleAngle - (this.sliceAngle / 2);
        var endAngle = this.titleAngle + (this.sliceAngle / 2);
        var pathString = [];
        if (this.titleCurvedClockwise) {
            pathString.push(this.MoveTo(startAngle, this.titleRadius));
            pathString.push(this.ArcTo(this.titleRadius, endAngle, this.titleRadius));
        }
        else {
            pathString.push(this.MoveTo(endAngle, this.titleRadius));
            pathString.push(this.ArcBackTo(this.titleRadius, startAngle, this.titleRadius));
        }
        return pathString;
    };

    this.Close = function () {
        return ["z"];
    };

    this.getTheta = function (angle) {
        return (angle % 360) * Math.PI / 180;
    };

    // Converts from degrees to radians.
    this.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    // Converts from radians to degrees.
    this.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    return this;
};

/* Custom properties
    - titleRadiusPercent
    - titleSliceAnglePercent
*/
var slicePathCustomization = function () {

    this.titleRadiusPercent = 0.5;
    this.titleSliceAnglePercent = 0.5;

    return this;
};

/* Custom properties
    - titleRadiusPercent
    - titleSliceAnglePercent
    - spreaderPercent
*/
var spreaderPathCustomization = function () {

    this.titleRadiusPercent = 0;
    this.titleSliceAnglePercent = 0.5;
    this.spreaderPercent = 1;

    return this;
};

/* Custom properties
    - titleRadiusPercent
    - titleSliceAnglePercent
    - markerPercent
*/
var markerPathCustomization = function () {

    this.titleRadiusPercent = 1;
    this.titleSliceAnglePercent = 0.5;
    this.markerPercent = 1.05;

    return this;
};

