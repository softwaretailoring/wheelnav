
this.TabSlice = function (helper, percent, custom) {

    var rOriginal = helper.wheelRadius * 0.9;
    var navItemCount = 360 / helper.sliceAngle;
    var itemSize = 2 * rOriginal / navItemCount;

    x = helper.centerX;
    y = helper.centerY;
    itemIndex = helper.itemIndex;

    titlePosX = x;
    titlePosY = itemIndex * itemSize + y + (itemSize / 2) - rOriginal;

    slicePathString = [["M", x - (itemSize / 2), itemIndex * itemSize + y - rOriginal],
                 ["L", (itemSize / 2) + x, itemIndex * itemSize + y - rOriginal],
                 ["L", (itemSize / 2) + x, (itemIndex + 1) * itemSize + y - rOriginal],
                 ["L", x - (itemSize / 2), (itemIndex + 1) * itemSize + y - rOriginal],
                 ["z"]];

    return {
        slicePathString: slicePathString,
        linePathString: "",
        titlePosX: titlePosX,
        titlePosY: titlePosY
    };
};
