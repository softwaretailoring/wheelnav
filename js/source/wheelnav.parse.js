/* ======================================================================================= */
/* Parse html5 data- attributes, the onmouseup events and anchor links                     */
/* ======================================================================================= */
/* ======================================================================================= */
/* Documentation: http://wheelnavjs.softwaretailoring.net/documentation/html5.html         */
/* ======================================================================================= */

wheelnav.prototype.parseWheel = function (holderDiv) {
    if (holderDiv !== undefined &&
        holderDiv !== null) {
        //data-wheelnav attribute is required
        var wheelnavData = holderDiv.hasAttribute("data-wheelnav");
        if (wheelnavData) {
            var parsedNavItems = [];
            var parsedNavItemsHref = [];
            var parsedNavItemsOnmouseup = [];
            var onlyInit = false;

            //data-wheelnav-slicepath
            var wheelnavSlicepath = holderDiv.getAttribute("data-wheelnav-slicepath");
            if (wheelnavSlicepath !== null) {
                if (slicePath()[wheelnavSlicepath] !== undefined) {
                    this.slicePathFunction = slicePath()[wheelnavSlicepath];
                }
            }
            //data-wheelnav-colors
            var wheelnavColors = holderDiv.getAttribute("data-wheelnav-colors");
            if (wheelnavColors !== null) {
                this.colors = wheelnavColors.split(',');
            }
            //data-wheelnav-wheelradius
            var wheelnavWheelradius = holderDiv.getAttribute("data-wheelnav-wheelradius");
            if (wheelnavWheelradius !== null) {
                this.wheelRadius = Number(wheelnavWheelradius);
            }
            //data-wheelnav-navangle
            var wheelnavNavangle = holderDiv.getAttribute("data-wheelnav-navangle");
            if (wheelnavNavangle !== null) {
                this.navAngle = Number(wheelnavNavangle);
            }
            //data-wheelnav-rotateoff
            var wheelnavRotateOff = holderDiv.getAttribute("data-wheelnav-rotateoff");
            if (wheelnavRotateOff !== null) {
                this.clickModeRotate = false;
            }
            //data-wheelnav-cssmode
            var wheelnavCssmode = holderDiv.getAttribute("data-wheelnav-cssmode");
            if (wheelnavCssmode !== null) {
                this.cssMode = true;
            }
            //data-wheelnav-spreader
            var wheelnavSpreader = holderDiv.getAttribute("data-wheelnav-spreader");
            if (wheelnavSpreader !== null) {
                this.spreaderEnable = true;
            }
            //data-wheelnav-spreaderradius
            var wheelnavSpreaderRadius = holderDiv.getAttribute("data-wheelnav-spreaderradius");
            if (wheelnavSpreaderRadius !== null) {
                this.spreaderRadius = Number(wheelnavSpreaderRadius);
            }
            //data-wheelnav-spreaderpath
            var wheelnavSpreaderPath = holderDiv.getAttribute("data-wheelnav-spreaderpath");
            if (wheelnavSpreaderPath !== null) {
                if (markerPath()[wheelnavSpreaderPath] !== undefined) {
                    this.spreaderPathFunction = spreaderPath()[wheelnavSpreaderPath];
                }
            }
            //data-wheelnav-marker
            var wheelnavMarker = holderDiv.getAttribute("data-wheelnav-marker");
            if (wheelnavMarker !== null) {
                this.markerEnable = true;
            }
            //data-wheelnav-markerpath
            var wheelnavMarkerPath = holderDiv.getAttribute("data-wheelnav-markerpath");
            if (wheelnavMarkerPath !== null) {
                if (markerPath()[wheelnavMarkerPath] !== undefined) {
                    this.markerPathFunction = markerPath()[wheelnavMarkerPath];
                }
            }
            //data-wheelnav-titlewidth
            var wheelnavTitleWidth = holderDiv.getAttribute("data-wheelnav-titlewidth");
            if (wheelnavTitleWidth !== null) {
                this.titleWidth = Number(wheelnavTitleWidth);
            }
            //data-wheelnav-titleheight
            var wheelnavTitleHeight = holderDiv.getAttribute("data-wheelnav-titleheight");
            if (wheelnavTitleHeight !== null) {
                this.titleHeight = Number(wheelnavTitleHeight);
            }
            //data-wheelnav-titlecurved
            var wheelnavTitleCurved = holderDiv.getAttribute("data-wheelnav-titlecurved");
            if (wheelnavTitleCurved !== null) {
                this.titleCurved = true;
            }
            //data-wheelnav-titlecurvedclockwise
            var wheelnavTitleCurvedClockwise = holderDiv.getAttribute("data-wheelnav-titlecurvedclockwise");
            if (wheelnavTitleCurvedClockwise !== null) {
                this.titleCurvedClockwise = true;
            }
            //data-wheelnav-titlecurvedbyrotateangle
            var wheelnavTitleCurvedByRotateAngle = holderDiv.getAttribute("data-wheelnav-titlecurvedbyrotateangle");
            if (wheelnavTitleCurvedByRotateAngle !== null) {
                this.titleCurvedByRotateAngle = true;
            }
            //data-wheelnav-keynav
            var wheelnavKeynav = holderDiv.getAttribute("data-wheelnav-keynav");
            if (wheelnavKeynav !== null) {
                this.keynavigateEnabled = true;
            }
            //data-wheelnav-keynavonlyfocus
            var wheelnavKeynavOnlyfocus = holderDiv.getAttribute("data-wheelnav-keynavonlyfocus");
            if (wheelnavKeynavOnlyfocus !== null) {
                this.keynavigateOnlyFocus = true;
            }
            //data-wheelnav-keynavdowncode
            var wheelnavKeynavDowncode = holderDiv.getAttribute("data-wheelnav-keynavdowncode");
            if (wheelnavKeynavDowncode !== null) {
                this.keynavigateDownCode = Number(wheelnavKeynavDowncode);
            }
            //data-wheelnav-keynavdowncodealt
            var wheelnavKeynavDowncodeAlt = holderDiv.getAttribute("data-wheelnav-keynavdowncodealt");
            if (wheelnavKeynavDowncodeAlt !== null) {
                this.keynavigateDownCodeAlt = Number(wheelnavKeynavDowncodeAlt);
            }
            //data-wheelnav-keynavupcode
            var wheelnavKeynavUpcode = holderDiv.getAttribute("data-wheelnav-keynavupcode");
            if (wheelnavKeynavUpcode !== null) {
                this.keynavigateUpCode = Number(wheelnavKeynavUpcode);
            }
            //data-wheelnav-keynavupcodealt
            var wheelnavKeynavUpcodeAlt = holderDiv.getAttribute("data-wheelnav-keynavupcodealt");
            if (wheelnavKeynavUpcodeAlt !== null) {
                this.keynavigateUpCodeAlt = Number(wheelnavKeynavUpcodeAlt);
            }

            //data-wheelnav-init
            var wheelnavOnlyinit = holderDiv.getAttribute("data-wheelnav-init");
            if (wheelnavOnlyinit !== null) {
                onlyInit = true;
            }

            for (var i = 0; i < holderDiv.children.length; i++) {

                var wheelnavNavitemtext = holderDiv.children[i].getAttribute("data-wheelnav-navitemtext");
                var wheelnavNavitemicon = holderDiv.children[i].getAttribute("data-wheelnav-navitemicon");
                var wheelnavNavitemimg = holderDiv.children[i].getAttribute("data-wheelnav-navitemimg");
                if (wheelnavNavitemtext !== null ||
                    wheelnavNavitemicon !== null ||
                    wheelnavNavitemimg !== null) {
                    //data-wheelnav-navitemtext
                    if (wheelnavNavitemtext !== null) {
                        parsedNavItems.push(wheelnavNavitemtext);
                    }
                    //data-wheelnav-navitemicon
                    else if (wheelnavNavitemicon !== null) {
                        if (icon[wheelnavNavitemicon] !== undefined) {
                            parsedNavItems.push(icon[wheelnavNavitemicon]);
                        }
                        else {
                            parsedNavItems.push(wheelnavNavitemicon);
                        }
                    }
                    else if (wheelnavNavitemimg !== null) {
                        parsedNavItems.push("imgsrc:" + wheelnavNavitemimg);
                    }
                    else {
                        //data-wheelnav-navitemtext or data-wheelnav-navitemicon or data-wheelnav-navitemimg is required
                        continue;
                    }

                    //onmouseup event of navitem element for call it in the navigateFunction
                    if (holderDiv.children[i].onmouseup !== undefined) {
                        parsedNavItemsOnmouseup.push(holderDiv.children[i].onmouseup);
                    }
                    else {
                        parsedNavItemsOnmouseup.push(null);
                    }

                    //parse inner <a> tag in navitem element for use href in navigateFunction
                    var foundHref = false;
                    for (var j = 0; j < holderDiv.children[i].children.length; j++) {
                        if (holderDiv.children[i].children[j].getAttribute('href') !== undefined) {
                            parsedNavItemsHref.push(holderDiv.children[i].children[j].getAttribute('href'));
                        }
                    }
                    if (!foundHref) {
                        parsedNavItemsHref.push(null);
                    }
                }
            }

            if (parsedNavItems.length > 0) {
                this.initWheel(parsedNavItems);

                for (var i = 0; i < parsedNavItemsOnmouseup.length; i++) {
                    this.navItems[i].navigateFunction = parsedNavItemsOnmouseup[i];
                    this.navItems[i].navigateHref = parsedNavItemsHref[i];
                }

                if (!onlyInit) {
                    this.createWheel();
                }
            }
        }

        var removeChildrens = [];
        for (var i = 0; i < holderDiv.children.length; i++) {
            if (holderDiv.children[i].localName !== "svg") {
                removeChildrens.push(holderDiv.children[i]);
            }
        }

        for (var i = 0; i < removeChildrens.length; i++) {
            holderDiv.removeChild(removeChildrens[i]);
        }
    }
};

