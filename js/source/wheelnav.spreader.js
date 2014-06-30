//---------------------------------
// Spreader of wheel
//---------------------------------

spreader = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.spreaderEnable) {
        var thisWheelNav = this.wheelnav;

        this.spreaderCircle = thisWheelNav.raphael.circle(thisWheelNav.centerX, thisWheelNav.centerY, thisWheelNav.spreaderSugar).attr(thisWheelNav.spreaderCircleAttr);
        this.spreadOnTitle = thisWheelNav.raphael.text(thisWheelNav.centerX, thisWheelNav.centerY, "+").attr(thisWheelNav.spreaderOnAttr);
        this.spreadOnTitle.id = thisWheelNav.getSpreadOnId();
        this.spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel();
        });
        this.spreadOffTitle = thisWheelNav.raphael.text(thisWheelNav.centerX, thisWheelNav.centerY - 3, "–").attr(thisWheelNav.spreaderOffAttr);
        this.spreadOffTitle.id = thisWheelNav.getSpreadOffId();
        this.spreadOffTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.setVisibility();
    }

    return this;
}

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
}