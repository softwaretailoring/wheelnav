/* ======================================================================================= */
/* Slice path definitions for core distribution. This stores only NullSlice and PieSlice.  */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

var slicePath = function () {

    this.helper = new slicePathHelper();

    this.NullSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    this.PieSliceCustomization = function () {

        var custom = new slicePathCustomization();
        custom.titleRadiusPercent = 0.6;
        return custom;
    };

    this.PieSlice = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom) {

        if (custom === null) {
            custom = PieSliceCustomization();
        }

        helper.setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, percent, custom);

        r = helper.sliceRadius;
        r = r * 0.9;
        helper.titleRadius = r * custom.titleRadiusPercent;

        helper.setTitlePos(x, y);

        startTheta = helper.startTheta;
        endTheta = helper.endTheta;

        slicePathString = [["M", x, y],
                     ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                     ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                     ["z"]];

        return {
            slicePathString: slicePathString,
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };

    return this;
};


