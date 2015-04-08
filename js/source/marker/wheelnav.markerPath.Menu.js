
this.MenuMarkerCustomization = function () {

    var custom = new markerPathCustomization();
    custom.menuRadius = 40;
    custom.titleRadiusPercent = 0.63;
    custom.lineBaseRadiusPercent = 0;
    return custom;
};

this.MenuMarker = function (helper, percent, custom) {

    if (custom === null) {
        custom = MenuMarkerCustomization();
    }

    helper.setBaseValue(custom.markerPercent * percent, custom);

    x = helper.centerX;
    y = helper.centerY;

    helper.titleRadius = helper.wheelRadius * custom.titleRadiusPercent * percent;
    helper.setTitlePos();

    var menuRadius = custom.menuRadius * percent;
    if (percent <= 0.05) { menuRadius = 11; }

    middleTheta = helper.middleTheta;

    markerPathString = [["M", helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX + (menuRadius * Math.cos(middleTheta)), helper.titlePosY + (menuRadius * Math.sin(middleTheta))],
                ["A", menuRadius, menuRadius, 0, 0, 1, helper.titlePosX - (menuRadius * Math.cos(middleTheta)), helper.titlePosY - (menuRadius * Math.sin(middleTheta))],
                ["z"]];
    
    return {
        markerPathString: markerPathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

