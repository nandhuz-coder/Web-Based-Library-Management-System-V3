"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[669],{669:(e,a,s)=>{s.r(a),s.d(a,{default:()=>o});var l=s(43),t=s(213),n=s(475),r=s(843),i=s(314),c=s(466),d=s(579);const o=()=>{const[e,a]=(0,l.useState)([]),[s,o]=(0,l.useState)(" "),[m,h]=(0,l.useState)(" "),[x,j]=(0,l.useState)(1),[u,N]=(0,l.useState)(0),[b,p]=(0,l.useState)(""),[v,k]=(0,l.useState)(""),[g,f]=(0,l.useState)(!0),y=(0,l.useRef)((()=>{}));(0,l.useEffect)((()=>{w(s,m,x),y.current=()=>w(s,m,x)}),[x,s,m]);const w=(0,l.useCallback)((async(e,s,l)=>{try{const n=await t.A.get("/admin/bookstock/out/".concat(e,"/").concat(s,"/").concat(l));a(n.data.books),N(n.data.pages),f(!1)}catch(b){console.error(b),f(!1)}}),[]),C=(0,l.useCallback)((e=>{o(e.target.value)}),[]),S=(0,l.useCallback)((e=>{h(e.target.value)}),[]),_=(0,l.useCallback)((e=>{e.preventDefault(),j(1),w(s,m,1)}),[s,m,w]),A=(0,l.useCallback)((e=>{j(e)}),[]),B=(0,l.useCallback)((async e=>{try{await(a=300,new Promise((e=>setTimeout(e,a))));const s=await t.A.get("/api/admin/book/delete/".concat(e));s.data.error&&p(s.data.error),s.data.success&&k(s.data.success),y.current()}catch(b){p("Error deleting book")}var a}),[]);return(0,d.jsx)(d.Fragment,{children:(0,d.jsxs)(l.Suspense,{fallback:(0,d.jsx)(r.A,{}),children:[(0,d.jsx)(i.A,{}),(0,d.jsx)("header",{id:"main-header",className:"py-2 bg-primary text-white",children:(0,d.jsx)("div",{className:"container",children:(0,d.jsx)("div",{className:"row",children:(0,d.jsx)("div",{className:"col-md-6",children:(0,d.jsxs)("h1",{children:[(0,d.jsx)("i",{className:"fa fa-book"})," Stock out"]})})})})}),(0,d.jsx)(c.A,{success:v,error:b,dismissAlert:e=>{"error"===e?p(""):"success"===e&&k("")}}),(0,d.jsxs)("div",{children:[(0,d.jsx)("section",{id:"search_bar",className:"my-3 py-4 bg-light",children:(0,d.jsx)("div",{className:"container",children:(0,d.jsx)("form",{onSubmit:_,children:(0,d.jsxs)("div",{className:"row",children:[(0,d.jsx)("div",{className:"col-md-5 p-1",children:(0,d.jsxs)("select",{name:"filter",id:"book_select",className:"form-control",value:s,onChange:C,children:[(0,d.jsx)("option",{value:"",disabled:!0,children:"Select Option..."}),(0,d.jsx)("option",{value:"title",children:"Title"}),(0,d.jsx)("option",{value:"author",children:"Author"}),(0,d.jsx)("option",{value:"category",children:"Category"})]})}),(0,d.jsx)("div",{className:"col-md-5 p-1",children:(0,d.jsx)("input",{name:"searchName",type:"text",className:"form-control",placeholder:"Search Books",value:m,onChange:S})}),(0,d.jsx)("div",{className:"col-md-2 p-1",children:(0,d.jsx)("input",{type:"submit",className:"btn btn-outline-primary btn-block",value:"Search"})})]})})})}),(0,d.jsx)("section",{id:"bookInventory",className:"mt-5",children:(0,d.jsx)("div",{className:"container",style:{maxWidth:"80%"},children:(0,d.jsx)("div",{className:"row",children:(0,d.jsx)("div",{className:"col",children:(0,d.jsxs)("div",{className:"card",children:[(0,d.jsxs)("table",{className:"table table-striped",children:[(0,d.jsx)("thead",{className:"thead-inverse",children:(0,d.jsxs)("tr",{children:[(0,d.jsx)("th",{children:"Title"}),(0,d.jsx)("th",{children:"Author"}),(0,d.jsx)("th",{children:"ISBN"}),(0,d.jsx)("th",{children:"Category"}),(0,d.jsx)("th",{children:"In Stock"}),(0,d.jsx)("th",{children:"Edit"})]})}),(0,d.jsxs)("tbody",{children:[g&&(0,d.jsx)(r.A,{}),e.map((e=>(0,d.jsxs)("tr",{children:[(0,d.jsx)("td",{children:e.title}),(0,d.jsx)("td",{children:e.author}),(0,d.jsx)("td",{children:e.ISBN}),(0,d.jsx)("td",{children:e.category}),(0,d.jsx)("td",{children:e.stock}),(0,d.jsx)("td",{children:(0,d.jsxs)("span",{children:[(0,d.jsx)(n.N_,{to:"/admin/books/1/update/".concat(e._id),className:"btn btn-info btn-sm",children:"Update"}),(0,d.jsx)("button",{onClick:()=>B(e._id),className:"btn btn-sm btn-danger",children:"Delete"})]})})]},e._id)))]})]}),u>0&&(0,d.jsx)("nav",{className:"ml-3 mb-2",children:(0,d.jsxs)("ul",{className:"pagination offset-md-3",children:[1===x?(0,d.jsx)("li",{className:"page-item disabled",children:(0,d.jsx)("a",{className:"page-link",children:"First"})}):(0,d.jsx)("li",{className:"page-item",children:(0,d.jsx)("a",{href:"#",className:"page-link",onClick:e=>{e.preventDefault(),A(1)},children:"First"})}),Array.from({length:Math.min(u,5)},((e,a)=>a+(x>5?x-4:1))).map((e=>(0,d.jsx)("li",{className:"page-item ".concat(e===x?"active":""),children:(0,d.jsx)("a",{href:"#",className:"page-link",onClick:a=>{a.preventDefault(),A(e)},children:e})},e))),x===u?(0,d.jsx)("li",{className:"page-item disabled",children:(0,d.jsx)("a",{className:"page-link",children:"Last"})}):(0,d.jsx)("li",{className:"page-item",children:(0,d.jsx)("a",{href:"#",className:"page-link",onClick:e=>{e.preventDefault(),A(u)},children:"Last"})})]})})]})})})})})]})]})})}},314:(e,a,s)=>{s.d(a,{A:()=>c});var l=s(43),t=s(213),n=s(216),r=s(475),i=s(579);const c=()=>{const[e,a]=(0,l.useState)([]),[s,c]=(0,l.useState)(),d=async()=>{try{const e=await t.A.get("/api/global"),s=await e.data;a(s.global),c(s.currentUser)}catch(e){console.error("Error fetching data",e)}};(0,l.useEffect)((()=>{d();const e=setInterval((()=>{d()}),6e4);return()=>clearInterval(e)}),[]);const o=(0,n.Zp)();return(0,i.jsx)("nav",{className:"navbar navbar-expand-lg navbar-dark bg-dark p-0 sticky-top",children:(0,i.jsxs)("div",{className:"container",children:[(0,i.jsx)("a",{className:"navbar-brand",href:"/admin",children:"Home"}),(0,i.jsx)("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",children:(0,i.jsx)("span",{className:"navbar-toggler-icon"})}),(0,i.jsxs)("div",{className:"collapse navbar-collapse",id:"navbarSupportedContent",children:[(0,i.jsxs)("ul",{className:"navbar-nav",children:[(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(r.N_,{to:"/admin/books/bookInventory/",id:"book_inventory",title:"Book Inventory",className:"nav-link",children:"Book Inventory"})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(r.N_,{to:"/admin/1/users/",id:"users_list",title:"Users",className:"nav-link",children:"Users"})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(r.N_,{to:"/admin/1/addbook",id:"add_book",title:"Add Books",className:"nav-link",children:"Add Books"})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsxs)(r.N_,{to:"/admin/1/book/stockout",id:"stock_out",title:"Stock Out",className:"nav-link",children:["StockOut\xa0",(0,i.jsx)("span",{className:"badge badge-danger",children:e.stock?e.stock:0})]})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsxs)(r.N_,{to:"/admin/1/book/request",id:"request",title:"request",className:"nav-link",children:["Request\xa0",(0,i.jsx)("span",{className:"badge badge-success",children:e.reqbook?e.reqbook:0})]})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsxs)(r.N_,{to:"/admin/1/book/return",id:"return",title:"return",className:"nav-link",children:["Return\xa0",(0,i.jsx)("span",{className:"badge badge-warning",children:e.return?e.return:0})]})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(r.N_,{to:"/books",title:"Browse Books",className:"nav-link",children:"Browse Books"})})]}),(0,i.jsx)("ul",{className:"navbar-nav ml-auto",children:s?(0,i.jsxs)("li",{className:"nav-item dropdown mr-3",children:[(0,i.jsxs)("a",{href:"#",className:"nav-link dropdown-toggle","data-toggle":"dropdown",id:"admin-drop-down",children:[(0,i.jsx)("i",{className:"fa fa-user"})," Welcome ",s.username]}),(0,i.jsxs)("div",{className:"dropdown-menu",children:[(0,i.jsxs)(r.N_,{to:"/admin/1/profile",title:"profile",className:"dropdown-item",children:[(0,i.jsx)("i",{className:"fa fa-user-circle"})," Profile"]}),(0,i.jsxs)("a",{href:"",onClick:e=>(async e=>{try{e.preventDefault(),await t.A.get("/auth/1/user-logout"),o("/")}catch(a){o("/")}})(e),className:"dropdown-item",children:[(0,i.jsx)("i",{className:"fa fa-user-times"})," Logout"]}),(0,i.jsxs)(r.N_,{className:"dropdown-item",to:"/user/dashboard/1",children:[(0,i.jsx)("i",{className:"fa fa-gear"})," User Dashboard"]})]})]}):(0,i.jsx)("li",{className:"nav-item",children:(0,i.jsxs)("a",{href:"/login",className:"nav-link",children:[(0,i.jsx)("i",{className:"fa fa-gear"})," ProfileLogin"]})})})]})]})})}},466:(e,a,s)=>{s.d(a,{A:()=>t});s(43);var l=s(579);const t=e=>{let{error:a,success:s,warning:t,dismissAlert:n}=e;return(0,l.jsxs)("div",{className:"container my-2 sticky-top",children:[a&&a.length>0&&(0,l.jsxs)("div",{className:"alert alert-danger alert-dismissible fade show",role:"alert",children:[a,(0,l.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("error"),children:(0,l.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),s&&s.length>0&&(0,l.jsxs)("div",{className:"alert alert-success alert-dismissible fade show",role:"alert",children:[s,(0,l.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("success"),children:(0,l.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),t&&t.length>0&&(0,l.jsxs)("div",{className:"alert alert-warning alert-dismissible fade show",role:"alert",children:[t,(0,l.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>n("warning"),children:(0,l.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]})]})}}}]);
//# sourceMappingURL=669.4dfcdd60.chunk.js.map