
this.TriangleMarkerCustomization = function () {

    var custom = new markerPathCustomization();
    custom.arcBaseRadiusPercent = 1.09;
    custom.arcRadiusPercent = 1.2;
    custom.startRadiusPercent = 0;
    return custom;
};

this.TriangleMarker = function (helper, percent, custom) {

    if (custom === null) {
        custom = TriangleMarkerCustomization();
    }

    helper.setBaseValue(custom.markerPercent * percent, custom);

    var arcBaseRadius = helper.sliceRadius * custom.arcBaseRadiusPercent;
    var arcRadius = helper.sliceRadius * custom.arcRadiusPercent;
    var startAngle = helper.startAngle + helper.sliceAngle * 0.46;
    var endAngle = helper.startAngle + helper.sliceAngle * 0.54;

    markerPathString = [helper.MoveTo(helper.navAngle, arcBaseRadius),
                 helper.LineTo(startAngle, arcRadius),
                 helper.LineTo(endAngle, arcRadius),
                 helper.Close()];
    
    return {
        markerPathString: markerPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

