!function t(a,n,o){function r(i,u){if(!n[i]){if(!a[i]){var l="function"==typeof require&&require;if(!u&&l)return l(i,!0);if(e)return e(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var M=n[i]={exports:{}};a[i][0].call(M.exports,function(t){var n=a[i][1][t];return r(n||t)},M,M.exports,t,a,n,o)}return n[i].exports}for(var e="function"==typeof require&&require,i=0;i<o.length;i++)r(o[i]);return r}({1:[function(t,a,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function r(){c.ctx.clearRect(0,0,M.default.width,M.default.height);for(var t=0;t<x.length;t++)x[t].update(),x[t].draw();for(var a=0;a<S.length;a++)S[a].update(),S[a].draw();requestAnimationFrame(r)}var e=t("./src/rectangle"),i=o(e),u=t("./src/constraint"),l=o(u),s=t("./src/dimensions"),M=o(s),c=t("./src/canvas"),h=t("./src/mousemove"),f=o(h),x=[],S=[],I=null;document.body.appendChild(c.canvas),c.ctx.strokeStyle="#fff";for(var m=(M.default.width<M.default.height?M.default.width:M.default.height,0);m<2;m++)x.push(new i.default({ctx:c.ctx,total:2,width:30,height:30,index:m,position:[M.default.width/2*(m+.5),M.default.height/2]}));S.push(new l.default({points:[x[0],x[1]]})),r(),f.default.downCallbacks.push(function(t){for(var a=0;a<x.length;a++)this.position[0]>x[a].position[0]-x[a].width/2&&this.position[0]<x[a].position[0]+x[a].width/2&&this.position[1]>x[a].position[1]-x[a].height/2&&this.position[1]<x[a].position[1]+x[a].height/2&&(I=a)}),f.default.moveCallbacks.push(function(t){null!==I&&(x[I].position=this.position)}),f.default.upCallbacks.push(function(t){I=null})},{"./src/canvas":12,"./src/constraint":13,"./src/dimensions":14,"./src/mousemove":15,"./src/rectangle":16}],2:[function(t,a,n){n.glMatrix=t("./gl-matrix/common.js"),n.mat2=t("./gl-matrix/mat2.js"),n.mat2d=t("./gl-matrix/mat2d.js"),n.mat3=t("./gl-matrix/mat3.js"),n.mat4=t("./gl-matrix/mat4.js"),n.quat=t("./gl-matrix/quat.js"),n.vec2=t("./gl-matrix/vec2.js"),n.vec3=t("./gl-matrix/vec3.js"),n.vec4=t("./gl-matrix/vec4.js")},{"./gl-matrix/common.js":3,"./gl-matrix/mat2.js":4,"./gl-matrix/mat2d.js":5,"./gl-matrix/mat3.js":6,"./gl-matrix/mat4.js":7,"./gl-matrix/quat.js":8,"./gl-matrix/vec2.js":9,"./gl-matrix/vec3.js":10,"./gl-matrix/vec4.js":11}],3:[function(t,a,n){var o={};o.EPSILON=1e-6,o.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,o.RANDOM=Math.random,o.ENABLE_SIMD=!1,o.SIMD_AVAILABLE=o.ARRAY_TYPE===Float32Array&&"SIMD"in this,o.USE_SIMD=o.ENABLE_SIMD&&o.SIMD_AVAILABLE,o.setMatrixArrayType=function(t){o.ARRAY_TYPE=t};var r=Math.PI/180;o.toRadian=function(t){return t*r},o.equals=function(t,a){return Math.abs(t-a)<=o.EPSILON*Math.max(1,Math.abs(t),Math.abs(a))},a.exports=o},{}],4:[function(t,a,n){var o=t("./common.js"),r={};r.create=function(){var t=new o.ARRAY_TYPE(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},r.clone=function(t){var a=new o.ARRAY_TYPE(4);return a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=t[3],a},r.copy=function(t,a){return t[0]=a[0],t[1]=a[1],t[2]=a[2],t[3]=a[3],t},r.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},r.fromValues=function(t,a,n,r){var e=new o.ARRAY_TYPE(4);return e[0]=t,e[1]=a,e[2]=n,e[3]=r,e},r.set=function(t,a,n,o,r){return t[0]=a,t[1]=n,t[2]=o,t[3]=r,t},r.transpose=function(t,a){if(t===a){var n=a[1];t[1]=a[2],t[2]=n}else t[0]=a[0],t[1]=a[2],t[2]=a[1],t[3]=a[3];return t},r.invert=function(t,a){var n=a[0],o=a[1],r=a[2],e=a[3],i=n*e-r*o;return i?(i=1/i,t[0]=e*i,t[1]=-o*i,t[2]=-r*i,t[3]=n*i,t):null},r.adjoint=function(t,a){var n=a[0];return t[0]=a[3],t[1]=-a[1],t[2]=-a[2],t[3]=n,t},r.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},r.multiply=function(t,a,n){var o=a[0],r=a[1],e=a[2],i=a[3],u=n[0],l=n[1],s=n[2],M=n[3];return t[0]=o*u+e*l,t[1]=r*u+i*l,t[2]=o*s+e*M,t[3]=r*s+i*M,t},r.mul=r.multiply,r.rotate=function(t,a,n){var o=a[0],r=a[1],e=a[2],i=a[3],u=Math.sin(n),l=Math.cos(n);return t[0]=o*l+e*u,t[1]=r*l+i*u,t[2]=o*-u+e*l,t[3]=r*-u+i*l,t},r.scale=function(t,a,n){var o=a[0],r=a[1],e=a[2],i=a[3],u=n[0],l=n[1];return t[0]=o*u,t[1]=r*u,t[2]=e*l,t[3]=i*l,t},r.fromRotation=function(t,a){var n=Math.sin(a),o=