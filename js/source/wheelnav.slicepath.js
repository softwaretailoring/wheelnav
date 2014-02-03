//---------------------------------
// Slice path definitions
//---------------------------------

var slicePath = function () {

    this.fullPie = function (wheelnav, itemIndex, startAngle) {
        var x = wheelnav.centerX,
            y = wheelnav.centerY,
            r = wheelnav.navWheelSugar * 0.95,
            a1 = ((startAngle + wheelnav.baseAngle) % 360) * Math.PI / 180,
            a2 = ((startAngle + wheelnav.baseAngle + wheelnav.sliceAngle) % 360) * Math.PI / 180;

        pathString = [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, 0, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]];
        attr = { fill: wheelnav.colors[itemIndex], stroke: "#111", "stroke-width": 3, cursor: 'pointer' };

        return wheelnav.raphael.path(pathString).attr(attr);
    }

    this.halfPie = function (wheelnav, itemIndex, startAngle) {
        var x = wheelnav.centerX,
            y = wheelnav.centerY,
            r = wheelnav.navWheelSugar * 0.75,
            a1 = ((startAngle + wheelnav.baseAngle + 5) % 360) * Math.PI / 180,
            a2 = ((startAngle + wheelnav.baseAngle + wheelnav.sliceAngle - 5) % 360) * Math.PI / 180;

        pathString = [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, 0, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]];
        attr = { fill: wheelnav.colors[itemIndex], stroke: "#111", "stroke-width": 5, cursor: 'pointer' };

        return wheelnav.raphael.path(pathString).attr(attr);
    }

    return this;
}