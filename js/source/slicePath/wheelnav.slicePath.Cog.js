
this.CogSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.55;
    custom.isBasePieSlice = false;

    return custom;
};

this.CogSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = CogSliceCustomization();
    }

    helper.setBaseValue(percent, custom);

    r = helper.sliceRadius;
    rbase = helper.wheelRadius * percent * 0.83;

    percentAngle0625 = helper.startAngle + helper.sliceAngle * 0.0625;
    percentAngle1250 = helper.startAngle + helper.sliceAngle * 0.125;
    percentAngle1875 = helper.startAngle + helper.sliceAngle * 0.1875;
    percentAngle2500 = helper.startAngle + helper.sliceAngle * 0.25;
    percentAngle3125 = helper.startAngle + helper.sliceAngle * 0.3125;
    percentAngle3750 = helper.startAngle + helper.sliceAngle * 0.375;
    percentAngle4375 = helper.startAngle + helper.sliceAngle * 0.4375;
    percentAngle5000 = helper.startAngle + helper.sliceAngle * 0.5;
    percentAngle5625 = helper.startAngle + helper.sliceAngle * 0.5625;
    percentAngle6250 = helper.startAngle + helper.sliceAngle * 0.625;
    percentAngle6875 = helper.startAngle + helper.sliceAngle * 0.6875;
    percentAngle7500 = helper.startAngle + helper.sliceAngle * 0.75;
    percentAngle8125 = helper.startAngle + helper.sliceAngle * 0.8125;
    percentAngle8750 = helper.startAngle + helper.sliceAngle * 0.875;
    percentAngle9375 = helper.startAngle + helper.sliceAngle * 0.9375;
    percentAngle9687 = helper.startAngle + helper.sliceAngle * 0.96875;

    if (custom.isBasePieSlice) {
        r = rbase;
        slicePathString = [helper.MoveToCenter(),
            helper.LineTo(helper.startAngle, r),
            helper.ArcTo(r, percentAngle0625, r),
            helper.ArcTo(r, percentAngle1250, r),
            helper.ArcTo(r, percentAngle1875, r),
            helper.ArcTo(r, percentAngle2500, r),
            helper.ArcTo(r, percentAngle3125, r),
            helper.ArcTo(r, percentAngle3750, r),
            helper.ArcTo(r, percentAngle4375, r),
            helper.ArcTo(r, percentAngle5000, r),
            helper.ArcTo(r, percentAngle5625, r),
            helper.ArcTo(r, percentAngle6250, r),
            helper.ArcTo(r, percentAngle6875, r),
            helper.ArcTo(r, percentAngle7500, r),
            helper.ArcTo(r, percentAngle8125, r),
            helper.ArcTo(r, percentAngle8750, r),
            helper.ArcTo(r, percentAngle9375, r),
            helper.ArcTo(r, percentAngle9687, r),
            helper.ArcTo(r, helper.endAngle, r),
            helper.Close()];
    }
    else {
        slicePathString = [helper.MoveToCenter(),
            helper.LineTo(helper.startAngle, r),
            helper.ArcTo(r, percentAngle0625, r),
            helper.LineTo(percentAngle0625, rbase),
            helper.ArcTo(rbase, percentAngle1875, rbase),
            helper.LineTo(percentAngle1875, r),
            helper.ArcTo(r, percentAngle3125, r),
            helper.LineTo(percentAngle3125, rbase),
            helper.ArcTo(rbase, percentAngle4375, rbase),
            helper.LineTo(percentAngle4375, r),
            helper.ArcTo(r, percentAngle5625, r),
            helper.LineTo(percentAngle5625, rbase),
            helper.ArcTo(rbase, percentAngle6875, rbase),
            helper.LineTo(percentAngle6875, r),
            helper.ArcTo(r, percentAngle8125, r),
            helper.LineTo(percentAngle8125, rbase),
            helper.ArcTo(rbase, percentAngle9375, rbase),
            helper.LineTo(percentAngle9375, r),
            helper.ArcTo(r, helper.endAngle, r),
            helper.Close()];
    }

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};

this.CogBasePieSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = CogSliceCustomization();
    }

    custom.isBasePieSlice = true;

    var slicePath = CogSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY,
        titlePathString: slicePath.titlePathString
    };
};
