/* ======================================================================================= */
/*                                   wheelnav.js - v1.5.0                                  */
/* ======================================================================================= */
/* This is a small javascript library for animated SVG based wheel navigation.             */
/* Requires Raphaël JavaScript Vector Library (http://raphaeljs.com)                       */
/* ======================================================================================= */
/* Check http://wheelnavjs.softwaretailoring.net for samples.                              */
/* Fork https://github.com/softwaretailoring/wheelnav for contribution.                    */
/* ======================================================================================= */
/* Copyright © 2014-2015 Gábor Berkesi (http://softwaretailoring.net)                      */
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
    }
    else {
        //The divId parameter has to be the identifier of the wheelnav in this case.
        this.raphael = raphael;
        canvasWidth = this.raphael.canvas.clientWidth;
        clearContent = false;
    }

    //Public properties
    this.centerX = canvasWidth / 2;
    this.centerY = canvasWidth / 2;
    this.wheelRadius = canvasWidth / 2;
    this.navAngle = 0;
    this.sliceAngle = null;
    this.titleRotateAngle = null;
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
    this.spreaderOnPercent = 1;
    this.spreaderOffPercent = 1;
    this.spreaderOnTitle = "+";
    this.spreaderOffTitle = "-";
    this.spreaderTitleFont = null;
    this.minPercent = 0.01;
    this.maxPercent = 1;
    this.initPercent = 1;

    //Marker settings
    this.markerEnable = false;
    this.markerPathFunction = markerPath().TriangleMarker;
    this.markerPathCustom = null;

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
    this.sliceInitPathCustom = null;

    this.sliceTransformCustom = null;
    this.sliceSelectedTransformCustom = null;
    this.sliceHoverTransformCustom = null;
    this.sliceInitTransformCustom = null;

    this.animateeffect = null;
    this.animatetime = null;
    this.slicePathFunction = slicePath().PieSlice;
    this.sliceClickablePathFunction = null;
    this.sliceTransformFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverPathFunction = null;
    this.sliceHoverTransformFunction = null;
    this.sliceInitPathFunction = null;
    this.sliceInitTransformFunction = null;

    this.parseWheel(holderDiv);

    return this;
};

wheelnav.prototype.parseWheel = function (holderDiv) {
    //Parse html5 data- attributes, the onmouseup events and anchor links
    if (holderDiv !== undefined &&
        holderDiv !== null) {
        //data-wheelnav attribute is required
        var wheelnavData = holderDiv.hasAttribute("data-wheelnav");
        if (wheelnavData) {
            var parsedNavItems = [];
            var parsedNavItemsHref = [];
            var parsedNavItemsOnmouseup = [];
            var onlyInit = false;
            var dataAttrExist = false;

            //data-wheelnav-slicepath
            var wheelnavSlicepath = holderDiv.getAttribute("data-wheelnav-slicepath");
            if (wheelnavSlicepath !== null) {
                dataAttrExist = true;
                if (slicePath()[wheelnavSlicepath] !== undefined) {
                    this.slicePathFunction = slicePath()[wheelnavSlicepath];
                }
            }
            //data-wheelnav-wheelradius
            var wheelnavWheelradius = holderDiv.getAttribute("data-wheelnav-wheelradius");
            if (wheelnavWheelradius !== null) {
                dataAttrExist = true;
                this.wheelRadius = Number(wheelnavWheelradius);
            }
            //data-wheelnav-colors
            var wheelnavColors = holderDiv.getAttribute("data-wheelnav-colors");
            if (wheelnavColors !== null) {
                dataAttrExist = true;
                this.colors = wheelnavColors.split(',');
            }
            //data-wheelnav-navangle
            var wheelnavNavangle = holderDiv.getAttribute("data-wheelnav-navangle");
            if (wheelnavNavangle !== null) {
                dataAttrExist = true;
                this.navAngle = Number(wheelnavNavangle);
            }
            //data-wheelnav-cssmode
            var wheelnavCssmode = holderDiv.getAttribute("data-wheelnav-cssmode");
            if (wheelnavCssmode !== null) {
                dataAttrExist = true;
                this.cssMode = true;
            }
            //data-wheelnav-spreader
            var wheelnavSpreader = holderDiv.getAttribute("data-wheelnav-spreader");
            if (wheelnavSpreader !== null) {
                dataAttrExist = true;
                this.spreaderEnable = true;
            }
            //data-wheelnav-marker
            var wheelnavMarker = holderDiv.getAttribute("data-wheelnav-marker");
            if (wheelnavMarker !== null) {
                dataAttrExist = true;
                this.markerEnable = true;
            }
            //data-wheelnav-onlyinit
            var wheelnavOnlyinit = holderDiv.getAttribute("data-wheelnav-onlyinit");
            if (wheelnavOnlyinit !== null) {
                dataAttrExist = true;
                onlyInit = true;
            }

            for (var i = 0; i < holderDiv.children.length; i++) {

                var wheelnavNavitemtext = holderDiv.children[i].getAttribute("data-wheelnav-navitemtext");
                var wheelnavNavitemicon = holderDiv.children[i].getAttribute("data-wheelnav-navitemicon");
                if (wheelnavNavitemtext !== null ||
                    wheelnavNavitemicon !== null) {
                    //data-wheelnav-navitemtext
                    if (wheelnavNavitemtext !== null) {
                        parsedNavItems.push(wheelnavNavitemtext);
                    }
                    //data-wheelnav-navitemicon
                    else if (wheelnavNavitemicon !== null) {
                        if (icon[wheelnavNavitemicon] !== undefined) {
                            parsedNavItems.push(icon[wheelnavNavitemicon]);
                        }
                        else {
                            parsedNavItems.push(wheelnavNavitemicon);
                        }
                    }
                    else {
                        //data-wheelnav-navitemtext or data-wheelnav-navitemicon is required
                        continue;
                    }

                    dataAttrExist = true;

                    //onmouseup event of navitem element for call it in the navigateFunction
                    if (holderDiv.children[i].onmouseup !== undefined) {
                        parsedNavItemsOnmouseup.push(holderDiv.children[i].onmouseup);
                    }
                    else {
                        parsedNavItemsOnmouseup.push(null);
                    }

                    //parse inner <a> tag in navitem element for use href in navigateFunction
                    var foundHref = false;
                    for (var j = 0; j < holderDiv.children[i].children.length; j++) {
                        if (holderDiv.children[i].children[j].getAttribute('href') !== undefined) {
                            parsedNavItemsHref.push(holderDiv.children[i].children[j].getAttribute('href'));
                        }
                    }
                    if (!foundHref) {
                        parsedNavItemsHref.push(null);
                    }
                }
            }

            if (parsedNavItems.length > 0) {
                this.initWheel(parsedNavItems);

                for (var i = 0; i < parsedNavItemsOnmouseup.length; i++) {
                    this.navItems[i].navigateFunction = parsedNavItemsOnmouseup[i];
                    this.navItems[i].navigateHref = parsedNavItemsHref[i];
                }
            }

            if (dataAttrExist && !onlyInit) {
                this.createWheel();
            }
        }

        var removeChildrens = [];
        for (var i = 0; i < holderDiv.children.length; i++) {
            if (holderDiv.children[i].localName !== "svg") {
                removeChildrens.push(holderDiv.children[i]);
            }
        }

        for (var i = 0; i < removeChildrens.length; i++) {
            holderDiv.removeChild(removeChildrens[i]);
        }
    }
};

wheelnav.prototype.initWheel = function (titles) {

    //Init slices and titles
    if (!this.cssMode) {
        if (this.spreaderPathAttr === undefined || this.spreaderPathAttr === null) {
            this.spreaderPathAttr = { fill: "#444", stroke: "#444", "stroke-width": 2, cursor: 'pointer' };
        }
        if (this.spreaderOnAttr === undefined || this.spreaderOnAttr === null) {
            this.spreaderOnAttr = { fill: "#eee", cursor: 'pointer' };
        }
        if (this.spreaderOffAttr === undefined || this.spreaderOffAttr === null) {
            this.spreaderOffAttr = { fill: "#eee", cursor: 'pointer' };
        }
        if (this.markerAttr === undefined || this.markerAttr === null) {
            this.markerAttr = { stroke: "#444", "stroke-width": 2 };
        }
    }
    else {
        this.spreaderPathAttr = { "class": this.getSpreaderId() };
        this.spreaderOnAttr = { "class": this.getSpreaderTitleCssClass("in") };
        this.spreaderOffAttr = { "class": this.getSpreaderTitleCssClass("out") };
        this.markerAttr = { "class": this.getMarkerId() };
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

    if (withSpread) {
        this.currentPercent = this.minPercent;
    }
    else {
        this.currentPercent = this.maxPercent;
    }

    if (this.navItems.length === 0) {
        this.initWheel(titles);
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.navItems[i].createNavItem();
    }

    this.spreader = new spreader(this);

    this.marker = new marker(this);

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
        navItem.setCurrentTransform(true);
        navItem.refreshNavItem();
    }

    this.currentClick = clicked;

    if (this.clickModeSpreadOff) {
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
        this.spreader.setCurrentTransform();
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
        navItem.setCurrentTransform(true);
    }

    this.marker.setCurrentTransform();
    this.spreader.setCurrentTransform();

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
wheelnav.prototype.getClickableSliceId = function (index) {
    return "wheelnav-" + this.holderId + "-clickableslice-" + index;
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
wheelnav.prototype.getSpreaderTitleId = function () {
    return "wheelnav-" + this.holderId + "-spreadertitle";
};
wheelnav.prototype.getSpreaderTitleCssClass = function (state) {
    return "wheelnav-" + this.holderId + "-spreadertitle-" + state;
};
wheelnav.prototype.getMarkerId = function () {
    return "wheelnav-" + this.holderId + "-marker";
};
