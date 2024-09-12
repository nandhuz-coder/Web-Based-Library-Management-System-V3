"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[955],{578:(e,s,a)=>{a.d(s,{A:()=>d});var l=a(43),r=a(216),t=a(475),n=a(213),o=a(579);const d=()=>{const[e,s]=(0,l.useState)(null);(0,l.useEffect)((()=>{(async()=>{try{const e=await n.A.get("/api/global/user");s(e.data.user)}catch(e){console.error("Error fetching user data:",e)}})()}),[]);const a=(0,r.Zp)();return(0,o.jsx)("nav",{className:"navbar navbar-expand-lg navbar-dark bg-dark p-0",children:(0,o.jsxs)("div",{className:"container",children:[(0,o.jsx)(t.N_,{className:"navbar-brand",to:"/user/dashboard/1",children:"Home"}),(0,o.jsx)("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",children:(0,o.jsx)("span",{className:"navbar-toggler-icon"})}),(0,o.jsxs)("div",{className:"collapse navbar-collapse",id:"navbarSupportedContent",children:[(0,o.jsx)("ul",{className:"navbar-nav",children:(0,o.jsx)("li",{className:"nav-item px-2",children:(0,o.jsx)(t.N_,{className:"nav-link",to:"/books/",children:"Browse Books"})})}),e&&e.isAdmin&&(0,o.jsx)("ul",{className:"navbar-nav",children:(0,o.jsx)("li",{className:"nav-item px-2",children:(0,o.jsx)(t.N_,{className:"nav-link",to:"/admin",children:"Admin Dashboard"})})}),e&&(0,o.jsxs)("ul",{className:"navbar-nav ml-auto",children:[e.violationFlag&&(0,o.jsx)("li",{className:"nav-item align-self-center mr-2",children:(0,o.jsx)("i",{className:"fa fa-flag text-danger"})}),(0,o.jsxs)("li",{className:"nav-item dropdown mr-3",children:[(0,o.jsxs)("a",{href:"#",className:"nav-link dropdown-toggle","data-toggle":"dropdown",children:[(0,o.jsx)("i",{className:"fa fa-user"})," Welcome ",e.username]}),(0,o.jsxs)("div",{className:"dropdown-menu",children:[(0,o.jsxs)(t.N_,{to:"/user/1/profile",className:"dropdown-item",children:[(0,o.jsx)("i",{className:"fa fa-user-circle"})," Profile"]}),(0,o.jsxs)("a",{href:"",className:"dropdown-item",onClick:e=>(async e=>{try{e.preventDefault(),await n.A.get("/auth/1/user-logout"),a("/")}catch(s){a("/")}})(e),children:[(0,o.jsx)("i",{className:"fa fa-user-times"})," Logout"]})]})]}),(0,o.jsx)("li",{className:"nav-item",children:(0,o.jsxs)(t.N_,{to:"/user/1/notification",className:"nav-link",children:[(0,o.jsx)("i",{className:"fa fa-bell"}),(0,o.jsx)("span",{className:"badge badge-danger badge-pill",children:"2"})]})})]})]})]})})}},466:(e,s,a)=>{a.d(s,{A:()=>r});a(43);var l=a(579);const r=e=>{let{error:s,success:a,warning:r,dismissAlert:t}=e;return(0,l.jsxs)("div",{className:"container my-2 sticky-top",children:[s&&s.length>0&&(0,l.jsxs)("div",{className:"alert alert-danger alert-dismissible fade show",role:"alert",children:[s,(0,l.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>t("error"),children:(0,l.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),a&&a.length>0&&(0,l.jsxs)("div",{className:"alert alert-success alert-dismissible fade show",role:"alert",children:[a,(0,l.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>t("success"),children:(0,l.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),r&&r.length>0&&(0,l.jsxs)("div",{className:"alert alert-warning alert-dismissible fade show",role:"alert",children:[r,(0,l.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>t("warning"),children:(0,l.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]})]})}},955:(e,s,a)=>{a.r(s),a.d(s,{default:()=>m});var l=a(43),r=a(475),t=a(213),n=a(578),o=a(466),d=a(843),i=a(216),c=a(579);const m=()=>{const e=(0,i.Zp)(),[s,a]=(0,l.useState)(null),[m,h]=(0,l.useState)(""),[u,x]=(0,l.useState)(""),[j,b]=(0,l.useState)(!0),[N,p]=(0,l.useState)(!1),[f,g]=(0,l.useState)({oldPassword:"",newPassword:"  ",confirmPassword:""});(0,l.useEffect)((()=>{t.A.get("/user/2/profile").then((e=>{a(e.data.currentuser)})).catch((e=>{console.error("Error fetching user data:",e),x("Failed to load user data.")})).finally((()=>b(!1)))}),[N]);const v=e=>{const{name:s,value:a}=e.target;g((e=>({...e,[s]:a})))};return!s||j?(0,c.jsx)(d.A,{}):(0,c.jsx)(c.Fragment,{children:(0,c.jsxs)(l.Suspense,{fallback:(0,c.jsx)(d.A,{}),children:[(0,c.jsx)(n.A,{}),(0,c.jsx)("style",{children:"\n                    .card-header {\n                        background: rgb(219, 167, 35);\n                    }\n                "}),(0,c.jsx)("header",{id:"main-header",className:"py-2 bg-info text-white",children:(0,c.jsx)("div",{className:"container",children:(0,c.jsx)("div",{className:"row",children:(0,c.jsx)("div",{className:"col-md-6",children:(0,c.jsxs)("h1",{children:[(0,c.jsx)("i",{className:"fa fa-user"})," Profile"]})})})})}),(0,c.jsx)("section",{id:"actions",className:"py-4 mb-4",children:(0,c.jsx)("div",{className:"container",children:(0,c.jsxs)("div",{className:"row",children:[(0,c.jsx)("div",{className:"col-md-3 mr-auto",children:(0,c.jsxs)(r.N_,{to:"/user/dashboard/1",className:"btn btn-light btn-block",children:[(0,c.jsx)("i",{className:"fa fa-arrow-left"})," Back To Dashboard"]})}),(0,c.jsx)("div",{className:"col-md-3",children:(0,c.jsxs)("button",{className:"btn btn-primary btn-block","data-toggle":"modal","data-target":"#changePasswordModal",children:[(0,c.jsx)("i",{className:"fa fa-key"})," Change Password"]})}),(0,c.jsx)("div",{className:"col-md-3",children:(0,c.jsxs)("button",{className:"btn btn-warning btn-block","data-toggle":"modal","data-target":"#updateProfileModal",children:[(0,c.jsx)("i",{className:"fa fa-refresh"})," Update Profile"]})}),s.bookIssueInfo.length>0||s.bookRequestInfo.length>0||s.bookReturnInfo.length>0?(0,c.jsx)("div",{className:"col-md-3",children:(0,c.jsxs)("button",{className:"btn btn-danger btn-block",disabled:!0,title:"You have to return all borrowed/renewed books first",children:[(0,c.jsx)("i",{className:"fa fa-remove"})," Delete Profile"]})}):(0,c.jsx)("div",{className:"col-md-3",children:(0,c.jsxs)("button",{className:"btn btn-danger btn-block","data-toggle":"modal","data-target":"#deleteProfileModal",children:[(0,c.jsx)("i",{className:"fa fa-remove"})," Delete Profile"]})})]})})}),(0,c.jsx)(o.A,{success:m,error:u,dismissAlert:e=>{"error"===e?x(""):"success"===e&&h("")}}),(0,c.jsx)("section",{className:"mt-4",children:(0,c.jsx)("div",{className:"container",children:(0,c.jsxs)("div",{className:"row",style:{marginBottom:"20px"},children:[(0,c.jsxs)("div",{className:"col-md-3",children:[(0,c.jsx)("img",{src:"/images/user-profile/".concat(s.image),className:"card-img-top rounded-circle",alt:"User"}),(0,c.jsxs)("button",{className:"text-muted ml-5 btn btn-warning","data-toggle":"modal","data-target":"#changePhotoModal",children:[(0,c.jsx)("i",{className:"fa fa-camera"})," Change Photo"]})]}),(0,c.jsxs)("div",{className:"col-md-6",style:{border:"1px solid black"},children:[(0,c.jsx)("h4",{className:"text-center pb-3 card-header",children:"Personal Informations"}),(0,c.jsxs)("ul",{className:"list-group list-group-flush",children:[(0,c.jsxs)("li",{className:"list-group-item",children:["First Name: ",s.firstName]}),(0,c.jsxs)("li",{className:"list-group-item",children:["Last Name: ",s.lastName]}),(0,c.jsxs)("li",{className:"list-group-item",children:["Username: ",s.username]}),(0,c.jsxs)("li",{className:"list-group-item",children:["Joined: ",new Date(s.joined).toDateString()]}),(0,c.jsxs)("li",{className:"list-group-item",children:["Email: ",s.email]}),(0,c.jsxs)("li",{className:"list-group-item",children:["Address: ",s.address]}),(0,c.jsxs)("li",{className:"list-group-item text-danger font-weight-bold",children:["Violation Flag: ",s.violationFlag.toString()]}),(0,c.jsxs)("li",{className:"list-group-item",children:["Due Fines: $",s.fines||0]})]})]}),(0,c.jsxs)("div",{className:"col-md-3",children:[(0,c.jsx)("h4",{className:"text-center pb-3",children:"Terms & Conditions"}),(0,c.jsxs)("ul",{children:[(0,c.jsx)("li",{children:"Rule x should be abided by everyone"}),(0,c.jsx)("li",{children:"Rule x should be abided by everyone"}),(0,c.jsx)("li",{children:"Rule x should be abided by everyone"}),(0,c.jsx)("li",{children:"Rule x should be abided by everyone"})]})]})]})})}),(0,c.jsx)("div",{className:"modal fade",id:"deleteProfileModal",children:(0,c.jsx)("div",{className:"modal-dialog modal-lg",children:(0,c.jsxs)("div",{className:"modal-content",children:[(0,c.jsxs)("div",{className:"modal-header bg-danger text-white",children:[(0,c.jsx)("h5",{className:"modal-title",children:"Once you press yes, all of your issues, comments, and activities will be deleted permanently. Are you sure?"}),(0,c.jsx)("button",{className:"close","data-dismiss":"modal",children:(0,c.jsx)("span",{children:"\xd7"})})]}),(0,c.jsxs)("div",{className:"modal-body",children:[(0,c.jsx)("form",{onSubmit:s=>(s=>{s.preventDefault(),t.A.delete("/api/user/1/delete").then((()=>{h("Account deleted successfully"),e("/auth/user-login")})).catch((e=>{console.error("Error deleting account:",e),x("Error deleting account")}))})(s),children:(0,c.jsx)("input",{type:"submit",value:"Yes",className:"btn btn-danger btn-block m-1"})}),(0,c.jsx)("input",{type:"button",value:"No","data-dismiss":"modal",className:"btn btn-success btn-block m-1"})]})]})})}),(0,c.jsx)("div",{className:"modal fade",id:"changePasswordModal",children:(0,c.jsx)("div",{className:"modal-dialog modal-lg",children:(0,c.jsxs)("div",{className:"modal-content",children:[(0,c.jsxs)("div",{className:"modal-header bg-primary text-white",children:[(0,c.jsx)("h5",{className:"modal-title",children:"Edit Password"}),(0,c.jsx)("button",{className:"close","data-dismiss":"modal",children:(0,c.jsx)("span",{children:"\xd7"})})]}),(0,c.jsx)("div",{className:"modal-body",children:(0,c.jsxs)("form",{onSubmit:s=>(s=>{s.preventDefault(),f.newPassword===f.confirmPassword?t.A.post("/api/user/1/changepassword",f).then((()=>{h("Password updated successfully"),e("/auth/user-login")})).catch((e=>{console.error("Error updating password:",e),x("Error updating password")})):x("Passwords do not match!")})(s),children:[(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"oldPassword",className:"form-control-label",children:"Old Password"}),(0,c.jsx)("input",{type:"password",name:"oldPassword",id:"oldPassword",className:"form-control",value:f.oldPassword,onChange:v})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"newPassword",className:"form-control-label",children:"New Password"}),(0,c.jsx)("input",{type:"password",name:"newPassword",id:"newPassword",className:"form-control",value:f.newPassword,onChange:v})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"confirmPassword",className:"form-control-label",children:"Confirm Password"}),(0,c.jsx)("input",{type:"password",name:"confirmPassword",id:"confirmPassword",className:"form-control",value:f.confirmPassword,onChange:v}),(0,c.jsx)("span",{id:"message",style:{color:f.newPassword===f.confirmPassword?"green":"red"},children:f.newPassword===f.confirmPassword?"Matched":"Not matched!"})]}),(0,c.jsx)("button",{id:"button",className:"btn btn-warning btn-block",disabled:f.newPassword!==f.confirmPassword,children:"Submit"})]})})]})})}),(0,c.jsx)("div",{className:"modal fade",id:"changePhotoModal",children:(0,c.jsx)("div",{className:"modal-dialog modal-lg",children:(0,c.jsxs)("div",{className:"modal-content",children:[(0,c.jsxs)("div",{className:"modal-header bg-warning text-white",children:[(0,c.jsx)("h5",{className:"modal-title",children:"Change Photo"}),(0,c.jsx)("button",{className:"close","data-dismiss":"modal",children:(0,c.jsx)("span",{children:"\xd7"})})]}),(0,c.jsx)("div",{className:"modal-body",children:(0,c.jsxs)("form",{onSubmit:e=>{e.preventDefault();const s=new FormData,a=document.querySelector('input[name="photo"]');s.append("image",a.files[0]),t.A.put("/api/user/changeimage",s,{headers:{"Content-Type":"multipart/form-data"}}).then((()=>{h("Profile photo updated successfully."),p(!N)})).catch((()=>{x("Failed to update profile photo.")}))},encType:"multipart/form-data",children:[(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"photo",className:"form-control-label",children:"Upload Image"}),(0,c.jsx)("input",{type:"file",name:"photo",className:"form-control-file"})]}),(0,c.jsx)("button",{className:"btn btn-primary btn-block",children:"Submit"})]})})]})})}),(0,c.jsx)("div",{className:"modal fade",id:"updateProfileModal",children:(0,c.jsx)("div",{className:"modal-dialog modal-lg",children:(0,c.jsxs)("div",{className:"modal-content",children:[(0,c.jsxs)("div",{className:"modal-header bg-warning text-white",children:[(0,c.jsx)("h5",{className:"modal-title",children:"Update Profile"}),(0,c.jsx)("button",{className:"close","data-dismiss":"modal",children:(0,c.jsx)("span",{children:"\xd7"})})]}),(0,c.jsx)("div",{className:"modal-body",children:(0,c.jsxs)("form",{onSubmit:e=>(e=>{e.preventDefault();const s={firstName:e.target.firstName.value,lastName:e.target.lastName.value,username:e.target.username.value,email:e.target.email.value,address:e.target.address.value};t.A.post("/api/user/profile/edit",s).then((e=>{h(e.data.success),a(e.data.currentuser)})).catch((e=>{console.error("Error updating profile:",e),x(e)}))})(e),children:[(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"firstName",className:"form-control-label",children:"First Name"}),(0,c.jsx)("input",{type:"text",name:"firstName",className:"form-control",defaultValue:s.firstName})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"lastName",className:"form-control-label",children:"Last Name"}),(0,c.jsx)("input",{type:"text",name:"lastName",className:"form-control",defaultValue:s.lastName})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"username",className:"form-control-label",children:"Username"}),(0,c.jsx)("input",{type:"text",name:"username",className:"form-control",defaultValue:s.username})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"email",className:"form-control-label",children:"Email"}),(0,c.jsx)("input",{type:"email",name:"email",className:"form-control",defaultValue:s.email})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{htmlFor:"address",className:"form-control-label",children:"Address"}),(0,c.jsx)("input",{type:"text",name:"address",className:"form-control",defaultValue:s.address})]}),(0,c.jsx)("input",{type:"submit",value:"Submit",className:"btn btn-warning btn-block"})]})})]})})})]})})}}}]);
//# sourceMappingURL=955.10a3dcc8.chunk.js.map