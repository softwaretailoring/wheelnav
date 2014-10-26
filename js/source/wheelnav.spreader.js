/* ======================================================================================= */
/* Spreader of wheel                                                                       */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/spreader.html      */
/* ======================================================================================= */

spreader = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.spreaderEnable) {
        var thisWheelNav = this.wheelnav;

        var fontAttr = { font: '100 32px Impact, Charcoal, sans-serif' };

        this.spreaderCircle = thisWheelNav.raphael.circle(thisWheelNav.centerX, thisWheelNav.centerY, thisWheelNav.spreaderRadius);
        this.spreaderCircle.attr(thisWheelNav.spreaderCircleAttr);
        this.spreaderCircle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.spreadOnTitle = thisWheelNav.raphael.text(thisWheelNav.centerX, thisWheelNav.centerY, "+");
        this.spreadOnTitle.attr(fontAttr);
        this.spreadOnTitle.attr(thisWheelNav.spreaderOnAttr);
        this.spreadOnTitle.id = thisWheelNav.getSpreadOnId();
        this.spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.spreadOffTitle = thisWheelNav.raphael.text(thisWheelNav.centerX, thisWheelNav.centerY - 3, "–");
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