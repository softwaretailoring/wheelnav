//---------------------------------
// Raphael.js custom attributes
//---------------------------------

function setRaphaelCustomAttributes(raphael) {
    raphael.customAttributes.alongPath = function (pathString) {
        return {
            alongPath: pathString
        };
    };

    raphael.customAttributes.along = function (percent, centerX, centerY) {
        var alongPath = this.attr("alongPath");
        var pathLenght = alongPath.getTotalLength();
        var point = alongPath.getPointAtLength(percent * pathLenght);

        var transformString = {
            transform: "t" + (point.x - centerX).toString() + " " + (point.y - centerY).toString()
            }

        return transformString;
    };
}
