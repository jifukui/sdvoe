var checkInp = {

};

checkInp.fnValidateIPAddress = function (ipInput) {
    let ipaddr = ipInput;
    let zeroAllow = false;
    console.log(ipaddr);
    ipaddr = ipaddr.replace(/\s/g, "");
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ipaddr)) {
        var parts = ipaddr.split(".");
        parts[0] = parseInt(parseFloat(parts[0]));
        parts[1] = parseInt(parseFloat(parts[1]));
        parts[2] = parseInt(parseFloat(parts[2]));
        parts[3] = parseInt(parseFloat(parts[3]));
        if (!zeroAllow) {
            if (parts[0] < 0 || parts[0] > 223 || parts[0] == 127) {
                console.log("第一字节是用非法的数据");
                return false;
            }
            for (var i = 1; i < parts.length; i++) {
                if (parts[i] > 255) {
                    console.log("数据超出范围");
                    return false;
                }
            }
            if (
                (parts[1] | parts[2] | parts[3]) == 0 ||
                (parts[1] & parts[2] & parts[3]) == 255
            ) {
                console.log("使用的全1全0");
                return false;
            } else {
                return true;
            }
        }
    } else {
        console.log("不合法的数据");
        return false;
    }
}
checkInp.fnValidateMask = function (MaskInput) {
    let subnetMask = MaskInput;
    console.log(subnetMask);
    subnetMask = subnetMask.replace(/\s/g, "");
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(subnetMask)) {
        var parts = subnetMask.split(".");
        var mask = 0;
        var value = 1;
        parts[0] = parseInt(parseFloat(parts[0]));
        parts[1] = parseInt(parseFloat(parts[1]));
        parts[2] = parseInt(parseFloat(parts[2]));
        parts[3] = parseInt(parseFloat(parts[3]));
        for (var i = 0; i < 4; i++) {
            if (parts[i] > 255) {
                console.log("超出范围");
                return false;
            }
        }
        mask =
            (parts[0] + 256) * 256 * 256 * 256 +
            parts[1] * 256 * 256 +
            parts[2] * 256 +
            parts[3];
        mask = mask.toString(2);
        console.log(mask);
        mask = mask.slice(1);
        var reg = /1+/g;
        var str = mask.match(reg);
        if (str == null) {
            console.log("權威0");
            return false;
        }
        if (str.length > 1 || mask.indexOf("1") != 0) {
            console.log("0,1交叉或者是1开始的位置不为0");
            return false;
        } else {
            if (str[0].length > 30 || str[0].length < 3) {
                console.log("子网掩码的1数据量不对");
                return false;
            } else {
                return true;
            }
        }
    }
    return false;
}
checkInp.fnValidateGateway = function (gateWayInp) {
    let ipaddr = gateWayInp;
    let zeroAllow = false;
    console.log(ipaddr);
    ipaddr = ipaddr.replace(/\s/g, "");
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ipaddr)) {
        var parts = ipaddr.split(".");
        parts[0] = parseInt(parseFloat(parts[0]));
        parts[1] = parseInt(parseFloat(parts[1]));
        parts[2] = parseInt(parseFloat(parts[2]));
        parts[3] = parseInt(parseFloat(parts[3]));
        if (!zeroAllow) {
            if (parts[0] < 0 || parts[0] > 223 || parts[0] == 127) {
                console.log("第一字节是用非法的数据");
                return false;
            }
            for (var i = 1; i < parts.length; i++) {
                if (parts[i] > 255) {
                    console.log("数据超出范围");
                    return false;
                }
            }
            if (
                (parts[1] | parts[2] | parts[3]) == 0 ||
                (parts[1] & parts[2] & parts[3]) == 255
            ) {
                console.log("使用的全1全0");
                return false;
            } else {
                return true;
            }
        }
    } else {
        console.log("不合法的数据");
        return false;
    }
}
checkInp.fnValidateIcp = function (tcpInput) {
    if (tcpInput > 65535 || tcpInput < 2000) {
        return false;
    } else {
        return true;
    }
}
checkInp.fnValidateUdp = function (udpInput) {
    if (udpInput > 65535 || udpInput < 2000) {
        return false;
    } else {
        return true;
    }
}
checkInp.fnValidateaudio = function (udpInput) {
    if (udpInput > 5000 || udpInput < 0) {
        return false;
    } else {
        return true;
    }
}
checkInp.ipToNumber = function (ip) {
    var num = 0;
    if (ip == "") {
        return num;
    }
    var aNum = ip.split(".");
    if (aNum.length != 4) {
        return num;
    }
    num += parseInt(aNum[0]) << 24;
    num += parseInt(aNum[1]) << 16;
    num += parseInt(aNum[2]) << 8;
    num += parseInt(aNum[3]);
    num = num >>> 0; //这个很关键，不然可能会出现负数的情况
    console.log(num);
    return num;
}
//判断ip是否为同一网段
checkInp.isEqualIPAddress = function (addr1, addr2, mask, mask1) {
    if (
        (checkInp.ipToNumber(addr1) & checkInp.ipToNumber(mask)) ==
        (checkInp.ipToNumber(addr2) & checkInp.ipToNumber(mask1))
    ) {
        console.log("在同一个网段");
        return true;
    } else {
        console.log("不在同一个网段");
        return false;
    }
}
checkInp.fnipmaskgateway = function (ip, mask, gateway) {
    let iparr = ip.split(".");
    let maskarr = mask.split(".");
    let gatearr = gateway.split(".");
    for (let i = 0; i < 4; i++) {
        let a = iparr[i] & maskarr[i];
        let b = gatearr[i] & maskarr[i];
        console.log("11111", i, iparr[i], maskarr[i], gatearr[i], a, b)
        if (a != b) {
            console.log("ip&mask != gateway&mask")
            return false;
        } else {
            console.log("ip&mask == gateway&mask")
        }
    }
    return true;
}

export {
    checkInp
};