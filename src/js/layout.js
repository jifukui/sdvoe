function setLayout(value, width, height) {
    let layout;
    let width_s = width % 32 ? width + 32 - (width % 32) : width
    let height_s = height % 32 ? height + 32 - (height % 32) : height
    if (value == 1) {
        layout = [{
            top: 0,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 0,
            surface_top: 0,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: height,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 1,
            surface_top: height_s,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 2 * height,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 2,
            surface_top: 2 * height_s,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 3,
            surface_top: 3 * height_s,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 4,
            surface_top: 3 * height_s,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 2 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 5,
            surface_top: 3 * height_s,
            surface_left: 2 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 6,
            surface_top: 3 * height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: width,
            width: 3 * width,
            height: 3 * height,
            origin: "",
            "z-index": 7,
            surface_top: 0,
            surface_left: width_s,
            surface_width: 3 * width_s,
            surface_height: 3 * height_s
        },
        ]
    } else if (value == 2) {
        layout = [{
            top: 0,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 0,
            surface_top: 0,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 1,
            surface_top: 0,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: 2 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 2,
            surface_top: 0,
            surface_left: 2 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 3,
            surface_top: 0,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 4,
            surface_top: height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 2 * height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 5,
            surface_top: 2 * height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 6,
            surface_top: 3 * height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: height,
            left: 0,
            width: 3 * width,
            height: 3 * height,
            origin: "",
            "z-index": 7,
            surface_top: height_s,
            surface_left: 0,
            surface_width: 3 * width_s,
            surface_height: 3 * height_s
        },
        ]
    } else if (value == 3) {
        layout = [{
            top: 0,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 0,
            surface_top: 0,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 1,
            surface_top: 0,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: 2 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 2,
            surface_top: 0,
            surface_left: 2 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 3,
            surface_top: 0,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: height,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 4,
            surface_top: height_s,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 2 * height,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 5,
            surface_top: 2 * height_s,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 6,
            surface_top: 3 * height_s,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: height,
            left: width,
            width: 3 * width,
            height: 3 * height,
            origin: "",
            "z-index": 7,
            surface_top: height_s,
            surface_left: width_s,
            surface_width: 3 * width_s,
            surface_height: 3 * height_s
        },
        ]
    } else if (value == 4) {
        layout = [{
            top: 0,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 0,
            surface_top: 0,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 1,
            surface_top: height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 2 * height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 2,
            surface_top: 2 * height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 3 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 3,
            surface_top: 3 * height_s,
            surface_left: 3 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 0,
            width: width,
            height: height,
            origin: "",
            "z-index": 4,
            surface_top: 3 * height_s,
            surface_left: 0,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: width,
            width: width,
            height: height,
            origin: "",
            "z-index": 5,
            surface_top: 3 * height_s,
            surface_left: width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 3 * height,
            left: 2 * width,
            width: width,
            height: height,
            origin: "",
            "z-index": 6,
            surface_top: 3 * height_s,
            surface_left: 2 * width_s,
            surface_width: width_s,
            surface_height: height_s
        },
        {
            top: 0,
            left: 0,
            width: 3 * width,
            height: 3 * height,
            origin: "",
            "z-index": 7,
            surface_top: 0,
            surface_left: 0,
            surface_width: 3 * width_s,
            surface_height: 3 * height_s
        },
        ]
    }
    return layout;
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};
// ??????????????????????????????????????????
function equalsObj(oldData, newData) {
    // ????????????????????????,????????????,?????????true
    if (oldData === newData) return true;
    if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
        // ???????????????????????????????????????        
        // ?????????????????????????????????,????????????????????????
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
                if (!equalsObj(oldData[key], newData[key])) {
                    // ?????????????????????????????? ??????false
                    return false;
                }
            }
        }
    } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
        // ???????????????????????????????????????

        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!equalsObj(oldData[i], newData[i])) {
                // ??????????????????????????????????????????,??????false
                return false;
            }
        }
    } else {
        // ????????????,?????????false
        return false;
    }
    // ????????????,????????????????????????????????????????????????,??????true
    return true;
}
export {
    setLayout,
    equalsObj
}