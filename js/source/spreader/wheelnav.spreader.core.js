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

        var currentPath = this.spreaderPathOff;
        if (thisWheelNav.initPercent < thisWheelNav.maxPercent) {
            currentPath = this.spreaderPathOn;
        }

        this.spreaderPath = this.wheelnav.raphael.path(currentPath.spreaderPathString);
        this.spreaderPath.attr(thisWheelNav.spreaderPathAttr);
        this.spreaderPath.id = thisWheelNav.getSpreaderId();
        this.spreaderPath.node.id = this.spreaderPath.id;
        this.spreaderPath.click(function () {
            thisWheelNav.spreadWheel();
        });

        //Set titles
        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOnTitle)) {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderOnTitle, this.wheelnav.raphael.raphael);
            this.onTitle = onTitle.getTitlePercentAttr(this.spreaderPathOff.titlePosX, this.spreaderPathOff.titlePosY);
        }
        else {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderOnTitle);
            this.onTitle = onTitle.getTitlePercentAttr(this.spreaderPathOff.titlePosX, this.spreaderPathOff.titlePosY);
        }

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOffTitle)) {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOffTitle, this.wheelnav.raphael.raphael);
            this.offTitle = offTitle.getTitlePercentAttr(this.spreaderPathOn.titlePosX, this.spreaderPathOn.titlePosY);
            this.spreaderTitle = thisWheelNav.raphael.path(this.offTitle.path);
        }
        else {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOffTitle);
            this.offTitle = offTitle.getTitlePercentAttr(this.spreaderPathOn.titlePosX, this.spreaderPathOn.titlePosY);
            this.spreaderTitle = thisWheelNav.raphael.text(currentPath.titlePosX, currentPath.titlePosY, this.offTitle.title);
        }

        if (thisWheelNav.initPercent === thisWheelNav.maxPercent) {
            
        }
        else {
            
        }

        this.spreaderTitle.attr(this.fontAttr);
        this.spreaderTitle.attr(thisWheelNav.spreaderOnAttr);
        this.spreaderTitle.id = thisWheelNav.getSpreaderTitleId();
        this.spreaderTitle.node.id = this.spreaderTitle.id;
        this.spreaderTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.setCurrentTransform();
    }

    return this;
};

spreader.prototype.setCurrentTransform = function () {
    if (this.wheelnav.spreaderEnable) {
        this.spreaderPath.toFront();
        

        if (this.wheelnav.currentPercent > this.wheelnav.minPercent) {
            currentPath = this.spreaderPathOn.spreaderPathString;
        }
        else {
            currentPath = this.spreaderPathOff.spreaderPathString;
        }

        spreaderTransformAttr = {
            path: currentPath
        };

        //Animate spreader
        this.spreaderPath.animate(spreaderTransformAttr, this.animatetime, this.animateeffect);

        //titles
        var currentTitle;

        if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
            currentTitle = this.offTitle;
            this.spreaderTitle.attr(this.wheelnav.spreaderOffAttr);
        }
        else {
            currentTitle = this.onTitle;
            this.spreaderTitle.attr(this.wheelnav.spreaderOnAttr);
        }

        if (this.spreaderTitle.type === "path") {
            titleTransformAttr = {
                path: currentTitle.path
            };
        }
        else {
            //Little hack for proper appearance of "-" sign
            offYOffset = 0;
            if (currentTitle.title === "-") { offYOffset = 3; }

            titleTransformAttr = {
                x: currentTitle.x,
                y: currentTitle.y - offYOffset
            };

            if (currentTitle.title !== null) {
                this.spreaderTitle.attr({ text: currentTitle.title });
            }
        }

        this.spreaderTitle.animate(titleTransformAttr, this.animatetime, this.animateeffect);
        this.spreaderTitle.toFront();
    }
};
