
this.StarSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.44;
    custom.minRadiusPercent = 0.5;
    custom.isBasePieSlice = false;

    return custom;
};

this.StarSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = StarSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    rbase = r * custom.minRadiusPercent;

    startTheta = helper.startTheta;
    middleTheta = helper.middleTheta;
    endTheta = helper.endTheta;

    if (custom.isBasePieSlice) {
        r = r * 0.9;
        slicePathString = [["M", x, y],
                 ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                 ["A", r, r, 0, 0, 1, r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                 ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                 ["z"]];
    }
    else {
        slicePathString = [["M", x, y],
                     ["L", (rbase * Math.cos(startTheta)) + x, (rbase * Math.sin(startTheta)) + y],
                     ["L", r * Math.cos(middleTheta) + x, r * Math.sin(middleTheta) + y],
                     ["L", (rbase * Math.cos(endTheta)) + x, (rbase * Math.sin(endTheta)) + y],
                     ["z"]];
    }

    helper.titleRadius = r * custom.titleRadiusPercent;
    helper.setTitlePos(x, y);

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

this.StarBasePieSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = StarSliceCustomization();
    }

    custom.titleRadiusPercent = 0.6;
    custom.isBasePieSlice = true;

    var slicePath = StarSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY
    };
};
