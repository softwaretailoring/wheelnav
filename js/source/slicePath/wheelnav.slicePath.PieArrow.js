
this.PieArrowSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.6;
    custom.arrowRadiusPercent = 1.1;

    return custom;
};

this.PieArrowSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieArrowSliceCustomization();
    }

    helper.setBaseValue(percent, custom);

    r = helper.sliceRadius;
    
    arrowAngleStart = helper.startAngle + helper.sliceAngle * 0.45;
    arrowAngleEnd = helper.startAngle + helper.sliceAngle * 0.55;

    var arrowRadius = r * custom.arrowRadiusPercent;

    slicePathString = [helper.MoveToCenter(),
                 helper.LineTo(helper.startAngle, r),
                 helper.ArcTo(r, arrowAngleStart, r),
                 helper.LineTo(helper.middleAngle, arrowRadius),
                 helper.LineTo(arrowAngleEnd, r),
                 helper.ArcTo(r, helper.endAngle, r),
                 helper.Close()];

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
