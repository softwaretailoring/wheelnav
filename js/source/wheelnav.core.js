/* ======================================================================================= */
/*                                   wheelnav.js - v1.4.0                                  */
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

wheelnav = function (divId, raphael, divWidth, divHeight) {

    this.holderId = "wheel";

    if (divId !== undefined &&
        divId !== null) {
        this.holderId = divId;
    }

    var holderDiv = document.getElementById(divId);

    if (raphael === undefined ||
        raphael === null) {
        holderDiv.innerText = "";
        holderDiv.innerHTML = "";

        if (divWidth !== undefined &&
            divWidth !== null) {
            if (divHeight === undefined ||
                divHeight === null) {
                divHeight = divWidth;
            }
            this.raphael = new Raphael(divId, divWidth, divHeight);
        }
        else {
            this.raphael = new Raphael(divId);
        }
    }
    else {
        this.raphael = raphael;
    }

    var canvasWidth = holderDiv.clientWidth;

    //Public properties
    this.centerX = canvasWidth / 2;
    this.centerY = canvasWidth / 2;
    this.wheelRadius = canvasWidth / 2;
    this.navAngle = 0;
    this.sliceAngle = null;
    this.titleRotateAngle = null;
    this.clickModeRotate = true;
    this.rotateRound = false;
    this.rotateRoundCount = 0;
    this.clickModeSpreadOff = false;
    this.animatetimeCalculated = false; // In clickModeRotate, when animatetimeCalculated is true, the navItem.animatetime calculated by wheelnav.animatetime and current rotationAngle. In this case, the wheelnav.animatetime belongs to the full rotation.
    this.animateRepeatCount = 0;
    this.clockwise = true;
    this.multiSelect = false;
    this.hoverPercent = 1;
    this.selectedPercent = 1;
    this.clickablePercentMin = 0;
    this.clickablePercentMax = 1;
    this.currentPercent = null;
    this.cssMode = false;
    this.selectedToFront = true;

    this.navItemCount = 0;
    this.navItemCountLabeled = false;
    this.navItemCountLabelOffset = 0;
    this.navItems = [];
    this.navItemsEnabled = true;
    this.animateFinishFunction = null;

    // These settings are useful when navItem.sliceAngle < 360 / this.navItemCount
    this.navItemsContinuous = false; 
    this.navItemsCentered = true; // This is reasoned when this.navItemsContinuous = false;

    this.colors = colorpalette.defaultpalette;
    this.titleSpreadScale = null;

    //Spreader settings
    this.spreaderEnable = false;
    this.spreaderRadius = 15;
    this.minPercent = 0.01;
    this.maxPercent = 1;

    //Private properties
    this.currentClick = 0;
    this.selectedNavItemIndex = 0;
    this.animateLocked = false;

    //NavItem default settings. These are configurable between initWheel() and createWheel().
    this.slicePathAttr = null;
    this.sliceHoverAttr = null;
    this.sliceSelectedAttr = null;
    
    this.titleFont = '100 24px Impact, Charcoal, sans-serif';
    this.titleAttr = null;
    this.titleHoverAttr = null;
    this.titleSelectedAttr = null;

    this.linePathAttr = null;
    this.lineHoverAttr = null;
    this.lineSelectedAttr = null;

    this.slicePathCustom = null;
    this.sliceSelectedPathCustom = null;
    this.sliceHoverPathCustom = null;

    this.sliceTransformCustom = null;
    this.sliceSelectedTransformCustom = null;
    this.sliceHoverTransformCustom = null;

    this.animateeffect = null;
    this.animatetime = null;
    this.slicePathFunction = slicePath().PieSlice;
    this.sliceClickablePathFunction = null;
    this.sliceTransformFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverPathFunction = null;
    this.sliceHoverTransformFunction = null;

    return this;
};

wheelnav.prototype.initWheel = function (titles) {

    //Init slices and titles
    if (!this.cssMode) {
        if (this.spreaderCircleAttr === undefined || this.spreaderCircleAttr === null) {
            this.spreaderCircleAttr = { fill: "#777", "stroke-width": 3, cursor: 'pointer' };
        }
        if (this.spreaderOnAttr === undefined || this.spreaderOnAttr === null) {
            this.spreaderOnAttr = { fill: "#FFF", cursor: 'pointer' };
        }
        if (this.spreaderOffAttr === undefined || this.spreaderOffAttr === null) {
            this.spreaderOffAttr = { fill: "#FFF", cursor: 'pointer' };
        }
    }
    else {
        this.spreaderCircleAttr = { "class": this.getSpreaderId() };
        this.spreaderOnAttr = { "class": this.getSpreadOnId() };
        this.spreaderOffAttr = { "class": this.getSpreadOffId() };
    }

    var navItem;
    if (this.navItemCount === 0) {

        if (titles === undefined ||
            titles === null ||
            !Array.isArray(titles)) {
            titles = ["title-0", "title-1", "title-2", "title-3"];
        }

        this.navItemCount = titles.length;
    }
    else {
        titles = null;
    }

    for (i = 0; i < this.navItemCount; i++) {

        var itemTitle = "";

        if (this.navItemCountLabeled) {
            itemTitle = (i + this.navItemCountLabelOffset).toString();
        }
        else {
            if (titles !== null)
                { itemTitle = titles[i]; }
            else
                { itemTitle = ""; }
        }

        navItem = new wheelnavItem(this, itemTitle, i);
        this.navItems.push(navItem);
    }

    //Init colors
    var colorIndex = 0;
    for (i = 0; i < this.navItems.length; i++) {
        this.navItems[i].fillAttr = this.colors[colorIndex];
        colorIndex++;
        if (colorIndex === this.colors.length) { colorIndex = 0;}
    }
};

wheelnav.prototype.createWheel = function (titles, withSpread) {

    if (this.navItems.length === 0) {
        this.initWheel(titles);
    }

    if (withSpread) {
        this.currentPercent = this.minPercent;
    }
    else {
        this.currentPercent = this.maxPercent;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.navItems[i].createNavItem();
    }

    this.spreader = new spreader(this);

    this.navItems[0].selected = true;
    this.refreshWheel();

    if (withSpread !== undefined) {
        this.spreadWheel();
    }

    return this;
};

wheelnav.prototype.refreshWheel = function (withPathAndTransform) {

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];
        navItem.setWheelSettings();
        navItem.refreshNavItem(withPathAndTransform);
    }

    this.spreader.setVisibility();
};

wheelnav.prototype.navigateWheel = function (clicked) {

    this.animateUnlock(true);

    if (this.clickModeRotate) {
        this.animateLocked = true;
    }

    var navItem;

    for (i = 0; i < this.navItemCount; i++) {
        navItem = this.navItems[i];

        navItem.hovered = false;

        if (i === clicked) {
            if (this.multiSelect) {
                navItem.selected = !navItem.selected;
            } else {
                navItem.selected = true;
                this.selectedNavItemIndex = i;
            }
        }
        else {
            if (!this.multiSelect) {
                navItem.selected = false;
            }
        }

        if (this.clickModeRotate) {
            var rotationAngle = this.navItems[clicked].navAngle - this.navItems[this.currentClick].navAngle;

            if (this.rotateRound) {
                if (this.clockwise && rotationAngle < 0) {
                    rotationAngle = 360 + rotationAngle;
                }
                if (!this.clockwise && rotationAngle > 0) {
                    rotationAngle = rotationAngle - 360;
                }
            }

            navItem.currentRotateAngle -= rotationAngle;

            if (this.animatetimeCalculated &&
                clicked !== this.currentClick) {
                navItem.animatetime = this.animatetime * (Math.abs(rotationAngle) / 360);
            }

            if (this.rotateRoundCount > 0) {
                if (this.clockwise) { navItem.currentRotateAngle -= this.rotateRoundCount * 360; }
                else { navItem.currentRotateAngle += this.rotateRoundCount * 360; }

                navItem.animatetime = this.animatetime * (this.rotateRoundCount + 1);
            }
        }
    }

    for (i = 0; i < this.navItemCount; i++) {
        navItem = this.navItems[i];
        navItem.setCurrentTransform(true);
        navItem.refreshNavItem();
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
        this.spreadWheel();
    }
};

wheelnav.prototype.spreadWheel = function () {

    this.animateUnlock(true);

    if (this.clickModeRotate) {
        this.animateLocked = true;
    }

    if (this.currentPercent === this.maxPercent ||
        this.currentPercent === null) {
        this.currentPercent = this.minPercent;
    }
    else {
        this.currentPercent = this.maxPercent;
    }

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];
        navItem.hovered = false;
        navItem.setCurrentTransform(true);
    }

    this.spreader.setVisibility();

    return this;
};

wheelnav.prototype.animateUnlock = function (force) {

    if (force !== undefined) {
        for (var f = 0; f < this.navItemCount; f++) {
            this.navItems[f].navSliceUnderAnimation = false;
            this.navItems[f].navTitleUnderAnimation = false;
            this.navItems[f].navLineUnderAnimation = false;
            this.navItems[f].navSlice.stop();
            this.navItems[f].navLine.stop();
            this.navItems[f].navTitle.stop();
        }
    }
    else {
        for (var i = 0; i < this.navItemCount; i++) {
            if (this.navItems[i].navSliceUnderAnimation === true ||
                this.navItems[i].navTitleUnderAnimation === true ||
                this.navItems[i].navLineUnderAnimation === true) {
                return;
            }
        }

        this.animateLocked = false;
        if (this.animateFinishFunction !== null) {
            this.animateFinishFunction();
        }
    }
};

wheelnav.prototype.setTooltips = function (tooltips) {
    if (tooltips !== undefined &&
        tooltips !== null &&
        Array.isArray(tooltips) &&
        tooltips.length <= this.navItems.length) {
        for (var i = 0; i < tooltips.length; i++) {
            this.navItems[i].setTooltip(tooltips[i]);
        }
    }
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
wheelnav.prototype.getSliceCssClass = function (index, subclass) {
    return "wheelnav-" + this.holderId + "-slice-" + subclass + "-" + index;
};
wheelnav.prototype.getTitleCssClass = function (index, subclass) {
    return "wheelnav-" + this.holderId + "-title-" + subclass + "-" + index;
};
wheelnav.prototype.getLineCssClass = function (index, subclass) {
    return "wheelnav-" + this.holderId + "-line-" + subclass + "-" + index;
};
wheelnav.prototype.getSpreaderId = function () {
    return "wheelnav-" + this.holderId + "-spreader";
};
wheelnav.prototype.getSpreadOnId = function () {
    return "wheelnav-" + this.holderId + "-spreadon";
};
wheelnav.prototype.getSpreadOffId = function () {
    return "wheelnav-" + this.holderId + "-spreadoff";
};

