
this.WheelSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;

    startTheta = helper.startTheta;
    middleTheta = helper.middleTheta;
    endTheta = helper.endTheta;

    var innerRadiusPercent;
    var startendRadiusPercent;

    if (helper.sliceAngle < 120) {
        helper.titleRadius = r * 0.57;
        innerRadiusPercent = 0.9;
        middleRadiusPercent = 0.87;
        startendRadiusPercent = 0.87;
    }
    else if (helper.sliceAngle < 180) {
        helper.titleRadius = r * 0.52;
        innerRadiusPercent = 0.91;
        middleRadiusPercent = 0.87;
        startendRadiusPercent = 0.87;
    }
    else {
        helper.titleRadius = r * 0.45;
        innerRadiusPercent = 0.873;
        middleRadiusPercent = 0.87;
        startendRadiusPercent = 0.94;
    }

    slicePathString = [helper.MoveTo(helper.middleAngle, r * 0.07),
                 ["L", (r * 0.07) * Math.cos(middleTheta) + (r * startendRadiusPercent) * Math.cos(startTheta) + x, (r * 0.07) * Math.sin(middleTheta) + (r * startendRadiusPercent) * Math.sin(startTheta) + y],
                 ["A", (r * innerRadiusPercent), (r * innerRadiusPercent), 0, 0, 1, (r * 0.07) * Math.cos(middleTheta) + (r * middleRadiusPercent) * Math.cos(middleTheta) + x, (r * 0.07) * Math.sin(middleTheta) + (r * middleRadiusPercent) * Math.sin(middleTheta) + y],
                 ["A", (r * innerRadiusPercent), (r * innerRadiusPercent), 0, 0, 1, (r * 0.07) * Math.cos(middleTheta) + (r * startendRadiusPercent) * Math.cos(endTheta) + x, (r * 0.07) * Math.sin(middleTheta) + (r * startendRadiusPercent) * Math.sin(endTheta) + y],
                 helper.Close()];

    linePathString = [helper.MoveTo(helper.startAngle, r),
                 helper.ArcTo(r, helper.middleAngle, r),
                 helper.ArcTo(r, helper.endAngle, r),
                 helper.ArcBackTo(r, helper.middleAngle, r),
                 helper.ArcBackTo(r, helper.startAngle, r)];

    helper.setTitlePos();

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};
