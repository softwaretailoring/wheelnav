wheelnav.js
===========

Animated wheel navigation javascript library based on [Raphaël.js][raphaeljs] (SVG/VML).

It works on all major desktop and mobile browser.

Possible uses:
- tab navigation
- pie menu (radial menu)
- sub menu
- option button
- checkboxes
- and more...

For more insight please visit [http://wheelnavjs.softwaretailoring.net][projectpage]

## Using

```javascript
var myWheelnav = new wheelnav("divWheelnav");
myWheelnav.slicePathFunction = slicePath().DonutSlice;
myWheelnav.colors = new Array("mediumorchid", "royalblue", "darkorange");
myWheelnav.createWheel([icon.github, icon.people, icon.smile]);
```

![sample image](http://wheelnavjs.softwaretailoring.net/test/wheelnav_sampleimage.png)

The index.html of this repo (test page) is available [here][testpage].

## Install

wheelnav.js is available over npm

```sh
$ npm install wheelnav
```

and bower

```sh
$ bower install wheelnav
```

## Author

Gábor Berkesi: gabor.berkesi@softwaretailoring.net

## License

Licensed under [MIT][mit]. Enjoy the spinning.

[projectpage]: http://wheelnavjs.softwaretailoring.net
[testpage]: http://wheelnavjs.softwaretailoring.net/test
[mit]: http://www.opensource.org/licenses/mit-license.php
[raphaeljs]: http://raphaeljs.com/

