
this.WinterSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.85;
    custom.arcRadiusPercent = 1;
    return custom;
};

this.WinterSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = WinterSliceCustomization();
    }

    helper.setBaseValue(percent, custom);

    sliceAngle = helper.sliceAngle;

    parallelAngle = helper.startAngle + sliceAngle / 4;
    parallelAngle2 = helper.startAngle + ((sliceAngle / 4) * 3);
    borderAngle1 = helper.startAngle + (sliceAngle / 200);
    borderAngle2 = helper.startAngle + (sliceAngle / 2) - (sliceAngle / 200);
    borderAngle3 = helper.startAngle + (sliceAngle / 2) + (sliceAngle / 200);
    borderAngle4 = helper.startAngle + sliceAngle - (sliceAngle / 200);

    var arcRadius = helper.sliceRadius * custom.arcRadiusPercent;

    slicePathString = [helper.MoveToCenter(),
                 helper.MoveTo(parallelAngle, arcRadius / 100),
                 helper.LineTo(borderAngle1, arcRadius / 2),
                 helper.LineTo(parallelAngle, arcRadius - (arcRadius / 100)),
                 helper.LineTo(borderAngle2, arcRadius / 2),
                 helper.LineTo(parallelAngle, arcRadius / 100),
                 helper.MoveTo(parallelAngle2, arcRadius / 100),
                 helper.LineTo(borderAngle4, arcRadius / 2),
                 helper.LineTo(parallelAngle2, arcRadius - (arcRadius / 100)),
                 helper.LineTo(borderAngle3, arcRadius / 2),
                 helper.LineTo(parallelAngle2, arcRadius / 100),
                 helper.Close()];

    linePathString = [helper.MoveTo(parallelAngle, arcRadius),
                 helper.LineTo(borderAngle2, arcRadius / 2),
                 helper.MoveTo(borderAngle3, arcRadius / 2),
                 helper.LineTo(parallelAngle2, arcRadius)];

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};
