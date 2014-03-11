//---------------------------------
// Raphael.js custom attributes
//---------------------------------

function setRaphaelCustomAttributes(raphael) {

    raphael.customAttributes.slicePathFunction = function (pathFunction) {
        return {
            slicePathFunction: pathFunction
        };
    };

    raphael.customAttributes.titlePercentFunction = function (titleFunction) {
        return {
            titlePercentFunction: titleFunction
        };
    };

    raphael.customAttributes.currentTransform = function (tranformString) {
        return {
            currentTransform: tranformString
        };
    };

    raphael.customAttributes.currentTitle = function (titleString) {
        return {
            currentTitle: titleString
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

    raphael.customAttributes.titlePercentPos = function (centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent) {

        var slicePathFunction = this.attr("slicePathFunction");
        var titlePercentFunction = this.attr("titlePercentFunction");
        var currentTransform = this.attr("currentTransform");
        var currentTitle = this.attr("currentTitle");

        var navItem = slicePathFunction(centerX, centerY, sliceR, baseAngle, sliceAngle, itemIndex, percent);

        percentAttr = titlePercentFunction(navItem.titlePosX, navItem.titlePosY, currentTitle);

        if (percent < 0.3) currentTransform += ",s" + percent * (1 / 0.3);

        var transformAttr = {};

        if (this.type == "path") {
            transformAttr = {
                path: percentAttr.path,
                transform: currentTransform
            }
        }
        else {
            transformAttr = {
                x: percentAttr.x,
                y: percentAttr.y,
                transform: currentTransform
            }
        }

        return transformAttr;
    };
}
