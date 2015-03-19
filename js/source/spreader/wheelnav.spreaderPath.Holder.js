
this.HolderSpreaderCustomization = function () {

    var custom = new spreaderPathCustomization();
    custom.minRadiusPercent = 0.5;
    custom.menuRadius = 37;

    return custom;
};

this.HolderSpreader = function (helper, percent, custom) {

    if (custom === null) {
        custom = HolderSpreaderCustomization();
    }

    helper.setBaseValue(custom.spreaderPercent * percent, custom);
    rbase = helper.wheelRadius * custom.spreaderPercent * custom.minRadiusPercent * percent;
    r = helper.sliceRadius;

    spreaderPathString = [];

    sliceAngle = helper.sliceAngle / helper.navItemCount;
    baseAngle = helper.navAngle;
    if (helper.endAngle - helper.startAngle < 360) {
        baseAngle = helper.startAngle;
        helper.StartSpreader(spreaderPathString, baseAngle, rbase);
    }
    else {
        spreaderPathString.push(helper.MoveTo(helper.startAngle + (helper.navAngle + sliceAngle / 2), rbase));
    }

    for (var i = 0; i < helper.navItemCount; i++) {
        startAngle = i * sliceAngle + (baseAngle + sliceAngle / 2);
        middleAngle = startAngle + (sliceAngle / 4);
        endAngle = startAngle + sliceAngle;

        if (helper.endAngle - helper.startAngle < 360) {
            if (i === helper.navItemCount - 1) { endAngle = middleAngle; }
        }
        else {
            spreaderPathString.push(helper.LineTo(startAngle, rbase));
        }

        spreaderPathString.push(helper.LineTo(startAngle, r));
        spreaderPathString.push(helper.ArcBackTo(custom.menuRadius, middleAngle, rbase));
        spreaderPathString.push(helper.ArcTo(custom.menuRadius, endAngle, r));
    }

    spreaderPathString.push(helper.Close());

    return {
        spreaderPathString: spreaderPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

