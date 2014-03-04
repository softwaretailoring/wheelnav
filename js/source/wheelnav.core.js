/* ======================================================================================= */
/*                                   wheelnav.js - v1.0                                   */
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
    this.navWheelSugar = 0.8 * canvasWidth / 2;
    this.baseAngle = null;
    this.sliceAngle = 0;
    this.titleRotate = false;
    this.clickModeRotate = true;
    this.clickModeSpreadOff = false;
    
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

    this.navigateWheel(0);

    var thisWheelNav = this;

    if (this.spreaderEnable)
    {
        var spreaderCircle = this.raphael.circle(this.centerX, this.centerY, this.spreaderSugar).attr(this.spreaderCircleAttr);
        spreaderCircle.id = "spreadercircle";
        var spreadOnTitle = this.raphael.text(this.centerX, this.centerY, "+").attr(this.spreaderOnAttr);
        spreadOnTitle.id = this.getSpreadOnId();
        spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel(0, 1);
        });
        var spreadOffTitle = this.raphael.text(this.centerX, this.centerY - 3, "–").attr(this.spreaderOffAttr);
        spreadOffTitle.id = this.getSpreadOffId();
        spreadOffTitle.click(function () {
            thisWheelNav.spreadWheel(1, 0);
        });
        spreadOffTitle.toFront();
        spreadOnTitle.toBack();
    }

    return this;
};

wheelnav.prototype.refreshWheel = function () {

    for (i = 0; i < this.navItemCount; i++) {

        var navItem = this.navItems[i];
        var navSlice = this.raphael.getById(this.getSliceId(i));
        var navTitle = this.raphael.getById(this.getTitleId(i));
        var navLine = this.raphael.getById(this.getLineId(i));

        //Refresh slice
        if (this.slicePathAttr != null) { navItem.slicePathAttr = this.slicePathAttr; }
        if (this.sliceHoverAttr != null) { navItem.sliceHoverAttr = this.sliceHoverAttr; }
        if (this.sliceSelectedAttr != null) { navItem.sliceSelectedAttr = this.sliceSelectedAttr; }
        navSlice.attr(navItem.slicePathAttr);

        //Refresh title
        if (this.titleAttr != null) { navItem.titleAttr = this.titleAttr; }
        if (this.titleHoverAttr != null) { navItem.titleHoverAttr = this.titleHoverAttr; }
        if (this.titleSelectedAttr != null) { navItem.titleSelectedAttr = this.titleSelectedAttr; }
        navTitle.attr(navItem.titleAttr);

        //Refresh line
        if (this.linePathAttr != null) { navItem.linePathAttr = this.linePathAttr; }
        if (this.lineHoverAttr != null) { navItem.lineHoverAttr = this.lineHoverAttr; }
        if (this.lineSelectedAttr != null) { navItem.lineSelectedAttr = this.lineSelectedAttr; }
        navLine.attr(navItem.linePathAttr);

        if (this.currentClick == i) {
            navSlice.attr(navItem.fillAttr);
            navSlice.attr(navItem.sliceSelectedAttr);
            navTitle.attr(navItem.titleSelectedAttr);
            navTitle.toFront();
            navLine.attr(navItem.lineSelectedAttr);
        }
    }
}

wheelnav.prototype.navigateWheel = function (clicked) {

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];
        navItem.currentRotate -= (clicked - this.currentClick) * (360 / this.navItemCount);

        var navSlice = this.raphael.getById(this.getSliceId(i));
        var navTitle = this.raphael.getById(this.getTitleId(i));
        var navLine = this.raphael.getById(this.getLineId(i));

        var sliceTransform = "";
        if (this.clickModeRotate) { sliceTransform = navItem.getItemRotateString(); }
        if (i == clicked) { sliceTransform += navItem.selectTransform.sliceTransformString; }
        navSlice.attr({ currentTransform: sliceTransform });
        navSlice.animate({ transform: [sliceTransform] }, navItem.animatetime, navItem.animateeffect);

        var lineTransform = "";
        if (this.clickModeRotate) { lineTransform = navItem.getItemRotateString(); }
        if (i == clicked) { lineTransform += navItem.selectTransform.lineTransformString; }
        navLine.attr({ currentTransform: lineTransform });
        navLine.animate({ transform: [lineTransform] }, navItem.animatetime, navItem.animateeffect);

        var titleTransform = "";
        if (this.clickModeRotate) { titleTransform = navItem.getTitleRotateString(); }
        if (i == clicked) { titleTransform += this.navItems[0].selectTransform.titleTransformString; }
        navTitle.attr({ currentTransform: titleTransform });
        navTitle.animate({ transform: [titleTransform] }, navItem.animatetime, navItem.animateeffect);
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
        this.spreadWheel(1, 0);
    }

    this.refreshWheel();
}

wheelnav.prototype.spreadWheel = function (startPercent, endPercent) {

    for (i = 0; i < this.navItemCount; i++) {

        var thisWheelNav = this;
        var navItem = this.navItems[i];

        var navSlice = this.raphael.getById(this.getSliceId(i));
        var navTitle = this.raphael.getById(this.getTitleId(i));
        var navLine = this.raphael.getById(this.getLineId(i));

        navSlice.attr({ slicePathFunction: navItem.getSlicePath });
        navSlice.attr({ slicePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] }).animate({ slicePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect, function () {
            if (startPercent > endPercent) {
                this.attr({ transform: "" });
            }
            if (endPercent > startPercent) {
                var currentTransform = this.attr("currentTransform");
                this.attr({ transform: currentTransform });
            }
        });

        navLine.attr({ slicePathFunction: navItem.getSlicePath });
        navLine.attr({ linePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] }).animate({ linePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect, function () {
            if (startPercent > endPercent) {
                this.attr({ transform: "" });
            }
            if (endPercent > startPercent) {
                var currentTransform = this.attr("currentTransform");
                this.attr({ transform: currentTransform });
            }
        });

        var currentPos = i;
        if (this.clickModeRotate) { currentPos = i - this.currentClick; }
        if (currentPos < 0) { currentPos += this.navItemCount; }
        var navItemCurrent = this.navItems[currentPos];
        navTitle.attr({ slicePathFunction: navItem.getSlicePath });
        navTitle.attr({ titlePercentPos: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, navItemCurrent.titlePosX, navItemCurrent.titlePosY, currentPos, startPercent] });
        navTitle.animate({ titlePercentPos: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, navItemCurrent.titlePosX, navItemCurrent.titlePosY, currentPos, endPercent] }, navItem.animatetime, navItem.animateeffect, function () {
            if (endPercent > startPercent) {
                var currentTransform = this.attr("currentTransform");
                this.attr({ transform: currentTransform });
            }
        });
    }

    if (this.spreaderEnable) {
        this.raphael.getById("spreadercircle").toFront();
        var spreadOnTitle = this.raphael.getById(this.getSpreadOnId());
        var spreadOffTitle = this.raphael.getById(this.getSpreadOffId());

        if (endPercent > startPercent) {
            spreadOffTitle.toFront();
            spreadOnTitle.toBack();
        }
        else {
            spreadOffTitle.toBack();
            spreadOnTitle.toFront();
        }
    }

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

