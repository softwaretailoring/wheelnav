/* ======================================================================================= */
/*                                   wheelnav.js - v1.0                                    */
/* ======================================================================================= */
/* This is a small javascript library for animated SVG based wheel navigation.             */
/* Requires Raphaël JavaScript Vector Library (http://raphaeljs.com)                       */
/* ======================================================================================= */
/* Check http://wheelnavjs.softwaretailoring.net for samples.                              */
/* Fork https://github.com/softwaretailoring/wheelnav for contribution.                    */
/* ======================================================================================= */
/* Copyright © 2014 Gábor Berkesi (http://softwaretailoring.net)                           */
/* Licensed under MIT (https://github.com/softwaretailoring/wheelnav/blob/master/LICENSE)  */
/* ======================================================================================= */

/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/core.html          */
/* ======================================================================================= */

wheelnav = function(divId) {

    this.holderId = divId;

    var holderDiv = document.getElementById(divId);
    holderDiv.innerText = "";
    holderDiv.innerHTML = "";

    this.raphael = new Raphael(divId);
    
    this.currentRotate = 0;
    this.currentClick = 0;

    var canvasWidth = this.raphael.canvas.getAttribute('width');
    this.centerX = canvasWidth / 2;
    this.centerY = canvasWidth / 2;
    this.wheelSugar = canvasWidth / 2;
    this.navAngle = 0;
    this.baseAngle = null;
    this.sliceAngle = 0;
    this.titleRotateAngle = null;
    this.clickModeRotate = true;
    this.clickModeSpreadOff = false;
    this.multiSelect = false;
    this.hoverPercent = 1;
    this.selectedPercent = 1;
    this.currentPercent = null;
    
    this.navItemCount = 0;
    this.navItems = new Array();
    this.colors = colorpalette.defaultpalette;
    this.slicePathFunction = slicePath().PieSlice;
    this.sliceTransformFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverPathFunction = null;
    this.sliceHoverTransformFunction = null;
    this.titleFont = '100 24px Impact, Charcoal, sans-serif';
    this.titleSpreadScale = null;

    //Spreader settings
    this.spreaderEnable = false;
    this.spreaderSugar = 15;
    this.spreaderCircleAttr = { fill: "#777", "stroke-width": 3 };
    this.spreaderOnAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
    this.spreaderOffAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
    this.minPercent = 0.01;
    this.maxPercent = 1;

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

    this.navDivTabId = null; //Id of Bootstrap <ul class="nav nav-tabs">. It is necessary for proper fade effect.
    this.navDivDefultCssClass = null;
    this.navDivSelectedCssClass = null;

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

wheelnav.prototype.createWheel = function (titles, withSpread) {

    if (this.navItems.length == 0) {
        this.initWheel(titles);
    }

    this.navItemCount = this.navItems.length;
    this.sliceAngle = 360 / this.navItemCount;

    if (this.baseAngle == null) {
        this.baseAngle = -(360 / this.navItemCount) / 2 + this.navAngle;
    }
    else {
        this.navAngle = this.baseAngle + ((360 / this.navItemCount) / 2);
    }

    this.spreader = new spreader(this);

    if (withSpread) {
        this.currentPercent = this.minPercent;
    }
    else {
        this.currentPercent = this.maxPercent;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.navItems[i].createNavItem();
    }

    this.navigateWheel(0);

    if (withSpread) {
        this.spreadWheel();
    }

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

        if (navItem.selected) {
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
            navItem.navLine.toBack();
        }
    }

    this.spreader.setVisibility();
}

wheelnav.prototype.navigateWheel = function (clicked) {

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];

        if (i == clicked) {
            if (this.multiSelect) {
                navItem.selected = !navItem.selected;
            } else {
                navItem.selected = true;
            }
        }
        else {
            if (!this.multiSelect) {
                navItem.selected = false;
            }
        }

        navItem.currentRotate -= (clicked - this.currentClick) * (360 / this.navItemCount);
    }

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];
        navItem.setCurrentTransform();
        navItem.setNavDivCssClass();
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
        this.spreadWheel();
    }

    this.refreshWheel();
}

wheelnav.prototype.spreadWheel = function () {

    if (this.currentPercent == this.maxPercent ||
        this.currentPercent == null) {
        this.currentPercent = this.minPercent;
    }
    else {
        this.currentPercent = this.maxPercent;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.navItems[i].setCurrentTransform();
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

