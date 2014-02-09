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

