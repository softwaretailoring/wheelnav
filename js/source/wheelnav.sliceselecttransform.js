//------------------------------------------
// Slice transform definitions for selection
//------------------------------------------

var sliceSelectTransform = function () {

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
            slicePathString: "",
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

        titleTransformString = "t" + (rOriginal / 10 * Math.cos(baseTheta)).toString() + "," + (rOriginal / 10 * Math.sin(baseTheta)).toString();

        return {
            sliceTransformString: sliceTransformString,
            slicePathString: "",
            lineTransformString: sliceTransformString,
            titleTransformString: titleTransformString
        }
    }

    this.RotateTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "r360";

        return {
            sliceTransformString: sliceTransformString,
            slicePathString: "",
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.RotateHalfTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "r90";

        return {
            sliceTransformString: sliceTransformString,
            slicePathString: "",
            lineTransformString: sliceTransformString,
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "s1.2";

        return {
            sliceTransformString: sliceTransformString,
            slicePathString: "",
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    this.ScaleTitleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        return {
            sliceTransformString: "",
            slicePathString: "",
            lineTransformString: "",
            titleTransformString: "s1.3"
        }
    }

    this.RotateScaleTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        sliceTransformString = "r360,s1.3";

        return {
            sliceTransformString: sliceTransformString,
            slicePathString: "",
            lineTransformString: "",
            titleTransformString: sliceTransformString
        }
    }

    this.PieSliceBigTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        slicePathString = slicePath().PieSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, 10).slicePathString;

        return {
            sliceTransformString: "",
            slicePathString: slicePathString,
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.StarSliceTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        slicePathString = slicePath().StarSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, 1).slicePathString;

        return {
            sliceTransformString: "",
            slicePathString: slicePathString,
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.DonutSliceTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        var slice = slicePath().DonutSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, 1);
        slicePathString = slice.slicePathString;

        if (titleRotateAngle != null) {
            baseTheta = getTheta(-titleRotateAngle);
        }
        else {
            baseTheta = getTheta(baseAngle + sliceAngle / 2);
        }
        titleTransformString = "t" + (rOriginal / 10 * Math.cos(baseTheta)).toString() + "," + (rOriginal / 10 * Math.sin(baseTheta)).toString();

        return {
            sliceTransformString: "",
            slicePathString: slicePathString,
            lineTransformString: "",
            titleTransformString: titleTransformString
        }
    }

    this.MenuSliceTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        var slice = slicePath().MenuSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, 1);
        slicePathString = slice.slicePathString;

        if (titleRotateAngle != null) {
            baseTheta = getTheta(-titleRotateAngle);
        }
        else {
            baseTheta = getTheta(baseAngle + sliceAngle / 2);
        }
        titleTransformString = "t" + (5 * Math.cos(baseTheta)).toString() + "," + (5 * Math.sin(baseTheta)).toString();

        return {
            sliceTransformString: "",
            slicePathString: slicePathString,
            lineTransformString: "",
            titleTransformString: titleTransformString
        }
    }

    this.WheelSliceTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        slicePathString = slicePath().WheelSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, 1).slicePathString;

        return {
            sliceTransformString: "",
            slicePathString: slicePathString,
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    this.CogSliceTransform = function (x, y, rOriginal, baseAngle, sliceAngle, titleRotateAngle, itemIndex) {

        slicePathString = slicePath().CogSlice(x, y, rOriginal, baseAngle, sliceAngle, itemIndex, 1).slicePathString;

        return {
            sliceTransformString: "",
            slicePathString: slicePathString,
            lineTransformString: "",
            titleTransformString: ""
        }
    }

    return this;
}


