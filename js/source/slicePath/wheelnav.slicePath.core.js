///#source 1 1 /js/source/slicePath/wheelnav.slicePathStart.js
/* ======================================================================================= */
/* Slice path definitions.                                                                 */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/slicePath.html     */
/* ======================================================================================= */

slicePath = function () {

    this.NullSlice = function (helper, percent, custom) {

        helper.setBaseValue(percent, custom);
        titlePathString = helper.getCurvedTitlePathString();

        return {
            slicePathString: "",
            linePathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY,
            titlePathString: titlePathString
        };
    };

    this.NullInitSlice = function (helper, percent, custom) {

        helper.setBaseValue(percent, custom);

        slicePathString = [helper.MoveToCenter(),
                 helper.Close()];
        titlePathString = helper.getCurvedTitlePathString();

        return {
            slicePathString: slicePathString,
            linePathString: slicePathString,
            titlePosX: helper.centerX,
            titlePosY: helper.centerY,
            titlePathString: titlePathString
        };
    };

///#source 1 1 /js/source/slicePath/wheelnav.slicePathEnd.js

    return this;
};



