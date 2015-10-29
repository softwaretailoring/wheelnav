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
        this.inTitleWidth = this.wheelnav.spreaderInTitleWidth;
        this.inTitleHeight = this.wheelnav.spreaderInTitleHeight;
        this.outTitleWidth = this.wheelnav.spreaderOutTitleWidth;
        this.outTitleHeight = this.wheelnav.spreaderOutTitleHeight;

        if (this.inTitleWidth !== null && this.inTitleHeight === null) { this.inTitleHeight = this.inTitleWidth; }
        if (this.inTitleWidth === null && this.inTitleHeight !== null) { this.inTitleWidth = this.inTitleHeight; }
        if (this.outTitleWidth !== null && this.outTitleHeight === null) { this.outTitleHeight = this.outTitleWidth; }
        if (this.outTitleWidth === null && this.outTitleHeight !== null) { this.outTitleWidth = this.outTitleHeight; }

        if (wheelnavTitle().isImageTitle(this.wheelnav.spreaderOutTitle)) {
            // Image default value
            if (this.inTitleWidth === null) { this.inTitleWidth = 32; }
            if (this.inTitleHeight === null) { this.inTitleHeight = 32; }
            if (this.outTitleWidth === null) { this.outTitleWidth = 32; }
            if (this.outTitleHeight === null) { this.outTitleHeight = 32; }
        }

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderInTitle)) {
            inTitle = new wheelnavTitle(this.wheelnav.spreaderInTitle, this.wheelnav.raphael.raphael);
        }
        else {
            inTitle = new wheelnavTitle(this.wheelnav.spreaderInTitle);
        }
        this.inTitleSizeTransform = inTitle.getTitleSizeTransform(this.inTitleWidth, this.inTitleHeight);
        this.inTitle = inTitle.getTitlePercentAttr(this.spreaderPathIn.titlePosX, this.spreaderPathIn.titlePosY, this.inTitleWidth, this.inTitleHeight);

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOutTitle)) {
            outTitle = new wheelnavTitle(this.wheelnav.spreaderOutTitle, this.wheelnav.raphael.raphael);
        }
        else {
            outTitle = new wheelnavTitle(this.wheelnav.spreaderOutTitle);
        }
        this.outTitleSizeTransform = outTitle.getTitleSizeTransform(this.outTitleWidth, this.outTitleHeight);
        this.outTitle = outTitle.getTitlePercentAttr(this.spreaderPathOut.titlePosX, this.spreaderPathOut.titlePosY, this.outTitleWidth, this.outTitleHeight);

        var currentTitle = this.outTitle;
        var currentTitleAttr = this.wheelnav.spreaderTitleOutAttr;
        var currentTitleWidth = this.outTitleWidth;
        var currentTitleHeight = this.outTitleHeight;
        var currentTitleSizeTransform = this.outTitleSizeTransform;
        if (thisWheelNav.initPercent < thisWheelNav.maxPercent) {
            currentTitle = this.inTitle;
            currentTitleAttr = this.wheelnav.spreaderTitleInAttr;
            currentTitleWidth = this.inTitleWidth;
            currentTitleHeight = this.inTitleHeight;
            currentTitleSizeTransform = this.inTitleSizeTransform;
        }

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOutTitle)) {
            this.spreaderTitle = thisWheelNav.raphael.path(currentTitle.path);
        }
        else if (wheelnavTitle().isImageTitle(this.wheelnav.spreaderOutTitle)) {
            this.spreaderTitle = this.wheelnav.raphael.image(currentTitle.src, currentPath.titlePosX - (currentTitleWidth / 2), currentPath.titlePosY - (currentTitleHeight / 2), currentTitleWidth, currentTitleHeight);
        }
        else {
            this.spreaderTitle = thisWheelNav.raphael.text(currentPath.titlePosX, currentPath.titlePosY, currentTitle.title);
        }
        
        this.spreaderTitle.attr(this.fontAttr);
        this.spreaderTitle.attr(currentTitleAttr);
        this.spreaderTitle.attr({ transform: currentTitleSizeTransform });
        this.spreaderTitle.id = thisWheelNav.getSpreaderTitleId();
        this.spreaderTitle.node.id = this.spreaderTitle.id;
        this.spreaderTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.setCurrentTransform();
    }

    return this;
};

spreader.prototype.setCurrentTransform = function (withoutAnimate) {
    if (this.wheelnav.spreaderEnable) {

        if (withoutAnimate === undefined ||
            withoutAnimate === false) {
            
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
            var titleTransformAttr;
            var titleSizeTransform;

            if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
                currentTitle = this.outTitle;
                titleTransformAttr = this.wheelnav.spreaderTitleOutAttr;
                this.spreaderPath.attr(this.wheelnav.spreaderPathOutAttr);
                titleSizeTransform = this.outTitleSizeTransform;
            }
            else {
                currentTitle = this.inTitle;
                titleTransformAttr = this.wheelnav.spreaderTitleInAttr;
                this.spreaderPath.attr(this.wheelnav.spreaderPathInAttr);
                titleSizeTransform = this.inTitleSizeTransform;
            }

            if (wheelnavTitle().isPathTitle(currentTitle.title)) {
                titleTransformAttr.path = currentTitle.path;
                titleTransformAttr.transform = titleSizeTransform;
            }
            else if (wheelnavTitle().isImageTitle(currentTitle.title)) {
                titleTransformAttr.x = currentTitle.x;
                titleTransformAttr.y = currentTitle.y;
                titleTransformAttr.width = currentTitle.width;
                titleTransformAttr.height = currentTitle.height;
                this.spreaderTitle.attr({ src: currentTitle.src });
            }
            else {
                //Little hack for proper appearance of "-" sign
                offYOffset = 0;
                if (currentTitle.title === "-") { offYOffset = 3; };

                titleTransformAttr.x = currentTitle.x;
                titleTransformAttr.y = currentTitle.y - offYOffset;

                if (currentTitle.title !== null) {
                    this.spreaderTitle.attr({ text: currentTitle.title });
                }
            }

            //Animate title
            this.spreaderTitle.animate(titleTransformAttr, this.animatetime, this.animateeffect);
        }

        this.spreaderPath.toFront();
        this.spreaderTitle.toFront();
    }
};
