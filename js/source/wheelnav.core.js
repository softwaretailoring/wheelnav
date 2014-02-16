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
    this.baseAngle = 0;
    this.sliceAngle = 0;
    this.titleRotate = false;
    
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

    this.getSlicePath = wheelnav.slicePath;

    this.title = title;
    this.titlePosX = wheelnav.centerX;
    this.titlePosY = wheelnav.centerY;

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

    if (this.baseAngle == 0) {
        this.baseAngle = -(360 / this.navItemCount) / 2;
    }

    for (i = 0; i < this.navItemCount; i++) {
        this.createNavItem(i);
    }

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
    this.raphael.getById(this.getTitleId(0)).attr(navItem.titleSelectedAttr);

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
        thisWheelNav.rotateWheel(itemIndex);
    });
    currentItem.mouseover(function () {
        thisWheelNav.hoverEffect(itemIndex, true);
    });
    currentItem.mouseout(function () {
        thisWheelNav.hoverEffect(itemIndex, false);
    });
};

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

        this.raphael.getById(this.getTitleId(i)).attr(this.navItems[i].titleAttr);
        navTitle.toFront();
    }

    this.raphael.getById(this.getSliceId(clicked)).attr({ fill: this.navItems[clicked].fillColor });
    this.raphael.getById(this.getTitleId(clicked)).attr(this.navItems[clicked].titleSelectedAttr);
    this.currentClick = clicked;
};

wheelnav.prototype.spreadWheel = function (startPercent, endPercent) {

    for (i = 0; i < this.navItemCount; i++) {

        var thisWheelNav = this;
        var navItem = this.navItems[i];
        var currentPos = i - this.currentClick;
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

