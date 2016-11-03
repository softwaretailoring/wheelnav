## 1.7.0

* New wheelnav properties: keynavigateEnabled, keynavigateOnlyFocus, keynavigateDownCode, keynavigateDownCodeAlt, keynavigateUpCode, keynavigateUpCodeAlt
* New wheelnav methods: removeWheel, setTitle
* New slicePath: OuterStrokeSlice

### 1.6.1

* New data attributes: data-wheelnav-titlewidth, data-wheelnav-titleheight
* Handle titleWidth and titleHeight property for path in navTitle
* Handle hover and selected states of image and path in navTitle
* New spreader properties: spreaderInTitleWidth, spreaderInTitleHeight, spreaderOutTitleWidth, spreaderOutTitleHeight
* Spreader supports images

### 1.6.0

* New navTitle type: image, when navTitle start with 'imgsrc:' it can parse as URL of image or data URI 
* selectedNavItemIndex property is public now for set first selected item
* modify defaultpalette

### 1.5.5

* Fixed getTitleRotateString for partial wheel
* Fixed isPathTitle, now supports lowercase and uppercase letters
* wheelnav.currentPercent is available from outside

### 1.5.4

* Fixed clickModeSpreadOff bug

### 1.5.3

* Add responsive behaviour

### 1.5.2

* Add welcome.html

### 1.5.1

* Fixed Firefox bug with raphael.canvas.clientWidth
* Fixed animateFinishFunction calls and setWheelSettings function
* New wheelnav, navItem property: sliceClickablePathCustom
* New spreaderPath: LineSpreader
* Customizable DropMarker size
* Expand menuRadius in MenuSlice and MenuMarker

### 1.5.0

* Support for html5 data- attributes
* Implement marker
* Redesign default style
* Reorganize path related code, implement path for spreader
* New wheelnav properties: initTitleRotate, initPercent
* New spreader properties: spreaderPathFunction, spreaderPathCustom, spreaderStartAngle, spreaderSliceAngle
* New spreader properties: spreaderInTitle, spreaderOutTitle, spreaderInPercent, spreaderOutPercent
* New spreader style properties: spreaderPathInAttr, spreaderPathOutAttr, spreaderTitleInAttr, spreaderTitleOutAttr
* Fixed clientWidth bug in multiple wheelnav mode

### 1.4.0

* Modify order of items: navSlice -> navLine -> navTitle
* Remove MenuSquareSlice from slicePaths
* New wheelnav method: setTooltips
* New navItem method: refreshNavItem, initPathsAndTransforms
* New navItem property: titleHover
* New navItem function: navigateFunction
* Refactor wheelnav.refreshWeel, navItem.navTitle transform
* Fix IE bug with clickableSlice
* Reorganize slicePath code
* New slices: Web, Winter, Tutorial

### 1.3.1

* Fix spreader Attrs handling and visibility
* Fix names of css classes for proper css selector using
* Fix hoverEffect issue in IE
* Fix path issue with d="M,0,0" (in custom raphael)

### 1.3.0

* New wheelnav, navItem properties: clickablePercentMin, clickablePercentMax, sliceClickablePathFunction
* Refactor navItem.fillAttr for proper gradients
* Optimize slicePaths for customization
* New parameters in wheelnav constructor: divWidth, divHeight
* New wheelnav property: cssMode, implement css handling
* Switch to custom raphael.min.js (because of css handling)

### 1.2.0

* Removal of lag between slices under rotation and hover
* New wheelnav properties: rotateRound, navItemsEnabled
* New wheelnav callback function: animateFinishFunction
* New navItem property: enabled

### 1.1.0

* Customizable slicePath and sliceTransform functions
* New wheelnav and navItem properties: slicePathCustom, sliceSelectedPathCustom, sliceHoverPathCustom, sliceTransformCustom, sliceSelectedTransformCustom, sliceHoverTransformCustom
* Add custom parameter to slicePath and sliceTransform functions
* New wheelnav properties: selectedNavItemIndex, navItemCountLabeled, navItemCountLabelOffset
* Refactor baseAngle and sliceAngle. Move them to navItem from core.
* New wheelnav properties: navItemsContinuous, navItemsCentered
* Improve rotate mode
* New wheelnav properties: rotateRoundCount, animateRepeatCount, animatetimeCalculated

### 1.0.3

* New class: slicePathHelper
* Refactor functions of slicePath

### 1.0.2

* Rename wheelnav property: wheelSugar to wheelRadius
* Rename spreader property: spreaderSugar to spreaderRadius
* Rename slicePath property: titleSugar to titleRadius

### 1.0.1

* New wheelnav property: clockwise

### 1.0.0

* Initial release