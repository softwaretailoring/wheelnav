///#source 1 1 /js/source/wheelnav.core.js
/* ======================================================================================= */
/*                                   wheelnav.js - v0.77                                   */
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
    this.baseAngle = 0;
    this.sliceAngle = 0;

    this.colors = colorpalette.defaultpalette;
    this.animateeffect = "bounce";
    this.animatetime = 1500;

    this.navItemCount = 0;
    this.navItems = new Array();
    this.slicePath = slicePath().defaultPie;

    this.showBaseLine = false;

    return this;
}

wheelnavItem = function (slicePathFunction, title) {

    this.animateeffect = "bounce";
    this.animatetime = 1500;
    this.fillColor = "#CCC";

    this.slicePathString = "";
    this.slicePathAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' };
    this.sliceHoverAttr = { fill: "#EEE" };

    this.title = title;
    this.titleAttr = { font: '100 24px Impact, Charcoal, sans-serif', fill: "#111", cursor: 'pointer', stroke: "none" };
    this.titleSelectedAttr = { font: '100 24px Impact, Charcoal, sans-serif', fill: "#FFF", cursor: 'pointer' };
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleSugar = 100;

    this.titleBaseLineAttr = { stroke: "#111", "stroke-width": 2 };

    this.getSlicePath = slicePathFunction;

    return this;
}

wheelnav.prototype.initNavItems = function (titles) {

    //Init slices and titles
    if (this.navItemCount == 0) {

        if (titles == null && !Array.isArray(titles)) {
            titles = new Array("title-0", "title-1", "title-2", "title-3");
        }

        for (i = 0; i < titles.length; i++) {
            var navItem = new wheelnavItem(this.slicePath, titles[i]);
            this.navItems.push(navItem);
        }
    }
    else {
        for (i = 0; i < this.navItemCount; i++) {
            var navItem = new wheelnavItem(this.slicePath, "");
            this.navItems.push(navItem);
        }
    }

    //Init colors
    var colorIndex = 0;
    for (i = 0; i < this.navItems.length; i++) {
        this.navItems[i].fillColor = this.colors[colorIndex];
        colorIndex++;
        if (colorIndex == this.colors.length) { colorIndex = 0;}
    }
};

wheelnav.prototype.initWheel = function (titles) {

    if (this.navItems.length == 0) {
        this.initNavItems(titles);
    }

    this.navItemCount = this.navItems.length;
    this.sliceAngle = 360 / this.navItemCount;

    if (this.baseAngle == 0) {
        this.baseAngle = -(360 / this.navItemCount) / 2;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.createNavItem(i);
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
wheelnav.prototype.getTitleBaseLineId = function (index) {
    return "wheelnav-" + this.holderId + "-titlebaseline-" + index;
};
wheelnav.prototype.getTitleAlongLineId = function (index) {
    return "wheelnav-" + this.holderId + "-titlealongline-" + index;
};

wheelnav.prototype.createNavItem = function (itemIndex) {

    var navItem = this.navItems[itemIndex];

    //Initialize navItem
    var slicePath = navItem.getSlicePath(this, itemIndex);
    navItem.slicePathString = slicePath.slicePathString;
    navItem.titlePosX = slicePath.titlePosX;
    navItem.titlePosY = slicePath.titlePosY;
    navItem.titleSugar = slicePath.titleSugar;

    //Create slice
    var currentSlice = this.raphael.path(navItem.slicePathString);
    currentSlice.attr(navItem.slicePathAttr);
    currentSlice.attr({ fill: navItem.fillColor });
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
        var pathCx = this.centerX + (startX - pathBBox.cx);
        var pathCy = this.centerY + (startY - pathBBox.cy);
        relativePath[0] = "M," + pathCx + "," + pathCy;

        currentTitle = this.raphael.path(relativePath).attr(navItem.titleAttr);
    }
    //Title defined by text
    else {
        currentTitle = this.raphael.text(this.centerX, this.centerY, navItem.title).attr(navItem.titleAttr);
    }

    currentTitle.id = this.getTitleId(itemIndex);
    currentTitle.node.id = currentTitle.id;
    this.raphael.getById(this.getTitleId(0)).attr(navItem.titleSelectedAttr);

    //Create baseline of title
    var pathString = "M " + this.centerX + " " + this.centerY + " L " + navItem.titlePosX + " " + navItem.titlePosY + " ";
    var titleBaseLine = this.raphael.path(pathString).attr(navItem.titleBaseLineAttr).toBack();
    titleBaseLine.id = this.getTitleBaseLineId(itemIndex);
    if (!this.showBaseLine) { titleBaseLine.hide(); }

    //Create alongline of title
    var titleAlong = this.raphael.path(pathString).hide();
    titleAlong.id = this.getTitleAlongLineId(itemIndex);
    currentTitle.attr({ alongPath: titleBaseLine, along: [0, this.centerX, this.centerY] }).animate({ along: [1, this.centerX, this.centerY] }, navItem.animatetime, navItem.animateeffect);

    //Create item set
    var currentItem = this.raphael.set();
    currentItem.push(
        currentSlice,
        currentTitle
    );

    currentItem.id = this.getItemId(itemIndex);

    var thisWheelNav = this;

    currentItem.click(function () {
        thisWheelNav.navigateWheel(itemIndex);
    });
    currentItem.mouseover(function () {
        thisWheelNav.hoverEffect(itemIndex, true);
    });
    currentItem.mouseout(function () {
        thisWheelNav.hoverEffect(itemIndex, false);
    });
};

wheelnav.prototype.navigateWheel = function (clicked) {

    this.currentRotate -= (clicked - this.currentClick) * (360 / this.navItemCount);
    for (i = 0; i < this.navItemCount; i++) {

        var navItem = this.navItems[i];

        //Rotate slice
        var rotateString = "r" + this.currentRotate + "," + this.centerX + "," + this.centerY;

        var navSlice = this.raphael.getById(this.getSliceId(i));
        navSlice.animate({ transform: [rotateString] }, navItem.animatetime, navItem.animateeffect);
        if (i == clicked) { navSlice.toFront(); }

        //Rotate baseLine
        var titleBaseLine = this.raphael.getById(this.getTitleBaseLineId(i));
        titleBaseLine.animate({ transform: [rotateString] }, navItem.animatetime, navItem.animateeffect);

        //Transform title
        var currentPos = i - this.currentClick;
        var nextPos = i - clicked;
        var pathIndex = currentPos;
        if (pathIndex < 0) { pathIndex += this.navItemCount; }
        var pathString = "M " + this.navItems[pathIndex].titlePosX + " " + this.navItems[pathIndex].titlePosY + " ";

        if (currentPos > nextPos) {
            for (m = currentPos - 1; m >= nextPos; m--) {
                pathIndex--;
                if (pathIndex < 0) { pathIndex += this.navItemCount; }
                pathString += "A" + this.navItems[pathIndex].titleSugar + "," + this.navItems[pathIndex].titleSugar + " " + 0 + " " + 0 + "," + 0 + " " + this.navItems[pathIndex].titlePosX + "," + this.navItems[pathIndex].titlePosY;
            }
        }
        else if (currentPos < nextPos) {
            for (m = currentPos + 1; m <= nextPos; m++) {
                pathIndex++;
                if (pathIndex > this.navItemCount - 1) { pathIndex -= this.navItemCount; }
                pathString += "A" + this.navItems[pathIndex].titleSugar + "," + this.navItems[pathIndex].titleSugar + " " + 0 + " " + 0 + "," + 1 + " " + this.navItems[pathIndex].titlePosX + "," + this.navItems[pathIndex].titlePosY;
            }
        }

        var navTitle = this.raphael.getById(this.getTitleId(i));
        var titleAlong = this.raphael.getById(this.getTitleAlongLineId(i));

        if (this.currentClick != clicked) {
            titleAlong.attr({ path: pathString });
            navTitle.attr(navItem.titleAttr);
            navTitle.attr({ alongPath: titleAlong, along: [0, this.centerX, this.centerY] }).animate({ along: [1, this.centerX, this.centerY] }, navItem.animatetime, navItem.animateeffect);
        }

        navTitle.toFront();
    }

    this.raphael.getById(this.getSliceId(clicked)).attr({ fill: this.navItems[clicked].fillColor });
    this.raphael.getById(this.getTitleId(clicked)).attr(this.navItems[clicked].titleSelectedAttr);
    this.currentClick = clicked;
};

wheelnav.prototype.hoverEffect = function (clicked, isEnter) {

    for (i = 0; i < this.navItemCount; i++) {
        var navSlice = this.raphael.getById(this.getSliceId(i));

        if (isEnter && i == clicked && i != this.currentClick) {
            navSlice.attr(this.navItems[i].sliceHoverAttr);
        }
        else {
            navSlice.attr(this.navItems[i].slicePathAttr);
            navSlice.attr({ fill: this.navItems[i].fillColor });
        }
    }
};


///#source 1 1 /js/source/wheelnav.slicepath.js
//---------------------------------
// Slice path definitions
//---------------------------------

var slicePath = function () {

    this.x = 0;
    this.y = 0;
    this.r = 1;
    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;
    this.titlePosX = 0;
    this.titlePosY = 0;
    this.titleSugar = 100;

    var setBaseValue = function (wheelnav, itemIndex) {
            this.x = wheelnav.centerX;
            this.y = wheelnav.centerY;
            this.r = wheelnav.navWheelSugar * 0.95;
            this.startAngle = (itemIndex * wheelnav.sliceAngle) + wheelnav.baseAngle;
            this.startTheta = getTheta(startAngle);
            this.middleTheta = getTheta(startAngle + wheelnav.sliceAngle / 2);
            this.endTheta = getTheta(startAngle + wheelnav.sliceAngle);
            this.titleSugar = wheelnav.navWheelSugar * 0.5;
            setTitlePos();
    }

    var setTitlePos = function () {
        this.titlePosX = this.titleSugar * Math.cos(this.middleTheta) + this.x;
        this.titlePosY = this.titleSugar * Math.sin(this.middleTheta) + this.y;
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.nullSlice = function (wheelnav, itemIndex) {
        setBaseValue(wheelnav, itemIndex);
        return {
            slicePathString: "",
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultPie = function (wheelnav, itemIndex) {
       
        setBaseValue(wheelnav, itemIndex);
        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultStar = function (wheelnav, itemIndex) {

        setBaseValue(wheelnav, itemIndex);
        rbase = r * 0.5;

        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];

        titleSugar = wheelnav.navWheelSugar * 0.44;
        setTitlePos();

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultCog = function (wheelnav, itemIndex) {

        setBaseValue(wheelnav, itemIndex);
        rbase = r * 0.9;

        theta1 = getTheta(startAngle + wheelnav.sliceAngle * 0.0625);
        theta2 = getTheta(startAngle + wheelnav.sliceAngle * 0.1875);
        theta3 = getTheta(startAngle + wheelnav.sliceAngle * 0.3125);
        theta4 = getTheta(startAngle + wheelnav.sliceAngle * 0.4375);
        theta5 = getTheta(startAngle + wheelnav.sliceAngle * 0.5625);
        theta6 = getTheta(startAngle + wheelnav.sliceAngle * 0.6875);
        theta7 = getTheta(startAngle + wheelnav.sliceAngle * 0.8125);
        theta8 = getTheta(startAngle + wheelnav.sliceAngle * 0.9375);

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

        titleSugar = wheelnav.navWheelSugar * 0.55;
        setTitlePos();

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
        }
    }

    this.defaultMenu = function (wheelnav, itemIndex) {

        setBaseValue(wheelnav, itemIndex);

        titleSugar = wheelnav.navWheelSugar * 0.63;
        setTitlePos();

        slicePathString = [["M", titlePosX, titlePosY],
                    ["m", -25, 0],
                    ["a", 25, 25, 0, 1, 0, 50, 0],
                    ["a", 25, 25, 0, 1, 0, -50, 0],
                    ["z"]];

        return {
            slicePathString: slicePathString,
            titlePosX: titlePosX,
            titlePosY: titlePosY,
            titleSugar: titleSugar
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
    raphael.customAttributes.alongPath = function (pathString) {
        return {
            alongPath: pathString
        };
    };

    raphael.customAttributes.along = function (percent, centerX, centerY) {
        var alongPath = this.attr("alongPath");
        var pathLenght = alongPath.getTotalLength();
        var point = alongPath.getPointAtLength(percent * pathLenght);

        var transformString = {
            transform: "t" + (point.x - centerX).toString() + " " + (point.y - centerY).toString()
            }

        return transformString;
    };
}

