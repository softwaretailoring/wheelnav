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

    //Private properties
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
    this.navTitlePathUnderAnimation = false;
    this.navLineUnderAnimation = false;

    this.currentRotateAngle = 0;

    this.setTitle(title);
    this.tooltip = null;
    
    //Default settings
    this.fillAttr = "#CCC";
    this.titleFont = this.wheelnav.titleFont;
    this.navigateHref = null;
    this.navigateFunction = null;
    //When navTitle start with 'imgsrc:' it can parse as URL of image or data URI. These properties are available for images and paths. Use after initWheel(), before createWheel()
    this.titleWidth = null;
    this.titleHeight = null;
    this.titleHoverWidth = null;
    this.titleHoverHeight = null;
    this.titleSelectedWidth = null;
    this.titleSelectedHeight = null;

    //Wheelnav properties
    this.animateeffect = null;
    this.animatetime = null;

    this.sliceInitPathFunction = null;
    this.sliceClickablePathFunction = null;
    this.slicePathFunction = null;
    this.sliceSelectedPathFunction = null;
    this.sliceHoverPathFunction = null;

    this.sliceTransformFunction = null;
    this.sliceSelectedTransformFunction = null;
    this.sliceHoverTransformFunction = null;
    this.sliceInitTransformFunction = null;

    this.slicePathCustom = null;
    this.sliceClickablePathCustom = null;
    this.sliceSelectedPathCustom = null;
    this.sliceHoverPathCustom = null;
    this.sliceInitPathCustom = null;

    this.sliceTransformCustom = null;
    this.sliceSelectedTransformCustom = null;
    this.sliceHoverTransformCustom = null;
    this.sliceInitTransformCustom = null;

    this.initPercent = null;
    this.minPercent = null;
    this.maxPercent = null;
    this.hoverPercent = null;
    this.selectedPercent = null;
    this.clickablePercentMin = null;
    this.clickablePercentMax = null;

    this.titleSpreadScale = null;
    this.sliceAngle = null;
    this.titleRotateAngle = null;

    this.titleCurved = null;
    this.titleCurvedClockwise = null;
    this.titleCurvedByRotateAngle = null;

    //Default navitem styles
    this.styleNavItem();

    return this;
};

wheelnavItem.prototype.createNavItem = function () {

    //Wheel settings
    this.setWheelSettings(false);

    //Set href navigation
    if (this.navigateHref !== null) {
        this.navigateFunction = function () {
            window.location.href = this.navigateHref;
        };
    }

    //Set colors
    if (!this.wheelnav.cssMode) {
        this.slicePathAttr.fill = this.fillAttr;
        this.sliceHoverAttr.fill = this.fillAttr;
        this.sliceSelectedAttr.fill = this.fillAttr;
    }

    //Set attrs
    if (!this.enabled) {
        if (!this.wheelnav.cssMode) {
            this.slicePathAttr.cursor = "default";
            this.sliceHoverAttr.cursor = "default";
            this.titleAttr.cursor = "default";
            this.titleHoverAttr.cursor = "default";
            this.linePathAttr.cursor = "default";
            this.lineHoverAttr.cursor = "default";
        }

        this.sliceClickablePathAttr.cursor = "default";
        this.sliceClickableHoverAttr.cursor = "default";
    }

    //Set angles
    var prevItemIndex = this.wheelItemIndex - 1;
    var wheelSliceAngle = 360 / this.wheelnav.navItemCount;
    if (this.sliceAngle === null) {
        this.sliceAngle = 360 / this.wheelnav.navItemCount;
    }
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

    this.initPathsAndTransforms();

    var sliceInitPath = this.sliceInitPath;

    //Create slice
    this.navSlice = this.wheelnav.raphael.path(sliceInitPath.slicePathString);
    this.navSlice.attr(this.slicePathAttr);
    this.navSlice.id = this.wheelnav.getSliceId(this.wheelItemIndex);
    this.navSlice.node.id = this.navSlice.id;

    //Create linepath
    this.navLine = this.wheelnav.raphael.path(sliceInitPath.linePathString);
    this.navLine.attr(this.linePathAttr);
    this.navLine.id = this.wheelnav.getLineId(this.wheelItemIndex);
    this.navLine.node.id = this.navLine.id;

    //Create title
    var currentTitle = this.initNavTitle;

    //Title defined by path
    if (wheelnavTitle().isPathTitle(this.title)) {
        this.navTitle = this.wheelnav.raphael.path(currentTitle.path);
    }
    //Title defined by image
    else if (wheelnavTitle().isImageTitle(this.title)) {
        this.navTitle = this.wheelnav.raphael.image(currentTitle.src, sliceInitPath.titlePosX - (this.titleWidth / 2), sliceInitPath.titlePosY - (this.titleHeight / 2), this.titleWidth, this.titleHeight);
    }
    //Title defined by text
    else {
        if (this.titleCurved) {
            this.navTitle = this.wheelnav.raphael.text(sliceInitPath.titlePosX, sliceInitPath.titlePosY, ".");
            if (currentTitle.title !== "") {
                this.addCurvedTitle(currentTitle.title);
            }
        }
        else {
            this.navTitle = this.wheelnav.raphael.text(sliceInitPath.titlePosX, sliceInitPath.titlePosY, currentTitle.title);
        }
    }

    this.navTitle.id = this.wheelnav.getTitleId(this.wheelItemIndex);
    this.navTitle.node.id = this.navTitle.id;
    this.navTitle.attr(this.titleAttr);

    //Tspan must be hide in case of curved text
    if (this.titleCurved) {
        var thisnode = document.getElementById(this.navTitle.node.id);
        if (thisnode !== null) {
            var tspans = thisnode.getElementsByTagName("tspan");
            if (tspans.length > 0) {
                tspans[0].setAttribute("fill", "transparent");
                tspans[0].setAttribute("stroke", "transparent");
            }
        }
    }

    //Set transforms
    this.navSliceCurrentTransformString = "";
    if (this.initTransform.sliceTransformString !== "") { this.navSliceCurrentTransformString += this.initTransform.sliceTransformString; }

    this.navLineCurrentTransformString = "";
    if (this.initTransform.lineTransformString !== "") { this.navLineCurrentTransformString += this.initTransform.lineTransformString; }

    this.navTitleCurrentTransformString = "";
    this.navTitleCurrentTransformString += this.getTitleRotateString(this.wheelnav.initTitleRotate);
    if (this.initTransform.titleTransformString !== "" && this.initTransform.titleTransformString !== undefined) { this.navTitleCurrentTransformString += this.initTransform.titleTransformString; }
    if (this.wheelnav.currentPercent < 0.05) {
        this.navTitleCurrentTransformString += ",s0.05";
    }
    if (this.navTitleSizeTransform !== undefined) {
        this.navTitleCurrentTransformString += this.navTitleSizeTransform;
    }

    this.navSlice.attr({ transform: this.navSliceCurrentTransformString });
    this.navLine.attr({ transform: this.navLineCurrentTransformString });
    this.navTitle.attr({ transform: this.navTitleCurrentTransformString });

    //Create item set
    this.navItem = this.wheelnav.raphael.set();

    if (this.sliceClickablePathFunction !== null) {
        //Create clickable slice
        var sliceClickablePath = this.getCurrentClickablePath();
        this.navClickableSlice = this.wheelnav.raphael.path(sliceClickablePath.slicePathString).attr(this.sliceClickablePathAttr).toBack();
        this.navClickableSlice.id = this.wheelnav.getClickableSliceId(this.wheelItemIndex);
        this.navClickableSlice.node.id = this.navClickableSlice.id;
        
        this.navItem.push(
            this.navSlice,
            this.navLine,
            this.navTitle,
            this.navClickableSlice
        );
    }
    else {
        this.navItem.push(
            this.navSlice,
            this.navLine,
            this.navTitle
        );
    }

    this.setTooltip(this.tooltip);
    this.navItem.id = this.wheelnav.getItemId(this.wheelItemIndex);

    var thisWheelNav = this.wheelnav;
    var thisNavItem = this;
    var thisItemIndex = this.wheelItemIndex;

    if (this.enabled) {
        this.navItem.mouseup(function () {
            if (thisNavItem.navigateFunction !== null) {
                thisNavItem.navigateFunction();
            }

            thisWheelNav.navigateWheel(thisItemIndex);
        });
        if (this.wheelnav.hoverEnable) {
            this.navItem.mouseover(function () {
                if (thisNavItem.hovered !== true) {
                    thisNavItem.hoverEffect(thisItemIndex, true);
                }
            });
            this.navItem.mouseout(function () {
                thisNavItem.hovered = false;
                thisNavItem.hoverEffect(thisItemIndex, false);
            });
        }
    }

    this.setCurrentTransform(true, false);
};

wheelnavItem.prototype.addCurvedTitle = function (text) {

    var pathString = [];
    if (this.sliceInitPath.titlePathString !== undefined && this.sliceInitPath.titlePathString !== "") {
        pathString = this.sliceInitPath.titlePathString;
    }
    else {
        this.sliceHelper.titleRadius = this.wheelnav.wheelRadius * 0.63;
        pathString = this.sliceHelper.getCurvedTitlePathString();
    }
 
    this.navTitle.node.id = this.wheelnav.getTitleId(this.wheelItemIndex);
    var pathid = this.wheelnav.getTitlePathId(this.wheelItemIndex);
    this.navTitlePath = this.wheelnav.raphael.path(pathString);
    this.navTitlePath.attr({ fill: "transparent", stroke: "transparent" });
    this.navTitlePath.node.id = pathid;

    var thisnode = document.getElementById(this.navTitle.node.id);
    var curvetextPath = window.document.createElementNS("http://www.w3.org/2000/svg", "textPath");
    curvetextPath.setAttribute("id", pathid + "-text");
    curvetextPath.setAttribute("href", "#" + pathid);
    curvetextPath.setAttribute("startOffset", "50%");
    curvetextPath.setAttribute("dominant-baseline", "middle");
    curvetextPath.setAttribute("alignment-baseline", "middle");
    curvetextPath.textContent = text;
    thisnode.appendChild(curvetextPath);

    if (!this.titleCurvedByRotateAngle) {
        this.titleRotateAngle = -this.navAngle;
    }
};

wheelnavItem.prototype.hoverEffect = function (hovered, isEnter) {

    if (this.wheelnav.animateLocked === false) {
        if (isEnter) {
            if (!this.selected) {
                this.hovered = true;
            }
        }

        this.refreshNavItem();

        if (this.hoverPercent !== 1 ||
            this.sliceHoverPathFunction !== null ||
            this.sliceHoverTransformFunction !== null ||
            this.titleHover !== this.title ||
            this.titleHoverWidth !== this.titleWidth ||
            this.titleHoverHeight !== this.titleHeight) {
            this.setCurrentTransform(false, false);
        }

        this.wheelnav.marker.setCurrentTransform();
        this.wheelnav.spreader.setCurrentTransform(true);
    }
};

wheelnavItem.prototype.setCurrentTransform = function (locked, withFinishFunction) {

    if (!this.wheelnav.clickModeRotate ||
        (!this.navSliceUnderAnimation &&
        !this.navTitleUnderAnimation &&
        !this.navTitlePathUnderAnimation &&
        !this.navLineUnderAnimation)) {

        if (locked !== undefined &&
            locked === true) {
            this.navSliceUnderAnimation = true;
            this.navTitleUnderAnimation = true;
            if (this.navTitlePath !== undefined) {
                this.navTitlePathUnderAnimation = true;
            }
            this.navLineUnderAnimation = true;
        }

        //Set transforms
        //  Slice
        this.navSliceCurrentTransformString = "";
        if (this.wheelnav.clickModeRotate) { this.navSliceCurrentTransformString += this.getItemRotateString(); }
        if (this.selected) {
            if (this.selectTransform.sliceTransformString !== undefined) { this.navSliceCurrentTransformString += this.selectTransform.sliceTransformString; }
        }
        else if (this.hovered) {
            if (this.hoverTransform.sliceTransformString !== undefined) { this.navSliceCurrentTransformString += this.hoverTransform.sliceTransformString; }
        }
        if (this.sliceTransform.sliceTransformString !== undefined) { this.navSliceCurrentTransformString += this.sliceTransform.sliceTransformString; }

        //  Line
        this.navLineCurrentTransformString = "";
        if (this.wheelnav.clickModeRotate) { this.navLineCurrentTransformString += this.getItemRotateString(); }
        if (this.selected) {
            if (this.selectTransform.lineTransformString !== undefined) { this.navLineCurrentTransformString += this.selectTransform.lineTransformString; }
        }
        else if (this.hovered) {
            if (this.hoverTransform.lineTransformString !== undefined) { this.navLineCurrentTransformString += this.hoverTransform.lineTransformString; }
        }
        if (this.sliceTransform.lineTransformString !== undefined) { this.navLineCurrentTransformString += this.sliceTransform.lineTransformString; }

        //  Title
        this.navTitleCurrentTransformString = "";
        this.navTitleCurrentTransformString += this.getTitleRotateString(true);

        if (this.selected) {
            if (this.navTitleSizeSelectedTransform !== undefined) {
                this.navTitleCurrentTransformString += this.navTitleSizeSelectedTransform;
            }
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
            if (this.navTitleSizeHoverTransform !== undefined) {
                this.navTitleCurrentTransformString += this.navTitleSizeHoverTransform;
            }
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
            if (this.navTitleSizeTransform !== undefined) {
                this.navTitleCurrentTransformString += this.navTitleSizeTransform;
            }
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

        var sliceClickableTransformAttr = {};

        if (this.sliceClickablePathFunction !== null) {
            var sliceClickablePath = this.getCurrentClickablePath();

            sliceClickableTransformAttr = {
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
        var currentTitle = this.getCurrentTitle();
        var titleTransformAttr = {};
        var titlePathTransformAttr = null;

        if (wheelnavTitle().isPathTitle(currentTitle.title)) {
            titleTransformAttr = {
                path: currentTitle.path,
                transform: this.navTitleCurrentTransformString
            };
        }
        else if (wheelnavTitle().isImageTitle(currentTitle.title)) {
            titleTransformAttr = {
                x: currentTitle.x,
                y: currentTitle.y,
                width: currentTitle.width,
                height: currentTitle.height,
                transform: this.navTitleCurrentTransformString
            };

            this.navTitle.attr({ src: currentTitle.src });
        }
        else {
            titleTransformAttr = {
                x: currentTitle.x,
                y: currentTitle.y,
                transform: this.navTitleCurrentTransformString
            };

            if (currentTitle.title !== null && currentTitle.title !== "") {
                if (!this.titleCurved) {
                    this.navTitle.attr({ text: currentTitle.title });
                }
                else if (slicePath.titlePathString !== undefined && slicePath.titlePathString !== "") {
                    titlePathTransformAttr = {
                        path: slicePath.titlePathString
                    };
                }
            }
        }

        var thisNavItem = this;
        var thisWheelnav = this.wheelnav;

        //Animate navitem
        this.animSlice = Raphael.animation(sliceTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navSliceUnderAnimation = false;
            thisWheelnav.animateUnlock(false, withFinishFunction);
        });
        this.animLine = Raphael.animation(lineTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navLineUnderAnimation = false;
            thisWheelnav.animateUnlock(false, withFinishFunction);
        });
        this.animTitle = Raphael.animation(titleTransformAttr, this.animatetime, this.animateeffect, function () {
            thisNavItem.navTitleUnderAnimation = false;
            thisWheelnav.animateUnlock(false, withFinishFunction);
        });
        if (this.titleCurved && this.navTitlePath !== undefined) {
            this.animTitlePath = Raphael.animation(titlePathTransformAttr, this.animatetime, this.animateeffect, function () {
                thisNavItem.navTitlePathUnderAnimation = false;
                thisWheelnav.animateUnlock(false, withFinishFunction);
            });
        }

        if (this.navClickableSlice !== null) {
            this.animClickableSlice = Raphael.animation(sliceClickableTransformAttr, this.animatetime, this.animateeffect);
        }

        var animateRepeatCount = this.wheelnav.animateRepeatCount;

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
                    if (navItemTitle.titleCurved && navItemTitle.navTitlePath !== undefined) {
                        navItemTitle.navTitlePath.animate(navItemTitle.animTitlePath.repeat(animateRepeatCount));
                    }
                }

                if (this.wheelnav.sliceClickablePathFunction !== null) {
                    for (i = 0; i < this.wheelnav.navItemCount; i++) {
                        var navItemClickableSlice = this.wheelnav.navItems[i];
                        if (navItemClickableSlice.navClickableSlice !== null) {
                            navItemClickableSlice.navClickableSlice.animate(navItemClickableSlice.animClickableSlice.repeat(animateRepeatCount));
                        }
                    }
                }
            }
        }
        else {
            this.navSlice.animate(this.animSlice.repeat(animateRepeatCount));
            this.navLine.animate(this.animLine.repeat(animateRepeatCount));
            this.navTitle.animate(this.animTitle.repeat(animateRepeatCount));
            if (this.titleCurved && this.navTitlePath !== undefined) {
                this.navTitlePath.animate(this.animTitlePath.repeat(animateRepeatCount));
            }

            if (this.navClickableSlice !== null) {
                this.navClickableSlice.animate(this.animClickableSlice.repeat(animateRepeatCount));
            }
        }
    }
};

wheelnavItem.prototype.setTitle = function (title) {
    if (title === undefined) {
        this.title = null;
    }
    else {
        this.title = title;
    }
    this.titleHover = this.title;
    this.titleSelected = this.title;
};

wheelnavItem.prototype.setTooltip = function (tooltip) {
    if (tooltip !== null) {
        this.navItem.attr({ title: tooltip });
    }
};

wheelnavItem.prototype.refreshNavItem = function (withPathAndTransform) {

    if (this.selected) {
        this.navSlice.attr(this.sliceSelectedAttr);
        this.navLine.attr(this.lineSelectedAttr);
        this.navTitle.attr(this.titleSelectedAttr);
        if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickableSelectedAttr); }

        if (this.wheelnav.selectedToFront) {
            this.navSlice.toFront();
            this.navLine.toFront();
            this.navTitle.toFront();
            if (this.navClickableSlice !== null) { this.navClickableSlice.toFront(); }
        }
        else {
            if (this.navClickableSlice !== null) { this.navClickableSlice.toBack(); }
            this.navTitle.toBack();
            this.navLine.toBack();
            this.navSlice.toBack();
        }
    }
    else if (this.hovered) {
        if (this.wheelnav.hoverEnable) {
            this.navSlice.attr(this.sliceHoverAttr);
            this.navLine.attr(this.lineHoverAttr);
            this.navTitle.attr(this.titleHoverAttr);
            if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickableHoverAttr); }

            if (this.wheelnav.hoveredToFront) {
                this.navSlice.toFront();
                this.navLine.toFront();
                this.navTitle.toFront();
            }
            if (this.navClickableSlice !== null) { this.navClickableSlice.toFront(); }
        }
    }
    else {
        this.navSlice.attr(this.slicePathAttr);
        this.navLine.attr(this.linePathAttr);
        this.navTitle.attr(this.titleAttr);
        if (this.navClickableSlice !== null) { this.navClickableSlice.attr(this.sliceClickablePathAttr); }

        if (this.navClickableSlice !== null) { this.navClickableSlice.toBack(); };
        this.navTitle.toBack();
        this.navLine.toBack();
        this.navSlice.toBack();
    }
    
    if (withPathAndTransform !== undefined &&
        withPathAndTransform === true) {
        this.initPathsAndTransforms();
        this.setCurrentTransform(false, false);
    }
};

wheelnavItem.prototype.setWheelSettings = function (force) {

    //Set slice from wheelnav
    if (this.wheelnav.slicePathAttr !== null) { this.slicePathAttr = JSON.parse(JSON.stringify(this.wheelnav.slicePathAttr)); }
    if (this.wheelnav.sliceHoverAttr !== null) { this.sliceHoverAttr = JSON.parse(JSON.stringify(this.wheelnav.sliceHoverAttr)); }
    if (this.wheelnav.sliceSelectedAttr !== null) { this.sliceSelectedAttr = JSON.parse(JSON.stringify(this.wheelnav.sliceSelectedAttr)); }
    
    //Set title from wheelnav
    if (this.wheelnav.titleAttr !== null) { this.titleAttr = JSON.parse(JSON.stringify(this.wheelnav.titleAttr)); }
    if (this.wheelnav.titleHoverAttr !== null) { this.titleHoverAttr = JSON.parse(JSON.stringify(this.wheelnav.titleHoverAttr)); }
    if (this.wheelnav.titleSelectedAttr !== null) { this.titleSelectedAttr = JSON.parse(JSON.stringify(this.wheelnav.titleSelectedAttr)); }
    if (this.wheelnav.titleRotateAngle !== null && this.titleRotateAngle === null) { this.titleRotateAngle = this.wheelnav.titleRotateAngle; }
    if (this.wheelnav.titleCurved !== null && this.titleCurved === null) { this.titleCurved = this.wheelnav.titleCurved; }
    if (this.wheelnav.titleCurvedClockwise !== null && this.titleCurvedClockwise === null) { this.titleCurvedClockwise = this.wheelnav.titleCurvedClockwise; }
    else if (this.titleCurvedClockwise === null) { this.titleCurvedClockwise = !this.wheelnav.clockwise; }
    if (this.wheelnav.titleCurvedByRotateAngle !== null && this.titleCurvedByRotateAngle === null) { this.titleCurvedByRotateAngle = this.wheelnav.titleCurvedByRotateAngle; }

    // Size
    if (this.wheelnav.titleWidth !== null && this.titleWidth === null) { this.titleWidth = this.wheelnav.titleWidth; }
    if (this.wheelnav.titleHeight !== null && this.titleHeight === null) { this.titleHeight = this.wheelnav.titleHeight; }
    if (this.titleWidth !== null && this.titleHeight === null) { this.titleHeight = this.titleWidth; }
    if (this.titleWidth === null && this.titleHeight !== null) { this.titleWidth = this.titleHeight; }
    if (wheelnavTitle().isImageTitle(this.title)) {
        // Image default value
        if (this.titleWidth === null) { this.titleWidth = 32; }
        if (this.titleHeight === null) { this.titleHeight = 32; }
    }

    if (this.wheelnav.titleHoverWidth !== null && this.titleHoverWidth === null) { this.titleHoverWidth = this.wheelnav.titleHoverWidth; }
    if (this.wheelnav.titleHoverHeight !== null && this.titleHoverHeight === null) { this.titleHoverHeight = this.wheelnav.titleHoverHeight; }
    if (this.titleHoverWidth !== null && this.titleHoverHeight === null) { this.titleHoverHeight = this.titleHoverWidth; }
    if (this.titleHoverWidth === null && this.titleHoverHeight !== null) { this.titleHoverWidth = this.titleHoverHeight; }

    if (this.wheelnav.titleSelectedWidth !== null && this.titleSelectedWidth === null) { this.titleSelectedWidth = this.wheelnav.titleSelectedWidth; }
    if (this.wheelnav.titleSelectedHeight !== null && this.titleSelectedHeight === null) { this.titleSelectedHeight = this.wheelnav.titleSelectedHeight; }
    if (this.titleSelectedWidth !== null && this.titleSelectedHeight === null) { this.titleSelectedHeight = this.titleSelectedWidth; }
    if (this.titleSelectedWidth === null && this.titleSelectedHeight !== null) { this.titleSelectedWidth = this.titleSelectedHeight; }

    if (this.titleHoverHeight === null) { this.titleHoverHeight = this.titleHeight; }
    if (this.titleHoverWidth === null) { this.titleHoverWidth = this.titleWidth; }
    if (this.titleSelectedHeight === null) { this.titleSelectedHeight = this.titleHeight; }
    if (this.titleSelectedWidth === null) { this.titleSelectedWidth = this.titleWidth; }

    //Set line from wheelnav
    if (this.wheelnav.linePathAttr !== null) { this.linePathAttr = JSON.parse(JSON.stringify(this.wheelnav.linePathAttr)); }
    if (this.wheelnav.lineHoverAttr !== null) { this.lineHoverAttr = JSON.parse(JSON.stringify(this.wheelnav.lineHoverAttr)); }
    if (this.wheelnav.lineSelectedAttr !== null) { this.lineSelectedAttr = JSON.parse(JSON.stringify(this.wheelnav.lineSelectedAttr)); }

    //Set animation from wheelnav
    if (this.animateeffect === null || force) {
        if (this.wheelnav.animateeffect !== null) { this.animateeffect = this.wheelnav.animateeffect; }
        else { this.animateeffect = "bounce"; }
    }
    if (this.animatetime === null || force) {
        if (this.wheelnav.animatetime !== null) { this.animatetime = this.wheelnav.animatetime; }
        else { this.animatetime = 1500; }
    }

    if (this.title !== null) {
        if (this.sliceInitPathFunction === null || force) { this.sliceInitPathFunction = this.wheelnav.sliceInitPathFunction; }
        if (this.sliceClickablePathFunction === null || force) { this.sliceClickablePathFunction = this.wheelnav.sliceClickablePathFunction; }
        if (this.slicePathFunction === null || force) { this.slicePathFunction = this.wheelnav.slicePathFunction; }
        if (this.sliceSelectedPathFunction === null || force) { this.sliceSelectedPathFunction = this.wheelnav.sliceSelectedPathFunction; }
        if (this.sliceHoverPathFunction === null || force) { this.sliceHoverPathFunction = this.wheelnav.sliceHoverPathFunction; }
            
        if (this.sliceTransformFunction === null || force) { this.sliceTransformFunction = this.wheelnav.sliceTransformFunction; }
        if (this.sliceSelectedTransformFunction === null || force) { this.sliceSelectedTransformFunction = this.wheelnav.sliceSelectedTransformFunction; }
        if (this.sliceHoverTransformFunction === null || force) { this.sliceHoverTransformFunction = this.wheelnav.sliceHoverTransformFunction; }
        if (this.sliceInitTransformFunction === null || force) { this.sliceInitTransformFunction = this.wheelnav.sliceInitTransformFunction; }
    }
    else {
        this.sliceInitPathFunction = slicePath().NullInitSlice;
        this.sliceClickablePathFunction = slicePath().NullSlice;
        this.slicePathFunction = slicePath().NullSlice;
        this.sliceSelectedPathFunction = null;
        this.sliceHoverPathFunction = null;
        this.sliceTransformFunction = null;
        this.sliceSelectedTransformFunction = null;
        this.sliceHoverTransformFunction = null;
        this.sliceInitTransformFunction = null;
    }

    if (this.slicePathCustom === null || force) { this.slicePathCustom = this.wheelnav.slicePathCustom; }
    if (this.sliceClickablePathCustom === null || force) { this.sliceClickablePathCustom = this.wheelnav.sliceClickablePathCustom; }
    if (this.sliceSelectedPathCustom === null || force) { this.sliceSelectedPathCustom = this.wheelnav.sliceSelectedPathCustom; }
    if (this.sliceHoverPathCustom === null || force) { this.sliceHoverPathCustom = this.wheelnav.sliceHoverPathCustom; }
    if (this.sliceInitPathCustom === null || force) { this.sliceInitPathCustom = this.wheelnav.sliceInitPathCustom; }

    if (this.sliceTransformCustom === null || force) { this.sliceTransformCustom = this.wheelnav.sliceTransformCustom; }
    if (this.sliceSelectedTransformCustom === null || force) { this.sliceSelectedTransformCustom = this.wheelnav.sliceSelectedTransformCustom; }
    if (this.sliceHoverTransformCustom === null || force) { this.sliceHoverTransformCustom = this.wheelnav.sliceHoverTransformCustom; }
    if (this.sliceInitTransformCustom === null || force) { this.sliceInitTransformCustom = this.wheelnav.sliceInitTransformCustom; }

    if (this.initPercent === null || force) { this.initPercent = this.wheelnav.initPercent; }
    if (this.minPercent === null || force) { this.minPercent = this.wheelnav.minPercent; }
    if (this.maxPercent === null || force) { this.maxPercent = this.wheelnav.maxPercent; }
    if (this.hoverPercent === null || force) { this.hoverPercent = this.wheelnav.hoverPercent; }
    if (this.selectedPercent === null || force) { this.selectedPercent = this.wheelnav.selectedPercent; }
    if (this.clickablePercentMin === null || force) { this.clickablePercentMin = this.wheelnav.clickablePercentMin; }
    if (this.clickablePercentMax === null || force) { this.clickablePercentMax = this.wheelnav.clickablePercentMax; }

    if (this.titleSpreadScale === null || force) {
        if (this.wheelnav.titleSpreadScale !== null) { this.titleSpreadScale = this.wheelnav.titleSpreadScale; }
        else { this.titleSpreadScale = false; }
    }
    if (this.sliceAngle === null || force) {
        if (this.wheelnav.sliceAngle !== null) { this.sliceAngle = this.wheelnav.sliceAngle; }
    }
};

wheelnavItem.prototype.initPathsAndTransforms = function () {

    this.sliceHelper = new pathHelper();
    this.sliceHelper.centerX = this.wheelnav.centerX;
    this.sliceHelper.centerY = this.wheelnav.centerY;
    this.sliceHelper.wheelRadius = this.wheelnav.wheelRadius;
    this.sliceHelper.startAngle = this.baseAngle;
    this.sliceHelper.sliceAngle = this.sliceAngle;
    this.sliceHelper.itemIndex = this.itemIndex;
    this.sliceHelper.titleCurvedClockwise = this.titleCurvedClockwise;
    
    //Set min/max sliecePaths
    //Default - min
    this.slicePathMin = this.slicePathFunction(this.sliceHelper, this.minPercent, this.slicePathCustom);

    //Default - max
    this.slicePathMax = this.slicePathFunction(this.sliceHelper, this.maxPercent, this.slicePathCustom);

    //Selected - min
    if (this.sliceSelectedPathFunction !== null) {
        this.selectedSlicePathMin = this.sliceSelectedPathFunction(this.sliceHelper, this.selectedPercent * this.minPercent, this.sliceSelectedPathCustom);
    }
    else {
        this.selectedSlicePathMin = this.slicePathFunction(this.sliceHelper, this.selectedPercent * this.minPercent, this.sliceSelectedPathCustom);
    }

    //Selected - max
    if (this.sliceSelectedPathFunction !== null) {
        this.selectedSlicePathMax = this.sliceSelectedPathFunction(this.sliceHelper, this.selectedPercent * this.maxPercent, this.sliceSelectedPathCustom);
    }
    else {
        this.selectedSlicePathMax = this.slicePathFunction(this.sliceHelper, this.selectedPercent * this.maxPercent, this.sliceSelectedPathCustom);
    }

    //Hovered - min
    if (this.sliceHoverPathFunction !== null) {
        this.hoverSlicePathMin = this.sliceHoverPathFunction(this.sliceHelper, this.hoverPercent * this.minPercent, this.sliceHoverPathCustom);
    }
    else {
        this.hoverSlicePathMin = this.slicePathFunction(this.sliceHelper, this.hoverPercent * this.minPercent, this.sliceHoverPathCustom);
    }

    //Hovered - max
    if (this.sliceHoverPathFunction !== null) {
        this.hoverSlicePathMax = this.sliceHoverPathFunction(this.sliceHelper, this.hoverPercent * this.maxPercent, this.sliceHoverPathCustom);
    }
    else {
        this.hoverSlicePathMax = this.slicePathFunction(this.sliceHelper, this.hoverPercent * this.maxPercent, this.sliceHoverPathCustom);
    }

    //Set min/max sliececlickablePaths
    
    if (this.sliceClickablePathFunction !== null) {
        //Default - min
        this.clickableSlicePathMin = this.sliceClickablePathFunction(this.sliceHelper, this.clickablePercentMin, this.sliceClickablePathCustom);
        //Default - max
        this.clickableSlicePathMax = this.sliceClickablePathFunction(this.sliceHelper, this.clickablePercentMax, this.sliceClickablePathCustom);
    }

    //Initial path
    if (this.sliceInitPathFunction !== null) {
        this.sliceInitPath = this.sliceInitPathFunction(this.sliceHelper, this.initPercent, this.sliceInitPathCustom);
    }
    else {
        if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
            this.sliceInitPath = this.slicePathFunction(this.sliceHelper, this.maxPercent, this.sliceInitPathCustom);
        }
        else {
            this.sliceInitPath = this.slicePathFunction(this.sliceHelper, this.minPercent, this.sliceInitPathCustom);
        }
    }

    //Set sliceTransforms
    //Default
    if (this.sliceTransformFunction !== null) {
        this.sliceTransform = this.sliceTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.titleRotateAngle, this.itemIndex, this.sliceTransformCustom);
    }
    else {
        this.sliceTransform = sliceTransform().NullTransform;
    }

    //Selected
    if (this.sliceSelectedTransformFunction !== null) {
        this.selectTransform = this.sliceSelectedTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.titleRotateAngle, this.itemIndex, this.sliceSelectedTransformCustom);
    }
    else {
        this.selectTransform = sliceTransform().NullTransform;
    }

    //Hovered
    if (this.sliceHoverTransformFunction !== null) {
        this.hoverTransform = this.sliceHoverTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.titleRotateAngle, this.itemIndex, this.sliceHoverTransformCustom);
    }
    else {
        this.hoverTransform = sliceTransform().NullTransform;
    }

    //Initial transform
    if (this.sliceInitTransformFunction !== null) {
        this.initTransform = this.sliceInitTransformFunction(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.wheelRadius, this.baseAngle, this.sliceAngle, this.titleRotateAngle, this.itemIndex, this.sliceInitTransformCustom);
    }
    else {
        this.initTransform = sliceTransform().NullTransform;
    }

    //Set titles
    if (wheelnavTitle().isPathTitle(this.title)) {
        initNavTitle = new wheelnavTitle(this.title, this.wheelnav.raphael.raphael);
        basicNavTitleMin = new wheelnavTitle(this.title, this.wheelnav.raphael.raphael);
        basicNavTitleMax = new wheelnavTitle(this.title, this.wheelnav.raphael.raphael);
        hoverNavTitleMin = new wheelnavTitle(this.titleHover, this.wheelnav.raphael.raphael);
        hoverNavTitleMax = new wheelnavTitle(this.titleHover, this.wheelnav.raphael.raphael);
        selectedNavTitleMin = new wheelnavTitle(this.titleSelected, this.wheelnav.raphael.raphael);
        selectedNavTitleMax = new wheelnavTitle(this.titleSelected, this.wheelnav.raphael.raphael);
        this.navTitleSizeTransform = basicNavTitleMax.getTitleSizeTransform(this.titleWidth, this.titleHeight);
        this.navTitleSizeHoverTransform = hoverNavTitleMax.getTitleSizeTransform(this.titleHoverWidth, this.titleHoverHeight);
        this.navTitleSizeSelectedTransform = selectedNavTitleMax.getTitleSizeTransform(this.titleSelectedWidth, this.titleSelectedHeight);
    }
    else {
        initNavTitle = new wheelnavTitle(this.title);
        basicNavTitleMin = new wheelnavTitle(this.title);
        basicNavTitleMax = new wheelnavTitle(this.title);
        hoverNavTitleMin = new wheelnavTitle(this.titleHover);
        hoverNavTitleMax = new wheelnavTitle(this.titleHover);
        selectedNavTitleMin = new wheelnavTitle(this.titleSelected);
        selectedNavTitleMax = new wheelnavTitle(this.titleSelected);
    }

    this.initNavTitle = initNavTitle.getTitlePercentAttr(this.sliceInitPath.titlePosX, this.sliceInitPath.titlePosY, this.titleWidth, this.titleHeight);
    this.basicNavTitleMin = basicNavTitleMin.getTitlePercentAttr(this.slicePathMin.titlePosX, this.slicePathMin.titlePosY, this.titleWidth, this.titleHeight);
    this.basicNavTitleMax = basicNavTitleMax.getTitlePercentAttr(this.slicePathMax.titlePosX, this.slicePathMax.titlePosY, this.titleWidth, this.titleHeight);
    this.hoverNavTitleMin = hoverNavTitleMin.getTitlePercentAttr(this.hoverSlicePathMin.titlePosX, this.hoverSlicePathMin.titlePosY, this.titleHoverWidth, this.titleHoverHeight);
    this.hoverNavTitleMax = hoverNavTitleMax.getTitlePercentAttr(this.hoverSlicePathMax.titlePosX, this.hoverSlicePathMax.titlePosY, this.titleHoverWidth, this.titleHoverHeight);
    this.selectedNavTitleMin = selectedNavTitleMin.getTitlePercentAttr(this.selectedSlicePathMin.titlePosX, this.selectedSlicePathMin.titlePosY, this.titleSelectedWidth, this.titleSelectedHeight);
    this.selectedNavTitleMax = selectedNavTitleMax.getTitlePercentAttr(this.selectedSlicePathMax.titlePosX, this.selectedSlicePathMax.titlePosY, this.titleSelectedWidth, this.titleSelectedHeight);
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

wheelnavItem.prototype.getCurrentTitle = function () {
    var currentTitle;

    if (this.wheelnav.currentPercent === this.wheelnav.maxPercent) {
        if (this.selected) {
            currentTitle = this.selectedNavTitleMax;
        }
        else {
            if (this.hovered) {
                currentTitle = this.hoverNavTitleMax;
            }
            else {
                currentTitle = this.basicNavTitleMax;
            }
        }
    }
    else {
        if (this.selected) {
            currentTitle = this.selectedNavTitleMin;
        }
        else {
            if (this.hovered) {
                currentTitle = this.hoverNavTitleMin;
            }
            else {
                currentTitle = this.basicNavTitleMin;
            }
        }
    }

    return currentTitle;
};

wheelnavItem.prototype.getItemRotateString = function () {
    return "r," + (this.currentRotateAngle).toString() + "," + this.wheelnav.centerX + "," + this.wheelnav.centerY;
};

wheelnavItem.prototype.getTitleRotateString = function (withTitleRotateAngle) {

    var titleRotate = "";
    titleRotate += this.getItemRotateString();

    if (this.titleRotateAngle !== null && withTitleRotateAngle) {
        titleRotate += ",r," + (this.navAngle + this.titleRotateAngle).toString();
    }
    else {
        titleRotate += ",r," + (-this.currentRotateAngle).toString();
    }

    return titleRotate;
};

wheelnavTitle = function (title, raphael) {
    this.title = title;
    //Calculate relative path
    if (title !== null) {
        if (raphael !== undefined) {
            this.relativePath = raphael.pathToRelative(title);
            var bbox = raphael.pathBBox(this.relativePath);
            this.centerX = bbox.cx;
            this.centerY = bbox.cy;
            this.width = bbox.width;
            this.height = bbox.height;
            this.startX = this.relativePath[0][1];
            this.startY = this.relativePath[0][2];
        }
        this.title = title;
    }
    else {
        this.title = "";
    }

    this.isPathTitle = function (title) {
        if (title !== null &&
            (title.substr(0, 1) === "m" ||
            title.substr(0, 1) === "M") &&
            (title.substr(title.length - 1, 1) === "z" ||
            title.substr(title.length - 1, 1) === "Z") &&
            (title.indexOf(",") > -1 ||
            title.indexOf(" ") > -1)){
            return true;
        }
        else {
            return false;
        }
    };

    this.isImageTitle = function (title) {
        if (title === undefined) { title = this.title;}
        if (title !== null &&
            title.substr(0, 7) === "imgsrc:") {
            return true;
        }
        else {
            return false;
        }
    };

    return this;
};

wheelnavTitle.prototype.getTitlePercentAttr = function (currentX, currentY, titlewidth, titleheight) {

    var transformAttr = {};

    if (this.relativePath !== undefined) {
        var pathCx = currentX + (this.startX - this.centerX);
        var pathCy = currentY + (this.startY - this.centerY);

        this.relativePath[0][1] = pathCx;
        this.relativePath[0][2] = pathCy;

        transformAttr = {
            path: this.relativePath,
            title: this.title
        };
    }
    else {
        if (this.isImageTitle()) {
            transformAttr = {
                x: currentX - (titlewidth / 2),
                y: currentY - (titleheight / 2),
                width: titlewidth,
                height: titleheight,
                title: this.title,
                src: this.title.substr(7, this.title.length)
            };
        }
        else {
            transformAttr = {
                x: currentX,
                y: currentY,
                title: this.title
            };
        }
    }

    return transformAttr;
};

wheelnavTitle.prototype.getTitleSizeTransform = function (titlewidth, titleheight) {

    var transformAttr = "";

    //Calculate path width & height
    if (titlewidth !== null && titleheight !== null) {
        transformAttr = "s";
        if (this.height > this.width) {
            transformAttr += (titlewidth / this.height).toString() + ",";
            transformAttr += (titleheight / this.height).toString();
        }
        else {
            transformAttr += (titlewidth / this.width).toString() + ",";
            transformAttr += (titleheight / this.width).toString();
        }
    }

    return transformAttr;
};
