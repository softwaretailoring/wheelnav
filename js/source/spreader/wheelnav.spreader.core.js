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
        this.animateeffect = "bounce";
        this.animatetime = 1500;
        //Set animation from wheelnav
        if (this.wheelnav.animateeffect !== null) { this.animateeffect = this.wheelnav.animateeffect; }
        if (this.wheelnav.animatetime !== null) { this.animatetime = this.wheelnav.animatetime; }

        if (this.wheelnav.spreaderTitleFont !== null) { this.fontAttr = { font: this.wheelnav.spreaderTitleFont }; }
        else { this.fontAttr = { font: '100 32px Impact, Charcoal, sans-serif' }; }

        this.spreaderPathOn = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderOnPercent, this.wheelnav.spreaderPathCustom);
        this.spreaderPathOff = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderOffPercent, this.wheelnav.spreaderPathCustom);
        if (thisWheelNav.initPercent === thisWheelNav.maxPercent) {
            this.spreaderPath = this.wheelnav.raphael.path(this.spreaderPathOn.spreaderPathString);
        }
        else {
            this.spreaderPath = this.wheelnav.raphael.path(this.spreaderPathOff.spreaderPathString);
        }
        this.spreaderPath.attr(thisWheelNav.spreaderPathAttr);
        this.spreaderPath.id = thisWheelNav.getSpreaderId();
        this.spreaderPath.node.id = this.spreaderPath.id;
        this.spreaderPath.click(function () {
            thisWheelNav.spreadWheel();
        });

        //Set titles
        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOnTitle)) {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderOnTitle, this.wheelnav.raphael.raphael);
            this.spreadOnTitle = this.wheelnav.raphael.path(onTitle.getTitlePercentAttr(this.spreaderPathOff.titlePosX, this.spreaderPathOff.titlePosY).path);
        }
        else {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderOnTitle);
            this.spreadOnTitle = thisWheelNav.raphael.text(this.spreaderPathOff.titlePosX, this.spreaderPathOff.titlePosY, onTitle.title);
        }

        this.spreadOnTitle.attr(this.fontAttr);
        this.spreadOnTitle.attr(thisWheelNav.spreaderOnAttr);
        this.spreadOnTitle.id = thisWheelNav.getSpreadOnId();
        this.spreadOnTitle.node.id = this.spreadOnTitle.id;
        this.spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOffTitle)) {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOffTitle, this.wheelnav.raphael.raphael);
            this.spreadOffTitle = this.wheelnav.raphael.path(offTitle.getTitlePercentAttr(this.spreaderPathOn.titlePosX, this.spreaderPathOn.titlePosY).path);
        }
        else {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOffTitle);

            //Little hack for proper appearance of "-" sign
            offYOffset = 0;
            if (this.wheelnav.spreaderOffTitle === "-") { offYOffset = 3; }
            this.spreadOffTitle = thisWheelNav.raphael.text(this.spreaderPathOn.titlePosX, this.spreaderPathOn.titlePosY - offYOffset, offTitle.title);
        }

        this.spreadOffTitle.attr(this.fontAttr);
        this.spreadOffTitle.attr(thisWheelNav.spreaderOffAttr);
        this.spreadOffTitle.id = thisWheelNav.getSpreadOffId();
        this.spreadOffTitle.node.id = this.spreadOffTitle.id;
        this.spreadOffTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.setVisibility();
    }

    return this;
};

spreader.prototype.setVisibility = function () {
    if (this.wheelnav.spreaderEnable) {
        this.spreaderPath.toFront();

        if (this.wheelnav.currentPercent > this.wheelnav.minPercent) {
            this.spreadOffTitle.attr({ opacity: 1 });
            this.spreadOnTitle.attr({ opacity: 0 });

            this.spreadOffTitle.toFront();
            currentPath = this.spreaderPathOn.spreaderPathString;
        }
        else {
            this.spreadOffTitle.attr({ opacity: 0 });
            this.spreadOnTitle.attr({ opacity: 1 });

            this.spreadOnTitle.toFront();
            currentPath = this.spreaderPathOff.spreaderPathString;
        }

        spreaderTransformAttr = {
            path: currentPath
        };
    
        //Animate spreader
        this.spreaderPath.animate(spreaderTransformAttr, this.animatetime, this.animateeffect);
    }
};

