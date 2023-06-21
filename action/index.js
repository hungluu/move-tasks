(()=>{"use strict";var e={700:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t},i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,s)}c((r=r.apply(e,t||[])).next())}))},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const c=a(n(999)),u=a(n(394)),l=s(n(403)),d=s(n(231)),p=n(569);(function({token:e,repository:t,project:n,fromCards:r,toColumn:o}){var a;return i(this,void 0,void 0,(function*(){const s=new d.default(e),[f]=t.split("/");let g=n,m=f;if(n.includes("/")){const e=n.split("/");g=e.pop(),m=e.join("/")}const h=yield s.getRepo(t),y=yield s.getProject(m,h.ownerType,/^\d+$/.test(g)?parseInt(g):g);if(void 0===h.id)throw Error(`No repo found as '${t}'`);if(void 0===y.id)throw Error(`No project found with provided search '${g}'`);const b=new l.default({project:y,context:null!==(a=u.context)&&void 0!==a?a:{}}),v=b.get(o);if(0===v.length)throw Error(`No column found with '${o}'`);const _=(0,p.get)(v,0),j=b.get(r);0===j.length&&c.warning(`No cards found with '${r}'`);const O={},w={};yield Promise.all(j.map((e=>i(this,void 0,void 0,(function*(){try{yield s.addCardToColumn(_.id.toString(),e.id.toString()),O[e.id]=e.contentTitle}catch(t){w[e.id]=t.message}}))))),Object.keys(O).length>0&&c.info(["Moved cards: ",...(0,p.map)(O,((e,t)=>`  - #${t}: ${null!=e?e:"<note>"}`))].join("\n")),Object.keys(w).length>0&&c.warning(["Errors during moving cards: ",...(0,p.map)(w,((e,t)=>`  - #${t}: ${e}`))].join("\n"))}))})("production"===NODE_ENV?{token:c.getInput("actionToken"),project:c.getInput("project"),repository:c.getInput("repository"),fromCards:c.getInput("fromCards"),toColumn:c.getInput("toColumn")}:{token:(0,p.get)(process.argv,2),project:(0,p.get)(process.argv,3).trim(),repository:(0,p.get)(process.argv,4),fromCards:"$project > columns(name is In progress) > cards(contentId oneOf 833156448)",toColumn:"$project > columns(name is Done)"}).catch((e=>{var t;c.setFailed(null!==(t=e.stack)&&void 0!==t?t:e.message)}))},403:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.InstructorFilters=void 0;const o=r(n(645)),a=n(569),i=/([^\s.(]+)(?:\(([^()]+)\))?/,s=/([^ ]+) ([^ ]+) (.+)/,c=/\s*&\s*/,u=/, ?/,l=/^\$/,d=/^\/(.+)\/([^/]+)$/,p=["number","boolean"],f=e=>(e=>p.includes((0,o.default)(e)))(e)?e.toString():e;t.InstructorFilters={oneOf:(e,...t)=>t.includes(f(e)),in:(e,n)=>t.InstructorFilters.has(n,f(e)),is:(e,t)=>f(e)===t,has(e,t){switch((0,o.default)(e)){case"object":return Object.values(e).includes(t);case"array":return(0,a.map)(e).includes(t);default:return!1}},hasText:(e,t)=>"string"===(0,o.default)(e)&&(e+"").toLowerCase().includes(t.toLowerCase()),matches(e,t){const[,n,r]=t.match(d);return new RegExp(n,r).test(e)}};const g=Object.keys(t.InstructorFilters);t.default=class{constructor(e){this.data=e}get(e){const[t,...n]=e.trim().split(">"),r=this.getLayer(this.data,t);if(!l.test(t))throw TypeError("Data source should start with $");let o=r;return n.forEach((e=>{o=this.applyLayer(o,e)})),o}applyLayer(e,t){const[,n,r]=t.match(i),o=this.getLayer(e,n);if("string"!=typeof r)return o;if(""===r.trim())throw TypeError(`Don't use empty filter for layer '${n}'`);if(s.test(r))return this.applyFilters(o,r);throw TypeError(`Invalid filter format for layer '${n}'`)}applyFilters(e,n){let r=e.slice(0);return n.split(c).forEach((n=>{const[,o,i,c]=n.match(s),l=void 0!==c?c.split(u):[],d=(0,a.map)(l,(e=>this.parseFilterParam(e)));if(!g.includes(i))throw TypeError(`Filter '${i}' is not supported`);r=(0,a.filter)(r,(n=>t.InstructorFilters[i].apply(e,[this.getLayer(n,o),...d])))})),r}parseFilterParam(e){return e.startsWith("$")?this.getLayer(this.data,e):e}getLayer(e,t){return"array"===(0,o.default)(e)?(0,a.flatten)((0,a.map)(e,t.trim().replace(l,""))):(0,a.get)(e,t.trim().replace(l,""),[])}}},981:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=n(569),o={cardLimit:50,columnLimit:30,cardLabelLimit:20,cardTypes:["Issue","PullRequest"]};t.default=function(e,t){let n="";void 0!==(t=Object.assign({},o,t)).projectId?n=`project(number: ${t.projectId}) {\n      number\n      databaseId\n      name\n      ${(0,r.getPartials)(t,a,1)}\n    }`:void 0!==t.projectName&&(n=`projects(search: "${t.projectName}", first: 1) {\n      edges {\n        node {\n          number\n          databaseId\n          name\n          ${(0,r.getPartials)(t,a,1)}\n        }\n      }\n    }`);const[i,s]=e.split("/");return void 0!==s?`${t.ownerType}(login: "${i}") {\n      repository(name: "${s}") {\n        ${n}\n      }\n    }`:`${t.ownerType}(login: "${i}") {\n      ${n}\n    }`};const a={columns:e=>`columns(first: ${e.columnLimit}) {\n      edges {\n        node {\n          databaseId\n          name\n          ${(0,r.getPartials)(e,a,2)}\n        }\n      }\n    }`,"column.cards":e=>`cards(first: ${e.cardLimit}) {\n      edges {\n        node {\n          databaseId\n          content {\n            ${void 0===e.cardTypes?"":e.cardTypes.map((t=>`...on ${t} {\n              __typename\n              number\n              title\n              databaseId\n              createdAt\n              author {\n                login\n              }\n              state\n              assignees(first: 10) {\n                edges {\n                  node {\n                    databaseId\n                    login\n                  }\n                }\n              }\n              ${(0,r.getPartials)(e,a,3)}\n            }`)).join("\n")}\n          }\n        }\n      }\n    }`,"column.card.labels":e=>`labels(first: ${e.cardLabelLimit}) {\n      edges {\n        node {\n          resourcePath\n          name\n        }\n      }\n    }`}},28:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});const r=n(569),o={labelLimit:50};t.default=function(e,t=o){t=Object.assign({},o,t);const[n,i]=e.split("/");return`repositoryOwner(login: "${n}") {\n    __typename\n    repository(name: "${i}") {\n      databaseId\n      name\n      ${(0,r.getPartials)(t,a)}\n    }\n  }`};const a={labels:e=>`labels(first: ${e.labelLimit}) {\n      edges {\n        node {\n          resourcePath\n          name\n        }\n      }\n    }`}},231:function(e,t,n){var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t},i=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,a){function i(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,s)}c((r=r.apply(e,t||[])).next())}))},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const c=a(n(394)),u=s(n(981)),l=s(n(28)),d=n(493),p=n(569);t.default=class{constructor(e){this.client=c.getOctokit(e)}getRepo(e){return i(this,void 0,void 0,(function*(){return(0,d.repo)(yield this.client.graphql((0,p.query)((0,l.default)(e))))}))}getProject(e,t,n){return i(this,void 0,void 0,(function*(){const r={ownerType:t,partials:["columns","column.cards","column.card.labels"]};return"string"==typeof n?r.projectName=n:r.projectId=n,(0,d.project)(yield this.client.graphql((0,p.query)((0,u.default)(e,r))))}))}addCardToColumn(e,t){return i(this,void 0,void 0,(function*(){return yield this.client.rest.projects.moveCard({card_id:parseInt(t),column_id:parseInt(e),position:"top"})}))}}},493:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.project=t.repo=void 0;const r=n(569);t.repo=function(e){const t=(0,r.get)(e,"repositoryOwner",{}),n=(0,r.get)(t,"repository",{});return{id:(0,r.get)(n,"databaseId"),name:(0,r.get)(n,"name"),ownerType:((0,r.get)(t,"__typename")+"").toLowerCase()}},t.project=function(e){const t=(0,r.get)(e,"organization",(0,r.get)(e,"user",{})),n=(0,r.get)(t,"repository",t),o=(0,r.get)(n,"projects.edges.0.node",(0,r.get)(n,"project",{})),a=(0,r.map)((0,r.get)(o,"columns.edges"),"node");return{id:(0,r.get)(o,"databaseId"),name:(0,r.get)(o,"name"),number:(0,r.get)(o,"number"),columns:(0,r.map)(a,(e=>{const t=(0,r.map)((0,r.get)(e,"cards.edges"),"node");return{id:(0,r.get)(e,"databaseId"),name:(0,r.get)(e,"name"),cards:(0,r.map)(t,(e=>{const t=(0,r.get)(e,"content",{}),n=(0,r.map)((0,r.get)(t,"labels.edges"),"node"),o=(0,r.map)((0,r.get)(t,"assignees.edges"),"node");return{id:(0,r.get)(e,"databaseId"),contentId:(0,r.get)(t,"databaseId"),contentNumber:(0,r.get)(t,"number"),contentTitle:(0,r.get)(t,"title"),contentType:(0,r.get)(t,"__typename"),contentCreatedAt:(0,r.get)(t,"createdAt"),contentAuthor:(0,r.get)(t,"author.login"),contentState:((0,r.get)(t,"state")+"").toLowerCase(),contentAssignees:(0,r.zipObject)((0,r.map)(o,"databaseId"),(0,r.map)(o,"login")),contentLabels:(0,r.zipObject)((0,r.map)(n,"resourcePath"),(0,r.map)(n,"name"))}}))}}))}}},569:function(e,t,n){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getPartials=t.PARTIAL_SEPARATOR=t.query=t.zipObject=t.map=t.filter=t.get=t.flatten=void 0;const o=r(n(92)),a=r(n(447)),i=r(n(197));var s=n(106);Object.defineProperty(t,"flatten",{enumerable:!0,get:function(){return r(s).default}});var c=n(359);Object.defineProperty(t,"get",{enumerable:!0,get:function(){return r(c).default}});var u=n(642);Object.defineProperty(t,"filter",{enumerable:!0,get:function(){return r(u).default}}),t.map=i.default,t.zipObject=a.default,t.query=function(e){return`query{${e}}`},t.PARTIAL_SEPARATOR=".",t.getPartials=function(e,n,r=0){if(void 0===e.partials)return"";{const a=e.partials,i=(0,o.default)(n,((e,n)=>a.includes(n)&&(r<1||r===n.split(t.PARTIAL_SEPARATOR).length)));return Object.values(i).map((t=>t(e))).join("\n")}}},999:e=>{e.exports=require("@actions/core")},394:e=>{e.exports=require("@actions/github")},645:e=>{e.exports=require("kind-of")},642:e=>{e.exports=require("lodash-es/filter")},106:e=>{e.exports=require("lodash-es/flatten")},359:e=>{e.exports=require("lodash-es/get")},197:e=>{e.exports=require("lodash-es/map")},92:e=>{e.exports=require("lodash-es/pickBy")},447:e=>{e.exports=require("lodash-es/zipObject")}},t={},n=function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,n),a.exports}(700);module.exports=n})();