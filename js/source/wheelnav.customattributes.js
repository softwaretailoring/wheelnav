//---------------------------------
// Raphael.js custom attributes
//---------------------------------

function setRaphaelCustomAttributes(raphael) {
    raphael.customAttributes.guide = function (g) {
        return {
            guide: g
        };
    };

    raphael.customAttributes.along = function (percent, navWheelSugar) {
        var g = this.attr("guide");
        var len = g.getTotalLength();
        var point = g.getPointAtLength(percent * len);
        var t = {
            transform: "t" + (point.x - navWheelSugar).toString() + " " + (point.y - navWheelSugar).toString()
        };
        return t;
    };
}
