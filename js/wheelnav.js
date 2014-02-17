///#source 1 1 /js/source/wheelnav.core.js
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
    this.navWheelSugar = 0.95 * canvasWidth / 2;
    this.baseAngle = null;
    this.sliceAngle = 0;
    this.titleRotate = false;
    this.clickModeRotate = true;
    this.clickModeSpreadOff = false;
    
    this.navItemCount = 0;
    this.navItems = new Array();
    this.colors = colorpalette.defaultpalette;
    this.slicePath = slicePath().defaultPie;

    //NavItem settings. If it remains null, use default settings.
    this.animateeffect = null;
    this.animatetime = null;
    this.slicePathAttr = null;
    this.sliceHoverAttr = null;
    this.linePathAttr = null;
    this.titleAttr = null;
    this.titleSelectedAttr = null;

    //Spreader settings
    this.spreaderEnable = false;
    this.spreaderSugar = 15;
    this.spreaderCircleAttr = { fill: "#777", "stroke-width": 3 };
    this.spreaderOnAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
    this.spreaderOffAttr = { font: '100 32px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };

    return this;
}

wheelnavItem = function (wheelnav, title) {

    this.title = title;
    this.titlePosX = wheelnav.centerX;
    this.titlePosY = wheelnav.centerY;

    if (title != null) {
        this.getSlicePath = wheelnav.slicePath;
    }
    else {
        this.title = "";
        this.getSlicePath = slicePath().nullSlice;
    }

    this.fillAttr = { fill: "#CCC" };

    if (wheelnav.animateeffect == null) { this.animateeffect = "bounce"; }
    else { this.animateeffect = wheelnav.animateeffect; }
    if (wheelnav.animatetime == null) { this.animatetime = 1500; }
    else { this.animatetime = wheelnav.animatetime; }
    
    if (wheelnav.slicePathAttr == null) { this.slicePathAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' }; }
    else { this.slicePathAttr = wheelnav.slicePathAttr; }
    if (wheelnav.sliceHoverAttr == null) { this.sliceHoverAttr = { fill: "#EEE" }; }
    else { this.sliceHoverAttr = wheelnav.sliceHoverAttr; }
    
    if (wheelnav.linePathAttr == null) { this.linePathAttr = { stroke: "#111", "stroke-width": 2 }; }
    else { this.linePathAttr = wheelnav.linePathAttr; }

    if (wheelnav.titleAttr == null) { this.titleAttr = { font: '100 24px Impact, Charcoal, sans-serif', fill: "#111", cursor: 'pointer', stroke: "none" }; }
    else { this.titleAttr = wheelnav.titleAttr; }
    if (wheelnav.titleSelectedAttr == null) { this.titleSelectedAttr = { font: '100 24px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' }; }
    else { this.titleSelectedAttr = wheelnav.titleSelectedAttr; }

    return this;
}

wheelnav.prototype.initWheel = function (titles) {

    //Init slices and titles
    if (this.navItemCount == 0) {

        if (titles == null && !Array.isArray(titles)) {
            titles = new Array("title-0", "title-1", "title-2", "title-3");
        }

        for (i = 0; i < titles.length; i++) {
            var navItem = new wheelnavItem(this, titles[i]);
            this.navItems.push(navItem);
        }
    }
    else {
        for (i = 0; i < this.navItemCount; i++) {
            var navItem = new wheelnavItem(this, "");
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
        this.createNavItem(i);
    }

    this.raphael.getById(this.getTitleId(0)).attr(this.navItems[0].titleSelectedAttr);

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

wheelnav.prototype.createNavItem = function (itemIndex) {

    var navItem = this.navItems[itemIndex];

    //Initialize navItem
    var slicePath = navItem.getSlicePath(this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, itemIndex, 1);
    navItem.titlePosX = slicePath.titlePosX;
    navItem.titlePosY = slicePath.titlePosY;

    //Create slice
    var currentSlice = this.raphael.path(slicePath.slicePathString);
    currentSlice.attr(navItem.slicePathAttr);
    currentSlice.attr(navItem.fillAttr);
    currentSlice.id = this.getSliceId(itemIndex);
    currentSlice.node.id = currentSlice.id;

    //Create title
    var currentTitle;
    //Title defined by path
    if (navItem.title.substr(0, 1) == "M" &&
        navItem.title.substr(navItem.title.length - 1, 1) == "z") {

        //Calculate reletive path
        var relativePath = this.raphael.raphael.pathToRelative(navItem.title);
        var startX = relativePath[0][1];
        var startY = relativePath[0][2];
        var pathBBox = this.raphael.raphael.pathBBox(relativePath);
        var pathCx = navItem.titlePosX + (startX - pathBBox.cx);
        var pathCy = navItem.titlePosY + (startY - pathBBox.cy);
        relativePath[0] = "M," + pathCx + "," + pathCy;

        currentTitle = this.raphael.path(relativePath).attr(navItem.titleAttr);
    }
    //Title defined by text
    else {
        currentTitle = this.raphael.text(navItem.titlePosX, navItem.titlePosY, navItem.title).attr(navItem.titleAttr);
    }

    currentTitle.id = this.getTitleId(itemIndex);
    currentTitle.node.id = currentTitle.id;

    //Create linepath
    var titleBaseLine = this.raphael.path(slicePath.linePathString).attr(navItem.linePathAttr).toBack();
    titleBaseLine.id = this.getTitleBaseLineId(itemIndex);

    var titleRotateString = this.getTitleRotateString(itemIndex);
    currentTitle.attr({ currentTransform: titleRotateString });
    currentTitle.attr({ transform: titleRotateString });
    
    //Create item set
    var currentItem = this.raphael.set();
    currentItem.push(
        currentSlice,
        currentTitle
    );

    currentItem.id = this.getItemId(itemIndex);

    var thisWheelNav = this;

    currentItem.click(function () {

        if (thisWheelNav.clickModeRotate) {
            thisWheelNav.rotateWheel(itemIndex);
        }

        thisWheelNav.setAttrs(itemIndex);

        if (thisWheelNav.clickModeSpreadOff) {
            thisWheelNav.spreadWheel(1,0);
        }
    });
    currentItem.mouseover(function () {
        thisWheelNav.hoverEffect(itemIndex, true);
    });
    currentItem.mouseout(function () {
        thisWheelNav.hoverEffect(itemIndex, false);
    });
};

wheelnav.prototype.setAttrs = function (clicked) {
    for (i = 0; i < this.navItemCount; i++) {
        this.raphael.getById(this.getTitleId(i)).attr(this.navItems[i].titleAttr);
    }

    this.raphael.getById(this.getSliceId(clicked)).attr(this.navItems[clicked].fillAttr);
    this.raphael.getById(this.getTitleId(clicked)).attr(this.navItems[clicked].titleSelectedAttr);
    this.currentClick = clicked;
}

wheelnav.prototype.rotateWheel = function (clicked) {

    this.currentRotate -= (clicked - this.currentClick) * (360 / this.navItemCount);
    for (i = 0; i < this.navItemCount; i++) {

        var navItem = this.navItems[i];

        //Rotate slice
        var itemRotateString = "r," + this.currentRotate + "," + this.centerX + "," + this.centerY;

        var navSlice = this.raphael.getById(this.getSliceId(i));
        navSlice.animate({ transform: [itemRotateString] }, navItem.animatetime, navItem.animateeffect);
        //if (i == clicked) { navSlice.toFront(); }

        //Rotate baseLine
        var titleBaseLine = this.raphael.getById(this.getTitleBaseLineId(i));
        titleBaseLine.animate({ transform: [itemRotateString] }, navItem.animatetime, navItem.animateeffect);

        //Rotate title
        var navTitle = this.raphael.getById(this.getTitleId(i));
        var titleRotateString = this.getTitleRotateString(i);
        navTitle.attr({ currentTransform: titleRotateString });
        navTitle.animate({ transform: [titleRotateString] }, navItem.animatetime, navItem.animateeffect);
    }
};

wheelnav.prototype.spreadWheel = function (startPercent, endPercent) {

    for (i = 0; i < this.navItemCount; i++) {

        var thisWheelNav = this;
        var navItem = this.navItems[i];
        var currentPos = i;
        if (this.clickModeRotate) { currentPos = i - this.currentClick; }
        if (currentPos < 0) { currentPos += this.navItemCount; }

        var navSlice = this.raphael.getById(this.getSliceId(i));
        navSlice.attr({ slicePathFunction: navItem.getSlicePath });
        navSlice.attr({ slicePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] }).animate({ slicePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect);

        var titleBaseLine = this.raphael.getById(this.getTitleBaseLineId(i));
        titleBaseLine.attr({ slicePathFunction: navItem.getSlicePath });
        titleBaseLine.attr({ linePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, startPercent] }).animate({ linePercentPath: [this.centerX, this.centerY, this.navWheelSugar, this.baseAngle, this.sliceAngle, i, endPercent] }, navItem.animatetime, navItem.animateeffect);

        var navTitle = this.raphael.getById(this.getTitleId(i));
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

wheelnav.prototype.getTitleRotateString = function (itemIndex) {
    var itemRotateString = "r," + this.currentRotate + "," + this.centerX + "," + this.centerY;
    var titleRotateString = itemRotateString + ",r" + (-this.currentRotate).toString();

    if (this.titleRotate) {
        var titleRotate = itemIndex * (360 / this.navItemCount);
        titleRotateString = itemRotateString + ",r" + titleRotate;
    }

    return titleRotateString;
}

wheelnav.prototype.hoverEffect = function (clicked, isEnter) {

    for (i = 0; i < this.navItemCount; i++) {
        var navSlice = this.raphael.getById(this.getSliceId(i));

        if (isEnter && i == clicked && i != this.currentClick) {
            navSlice.attr(this.navItems[i].sliceHoverAttr);
        }
        else {
            navSlice.attr(this.navItems[i].slicePathAttr);
            navSlice.attr(this.navItems[i].fillAttr);
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
wheelnav.prototype.getTitleBaseLineId = function (index) {
    return "wheelnav-" + this.holderId + "-titlebaseline-" + index;
};
wheelnav.prototype.getTitleBaseLineHideId = function (index) {
    return "wheelnav-" + this.holderId + "-titlebaselinehide-" + index;
};
wheelnav.prototype.getSpreadOnId = function () {
    return "wheelnav-" + this.holderId + "-spreadon";
};
wheelnav.prototype.getSpreadOffId = function () {
    return "wheelnav-" + this.holderId + "-spreadoff";
};


///#source 1 1 /js/source/wheelnav.slicepath.js
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

    this.nullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    this.defaultPie = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);
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

    this.defaultDonut = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent);

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

    this.defaultStar = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

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

    this.defaultStarSpread = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

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

    this.defaultCog = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

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

    this.defaultMenu = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent) {

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
                    ["L", lineEndX, lineEndY],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: linePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY
        }
    }

    return this;
}



///#source 1 1 /js/source/wheelnav.colorpalettes.js
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
///#source 1 1 /js/source/wheelnav.customattributes.js
//---------------------------------
// Raphael.js custom attributes
//---------------------------------

function setRaphaelCustomAttributes(raphael) {

    raphael.customAttributes.slicePathFunction = function (pathFunction) {
        return {
            slicePathFunction: pathFunction
        };
    };

    raphael.customAttributes.currentTransform = function (tranformString) {
        return {
            currentTransform: tranformString
        };
    };

    raphael.customAttributes.slicePercentPath = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");

        var pathString = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent).slicePathString;
        var pathAttr = {
            path: pathString
        };

        return pathAttr;
    }

    raphael.customAttributes.linePercentPath = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");

        var pathString = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent).linePathString;
        var pathAttr = {
            path: pathString
        };

        return pathAttr;
    }

    raphael.customAttributes.titlePercentPos = function (centerX, centerY, sliceR, baseAngle, sliceAngle, currentPosX, currentPosY, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var currentTransform = this.attr("currentTransform");

        var navItem = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent);
        var transformString = "t,-" + currentPosX + ",-" + currentPosY;
        transformString += ",t," + navItem.titlePosX + "," + navItem.titlePosY + currentTransform;
        var transformAttr = {
            transform: transformString
        }

        return transformAttr;
    };
}

