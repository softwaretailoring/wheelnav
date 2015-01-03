
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

    slicePathString.push(helper.MoveToCenter());
    if (custom.isMoveTo === true) {
        slicePathString.push(helper.MoveTo(helper.middleAngle, helper.sliceRadius / 4));
    }
    if (custom.isLineTo) {
        slicePathString.push(helper.LineTo(helper.startAngle, helper.sliceRadius));
    }
    if (custom.isArcTo) {
        slicePathString.push(helper.ArcTo(helper.sliceRadius, helper.middleAngle, helper.sliceRadius));
    }
    if (custom.isArcBackTo) {
        slicePathString.push(helper.ArcBackTo(helper.sliceRadius, helper.endAngle, helper.sliceRadius));
    }
    slicePathString.push(helper.Close());

    linePathString = [helper.MoveToCenter(),
                 helper.LineTo(helper.startAngle, helper.sliceRadius),
                 helper.ArcTo(helper.sliceRadius, helper.endAngle, helper.sliceRadius),
                 helper.Close()];

    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};
