(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[644],{644:(e,a,s)=>{"use strict";s.r(a),s.d(a,{default:()=>u});var t=s(43),n=s(213),r=s(843),l=s(314),i=s(446),c=s.n(i),o=s(466),d=s(475),m=s(579);const u=()=>{const[e,a]=(0,t.useState)([]),[s,i]=(0,t.useState)(0),[u,h]=(0,t.useState)(1),[x,j]=(0,t.useState)("all"),[b,p]=(0,t.useState)("all"),[v,f]=(0,t.useState)(!1),[N,g]=(0,t.useState)(""),[k,y]=(0,t.useState)(""),w=(0,t.useRef)(),S=(0,t.useCallback)(c()((async()=>{f(!0);try{const e=await n.A.get("/admin/bookInventory/".concat(x,"/").concat(b,"/").concat(u));a(e.data.books),i(e.data.pages)}catch(N){console.error("Error fetching data:",N)}finally{f(!1)}}),300),[x,b,u]);w.current=S,(0,t.useEffect)((()=>{w.current()}),[x,b,u]);const C=(0,t.useCallback)((async e=>{try{const a=await n.A.get("/api/admin/book/delete/".concat(e));a.data.error&&g(a.data.error),a.data.success&&y(a.data.success),w.current()}catch(N){g("Error deleting book")}}),[]);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(l.A,{}),(0,m.jsxs)("div",{children:[(0,m.jsx)("header",{id:"main-header",className:"py-2 bg-primary text-white",children:(0,m.jsx)("div",{className:"container",children:(0,m.jsx)("div",{className:"row",children:(0,m.jsx)("div",{className:"col-md-6",children:(0,m.jsxs)("h1",{children:[(0,m.jsx)("i",{className:"fa fa-book"})," Book Inventory"]})})})})}),(0,m.jsx)("section",{id:"search_bar",className:"my-3 py-4 bg-light",children:(0,m.jsx)("div",{className:"container",children:(0,m.jsx)("form",{onSubmit:e=>{e.preventDefault(),h(1)},children:(0,m.jsxs)("div",{className:"row",children:[(0,m.jsx)("div",{className:"col-md-5 p-1",children:(0,m.jsxs)("select",{name:"filter",id:"book_select",className:"form-control",value:x,onChange:e=>{j(e.target.value),h(1)},children:[(0,m.jsx)("option",{value:"all",disabled:!0,children:"Select Option..."}),(0,m.jsx)("option",{value:"title",children:"Title"}),(0,m.jsx)("option",{value:"author",children:"Author"}),(0,m.jsx)("option",{value:"category",children:"Category"})]})}),(0,m.jsx)("div",{className:"col-md-5 p-1",children:(0,m.jsx)("input",{name:"searchName",type:"text",className:"form-control",placeholder:"Search Books",value:"all"===b?"":b,onChange:e=>{if(!e.target.value)return p("all");p(e.target.value)}})}),(0,m.jsx)("div",{className:"col-md-2 p-1",children:(0,m.jsx)("input",{type:"submit",className:"btn btn-outline-primary btn-block",value:"Search"})})]})})})}),(0,m.jsx)(o.A,{success:k,error:N,dismissAlert:e=>{"error"===e?g(""):"success"===e&&y("")}}),(0,m.jsx)("section",{id:"bookInventory",className:"mt-2",children:(0,m.jsx)("div",{className:"container",style:{width:"85%",maxWidth:"none"},children:(0,m.jsx)("div",{className:"row",children:(0,m.jsx)("div",{className:"col",children:(0,m.jsxs)("div",{className:"card",children:[(0,m.jsxs)("table",{className:"table table-striped",children:[(0,m.jsx)("thead",{className:"thead-inverse",children:(0,m.jsxs)("tr",{children:[(0,m.jsx)("th",{children:"Title"}),(0,m.jsx)("th",{children:"Author"}),(0,m.jsx)("th",{children:"ISBN"}),(0,m.jsx)("th",{children:"Category"}),(0,m.jsx)("th",{children:"In Stock"}),(0,m.jsx)("th",{children:"Edit"})]})}),(0,m.jsxs)("tbody",{children:[v&&(0,m.jsx)(r.A,{}),e.map((e=>(0,m.jsxs)("tr",{children:[(0,m.jsx)("td",{children:e.title}),(0,m.jsx)("td",{children:e.author}),(0,m.jsx)("td",{children:e.ISBN}),(0,m.jsx)("td",{children:e.category}),(0,m.jsx)("td",{children:e.stock}),(0,m.jsx)("td",{children:(0,m.jsxs)("span",{children:[(0,m.jsx)(d.N_,{to:"/admin/books/1/update/".concat(e._id),className:"btn btn-info btn-sm",id:"to-update-book-btn",children:" Update "}),(0,m.jsx)("button",{onClick:a=>{a.preventDefault(),C(e._id)},className:"btn btn-sm btn-danger",id:"to-delete-book-btn",children:" Delete"})]})})]},e._id)))]})]}),s>0&&(()=>{const e=[];let a=Math.max(1,u-Math.floor(3)),t=Math.min(s,a+6-1);t-a+1<6&&(a=Math.max(1,t-6+1));for(let s=a;s<=t;s++)e.push(s);return(0,m.jsx)("nav",{className:"ml-3 mb-2",children:(0,m.jsxs)("ul",{className:"pagination offset-md-3",children:[u>1?(0,m.jsx)("li",{className:"page-item",children:(0,m.jsx)("button",{onClick:()=>h(1),className:"page-link","aria-label":"Go to first page",children:"First"})}):(0,m.jsx)("li",{className:"page-item disabled","aria-disabled":"true",children:(0,m.jsx)("span",{className:"page-link",children:"First"})}),e.map((e=>(0,m.jsx)("li",{className:"page-item ".concat(e===u?"active":""),children:(0,m.jsx)("button",{onClick:()=>h(e),className:"page-link","aria-label":"Go to page ".concat(e),disabled:v,children:e})},e))),u<s?(0,m.jsx)("li",{className:"page-item",children:(0,m.jsx)("button",{onClick:()=>h(s),className:"page-link","aria-label":"Go to last page",disabled:v,children:v?"Loading...":"Last"})}):(0,m.jsx)("li",{className:"page-item disabled","aria-disabled":"true",children:(0,m.jsx)("span",{className:"page-link",children:"Last"})})]})})})()]})})})})})]})]})}},314:(e,a,s)=>{"use strict";s.d(a,{A:()=>c});var t=s(43),n=s(213),r=s(216),l=s(475),i=s(579);const c=()=>{const[e,a]=(0,t.useState)([]),[s,c]=(0,t.useState)(),o=async()=>{try{const e=await n.A.get("/api/global"),s=await e.data;a(s.global),c(s.currentUser)}catch(e){console.error("Error fetching data",e)}};(0,t.useEffect)((()=>{o();const e=setInterval((()=>{o()}),6e4);return()=>clearInterval(e)}),[]);const d=(0,r.Zp)();return(0,i.jsx)("nav",{className:"navbar navbar-expand-lg navbar-dark bg-dark p-0 sticky-top",children:(0,i.jsxs)("div",{className:"container",children:[(0,i.jsx)("a",{className:"navbar-brand",href:"/admin",children:"Home"}),(0,i.jsx)("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarSupportedContent","aria-controls":"navbarSupportedContent","aria-expanded":"false","aria-label":"Toggle navigation",children:(0,i.jsx)("span",{className:"navbar-toggler-icon"})}),(0,i.jsxs)("div",{className:"collapse navbar-collapse",id:"navbarSupportedContent",children:[(0,i.jsxs)("ul",{className:"navbar-nav",children:[(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(l.N_,{to:"/admin/books/bookInventory/",id:"book_inventory",title:"Book Inventory",className:"nav-link",children:"Book Inventory"})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(l.N_,{to:"/admin/1/users/",id:"users_list",title:"Users",className:"nav-link",children:"Users"})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(l.N_,{to:"/admin/1/addbook",id:"add_book",title:"Add Books",className:"nav-link",children:"Add Books"})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsxs)(l.N_,{to:"/admin/1/book/stockout",id:"stock_out",title:"Stock Out",className:"nav-link",children:["StockOut\xa0",(0,i.jsx)("span",{className:"badge badge-danger",children:e.stock?e.stock:0})]})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsxs)(l.N_,{to:"/admin/1/book/request",id:"request",title:"request",className:"nav-link",children:["Request\xa0",(0,i.jsx)("span",{className:"badge badge-success",children:e.reqbook?e.reqbook:0})]})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsxs)(l.N_,{to:"/admin/1/book/return",id:"return",title:"return",className:"nav-link",children:["Return\xa0",(0,i.jsx)("span",{className:"badge badge-warning",children:e.return?e.return:0})]})}),(0,i.jsx)("li",{className:"nav-item px-2",children:(0,i.jsx)(l.N_,{to:"/books",title:"Browse Books",className:"nav-link",children:"Browse Books"})})]}),(0,i.jsx)("ul",{className:"navbar-nav ml-auto",children:s?(0,i.jsxs)("li",{className:"nav-item dropdown mr-3",children:[(0,i.jsxs)("a",{href:"#",className:"nav-link dropdown-toggle","data-toggle":"dropdown",id:"admin-drop-down",children:[(0,i.jsx)("i",{className:"fa fa-user"})," Welcome ",s.username]}),(0,i.jsxs)("div",{className:"dropdown-menu",children:[(0,i.jsxs)(l.N_,{to:"/admin/1/profile",title:"profile",className:"dropdown-item",children:[(0,i.jsx)("i",{className:"fa fa-user-circle"})," Profile"]}),(0,i.jsxs)("a",{href:"",onClick:e=>(async e=>{try{e.preventDefault(),await n.A.get("/auth/1/user-logout"),d("/")}catch(a){d("/")}})(e),className:"dropdown-item",children:[(0,i.jsx)("i",{className:"fa fa-user-times"})," Logout"]}),(0,i.jsxs)(l.N_,{className:"dropdown-item",to:"/user/dashboard/1",children:[(0,i.jsx)("i",{className:"fa fa-gear"})," User Dashboard"]})]})]}):(0,i.jsx)("li",{className:"nav-item",children:(0,i.jsxs)("a",{href:"/login",className:"nav-link",children:[(0,i.jsx)("i",{className:"fa fa-gear"})," ProfileLogin"]})})})]})]})})}},466:(e,a,s)=>{"use strict";s.d(a,{A:()=>n});s(43);var t=s(579);const n=e=>{let{error:a,success:s,warning:n,dismissAlert:r}=e;return(0,t.jsxs)("div",{className:"container my-2 sticky-top",children:[a&&a.length>0&&(0,t.jsxs)("div",{className:"alert alert-danger alert-dismissible fade show",role:"alert",children:[a,(0,t.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>r("error"),children:(0,t.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),s&&s.length>0&&(0,t.jsxs)("div",{className:"alert alert-success alert-dismissible fade show",role:"alert",children:[s,(0,t.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>r("success"),children:(0,t.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]}),n&&n.length>0&&(0,t.jsxs)("div",{className:"alert alert-warning alert-dismissible fade show",role:"alert",children:[n,(0,t.jsx)("button",{type:"button",className:"close","data-dismiss":"alert","aria-label":"Close",onClick:()=>r("warning"),children:(0,t.jsx)("span",{"aria-hidden":"true",children:"\xd7"})})]})]})}},446:(e,a,s)=>{var t=NaN,n="[object Symbol]",r=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,i=/^0b[01]+$/i,c=/^0o[0-7]+$/i,o=parseInt,d="object"==typeof s.g&&s.g&&s.g.Object===Object&&s.g,m="object"==typeof self&&self&&self.Object===Object&&self,u=d||m||Function("return this")(),h=Object.prototype.toString,x=Math.max,j=Math.min,b=function(){return u.Date.now()};function p(e){var a=typeof e;return!!e&&("object"==a||"function"==a)}function v(e){if("number"==typeof e)return e;if(function(e){return"symbol"==typeof e||function(e){return!!e&&"object"==typeof e}(e)&&h.call(e)==n}(e))return t;if(p(e)){var a="function"==typeof e.valueOf?e.valueOf():e;e=p(a)?a+"":a}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(r,"");var s=i.test(e);return s||c.test(e)?o(e.slice(2),s?2:8):l.test(e)?t:+e}e.exports=function(e,a,s){var t,n,r,l,i,c,o=0,d=!1,m=!1,u=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function h(a){var s=t,r=n;return t=n=void 0,o=a,l=e.apply(r,s)}function f(e){var s=e-c;return void 0===c||s>=a||s<0||m&&e-o>=r}function N(){var e=b();if(f(e))return g(e);i=setTimeout(N,function(e){var s=a-(e-c);return m?j(s,r-(e-o)):s}(e))}function g(e){return i=void 0,u&&t?h(e):(t=n=void 0,l)}function k(){var e=b(),s=f(e);if(t=arguments,n=this,c=e,s){if(void 0===i)return function(e){return o=e,i=setTimeout(N,a),d?h(e):l}(c);if(m)return i=setTimeout(N,a),h(c)}return void 0===i&&(i=setTimeout(N,a)),l}return a=v(a)||0,p(s)&&(d=!!s.leading,r=(m="maxWait"in s)?x(v(s.maxWait)||0,a):r,u="trailing"in s?!!s.trailing:u),k.cancel=function(){void 0!==i&&clearTimeout(i),o=0,t=c=n=i=void 0},k.flush=function(){return void 0===i?l:g(b())},k}}}]);
//# sourceMappingURL=644.717c8d2a.chunk.js.map