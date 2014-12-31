
this.EyeSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    r = r * 0.7;

    helper.titleRadius = r * 0.87;
    helper.setTitlePos(x, y);

    if (percent === 0) {
        r = 0.01;
    }

    startTheta = helper.startTheta;
    endTheta = helper.endTheta;

    if (helper.sliceAngle === 180) {
        startTheta = helper.getTheta(helper.startAngle + helper.sliceAngle / 4);
        endTheta = helper.getTheta(helper.startAngle + helper.sliceAngle - helper.sliceAngle / 4);
    }

    slicePathString = [["M", r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                ["z"]];

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};
