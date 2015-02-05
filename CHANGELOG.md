## 1.5.0

* New wheelnav, navItem property: initPathEnable, initTransformEnable, initTitleRotate
* Fixed clientWidth bug in multiple wheelnav mode
* New wheelnav properties: spreaderPathFunction, spreaderPathCustom, spreaderStartAngle, spreaderSliceAngle
* Reorganize path related code, implement path for spreader

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