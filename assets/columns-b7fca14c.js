import{d as u,c,b as e,e as t,F as a,p as o,_ as n,u as d}from"./index-d4851931.js";const i=o(()=>n(()=>import("./aside-86fae959.js"),["assets/aside-86fae959.js","assets/index-d4851931.js","assets/index-2648dcb0.css"])),r=o(()=>n(()=>import("./header-c2e3b53d.js"),["assets/header-c2e3b53d.js","assets/index-d4851931.js","assets/index-2648dcb0.css"])),s=o(()=>n(()=>import("./main-9c97697d.js"),["assets/main-9c97697d.js","assets/index-d4851931.js","assets/index-2648dcb0.css"])),p=u({setup(){return{isFixedHeader:c(()=>d().useThemeStore.isFixedHeader)}},render(){const{isFixedHeader:l}=this;return e(a,null,[e(t("el-container"),{class:"layout-container"},{default:()=>[e("div",{class:"layout-columns-warp"},[e(i,null,null),e(t("el-container"),{class:{"flex-center":!0,"layout-backtop":!0,"layout-backtop":!l}},{default:()=>[l?e(a,null,[e(r,null,null),e(t("el-scrollbar"),{class:{"layout-backtop":l}},{default:()=>[e(s,null,null)]})]):e(a,null,[e(t("el-scrollbar"),{class:{"layout-backtop":l}},{default:()=>[e(r,null,null),e(s,null,null)]})])]})]),e(t("el-backtop"),{target:".layout-backtop .el-scrollbar__wrap"},null)]})])}});export{p as default};