wheelnav.js
===========

[![Join the chat at https://gitter.im/softwaretailoring/wheelnav](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/softwaretailoring/wheelnav?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Animated wheel navigation JavaScript library based on [Raphaël.js][raphaeljs] (SVG/VML).

It works on all major desktop and mobile browser.

Possible uses:
- tab navigation
- pie menu (radial menu, circular menu)
- sub menu
- option button
- checkboxes
- and more...

For more insight please visit [http://wheelnavjs.softwaretailoring.net][projectpage]

## Using

### Via JavaScript

HTML
```html
<div id="divWheelnav"></div>
```

JS
```javascript
var myWheelnav = new wheelnav("divWheelnav");
myWheelnav.slicePathFunction = slicePath().WheelSlice;
myWheelnav.colors = colorpalette.parrot;
myWheelnav.createWheel([icon.smile, icon.star, icon.fork, icon.$]);
```

### Via data attributes

HTML
```html
<div id="divWheelnav" data-wheelnav data-wheelnav-slicepath="WheelSlice" data-wheelnav-colors="#D80351,#F5D908,#00A3EE,#929292">
    <div data-wheelnav-navitemicon="smile">smile</div>
    <div data-wheelnav-navitemicon="star">star</div>
    <div data-wheelnav-navitemicon="fork">fork</div>
    <div data-wheelnav-navitemicon="$">donate</div>
</div>
```

JS
```javascript
var myWheelnav = new wheelnav("divWheelnav");
```

![demo image](wheelnav_demo.gif)

The index.html of this repo (test page) is available [here][testpage].

## Install

wheelnav.js is available over [npm][npm]

```sh
$ npm install wheelnav
```

and [bower][bower]

```sh
$ bower install wheelnav
```

or CDN by [jsDelivr][jsdelivr]

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/wheelnav/1.7.0/wheelnav.min.js"></script>
```

## Author

Developer: Gábor Berkesi (gabor.berkesi@softwaretailoring.net)

Development environment: [Visual Studio Community 2013][vs2013] with [Web Essentials][webessentials]

## License

Licensed under [MIT][mit]. Enjoy the spinning.

[projectpage]: http://wheelnavjs.softwaretailoring.net
[testpage]: http://wheelnavjs.softwaretailoring.net/test
[mit]: http://www.opensource.org/licenses/mit-license.php
[raphaeljs]: http://raphaeljs.com/
[npm]: https://www.npmjs.com/package/wheelnav
[bower]: http://bower.io/search/?q=wheelnav
[jsdelivr]: http://www.jsdelivr.com/?query=wheelnav
[vs2013]: https://www.visualstudio.com/en-us/products/visual-studio-community-vs.aspx
[webessentials]: http://vswebessentials.com/
