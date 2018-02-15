
this.YinYangSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);

    r = helper.sliceRadius;

    slicePathString = [helper.MoveToCenter(),
                 helper.ArcTo(r / 2, helper.startAngle, r),
                 helper.ArcTo(r, helper.middleAngle, r),
                 helper.ArcTo(r, helper.endAngle, r),
                 helper.ArcBackTo(r / 2, 0, 0),
                 helper.Close()];

    titlePosX = helper.getX(helper.startAngle, r / 2);
    titlePosY = helper.getY(helper.startAngle, r / 2);

    titlePathString = [helper.MoveToCenter(),
                 helper.ArcTo(r / 4, helper.startAngle + helper.sliceAngle * 0.2, r * 0.8)];

    return {
        slicePathString: slicePathString,
        linePathString: slicePathString,
        titlePosX: titlePosX,
        titlePosY: titlePosY,
        titlePathString: titlePathString
    };
};
