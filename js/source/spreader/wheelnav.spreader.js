///#source 1 1 /js/source/spreader/wheelnav.spreader.core.js
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

///#source 1 1 /js/source/spreader/wheelnav.spreaderPathStart.js
/* ======================================================================================= */
/* Spreader path definitions.                                                              */
/* ======================================================================================= */

spreaderPath = function () {

    this.NullSpreader = function (helper, custom) {

        if (custom === null) {
            custom = new spreaderPathCustomization();
        }

        helper.setBaseValue(custom.spreaderPercent, custom);

        return {
            spreaderPathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };



///#source 1 1 /js/source/spreader/wheelnav.spreaderPath.Pie.js

this.PieSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.spreaderRadius = 25;
    custom.arcBaseRadiusPercent = 1;
    custom.arcRadiusPercent = 1;
    custom.startRadiusPercent = 0;
    return custom;
};

this.PieSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);

    var arcBaseRadius = helper.sliceRadius * custom.arcBaseRadiusPercent;
    var arcRadius = helper.sliceRadius * custom.arcRadiusPercent;

    spreaderPathString = [];
    helper.StartSpreader(spreaderPathString, helper.startAngle, arcBaseRadius);
    spreaderPathString.push(helper.ArcTo(arcRadius, helper.middleAngle, arcBaseRadius));
    spreaderPathString.push(helper.ArcTo(arcRadius, helper.endAngle, arcBaseRadius));
    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

///#source 1 1 /js/source/spreader/wheelnav.spreaderPath.Star.js

this.StarSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.minRadiusPercent = 0.5;

    return custom;
};

this.StarSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = StarSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);
    rbase = helper.wheelRadius * custom.spreaderPercent * custom.minRadiusPercent * percent;
    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;
    baseAngle = helper.navAngle;
    if (helper.endAngle - helper.startAngle < 360) { baseAngle = helper.startAngle; }

    helper.StartSpreader(spreaderPathString, baseAngle, r);

    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (baseAngle + sliceAngle / 2);
        middleAngle = startAngle + (sliceAngle / 2);
        endAngle = startAngle + sliceAngle;
        if (helper.endAngle - helper.startAngle < 360) {
            if (i === helper.navItemCount - 1) { endAngle = middleAngle; }
        }
        spreaderPathString.push(helper.LineTo(startAngle, rbase));
        spreaderPathString.push(helper.LineTo(middleAngle, r));
        spreaderPathString.push(helper.LineTo(endAngle, rbase));
    }

    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};


///#source 1 1 /js/source/spreader/wheelnav.spreaderPath.AntiStar.js

this.AntiStarSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.minRadiusPercent = 0.21;

    return custom;
};

this.AntiStarSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = AntiStarSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);
    rbase = helper.wheelRadius * custom.spreaderPercent * custom.minRadiusPercent * percent;
    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;
    baseAngle = helper.navAngle;
    if (helper.endAngle - helper.startAngle < 360) {
        baseAngle = helper.startAngle;
        helper.StartSpreader(spreaderPathString, baseAngle, rbase);
    }
    else {
        spreaderPathString.push(helper.MoveTo(helper.startAngle + (helper.navAngle + sliceAngle / 2), rbase));
    }

    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (baseAngle + sliceAngle / 2);
        middleAngle = startAngle + (sliceAngle / 2);
        endAngle = startAngle + sliceAngle;

        if (helper.endAngle - helper.startAngle < 360) {
            if (i === helper.navItemCount - 1) { endAngle = middleAngle; }
        }

        spreaderPathString.push(helper.LineTo(startAngle, r));
        spreaderPathString.push(helper.LineTo(middleAngle, rbase));
        spreaderPathString.push(helper.LineTo(endAngle, r));
    }

    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};


///#source 1 1 /js/source/spreader/wheelnav.spreaderPath.Flower.js

this.FlowerSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.minRadiusPercent = 0.63
    custom.menuRadius = 7;;

    return custom;
};

this.FlowerSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = FlowerSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);
    rbase = helper.wheelRadius * custom.spreaderPercent * custom.minRadiusPercent * percent;
    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;
    baseAngle = helper.navAngle;
    if (helper.endAngle - helper.startAngle < 360) {
        baseAngle = helper.startAngle;
        helper.StartSpreader(spreaderPathString, baseAngle, rbase);
    }
    else {
        spreaderPathString.push(helper.MoveTo(helper.startAngle + (helper.navAngle + sliceAngle / 2), rbase));
    }
    
    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (baseAngle + sliceAngle / 2);
        middleAngle = startAngle + (sliceAngle / 2);
        endAngle = startAngle + sliceAngle;

        if (helper.endAngle - helper.startAngle < 360) {
            if (i === 0) { spreaderPathString.push(helper.ArcTo(custom.menuRadius, startAngle, rbase)); }
            if (i === helper.navItemCount - 1) { endAngle = middleAngle; }
        }
        else {
            spreaderPathString.push(helper.LineTo(startAngle, rbase));
        }

        spreaderPathString.push(helper.ArcTo(custom.menuRadius, endAngle, rbase));
    }

    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};


///#source 1 1 /js/source/spreader/wheelnav.spreaderPath.Holder.js

this.HolderSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.minRadiusPercent = 0.5;
    custom.menuRadius = 37;

    return custom;
};

this.HolderSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = HolderSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);
    rbase = helper.wheelRadius * custom.spreaderPercent * custom.minRadiusPercent * percent;
    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;
    baseAngle = helper.navAngle;
    if (helper.endAngle - helper.startAngle < 360) {
        baseAngle = helper.startAngle;
        helper.StartSpreader(spreaderPathString, baseAngle, rbase);
    }
    else {
        spreaderPathString.push(helper.MoveTo(helper.startAngle + (helper.navAngle + sliceAngle / 2), rbase));
    }

    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (baseAngle + sliceAngle / 2);
        middleAngle = startAngle + (sliceAngle / 4);
        endAngle = startAngle + sliceAngle;

        if (helper.endAngle - helper.startAngle < 360) {
            if (i === helper.navItemCount - 1) { endAngle = middleAngle; }
        }
        else {
            spreaderPathString.push(helper.LineTo(startAngle, rbase));
        }

        spreaderPathString.push(helper.LineTo(startAngle, r));
        spreaderPathString.push(helper.ArcBackTo(custom.menuRadius, middleAngle, rbase));
        spreaderPathString.push(helper.ArcTo(custom.menuRadius, endAngle, r));
    }

    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};


///#source 1 1 /js/source/spreader/wheelnav.spreaderPath.Line.js

this.LineSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.minRadiusPercent = 0.5;

    return custom;
};

this.LineSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = LineSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);
    rbase = helper.wheelRadius * custom.spreaderPercent * custom.minRadiusPercent * percent;
    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;
    baseAngle = helper.navAngle;
    if (helper.endAngle - helper.startAngle < 360) { baseAngle = helper.startAngle; }

    spreaderPathString.push(helper.MoveTo(baseAngle + sliceAngle / 2, r));

    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (baseAngle + sliceAngle / 2);
        endAngle = startAngle + sliceAngle;
        if (helper.navItemCount === 2) {
            endAngle -= 90;
        }

        spreaderPathString.push(helper.LineTo(startAngle, r));
        spreaderPathString.push(helper.LineTo(endAngle, r));
    }

    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};


///#source 1 1 /js/source/spreader/wheelnav.spreaderPathEnd.js

    return this;
};



