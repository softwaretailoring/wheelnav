
this.DonutSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.minRadiusPercent = 0.37;
    custom.maxRadiusPercent = 0.9;

    return custom;
};

this.DonutSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = DonutSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius;

    r = helper.sliceRadius * custom.maxRadiusPercent;
    rbase = helper.sliceRadius * custom.minRadiusPercent;

    startTheta = helper.startTheta;
    endTheta = helper.endTheta;

    slicePathString = [["M", rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                 ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
                 ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
                 ["L", rbase * Math.cos(endTheta) + x, rbase * Math.sin(endTheta) + y],
                 ["A", rbase, rbase, 0, 0, 0, rbase * Math.cos(startTheta) + x, rbase * Math.sin(startTheta) + y],
                 ["z"]];

    helper.titleRadius = (r + rbase) / 2;
    helper.setTitlePos(x, y);

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};
