
this.DonutSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.minRadiusPercent = 0.37;
    custom.maxRadiusPercent = 0.9;

    return custom;
};

this.DonutSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = DonutSliceCustomization();
    }

    maxRadius = helper.wheelRadius * percent * custom.maxRadiusPercent;
    minRadius = helper.wheelRadius * percent * custom.minRadiusPercent;

    helper.setBaseValue(percent, custom);

    helper.titleRadius = (maxRadius + minRadius) / 2;
    helper.setTitlePos();

    slicePathString = [helper.MoveTo(helper.startAngle, minRadius),
                 helper.LineTo(helper.startAngle, maxRadius),
                 helper.ArcTo(maxRadius, helper.middleAngle, maxRadius),
                 helper.ArcTo(maxRadius, helper.endAngle, maxRadius),
                 helper.LineTo(helper.endAngle, minRadius),
                 helper.ArcBackTo(minRadius, helper.middleAngle, minRadius),
                 helper.ArcBackTo(minRadius, helper.startAngle, minRadius),
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
