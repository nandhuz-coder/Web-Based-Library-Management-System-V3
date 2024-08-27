"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[328],{328:(e,a,s)=>{s.r(a),s.d(a,{default:()=>i});var r=s(43),l=s(213),n=s(466),t=s(652),c=s(579);const i=()=>{const[e,a]=(0,r.useState)({username:"",email:"",password:"",adminCode:""}),[s,i]=(0,r.useState)(""),[o,d]=(0,r.useState)(""),m=e=>{const{name:s,value:r}=e.target;a((e=>({...e,[s]:r})))};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(t.A,{}),(0,c.jsx)("div",{className:"container-background",children:(0,c.jsx)("section",{children:(0,c.jsx)("div",{className:"container",children:(0,c.jsx)("div",{className:"row",children:(0,c.jsx)("div",{className:"col-md-6 offset-md-3",style:{marginTop:20},children:(0,c.jsxs)("div",{className:"card",children:[(0,c.jsxs)("div",{className:"card-header text-center",children:[(0,c.jsx)(n.A,{success:s,error:o,dismissAlert:e=>{"error"===e?d(""):"success"===e&&i("")}}),(0,c.jsx)("h4",{children:"Admin Sign Up"})]}),(0,c.jsx)("div",{className:"card-block",children:(0,c.jsxs)("form",{className:"p-3",onSubmit:s=>{s.preventDefault(),l.A.post("/auth/admin-signup",e).then((e=>{e.data.success?i(e.data.success):d(e.data.error),a({username:"",email:"",password:"",adminCode:""})})).catch((e=>{d(e),console.error("There was an error signing up!",e)}))},children:[(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{className:"form-control-label",children:"Pick a username"}),(0,c.jsx)("input",{type:"text",name:"username",placeholder:"Username",className:"form-control",value:e.username,onChange:m,required:!0})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{className:"form-control-label",children:"Email"}),(0,c.jsx)("input",{type:"email",name:"email",placeholder:"Email",className:"form-control",value:e.email,onChange:m,required:!0})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{className:"form-control-label",children:"Password"}),(0,c.jsx)("input",{type:"password",name:"password",placeholder:"Password",className:"form-control",value:e.password,onChange:m,required:!0})]}),(0,c.jsxs)("div",{className:"form-group",children:[(0,c.jsx)("label",{className:"form-control-label",children:"Secret Code"}),(0,c.jsx)("input",{type:"text",name:"adminCode",placeholder:"Enter the secret code",className:"form-control",value:e.adminCode,onChange:m,required:!0})]}),(0,c.jsx)("button",{type:"submit",className:"btn btn-primary btn-block",children:"Submit"})]})})]})})})})})})]})}},466:(e,a,s)=>{s.d(a,{A:()=>l});s(43);var r=s(579);const l=e=>{let{error:a,success:s,warning:l,dismissAlert:n}=e;return(0,r.jsxs)("div",{className:"container my-2 sticky-top",children:[a&&a.length>0&&(0,r.jsxs)("div",{className:"alert alert-danger alert-dismissible fade show",role:"alert",children:[a,(0,r.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("error"),children:(0,r.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),s&&s.length>0&&(0,r.jsxs)("div",{className:"alert alert-success alert-dismissible fade show",role:"alert",children:[s,(0,r.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("success"),children:(0,r.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),l&&l.length>0&&(0,r.jsxs)("div",{className:"alert alert-warning alert-dismissible fade show",role:"alert",children:[l,(0,r.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("warning"),children:(0,r.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]})]})}},652:(e,a,s)=>{s.d(a,{A:()=>n});s(43);var r=s(475),l=s(579);const n=()=>(0,l.jsxs)("nav",{className:"navbar navbar-expand-lg navbar-dark sticky-top",children:[(0,l.jsxs)("a",{className:"navbar-brand",href:"#",children:[(0,l.jsx)("img",{src:"/image/other/purepng.com-booksbookillustratedwrittenprintedliteratureclipart-1421526451707uyace.png",width:"30",height:"30",className:"d-inline-block align-top",alt:""}),"Library Management System"]}),(0,l.jsx)("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",children:(0,l.jsx)("span",{className:"navbar-toggler-icon"})}),(0,l.jsxs)("div",{className:"collapse navbar-collapse",children:[(0,l.jsxs)("ul",{className:"navbar-nav mr-auto",children:[(0,l.jsx)("li",{className:"nav-item pl-2",children:(0,l.jsx)(r.N_,{className:"btn btn-success",to:"/auth/user-login",children:"Login"})}),(0,l.jsx)("li",{className:"nav-item pl-2",children:(0,l.jsx)(r.N_,{className:"btn btn-success",to:"/auth/user-signup",children:"User Sign Up"})}),(0,l.jsx)("li",{className:"nav-item pl-2",children:(0,l.jsx)(r.N_,{className:"btn btn-success",to:"/books/",children:"Browse Books"})})]}),(0,l.jsx)("form",{className:"form-inline my-2 my-lg-0",children:(0,l.jsxs)("div",{className:"input-group",children:[(0,l.jsx)("input",{className:"form-control mr-sm-2",type:"text",placeholder:"Search","aria-label":"Search",style:{marginRight:"0px"}}),(0,l.jsx)("div",{className:"input-group-append",children:(0,l.jsx)("button",{className:"btn btn-secondary btn-search",type:"button",children:(0,l.jsx)("i",{className:"fa fa-search"})})})]})})]})]})}}]);
//# sourceMappingURL=328.fa637f3f.chunk.js.map