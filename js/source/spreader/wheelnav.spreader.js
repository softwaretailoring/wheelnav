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

        var fontAttr = { font: '100 32px Impact, Charcoal, sans-serif' };

        this.spreaderPathOn = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderOnPercent, this.wheelnav.spreaderPathCustom);
        this.spreaderPathOff = this.wheelnav.spreaderPathFunction(this.spreaderHelper, this.wheelnav.spreaderOffPercent, this.wheelnav.spreaderPathCustom);

        this.spreaderPath = this.wheelnav.raphael.path(this.spreaderPathOn.spreaderPathString);
        this.spreaderPath.attr(thisWheelNav.spreaderPathAttr);
        this.spreaderPath.id = thisWheelNav.getSpreaderId();
        this.spreaderPath.node.id = this.spreaderPath.id;
        this.spreaderPath.click(function () {
            thisWheelNav.spreadWheel();
        });

        //Set titles
        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOnTitle)) {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderOnTitle, this.wheelnav.raphael.raphael);
            this.spreadOnTitle = this.wheelnav.raphael.path(onTitle.getTitlePercentAttr(this.spreaderPathOn.titlePosX, this.spreaderPathOn.titlePosY).path);
        }
        else {
            onTitle = new wheelnavTitle(this.wheelnav.spreaderOnTitle);
            this.spreadOnTitle = thisWheelNav.raphael.text(this.spreaderPathOn.titlePosX, this.spreaderPathOn.titlePosY, onTitle.title);
        }

        this.spreadOnTitle.attr(fontAttr);
        this.spreadOnTitle.attr(thisWheelNav.spreaderOnAttr);
        this.spreadOnTitle.id = thisWheelNav.getSpreadOnId();
        this.spreadOnTitle.node.id = this.spreadOnTitle.id;
        this.spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        if (wheelnavTitle().isPathTitle(this.wheelnav.spreaderOffTitle)) {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOffTitle, this.wheelnav.raphael.raphael);
            this.spreadOffTitle = this.wheelnav.raphael.path(offTitle.getTitlePercentAttr(this.spreaderPathOff.titlePosX, this.spreaderPathOff.titlePosY).path);
        }
        else {
            offTitle = new wheelnavTitle(this.wheelnav.spreaderOffTitle);
            this.spreadOffTitle = thisWheelNav.raphael.text(this.spreaderPathOff.titlePosX, this.spreaderPathOff.titlePosY - 3, offTitle.title);
        }

        this.spreadOffTitle.attr(fontAttr);
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

    spreaderPathString = [helper.MoveTo(helper.startAngle, arcBaseRadius),
                 helper.ArcTo(arcRadius, helper.middleAngle, arcBaseRadius),
                 helper.ArcTo(arcRadius, helper.endAngle, arcBaseRadius),
                 helper.Close()];
    
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

    r = helper.wheelRadius * custom.spreaderPercent;
    rbase = r * custom.minRadiusPercent * percent;

    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;

    spreaderPathString.push(helper.MoveTo(helper.startAngle + (helper.navAngle + sliceAngle / 2), rbase));
    
    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (helper.navAngle + sliceAngle / 2);
        middleAngle = startAngle + (sliceAngle / 2);
        endAngle = startAngle + sliceAngle;

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


///#source 1 1 /js/source/spreader/wheelnav.spreaderPathEnd.js

    return this;
};



