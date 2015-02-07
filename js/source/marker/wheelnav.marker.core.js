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


