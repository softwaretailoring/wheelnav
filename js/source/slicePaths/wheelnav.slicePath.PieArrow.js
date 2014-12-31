
this.PieArrowSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.arrowRadiusPercent = 1.1;

    return custom;
};

this.PieArrowSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieArrowSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    r = r * 0.9;

    startTheta = helper.startTheta;
    middleTheta = helper.middleTheta;
    endTheta = helper.endTheta;

    theta1 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.45);
    theta2 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.55);

    var arrowRadius = r * custom.arrowRadiusPercent;

    slicePathString = [["M", x, y],
                 ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                 ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
                 ["L", arrowRadius * Math.cos(middleTheta) + x, arrowRadius * Math.sin(middleTheta) + y],
                 ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
                 ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                 ["z"]];

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

this.PieArrowBasePieSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieArrowSliceCustomization();
    }

    custom.arrowRadiusPercent = 1;
    var slicePath = PieArrowSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY
    };
};
