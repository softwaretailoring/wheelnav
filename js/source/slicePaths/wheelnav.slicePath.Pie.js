
this.PieSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.6;
    custom.arcBaseRadiusPercent = 1;
    custom.arcRadiusPercent = 1;
    custom.startRadiusPercent = 0;
    return custom;
};

this.PieSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    r = r * 0.9;
    helper.titleRadius = r * custom.titleRadiusPercent;

    helper.setTitlePos(x, y);

    startTheta = helper.startTheta;
    endTheta = helper.endTheta;

    var arcBaseRadius = r * custom.arcBaseRadiusPercent;
    var arcRadius = r * custom.arcRadiusPercent;
    var startX = custom.startRadiusPercent * r * Math.cos(helper.middleTheta) + x;
    var startY = custom.startRadiusPercent * r * Math.sin(helper.middleTheta) + y;

    slicePathString = [["M", startX, startY],
                 ["L", arcBaseRadius * Math.cos(startTheta) + x, arcBaseRadius * Math.sin(startTheta) + y],
                 ["A", arcRadius, arcRadius, 0, 0, 1, arcBaseRadius * Math.cos(endTheta) + x, arcBaseRadius * Math.sin(endTheta) + y],
                 ["z"]];

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

this.FlowerSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieSliceCustomization();
        custom.titleRadiusPercent = 0.5;
        custom.arcBaseRadiusPercent = 0.65;
        custom.arcRadiusPercent = 0.14;
    }

    var slicePath = PieSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY
    };
};
