//------------------------------------------
// Slice transform definitions for selection
//------------------------------------------

var sliceSelectTransform = function () {

    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.NullTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {
        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.MoveMiddleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, itemIndex);
        sliceTransformString = "t" + (rOriginal / 10 * Math.cos(middleTheta)).toString() + "," + (rOriginal / 10 * Math.sin(middleTheta)).toString();

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString + ",s1.1"
        }
    }

    this.RotateTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "r360";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateHalfTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "r90";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "s1.3";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: "s1.3"
        }
    }

    this.RotateScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, itemIndex) {

        sliceTransformString = "r360,s1.3";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    return this;
}


