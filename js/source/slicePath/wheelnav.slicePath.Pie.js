
this.PieSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.6;
    custom.arcBaseRadiusPercent = 1;
    custom.arcRadiusPercent = 1;
    custom.startRadiusPercent = 0;
    return custom;
};

this.PieSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieSliceCustomization();
    }

    helper.setBaseValue(percent, custom);

    var arcBaseRadius = helper.sliceRadius * custom.arcBaseRadiusPercent;
    var arcRadius = helper.sliceRadius * custom.arcRadiusPercent;
    
    slicePathString = [];
    slicePathString.push(helper.MoveTo(helper.middleAngle, custom.startRadiusPercent * helper.sliceRadius));
    slicePathString.push(helper.LineTo(helper.startAngle, arcBaseRadius));
    if (helper.sliceAngle > 180) {
        slicePathString.push(helper.ArcTo(arcRadius, helper.middleAngle, arcBaseRadius));
    }
    slicePathString.push(helper.ArcTo(arcRadius, helper.endAngle, arcBaseRadius));
    slicePathString.push(helper.Close());

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};

this.FlowerSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = PieSliceCustomization();
        custom.titleRadiusPercent = 0.5;
        custom.arcBaseRadiusPercent = 0.65;
        custom.arcRadiusPercent = 0.14;
    }

    var slicePath = PieSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY,
        titlePathString: slicePath.titlePathString
    };
};
