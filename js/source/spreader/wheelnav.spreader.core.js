/* ======================================================================================= */
/* Spreader of wheel                                                                       */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/spreader.html      */
/* ======================================================================================= */

spreader = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.spreaderEnable) {

        this.spreaderHelper = new pathHelper();
        this.spreaderHelper.centerX = this.wheelnav.centerX;
        this.spreaderHelper.centerY = this.wheelnav.centerY;
        this.spreaderHelper.navItemCount = this.wheelnav.navItemCount;
        this.spreaderHelper.navAngle = this.wheelnav.navAngle;
        this.spreaderHelper.wheelRadius = this.wheelnav.spreaderRadius;
        this.spreaderHelper.startAngle = this.wheelnav.spreaderStartAngle;
        this.spreaderHelper.sliceAngle = this.wheelnav.spreaderSliceAngle;

        var thisWheelNav = this.wheelnav;

        var fontAttr = { font: '100 32px Impact, Charcoal, sans-serif' };

        var spreaderPath = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderPathCustom);
        this.spreaderCircle = this.wheelnav.raphael.path(spreaderPath.spreaderPathString);
        this.spreaderCircle.attr(thisWheelNav.spreaderCircleAttr);
        this.spreaderCircle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.spreadOnTitle = thisWheelNav.raphael.text(spreaderPath.titlePosX, spreaderPath.titlePosY, "+");
        this.spreadOnTitle.attr(fontAttr);
        this.spreadOnTitle.attr(thisWheelNav.spreaderOnAttr);
        this.spreadOnTitle.id = thisWheelNav.getSpreadOnId();
        this.spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.spreadOffTitle = thisWheelNav.raphael.text(spreaderPath.titlePosX, spreaderPath.titlePosY - 3, "–");
        this.spreadOffTitle.attr(fontAttr);
        this.spreadOffTitle.attr(thisWheelNav.spreaderOffAttr);
        this.spreadOffTitle.id = thisWheelNav.getSpreadOffId();
        this.spreadOffTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.setVisibility();
    }

    return this;
};

spreader.prototype.setVisibility = function () {
    if (this.wheelnav.spreaderEnable) {
        this.spreaderCircle.toFront();

        if (this.wheelnav.currentPercent > this.wheelnav.minPercent) {
            this.spreadOffTitle.toFront();
            this.spreadOnTitle.toBack();
        }
        else {
            this.spreadOffTitle.toBack();
            this.spreadOnTitle.toFront();
        }
    }
};

