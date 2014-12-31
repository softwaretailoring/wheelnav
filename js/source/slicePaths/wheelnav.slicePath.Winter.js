
this.WinterSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.85;
    custom.arcBaseRadiusPercent = 1;
    custom.arcRadiusPercent = 1;
    custom.startRadiusPercent = 0;
    return custom;
};

this.WinterSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = WinterSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;
    r = r * 0.9;
    helper.titleRadius = r * custom.titleRadiusPercent;

    helper.setTitlePos(x, y);

    startTheta = helper.startTheta;
    middleTheta = helper.middleTheta;
    endTheta = helper.endTheta;
    sliceAngle = helper.sliceAngle;

    parallelTheta = helper.getTheta(helper.startAngle + sliceAngle / 4);
    parallelTheta2 = helper.getTheta(helper.startAngle + ((sliceAngle / 4) * 3));
    borderTheta1 = helper.getTheta(helper.startAngle + (sliceAngle / 200));
    borderTheta2 = helper.getTheta(helper.startAngle + (sliceAngle / 2) - (sliceAngle / 200));
    borderTheta3 = helper.getTheta(helper.startAngle + (sliceAngle / 2) + (sliceAngle / 200));
    borderTheta4 = helper.getTheta(helper.startAngle + sliceAngle - (sliceAngle / 200));

    var arcBaseRadius = r * custom.arcBaseRadiusPercent;
    var arcRadius = r * custom.arcRadiusPercent;

    slicePathString = [["M", x, y],
                 ["M", (arcBaseRadius / 100) * Math.cos(parallelTheta) + x, (arcBaseRadius / 100) * Math.sin(parallelTheta) + y],
                 ["L", (arcBaseRadius / 2) * Math.cos(borderTheta1) + x, (arcBaseRadius / 2) * Math.sin(borderTheta1) + y],
                 ["L", (arcBaseRadius - (arcBaseRadius / 100)) * Math.cos(parallelTheta) + x, (arcBaseRadius - (arcBaseRadius / 100)) * Math.sin(parallelTheta) + y],
                 ["L", (arcBaseRadius / 2) * Math.cos(borderTheta2) + x, (arcBaseRadius / 2) * Math.sin(borderTheta2) + y],
                 ["L", (arcBaseRadius / 100) * Math.cos(parallelTheta) + x, (arcBaseRadius / 100) * Math.sin(parallelTheta) + y],
                 ["M", (arcBaseRadius / 100) * Math.cos(parallelTheta2) + x, (arcBaseRadius / 100) * Math.sin(parallelTheta2) + y],
                 ["L", (arcBaseRadius / 2) * Math.cos(borderTheta4) + x, (arcBaseRadius / 2) * Math.sin(borderTheta4) + y],
                 ["L", (arcBaseRadius - (arcBaseRadius / 100)) * Math.cos(parallelTheta2) + x, (arcBaseRadius - (arcBaseRadius / 100)) * Math.sin(parallelTheta2) + y],
                 ["L", (arcBaseRadius / 2) * Math.cos(borderTheta3) + x, (arcBaseRadius / 2) * Math.sin(borderTheta3) + y],
                 ["L", (arcBaseRadius / 100) * Math.cos(parallelTheta2) + x, (arcBaseRadius / 100) * Math.sin(parallelTheta2) + y],
                 ["z"]];

    linePathString = [["M", arcBaseRadius * Math.cos(parallelTheta) + x, arcBaseRadius * Math.sin(parallelTheta) + y],
                      ["L", (arcBaseRadius / 2) * Math.cos(borderTheta2) + x, (arcBaseRadius / 2) * Math.sin(borderTheta2) + y],
                      ["M", (arcBaseRadius / 2) * Math.cos(borderTheta3) + x, (arcBaseRadius / 2) * Math.sin(borderTheta3) + y],
                      ["L", arcBaseRadius * Math.cos(parallelTheta2) + x, arcBaseRadius * Math.sin(parallelTheta2) + y]];


    return {
        slicePathString: slicePathString,
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};
