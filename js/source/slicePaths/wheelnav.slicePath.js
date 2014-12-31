
this.CogSliceCustomization = function () {

    var custom = new slicePathCustomization();
    custom.titleRadiusPercent = 0.55;
    custom.isBasePieSlice = false;

    return custom;
};

this.CogSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = CogSliceCustomization();
    }

    helper.setBaseValue(percent, custom);
    x = helper.centerX;
    y = helper.centerY;

    r = helper.sliceRadius * 0.9;
    rbase = helper.sliceRadius * 0.83;

    startTheta = helper.startTheta;
    endTheta = helper.endTheta;

    theta1 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.0625);
    theta12 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.125);
    theta2 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.1875);
    theta22 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.25);
    theta3 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.3125);
    theta32 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.375);
    theta4 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.4375);
    theta42 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.5);
    theta5 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.5625);
    theta52 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.625);
    theta6 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.6875);
    theta62 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.75);
    theta7 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.8125);
    theta72 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.875);
    theta8 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.9375);
    theta82 = helper.getTheta(helper.startAngle + helper.sliceAngle * 0.96875);

    if (custom.isBasePieSlice) {
        r = rbase;
        slicePathString = [["M", x, y],
            ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta12) + x, r * Math.sin(theta12) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta22) + x, r * Math.sin(theta22) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta3) + x, r * Math.sin(theta3) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta32) + x, r * Math.sin(theta32) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta4) + x, r * Math.sin(theta4) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta42) + x, r * Math.sin(theta42) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta5) + x, r * Math.sin(theta5) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta52) + x, r * Math.sin(theta52) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta6) + x, r * Math.sin(theta6) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta62) + x, r * Math.sin(theta62) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta7) + x, r * Math.sin(theta7) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta72) + x, r * Math.sin(theta72) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta8) + x, r * Math.sin(theta8) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta82) + x, r * Math.sin(theta82) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
            ["z"]];
    }
    else {
        slicePathString = [["M", x, y],
            ["L", r * Math.cos(startTheta) + x, r * Math.sin(startTheta) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta1) + x, r * Math.sin(theta1) + y],
            ["L", rbase * Math.cos(theta1) + x, rbase * Math.sin(theta1) + y],
            ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta2) + x, rbase * Math.sin(theta2) + y],
            ["L", r * Math.cos(theta2) + x, r * Math.sin(theta2) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta3) + x, r * Math.sin(theta3) + y],
            ["L", rbase * Math.cos(theta3) + x, rbase * Math.sin(theta3) + y],
            ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta4) + x, rbase * Math.sin(theta4) + y],
            ["L", r * Math.cos(theta4) + x, r * Math.sin(theta4) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta5) + x, r * Math.sin(theta5) + y],
            ["L", rbase * Math.cos(theta5) + x, rbase * Math.sin(theta5) + y],
            ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta6) + x, rbase * Math.sin(theta6) + y],
            ["L", r * Math.cos(theta6) + x, r * Math.sin(theta6) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(theta7) + x, r * Math.sin(theta7) + y],
            ["L", rbase * Math.cos(theta7) + x, rbase * Math.sin(theta7) + y],
            ["A", rbase, rbase, 0, 0, 1, rbase * Math.cos(theta8) + x, rbase * Math.sin(theta8) + y],
            ["L", r * Math.cos(theta8) + x, r * Math.sin(theta8) + y],
            ["A", r, r, 0, 0, 1, r * Math.cos(endTheta) + x, r * Math.sin(endTheta) + y],
            ["z"]];
    }

    helper.titleRadius = r * 0.55;
    helper.setTitlePos(x, y);

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY
    };
};

this.CogBasePieSlice = function (helper, percent, custom) {

    if (custom === null) {
        custom = CogSliceCustomization();
    }

    custom.isBasePieSlice = true;

    var slicePath = CogSlice(helper, percent, custom);

    return {
        slicePathString: slicePath.slicePathString,
        linePathString: "",
        titlePosX: slicePath.titlePosX,
        titlePosY: slicePath.titlePosY
    };
};
