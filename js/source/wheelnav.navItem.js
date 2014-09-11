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
    if (wheelnav.titleSpreadScale === null) { this.titleSpreadScale = false; }
    else { this.titleSpreadScale = wheelnav.titleSpreadScale; }
    this.currentRotateAngle = 0;
    this.minPercent = wheelnav.minPercent;
    this.maxPercent = wheelnav.maxPercent;
    this.hoverPercent = wheelnav.hoverPercent;
    this.selectedPercent = wheelnav.selectedPercent;

    this.slicePathCustom = wheelnav.slicePathCustom;
    this.sliceSelectedPathCustom = wheelnav.sliceSelectedPathCustom;
    this.sliceHoverPathCustom = wheelnav.sliceHoverPathCustom;

    this.sliceTransformCustom = wheelnav.sliceTransformCustom; 
    this.sliceSelectedTransformCustom = wheelnav.sliceSelectedTransformCustom;
    this.sliceHoverTransformCustom = wheelnav.sliceHoverTransformCustom;

    if (wheelnav.sliceAngle === null) { this.sliceAngle = 360 / wheelnav.navItemCount; }
    else { this.sliceAngle = wheelnav.sliceAngle;}

    if (title !== null) {
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

    if (wheelnav.animateeffect === null) { this.animateeffect = "bounce"; }
    else { this.animateeffect = wheelnav.animateeffect; }
    if (wheelnav.animatetime === null) { this.animatetime = 1500; }
    else { this.animatetime = wheelnav.animatetime; }

    if (wheelnav.slicePathAttr === null) { this.slicePathAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' }; }
    else { this.slicePathAttr = wheelnav.slicePathAttr; }
    if (wheelnav.sliceHoverAttr === null) { this.sliceHoverAttr = { stroke: "#111", "stroke-width": 4, cursor: 'pointer' }; }
    else { this.sliceHoverAttr = wheelnav.sliceHoverAttr; }
    if (wheelnav.sliceSelectedAttr === null) {
        if (this.wheelnav.multiSelect) {
            this.sliceSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'pointer' };
        }
        else {
            this.sliceSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'default' };
        }
    }
    else { this.sliceSelectedAttr = wheelnav.sliceSelectedAttr; }

    if (wheelnav.titleAttr === null) { this.titleAttr = { font: this.titleFont, fill: "#111", stroke: "none", cursor: 'pointer' }; }
    else { this.titleAttr = wheelnav.titleAttr; }
    if (wheelnav.titleHoverAttr === null) { this.titleHoverAttr = { font: this.titleFont, fill: "#111", cursor: 'pointer', stroke: "none" }; }
    else { this.titleHoverAttr = wheelnav.titleHoverAttr; }
    if (wheelnav.titleSelectedAttr === null) {
        if (this.wheelnav.multiSelect) {
            this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF", cursor: 'pointer' };
        }
        else {
            this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF", cursor: 'default' };
        }
    }
    else { this.titleSelectedAttr = wheelnav.titleSelectedAttr; }

    if (wheelnav.linePathAttr === null) { this.linePathAttr = { stroke: "#111", "stroke-width": 2, cursor: 'pointer' }; }
    else { this.linePathAttr = wheelnav.linePathAttr; }
    if (wheelnav.lineHoverAttr === null) { this.lineHoverAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' }; }
    else { this.lineHoverAttr = wheelnav.lineHoverAttr; }
    if (wheelnav.lineSelectedAttr === null) {
        if (this.wheelnav.multiSelect) {
            this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'pointer' };
        }
        else {
            this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'default' };
        }
    }
    else { this.lineSelectedAttr = wheelnav.lineSelectedAttr; }

    this.navDivId = null;
    if (wheelnav.navDivDefultCssClass === null) { this.navDivDefultCssClass = "tab-pane fade"; }
    else { this.navDivDefultCssClass = wheelnav.navDivDefultCssClass; }
    if (wheelnav.navDivSelectedCssClass === null) { this.navDivSelectedCssClass = "tab-pane fade in active"; }
    else { this.navDivSelectedCssClass = wheelnav.navDivSelectedCssClass; }

    return this;
};

wheelnavItem.prototype.createNavItem = function () {

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

    if (this.tooltip !== null) {
        this.navItem.attr({ title: this.tooltip });
    }
    this.navItem.id = this.wheelnav.getItemId(this.wheelItemIndex);

    var thisWheelNav = this.wheelnav;
    var thisNavItem = this;
    var thisItemIndex = this.wheelItemIndex;

    this.navItem.mouseup(function () {
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

        if (isEnter && i === hovered && i !== this.wheelnav.currentClick) {
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

        if (this.hoverPercent !== 1 ||
            this.sliceHoverPathFunction !== null ||
            this.sliceHoverTransformFunction !== null) {
            navItem.setCurrentTransform(this.wheelnav.animateRepeatCount);
        }
    }
};

wheelnavItem.prototype.setNavDivCssClass = function () {

    if (this.navDivId !== null) {
        if (this.wheelnav.navDivTabId !== null) {
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

wheelnavItem.prototype.setCurrentTransform = function (animateRepeatCount) {

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

    //Animate navitem
    var animSlice = Raphael.animation(sliceTransformAttr, this.animatetime, this.animateeffect);
    var animLine = Raphael.animation(lineTransformAttr, this.animatetime, this.animateeffect);
    var animTitle = Raphael.animation(titleTransformAttr, this.animatetime, this.animateeffect);

    this.navSlice.animate(animSlice.repeat(animateRepeatCount));
    this.navLine.animate(animLine.repeat(animateRepeatCount));
    this.navTitle.animate(animTitle.repeat(animateRepeatCount));
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
