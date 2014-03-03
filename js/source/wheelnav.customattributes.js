//---------------------------------
// Raphael.js custom attributes
//---------------------------------

function setRaphaelCustomAttributes(raphael) {

    raphael.customAttributes.slicePathFunction = function (pathFunction) {
        return {
            slicePathFunction: pathFunction
        };
    };

    raphael.customAttributes.currentTransform = function (tranformString) {
        return {
            currentTransform: tranformString
        };
    };

    raphael.customAttributes.slicePercentPath = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var currentTransform = this.attr("currentTransform");

        var pathString = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent).slicePathString;
        var pathAttr = {
            path: pathString,
            transform: currentTransform
        };

        return pathAttr;
    }

    raphael.customAttributes.linePercentPath = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var currentTransform = this.attr("currentTransform");

        var pathString = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent).linePathString;
        var pathAttr = {
            path: pathString,
            transform: currentTransform
        };

        return pathAttr;
    }

    raphael.customAttributes.titlePercentPos = function (centerX, centerY, sliceR, baseAngle, sliceAngle, currentPosX, currentPosY, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var currentTransform = this.attr("currentTransform");

        var navItem = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent);
        var transformString = "t,-" + currentPosX + ",-" + currentPosY;
        transformString += ",t," + navItem.titlePosX + "," + navItem.titlePosY + currentTransform;

        if (percent < 0.63) transformString += ",s" + percent * (1/0.63);

        var transformAttr = {
            transform: transformString
        }

        return transformAttr;
    };
}
