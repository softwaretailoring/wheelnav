
this.MenuSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.menuRadius = 35;
    custom.titleRadiusPercent = 0.63;
    custom.isSelectedLine = false;
    custom.lineBaseRadiusPercent = 0;

    return custom;
};

this.MenuSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = MenuSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    var r = helper.wheelRadius * percent;
    helper.titleRadius = r * custom.titleRadiusPercent;
    helper.setTitlePos();

    var menuRadius = percent * custom.menuRadius;

    if (percent <= 0.05) { menuRadius = 10; }

    middleTheta = helper.middleTheta;

    slicePathString = [["M", helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX + (menuRadius * Math.cos(middleTheta)), helper.titlePosY + (menuRadius * Math.sin(middleTheta))],
                ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                ["z"]];

    if (percent <= 0.05) {
        linePathString = [["M", x, y],
                ["A", 1, 1, 0, 0, 1, x + 1, y + 1]];
    }
    else {
        if (!custom.isSelectedLine) {
            linePathString = [helper.MoveTo(helper.middleAngle, custom.lineBaseRadiusPercent * r),
                              helper.ArcTo(r / 2, helper.middleAngle, helper.titleRadius - menuRadius)];
        }
        else {
            linePathString = [helper.MoveTo(helper.middleAngle, custom.lineBaseRadiusPercent * r),
                              helper.ArcTo(r / 3, helper.middleAngle, helper.titleRadius - menuRadius)];
        }
    }

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};

this.MenuSliceSelectedLine = function (helper, percent, custom) {

    if (custom === null) {
        custom = MenuSliceCustomization();
    }

    custom.isSelectedLine = true;

    var slicePath = MenuSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: slicePath.linePathString,
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY,
        titlePathString: slicePath.titlePathString
    };
};

this.MenuSliceWithoutLine = function (helper, percent, custom) {

    var slicePath = MenuSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY,
        titlePathString: slicePath.titlePathString
    };
};
