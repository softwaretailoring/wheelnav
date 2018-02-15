
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
    titlePathString.push(helper.MoveToCenter());

    if (custom.isMoveTo === true) {
        var moveTo = helper.MoveTo(helper.middleAngle, helper.sliceRadius / 4);
        slicePathString.push(moveTo);
        titlePathString.push(moveTo);
    }
    if (custom.isLineTo) {
        var lineTo = helper.LineTo(helper.startAngle, helper.sliceRadius);
        slicePathString.push(lineTo);
        titlePathString.push(lineTo);
    }
    if (custom.isArcTo) {
        var arcTo = helper.ArcTo(helper.sliceRadius, helper.middleAngle, helper.sliceRadius);
        slicePathString.push(arcTo);
        titlePathString.push(arcTo);
    }
    if (custom.isArcBackTo) {
        var arcBackTo = helper.ArcBackTo(helper.sliceRadius, helper.endAngle, helper.sliceRadius);
        slicePathString.push(arcBackTo);
        titlePathString.push(arcBackTo);
    }
    slicePathString.push(helper.Close());

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
