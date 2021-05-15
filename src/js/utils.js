import { message, notification } from "ant-design-vue";
function checkNumer(value) {
    let data;
    let flag = false
    if (typeof value == "number") {
        flag = true;
    } else if (typeof value === "string") {
        value = value.replace(/\s/g, "");
        flag = /^(\+|-)?\d+$/.test(value);
        data = parseInt(value)
    }
    if (!flag) {
        notification.warning({
            message: "参数为非数值类型数据",
            duration: 1,
        });
        return Promise.reject();
    }
    return Promise.resolve(data);
}
export {
    checkNumer
}