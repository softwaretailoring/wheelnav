
this.YinYangSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    r = r * 0.9;

    startTheta = helper.startTheta;
    endTheta = helper.endTheta;

    slicePathString = [["M", x, y],
                 ["A", r / 2, r / 2, 0, 0, 1, r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                 ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                 ["A", r / 2, r / 2, 0, 0, 0, x, y],
                 ["z"]];

    titlePosX = r / 2 * Math.cos(startTheta) + x;
    titlePosY = r / 2 * Math.sin(startTheta) + y;

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: titlePosX,
        titlePosY: titlePosY
    };
};
