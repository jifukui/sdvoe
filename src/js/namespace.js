import { message, notification } from "ant-design-vue";
function NameChecked(value, info) {
    let flag = false
    if (typeof value === "string") {
        flag = !(value.match(/\s/g) && value.match(/\s/g).length === value.length);
    }
    if (!flag) {
        notification.warning({
            message: info,
            duration: 1,
        });
    }
    return flag;
}

export { NameChecked }
