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

    this.enabled = wheelnav.navItemsEnabled;
    this.selected = false;
    this.hovered = false;

    this.navItem = null;
    this.navSlice = null;
    this.navTitle = null;
    this.navLine = null;
    this.navClickableSlice = null;

    this.navSliceCurrentTransformString = null;
    this.navTitleCurrentTransformString = null;
    this.navLineCurrentTransformString = null;

    this.navSliceUnderAnimation = false;
    this.navTitleUnderAnimation = false;
    this.navLineUnderAnimation = false;

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
    this.clickablePercentMin = wheelnav.clickablePercentMin;
    this.clickablePercentMax = wheelnav.clickablePercentMax;

    this.slicePathCustom = wheelnav.slicePathCustom;
    this.sliceSelectedPathCustom = wheelnav.sliceSelectedPathCustom;
    this.sliceHoverPathCustom = wheelnav.sliceHoverPathCustom;

    this.sliceTransformCustom = wheelnav.sliceTransformCustom; 
    this.sliceSelectedTransformCustom = wheelnav.sliceSelectedTransformCustom;
    this.sliceHoverTransformCustom = wheelnav.sliceHoverTransformCustom;

    if (wheelnav.sliceAngle === null) { this.sliceAngle = 360 / wheelnav.navItemCount; }
    else { this.sliceAngle = wheelnav.sliceAngle;}

    if (title !== null) {
        this.sliceClickablePathFunction = wheelnav.sliceClickablePathFunction;
        this.slicePathFunction = wheelnav.slicePathFunction;
        this.sliceSelectedPathFunction = wheelnav.sliceSelectedPathFunction;
        this.sliceHoverPathFunction = wheelnav.sliceHoverPathFunction;

        this.sliceTransformFunction = wheelnav.sliceTransformFunction;
        this.sliceSelectedTransformFunction = wheelnav.sliceSelectedTransformFunction;
        this.sliceHoverTransformFunction = wheelnav.sliceHoverTransformFunction;
    }
    else {
        this.title = "";
        this.sliceClickablePathFunction = slicePath().NullSlice;
        this.slicePathFunction = slicePath().NullSlice;
        this.sliceSelectedPathFunction = null;
        this.sliceHoverPathFunction = null;
        this.sliceTransformFunction = null;
        this.sliceSelectedTransformFunction = null;
        this.sliceHoverTransformFunction = null;
    }

    this.fillAttr = "#CCC";

    this.animateeffect = "bounce";
    this.animatetime = 1500;

    this.slicePathAttr = { fill: "#CCC", stroke: "#111", "stroke-width": 3, cursor: 'pointer' };
    this.sliceHoverAttr = { fill: "#CCC", stroke: "#111", "stroke-width": 4, cursor: 'pointer' };
    this.sliceSelectedAttr = { fill: "#CCC", stroke: "#111", "stroke-width": 4, cursor: 'default' };

    //Useful for sliceClickablePath testing.
    //this.sliceClickablePathAttr = { fill: "#FFF", stroke: "#FFF", "stroke-width": 0, cursor: 'pointer', "fill-opacity": 0.51 };
    this.sliceClickablePathAttr = { fill: "#FFF", stroke: "#FFF", "stroke-width": 0, cursor: 'pointer', "fill-opacity": 0.01 };
    this.sliceClickableHoverAttr = { stroke: "#FFF", "stroke-width": 0, cursor: 'pointer' };
    this.sliceClickableSelectedAttr = { stroke: "#FFF", "stroke-width": 0, cursor: 'default' };

    this.titleAttr = { font: this.titleFont, fill: "#111", stroke: "none", cursor: 'pointer' };
    this.titleHoverAttr = { font: this.titleFont, fill: "#111", cursor: 'pointer', stroke: "none" };
    this.titleSelectedAttr = { font: this.titleFont, fill: "#FFF", cursor: 'default' };

    this.linePathAttr = { stroke: "#111", "stroke-width": 2, cursor: 'pointer' };
    this.lineHoverAttr = { stroke: "#111", "stroke-width": 3, cursor: 'pointer' };
    this.lineSelectedAttr = { stroke: "#111", "stroke-width": 4, cursor: 'default' };

    this.navDivId = null;
    if (wheelnav.navDivDefultCssClass === null) { this.navDivDefultCssClass = "tab-pane fade"; }
    else { this.navDivDefultCssClass = wheelnav.navDivDefultCssClass; }
    if (wheelnav.navDivSelectedCssClass === null) { this.navDivSelectedCssClass = "tab-pane fade in active"; }
    else { this.navDivSelectedCssClass = wheelnav.navDivSelectedCssClass; }

    return this;
};

wheelnavItem.prototype.createNavItem = function () {

    //Set colors
    this.slicePathAttr.fill = this.fillAttr;
    this.sliceHoverAttr.fill = this.fillAttr;
    this.sliceSelectedAttr.fill = this.fillAttr;

    //Set attrs
    if (!this.enabled) {
        this.slicePathAttr.cursor = "default";
        this.sliceHoverAttr.cursor = "default";
        this.titleAttr.cursor = "default";
        this.titleHoverAttr.cursor = "default";
        this.linePathAttr.cursor = "default";
        this.lineHoverAttr.cursor = "default";
    }

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

    if (this.wheelnav.animatetimeCalculated) {
        this.animatetime = this.wheelnav.animatetime / this.wheelnav.navItemCount;
    }

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

    if (this.clickablePercentMax > 0) {
        //Set min/max sliececlickablePaths
        //Default - min
        if (this.clickableSlicePathMin === undefined) {
            this.clickableSlicePathMin = this.sliceClickablePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.clickablePercentMin, this.slicePathCustom);
        }
        //Default - max
        if (this.clickableSlicePathMax === undefined) {
            this.clickableSlicePathMax = this.sliceClickablePathFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.itemIndex, this.clickablePercentMax, this.slicePathCustom);
        }

        //Create clickable slice
        var sliceClickablePath = this.getCurrentClickablePath();
        this.navClickableSlice = this.wheelnav.raphael.path(sliceClickablePath.slicePathString).attr(this.sliceClickablePathAttr).toBack();

        this.navItem.push(
            this.navClickableSlice,
            this.navSlice,
            this.navTitle,
            this.navLine
        );
    }
    else {
        this.navItem.push(
            this.navSlice,
            this.navTitle,
            this.navLine
        );
    }

    
    

    if (this.tooltip !== null) {
        this.navItem.attr({ title: this.tooltip });
    }
    this.navItem.id = this.wheelnav.getItemId(this.wheelItemIndex);

    var thisWheelNav = this.wheelnav;
    var thisNavItem = this;
    var thisItemIndex = this.wheelItemIndex;

    if (this.enabled) {
        this.navItem.mouseup(function () {
            thisWheelNav.navigateWheel(thisItemIndex);
        });
        this.navItem.mouseover(function () {
            thisNavItem.hoverEffect(thisItemIndex, true);
        });
        this.navItem.mouseout(function () {
            thisNavItem.hoverEffect(thisItemIndex, false);
        });
    }
};

wheelnavItem.prototype.hoverEffect = function (hovered, isEnter) {

    if (this.wheelnav.clickModeRotate === false ||
        this.wheelnav.animateLocked === false) {
        if (isEnter && hovered !== this.wheelnav.currentClick) {
            this.navSlice.attr(this.sliceHoverAttr);
            this.navTitle.attr(this.titleHoverAttr);
            this.navLine.attr(this.lineHoverAttr);
            if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickableHoverAttr); }
            this.hovered = true;
        }
        else {
            this.hovered = false;

            if (this.selected) {
                this.navSlice.attr(this.sliceSelectedAttr);
                this.navTitle.attr(this.titleSelectedAttr);
                this.navLine.attr(this.lineSelectedAttr);
                if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickableSelectedAttr); }
            }
            else {
                this.navSlice.attr(this.slicePathAttr);
                this.navTitle.attr(this.titleAttr);
                this.navLine.attr(this.linePathAttr);
                if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickablePathAttr); }
            }
        }

        if (this.hoverPercent !== 1 ||
            this.sliceHoverPathFunction !== null ||
            this.sliceHoverTransformFunction !== null) {
            this.setCurrentTransform(this.wheelnav.animateRepeatCount);
        }
    }
};

wheelnavItem.prototype.setCurrentTransform = function (animateRepeatCount, locked) {

    if (!this.wheelnav.clickModeRotate ||
        (!this.navSliceUnderAnimation &&
        !this.navTitleUnderAnimation &&
        !this.navLineUnderAnimation)) {

        if (locked !== undefined &&
            locked === true) {
            this.navSliceUnderAnimation = true;
            this.navTitleUnderAnimation = true;
            this.navLineUnderAnimation = true;
        }

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

        if (this.clickablePercentMax > 0) {
            var sliceClickablePath = this.getCurrentClickablePath();

            var sliceClickableTransformAttr = {
                path: sliceClickablePath.slicePathString,
                transform: this.navSliceCurrentTransformString
            };
        }

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

        var thisNavItem = this;
        var thisWheelnav = this.wheelnav;

        //Animate navitem
        this.animSlice = Raphael.animation(sliceTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navSliceUnderAnimation = false;
            thisWheelnav.animateUnlock();
        });
        this.animLine = Raphael.animation(lineTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navLineUnderAnimation = false;
            thisWheelnav.animateUnlock();
        });
        this.animTitle = Raphael.animation(titleTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navTitleUnderAnimation = false;
            thisWheelnav.animateUnlock();
        });

        if (this.clickablePercentMax > 0) {
            this.animClickableSlice = Raphael.animation(sliceClickableTransformAttr, this.animatetime, this.animateeffect);
        }

        if (locked !== undefined &&
            locked === true) {
            if (this.wheelItemIndex === this.wheelnav.navItemCount - 1) {

                for (i = 0; i < this.wheelnav.navItemCount; i++) {
                    var navItemSlice = this.wheelnav.navItems[i];
                    navItemSlice.navSlice.animate(navItemSlice.animSlice.repeat(animateRepeatCount));
                }
                for (i = 0; i < this.wheelnav.navItemCount; i++) {
                    var navItemLine = this.wheelnav.navItems[i];
                    navItemLine.navLine.animate(navItemLine.animLine.repeat(animateRepeatCount));
                }
                for (i = 0; i < this.wheelnav.navItemCount; i++) {
                    var navItemTitle = this.wheelnav.navItems[i];
                    navItemTitle.navTitle.animate(navItemTitle.animTitle.repeat(animateRepeatCount));
                }

                if (this.clickablePercentMax > 0) {
                    for (i = 0; i < this.wheelnav.navItemCount; i++) {
                        var navItemClickableSlice = this.wheelnav.navItems[i];
                        navItemClickableSlice.navClickableSlice.animate(navItemClickableSlice.animClickableSlice.repeat(animateRepeatCount));
                    }
                }
            }
        }
        else {
            this.navSlice.animate(this.animSlice.repeat(animateRepeatCount));
            this.navLine.animate(this.animLine.repeat(animateRepeatCount));
            this.navTitle.animate(this.animTitle.repeat(animateRepeatCount));

            if (this.clickablePercentMax > 0) {
                this.navClickableSlice.animate(this.animClickableSlice.repeat(animateRepeatCount));
            }
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

wheelnavItem.prototype.getCurrentClickablePath = function () {
    var sliceClickablePath;

    if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
        sliceClickablePath = this.clickableSlicePathMax;
    }
    else {
        sliceClickablePath = this.clickableSlicePathMin;
    }

    return sliceClickablePath;
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
