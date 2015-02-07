///#source 1 1 /js/source/marker/wheelnav.marker.core.js
/* ======================================================================================= */
/* Marker of wheel                                                                         */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/marker.html        */ //Under construction!!!
/* ======================================================================================= */

marker = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.markerEnable) {

        this.markerHelper = new pathHelper();
        this.markerHelper.centerX = this.wheelnav.centerX;
        this.markerHelper.centerY = this.wheelnav.centerY;
        this.markerHelper.navItemCount = this.wheelnav.navItemCount;
        this.markerHelper.navAngle = this.wheelnav.navAngle;
        this.markerHelper.wheelRadius = this.wheelnav.wheelRadius;

        this.animateeffect = "bounce";
        this.animatetime = 1500;
        //Set animation from wheelnav
        if (this.wheelnav.animateeffect !== null) { this.animateeffect = this.wheelnav.animateeffect; }
        if (this.wheelnav.animatetime !== null) { this.animatetime = this.wheelnav.animatetime; }

        var markerPath = this.wheelnav.markerPathFunction(this.markerHelper, this.wheelnav.markerPathCustom);
        this.marker = this.wheelnav.raphael.path(markerPath.markerPathString);
        this.marker.attr(this.wheelnav.markerAttr);
    }

    return this;
};

marker.prototype.setCurrentTransform = function (navAngle) {

    var rotateAngle = navAngle - this.markerHelper.navAngle;

    markerTransformAttr = {
        transform: "r," + (rotateAngle).toString() + "," + this.wheelnav.centerX + "," + this.wheelnav.centerY
    };
    
    //Animate marker
    this.marker.animate(markerTransformAttr, this.animatetime, this.animateeffect);
};



///#source 1 1 /js/source/marker/wheelnav.markerPathStart.js
/* ======================================================================================= */
/* Spreader path definitions.                                                              */
/* ======================================================================================= */

markerPath = function () {

    this.NullSpreader = function (helper, custom) {

        if (custom === null) {
            custom = new markerPathCustomization();
        }

        helper.setBaseValue(custom);

        return {
            markerPathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };



///#source 1 1 /js/source/marker/wheelnav.markerPath.Line.js

this.LineMarkerCustomization = function () {

    var custom = new markerPathCustomization();
    custom.arcBaseRadiusPercent = 1;
    custom.arcRadiusPercent = 1.1;
    custom.startRadiusPercent = 0;
    return custom;
};

this.LineMarker = function (helper, custom) {

    if (custom === null) {
        custom = LineMarkerCustomization();
    }

    helper.setBaseValue(custom.markerPercent, custom);

    var arcBaseRadius = helper.sliceRadius * custom.arcBaseRadiusPercent;
    var arcRadius = helper.sliceRadius * custom.arcRadiusPercent;

    markerPathString = [helper.MoveTo(helper.navAngle, arcBaseRadius),
                 helper.LineTo(helper.navAngle, arcRadius),
                 helper.Close()];
    
    return {
        markerPathString: markerPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

///#source 1 1 /js/source/marker/wheelnav.markerPathEnd.js

    return this;
};



