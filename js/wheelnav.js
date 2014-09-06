///#source 1 1 /js/source/wheelnav.core.js
/* ======================================================================================= */
/*                                   wheelnav.js - v1.0.3                                  */
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
    this.wheelRadius = canvasWidth / 2;
    this.navAngle = 0;
    this.baseAngle = null;
    this.sliceAngle = 0;
    this.titleRotateAngle = null;
    this.clickModeRotate = true;
    this.clickModeSpreadOff = false;
    this.clockwise = true;
    this.multiSelect = false;
    this.hoverPercent = 1;
    this.selectedPercent = 1;
    this.currentPercent = null;
    
    this.navItemCount = 0;
    this.navItems = new Array();
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

    //NavItem settings. If it remains null, use default settings.
    this.slicePathAttr = null;
    this.sliceHoverAttr = null;
    this.sliceSelectedAttr = null;
    this.titleAttr = null;
    this.titleHoverAttr = null;
    this.titleSelectedAttr = null;
    this.linePathAttr = null;
    this.lineHoverAttr = null;
    this.lineSelectedAttr = null;

    this.animateeffect = null;
    this.animatetime = null;
    this.slicePathFunction = slicePath().PieSlice;
    this.sliceTransformFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverPathFunction = null;
    this.sliceHoverTransformFunction = null;
    this.titleFont = '100 24px Impact, Charcoal, sans-serif';

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

    this.spreader = new spreader(this);
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

wheelnav.prototype.refreshWheel = function (selectedToFront) {

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

            if (selectedToFront != null) {
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
}

wheelnav.prototype.navigateWheel = function (clicked, selectedToFront) {

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

        if (this.clockwise) {
            navItem.currentRotate -= (clicked - this.currentClick) * (360 / this.navItemCount);
        }
        else {
            navItem.currentRotate += (clicked - this.currentClick) * (360 / this.navItemCount);
        }
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

    this.refreshWheel(selectedToFront);
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
    if (this.wheelnav.clockwise) {
        this.itemIndex = itemIndex;
    }
    else {
        this.itemIndex = -itemIndex;
    }

    this.selected = false;
    this.hovered = false;

    this.navItem = null;
    this.navSlice = null;
    this.navTitle = null;
    this.navLine = null;

    this.navSliceCurrentTransformString = null;
    this.navTitleCurrentTransformString = null;
    this.navLineCurrentTransformString = null;

    this.title = title;
    this.selectedTitle = title;
    this.tooltip = null;
    this.titleFont = wheelnav.titleFont;
    if (wheelnav.titleSpreadScale == null) { this.titleSpreadScale = false; }
    else { this.titleSpreadScale = wheelnav.titleSpreadScale; }
    this.currentRotate = 0;
    this.minPercent = wheelnav.minPercent;
    this.maxPercent = wheelnav.maxPercent;
    this.hoverPercent = wheelnav.hoverPercent;
    this.selectedPercent = wheelnav.selectedPercent;

    if (title != null) {
        this.slicePathFunction = wheelnav.slicePathFunction;
        this.sliceSelectedPathFunction = wheelnav.sliceSelectedPathFunction;
        this.sliceHoverPathFunction = wheelnav.sliceHoverPathFunction;

        this.sliceTransformFunction = wheelnav.sliceTransformFunction;
        this.sliceSelectedTransformFunction = wheelnav.sliceSelectedTransformFunction;
        this.sliceHoverTransformFunction = wheelnav.sliceHoverTransformFunction;
    }
    else {
        this.title = "";
        this.slicePathFunction = slicePath().NullSlice;
        this.sliceSelectedPathFunction = null;
        this.sliceHoverPathFunction = null;
        this.sliceTransformFunction = null;
        this.sliceSelectedTransformFunction = null;
        this.sliceHoverTransformFunction = null;
    }

    this.fillAttr = { fill: "#CCC" };

    if (wheelnav.animateeffect == null) { this.animateeffect = "bounce"; }
    else { this.animateeffect = wheelnav.animateeffect; }
    if (wheelnav.animatetime == null) { this.animatetime = 1500; }
    else { this.animatetime = wheelnav.animatetime; }
    
    if (wheelnav.slicePathAttr == null) { this.slicePathAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' }; }
    else { this.slicePathAttr = wheelnav.slicePathAttr; }
    if (wheelnav.sliceHoverAttr == null) { this.sliceHoverAttr = { stroke: "#111", "stroke-width": 4, cursor: 'pointer' }; }
    else { this.sliceHoverAttr = wheelnav.sliceHoverAttr; }
    if (wheelnav.sliceSelectedAttr == null) {
        if (this.wheelnav.multiSelect) {
            this.sliceSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'pointer' };
        }
        else {
            this.sliceSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'default' };
        }
    }
    else { this.sliceSelectedAttr = wheelnav.sliceSelectedAttr; }

    if (wheelnav.titleAttr == null) { this.titleAttr = { font: this.titleFont, fill: "#111", stroke: "none", cursor: 'pointer' }; }
    else { this.titleAttr = wheelnav.titleAttr; }
    if (wheelnav.titleHoverAttr == null) { this.titleHoverAttr = { font: this.titleFont, fill: "#111", cursor: 'pointer', stroke: "none" }; }
    else { this.titleHoverAttr = wheelnav.titleHoverAttr; }
    if (wheelnav.titleSelectedAttr == null) {
        if (this.wheelnav.multiSelect) {
            this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF", cursor: 'pointer' };
        }
        else {
            this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF", cursor: 'default' };
        }
    }
    else { this.titleSelectedAttr = wheelnav.titleSelectedAttr; }

    if (wheelnav.linePathAttr == null) { this.linePathAttr = { stroke: "#111", "stroke-width": 2, cursor: 'pointer' }; }
    else { this.linePathAttr = wheelnav.linePathAttr; }
    if (wheelnav.lineHoverAttr == null) { this.lineHoverAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' }; }
    else { this.lineHoverAttr = wheelnav.lineHoverAttr; }
    if (wheelnav.lineSelectedAttr == null) {
        if (this.wheelnav.multiSelect) {
            this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'pointer' };
        }
        else {
            this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'default' };
        }
    }
    else { this.lineSelectedAttr = wheelnav.lineSelectedAttr; }

    this.navDivId = null;
    if (wheelnav.navDivDefultCssClass == null) { this.navDivDefultCssClass = "tab-pane fade"; }
    else { this.navDivDefultCssClass = wheelnav.navDivDefultCssClass; }
    if (wheelnav.navDivSelectedCssClass == null) { this.navDivSelectedCssClass = "tab-pane fade in active"; }
    else { this.navDivSelectedCssClass = wheelnav.navDivSelectedCssClass; }

    return this;
}

wheelnavItem.prototype.createNavItem = function () {

    //Set min/max sliecePaths
    //Default - min
    if (this.slicePathMin == null) {
        this.slicePathMin = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.minPercent);
    }
    //Default - max
    if (this.slicePathMax == null) {
        this.slicePathMax = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.maxPercent);
    }
    //Selected - min
    if (this.selectedSlicePathMin == null) {
        if (this.sliceSelectedPathFunction != null) {
            this.selectedSlicePathMin = this.sliceSelectedPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.selectedPercent * this.minPercent);
        }
        else if (this.selectedPercent != 1) {
            this.selectedSlicePathMin = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.selectedPercent * this.minPercent);
        }
        else {
            this.selectedSlicePathMin = this.slicePathMin;
        }
    }
    //Selected - max
    if (this.selectedSlicePathMax == null) {
        if (this.sliceSelectedPathFunction != null) {
            this.selectedSlicePathMax = this.sliceSelectedPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.selectedPercent * this.maxPercent);
        }
        else if (this.selectedPercent != 1) {
            this.selectedSlicePathMax = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.selectedPercent * this.maxPercent);
        }
        else {
            this.selectedSlicePathMax = this.slicePathMax;
        }
    }
    //Hovered - min
    if (this.hoverSlicePathMin == null) {
        if (this.sliceHoverPathFunction != null) {
            this.hoverSlicePathMin = this.sliceHoverPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.hoverPercent * this.minPercent);
        }
        else if (this.hoverPercent != 1) {
            this.hoverSlicePathMin = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.hoverPercent * this.minPercent);
        }
        else {
            this.hoverSlicePathMin = this.slicePathMin;
        }
    }
    //Hovered - max
    if (this.hoverSlicePathMax == null) {
        if (this.sliceHoverPathFunction != null) {
            this.hoverSlicePathMax = this.sliceHoverPathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.hoverPercent * this.maxPercent);
        }
        else if (this.hoverPercent != 1) {
            this.hoverSlicePathMax = this.slicePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.hoverPercent * this.maxPercent);
        }
        else {
            this.hoverSlicePathMax = this.slicePathMax;
        }
    }

    //Set sliceTransforms
    //Default
    if (this.sliceTransform == null) {
        if (this.sliceTransformFunction != null) {
            this.sliceTransform = this.sliceTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.wheelnav.titleRotateAngle, this.itemIndex);
        }
        else {
            this.sliceTransform = sliceTransform().NullTransform;
        }
    }
    //Selected
    if (this.selectTransform == null) {
        if (this.sliceSelectedTransformFunction != null) {
            this.selectTransform = this.sliceSelectedTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.wheelnav.titleRotateAngle, this.itemIndex);
        }
        else {
            this.selectTransform = sliceTransform().NullTransform;
        }
    }
    //Hovered
    if (this.hoverTransform == null) {
        if (this.sliceHoverTransformFunction != null) {
            this.hoverTransform = this.sliceHoverTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.wheelnav.titleRotateAngle, this.itemIndex);
        }
        else {
            this.hoverTransform = sliceTransform().NullTransform;
        }
    }

    var slicePath = this.getCurrentPath();

    //Create slice
    this.navSlice = this.wheelnav.raphael.path(slicePath.slicePathString);
    this.navSlice.attr(this.slicePathAttr);
    this.navSlice.attr(this.fillAttr);
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
    this.navItem.push(
        this.navSlice,
        this.navTitle,
        this.navLine
    );

    if (this.tooltip != null) {
        this.navItem.attr({ title: this.tooltip });
    }
    this.navItem.id = this.wheelnav.getItemId(this.wheelItemIndex);

    var thisWheelNav = this.wheelnav;
    var thisNavItem = this;
    var thisItemIndex = this.wheelItemIndex;

    this.navItem.click(function () {
        thisWheelNav.navigateWheel(thisItemIndex);
    });
    this.navItem.mouseover(function () {
        thisNavItem.hoverEffect(thisItemIndex, true);
    });
    this.navItem.mouseout(function () {
        thisNavItem.hoverEffect(thisItemIndex, false);
    });
};

wheelnavItem.prototype.hoverEffect = function (hovered, isEnter) {

    for (i = 0; i < this.wheelnav.navItemCount; i++) {

        var navItem = this.wheelnav.navItems[i];

        if (isEnter && i == hovered && i != this.wheelnav.currentClick) {
            navItem.navSlice.attr(navItem.sliceHoverAttr);
            navItem.navTitle.attr(navItem.titleHoverAttr);
            navItem.navLine.attr(navItem.lineHoverAttr);
            navItem.hovered = true;
        }
        else {
            navItem.hovered = false;

            if (navItem.selected) {
                navItem.navSlice.attr(navItem.sliceSelectedAttr);
                navItem.navTitle.attr(navItem.titleSelectedAttr);
                navItem.navLine.attr(navItem.lineSelectedAttr);
            }
            else {
                navItem.navSlice.attr(navItem.slicePathAttr);
                navItem.navSlice.attr(navItem.fillAttr);
                navItem.navTitle.attr(navItem.titleAttr);
                navItem.navLine.attr(navItem.linePathAttr);
            }
        }

        if (this.hoverPercent != 1 ||
            this.sliceHoverPathFunction != null ||
            this.sliceHoverTransformFunction != null) {
            navItem.setCurrentTransform();
        }
    }
};

wheelnavItem.prototype.setNavDivCssClass = function () {

    if (this.navDivId != null) {
        if (this.wheelnav.navDivTabId != null) {
            if (this.selected) {
                $('#' + this.wheelnav.navDivTabId + ' a[href="#' + this.navDivId + '"]').tab('show');
            }
        }
        else {
            if (this.selected) {
                document.getElementById(this.navDivId).className = this.navDivSelectedCssClass;
            }
            else {
                document.getElementById(this.navDivId).className = this.navDivDefultCssClass;
            }
        }
    }
};

wheelnavItem.prototype.setCurrentTransform = function () {

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
        if (this.selectTransform.titleTransformString == "" ||
            this.selectTransform.titleTransformString == undefined) {
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
        if (this.hoverTransform.titleTransformString == "" ||
            this.hoverTransform.titleTransformString == undefined) {
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
        if (this.sliceTransform.titleTransformString == "" ||
            this.sliceTransform.titleTransformString == undefined) {
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
    }

    var lineTransformAttr = {};

    lineTransformAttr = {
        path: slicePath.linePathString,
        transform: this.navLineCurrentTransformString
    }

    //Set title
    var currentTitle = this.title;
    if (this.selected) { currentTitle = this.selectedTitle; }
    
    if (this.navTitle.type == "path") {
        titleCurrentPath = new wheelnavTitle(currentTitle, this.wheelnav.raphael.raphael);
    }
    else {
        titleCurrentPath = new wheelnavTitle(currentTitle);
    }

    var percentAttr = this.getTitlePercentAttr(slicePath.titlePosX, slicePath.titlePosY, titleCurrentPath);

    var titleTransformAttr = {};

    if (this.navTitle.type == "path") {
        titleTransformAttr = {
            path: percentAttr.path,
            transform: this.navTitleCurrentTransformString
        }
    }
    else {
        titleTransformAttr = {
            x: percentAttr.x,
            y: percentAttr.y,
            transform: this.navTitleCurrentTransformString
        }

        this.navTitle.attr({ text: currentTitle });
    }

    //Animate navitem
    this.navSlice.animate(sliceTransformAttr, this.animatetime, this.animateeffect);
    this.navLine.animate(lineTransformAttr, this.animatetime, this.animateeffect);
    this.navTitle.animate(titleTransformAttr, this.animatetime, this.animateeffect);
}

wheelnavItem.prototype.getTitlePercentAttr = function (currentX, currentY, thisPath) {

    var transformAttr = {};

    if (thisPath.relativePath != null) {
        var pathCx = currentX + (thisPath.startX - thisPath.BBox.cx);
        var pathCy = currentY + (thisPath.startY - thisPath.BBox.cy);

        thisPath.relativePath[0][1] = pathCx;
        thisPath.relativePath[0][2] = pathCy;

        transformAttr = {
            path: thisPath.relativePath
        }
    }
    else {
        transformAttr = {
            x: currentX,
            y: currentY
        }
    }

    return transformAttr;
}

wheelnavItem.prototype.getCurrentPath = function () {
    var slicePath;

    if (this.wheelnav.currentPercent == this.wheelnav.maxPercent) {
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
}

wheelnavItem.prototype.isPathTitle = function () {
    if (this.title.substr(0, 1) == "M" &&
            this.title.substr(this.title.length - 1, 1) == "z") {
        return true;
    }
    else {
        return false;
    }
}

wheelnavItem.prototype.getItemRotateString = function () {
    return "r," + this.currentRotate + "," + this.wheelnav.centerX + "," + this.wheelnav.centerY;
}

wheelnavItem.prototype.getTitleRotateString = function () {

    var titleRotate = "";

    if (this.wheelnav.titleRotateAngle != null) {
        titleRotate += this.getItemRotateString();
        titleRotate += ",r," + this.itemIndex * (360 / this.wheelnav.navItemCount);
        titleRotate += ",r," + this.wheelnav.titleRotateAngle;
        titleRotate += ",r," + this.wheelnav.navAngle;
    }
    else {
        titleRotate += this.getItemRotateString();
        titleRotate += ",r," + (-this.currentRotate).toString();
    }

    return titleRotate;
}

wheelnavTitle = function (title, raphael) {
    this.title = title;
    //Calculate relative path
    if (raphael != null) {
        this.relativePath = raphael.pathToRelative(title);
        this.BBox = raphael.pathBBox(this.relativePath);
        this.startX = this.relativePath[0][1];
        this.startY = this.relativePath[0][2];
    }

    return this;
}

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

    this.setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        this.sliceRadius = rOriginal * percent;
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = this.getTheta(this.startAngle);
        this.middleTheta = this.getTheta(this.startAngle + sliceAngle / 2);
        this.endTheta = this.getTheta(this.startAngle + sliceAngle);
        this.titleRadius = this.sliceRadius * 0.5;
        this.setTitlePos(x, y);
    }

    this.setTitlePos = function (x, y) {
        this.titlePosX = this.titleRadius * Math.cos(this.middleTheta) + x;
        this.titlePosY = this.titleRadius * Math.sin(this.middleTheta) + y;
    }

    this.getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    return this;
}



///#source 1 1 /js/source/wheelnav.slicePath.js
/* ======================================================================================= */
/* Slice path definitions                                                                  */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var slicePath = function () {

    this.helper = new slicePathHelper();

    this.NullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.PieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
       
        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.9;
        helper.titleRadius = r * 0.6;
        helper.setTitlePos(x, y);

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.PieSliceSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        var deltaTheta = (1 - percent) * (endTheta - startTheta) / 2;
        startTheta = startTheta + deltaTheta;
        endTheta = endTheta - deltaTheta;

        rOriginal = percent * rOriginal;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.DonutSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.95;
        rbase = r * 0.37;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 0, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        helper.titleRadius = r * 0.7;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.UmbrellaSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.95;
        rbase = r * 0.37;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 0, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["z"]];

        helper.titleRadius = r * 0.7;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.StarBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.StarSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        
        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        rbase = r * 0.5;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];

        helper.titleRadius = r * 0.44;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.CogBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.9;

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

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.CogSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        rbase = r * 0.9;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.0625);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.1875);
        theta3 = helper.getTheta(helper.startAngle + sliceAngle * 0.3125);
        theta4 = helper.getTheta(helper.startAngle + sliceAngle * 0.4375);
        theta5 = helper.getTheta(helper.startAngle + sliceAngle * 0.5625);
        theta6 = helper.getTheta(helper.startAngle + sliceAngle * 0.6875);
        theta7 = helper.getTheta(helper.startAngle + sliceAngle * 0.8125);
        theta8 = helper.getTheta(helper.startAngle + sliceAngle * 0.9375);

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

        helper.titleRadius = r * 0.55;
        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.MenuSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        helper.titleRadius = r * 0.63;
        helper.setTitlePos(x, y);

        var menuRadius = percent * 25;

        if (menuRadius < 15)
        {
            menuRadius = 15;
        }

        if (percent <= 0.05) {
            menuRadius = 10;
        }

        middleTheta = helper.middleTheta;

        slicePathString = [["M", helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                    ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX + (menuRadius * Math.cos(middleTheta)), helper.titlePosY + (menuRadius * Math.sin(middleTheta))],
                    ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                    ["z"]];

        if (percent <= 0.05) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x+1, y+1]];
        }
        else {
            lineEndX = (helper.titleRadius - menuRadius) * Math.cos(middleTheta) + x;
            lineEndY = (helper.titleRadius - menuRadius) * Math.sin(middleTheta) + y;

            linePathString = [["M", x, y],
                        ["A", r / 2, r / 2, 0, 0, 1, lineEndX, lineEndY]];
        }

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.MenuSliceSelectedLine = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePath = MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        helper.titleRadius = r * 0.63;

        var menuRadius = percent * 25;

        if (menuRadius < 15) {
            menuRadius = 15;
        }

        if (percent == 0) {
            menuRadius = 10;
        }

        middleTheta = helper.middleTheta;

        if (percent == 0) {
            linePathString = [["M", x, y],
                    ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
        }
        else {
            lineEndX = (helper.titleRadius - menuRadius) * Math.cos(middleTheta) + x;
            lineEndY = (helper.titleRadius - menuRadius) * Math.sin(middleTheta) + y;

            linePathString = [["M", x, y],
                        ["A", r / 3, r / 3, 0, 0, 1, lineEndX, lineEndY]];
        }

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: linePathString,
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        }
    }

    this.MenuSliceWithoutLine = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePath = MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        return {
            slicePathString: slicePath.slicePathString,
            linePathString: "",
            titlePosX: slicePath.titlePosX,
            titlePosY: slicePath.titlePosY
        }
    }

    this.MenuSquareSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        helper.titleRadius = r * 0.63;
        helper.setTitlePos(x, y);

        var menuRadius = percent * 30;

        if (menuRadius < 15) {
            menuRadius = 15;
        }

        if (percent <= 0.05) {
            menuRadius = 10;
        }

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
        }
    }

    this.FlowerSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        rbase = r * 0.65;

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["A", r/7, r/7, 0, 0, 1, rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.EyeSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.7;

        helper.titleRadius = r * 0.87;
        helper.setTitlePos(x, y);

        if (percent == 0) {
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
        }
    }

    this.WheelSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.85;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        if (sliceAngle < 120) {
            helper.titleRadius = r * 0.62;
            slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
                         ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
                         ["A", (r * 0.97), (r * 0.97), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
                         ["z"],
                         ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];
        }
        else if (sliceAngle < 180) {
            helper.titleRadius = r * 0.56;
            slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
                         ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
                         ["A", (r * 0.95), (r * 0.95), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
                         ["z"],
                         ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];
        }
        else {
            helper.titleRadius = r * 0.5;
            slicePathString = [["M", (r * 0.1) * Math.cos(middleTheta) + x, (r * 0.1) * Math.sin(middleTheta) + y],
                         ["L", (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(startTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(startTheta) + y],
                         ["A", (r * 0.905), (r * 0.905), 0, 0, 1, (r * 0.1) * Math.cos(middleTheta) + (r * 0.9) * Math.cos(endTheta) + x, (r * 0.1) * Math.sin(middleTheta) + (r * 0.9) * Math.sin(endTheta) + y],
                         ["z"],
                         ["M", (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 1, (r * 1.1) * Math.cos(endTheta) + x, (r * 1.1) * Math.sin(endTheta) + y],
                         ["A", (r * 1.1), (r * 1.1), 0, 0, 0, (r * 1.1) * Math.cos(startTheta) + x, (r * 1.1) * Math.sin(startTheta) + y]];
        }

        helper.setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.LineSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

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
            var test1 = r * Math.cos(startTheta);
            var test2 = r * Math.sin(startTheta);
            var test3 = r * Math.cos(endTheta);
            var test4 = r * Math.sin(endTheta);

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
        }
    }

    this.TabSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

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
        }
    }

    this.YinYangSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

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
        }
    }

    this.PieArrowBasePieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.45);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.55);

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.PieArrowSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.45);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.55);

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                     ["L", r * 1.1 * Math.cos(middleTheta) + x, r * 1.1 * Math.sin(middleTheta) + y],
                     ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    this.PieHalfArrowSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = helper.sliceRadius;
        r = r * 0.9;

        startTheta = helper.startTheta;
        middleTheta = helper.middleTheta;
        endTheta = helper.endTheta;

        theta1 = helper.getTheta(helper.startAngle + sliceAngle * 0.45);
        theta2 = helper.getTheta(helper.startAngle + sliceAngle * 0.55);

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                     ["L", r * 1.05 * Math.cos(middleTheta) + x, r * 1.05 * Math.sin(middleTheta) + y],
                     ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        }
    }

    return this;
}



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

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.NullTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {
        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.MoveMiddleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex);
        sliceTransformString = "t" + (rOriginal / 10 * Math.cos(middleTheta)).toString() + "," + (rOriginal / 10 * Math.sin(middleTheta)).toString();

        if (titleRotateAngle != null) {
            baseTheta = getTheta(-titleRotateAngle);
        }
        else {
            baseTheta = getTheta(baseAngle + sliceAngle / 2);
        }

        titleTransformString = "s1,r0,t" + (rOriginal / 10 * Math.cos(baseTheta)).toString() + "," + (rOriginal / 10 * Math.sin(baseTheta)).toString();

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: titleTransformString
        }
    }

    this.RotateTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1,r360";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateHalfTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1,r90";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        titleTransformString = "s1,r360";

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: titleTransformString
        }
    }

    this.ScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1.2";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: "s1.3"
        }
    }

    this.ScaleTitleTransformMini = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: "s1.1"
        }
    }

    this.RotateScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "r360,s1.3";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    return this;
}



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
}

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
}
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
}
