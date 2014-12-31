
this.WheelSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius * 0.9;

    startTheta = helper.startTheta;
    middleTheta = helper.middleTheta;
    endTheta = helper.endTheta;

    var innerRadiusPercent;

    if (helper.sliceAngle < 120) {
        helper.titleRadius = r * 0.57;
        innerRadiusPercent = 0.9;
    }
    else if (helper.sliceAngle < 180) {
        helper.titleRadius = r * 0.52;
        innerRadiusPercent = 0.91;
    }
    else {
        helper.titleRadius = r * 0.45;
        innerRadiusPercent = 0.873;
    }

    slicePathString = [["M", (r * 0.07) * Math.cos(middleTheta) + x, (r * 0.07) * Math.sin(middleTheta) + y],
         ["L", (r * 0.07) * Math.cos(middleTheta) + (r * 0.87) * Math.cos(startTheta) + x, (r * 0.07) * Math.sin(middleTheta) + (r * 0.87) * Math.sin(startTheta) + y],
         ["A", (r * innerRadiusPercent), (r * innerRadiusPercent), 0, 0, 1, (r * 0.07) * Math.cos(middleTheta) + (r * 0.87) * Math.cos(endTheta) + x, (r * 0.07) * Math.sin(middleTheta) + (r * 0.87) * Math.sin(endTheta) + y],
         ["z"]];

    linePathString = [["M", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
         ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
         ["A", r, r, 0, 0, 0, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y]];

    helper.setTitlePos(x, y);

    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};
