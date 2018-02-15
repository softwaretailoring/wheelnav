
this.EyeSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.68;

    return custom;
};

this.EyeSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = EyeSliceCustomization();
    }

    helper.setBaseValue(percent, custom);

    r = helper.wheelRadius * percent * 0.7;

    if (percent === 0) {
        r = 0.01;
    }

    startAngle = helper.startAngle;
    endAngle = helper.endAngle;

    if (helper.sliceAngle === 180) {
        startAngle = helper.startAngle + helper.sliceAngle / 4;
        endAngle = helper.startAngle + helper.sliceAngle - helper.sliceAngle / 4;
    }

    slicePathString = [helper.MoveTo(endAngle, r),
                 helper.ArcTo(r, startAngle, r),
                 helper.ArcTo(r, endAngle, r),
                 helper.Close()];

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};
