
this.TabSlice = function (helper, percent, custom) {

    var rOriginal = helper.wheelRadius * 0.9;
    var navItemCount = 360 / helper.sliceAngle;
    var itemSize = 2 * rOriginal / navItemCount;

    x = helper.centerX;
    y = helper.centerY;
    itemIndex = helper.itemIndex;

    titlePosX = x;
    titlePosY = itemIndex * itemSize + y + (itemSize / 2) - rOriginal;

    slicePathString = [];
    slicePathString.push(helper.MoveToXY(x - (itemSize / 2), itemIndex * itemSize + y - rOriginal));
    slicePathString.push(helper.LineToXY((itemSize / 2) + x, itemIndex * itemSize + y - rOriginal));
    slicePathString.push(helper.LineToXY((itemSize / 2) + x, (itemIndex + 1) * itemSize + y - rOriginal));
    slicePathString.push(helper.LineToXY(x - (itemSize / 2), (itemIndex + 1) * itemSize + y - rOriginal));
    slicePathString.push(helper.Close());

    titlePathString = [];
    titlePathString.push(helper.MoveToXY(x - (itemSize / 2), (itemIndex + 1) * itemSize + y - rOriginal));
    titlePathString.push(helper.ArcToXY(itemSize * 2, (itemSize / 2) + x, itemIndex * itemSize + y - rOriginal));

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: titlePosX,
        titlePosY: titlePosY,
        titlePathString: titlePathString
    };
};
