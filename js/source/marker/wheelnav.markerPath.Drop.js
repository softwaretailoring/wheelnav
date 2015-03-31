
this.DropMarkerCustomization = function () {

    var custom = new markerPathCustomization();
    custom.dropBaseRadiusPercent = 0;
    custom.dropRadiusPercent = 0.15;
    return custom;
};

this.DropMarker = function (helper, percent, custom) {

    if (custom === null) {
        custom = DropMarkerCustomization();
    }

    helper.setBaseValue(custom.markerPercent * percent, custom);

    var arcBaseRadius = helper.sliceRadius * custom.dropBaseRadiusPercent;
    var startAngle = helper.startAngle + helper.sliceAngle * 0.2;
    var startAngle2 = helper.startAngle;
    var endAngle = helper.startAngle + helper.sliceAngle * 0.8;
    var endAngle2 = helper.startAngle + helper.sliceAngle;
    var dropRadius = helper.sliceRadius * custom.dropRadiusPercent;

    markerPathString = [helper.MoveTo(0, dropRadius),
        helper.ArcTo(dropRadius, 180, dropRadius),
        helper.ArcTo(dropRadius, 360, dropRadius),
        helper.MoveTo(helper.navAngle, arcBaseRadius),
                helper.LineTo(startAngle, dropRadius),
                 helper.LineTo(startAngle2, dropRadius),
                 helper.LineTo(helper.navAngle, dropRadius * 1.6),
                helper.LineTo(endAngle2, dropRadius),
                 helper.LineTo(endAngle, dropRadius),
                 helper.Close()];
    return {
        markerPathString: markerPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

