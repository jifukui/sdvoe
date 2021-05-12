import { Modal } from "ant-design-vue";
var checkInp = {};

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
                return false;
            }
            for (var i = 1; i < parts.length; i++) {
                if (parts[i] > 255) {
                    return false;
                }
            }
            if (
                (parts[1] | parts[2] | parts[3]) == 0 ||
                (parts[1] & parts[2] & parts[3]) == 255
            ) {
                return false;
            } else {
                return true;
            }
        }
    } else {
        return false;
    }
}
checkInp.fnValidateMask = function (MaskInput) {
    let subnetMask = MaskInput;
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
            return false;
        }
        if (str.length > 1 || mask.indexOf("1") != 0) {
            return false;
        } else {
            if (str[0].length > 30 || str[0].length < 3) {
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
                return false;
            }
            for (var i = 1; i < parts.length; i++) {
                if (parts[i] > 255) {
                    return false;
                }
            }
            if (
                (parts[1] | parts[2] | parts[3]) == 0 ||
                (parts[1] & parts[2] & parts[3]) == 255
            ) {
                return false;
            } else {
                return true;
            }
        }
    } else {
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
    num = num >>> 0;
    return num;
}
//判断ip是否为同一网段
checkInp.isEqualIPAddress = function (addr1, addr2, mask, mask1) {
    if (
        (checkInp.ipToNumber(addr1) & checkInp.ipToNumber(mask)) ==
        (checkInp.ipToNumber(addr2) & checkInp.ipToNumber(mask1))
    ) {
        return true;
    } else {
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
        if (a != b) {
            return false;
        } else {
        }
    }
    return true;
}
checkInp.Compare2Network = async function (ip1, mask1, ip2, mask2, dhcp) {
    let flag = false;
    let obj1 = {};
    let data = {
        res: function () {
            obj1.res();
        },
        rej: function () {
            obj1.rej();
        }
    }
    let obj = new Promise(function (res, rej) {
        obj1.res = res;
        obj1.rej = rej;
    });
    if (!dhcp) {
        ip1 = checkInp.ipToNumber(ip1)
        ip2 = checkInp.ipToNumber(ip2)
        mask1 = checkInp.ipToNumber(mask1)
        mask2 = checkInp.ipToNumber(mask2)
        flag = ((ip1 & mask1) === (ip2 & mask2))
    }
    if (!flag) {
        Modal.confirm({
            title: "提示",
            content: "设置的网络参数与当前网络参数不在同一个网络中\
            设置将会造成设备失联",
            okText: "继续",
            cancelText: "取消",
            onOk: data.res,
            onCancel: data.rej
        })
    } else {
        if (!dhcp) {
            obj1.res();
        }
    }

    return obj;
}
export {
    checkInp
};