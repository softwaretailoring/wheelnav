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

        this.spreaderPathIn = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderInPercent, this.wheelnav.spreaderPathCustom);
        this.spreaderPathOut = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderOutPercent, this.wheelnav.spreaderPathCustom);

        var currentPath = this.spreaderPathOut;
        if (thisWheelNav.initPercent < thisWheelNav.maxPercent) {
            currentPath = this.spreaderPathIn;
        }

        this.spreaderPath = this.wheelnav.raphael.path(currentPath.spreaderPathString);
        this.spreaderPath.attr(thisWheelNav.spreaderPathAttr);
        this.spreaderPath.id = thisWheelNav.getSpreaderId();
        this.spreaderPath.node.id = this.spreaderPath.id;
        this.spreaderPath.click(function () {
            thisWheelNav.spreadWheel();
        });

        //Set titles
        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderInTitle)) {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderInTitle, this.wheelnav.raphael.raphael);
            this.inTitle = onTitle.getTitlePercentAttr(this.spreaderPathOut.titlePosX, this.spreaderPathOut.titlePosY);
        }
        else {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderInTitle);
            this.inTitle = onTitle.getTitlePercentAttr(this.spreaderPathOut.titlePosX, this.spreaderPathOut.titlePosY);
        }

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOutTitle)) {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOutTitle, this.wheelnav.raphael.raphael);
            this.outTitle = offTitle.getTitlePercentAttr(this.spreaderPathIn.titlePosX, this.spreaderPathIn.titlePosY);
            this.spreaderTitle = thisWheelNav.raphael.path(this.outTitle.path);
        }
        else {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOutTitle);
            this.outTitle = offTitle.getTitlePercentAttr(this.spreaderPathIn.titlePosX, this.spreaderPathIn.titlePosY);
            this.spreaderTitle = thisWheelNav.raphael.text(currentPath.titlePosX, currentPath.titlePosY, this.outTitle.title);
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
            currentPath = this.spreaderPathOut.spreaderPathString;
        }
        else {
            currentPath = this.spreaderPathIn.spreaderPathString;
        }

        spreaderTransformAttr = {
            path: currentPath
        };

        //Animate spreader
        this.spreaderPath.animate(spreaderTransformAttr, this.animatetime, this.animateeffect);

        //titles
        var currentTitle;

        if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
            currentTitle = this.outTitle;
            this.spreaderTitle.attr(this.wheelnav.spreaderTitleOutAttr);
            this.spreaderPath.attr(this.wheelnav.spreaderPathOutAttr);
        }
        else {
            currentTitle = this.inTitle;
            this.spreaderTitle.attr(this.wheelnav.spreaderTitleInAttr);
            this.spreaderPath.attr(this.wheelnav.spreaderPathInAttr);
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
