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
    this.sliceAngle = 90;

    this.colors = colorpalette.defaultpalette;
    this.hovercolor = "#EEE";
    this.animateeffect = "bounce";
    this.animatetime = 1500;

    this.navItemCount = 0;
    this.slices = new Array();
    this.slicePath = slicePath().fullPie;

    return this;
}

wheelnavSlice = function (slicePath) {
    this.hovercolor = "#EEE";
    this.animateeffect = "bounce";
    this.animatetime = 1500;
    this.getSlicePath = slicePath;
    return this;
}

wheelnav.prototype.initWheel = function (titles) {

    if (titles == null && !Array.isArray(titles)) {
        titles = new Array("title1", "title2", "title3", "title4");
    }

    var slice = new wheelnavSlice(this.slicePath);
    for (i = 0; i < titles.length; i++) {
        this.navItemCount++;
        this.slices.push(slice);
    }

    this.baseAngle = -(360 / this.navItemCount) / 2;
    this.sliceAngle = 360 / this.navItemCount;

    var startAngle = 0;
    for (i = 0; i < this.navItemCount; i++) {
        setWheelSlice(this, i, startAngle);
        setWheelTitle(this, i, titles[i]);
        startAngle += this.sliceAngle;
    }

    return this;
}

wheelnav.prototype.getSliceId = function (index) {
    return this.holderId + "-slice-" + index;
}
wheelnav.prototype.getTitleId = function (index) {
    return this.holderId + "-title-" + index;
}

var setWheelSlice = function (wheelnav, itemIndex, startAngle) {

    var currentSlice = wheelnav.slices[itemIndex].getSlicePath(wheelnav, itemIndex, startAngle);

    currentSlice.id = wheelnav.getSliceId(itemIndex);
    currentSlice.node.id = currentSlice.id;

    currentSlice.click(function () {
        navigateWheel(wheelnav, itemIndex);
    });
    currentSlice.mouseover(function () {
        hoverEffect(wheelnav, itemIndex, true);
    });
    currentSlice.mouseout(function () {
        hoverEffect(wheelnav, itemIndex, false);
    });
}

var setWheelTitle = function (wheelnav, itemIndex, navtitle) {

    var currentTitle;

    //Title defined by path
    if (navtitle.substr(0, 1) == "M" &&
        navtitle.substr(navtitle.length - 1, 1) == "z") {
        
        var relativePath = wheelnav.raphael.raphael.pathToRelative(navtitle);
        var startX = relativePath[0][1];
        var startY = relativePath[0][2];

        var pathBBox = wheelnav.raphael.raphael.pathBBox(relativePath);
        var pathCx = wheelnav.navWheelSugar + (startX - pathBBox.cx);
        var pathCy = wheelnav.navWheelSugar + (startY - pathBBox.cy);

        relativePath[0] = "M," + pathCx + "," + pathCy;
        currentTitle = wheelnav.raphael.path(relativePath).attr({ fill: "#000", stroke: "none", transform: "s2" });
    }
    //Title defined by text
    else {
        currentTitle = wheelnav.raphael.text(0, 0, navtitle);
        currentTitle.attr({ font: '100 24px Impact, Charcoal, sans-serif', fill: "#111" });
    }

    currentTitle.id = wheelnav.getTitleId(itemIndex);
    currentTitle.node.id = currentTitle.id;

    currentTitle.mousedown(function () {
        navigateWheel(wheelnav, itemIndex);
    });
    currentTitle.mouseover(function () {
        hoverEffect(wheelnav, itemIndex, true);
    });
    currentTitle.mouseout(function () {
        hoverEffect(wheelnav, itemIndex, false);
    });

    var containerPath = wheelnav.raphael.getById(wheelnav.getSliceId(itemIndex));
    var pathString = "M " + wheelnav.centerX + " " + wheelnav.centerY + " ";
    pathString += "L " + containerPath.getBBox().cx + " " + containerPath.getBBox().cy + " ";

    var titleAlong = wheelnav.raphael.path(pathString).hide();
    titleAlong.id = "titleAlong" + itemIndex;
    currentTitle.attr({ x: wheelnav.navWheelSugar, y: wheelnav.navWheelSugar });
    currentTitle.attr({ guide: titleAlong, along: [0, wheelnav.navWheelSugar], cursor: 'pointer' }).animate({ along: [1, wheelnav.navWheelSugar] }, wheelnav.animatetime, wheelnav.animateeffect);
}

var hoverEffect = function (wheelnav, clicked, isEnter) {

    for (i = 0; i < wheelnav.navItemCount; i++) {
        var navSlice = wheelnav.raphael.getById(wheelnav.getSliceId(i));

        if (isEnter && i == clicked && i != wheelnav.currentClick) {
            navSlice.attr({ fill: wheelnav.hovercolor });
        }
        else {
            navSlice.attr({ fill: wheelnav.colors[i] });
        }
    }
}

var navigateWheel = function (wheelnav, clicked) {

    wheelnav.currentRotate -= (clicked - wheelnav.currentClick) * (360 / wheelnav.navItemCount);

    for (i = 0; i < wheelnav.navItemCount; i++) {

        //Rotate slice
        var rotateString = "r" + wheelnav.currentRotate + "," + wheelnav.centerX + "," + wheelnav.centerY + "s1";
        var navSlice = wheelnav.raphael.getById(wheelnav.getSliceId(i));
        navSlice.animate({ transform: [rotateString] }, wheelnav.slices[i].animatetime, wheelnav.slices[i].animateeffect);
        if (i == clicked) { navSlice.toFront(); }

        //Transform title
        var currentPos = i - wheelnav.currentClick;
        var nextPos = i - clicked;
        var pathIndex = i;
        var containerPathOld = wheelnav.raphael.getById(wheelnav.getSliceId(i));
        var pathString = "M " + containerPathOld.getBBox().cx + " " + containerPathOld.getBBox().cy + " ";

        var getPathString = function (index) {
            var containerPath = wheelnav.raphael.getById(wheelnav.getSliceId(index));
            return "L " + containerPath.getBBox().cx + " " + containerPath.getBBox().cy + " ";
        }

        if (currentPos > nextPos) {
            for (m = currentPos - 1; m >= nextPos; m--) {
                pathIndex--;
                if (pathIndex < 0) { pathIndex += wheelnav.navItemCount; }
                pathString += getPathString(pathIndex);
            }
        }
        else if (currentPos < nextPos) {
            for (m = currentPos + 1; m <= nextPos; m++) {
                pathIndex++;
                if (pathIndex > wheelnav.navItemCount - 1) { pathIndex -= wheelnav.navItemCount; }
                pathString += getPathString(pathIndex);
            }
        }

        var navTitle = wheelnav.raphael.getById(wheelnav.getTitleId(i));
        var titleAlong = wheelnav.raphael.getById("titleAlong" + i);
        
        if (wheelnav.currentClick != clicked) {
            titleAlong.attr({ path: pathString });
            navTitle.attr({ fill: "#111" });
            navTitle.attr({ guide: titleAlong, along: [0, wheelnav.navWheelSugar] }).animate({ along: [1, wheelnav.navWheelSugar] }, wheelnav.animatetime, wheelnav.animateeffect);
        }

        navTitle.toFront();
    }

    wheelnav.raphael.getById(wheelnav.getSliceId(clicked)).attr({ fill: wheelnav.colors[clicked] });
    wheelnav.raphael.getById(wheelnav.getTitleId(clicked)).attr({ fill: "#FFF" });
    wheelnav.currentClick = clicked;
};