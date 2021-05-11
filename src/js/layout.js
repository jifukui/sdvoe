function setLayout(value, width, height) {
    let layout;
    if (value == 1) {
        layout = [{
                top: 0,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 0
            },
            {
                top: height,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 1
            },
            {
                top: 2 * height,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 2
            },
            {
                top: 3 * height,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 3
            },
            {
                top: 3 * height,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 4
            },
            {
                top: 3 * height,
                left: 2 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 5
            },
            {
                top: 3 * height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 6
            },
            {
                top: 0,
                left: width,
                width: 3 * width,
                height: 3 * height,
                origin: "",
                "z-index": 7
            },
        ]
    } else if (value == 2) {
        layout = [{
                top: 0,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 0
            },
            {
                top: 0,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 1
            },
            {
                top: 0,
                left: 2 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 2
            },
            {
                top: 0,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 3
            },
            {
                top: height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 4
            },
            {
                top: 2 * height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 5
            },
            {
                top: 3 * height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 6
            },
            {
                top: height,
                left: 0,
                width: 3 * width,
                height: 3 * height,
                origin: "",
                "z-index": 7
            },
        ]
    } else if (value == 3) {
        layout = [{
                top: 0,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 0
            },
            {
                top: 0,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 1
            },
            {
                top: 0,
                left: 2 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 2
            },
            {
                top: 0,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 3
            },
            {
                top: height,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 4
            },
            {
                top: 2 * height,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 5
            },
            {
                top: 3 * height,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 6
            },
            {
                top: height,
                left: width,
                width: 3 * width,
                height: 3 * height,
                origin: "",
                "z-index": 7
            },
        ]
    } else if (value == 4) {
        layout = [{
                top: 0,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 0
            },
            {
                top: height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 1
            },
            {
                top: 2 * height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 2
            },
            {
                top: 3 * height,
                left: 3 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 3
            },
            {
                top: 3 * height,
                left: 0,
                width: width,
                height: height,
                origin: "",
                "z-index": 4
            },
            {
                top: 3 * height,
                left: width,
                width: width,
                height: height,
                origin: "",
                "z-index": 5
            },
            {
                top: 3 * height,
                left: 2 * width,
                width: width,
                height: height,
                origin: "",
                "z-index": 6
            },
            {
                top: 0,
                left: 0,
                width: 3 * width,
                height: 3 * height,
                origin: "",
                "z-index": 7
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
// 深度判断两个数组是否完全相等
function equalsObj(oldData, newData) {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
        // 类型为对象并且元素个数相同        
        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
                if (!equalsObj(oldData[key], newData[key])) {
                    // 对象中具有不相同属性 返回false
                    return false;
                }
            }
        }
    } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
        // 类型为数组并且数组长度相同

        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!equalsObj(oldData[i], newData[i])) {
                // 如果数组元素中具有不相同元素,返回false
                return false;
            }
        }
    } else {
        // 其它类型,均返回false
        return false;
    }
    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
}
export {
    setLayout,
    equalsObj
}