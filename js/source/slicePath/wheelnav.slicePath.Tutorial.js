
this.TutorialSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.6;
    custom.isMoveTo = false;
    custom.isLineTo = false;
    custom.isArcTo = false;
    custom.isArcBackTo = false;
    return custom;
};

this.TutorialSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = TutorialSliceCustomization();
    }

    helper.setBaseValue(percent, custom);

    slicePathString = [];
    titlePathString = [];

    slicePathString.push(helper.MoveToCenter());
    titlePathRadius1 = helper.titleRadius;
    titlePathRadius2 = helper.titleRadius;
    titlePathEndangle = helper.startAngle;
    titlePathStartRadius = 0;

    if (custom.isMoveTo === true) {
        slicePathString.push(helper.MoveTo(helper.middleAngle, helper.sliceRadius / 4));
        titlePathRadius1 *= 1.05;
        titlePathRadius2 *= 0.95;
        titlePathStartRadius += helper.sliceRadius / 16;
        titlePathEndangle = helper.startAngle + (helper.sliceAngle / 8);
    }
    if (custom.isLineTo) {
        slicePathString.push(helper.LineTo(helper.startAngle, helper.sliceRadius));
        titlePathRadius1 *= 1.1;
        titlePathRadius2 *= 0.9;
        titlePathStartRadius += helper.sliceRadius / 16;
        titlePathEndangle = helper.startAngle + (helper.sliceAngle / 4);
    }
    if (custom.isArcTo) {
        slicePathString.push(helper.ArcTo(helper.sliceRadius, helper.middleAngle, helper.sliceRadius));
        titlePathRadius1 *= 1.2;
        titlePathRadius2 *= 0.8;
        titlePathStartRadius += helper.sliceRadius / 8;
        titlePathEndangle = helper.middleAngle - (helper.sliceAngle / 8);
    }
    if (custom.isArcBackTo) {
        slicePathString.push(helper.ArcBackTo(helper.sliceRadius, helper.endAngle, helper.sliceRadius));
        titlePathRadius1 *= 1.3;
        titlePathRadius2 *= 0.7;
        titlePathStartRadius += helper.sliceRadius / 8;
        titlePathEndangle = helper.endAngle;
    }
    slicePathString.push(helper.Close());

    titlePathString.push(helper.MoveTo(helper.startAngle, titlePathStartRadius));
    titlePathString.push(helper.CubicBezierTo(helper.middleAngle - (helper.sliceAngle / 8), titlePathRadius1, helper.middleAngle + (helper.sliceAngle / 8), titlePathRadius2, titlePathEndangle, helper.sliceRadius));

    linePathString = [helper.MoveToCenter(),
                 helper.LineTo(helper.startAngle, helper.sliceRadius),
                 helper.ArcTo(helper.sliceRadius, helper.middleAngle, helper.sliceRadius),
                 helper.ArcTo(helper.sliceRadius, helper.endAngle, helper.sliceRadius),
                 helper.Close()];

    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};
