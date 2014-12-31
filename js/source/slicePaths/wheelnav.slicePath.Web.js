
this.WebSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);

    r = helper.sliceRadius;
    r = r * 0.9;
    helper.titleRadius = r * 0.55;
    x = helper.centerX;
    y = helper.centerY;

    helper.setTitlePos(x, y);

    startTheta = helper.startTheta;
    endTheta = helper.endTheta;

    slicePathString = [["M", x, y],
                 ["L", r * 1.1 * Math.cos(startTheta) + x, r * 1.1 * Math.sin(startTheta) + y],
                 ["M", x, y],
                 ["L", r * 1.1 * Math.cos(endTheta) + x, r * 1.1 * Math.sin(endTheta) + y],
                 ["M", r * 0.15 * Math.cos(startTheta) + x, r * 0.15 * Math.sin(startTheta) + y],
                 ["L", r * 0.15 * Math.cos(endTheta) + x, r * 0.15 * Math.sin(endTheta) + y],
                 ["M", r * 0.35 * Math.cos(startTheta) + x, r * 0.35 * Math.sin(startTheta) + y],
                 ["L", r * 0.35 * Math.cos(endTheta) + x, r * 0.35 * Math.sin(endTheta) + y],
                 ["M", r * 0.55 * Math.cos(startTheta) + x, r * 0.55 * Math.sin(startTheta) + y],
                 ["L", r * 0.55 * Math.cos(endTheta) + x, r * 0.55 * Math.sin(endTheta) + y],
                 ["M", r * 0.75 * Math.cos(startTheta) + x, r * 0.75 * Math.sin(startTheta) + y],
                 ["L", r * 0.75 * Math.cos(endTheta) + x, r * 0.75 * Math.sin(endTheta) + y],
                 ["M", r * 0.95 * Math.cos(startTheta) + x, r * 0.95 * Math.sin(startTheta) + y],
                 ["L", r * 0.95 * Math.cos(endTheta) + x, r * 0.95 * Math.sin(endTheta) + y],
                 ["z"]];

    //linePathString = [["M", arcBaseRadius * Math.cos(startTheta) + x, arcBaseRadius * Math.sin(startTheta) + y],
    //     ["A", arcRadius, arcRadius, 0, 0, 1, arcBaseRadius * Math.cos(endTheta) + x, arcBaseRadius * Math.sin(endTheta) + y]];

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};
