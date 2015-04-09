/* ======================================================================================= */
/* Default styles and available css classes                                                */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/css3.html          */
/* ======================================================================================= */

wheelnav.prototype.styleWheel = function () {
    if (!this.cssMode) {
        if (this.spreaderPathInAttr === undefined || this.spreaderPathInAttr === null) {
            this.spreaderPathInAttr = { fill: "#444", stroke: "#444", "stroke-width": 2, cursor: 'pointer' };
        }
        if (this.spreaderPathOutAttr === undefined || this.spreaderPathOutAttr === null) {
            this.spreaderPathOutAttr = { fill: "#444", stroke: "#444", "stroke-width": 2, cursor: 'pointer' };
        }
        if (this.spreaderTitleInAttr === undefined || this.spreaderTitleInAttr === null) {
            this.spreaderTitleInAttr = { fill: "#eee", stroke: "#444", cursor: 'pointer' };
        }
        if (this.spreaderTitleOutAttr === undefined || this.spreaderTitleOutAttr === null) {
            this.spreaderTitleOutAttr = { fill: "#eee", stroke: "#444", cursor: 'pointer' };
        }
        if (this.markerAttr === undefined || this.markerAttr === null) {
            this.markerAttr = { stroke: "#444", "stroke-width": 2 };
        }
    }
    else {
        this.spreaderPathInAttr = { "class": this.getSpreaderCssClass("in") };
        this.spreaderPathOutAttr = { "class": this.getSpreaderCssClass("out") };
        this.spreaderTitleInAttr = { "class": this.getSpreaderTitleCssClass("in") };
        this.spreaderTitleOutAttr = { "class": this.getSpreaderTitleCssClass("out") };
        this.markerAttr = { "class": this.getMarkerCssClass() };
    }
};

wheelnavItem.prototype.styleNavItem = function () {
    if (!this.wheelnav.cssMode) {
        this.slicePathAttr = { stroke: "#333", "stroke-width": 0, cursor: 'pointer', "fill-opacity": 1 };
        this.sliceHoverAttr = { stroke: "#222", "stroke-width": 0, cursor: 'pointer', "fill-opacity": 0.77 };
        this.sliceSelectedAttr = { stroke: "#111", "stroke-width": 0, cursor: 'default', "fill-opacity": 1 };

        this.titleAttr = { font: this.titleFont, fill: "#333", stroke: "none", cursor: 'pointer' };
        this.titleHoverAttr = { font: this.titleFont, fill: "#222", cursor: 'pointer', stroke: "none" };
        this.titleSelectedAttr = { font: this.titleFont, fill: "#fff", cursor: 'default' };

        this.linePathAttr = { stroke: "#444", "stroke-width": 1, cursor: 'pointer' };
        this.lineHoverAttr = { stroke: "#222", "stroke-width": 2, cursor: 'pointer' };
        this.lineSelectedAttr = { stroke: "#444", "stroke-width": 1, cursor: 'default' };
    }
    else {
        this.slicePathAttr = { "class": this.wheelnav.getSliceCssClass(this.wheelItemIndex, "basic") };
        this.sliceHoverAttr = { "class": this.wheelnav.getSliceCssClass(this.wheelItemIndex, "hover") };
        this.sliceSelectedAttr = { "class": this.wheelnav.getSliceCssClass(this.wheelItemIndex, "selected") };

        this.titleAttr = { "class": this.wheelnav.getTitleCssClass(this.wheelItemIndex, "basic") };
        this.titleHoverAttr = { "class": this.wheelnav.getTitleCssClass(this.wheelItemIndex, "hover") };
        this.titleSelectedAttr = { "class": this.wheelnav.getTitleCssClass(this.wheelItemIndex, "selected") };

        this.linePathAttr = { "class": this.wheelnav.getLineCssClass(this.wheelItemIndex, "basic") };
        this.lineHoverAttr = { "class": this.wheelnav.getLineCssClass(this.wheelItemIndex, "hover") };
        this.lineSelectedAttr = { "class": this.wheelnav.getLineCssClass(this.wheelItemIndex, "selected") };
    }

    this.sliceClickablePathAttr = { fill: "#FFF", stroke: "#FFF", "stroke-width": 0, cursor: 'pointer', "fill-opacity": 0.01 };
    this.sliceClickableHoverAttr = { stroke: "#FFF", "stroke-width": 0, cursor: 'pointer' };
    this.sliceClickableSelectedAttr = { stroke: "#FFF", "stroke-width": 0, cursor: 'default' };
}

wheelnav.prototype.getSliceCssClass = function (index, subclass) {
    return "wheelnav-" + this.holderId + "-slice-" + subclass + "-" + index;
};
wheelnav.prototype.getTitleCssClass = function (index, subclass) {
    return "wheelnav-" + this.holderId + "-title-" + subclass + "-" + index;
};
wheelnav.prototype.getLineCssClass = function (index, subclass) {
    return "wheelnav-" + this.holderId + "-line-" + subclass + "-" + index;
};
wheelnav.prototype.getSpreaderCssClass = function (state) {
    return "wheelnav-" + this.holderId + "-spreader-" + state;
};
wheelnav.prototype.getSpreaderTitleCssClass = function (state) {
    return "wheelnav-" + this.holderId + "-spreadertitle-" + state;
};
wheelnav.prototype.getMarkerCssClass = function () {
    return "wheelnav-" + this.holderId + "-marker";
};
