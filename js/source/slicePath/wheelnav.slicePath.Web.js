
this.WebSlice = function (helper, percent, custom) {

    helper.setBaseValue(percent, custom);

    r = helper.sliceRadius;

    helper.titleRadius = r * 0.55;
    helper.setTitlePos();

    linePathString = [helper.MoveToCenter(),
                 helper.LineTo(helper.startAngle, r * 1.1),
                 helper.MoveToCenter(),
                 helper.LineTo(helper.endAngle, r * 1.1),
                 helper.MoveTo(helper.startAngle, r * 0.15),
                 helper.LineTo(helper.endAngle, r * 0.15),
                 helper.MoveTo(helper.startAngle, r * 0.35),
                 helper.LineTo(helper.endAngle, r * 0.35),
                 helper.MoveTo(helper.startAngle, r * 0.55),
                 helper.LineTo(helper.endAngle, r * 0.55),
                 helper.MoveTo(helper.startAngle, r * 0.75),
                 helper.LineTo(helper.endAngle, r * 0.75),
                 helper.MoveTo(helper.startAngle, r * 0.95),
                 helper.LineTo(helper.endAngle, r * 0.95),
                 helper.Close()];

    titlePathString = helper.getCurvedTitlePathString();

    return {
        slicePathString: "",
        linePathString: linePathString,
        titlePosX: helper.titlePosX,
        titlePosY: helper.titlePosY,
        titlePathString: titlePathString
    };
};
