///#source 1 1 /js/source/wheelnav.core.js
/* ======================================================================================= */
/*                                   wheelnav.js - v1.3.0                                  */
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

wheelnav = function (divId, raphael) {

    this.holderId = divId;

    var holderDiv = document.getElementById(divId);

    if (raphael === undefined) {
        holderDiv.innerText = "";
        holderDiv.innerHTML = "";
        this.raphael = new Raphael(divId);
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
    this.clickablePercentMax = 0;
    this.currentPercent = null;

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
    this.spreaderCircleAttr = { fill: "#777", "stroke-width": 3 };
    this.spreaderOnAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
    this.spreaderOffAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
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

    this.animateeffect = "bounce";
    this.animatetime = 1500;
    this.slicePathFunction = slicePath().PieSlice;
    this.sliceClickablePathFunction = slicePath().PieSlice;
    this.sliceTransformFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverPathFunction = null;
    this.sliceHoverTransformFunction = null;

    return this;
};

wheelnav.prototype.initWheel = function (titles) {

    //Init slices and titles
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

    this.spreader = new spreader(this);
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

    if (withSpread !== undefined) {
        this.navItems[0].selected = true;
        this.spreadWheel();
    }
    else if (this.rotateRoundCount === 0) {
        this.navigateWheel(0);
    }

    return this;
};

wheelnav.prototype.refreshWheel = function (selectedToFront) {

    for (i = 0; i < this.navItemCount; i++) {

        var navItem = this.navItems[i];

        //Refresh slice
        if (this.slicePathAttr !== null) { navItem.slicePathAttr = this.slicePathAttr; }
        if (this.sliceHoverAttr !== null) { navItem.sliceHoverAttr = this.sliceHoverAttr; }
        if (this.sliceSelectedAttr !== null) { navItem.sliceSelectedAttr = this.sliceSelectedAttr; }

        //Refresh title
        if (this.titleAttr !== null) { navItem.titleAttr = this.titleAttr; }
        if (this.titleHoverAttr !== null) { navItem.titleHoverAttr = this.titleHoverAttr; }
        if (this.titleSelectedAttr !== null) { navItem.titleSelectedAttr = this.titleSelectedAttr; }

        //Refresh line
        if (this.linePathAttr !== null) { navItem.linePathAttr = this.linePathAttr; }
        if (this.lineHoverAttr !== null) { navItem.lineHoverAttr = this.lineHoverAttr; }
        if (this.lineSelectedAttr !== null) { navItem.lineSelectedAttr = this.lineSelectedAttr; }

        //Animation
        if (this.animateeffect !== null) { navItem.animateeffect = this.animateeffect; }
        if (this.animatetime !== null) { navItem.animatetime = this.animatetime; }

        if (navItem.selected) {
            navItem.navSlice.attr(navItem.sliceSelectedAttr);
            navItem.navTitle.attr(navItem.titleSelectedAttr);
            navItem.navLine.attr(navItem.lineSelectedAttr);

            if (selectedToFront !== undefined) {
                if (selectedToFront) {
                    navItem.navSlice.toFront();
                    navItem.navTitle.toFront();
                }
                else {
                    navItem.navTitle.toBack();
                    navItem.navSlice.toBack();
                }
            }

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
};

wheelnav.prototype.navigateWheel = function (clicked, selectedToFront) {

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
        navItem.setCurrentTransform(this.animateRepeatCount, true);
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
        this.spreadWheel();
    }

    this.refreshWheel(selectedToFront);
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
        navItem.setCurrentTransform(this.animateRepeatCount, true);
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


///#source 1 1 /js/source/wheelnav.navItem.js
/* ======================================================================================= */
/* Navigation item                                                                         */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/navItem.html       */
/* ======================================================================================= */

wheelnavItem = function (wheelnav, title, itemIndex) {

    this.wheelnav = wheelnav;
    this.wheelItemIndex = itemIndex;
    if (wheelnav.clockwise) {
        this.itemIndex = itemIndex;
    }
    else {
        this.itemIndex = -itemIndex;
    }

    this.enabled = wheelnav.navItemsEnabled;
    this.selected = false;
    this.hovered = false;

    this.navItem = null;
    this.navSlice = null;
    this.navTitle = null;
    this.navLine = null;
    this.navClickableSlice = null;

    this.navSliceCurrentTransformString = null;
    this.navTitleCurrentTransformString = null;
    this.navLineCurrentTransformString = null;

    this.navSliceUnderAnimation = false;
    this.navTitleUnderAnimation = false;
    this.navLineUnderAnimation = false;

    this.title = title;
    this.selectedTitle = title;
    this.tooltip = null;
    this.titleFont = wheelnav.titleFont;
    if (wheelnav.titleSpreadScale === null) { this.titleSpreadScale = false; }
    else { this.titleSpreadScale = wheelnav.titleSpreadScale; }
    this.currentRotateAngle = 0;
    this.minPercent = wheelnav.minPercent;
    this.maxPercent = wheelnav.maxPercent;
    this.hoverPercent = wheelnav.hoverPercent;
    this.selectedPercent = wheelnav.selectedPercent;
    this.clickablePercentMin = wheelnav.clickablePercentMin;
    this.clickablePercentMax = wheelnav.clickablePercentMax;

    this.slicePathCustom = wheelnav.slicePathCustom;
    this.sliceSelectedPathCustom = wheelnav.sliceSelectedPathCustom;
    this.sliceHoverPathCustom = wheelnav.sliceHoverPathCustom;

    this.sliceTransformCustom = wheelnav.sliceTransformCustom; 
    this.sliceSelectedTransformCustom = wheelnav.sliceSelectedTransformCustom;
    this.sliceHoverTransformCustom = wheelnav.sliceHoverTransformCustom;

    if (wheelnav.sliceAngle === null) { this.sliceAngle = 360 / wheelnav.navItemCount; }
    else { this.sliceAngle = wheelnav.sliceAngle;}

    if (title !== null) {
        this.sliceClickablePathFunction = wheelnav.sliceClickablePathFunction;
        this.slicePathFunction = wheelnav.slicePathFunction;
        this.sliceSelectedPathFunction = wheelnav.sliceSelectedPathFunction;
        this.sliceHoverPathFunction = wheelnav.sliceHoverPathFunction;

        this.sliceTransformFunction = wheelnav.sliceTransformFunction;
        this.sliceSelectedTransformFunction = wheelnav.sliceSelectedTransformFunction;
        this.sliceHoverTransformFunction = wheelnav.sliceHoverTransformFunction;
    }
    else {
        this.title = "";
        this.sliceClickablePathFunction = slicePath().NullSlice;
        this.slicePathFunction = slicePath().NullSlice;
        this.sliceSelectedPathFunction = null;
        this.sliceHoverPathFunction = null;
        this.sliceTransformFunction = null;
        this.sliceSelectedTransformFunction = null;
        this.sliceHoverTransformFunction = null;
    }

    this.fillAttr = "#CCC";

    this.animateeffect = "bounce";
    this.animatetime = 1500;

    this.slicePathAttr = { fill: "#CCC", stroke: "#111", "stroke-width": 3, cursor: 'pointer' };
    this.sliceHoverAttr = { fill: "#CCC", stroke: "#111", "stroke-width": 4, cursor: 'pointer' };
    this.sliceSelectedAttr = { fill: "#CCC", stroke: "#111", "stroke-width": 4, cursor: 'default' };

    this.sliceClickablePathAttr = { fill: "#FFF", stroke: "#FFF", "stroke-width": 0, cursor: 'pointer', "fill-opacity": 0.01 };
    this.sliceClickableHoverAttr = { stroke: "#FFF", "stroke-width": 0, cursor: 'pointer' };
    this.sliceClickableSelectedAttr = { stroke: "#FFF", "stroke-width": 0, cursor: 'default' };

    this.titleAttr = { font: this.titleFont, fill: "#111", stroke: "none", cursor: 'pointer' };
    this.titleHoverAttr = { font: this.titleFont, fill: "#111", cursor: 'pointer', stroke: "none" };
    this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF", cursor: 'default' };

    this.linePathAttr = { stroke: "#111", "stroke-width": 2, cursor: 'pointer' };
    this.lineHoverAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' };
    this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'default' };

    return this;
};

wheelnavItem.prototype.createNavItem = function () {

    //Set colors
    this.slicePathAttr.fill = this.fillAttr;
    this.sliceHoverAttr.fill = this.fillAttr;
    this.sliceSelectedAttr.fill = this.fillAttr;

    //Set attrs
    if (!this.enabled) {
        this.slicePathAttr.cursor = "default";
        this.sliceHoverAttr.cursor = "default";
        this.titleAttr.cursor = "default";
        this.titleHoverAttr.cursor = "default";
        this.linePathAttr.cursor = "default";
        this.lineHoverAttr.cursor = "default";
    }

    //Set angles
    var prevItemIndex = this.wheelItemIndex - 1;
    var wheelSliceAngle = 360 / this.wheelnav.navItemCount;

    if (this.wheelnav.clockwise) {
        if (this.wheelnav.navItemsContinuous) {
            if (this.itemIndex === 0) {
                this.baseAngle = (this.itemIndex * this.sliceAngle) + ((-this.sliceAngle / 2) + this.wheelnav.navAngle);
            }
            else {
                this.baseAngle = this.wheelnav.navItems[prevItemIndex].baseAngle + this.wheelnav.navItems[prevItemIndex].sliceAngle;
            }
        }
        else {
            if (this.wheelnav.navItemsCentered) {
                this.baseAngle = (this.itemIndex * wheelSliceAngle) + ((-this.sliceAngle / 2) + this.wheelnav.navAngle);
            }
            else {
                this.baseAngle = (this.itemIndex * wheelSliceAngle) + ((-wheelSliceAngle / 2) + this.wheelnav.navAngle);
                this.currentRotateAngle += ((wheelSliceAngle / 2) - (this.wheelnav.navItems[0].sliceAngle / 2));
            }
        }
    }
    else {
        if (this.wheelnav.navItemsContinuous) {
            if (this.itemIndex === 0) {
                this.baseAngle = (this.itemIndex * this.sliceAngle) + ((-this.sliceAngle / 2) + this.wheelnav.navAngle);
            }
            else {
                this.baseAngle = this.wheelnav.navItems[prevItemIndex].baseAngle - this.wheelnav.navItems[this.wheelItemIndex].sliceAngle;
            }
        }
        else {
            if (this.wheelnav.navItemsCentered) {
                this.baseAngle = (this.itemIndex * wheelSliceAngle) + ((-this.sliceAngle / 2) + this.wheelnav.navAngle);
            }
            else {
                this.baseAngle = (this.itemIndex * wheelSliceAngle) + ((-wheelSliceAngle / 2) + this.wheelnav.navAngle) + (wheelSliceAngle - this.sliceAngle);
                this.currentRotateAngle -= ((wheelSliceAngle / 2) - (this.wheelnav.navItems[0].sliceAngle / 2));
            }
        }
    }

    this.navAngle = this.baseAngle + (this.sliceAngle / 2);

    if (this.wheelnav.animatetimeCalculated) {
        this.animatetime = this.wheelnav.animatetime / this.wheelnav.navItemCount;
    }

    //Set min/max sliecePaths
    //Default - min
    if (this.slicePathMin === undefined) {
        this.slicePathMin = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.minPercent, this.slicePathCustom);
    }
    //Default - max
    if (this.slicePathMax === undefined) {
        this.slicePathMax = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.maxPercent, this.slicePathCustom);
    }
    //Selected - min
    if (this.selectedSlicePathMin === undefined) {
        if (this.sliceSelectedPathFunction !== null) {
            this.selectedSlicePathMin = this.sliceSelectedPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.selectedPercent * this.minPercent, this.sliceSelectedPathCustom);
        }
        else {
            this.selectedSlicePathMin = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.selectedPercent * this.minPercent, this.sliceSelectedPathCustom);
        }
    }
    //Selected - max
    if (this.selectedSlicePathMax === undefined) {
        if (this.sliceSelectedPathFunction !== null) {
            this.selectedSlicePathMax = this.sliceSelectedPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.selectedPercent * this.maxPercent, this.sliceSelectedPathCustom);
        }
        else {
            this.selectedSlicePathMax = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.selectedPercent * this.maxPercent, this.sliceSelectedPathCustom);
        }
    }
    //Hovered - min
    if (this.hoverSlicePathMin === undefined) {
        if (this.sliceHoverPathFunction !== null) {
            this.hoverSlicePathMin = this.sliceHoverPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.hoverPercent * this.minPercent, this.sliceHoverPathCustom);
        }
        else {
            this.hoverSlicePathMin = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.hoverPercent * this.minPercent, this.sliceHoverPathCustom);
        }
    }
    //Hovered - max
    if (this.hoverSlicePathMax === undefined) {
        if (this.sliceHoverPathFunction !== null) {
            this.hoverSlicePathMax = this.sliceHoverPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.hoverPercent * this.maxPercent, this.sliceHoverPathCustom);
        }
        else {
            this.hoverSlicePathMax = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.hoverPercent * this.maxPercent, this.sliceHoverPathCustom);
        }
    }

    //Set sliceTransforms
    //Default
    if (this.sliceTransform === undefined) {
        if (this.sliceTransformFunction !== null) {
            this.sliceTransform = this.sliceTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.wheelnav.titleRotateAngle, this.itemIndex, this.sliceTransformCustom);
        }
        else {
            this.sliceTransform = sliceTransform().NullTransform;
        }
    }
    //Selected
    if (this.selectTransform === undefined) {
        if (this.sliceSelectedTransformFunction !== null) {
            this.selectTransform = this.sliceSelectedTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.wheelnav.titleRotateAngle, this.itemIndex, this.sliceSelectedTransformCustom);
        }
        else {
            this.selectTransform = sliceTransform().NullTransform;
        }
    }
    //Hovered
    if (this.hoverTransform === undefined) {
        if (this.sliceHoverTransformFunction !== null) {
            this.hoverTransform = this.sliceHoverTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.wheelnav.titleRotateAngle, this.itemIndex, this.sliceHoverTransformCustom);
        }
        else {
            this.hoverTransform = sliceTransform().NullTransform;
        }
    }

    var slicePath = this.getCurrentPath();

    //Create slice
    this.navSlice = this.wheelnav.raphael.path(slicePath.slicePathString);
    this.navSlice.attr(this.slicePathAttr);
    this.navSlice.id = this.wheelnav.getSliceId(this.wheelItemIndex);
    this.navSlice.node.id = this.navSlice.id;

    //Create title
    //Title defined by path
    if (this.isPathTitle()) {
        this.titlePath = new wheelnavTitle(this.title, this.wheelnav.raphael.raphael);
        var relativePath = this.getTitlePercentAttr(slicePath.titlePosX, slicePath.titlePosY, this.titlePath).path;
        this.navTitle = this.wheelnav.raphael.path(relativePath).attr(this.titleAttr);
    }
    //Title defined by text
    else {
        this.titlePath = new wheelnavTitle(this.title);
        this.navTitle = this.wheelnav.raphael.text(slicePath.titlePosX, slicePath.titlePosY, this.title).attr(this.titleAttr);
    }

    this.navTitle.id = this.wheelnav.getTitleId(this.wheelItemIndex);
    this.navTitle.node.id = this.navTitle.id;

    var titleRotateString = this.getTitleRotateString();
    this.navTitle.attr({ transform: titleRotateString });

    //Create linepath
    this.navLine = this.wheelnav.raphael.path(slicePath.linePathString).attr(this.linePathAttr).toBack();
    this.navLine.id = this.wheelnav.getLineId(this.wheelItemIndex);

    //Create item set
    this.navItem = this.wheelnav.raphael.set();

    if (this.clickablePercentMax > 0) {
        //Set min/max sliececlickablePaths
        //Default - min
        if (this.clickableSlicePathMin === undefined) {
            this.clickableSlicePathMin = this.sliceClickablePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.clickablePercentMin, this.slicePathCustom);
        }
        //Default - max
        if (this.clickableSlicePathMax === undefined) {
            this.clickableSlicePathMax = this.sliceClickablePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.clickablePercentMax, this.slicePathCustom);
        }

        //Create clickable slice
        var sliceClickablePath = this.getCurrentClickablePath();
        this.navClickableSlice = this.wheelnav.raphael.path(sliceClickablePath.slicePathString).attr(this.sliceClickablePathAttr).toBack();

        this.navItem.push(
            this.navClickableSlice,
            this.navSlice,
            this.navTitle,
            this.navLine
        );
    }
    else {
        this.navItem.push(
            this.navSlice,
            this.navTitle,
            this.navLine
        );
    }

    
    

    if (this.tooltip !== null) {
        this.navItem.attr({ title: this.tooltip });
    }
    this.navItem.id = this.wheelnav.getItemId(this.wheelItemIndex);

    var thisWheelNav = this.wheelnav;
    var thisNavItem = this;
    var thisItemIndex = this.wheelItemIndex;

    if (this.enabled) {
        this.navItem.mouseup(function () {
            thisWheelNav.navigateWheel(thisItemIndex);
        });
        this.navItem.mouseover(function () {
            thisNavItem.hoverEffect(thisItemIndex, true);
        });
        this.navItem.mouseout(function () {
            thisNavItem.hoverEffect(thisItemIndex, false);
        });
    }
};

wheelnavItem.prototype.hoverEffect = function (hovered, isEnter) {

    if (this.wheelnav.clickModeRotate === false ||
        this.wheelnav.animateLocked === false) {
        if (isEnter && hovered !== this.wheelnav.currentClick) {
            this.navSlice.attr(this.sliceHoverAttr);
            this.navTitle.attr(this.titleHoverAttr);
            this.navLine.attr(this.lineHoverAttr);
            if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickableHoverAttr); }
            this.hovered = true;
        }
        else {
            this.hovered = false;

            if (this.selected) {
                this.navSlice.attr(this.sliceSelectedAttr);
                this.navTitle.attr(this.titleSelectedAttr);
                this.navLine.attr(this.lineSelectedAttr);
                if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickableSelectedAttr); }
            }
            else {
                this.navSlice.attr(this.slicePathAttr);
                this.navTitle.attr(this.titleAttr);
                this.navLine.attr(this.linePathAttr);
                if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickablePathAttr); }
            }
        }

        if (this.hoverPercent !== 1 ||
            this.sliceHoverPathFunction !== null ||
            this.sliceHoverTransformFunction !== null) {
            this.setCurrentTransform(this.wheelnav.animateRepeatCount);
        }
    }
};

wheelnavItem.prototype.setCurrentTransform = function (animateRepeatCount, locked) {

    if (!this.wheelnav.clickModeRotate ||
        (!this.navSliceUnderAnimation &&
        !this.navTitleUnderAnimation &&
        !this.navLineUnderAnimation)) {

        if (locked !== undefined &&
            locked === true) {
            this.navSliceUnderAnimation = true;
            this.navTitleUnderAnimation = true;
            this.navLineUnderAnimation = true;
        }

        //Set transforms
        this.navSliceCurrentTransformString = "";
        if (this.wheelnav.clickModeRotate) { this.navSliceCurrentTransformString += this.getItemRotateString(); }
        if (this.selected) {
            this.navSliceCurrentTransformString += this.selectTransform.sliceTransformString;
        }
        else if (this.hovered) {
            this.navSliceCurrentTransformString += this.hoverTransform.sliceTransformString;
        }
        this.navSliceCurrentTransformString += this.sliceTransform.sliceTransformString;

        this.navLineCurrentTransformString = "";
        if (this.wheelnav.clickModeRotate) { this.navLineCurrentTransformString += this.getItemRotateString(); }
        if (this.selected) {
            this.navLineCurrentTransformString += this.selectTransform.lineTransformString;
        }
        else if (this.hovered) {
            this.navLineCurrentTransformString += this.hoverTransform.lineTransformString;
        }
        this.navLineCurrentTransformString += this.sliceTransform.lineTransformString;

        this.navTitleCurrentTransformString = "";
        if (this.wheelnav.clickModeRotate) { this.navTitleCurrentTransformString += this.getTitleRotateString(); }

        if (this.selected) {
            if (this.selectTransform.titleTransformString === "" ||
                this.selectTransform.titleTransformString === undefined) {
                this.navTitleCurrentTransformString += ",s1";
            }
            else {
                this.navTitleCurrentTransformString += "," + this.selectTransform.titleTransformString;
            }
            if (this.wheelnav.currentPercent < 0.05) {
                this.navTitleCurrentTransformString += ",s0.05";
            }
        }
        else if (this.hovered) {
            if (this.hoverTransform.titleTransformString === "" ||
                this.hoverTransform.titleTransformString === undefined) {
                this.navTitleCurrentTransformString += ",s1";
            }
            else {
                this.navTitleCurrentTransformString += "," + this.hoverTransform.titleTransformString;
            }
        }
        else if (this.wheelnav.currentPercent < 0.05) {
            this.navTitleCurrentTransformString += ",s0.05";
        }
        else if (this.titleSpreadScale) {
            this.navTitleCurrentTransformString += ",s" + this.wheelnav.currentPercent;
        }
        else {
            if (this.sliceTransform.titleTransformString === "" ||
                this.sliceTransform.titleTransformString === undefined) {
                this.navTitleCurrentTransformString += ",s1";
            }
            else {
                this.navTitleCurrentTransformString += "," + this.sliceTransform.titleTransformString;
            }
        }

        //Set path
        var slicePath = this.getCurrentPath();

        var sliceTransformAttr = {};

        sliceTransformAttr = {
            path: slicePath.slicePathString,
            transform: this.navSliceCurrentTransformString
        };

        var sliceClickableTransformAttr = {};

        if (this.clickablePercentMax > 0) {
            var sliceClickablePath = this.getCurrentClickablePath();

            sliceClickableTransformAttr = {
                path: sliceClickablePath.slicePathString,
                transform: this.navSliceCurrentTransformString
            };
        }

        var lineTransformAttr = {};

        lineTransformAttr = {
            path: slicePath.linePathString,
            transform: this.navLineCurrentTransformString
        };

        //Set title
        var currentTitle = this.title;
        if (this.selected) { currentTitle = this.selectedTitle; }

        if (this.navTitle.type === "path") {
            titleCurrentPath = new wheelnavTitle(currentTitle, this.wheelnav.raphael.raphael);
        }
        else {
            titleCurrentPath = new wheelnavTitle(currentTitle);
        }

        var percentAttr = this.getTitlePercentAttr(slicePath.titlePosX, slicePath.titlePosY, titleCurrentPath);

        var titleTransformAttr = {};

        if (this.navTitle.type === "path") {
            titleTransformAttr = {
                path: percentAttr.path,
                transform: this.navTitleCurrentTransformString
            };
        }
        else {
            titleTransformAttr = {
                x: percentAttr.x,
                y: percentAttr.y,
                transform: this.navTitleCurrentTransformString
            };

            this.navTitle.attr({ text: currentTitle });
        }

        var thisNavItem = this;
        var thisWheelnav = this.wheelnav;

        //Animate navitem
        this.animSlice = Raphael.animation(sliceTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navSliceUnderAnimation = false;
            thisWheelnav.animateUnlock();
        });
        this.animLine = Raphael.animation(lineTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navLineUnderAnimation = false;
            thisWheelnav.animateUnlock();
        });
        this.animTitle = Raphael.animation(titleTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navTitleUnderAnimation = false;
            thisWheelnav.animateUnlock();
        });

        if (this.clickablePercentMax > 0) {
            this.animClickableSlice = Raphael.animation(sliceClickableTransformAttr, this.animatetime, this.animateeffect);
        }

        if (locked !== undefined &&
            locked === true) {
            if (this.wheelItemIndex === this.wheelnav.navItemCount - 1) {

                for (i = 0; i < this.wheelnav.navItemCount; i++) {
                    var navItemSlice = this.wheelnav.navItems[i];
                    navItemSlice.navSlice.animate(navItemSlice.animSlice.repeat(animateRepeatCount));
                }
                for (i = 0; i < this.wheelnav.navItemCount; i++) {
                    var navItemLine = this.wheelnav.navItems[i];
                    navItemLine.navLine.animate(navItemLine.animLine.repeat(animateRepeatCount));
                }
                for (i = 0; i < this.wheelnav.navItemCount; i++) {
                    var navItemTitle = this.wheelnav.navItems[i];
                    navItemTitle.navTitle.animate(navItemTitle.animTitle.repeat(animateRepeatCount));
                }

                if (this.clickablePercentMax > 0) {
                    for (i = 0; i < this.wheelnav.navItemCount; i++) {
                        var navItemClickableSlice = this.wheelnav.navItems[i];
                        navItemClickableSlice.navClickableSlice.animate(navItemClickableSlice.animClickableSlice.repeat(animateRepeatCount));
                    }
                }
            }
        }
        else {
            this.navSlice.animate(this.animSlice.repeat(animateRepeatCount));
            this.navLine.animate(this.animLine.repeat(animateRepeatCount));
            this.navTitle.animate(this.animTitle.repeat(animateRepeatCount));

            if (this.clickablePercentMax > 0) {
                this.navClickableSlice.animate(this.animClickableSlice.repeat(animateRepeatCount));
            }
        }
    }
};

wheelnavItem.prototype.getTitlePercentAttr = function (currentX, currentY, thisPath) {

    var transformAttr = {};

    if (thisPath.relativePath !== undefined) {
        var pathCx = currentX + (thisPath.startX - thisPath.BBox.cx);
        var pathCy = currentY + (thisPath.startY - thisPath.BBox.cy);

        thisPath.relativePath[0][1] = pathCx;
        thisPath.relativePath[0][2] = pathCy;

        transformAttr = {
            path: thisPath.relativePath
        };
    }
    else {
        transformAttr = {
            x: currentX,
            y: currentY
        };
    }

    return transformAttr;
};

wheelnavItem.prototype.getCurrentPath = function () {
    var slicePath;

    if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
        if (this.selected) {
            slicePath = this.selectedSlicePathMax;
        }
        else {
            if (this.hovered) {
                slicePath = this.hoverSlicePathMax;
            }
            else {
                slicePath = this.slicePathMax;
            }
        }
    }
    else {
        if (this.selected) {
            slicePath = this.selectedSlicePathMin;
        }
        else {
            if (this.hovered) {
                slicePath = this.hoverSlicePathMin;
            }
            else {
                slicePath = this.slicePathMin;
            }
        }
    }

    return slicePath;
};

wheelnavItem.prototype.getCurrentClickablePath = function () {
    var sliceClickablePath;

    if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
        sliceClickablePath = this.clickableSlicePathMax;
    }
    else {
        sliceClickablePath = this.clickableSlicePathMin;
    }

    return sliceClickablePath;
};

wheelnavItem.prototype.isPathTitle = function () {
    if (this.title.substr(0, 1) === "M" &&
         this.title.substr(this.title.length - 1, 1) === "z") {
        return true;
    }
    else {
        return false;
    }
};

wheelnavItem.prototype.getItemRotateString = function () {
    return "r," + (this.currentRotateAngle).toString() + "," + this.wheelnav.centerX + "," + this.wheelnav.centerY;
};

wheelnavItem.prototype.getTitleRotateString = function () {

    var titleRotate = "";

    if (this.wheelnav.titleRotateAngle !== null) {
        titleRotate += this.getItemRotateString();
        titleRotate += ",r," + this.itemIndex * (360 / this.wheelnav.navItemCount);
        titleRotate += ",r," + this.wheelnav.titleRotateAngle;
        titleRotate += ",r," + this.wheelnav.navAngle;
    }
    else {
        titleRotate += this.getItemRotateString();
        titleRotate += ",r," + (-this.currentRotateAngle).toString();
    }

    return titleRotate;
};

wheelnavTitle = function (title, raphael) {
    this.title = title;
    //Calculate relative path
    if (raphael !== undefined) {
        this.relativePath = raphael.pathToRelative(title);
        this.BBox = raphael.pathBBox(this.relativePath);
        this.startX = this.relativePath[0][1];
        this.startY = this.relativePath[0][2];
    }

    return this;
};

///#source 1 1 /js/source/wheelnav.slicePathHelper.js
/* ======================================================================================= */
/* Slice path helper functions                                                                  */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var slicePathHelper = function () {

    this.sliceRadius = 0;
    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleRadius = 0;
    this.titleTheta = 0;
    this.custom = null;

    this.setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = new slicePathCustomization();
        }
        else {
            this.custom = custom;
        }

        this.sliceRadius = rOriginal * percent;
        this.startAngle = baseAngle;
        this.startTheta = this.getTheta(this.startAngle);
        this.middleTheta = this.getTheta(this.startAngle + sliceAngle / 2);
        this.endTheta = this.getTheta(this.startAngle + sliceAngle);
        if (custom !== null) {
            if (custom.titleRadiusPercent !== null) {
                this.titleRadius = this.sliceRadius * custom.titleRadiusPercent;
            }
            if (custom.titleSliceAnglePercent !== null) {
                this.titleTheta = this.getTheta(this.startAngle + sliceAngle * custom.titleSliceAnglePercent);
            }
        }
        else {
            this.titleRadius = this.sliceRadius * 0.5;
            this.titleTheta = this.middleTheta;
        }

        this.setTitlePos(x, y);
    };

    this.setTitlePos = function (x, y) {
        this.titlePosX = this.titleRadius * Math.cos(this.titleTheta) + x;
        this.titlePosY = this.titleRadius * Math.sin(this.titleTheta) + y;
    };

    this.getTheta = function (angle) {
        return (angle % 360) * Math.PI / 180;
    };

    return this;
};

/* Custom properties
    - titleRadiusPercent
    - titleSliceAnglePercent
*/
var slicePathCustomization = function () {

    this.titleRadiusPercent = 0.5;
    this.titleSliceAnglePercent = 0.5;

    return this;
};





///#source 1 1 /js/source/wheelnav.slicePath.js
/* ======================================================================================= */
/* Slice path definitions.                                                                 */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var slicePath = function () {

    this.helper = new slicePathHelper();

    this.NullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.PieSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.titleRadiusPercent = 0.6;
        custom.arcBaseRadiusPercent = 1;
        custom.arcRadiusPercent = 1;
        return custom;
    };

    this.PieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;
        helper.titleRadius = r * custom.titleRadiusPercent;

        helper.setTitlePos(x, y);

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        var arcBaseRadius = r * custom.arcBaseRadiusPercent;
        var arcRadius = r * custom.arcRadiusPercent;

        slicePathString = [["M", x, y],
                     ["L", arcBaseRadius * Math.cos(startTheta) + x, arcBaseRadius * Math.sin(startTheta) + y],
                     ["A", arcRadius, arcRadius, 0, 0, 1, arcBaseRadius * Math.cos(endTheta) + x, arcBaseRadius * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.DonutSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.minRadiusPercent = 0.37;
        custom.maxRadiusPercent = 0.95;

        return custom;
    };

    this.DonutSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = DonutSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;

        r = helper.sliceRadius * custom.maxRadiusPercent;
        rbase = helper.sliceRadius * custom.minRadiusPercent;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 0, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        helper.titleRadius = (r + rbase) / 2;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.StarSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.titleRadiusPercent = 0.44;
        custom.isBasePieSlice = false;

        return custom;
    };

    this.StarSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = StarSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        rbase = r * 0.5;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        if (custom.isBasePieSlice) {
            r = r * 0.9;
            slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];
        }
        else {
            slicePathString = [["M", x, y],
                         ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                         ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                         ["z"]];
        }

        helper.titleRadius = r * custom.titleRadiusPercent;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.StarBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = StarSliceCustomization();
        }

        custom.titleRadiusPercent = 0.6;
        custom.isBasePieSlice = true;

        var slicePath = StarSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    this.CogSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.titleRadiusPercent = 0.55;
        custom.isBasePieSlice = false;

        return custom;
    };

    this.CogSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = CogSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = helper.sliceRadius * 0.98;
        rbase = helper.sliceRadius * 0.9;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.0625);
        theta12 = helper.getTheta(helper.startAngle + sliceAngle * 0.125);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.1875);
        theta22 = helper.getTheta(helper.startAngle + sliceAngle * 0.25);
        theta3 = helper.getTheta(helper.startAngle + sliceAngle * 0.3125);
        theta32 = helper.getTheta(helper.startAngle + sliceAngle * 0.375);
        theta4 = helper.getTheta(helper.startAngle + sliceAngle * 0.4375);
        theta42 = helper.getTheta(helper.startAngle + sliceAngle * 0.5);
        theta5 = helper.getTheta(helper.startAngle + sliceAngle * 0.5625);
        theta52 = helper.getTheta(helper.startAngle + sliceAngle * 0.625);
        theta6 = helper.getTheta(helper.startAngle + sliceAngle * 0.6875);
        theta62 = helper.getTheta(helper.startAngle + sliceAngle * 0.75);
        theta7 = helper.getTheta(helper.startAngle + sliceAngle * 0.8125);
        theta72 = helper.getTheta(helper.startAngle + sliceAngle * 0.875);
        theta8 = helper.getTheta(helper.startAngle + sliceAngle * 0.9375);
        theta82 = helper.getTheta(helper.startAngle + sliceAngle * 0.96875);

        if (custom.isBasePieSlice) {
            r = rbase;
            slicePathString = [["M", x, y],
                ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta12) + x, r * Math.sin(theta12) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta22) + x, r * Math.sin(theta22) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta3) + x, r * Math.sin(theta3) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta32) + x, r * Math.sin(theta32) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta4) + x, r * Math.sin(theta4) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta42) + x, r * Math.sin(theta42) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta5) + x, r * Math.sin(theta5) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta52) + x, r * Math.sin(theta52) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta6) + x, r * Math.sin(theta6) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta62) + x, r * Math.sin(theta62) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta7) + x, r * Math.sin(theta7) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta72) + x, r * Math.sin(theta72) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta8) + x, r * Math.sin(theta8) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta82) + x, r * Math.sin(theta82) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                ["z"]];
        }
        else {
            slicePathString = [["M", x, y],
                ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                ["L", rbase * Math.cos(theta1) + x, rbase * Math.sin(theta1) + y],
                ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta2) + x, rbase * Math.sin(theta2) + y],
                ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta3) + x, r * Math.sin(theta3) + y],
                ["L", rbase * Math.cos(theta3) + x, rbase * Math.sin(theta3) + y],
                ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta4) + x, rbase * Math.sin(theta4) + y],
                ["L", r * Math.cos(theta4) + x, r * Math.sin(theta4) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta5) + x, r * Math.sin(theta5) + y],
                ["L", rbase * Math.cos(theta5) + x, rbase * Math.sin(theta5) + y],
                ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta6) + x, rbase * Math.sin(theta6) + y],
                ["L", r * Math.cos(theta6) + x, r * Math.sin(theta6) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(theta7) + x, r * Math.sin(theta7) + y],
                ["L", rbase * Math.cos(theta7) + x, rbase * Math.sin(theta7) + y],
                ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta8) + x, rbase * Math.sin(theta8) + y],
                ["L", r * Math.cos(theta8) + x, r * Math.sin(theta8) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                ["z"]];
        }

        helper.titleRadius = r * 0.55;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.CogBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = CogSliceCustomization();
        }

        custom.isBasePieSlice = true;

        var slicePath = CogSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };


    this.MenuSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.menuRadius = 25;
        custom.titleRadiusPercent = 0.63;
        custom.isSelectedLine = false;

        return custom;
    };

    this.MenuSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = MenuSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        var r = helper.sliceRadius;
        helper.titleRadius = r * custom.titleRadiusPercent;
        helper.setTitlePos(x, y);

        var menuRadius = percent * custom.menuRadius;

        if (menuRadius < 15) { menuRadius = 15; }
        if (percent <= 0.05) { menuRadius = 10; }

        middleTheta = helper.middleTheta;

        slicePathString = [["M", helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                    ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX + (menuRadius * Math.cos(middleTheta)), helper.titlePosY + (menuRadius * Math.sin(middleTheta))],
                    ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                    ["z"]];

        if (percent <= 0.05) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
        }
        else {
            lineEndX = (helper.titleRadius - menuRadius) * Math.cos(middleTheta) + x;
            lineEndY = (helper.titleRadius - menuRadius) * Math.sin(middleTheta) + y;

            if (!custom.isSelectedLine) {
                linePathString = [["M", x, y],
                            ["A", r / 2, r / 2, 0, 0, 1, lineEndX, lineEndY]];
            }
            else {
                linePathString = [["M", x, y],
                            ["A", r / 3, r / 3, 0, 0, 1, lineEndX, lineEndY]];
            }
        }

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.MenuSliceSelectedLine = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = MenuSliceCustomization();
        }

        custom.isSelectedLine = true;

        var slicePath = MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: slicePath.linePathString,
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    this.MenuSliceWithoutLine = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        var slicePath = MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    this.MenuSquareSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.menuRadius = 30;
        custom.titleRadiusPercent = 0.63;

        return custom;
    };

    this.MenuSquareSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = MenuSquareSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        helper.titleRadius = r * custom.titleRadiusPercent;
        helper.setTitlePos(x, y);

        var menuRadius = percent * custom.menuRadius;

        if (menuRadius < 15) { menuRadius = 15; }

        if (percent <= 0.05) { menuRadius = 10; }

        slicePathString = [["M", helper.titlePosX + menuRadius, helper.titlePosY + menuRadius],
                    ["L", helper.titlePosX - menuRadius, helper.titlePosY + menuRadius],
                    ["L", helper.titlePosX - menuRadius, helper.titlePosY - menuRadius],
                    ["L", helper.titlePosX + menuRadius, helper.titlePosY - menuRadius],
                    ["z"]];

        if (percent <= 0.05) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
        }
        else {
            lineEndX = helper.titleRadius - menuRadius;
            lineEndY = helper.titleRadius - menuRadius;

            linePathString = [["M", x, y],
                        ["L", helper.titlePosX, helper.titlePosY]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.FlowerSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieSliceCustomization();
        }

        custom.titleRadiusPercent = 0.5;
        custom.arcBaseRadiusPercent = 0.65;
        custom.arcRadiusPercent = 0.14;

        var slicePath = PieSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    this.EyeSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.7;

        helper.titleRadius = r * 0.87;
        helper.setTitlePos(x, y);

        if (percent === 0) {
            r = 0.01;
        }

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.WheelSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.85;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        var innerRadiusPercent;

        if (sliceAngle < 120) {
            helper.titleRadius = r * 0.62;
            innerRadiusPercent = 0.97;
        }
        else if (sliceAngle < 180) {
            helper.titleRadius = r * 0.56;
            innerRadiusPercent = 0.95;
        }
        else {
            helper.titleRadius = r * 0.5;
            innerRadiusPercent = 0.905;
        }

        slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
             ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
             ["A", (r * innerRadiusPercent), (r * innerRadiusPercent), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
             ["z"],
             ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
             ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
             ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];

        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.LineSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        if (sliceAngle > 60 &&
            sliceAngle < 180) {
            helper.titleRadius = r * ((180 / sliceAngle) / 5);
            helper.setTitlePos(x, y);
        }
        else {
            helper.titleRadius = r * 0.55;
            helper.setTitlePos(x, y);
        }

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        if (sliceAngle < 180) {
            slicePathString = [["M", x, y],
                         ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                         ["L", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                         ["z"]];
        }
        else {
            slicePathString = [["M", x, y],
                         ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(startTheta) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(endTheta) + y],
                         ["L", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                         ["z"]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.TabSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        rOriginal = rOriginal * 0.9;
        var navItemCount = 360 / sliceAngle;
        var itemSize = 2 * rOriginal / navItemCount;

        titlePosX = x;
        titlePosY = itemIndex * itemSize + y + (itemSize / 2) - rOriginal;

        slicePathString = [["M", x - (itemSize / 2), itemIndex * itemSize + y - rOriginal],
                     ["L", (itemSize / 2) + x, itemIndex * itemSize + y - rOriginal],
                     ["L", (itemSize / 2) + x, (itemIndex + 1) * itemSize + y - rOriginal],
                     ["L", x - (itemSize / 2), (itemIndex + 1) * itemSize + y - rOriginal],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        };
    };

    this.YinYangSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["A", r / 2, r / 2, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["A", r / 2, r / 2, 0, 0, 0, x, y],
                     ["z"]];

        titlePosX = r / 2 * Math.cos(startTheta) + x;
        titlePosY = r / 2 * Math.sin(startTheta) + y;

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        };
    };

    this.PieArrowSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.arrowRadiusPercent = 1.1;

        return custom;
    };

    this.PieArrowSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieArrowSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.45);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.55);

        var arrowRadius = r * custom.arrowRadiusPercent;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                     ["L", arrowRadius * Math.cos(middleTheta) + x, arrowRadius * Math.sin(middleTheta) + y],
                     ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.PieArrowBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieArrowSliceCustomization();
        }

        custom.arrowRadiusPercent = 1;
        var slicePath = PieArrowSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        };
    };

    return this;
};



///#source 1 1 /js/source/wheelnav.sliceTransform.js
/* ======================================================================================== */
/* Slice transform definitions                                                              */
/* ======================================================================================== */
/* ======================================================================================== */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/sliceTransform.html */
/* ======================================================================================== */


var sliceTransform = function () {

    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {
        this.startAngle = baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
    };

    var getTheta = function (angle) {
        return (angle % 360) * Math.PI / 180;
    };

    this.NullTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {
        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: ""
        };
    };

    this.MoveMiddleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex);
        var sliceTransformString = "t" + (rOriginal / 10 * Math.cos(middleTheta)).toString() + "," + (rOriginal / 10 * Math.sin(middleTheta)).toString();

        var baseTheta;
        if (titleRotateAngle !== null) {
            baseTheta = getTheta(-titleRotateAngle);
        }
        else {
            var wheelBaseAngle = baseAngle - (itemIndex * sliceAngle);
            baseTheta = getTheta(wheelBaseAngle + sliceAngle / 2);
        }

        var titleTransformString = "s1,r0,t" + (rOriginal / 10 * Math.cos(baseTheta)).toString() + "," + (rOriginal / 10 * Math.sin(baseTheta)).toString();

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: titleTransformString
        };
    };

    this.RotateTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var sliceTransformString = "s1,r360";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        };
    };

    this.RotateHalfTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var sliceTransformString = "s1,r90";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        };
    };

    this.RotateTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var titleTransformString = "s1,r360";

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: titleTransformString
        };
    };

    this.ScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var sliceTransformString = "s1.2";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        };
    };

    this.ScaleTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: "s1.3"
        };
    };

    this.RotateScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var sliceTransformString = "r360,s1.3";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        };
    };

    this.CustomTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var sliceTransformString = custom.scaleString + "," + custom.rotateString;

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        };
    };

    this.CustomTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex, custom) {

        var titleTransformString = custom.scaleString + "," + custom.rotateString;

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: titleTransformString
        };
    };

    return this;
};

/* Custom properties
    - scaleString
    - rotateString
*/
var sliceTransformCustomization = function () {

    this.scaleString = "s1";
    this.rotateString = "r0";

    return this;
};




///#source 1 1 /js/source/wheelnav.spreader.js
/* ======================================================================================= */
/* Spreader of wheel                                                                       */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/spreader.html      */
/* ======================================================================================= */

spreader = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.spreaderEnable) {
        var thisWheelNav = this.wheelnav;

        this.spreaderCircle = thisWheelNav.raphael.circle(thisWheelNav.centerX, thisWheelNav.centerY, thisWheelNav.spreaderRadius).attr(thisWheelNav.spreaderCircleAttr);
        this.spreadOnTitle = thisWheelNav.raphael.text(thisWheelNav.centerX, thisWheelNav.centerY, "+").attr(thisWheelNav.spreaderOnAttr);
        this.spreadOnTitle.id = thisWheelNav.getSpreadOnId();
        this.spreadOnTitle.click(function () {
            thisWheelNav.spreadWheel();
        });
        this.spreadOffTitle = thisWheelNav.raphael.text(thisWheelNav.centerX, thisWheelNav.centerY - 3, "–").attr(thisWheelNav.spreaderOffAttr);
        this.spreadOffTitle.id = thisWheelNav.getSpreadOffId();
        this.spreadOffTitle.click(function () {
            thisWheelNav.spreadWheel();
        });

        this.setVisibility();
    }

    return this;
};

spreader.prototype.setVisibility = function () {
    if (this.wheelnav.spreaderEnable) {
        this.spreaderCircle.toFront();

        if (this.wheelnav.currentPercent > this.wheelnav.minPercent) {
            this.spreadOffTitle.toFront();
            this.spreadOnTitle.toBack();
        }
        else {
            this.spreadOffTitle.toBack();
            this.spreadOnTitle.toFront();
        }
    }
};
///#source 1 1 /js/source/wheelnav.colorPalettes.js
/* ======================================================================================== */
/* Color palettes for slices from http://www.colourlovers.com                               */
/* ======================================================================================== */
/* ======================================================================================== */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/colorPalettes.html  */
/* ======================================================================================== */

var colorpalette = {
    defaultpalette: new Array("#2ECC40", "#FFDC00", "#FF851B", "#FF4136", "#0074D9", "#777"),
    purple: new Array("#4F346B", "#623491", "#9657D6", "#AD74E7", "#CBA3F3"),
    greenred: new Array("#17B92A", "#FF3D00", "#17B92A", "#FF3D00"),
    oceanfive: new Array("#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951"),
    garden: new Array("#648A4F", "#2B2B29", "#DF6126", "#FFA337", "#F57C85"),
    gamebookers: new Array("#FF9900", "#E9E9E9", "#BCBCBC", "#3299BB", "#424242"),
    parrot: new Array("#D80351", "#F5D908", "#00A3EE", "#929292", "#3F3F3F"),
    pisycholand: new Array("#FF1919", "#FF5E19", "#FF9F19", "#E4FF19", "#29FF19"),
    makeLOVEnotWAR: new Array("#2C0EF0", "#B300FF", "#6751F0", "#FF006F", "#8119FF"),
    theworldismine: new Array("#F21D1D", "#FF2167", "#B521FF", "#7E2AA8", "#000000"),
    fractalloveone: new Array("#002EFF", "#00FFF7", "#00FF62", "#FFAA00", "#FFF700"),
    fractallovetwo: new Array("#FF9500", "#FF0000", "#FF00F3", "#AA00FF", "#002EFF"),
    fractallove: new Array("#002EFF", "#00FFF7", "#00FF62", "#FFAA00", "#FFF700", "#FF0000", "#FF00F3", "#AA00FF")
};
