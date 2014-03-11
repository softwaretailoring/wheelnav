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
