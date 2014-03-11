/* ======================================================================================= */
/*                                   wheelnav.js - v1.0                                    */
/* ======================================================================================= */
/* This is a small javascript library for animated SVG based wheel navigation.             */
/* Requires Raphaël JavaScript Vector Library (http://raphaeljs.com)                       */
/* ======================================================================================= */
/* Check http://wheelnavjs.softwaretailoring.net for samples and documentation.            */
/* Fork https://github.com/softwaretailoring/wheelnav for contribution.                    */
/* ======================================================================================= */
/* Copyright © 2014 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/wheelnav/blob/master/LICENSE)  */
/* ======================================================================================= */


wheelnav = function(divId) {

    this.holderId = divId;
    this.raphael = Raphael(divId);
    setRaphaelCustomAttributes(this.raphael);
    
    this.currentRotate = 0;
    this.currentClick = 0;

    var canvasWidth = this.raphael.canvas.getAttribute('width');
    this.centerX = canvasWidth / 2;
    this.centerY = canvasWidth / 2;
    this.navWheelSugar = canvasWidth / 2;
    this.baseAngle = null;
    this.sliceAngle = 0;
    this.titleRotate = false;
    this.titleRotateAngle = 0;
    this.clickModeRotate = true;
    this.clickModeSpreadOff = false;
    this.minPercent = 0;
    this.maxPercent = 1;
    this.currentPercent = 1;
    
    this.navItemCount = 0;
    this.navItems = new Array();
    this.colors = colorpalette.defaultpalette;
    this.slicePath = slicePath().PieSlice;
    this.sliceSelectTransform = sliceSelectTransform().NullTransform;
    this.titleFont = '100 24px Impact, Charcoal, sans-serif';

    //NavItem settings. If it remains null, use default settings.
    this.animateeffect = null;
    this.animatetime = null;
    this.slicePathAttr = null;
    this.sliceHoverAttr = null;
    this.sliceSelectedAttr = null;
    this.titleAttr = null;
    this.titleHoverAttr = null;
    this.titleSelectedAttr = null;
    this.linePathAttr = null;
    this.lineHoverAttr = null;
    this.lineSelectedAttr = null;

    //Spreader settings
    this.spreaderEnable = false;
    this.spreaderSugar = 15;
    this.spreaderCircleAttr = { fill: "#777", "stroke-width": 3 };
    this.spreaderOnAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
    this.spreaderOffAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };

    return this;
}

wheelnav.prototype.initWheel = function (titles) {

    //Init slices and titles
    if (this.navItemCount == 0) {

        if (titles == null && !Array.isArray(titles)) {
            titles = new Array("title-0", "title-1", "title-2", "title-3");
        }

        for (i = 0; i < titles.length; i++) {
            var navItem = new wheelnavItem(this, titles[i], i);
            this.navItems.push(navItem);
        }
    }
    else {
        for (i = 0; i < this.navItemCount; i++) {
            var navItem = new wheelnavItem(this, "", i);
            this.navItems.push(navItem);
        }
    }

    //Init colors
    var colorIndex = 0;
    for (i = 0; i < this.navItems.length; i++) {
        this.navItems[i].fillAttr = { fill: this.colors[colorIndex] };
        colorIndex++;
        if (colorIndex == this.colors.length) { colorIndex = 0;}
    }
};

wheelnav.prototype.createWheel = function (titles) {

    if (this.navItems.length == 0) {
        this.initWheel(titles);
    }

    this.navItemCount = this.navItems.length;
    this.sliceAngle = 360 / this.navItemCount;

    if (this.baseAngle == null) {
        this.baseAngle = -(360 / this.navItemCount) / 2;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.navItems[i].createNavItem();
    }

    this.spreader = new spreader(this);

    this.navigateWheel(0);

    return this;
};

wheelnav.prototype.refreshWheel = function () {

    for (i = 0; i < this.navItemCount; i++) {

        var navItem = this.navItems[i];

        //Refresh slice
        if (this.slicePathAttr != null) { navItem.slicePathAttr = this.slicePathAttr; }
        if (this.sliceHoverAttr != null) { navItem.sliceHoverAttr = this.sliceHoverAttr; }
        if (this.sliceSelectedAttr != null) { navItem.sliceSelectedAttr = this.sliceSelectedAttr; }

        //Refresh title
        if (this.titleAttr != null) { navItem.titleAttr = this.titleAttr; }
        if (this.titleHoverAttr != null) { navItem.titleHoverAttr = this.titleHoverAttr; }
        if (this.titleSelectedAttr != null) { navItem.titleSelectedAttr = this.titleSelectedAttr; }

        //Refresh line
        if (this.linePathAttr != null) { navItem.linePathAttr = this.linePathAttr; }
        if (this.lineHoverAttr != null) { navItem.lineHoverAttr = this.lineHoverAttr; }
        if (this.lineSelectedAttr != null) { navItem.lineSelectedAttr = this.lineSelectedAttr; }

        if (this.currentClick == i) {
            navItem.navSlice.attr(navItem.fillAttr);
            navItem.navSlice.attr(navItem.sliceSelectedAttr);
            navItem.navTitle.attr(navItem.titleSelectedAttr);
            navItem.navLine.attr(navItem.lineSelectedAttr);

            navItem.navSlice.toFront();
            navItem.navTitle.toFront();
        }
        else {
            navItem.navSlice.attr(navItem.slicePathAttr);
            navItem.navTitle.attr(navItem.titleAttr);
            navItem.navLine.attr(navItem.linePathAttr);

            navItem.navTitle.toBack();
            navItem.navSlice.toBack();
        }
    }

    this.spreader.setVisibility();
}

wheelnav.prototype.navigateWheel = function (clicked) {

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];

        navItem.currentRotate -= (clicked - this.currentClick) * (360 / this.navItemCount);

        var sliceTransform = "";
        if (this.clickModeRotate) { sliceTransform = navItem.getItemRotateString(); }
        if (i == clicked) { sliceTransform += navItem.selectTransform.sliceTransformString; }
        navItem.navSlice.attr({ currentTransform: sliceTransform });
        navItem.navSlice.animate({ transform: [sliceTransform] }, navItem.animatetime, navItem.animateeffect);

        var lineTransform = "";
        if (this.clickModeRotate) { lineTransform = navItem.getItemRotateString(); }
        if (i == clicked) { lineTransform += navItem.selectTransform.lineTransformString; }
        navItem.navLine.attr({ currentTransform: lineTransform });
        navItem.navLine.animate({ transform: [lineTransform] }, navItem.animatetime, navItem.animateeffect);

        var titleTransform = "";
        if (this.clickModeRotate) { titleTransform += navItem.getTitleRotateString(); }
        if (i == clicked) { titleTransform += this.navItems[0].selectTransform.titleTransformString; }
        navItem.navTitle.attr({ currentTransform: titleTransform });
        navItem.navTitle.animate({ transform: [titleTransform] }, navItem.animatetime, navItem.animateeffect);
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
        this.spreadWheel();
    }

    this.refreshWheel();
}

wheelnav.prototype.spreadWheel = function () {

    var startPercent,
        endPercent;

    if (this.currentPercent == this.minPercent) {
        startPercent = this.minPercent;
        endPercent = this.maxPercent;
        this.currentPercent = this.maxPercent;
    }
    else {
        startPercent = this.maxPercent;
        endPercent = this.minPercent;
        this.currentPercent = this.minPercent;
    }

    for (i = 0; i < this.navItemCount; i++) {

        var thisWheelNav = this;
        var navItem = this.navItems[i];

        var thisNavSlice = navItem.navSlice;
        navItem.navSlice.attr({ slicePathFunction: navItem.getSlicePath });
        navItem.navSlice.attr({ slicePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] }).animate({ slicePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect, function () {
            if (endPercent == 0) {
                this.attr({ transform: "s0" });
            }
            if (endPercent > startPercent) {
                var currentTransform = this.attr("currentTransform");
                this.attr({ transform: currentTransform });
            }
        });

        navItem.navLine.attr({ slicePathFunction: navItem.getSlicePath });
        navItem.navLine.attr({ linePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] }).animate({ linePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect, function () {
            if (endPercent == 0) {
                this.attr({ transform: "s0" });
            }
            if (endPercent > startPercent) {
                var currentTransform = this.attr("currentTransform");
                this.attr({ transform: currentTransform });
            }
        });

        navItem.navTitle.attr({ slicePathFunction: navItem.getSlicePath });
        navItem.navTitle.attr({ titlePercentFunction: navItem.getTitlePercentAttr });
        navItem.navTitle.attr({ currentTitle: navItem.titlePath });
        navItem.navTitle.attr({ titlePercentPos: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] });
        navItem.navTitle.animate({ titlePercentPos: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect, function () {
            var currentTransform = this.attr("currentTransform");

            if (endPercent == 0) {
                currentTransform = "s0";
            }

            this.attr({ transform: currentTransform });
            
        });
    }

    this.spreader.setVisibility();

    return this;
};

wheelnav.prototype.getItemId = function (index) {
    return "wheelnav-" + this.holderId + "-item-" + index;
};
wheelnav.prototype.getSliceId = function (index) {
    return "wheelnav-" + this.holderId + "-slice-" + index;
};
wheelnav.prototype.getTitleId = function (index) {
    return "wheelnav-" + this.holderId + "-title-" + index;
};
wheelnav.prototype.getLineId = function (index) {
    return "wheelnav-" + this.holderId + "-line-" + index;
};
wheelnav.prototype.getSpreadOnId = function () {
    return "wheelnav-" + this.holderId + "-spreadon";
};
wheelnav.prototype.getSpreadOffId = function () {
    return "wheelnav-" + this.holderId + "-spreadoff";
};

