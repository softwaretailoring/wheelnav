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
    var slicePath = this.getSlicePath(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.navWheelSugar, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex, 1);
    this.titlePosX = slicePath.titlePosX;
    this.titlePosY = slicePath.titlePosY;

    this.selectTransform = this.getSelectTransform(this.wheelnav.centerX, this.wheelnav.centerY, this.wheelnav.navWheelSugar, this.wheelnav.baseAngle, this.wheelnav.sliceAngle, this.itemIndex);

    //Create slice
    var currentSlice = this.wheelnav.raphael.path(slicePath.slicePathString);
    currentSlice.attr(this.slicePathAttr);
    currentSlice.attr(this.fillAttr);
    currentSlice.id = this.wheelnav.getSliceId(this.itemIndex);
    currentSlice.node.id = currentSlice.id;

    //Create title
    var currentTitle;
    //Title defined by path
    if (this.title.substr(0, 1) == "M" &&
        this.title.substr(this.title.length - 1, 1) == "z") {

        //Calculate reletive path
        var relativePath = this.wheelnav.raphael.raphael.pathToRelative(this.title);
        var startX = relativePath[0][1];
        var startY = relativePath[0][2];
        var pathBBox = this.wheelnav.raphael.raphael.pathBBox(relativePath);
        var pathCx = this.titlePosX + (startX - pathBBox.cx);
        var pathCy = this.titlePosY + (startY - pathBBox.cy);
        relativePath[0] = "M," + pathCx + "," + pathCy;

        currentTitle = this.wheelnav.raphael.path(relativePath).attr(this.titleAttr);
    }
    //Title defined by text
    else {
        currentTitle = this.wheelnav.raphael.text(this.titlePosX, this.titlePosY, this.title).attr(this.titleAttr);
    }

    currentTitle.id = this.wheelnav.getTitleId(this.itemIndex);
    currentTitle.node.id = currentTitle.id;

    var titleRotateString = this.getTitleRotateString();
    currentTitle.attr({ currentTransform: titleRotateString });
    currentTitle.attr({ transform: titleRotateString });

    //Create linepath
    var navLine = this.wheelnav.raphael.path(slicePath.linePathString).attr(this.linePathAttr).toBack();
    navLine.id = this.wheelnav.getLineId(this.itemIndex);
    
    //Create item set
    var currentItem = this.wheelnav.raphael.set();
    currentItem.push(
        currentSlice,
        currentTitle
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
        var navSlice = this.wheelnav.raphael.getById(this.wheelnav.getSliceId(i));
        var navTitle = this.wheelnav.raphael.getById(this.wheelnav.getTitleId(i));
        var navLine = this.wheelnav.raphael.getById(this.wheelnav.getLineId(i));

        if (isEnter && i == hovered && i != this.wheelnav.currentClick) {
            navSlice.attr(this.wheelnav.navItems[i].sliceHoverAttr);
            navTitle.attr(this.wheelnav.navItems[i].titleHoverAttr);
            navLine.attr(this.wheelnav.navItems[i].lineHoverAttr);
        }
        else {
            if (i == this.wheelnav.currentClick) {
                navSlice.attr(this.wheelnav.navItems[i].sliceSelectedAttr);
                navTitle.attr(this.wheelnav.navItems[i].titleSelectedAttr);
                navLine.attr(this.wheelnav.navItems[i].lineSelectedAttr);
            }
            else {
                navSlice.attr(this.wheelnav.navItems[i].slicePathAttr);
                navSlice.attr(this.wheelnav.navItems[i].fillAttr);
                navTitle.attr(this.wheelnav.navItems[i].titleAttr);
                navLine.attr(this.wheelnav.navItems[i].linePathAttr);
            }
        }
    }
};

wheelnavItem.prototype.getItemRotateString = function () {
    return "r," + this.currentRotate + "," + this.wheelnav.centerX + "," + this.wheelnav.centerY;
}

wheelnavItem.prototype.getTitleRotateString = function () {

    if (this.wheelnav.titleRotate) {
        var titleRotate = this.itemIndex * (360 / this.wheelnav.navItemCount);
        return this.getItemRotateString() + ",r" + titleRotate;
    }
    else {
        return this.getItemRotateString() + ",r" + (-this.currentRotate).toString();
    }
}