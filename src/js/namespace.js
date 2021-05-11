import notification  from "ant-design-vue";
function NameChecked(value){
    console.log("jifukui to this")
    let flag = false
    if(typeof value === "string"){
          flag = value.match(/\s/g).length===value.length
    }
    if(!flag){
        notification.warning({
            message: "名称设置错误，请重试",
            duration: 1,
        });
    }
    return flag;
}

export {
    NameChecked
}
