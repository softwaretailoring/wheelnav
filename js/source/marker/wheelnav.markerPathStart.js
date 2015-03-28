/* ======================================================================================= */
/* Marker path definitions.                                                                */
/* ======================================================================================= */

markerPath = function () {

    this.NullMarker = function (helper, custom) {

        if (custom === null) {
            custom = new markerPathCustomization();
        }

        helper.setBaseValue(custom);

        return {
            markerPathString: "",
            titlePosX: helper.titlePosX,
            titlePosY: helper.titlePosY
        };
    };


