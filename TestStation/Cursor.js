var wshShell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var station = LoadStation("TestStation.dll");

var document = new ActiveXObject("htmlfile");
var screen = document.parentWindow.screen;
var event = document.createEventObject();
var initialPos = { x: event.screenX, y: event.screenY };

if (screen.height < screen.width) {
    var r = screen.height / 2;
    var CP = getCirclePerimeter(r);

    var L = getLineLength(r, 0, screen.width - r, screen.height);

    var s = CP * 0.25;
    var e = CP * 0.75;
    for (var n = s; n < e; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnCircle(r, r, r, n);
        station.MoveCursor(point.x, point.y);
    }

    for (var n = 0; n < L; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnLine(r, screen.height, screen.width - r, 0, n);
        station.MoveCursor(point.x, point.y);
    }

    e = -s;
    for (var n = s; n > e; n -= 3) {
        WSH.Sleep(25);

        var point = getPointOnCircle(screen.width - r, r, r, n);
        station.MoveCursor(point.x, point.y);
    }

    for (var n = 0; n < L; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnLine(screen.width - r, screen.height, r, 0, n);
        station.MoveCursor(point.x, point.y);
    }
}
else {
    var r = screen.width / 2;
    var CP = getCirclePerimeter(r);

    var L = getLineLength(0, r, screen.width, screen.height - r);

    var e = CP / 2;
    for (var n = 0; n < e; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnCircle(r, r, r, n);
        station.MoveCursor(point.x, point.y);
    }

    for (var n = 0; n < L; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnLine(0, r, screen.width, screen.height - r, n);
        station.MoveCursor(point.x, point.y);
    }

    for (var n = 0; n < e; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnCircle(r, screen.height - r, r, -n);
        station.MoveCursor(point.x, point.y);
    }

    for (var n = 0; n < L; n += 3) {
        WSH.Sleep(25);

        var point = getPointOnLine(0, screen.height - r, screen.width, r, n);
        station.MoveCursor(point.x, point.y);
    }
}

station.MoveCursor(initialPos.x, initialPos.y);

function LoadStation(moduleName) {
    var fileName = WSH.ScriptFullName;
    // var fileName = location.pathname;

    var cmd = "rundll32 " + moduleName + ",StationInject";
    var env = wshShell.Environment("Process");
    env("ActiveStation") = "?";
    var initialDir = wshShell.CurrentDirectory;
    wshShell.CurrentDirectory = fso.GetParentFolderName(fileName);
    if (!fso.FileExists(moduleName))
        throw new Error('The module "' + moduleName + '" could not be found');

    var exitCode = wshShell.Run(cmd, 0, true);
    wshShell.CurrentDirectory = initialDir;
    if (exitCode)
        throw new Error("StationInject has failed with error code " + exitCode);

    var station = GetObject(env("ActiveStation"));
    env.Remove("ActiveStation");

    return station;
}

function getLineLength(x1, y1, x2, y2) {
    with (Math) {
        var w = x2 - x1;
        var h = y1 - y2;
        return floor(sqrt(w * w + h * h));
    }
}

function getPointOnLine(x1, y1, x2, y2, n) {
    with (Math) {
        var m = (y1 - y2) / (x2 - x1);
        var result = {
            x: floor(x1 + n / sqrt(1 + m * m)),
            y: floor(y1 - n / sqrt(1 + 1 / (m * m)))
        };

        if ((x2 <= x1) && (y2 >= y1)) {
            result.x = 2 * x1 - result.x;
            result.y = 2 * y1 - result.y;
        }
        else if ((x2 > x1) && (y2 > y1))
            result.y = 2 * y1 - result.y;
        else if ((x2 < x1) && (y2 < y1))
            result.x = 2 * x1 - result.x;

        return result;
    }
}

function getCirclePerimeter(r) {
    with (Math) {
        return floor(2 * PI * r);
    }
}

function getPointOnCircle(cx, cy, r, n) {
    with (Math) {
        var angle = n / r;
        return {
            x: floor(cx + cos(angle) * r),
            y: floor(cy - sin(angle) * r)
        };
    }
}