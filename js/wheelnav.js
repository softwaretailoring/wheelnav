///#source 1 1 /js/source/wheelnav.core.js
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


///#source 1 1 /js/source/wheelnav.navItem.js
//---------------------------------
// Navigation item
//---------------------------------

wheelnavItem = function (wheelnav, title, itemIndex) {

    this.wheelnav = wheelnav;
    this.itemIndex = itemIndex;
    this.title = title;
    this.titleFont = wheelnav.titleFont;
    this.titlePosX = wheelnav.centerX;
    this.titlePosY = wheelnav.centerY;
    this.currentRotate = 0;
    this.currentPercent = wheelnav.currentPercent;

    if (title != null) {
        this.getSlicePath = wheelnav.slicePath;
    }
    else {
        this.title = "";
        this.getSlicePath = slicePath().NullSlice;
    }

    this.getSelectTransform = wheelnav.sliceSelectTransform;
    this.selectTransform = null;

    this.fillAttr = { fill: "#CCC" };

    if (wheelnav.animateeffect == null) { this.animateeffect = "bounce"; }
    else { this.animateeffect = wheelnav.animateeffect; }
    if (wheelnav.animatetime == null) { this.animatetime = 1500; }
    else { this.animatetime = wheelnav.animatetime; }
    
    if (wheelnav.slicePathAttr == null) { this.slicePathAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' }; }
    else { this.slicePathAttr = wheelnav.slicePathAttr; }
    if (wheelnav.sliceHoverAttr == null) { this.sliceHoverAttr = { fill: "#EEE", "stroke-width": 4 }; }
    else { this.sliceHoverAttr = wheelnav.sliceHoverAttr; }
    if (wheelnav.sliceSelectedAttr == null) { this.sliceSelectedAttr = { stroke: "#111", "stroke-width": 4 }; }
    else { this.sliceSelectedAttr = wheelnav.sliceSelectedAttr; }

    if (wheelnav.titleAttr == null) { this.titleAttr = { font: this.titleFont, fill: "#111", stroke: "none", cursor: 'pointer' }; }
    else { this.titleAttr = wheelnav.titleAttr; }
    if (wheelnav.titleHoverAttr == null) { this.titleHoverAttr = { font: this.titleFont, fill: "#111", cursor: 'pointer', stroke: "none" }; }
    else { this.titleHoverAttr = wheelnav.titleHoverAttr; }
    if (wheelnav.titleSelectedAttr == null) { this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF" }; }
    else { this.titleSelectedAttr = wheelnav.titleSelectedAttr; }

    if (wheelnav.linePathAttr == null) { this.linePathAttr = { stroke: "#111", "stroke-width": 2 }; }
    else { this.linePathAttr = wheelnav.linePathAttr; }
    if (wheelnav.lineHoverAttr == null) { this.lineHoverAttr = { stroke: "#111", "stroke-width": 4 }; }
    else { this.lineHoverAttr = wheelnav.lineHoverAttr; }
    if (wheelnav.lineSelectedAttr == null) { this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4 }; }
    else { this.lineSelectedAttr = wheelnav.lineSelectedAttr; }

    return this;
}

wheelnavItem.prototype.createNavItem = function () {

    //Initialize navItem
    var slicePath = this.getSlicePath(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.navWheelSugar, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, this.currentPercent);
    this.titlePosX = slicePath.titlePosX;
    this.titlePosY = slicePath.titlePosY;

    this.selectTransform = this.getSelectTransform(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.navWheelSugar, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex);

    //Create slice
    this.navSlice = this.wheelnav.raphael.path(slicePath.slicePathString);
    this.navSlice.attr(this.slicePathAttr);
    this.navSlice.attr(this.fillAttr);
    this.navSlice.id = this.wheelnav.getSliceId(this.itemIndex);
    this.navSlice.node.id = this.navSlice.id;

    //Create title
    //Title defined by path
    if (this.isPathTitle()) {
        this.titlePath = new wheelnavTitle(this.title, this.wheelnav.raphael.raphael);
        var relativePath = this.getTitlePercentAttr(this.titlePosX, this.titlePosY, this.titlePath).path;
        this.navTitle = this.wheelnav.raphael.path(relativePath).attr(this.titleAttr);
    }
    //Title defined by text
    else {
        this.titlePath = new wheelnavTitle(this.title);
        this.navTitle = this.wheelnav.raphael.text(this.titlePosX, this.titlePosY, this.title).attr(this.titleAttr);
    }

    this.navTitle.id = this.wheelnav.getTitleId(this.itemIndex);
    this.navTitle.node.id = this.navTitle.id;

    var titleRotateString = this.getTitleRotateString();
    this.navTitle.attr({ currentTransform: titleRotateString });
    this.navTitle.attr({ transform: titleRotateString });

    //Create linepath
    this.navLine = this.wheelnav.raphael.path(slicePath.linePathString).attr(this.linePathAttr).toBack();
    this.navLine.id = this.wheelnav.getLineId(this.itemIndex);

    //Create item set
    var currentItem = this.wheelnav.raphael.set();
    currentItem.push(
        this.navSlice,
        this.navTitle
    );

    currentItem.id = this.wheelnav.getItemId(this.itemIndex);

    var thisWheelNav = this.wheelnav;
    var thisNavItem = this;
    var thisItemIndex = this.itemIndex;

    currentItem.click(function () {
        thisWheelNav.navigateWheel(thisItemIndex);
    });
    currentItem.mouseover(function () {
        thisNavItem.hoverEffect(thisItemIndex, true);
    });
    currentItem.mouseout(function () {
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
        }
        else {
            if (i == this.wheelnav.currentClick) {
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
    }
};

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

    if (this.wheelnav.titleRotate) {
        var titleRotate = this.itemIndex * (360 / this.wheelnav.navItemCount) + this.wheelnav.titleRotateAngle;
        return this.getItemRotateString() + ",r," + titleRotate;
    }
    else {
        return this.getItemRotateString() + ",r," + (-this.currentRotate).toString();
    }
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

///#source 1 1 /js/source/wheelnav.slicePath.js
//---------------------------------
// Slice path definitions
//---------------------------------

var slicePath = function () {

    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleSugar = 0;
    this.r = 0;

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        this.r = rOriginal * percent;
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
        this.titleSugar = r * 0.5;
        setTitlePos(x, y);
    }

    var setTitlePos = function (x, y) {
        this.titlePosX = titleSugar * Math.cos(middleTheta) + x;
        this.titlePosY = titleSugar * Math.sin(middleTheta) + y;
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.NullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.PieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.9;
        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.PieSliceSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

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
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.DonutSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = r * 0.95;
        rbase = r * 0.37;

        slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["L", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["A", r, r, 0, 0, 0, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["z"]];

        titleSugar = r * 0.7;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.StarSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        rbase = r * 0.5;

        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];

        titleSugar = r * 0.44;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.StarSliceSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        if (percent > 0.15) {
            rbase = rOriginal * 0.5;
        }
        else
        {
            rbase = r * 0.5;
        }

        slicePathString = [["M", x, y],
                         ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                         ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                         ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                         ["z"]];

        titleSugar = r * 0.44;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.CogSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        rbase = r * 0.95;

        theta1 = getTheta(startAngle + sliceAngle * 0.0625);
        theta2 = getTheta(startAngle + sliceAngle * 0.1875);
        theta3 = getTheta(startAngle + sliceAngle * 0.3125);
        theta4 = getTheta(startAngle + sliceAngle * 0.4375);
        theta5 = getTheta(startAngle + sliceAngle * 0.5625);
        theta6 = getTheta(startAngle + sliceAngle * 0.6875);
        theta7 = getTheta(startAngle + sliceAngle * 0.8125);
        theta8 = getTheta(startAngle + sliceAngle * 0.9375);

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

        titleSugar = r * 0.55;
        setTitlePos(x, y);

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.MenuSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        titleSugar = r * 0.63;
        setTitlePos(x, y);

        var menuSugar = percent * 25;

        if (menuSugar < 15)
        {
            menuSugar = 15;
        }

        slicePathString = [["M", titlePosX, titlePosY],
                    ["m", -menuSugar, 0],
                    ["a", menuSugar, menuSugar, 0, 1, 0, 2 * menuSugar, 0],
                    ["a", menuSugar, menuSugar, 0, 1, 0, -2 * menuSugar, 0],
                    ["z"]];

        lineEndX = (titleSugar - menuSugar) * Math.cos(middleTheta) + x;
        lineEndY = (titleSugar - menuSugar) * Math.sin(middleTheta) + y;

        linePathString = [["M", x, y],
                    ["A", r/2, r/2, 0, 0, 1, lineEndX, lineEndY]];//,
                    //["L", lineEndX, lineEndY],
                    //["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.FlowerSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        rbase = r * 0.65;

        slicePathString = [["M", x, y],
                     ["L", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                     ["A", r/7, r/7, 0, 0, 1, rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.EyeSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        r = r * 0.7;
        titleSugar = r * 0.87;
        setTitlePos(x, y);

        slicePathString = [["M", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                    ["A", r, r, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.WheelSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

        r = r * 0.95;

        slicePathString = [["M", (r * 0.08) * Math.cos(middleTheta) + x, (r * 0.08) * Math.sin(middleTheta) + y],
                     ["L", (r * 0.08) * Math.cos(middleTheta) + (r * 0.82) * Math.cos(startTheta) + x, (r * 0.08) * Math.sin(middleTheta) + (r * 0.82) * Math.sin(startTheta) + y],
                     ["A", (r * 0.82), (r * 0.82), 0, 0, 1, (r * 0.08) * Math.cos(middleTheta) + (r * 0.82) * Math.cos(endTheta) + x, (r * 0.08) * Math.sin(middleTheta) + (r * 0.82) * Math.sin(endTheta) + y],
                     ["z"],
                     ["M", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["A", r, r, 0, 0, 0, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    return this;
}



///#source 1 1 /js/source/wheelnav.sliceSelectTransform.js
//------------------------------------------
// Slice transform definitions for selection
//------------------------------------------

var sliceSelectTransform = function () {

    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.NullTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {
        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.MoveMiddleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex);
        sliceTransformString = "t" + (rOriginal / 10 * Math.cos(middleTheta)).toString() + "," + (rOriginal / 10 * Math.sin(middleTheta)).toString();

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString + ",s1.1"
        }
    }

    this.RotateTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "r360";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateHalfTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "r90";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "s1.3";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: "s1.3"
        }
    }

    this.RotateScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

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
//---------------------------------
// Spreader of wheel
//---------------------------------

spreader = function (wheelnav) {

    this.wheelnav = wheelnav;
    if (this.wheelnav.spreaderEnable) {
        var thisWheelNav = this.wheelnav;

        this.spreaderCircle = thisWheelNav.raphael.circle(thisWheelNav.centerX, thisWheelNav.centerY, thisWheelNav.spreaderSugar).attr(thisWheelNav.spreaderCircleAttr);
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

        if (this.wheelnav.maxPercent > this.wheelnav.maxPercent) {
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
//---------------------------------
// Color palettes for slices
// from http://www.colourlovers.com
//---------------------------------

var colorpalette = {
    defaultpalette: new Array("#2ECC40", "#FFDC00", "#FF851B", "#FF4136", "#0074D9", "#777"),
    purple: new Array("#4F346B", "#623491", "#9657D6", "#AD74E7", "#CBA3F3"),
    greenred: new Array("#17B92A", "#FF3D00", "#17B92A", "#FF3D00", "#17B92A"),
    oceanfive: new Array("#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951"),
    garden: new Array("#648A4F", "#2B2B29", "#DF6126", "#FFA337", "#F57C85"),
    gamebookers: new Array("#FF9900", "#E9E9E9", "#BCBCBC", "#3299BB", "#424242"),
    parrot: new Array("#D80351", "#F5D908", "#00A3EE", "#929292", "#3F3F3F")
}
///#source 1 1 /js/source/wheelnav.customAttributes.js
//---------------------------------
// Raphael.js custom attributes
//---------------------------------

function setRaphaelCustomAttributes(raphael) {

    raphael.customAttributes.slicePathFunction = function (pathFunction) {
        return {
            slicePathFunction: pathFunction
        };
    };

    raphael.customAttributes.titlePercentFunction = function (titleFunction) {
        return {
            titlePercentFunction: titleFunction
        };
    };

    raphael.customAttributes.currentTransform = function (tranformString) {
        return {
            currentTransform: tranformString
        };
    };

    raphael.customAttributes.currentTitle = function (titleString) {
        return {
            currentTitle: titleString
        };
    };

    raphael.customAttributes.slicePercentPath = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var currentTransform = this.attr("currentTransform");

        var pathString = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent).slicePathString;
        var pathAttr = {
            path: pathString,
            transform: currentTransform
        };

        return pathAttr;
    }

    raphael.customAttributes.linePercentPath = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var currentTransform = this.attr("currentTransform");

        var pathString = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent).linePathString;
        var pathAttr = {
            path: pathString,
            transform: currentTransform
        };

        return pathAttr;
    }

    raphael.customAttributes.titlePercentPos = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var titlePercentFunction = this.attr("titlePercentFunction");
        var currentTransform = this.attr("currentTransform");
        var currentTitle = this.attr("currentTitle");

        var navItem = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent);

        percentAttr = titlePercentFunction(navItem.titlePosX, navItem.titlePosY, currentTitle);

        if (percent < 0.3) currentTransform += ",s" + percent * (1 / 0.3);

        var transformAttr = {};

        if (this.type == "path") {
            transformAttr = {
                path: percentAttr.path,
                transform: currentTransform
            }
        }
        else {
            transformAttr = {
                x: percentAttr.x,
                y: percentAttr.y,
                transform: currentTransform
            }
        }

        return transformAttr;
    };
}

