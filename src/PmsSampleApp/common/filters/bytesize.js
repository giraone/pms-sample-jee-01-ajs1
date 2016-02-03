'use strict';

angular.module('byteSizeDisplayFilter', []).filter('byteSizeDisplay', function() {
  return function(input) {
    if (!input) return "-";
    var t = "" + input;
    var len = t.length;
    var ret;
    switch (len)
    {
        case 0:
            ret = "";
            break;
        case 1:
            if (t.indexOf('1') == 0)
                ret = t + " Byte";
            else
                ret = t + " Bytes";
            break;
        case 2:
            ret = t + " Bytes";
            break;
        case 3:
            ret = t + " Bytes";
            break;
        case 4:
            ret = t.substring(0, 1) + "." + t.substring(1, 3) + " KByte";
            break;
        case 5:
            ret = t.substring(0, 2) + "." + t.substring(2, 3) + " KByte";
            break;
        case 6:
            ret = t.substring(0, 3) + " KByte";
            break;
        case 7:
            ret = t.substring(0, 1) + "." + t.substring(1, 3) + " MByte";
            break;
        case 8:
            ret = t.substring(0, 2) + "." + t.substring(2, 3) + " MByte";
            break;
        case 9:
            ret = t.substring(0, 3) + " MByte";
            break;
        default:
            ret = Long.toString(input/1000000) + " MByte";
    }
    return ret;
  };
});