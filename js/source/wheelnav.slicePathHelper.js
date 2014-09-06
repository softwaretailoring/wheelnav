/* ======================================================================================= */
/* Slice path helper functions                                                                  */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var slicePathHelper = function () {

    this.sliceRadius = 0;
    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleRadius = 0;

    this.setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        this.sliceRadius = rOriginal * percent;
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = this.getTheta(this.startAngle);
        this.middleTheta = this.getTheta(this.startAngle + sliceAngle / 2);
        this.endTheta = this.getTheta(this.startAngle + sliceAngle);
        this.titleRadius = this.sliceRadius * 0.5;
        this.setTitlePos(x, y);
    }

    this.setTitlePos = function (x, y) {
        this.titlePosX = this.titleRadius * Math.cos(this.middleTheta) + x;
        this.titlePosY = this.titleRadius * Math.sin(this.middleTheta) + y;
    }

    this.getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    return this;
}


