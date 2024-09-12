"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[91],{91:(e,s,a)=>{a.r(s),a.d(s,{default:()=>m});var t=a(43),r=a(213),n=a(216),i=a(475),l=a(466),c=a(314),d=a(843),o=a(579);const m=()=>{const{userId:e}=(0,n.g)(),[s,a]=(0,t.useState)([]),[m,h]=(0,t.useState)(!0),[u,x]=(0,t.useState)(""),[j,p]=(0,t.useState)(""),[g,v]=(0,t.useState)("");(0,t.useEffect)((()=>{(async()=>{try{const s=await r.A.get("/admin/1/users/activities/".concat(e));a(s.data.activities),h(!1)}catch(s){x("Failed to fetch activities"),h(!1)}})()}),[e]);return m?(0,o.jsx)(d.A,{}):(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)(t.Suspense,{fallback:(0,o.jsx)(d.A,{}),children:[(0,o.jsx)(c.A,{}),(0,o.jsx)(l.A,{success:j,error:u,dismissAlert:e=>{"error"===e?x(""):"success"===e&&p("")}}),(0,o.jsx)("header",{id:"main-header",className:"py-2 bg-primary text-white",children:(0,o.jsx)("div",{className:"container",children:(0,o.jsx)("div",{className:"row",children:(0,o.jsx)("div",{className:"col-md-6",children:(0,o.jsxs)("h1",{children:[(0,o.jsx)("i",{className:"fa fa-pencil"})," User Activities"]})})})})}),(0,o.jsx)("section",{id:"actions",className:"py-4 mb-4",children:(0,o.jsx)("div",{className:"container",children:(0,o.jsxs)("div",{className:"row",children:[(0,o.jsx)("div",{className:"col-md-3 mr-auto",children:(0,o.jsxs)(i.N_,{to:"/admin",className:"btn btn-light btn-block",children:[(0,o.jsx)("i",{className:"fa fa-arrow-left"})," Back To Dashboard"]})}),(0,o.jsx)("div",{className:"col-md-6",children:(0,o.jsx)("form",{onSubmit:async s=>{s.preventDefault();try{const s=await r.A.post("/api/admin/users/activities/".concat(e),{category:g});a(s.data.activities),p("Activities filtered successfully")}catch(t){x("Failed to filter activities")}},children:(0,o.jsxs)("div",{className:"input-group",children:[(0,o.jsx)("input",{name:"category",type:"text",className:"form-control",placeholder:"Search activities by category...",value:g,onChange:e=>{v(e.target.value)}}),(0,o.jsx)("span",{className:"input-group-btn",children:(0,o.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Search"})})]})})})]})})}),(0,o.jsx)("section",{id:"posts",children:(0,o.jsx)("div",{className:"container",children:(0,o.jsx)("div",{className:"row",children:(0,o.jsx)("div",{className:"col",children:(0,o.jsxs)("div",{className:"card",children:[(0,o.jsx)("div",{className:"card-header text-center",children:(0,o.jsx)("h4",{children:"Recent Activities"})}),(0,o.jsxs)("table",{className:"table table-striped",children:[(0,o.jsx)("thead",{className:"thead-inverse",children:(0,o.jsxs)("tr",{children:[(0,o.jsx)("th",{children:"Info"}),(0,o.jsx)("th",{children:"Category"}),(0,o.jsx)("th",{children:"Date Posted"})]})}),(0,o.jsx)("tbody",{children:s.map(((e,s)=>(0,o.jsxs)("tr",{children:[(0,o.jsxs)("td",{children:["Issue"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," issued ",e.info.title]}),"Return"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," returned ",e.info.title]}),"Request"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," requested ",e.info.title]}),"Decline"===e.category&&(0,o.jsxs)(o.Fragment,{children:["Admin declined ",e.info.title," request of ",e.user_id.username]}),"Return apply"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," applied to return ",e.info.title]}),"Return decline"===e.category&&(0,o.jsxs)(o.Fragment,{children:["Admin declined ",e.info.title," request to return ",e.user_id.username]}),"Renew"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," renewed ",e.info.title]}),"Update Profile"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," updated profile"]}),"Update Password"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," updated password"]}),"Upload Photo"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," updated/uploaded profile"]}),"Comment"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," commented on ",e.info.title]}),"Update Comment"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," updated comment on ",e.info.title]}),"Delete Comment"===e.category&&(0,o.jsxs)(o.Fragment,{children:[e.user_id.username," deleted comment on ",e.info.title]})]}),(0,o.jsx)("td",{children:e.category}),(0,o.jsx)("td",{children:new Date(e.entryTime).toDateString()})]},s)))})]})]})})})})})]})})}},314:(e,s,a)=>{a.d(s,{A:()=>c});var t=a(43),r=a(213),n=a(216),i=a(475),l=a(579);const c=()=>{const[e,s]=(0,t.useState)([]),[a,c]=(0,t.useState)(),d=async()=>{try{const e=await r.A.get("/api/global"),a=await e.data;s(a.global),c(a.currentUser)}catch(e){console.error("Error fetching data",e)}};(0,t.useEffect)((()=>{d();const e=setInterval((()=>{d()}),6e4);return()=>clearInterval(e)}),[]);const o=(0,n.Zp)();return(0,l.jsx)("nav",{className:"navbar navbar-expand-lg navbar-dark bg-dark p-0 sticky-top",children:(0,l.jsxs)("div",{className:"container",children:[(0,l.jsx)("a",{className:"navbar-brand",href:"/admin",children:"Home"}),(0,l.jsx)("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",children:(0,l.jsx)("span",{className:"navbar-toggler-icon"})}),(0,l.jsxs)("div",{className:"collapse navbar-collapse",id:"navbarSupportedContent",children:[(0,l.jsxs)("ul",{className:"navbar-nav",children:[(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsx)(i.N_,{to:"/admin/books/bookInventory/",id:"book_inventory",title:"Book Inventory",className:"nav-link",children:"Book Inventory"})}),(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsx)(i.N_,{to:"/admin/1/users/",id:"users_list",title:"Users",className:"nav-link",children:"Users"})}),(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsx)(i.N_,{to:"/admin/1/addbook",id:"add_book",title:"Add Books",className:"nav-link",children:"Add Books"})}),(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsxs)(i.N_,{to:"/admin/1/book/stockout",id:"stock_out",title:"Stock Out",className:"nav-link",children:["StockOut\xa0",(0,l.jsx)("span",{className:"badge badge-danger",children:e.stock?e.stock:0})]})}),(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsxs)(i.N_,{to:"/admin/1/book/request",id:"request",title:"request",className:"nav-link",children:["Request\xa0",(0,l.jsx)("span",{className:"badge badge-success",children:e.reqbook?e.reqbook:0})]})}),(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsxs)(i.N_,{to:"/admin/1/book/return",id:"return",title:"return",className:"nav-link",children:["Return\xa0",(0,l.jsx)("span",{className:"badge badge-warning",children:e.return?e.return:0})]})}),(0,l.jsx)("li",{className:"nav-item px-2",children:(0,l.jsx)(i.N_,{to:"/books",title:"Browse Books",className:"nav-link",children:"Browse Books"})})]}),(0,l.jsx)("ul",{className:"navbar-nav ml-auto",children:a?(0,l.jsxs)("li",{className:"nav-item dropdown mr-3",children:[(0,l.jsxs)("a",{href:"#",className:"nav-link dropdown-toggle","data-toggle":"dropdown",id:"admin-drop-down",children:[(0,l.jsx)("i",{className:"fa fa-user"})," Welcome ",a.username]}),(0,l.jsxs)("div",{className:"dropdown-menu",children:[(0,l.jsxs)(i.N_,{to:"/admin/1/profile",title:"profile",className:"dropdown-item",children:[(0,l.jsx)("i",{className:"fa fa-user-circle"})," Profile"]}),(0,l.jsxs)("a",{href:"",onClick:e=>(async e=>{try{e.preventDefault(),await r.A.get("/auth/1/user-logout"),o("/")}catch(s){o("/")}})(e),className:"dropdown-item",children:[(0,l.jsx)("i",{className:"fa fa-user-times"})," Logout"]}),(0,l.jsxs)(i.N_,{className:"dropdown-item",to:"/user/dashboard/1",children:[(0,l.jsx)("i",{className:"fa fa-gear"})," User Dashboard"]})]})]}):(0,l.jsx)("li",{className:"nav-item",children:(0,l.jsxs)("a",{href:"/login",className:"nav-link",children:[(0,l.jsx)("i",{className:"fa fa-gear"})," ProfileLogin"]})})})]})]})})}},466:(e,s,a)=>{a.d(s,{A:()=>r});a(43);var t=a(579);const r=e=>{let{error:s,success:a,warning:r,dismissAlert:n}=e;return(0,t.jsxs)("div",{className:"container my-2 sticky-top",children:[s&&s.length>0&&(0,t.jsxs)("div",{className:"alert alert-danger alert-dismissible fade show",role:"alert",children:[s,(0,t.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("error"),children:(0,t.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),a&&a.length>0&&(0,t.jsxs)("div",{className:"alert alert-success alert-dismissible fade show",role:"alert",children:[a,(0,t.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("success"),children:(0,t.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),r&&r.length>0&&(0,t.jsxs)("div",{className:"alert alert-warning alert-dismissible fade show",role:"alert",children:[r,(0,t.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("warning"),children:(0,t.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]})]})}}}]);
//# sourceMappingURL=91.192e1237.chunk.js.map