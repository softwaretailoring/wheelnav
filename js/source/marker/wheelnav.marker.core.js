/* ======================================================================================= */
/* Marker of wheel                                                                         */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/marker.html        */
/* ======================================================================================= */

marker = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.markerEnable) {

        this.markerHelper = new pathHelper();
        this.markerHelper.centerX = this.wheelnav.centerX;
        this.markerHelper.centerY = this.wheelnav.centerY;
        this.markerHelper.navItemCount = this.wheelnav.navItemCount;
        this.markerHelper.navAngle = this.wheelnav.navAngle;
        this.markerHelper.wheelRadius = this.wheelnav.wheelRadius * this.wheelnav.maxPercent;
        this.markerHelper.sliceAngle = this.wheelnav.navItems[0].sliceAngle;
        this.markerHelper.startAngle = this.markerHelper.navAngle - (this.markerHelper.sliceAngle / 2);

        this.animateeffect = "bounce";
        this.animatetime = 1500;
        //Set animation from wheelnav
        if (this.wheelnav.animateeffect !== null) { this.animateeffect = this.wheelnav.animateeffect; }
        if (this.wheelnav.animatetime !== null) { this.animatetime = this.wheelnav.animatetime; }

        this.markerPathMin = this.wheelnav.markerPathFunction(this.markerHelper, this.wheelnav.minPercent, this.wheelnav.markerPathCustom);
        this.markerPathMax = this.wheelnav.markerPathFunction(this.markerHelper, this.wheelnav.maxPercent, this.wheelnav.markerPathCustom);
        this.marker = this.wheelnav.raphael.path(this.markerPathMax.markerPathString);
        this.marker.attr(this.wheelnav.markerAttr);
        this.marker.id = this.wheelnav.getMarkerId();
        this.marker.node.id = this.marker.id;
    }

    return this;
};

marker.prototype.setCurrentTransform = function (navAngle) {

    if (this.wheelnav.markerEnable) {
        var currentPath = "";

        if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
            currentPath = this.markerPathMax.markerPathString;
        }
        else {
            currentPath = this.markerPathMin.markerPathString;
        }

        if (navAngle !== undefined) {
            var rotationAngle = navAngle - this.markerHelper.navAngle;

            markerTransformAttr = {
                transform: "r," + (rotationAngle).toString() + "," + this.wheelnav.centerX + "," + this.wheelnav.centerY,
                path: currentPath
            };
        }
        else {
            markerTransformAttr = {
                path: currentPath
            };
        }

        //Animate marker
        this.marker.animate(markerTransformAttr, this.animatetime, this.animateeffect);
        this.marker.toFront();
    }
};


