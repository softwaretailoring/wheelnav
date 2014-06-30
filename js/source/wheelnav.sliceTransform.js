//------------------------------------------
// Slice transform definitions
//------------------------------------------

var sliceTransform = function () {

    this.startAngle = 0;
    this.startTheta = 0;
    this.middleTheta = 0;
    this.endTheta = 0;

    var setBaseValue = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {
        this.startAngle = (itemIndex * sliceAngle) + baseAngle;
        this.startTheta = getTheta(startAngle);
        this.middleTheta = getTheta(startAngle + sliceAngle / 2);
        this.endTheta = getTheta(startAngle + sliceAngle);
    }

    var getTheta = function (angle) {
            return (angle % 360) * Math.PI / 180;
    }

    this.NullTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {
        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.MoveMiddleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {
       
        setBaseValue(x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex);
        sliceTransformString = "t" + (rOriginal / 10 * Math.cos(middleTheta)).toString() + "," + (rOriginal / 10 * Math.sin(middleTheta)).toString();

        if (titleRotateAngle != null) {
            baseTheta = getTheta(-titleRotateAngle);
        }
        else {
            baseTheta = getTheta(baseAngle + sliceAngle / 2);
        }

        titleTransformString = "s1,r0,t" + (rOriginal / 10 * Math.cos(baseTheta)).toString() + "," + (rOriginal / 10 * Math.sin(baseTheta)).toString();

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: titleTransformString
        }
    }

    this.RotateTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1,r360";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateHalfTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1,r90";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        titleTransformString = "s1,r360";

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: titleTransformString
        }
    }

    this.ScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1.2";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        return {
            sliceTransformString: "",
            lineTransformString: "",
            titleTransformString: "s1.3"
        }
    }

    this.RotateScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "r360,s1.3";

        return {
            sliceTransformString: sliceTransformString,
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    return this;
}


