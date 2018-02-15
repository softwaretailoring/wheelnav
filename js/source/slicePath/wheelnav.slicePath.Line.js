
this.LineSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);

    r = helper.sliceRadius;

    if (helper.sliceAngle > 60 &&
        helper.sliceAngle < 180) {
        helper.titleRadius = r * ((180 / helper.sliceAngle) / 5);
        helper.setTitlePos();
    }
    else {
        helper.titleRadius = r * 0.55;
        helper.setTitlePos();
    }

    if (helper.sliceAngle < 180) {
        slicePathString = [helper.MoveToCenter(),
                 helper.LineTo(helper.startAngle, r),
                 helper.LineTo(helper.endAngle, r),
                 helper.Close()];
    }
    else {
        if (helper.startAngle === 180 ||
            helper.startAngle === 0 ||
            helper.startAngle === -180 ||
            helper.startAngle === 360) {
            slicePathString = [helper.MoveToCenter(),
                 helper.LineTo(helper.startAngle, r),
                 helper.LineTo(helper.startAngle, r, helper.middleAngle, r),
                 helper.LineTo(helper.endAngle, r, helper.middleAngle, r),
                 helper.LineTo(helper.endAngle, r),
                 helper.Close()];
        }
        else {
            slicePathString = [helper.MoveToCenter(),
             helper.LineTo(helper.startAngle, r),
             helper.LineTo(helper.middleAngle, r, helper.startAngle, r),
             helper.LineTo(helper.middleAngle, r, helper.endAngle, r),
             helper.LineTo(helper.endAngle, r),
             helper.Close()];
        }
    }

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};
