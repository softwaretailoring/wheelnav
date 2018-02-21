/* ======================================================================================= */
/*                                   wheelnav.js - v1.8.0                                  */
/* ======================================================================================= */
/* This is a small JavaScript library for animated SVG based wheel navigation.             */
/* Requires Raphaël JavaScript Vector Library (http://dmitrybaranovskiy.github.io/raphael/)*/
/* ======================================================================================= */
/* Check http://wheelnavjs.softwaretailoring.net for samples.                              */
/* Fork https://github.com/softwaretailoring/wheelnav for contribution.                    */
/* ======================================================================================= */
/* Copyright © 2014-2018 Gábor Berkesi (http://softwaretailoring.net)                      */
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

    if ((holderDiv === null ||
        holderDiv === undefined) &&
        (raphael === undefined ||
        raphael === null)) {
        return this;
    }
    
    //Prepare raphael object and set the width
    var canvasWidth;
    var clearContent = true;

    if (raphael === undefined ||
        raphael === null) {

        var removeChildrens = [];
        for (var i = 0; i < holderDiv.children.length; i++) {
            if (holderDiv.children[i].localName === "svg") {
                removeChildrens.push(holderDiv.children[i]);
            }
        }

        for (var i = 0; i < removeChildrens.length; i++) {
            holderDiv.removeChild(removeChildrens[i]);
        }

        if (divWidth !== undefined &&
            divWidth !== null) {
            if (divHeight === undefined ||
                divHeight === null) {
                divHeight = divWidth;
            }
            this.raphael = new Raphael(divId, divWidth, divHeight);
            canvasWidth = divWidth;
        }
        else {
            this.raphael = new Raphael(divId);
            canvasWidth = holderDiv.clientWidth;
        }

        this.raphael.setViewBox(0, 0, this.raphael.width, this.raphael.height, true);
    }
    else {
        //The divId parameter has to be the identifier of the wheelnav in this case.
        this.raphael = raphael;
        canvasWidth = this.raphael.width;
        clearContent = false;
    }

    //Public properties
    this.centerX = canvasWidth / 2;
    this.centerY = canvasWidth / 2;
    this.wheelRadius = canvasWidth / 2;
    this.navAngle = 0;
    this.sliceAngle = null;
    this.titleRotateAngle = null;
    this.titleCurved = false;
    this.titleCurvedClockwise = null;
    this.titleCurvedByRotateAngle = false;
    this.initTitleRotate = false;
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
    this.selectedNavItemIndex = 0;
    this.hoverEnable = true;
    this.hoveredToFront = true;

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
    this.spreaderRadius = 20;
    this.spreaderStartAngle = 0;
    this.spreaderSliceAngle = 360;
    this.spreaderPathFunction = spreaderPath().PieSpreader;
    this.spreaderPathCustom = null;
    this.spreaderInPercent = 1;
    this.spreaderOutPercent = 1;
    this.spreaderInTitle = "+";
    this.spreaderOutTitle = "-";
    this.spreaderTitleFont = null;
    this.spreaderPathInAttr = null;
    this.spreaderPathOutAttr = null;
    this.spreaderTitleInAttr = null;
    this.spreaderTitleOutAttr = null;
    this.spreaderInTitleWidth = null;
    this.spreaderInTitleHeight = null;
    this.spreaderOutTitleWidth = null;
    this.spreaderOutTitleHeight = null;

    //Percents
    this.minPercent = 0.01;
    this.maxPercent = 1;
    this.initPercent = 1;

    //Marker settings
    this.markerEnable = false;
    this.markerPathFunction = markerPath().TriangleMarker;
    this.markerPathCustom = null;

    //Private properties
    this.currentClick = 0;
    this.animateLocked = false;

    //NavItem default settings. These are configurable between initWheel() and createWheel().
    this.slicePathAttr = null;
    this.sliceHoverAttr = null;
    this.sliceSelectedAttr = null;
    
    this.titleFont = '100 24px Impact, Charcoal, sans-serif';
    this.titleAttr = null;
    this.titleHoverAttr = null;
    this.titleSelectedAttr = null;
    //When navTitle start with 'imgsrc:' it can parse as URL of image or data URI. These properties are available for images and paths.
    this.titleWidth = null;
    this.titleHeight = null;
    this.titleHoverWidth = null;
    this.titleHoverHeight = null;
    this.titleSelectedWidth = null;
    this.titleSelectedHeight = null;

    this.linePathAttr = null;
    this.lineHoverAttr = null;
    this.lineSelectedAttr = null;

    this.slicePathCustom = null;
    this.sliceClickablePathCustom = null;
    this.sliceSelectedPathCustom = null;
    this.sliceHoverPathCustom = null;
    this.sliceInitPathCustom = null;

    this.sliceTransformCustom = null;
    this.sliceSelectedTransformCustom = null;
    this.sliceHoverTransformCustom = null;
    this.sliceInitTransformCustom = null;

    this.animateeffect = null;
    this.animatetime = null;
    if (slicePath()["PieSlice"] !== undefined) {
        this.slicePathFunction = slicePath().PieSlice;
    }
    else {
        this.slicePathFunction = slicePath().NullSlice;
    }
    this.sliceClickablePathFunction = null;
    this.sliceTransformFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverPathFunction = null;
    this.sliceHoverTransformFunction = null;
    this.sliceInitPathFunction = null;
    this.sliceInitTransformFunction = null;

    this.keynavigateEnabled = false;
    this.keynavigateOnlyFocus = false;
    this.keynavigateDownCode = 37; // left arrow
    this.keynavigateDownCodeAlt = 40; // down arrow
    this.keynavigateUpCode = 39; // right arrow
    this.keynavigateUpCodeAlt = 38; // up arrow

    this.parseWheel(holderDiv);

    return this;
};

wheelnav.prototype.initWheel = function (titles) {

    //Init slices and titles
    this.styleWheel();

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

    if (this.currentPercent === null) {
        if (withSpread) {
            this.currentPercent = this.minPercent;
        }
        else {
            this.currentPercent = this.maxPercent;
        }
    }

    if (this.navItems.length === 0) {
        this.initWheel(titles);
    }

    if (this.selectedNavItemIndex !== null) {
        this.navItems[this.selectedNavItemIndex].selected = true;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.navItems[i].createNavItem();
    }

    if (this.keynavigateEnabled) {
        var thiswheelnav = this;
        var keyelement = window;

        if (this.keynavigateOnlyFocus) {
            keyelement = document.getElementById(this.holderId);
            if (!keyelement.hasAttribute("tabindex")) {
                keyelement.setAttribute("tabindex", 0);
            }
        }

        keyelement.addEventListener("keydown", this.keyNavigateFunction =  function (e) {
            e = e || window.e;
            var keyCodeEvent = e.which || e.keyCode;
            if ([thiswheelnav.keynavigateDownCode, thiswheelnav.keynavigateDownCodeAlt, thiswheelnav.keynavigateUpCode, thiswheelnav.keynavigateUpCodeAlt].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }

            var keynavigate = null;

            if (keyCodeEvent === thiswheelnav.keynavigateUpCode || keyCodeEvent === thiswheelnav.keynavigateUpCodeAlt) {
                if (thiswheelnav.currentClick === thiswheelnav.navItemCount - 1) {
                    keynavigate = 0;
                }
                else {
                    keynavigate = thiswheelnav.currentClick + 1;
                }
            }
            if (keyCodeEvent === thiswheelnav.keynavigateDownCode || keyCodeEvent === thiswheelnav.keynavigateDownCodeAlt) {
                if (thiswheelnav.currentClick === 0) {
                    keynavigate = thiswheelnav.navItemCount - 1;
                }
                else {
                    keynavigate = thiswheelnav.currentClick - 1;
                }
            }

            if (keynavigate !== null) {
                thiswheelnav.navigateWheel(keynavigate);

                if (thiswheelnav.navItems[keynavigate].navigateFunction !== null) {
                    thiswheelnav.navItems[keynavigate].navigateFunction();
                }
            }
        });
    }

    this.spreader = new spreader(this);

    this.marker = new marker(this);

    this.refreshWheel();

    if (withSpread !== undefined) {
        this.spreadWheel();
    }

    return this;
};

wheelnav.prototype.removeWheel = function () {
    this.raphael.remove();

    if (this.keynavigateEnabled) {
        var keyelement = window;

        if (this.keynavigateOnlyFocus) {
            keyelement = document.getElementById(this.holderId);
            if (keyelement.hasAttribute("tabindex")) {
                keyelement.removeAttribute("tabindex");
            }
        }

        keyelement.removeEventListener("keydown", this.keyNavigateFunction);
    }
};

wheelnav.prototype.refreshWheel = function (withPathAndTransform) {

    for (i = 0; i < this.navItemCount; i++) {
        var navItem = this.navItems[i];
        navItem.setWheelSettings(withPathAndTransform);
        navItem.refreshNavItem(withPathAndTransform);
    }

    this.marker.setCurrentTransform();
    this.spreader.setCurrentTransform();
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
            var currentAnimateTime;
            if (this.animatetime != null) {
                currentAnimateTime = this.animatetime;
            }
            else {
                currentAnimateTime = 1500;
            }

            if (this.animatetimeCalculated &&
                clicked !== this.currentClick) {
                navItem.animatetime = currentAnimateTime * (Math.abs(rotationAngle) / 360);
            }

            if (this.rotateRoundCount > 0) {
                if (this.clockwise) { navItem.currentRotateAngle -= this.rotateRoundCount * 360; }
                else { navItem.currentRotateAngle += this.rotateRoundCount * 360; }

                navItem.animatetime = currentAnimateTime * (this.rotateRoundCount + 1);
            }
        }
    }

    for (i = 0; i < this.navItemCount; i++) {
        navItem = this.navItems[i];
        navItem.setCurrentTransform(true, true);
        navItem.refreshNavItem();
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
        this.currentPercent = this.maxPercent;
        this.spreadWheel();
    }
    else {
        if (clicked !== null &&
            !this.clickModeRotate) {
            this.marker.setCurrentTransform(this.navItems[this.currentClick].navAngle);
        }
        else {
            this.marker.setCurrentTransform();
        }
        this.spreader.setCurrentTransform(true);
    }
};

wheelnav.prototype.spreadWheel = function () {

    this.animateUnlock(true);
    this.animateLocked = true;

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
        navItem.setCurrentTransform(true, false);
    }

    this.marker.setCurrentTransform();
    this.spreader.setCurrentTransform();

    return this;
};

wheelnav.prototype.animateUnlock = function (force, withFinishFunction) {

    if (force !== undefined && 
        force === true) {
        for (var f = 0; f < this.navItemCount; f++) {
            this.navItems[f].navSliceUnderAnimation = false;
            this.navItems[f].navTitleUnderAnimation = false;
            this.navItems[f].navTitlePathUnderAnimation = false;
            this.navItems[f].navLineUnderAnimation = false;
            this.navItems[f].navSlice.stop();
            this.navItems[f].navLine.stop();
            this.navItems[f].navTitle.stop();
            if (this.navItems[f].navTitlePath !== undefined) {
                this.navItems[f].navTitlePath.stop();
            }
        }
    }
    else {
        for (var i = 0; i < this.navItemCount; i++) {
            if (this.navItems[i].navSliceUnderAnimation === true ||
                this.navItems[i].navTitleUnderAnimation === true ||
                this.navItems[i].navTitlePathUnderAnimation === true ||
                this.navItems[i].navLineUnderAnimation === true) {
                return;
            }
        }

        this.animateLocked = false;
        if (this.animateFinishFunction !== null &&
            withFinishFunction !== undefined &&
            withFinishFunction === true) {
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
wheelnav.prototype.getClickableSliceId = function (index) {
    return "wheelnav-" + this.holderId + "-clickableslice-" + index;
};
wheelnav.prototype.getTitleId = function (index) {
    return "wheelnav-" + this.holderId + "-title-" + index;
};
wheelnav.prototype.getTitlePathId = function (index) {
    return "wheelnav-" + this.holderId + "-titlepath-" + index;
};
wheelnav.prototype.getLineId = function (index) {
    return "wheelnav-" + this.holderId + "-line-" + index;
};
wheelnav.prototype.getSpreaderId = function () {
    return "wheelnav-" + this.holderId + "-spreader";
};
wheelnav.prototype.getSpreaderTitleId = function () {
    return "wheelnav-" + this.holderId + "-spreadertitle";
};
wheelnav.prototype.getMarkerId = function () {
    return "wheelnav-" + this.holderId + "-marker";
};
