import{R as e}from"./react-router-Bbm9bAm6.js";var t={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},r=e.createContext&&e.createContext(t),n=["attr","size","title"];function o(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r={};for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){if(t.indexOf(n)>=0)continue;r[n]=e[n]}return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i.apply(this,arguments)}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t,r){var n;return(t="symbol"==typeof(n=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t);if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(t,"string"))?n:n+"")in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(t){return t&&t.map(((t,r)=>e.createElement(t.tag,a({key:r},t.attr),s(t.child))))}function u(t){return r=>e.createElement(f,i({attr:a({},t.attr)},r),s(t.child))}function f(c){var l=t=>{var r,{attr:l,size:s,title:u}=c,f=o(c,n),p=s||t.size||"1em";return t.className&&(r=t.className),c.className&&(r=(r?r+" ":"")+c.className),e.createElement("svg",i({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,l,f,{className:r,style:a(a({color:c.color||t.color},t.style),c.style),height:p,width:p,xmlns:"http://www.w3.org/2000/svg"}),u&&e.createElement("title",null,u),c.children)};return void 0!==r?e.createElement(r.Consumer,null,(e=>l(e))):l(t)}export{u as G};
