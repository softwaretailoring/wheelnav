
this.OuterStrokeSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    innerRadius = r / 4;

    if (helper.sliceAngle < 120) { helper.titleRadius = r * 0.57; }
    else if (helper.sliceAngle < 180) { helper.titleRadius = r * 0.52; }
    else { helper.titleRadius = r * 0.45; }

    linePathString = [helper.MoveTo(helper.startAngle, innerRadius),
                 helper.LineTo(helper.startAngle, r),
                 helper.MoveTo(helper.endAngle, innerRadius),
                 helper.LineTo(helper.endAngle, r)];

    slicePathString = [helper.MoveTo(helper.startAngle, r),
                 helper.ArcTo(r, helper.middleAngle, r),
                 helper.ArcTo(r, helper.endAngle, r),
                 helper.ArcBackTo(r, helper.middleAngle, r),
                 helper.ArcBackTo(r, helper.startAngle, r),
                 helper.MoveTo(helper.startAngle, innerRadius),
                 helper.ArcTo(innerRadius, helper.middleAngle, innerRadius),
                 helper.ArcTo(innerRadius, helper.endAngle, innerRadius),
                 helper.ArcBackTo(innerRadius, helper.middleAngle, innerRadius),
                 helper.ArcBackTo(innerRadius, helper.startAngle, innerRadius)];

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
