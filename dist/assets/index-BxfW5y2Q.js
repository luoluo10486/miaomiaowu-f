(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();/**
* @vue/shared v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Sc(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const dt={},Ir=[],kn=()=>{},fd=()=>!1,ko=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),Mc=t=>t.startsWith("onUpdate:"),Ct=Object.assign,Ec=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},Up=Object.prototype.hasOwnProperty,rt=(t,e)=>Up.call(t,e),He=Array.isArray,Lr=t=>Ls(t)==="[object Map]",$r=t=>Ls(t)==="[object Set]",lu=t=>Ls(t)==="[object Date]",We=t=>typeof t=="function",St=t=>typeof t=="string",An=t=>typeof t=="symbol",st=t=>t!==null&&typeof t=="object",dd=t=>(st(t)||We(t))&&We(t.then)&&We(t.catch),hd=Object.prototype.toString,Ls=t=>hd.call(t),Np=t=>Ls(t).slice(8,-1),pd=t=>Ls(t)==="[object Object]",yc=t=>St(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,ds=Sc(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),Wo=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},Fp=/-\w/g,Jt=Wo(t=>t.replace(Fp,e=>e.slice(1).toUpperCase())),Op=/\B([A-Z])/g,dr=Wo(t=>t.replace(Op,"-$1").toLowerCase()),Xo=Wo(t=>t.charAt(0).toUpperCase()+t.slice(1)),pa=Wo(t=>t?`on${Xo(t)}`:""),zn=(t,e)=>!Object.is(t,e),xo=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},md=(t,e,n,i=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:i,value:n})},qo=t=>{const e=parseFloat(t);return isNaN(e)?t:e},Bp=t=>{const e=St(t)?Number(t):NaN;return isNaN(e)?t:e};let cu;const Yo=()=>cu||(cu=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function $o(t){if(He(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],r=St(i)?Gp(i):$o(i);if(r)for(const s in r)e[s]=r[s]}return e}else if(St(t)||st(t))return t}const Vp=/;(?![^(]*\))/g,zp=/:([^]+)/,Hp=/\/\*[^]*?\*\//g;function Gp(t){const e={};return t.replace(Hp,"").split(Vp).forEach(n=>{if(n){const i=n.split(zp);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function En(t){let e="";if(St(t))e=t;else if(He(t))for(let n=0;n<t.length;n++){const i=En(t[n]);i&&(e+=i+" ")}else if(st(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const kp="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Wp=Sc(kp);function gd(t){return!!t||t===""}function Xp(t,e){if(t.length!==e.length)return!1;let n=!0;for(let i=0;n&&i<t.length;i++)n=Oi(t[i],e[i]);return n}function Oi(t,e){if(t===e)return!0;let n=lu(t),i=lu(e);if(n||i)return n&&i?t.getTime()===e.getTime():!1;if(n=An(t),i=An(e),n||i)return t===e;if(n=He(t),i=He(e),n||i)return n&&i?Xp(t,e):!1;if(n=st(t),i=st(e),n||i){if(!n||!i)return!1;const r=Object.keys(t).length,s=Object.keys(e).length;if(r!==s)return!1;for(const o in t){const a=t.hasOwnProperty(o),l=e.hasOwnProperty(o);if(a&&!l||!a&&l||!Oi(t[o],e[o]))return!1}}return String(t)===String(e)}function bc(t,e){return t.findIndex(n=>Oi(n,e))}const _d=t=>!!(t&&t.__v_isRef===!0),zt=t=>St(t)?t:t==null?"":He(t)||st(t)&&(t.toString===hd||!We(t.toString))?_d(t)?zt(t.value):JSON.stringify(t,vd,2):String(t),vd=(t,e)=>_d(e)?vd(t,e.value):Lr(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[i,r],s)=>(n[ma(i,s)+" =>"]=r,n),{})}:$r(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>ma(n))}:An(e)?ma(e):st(e)&&!He(e)&&!pd(e)?String(e):e,ma=(t,e="")=>{var n;return An(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let tn;class xd{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=tn,!e&&tn&&(this.index=(tn.scopes||(tn.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=tn;try{return tn=this,e()}finally{tn=n}}}on(){++this._on===1&&(this.prevScope=tn,tn=this)}off(){this._on>0&&--this._on===0&&(tn=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(this.effects.length=0,n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0}}}function qp(t){return new xd(t)}function Yp(){return tn}let mt;const ga=new WeakSet;class Sd{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,tn&&tn.active&&tn.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,ga.has(this)&&(ga.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ed(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,uu(this),yd(this);const e=mt,n=yn;mt=this,yn=!0;try{return this.fn()}finally{bd(this),mt=e,yn=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Rc(e);this.deps=this.depsTail=void 0,uu(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?ga.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){ul(this)&&this.run()}get dirty(){return ul(this)}}let Md=0,hs,ps;function Ed(t,e=!1){if(t.flags|=8,e){t.next=ps,ps=t;return}t.next=hs,hs=t}function Tc(){Md++}function Ac(){if(--Md>0)return;if(ps){let e=ps;for(ps=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;hs;){let e=hs;for(hs=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(i){t||(t=i)}e=n}}if(t)throw t}function yd(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function bd(t){let e,n=t.depsTail,i=n;for(;i;){const r=i.prevDep;i.version===-1?(i===n&&(n=r),Rc(i),$p(i)):e=i,i.dep.activeLink=i.prevActiveLink,i.prevActiveLink=void 0,i=r}t.deps=e,t.depsTail=n}function ul(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&(Td(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function Td(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===Ss)||(t.globalVersion=Ss,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!ul(t))))return;t.flags|=2;const e=t.dep,n=mt,i=yn;mt=t,yn=!0;try{yd(t);const r=t.fn(t._value);(e.version===0||zn(r,t._value))&&(t.flags|=128,t._value=r,e.version++)}catch(r){throw e.version++,r}finally{mt=n,yn=i,bd(t),t.flags&=-3}}function Rc(t,e=!1){const{dep:n,prevSub:i,nextSub:r}=t;if(i&&(i.nextSub=r,t.prevSub=void 0),r&&(r.prevSub=i,t.nextSub=void 0),n.subs===t&&(n.subs=i,!i&&n.computed)){n.computed.flags&=-5;for(let s=n.computed.deps;s;s=s.nextDep)Rc(s,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function $p(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let yn=!0;const Ad=[];function pi(){Ad.push(yn),yn=!1}function mi(){const t=Ad.pop();yn=t===void 0?!0:t}function uu(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=mt;mt=void 0;try{e()}finally{mt=n}}}let Ss=0;class Kp{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class Cc{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!mt||!yn||mt===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==mt)n=this.activeLink=new Kp(mt,this),mt.deps?(n.prevDep=mt.depsTail,mt.depsTail.nextDep=n,mt.depsTail=n):mt.deps=mt.depsTail=n,Rd(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const i=n.nextDep;i.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=i),n.prevDep=mt.depsTail,n.nextDep=void 0,mt.depsTail.nextDep=n,mt.depsTail=n,mt.deps===n&&(mt.deps=i)}return n}trigger(e){this.version++,Ss++,this.notify(e)}notify(e){Tc();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{Ac()}}}function Rd(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let i=e.deps;i;i=i.nextDep)Rd(i)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const fl=new WeakMap,lr=Symbol(""),dl=Symbol(""),Ms=Symbol("");function Ht(t,e,n){if(yn&&mt){let i=fl.get(t);i||fl.set(t,i=new Map);let r=i.get(n);r||(i.set(n,r=new Cc),r.map=i,r.key=n),r.track()}}function oi(t,e,n,i,r,s){const o=fl.get(t);if(!o){Ss++;return}const a=l=>{l&&l.trigger()};if(Tc(),e==="clear")o.forEach(a);else{const l=He(t),c=l&&yc(n);if(l&&n==="length"){const u=Number(i);o.forEach((d,f)=>{(f==="length"||f===Ms||!An(f)&&f>=u)&&a(d)})}else switch((n!==void 0||o.has(void 0))&&a(o.get(n)),c&&a(o.get(Ms)),e){case"add":l?c&&a(o.get("length")):(a(o.get(lr)),Lr(t)&&a(o.get(dl)));break;case"delete":l||(a(o.get(lr)),Lr(t)&&a(o.get(dl)));break;case"set":Lr(t)&&a(o.get(lr));break}}Ac()}function mr(t){const e=nt(t);return e===t?e:(Ht(e,"iterate",Ms),hn(t)?e:e.map(Rn))}function Ko(t){return Ht(t=nt(t),"iterate",Ms),t}function On(t,e){return gi(t)?Vr(cr(t)?Rn(e):e):Rn(e)}const jp={__proto__:null,[Symbol.iterator](){return _a(this,Symbol.iterator,t=>On(this,t))},concat(...t){return mr(this).concat(...t.map(e=>He(e)?mr(e):e))},entries(){return _a(this,"entries",t=>(t[1]=On(this,t[1]),t))},every(t,e){return jn(this,"every",t,e,void 0,arguments)},filter(t,e){return jn(this,"filter",t,e,n=>n.map(i=>On(this,i)),arguments)},find(t,e){return jn(this,"find",t,e,n=>On(this,n),arguments)},findIndex(t,e){return jn(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return jn(this,"findLast",t,e,n=>On(this,n),arguments)},findLastIndex(t,e){return jn(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return jn(this,"forEach",t,e,void 0,arguments)},includes(...t){return va(this,"includes",t)},indexOf(...t){return va(this,"indexOf",t)},join(t){return mr(this).join(t)},lastIndexOf(...t){return va(this,"lastIndexOf",t)},map(t,e){return jn(this,"map",t,e,void 0,arguments)},pop(){return Jr(this,"pop")},push(...t){return Jr(this,"push",t)},reduce(t,...e){return fu(this,"reduce",t,e)},reduceRight(t,...e){return fu(this,"reduceRight",t,e)},shift(){return Jr(this,"shift")},some(t,e){return jn(this,"some",t,e,void 0,arguments)},splice(...t){return Jr(this,"splice",t)},toReversed(){return mr(this).toReversed()},toSorted(t){return mr(this).toSorted(t)},toSpliced(...t){return mr(this).toSpliced(...t)},unshift(...t){return Jr(this,"unshift",t)},values(){return _a(this,"values",t=>On(this,t))}};function _a(t,e,n){const i=Ko(t),r=i[e]();return i!==t&&!hn(t)&&(r._next=r.next,r.next=()=>{const s=r._next();return s.done||(s.value=n(s.value)),s}),r}const Zp=Array.prototype;function jn(t,e,n,i,r,s){const o=Ko(t),a=o!==t&&!hn(t),l=o[e];if(l!==Zp[e]){const d=l.apply(t,s);return a?Rn(d):d}let c=n;o!==t&&(a?c=function(d,f){return n.call(this,On(t,d),f,t)}:n.length>2&&(c=function(d,f){return n.call(this,d,f,t)}));const u=l.call(o,c,i);return a&&r?r(u):u}function fu(t,e,n,i){const r=Ko(t),s=r!==t&&!hn(t);let o=n,a=!1;r!==t&&(s?(a=i.length===0,o=function(c,u,d){return a&&(a=!1,c=On(t,c)),n.call(this,c,On(t,u),d,t)}):n.length>3&&(o=function(c,u,d){return n.call(this,c,u,d,t)}));const l=r[e](o,...i);return a?On(t,l):l}function va(t,e,n){const i=nt(t);Ht(i,"iterate",Ms);const r=i[e](...n);return(r===-1||r===!1)&&Dc(n[0])?(n[0]=nt(n[0]),i[e](...n)):r}function Jr(t,e,n=[]){pi(),Tc();const i=nt(t)[e].apply(t,n);return Ac(),mi(),i}const Jp=Sc("__proto__,__v_isRef,__isVue"),Cd=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(An));function Qp(t){An(t)||(t=String(t));const e=nt(this);return Ht(e,"has",t),e.hasOwnProperty(t)}class wd{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,i){if(n==="__v_skip")return e.__v_skip;const r=this._isReadonly,s=this._isShallow;if(n==="__v_isReactive")return!r;if(n==="__v_isReadonly")return r;if(n==="__v_isShallow")return s;if(n==="__v_raw")return i===(r?s?cm:Ld:s?Id:Dd).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(i)?e:void 0;const o=He(e);if(!r){let l;if(o&&(l=jp[n]))return l;if(n==="hasOwnProperty")return Qp}const a=Reflect.get(e,n,Xt(e)?e:i);if((An(n)?Cd.has(n):Jp(n))||(r||Ht(e,"get",n),s))return a;if(Xt(a)){const l=o&&yc(n)?a:a.value;return r&&st(l)?pl(l):l}return st(a)?r?pl(a):jo(a):a}}class Pd extends wd{constructor(e=!1){super(!1,e)}set(e,n,i,r){let s=e[n];const o=He(e)&&yc(n);if(!this._isShallow){const c=gi(s);if(!hn(i)&&!gi(i)&&(s=nt(s),i=nt(i)),!o&&Xt(s)&&!Xt(i))return c||(s.value=i),!0}const a=o?Number(n)<e.length:rt(e,n),l=Reflect.set(e,n,i,Xt(e)?e:r);return e===nt(r)&&(a?zn(i,s)&&oi(e,"set",n,i):oi(e,"add",n,i)),l}deleteProperty(e,n){const i=rt(e,n);e[n];const r=Reflect.deleteProperty(e,n);return r&&i&&oi(e,"delete",n,void 0),r}has(e,n){const i=Reflect.has(e,n);return(!An(n)||!Cd.has(n))&&Ht(e,"has",n),i}ownKeys(e){return Ht(e,"iterate",He(e)?"length":lr),Reflect.ownKeys(e)}}class em extends wd{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const tm=new Pd,nm=new em,im=new Pd(!0);const hl=t=>t,Gs=t=>Reflect.getPrototypeOf(t);function rm(t,e,n){return function(...i){const r=this.__v_raw,s=nt(r),o=Lr(s),a=t==="entries"||t===Symbol.iterator&&o,l=t==="keys"&&o,c=r[t](...i),u=n?hl:e?Vr:Rn;return!e&&Ht(s,"iterate",l?dl:lr),Ct(Object.create(c),{next(){const{value:d,done:f}=c.next();return f?{value:d,done:f}:{value:a?[u(d[0]),u(d[1])]:u(d),done:f}}})}}function ks(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function sm(t,e){const n={get(r){const s=this.__v_raw,o=nt(s),a=nt(r);t||(zn(r,a)&&Ht(o,"get",r),Ht(o,"get",a));const{has:l}=Gs(o),c=e?hl:t?Vr:Rn;if(l.call(o,r))return c(s.get(r));if(l.call(o,a))return c(s.get(a));s!==o&&s.get(r)},get size(){const r=this.__v_raw;return!t&&Ht(nt(r),"iterate",lr),r.size},has(r){const s=this.__v_raw,o=nt(s),a=nt(r);return t||(zn(r,a)&&Ht(o,"has",r),Ht(o,"has",a)),r===a?s.has(r):s.has(r)||s.has(a)},forEach(r,s){const o=this,a=o.__v_raw,l=nt(a),c=e?hl:t?Vr:Rn;return!t&&Ht(l,"iterate",lr),a.forEach((u,d)=>r.call(s,c(u),c(d),o))}};return Ct(n,t?{add:ks("add"),set:ks("set"),delete:ks("delete"),clear:ks("clear")}:{add(r){const s=nt(this),o=Gs(s),a=nt(r),l=!e&&!hn(r)&&!gi(r)?a:r;return o.has.call(s,l)||zn(r,l)&&o.has.call(s,r)||zn(a,l)&&o.has.call(s,a)||(s.add(l),oi(s,"add",l,l)),this},set(r,s){!e&&!hn(s)&&!gi(s)&&(s=nt(s));const o=nt(this),{has:a,get:l}=Gs(o);let c=a.call(o,r);c||(r=nt(r),c=a.call(o,r));const u=l.call(o,r);return o.set(r,s),c?zn(s,u)&&oi(o,"set",r,s):oi(o,"add",r,s),this},delete(r){const s=nt(this),{has:o,get:a}=Gs(s);let l=o.call(s,r);l||(r=nt(r),l=o.call(s,r)),a&&a.call(s,r);const c=s.delete(r);return l&&oi(s,"delete",r,void 0),c},clear(){const r=nt(this),s=r.size!==0,o=r.clear();return s&&oi(r,"clear",void 0,void 0),o}}),["keys","values","entries",Symbol.iterator].forEach(r=>{n[r]=rm(r,t,e)}),n}function wc(t,e){const n=sm(t,e);return(i,r,s)=>r==="__v_isReactive"?!t:r==="__v_isReadonly"?t:r==="__v_raw"?i:Reflect.get(rt(n,r)&&r in i?n:i,r,s)}const om={get:wc(!1,!1)},am={get:wc(!1,!0)},lm={get:wc(!0,!1)};const Dd=new WeakMap,Id=new WeakMap,Ld=new WeakMap,cm=new WeakMap;function um(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function fm(t){return t.__v_skip||!Object.isExtensible(t)?0:um(Np(t))}function jo(t){return gi(t)?t:Pc(t,!1,tm,om,Dd)}function Ud(t){return Pc(t,!1,im,am,Id)}function pl(t){return Pc(t,!0,nm,lm,Ld)}function Pc(t,e,n,i,r){if(!st(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const s=fm(t);if(s===0)return t;const o=r.get(t);if(o)return o;const a=new Proxy(t,s===2?i:n);return r.set(t,a),a}function cr(t){return gi(t)?cr(t.__v_raw):!!(t&&t.__v_isReactive)}function gi(t){return!!(t&&t.__v_isReadonly)}function hn(t){return!!(t&&t.__v_isShallow)}function Dc(t){return t?!!t.__v_raw:!1}function nt(t){const e=t&&t.__v_raw;return e?nt(e):t}function Nd(t){return!rt(t,"__v_skip")&&Object.isExtensible(t)&&md(t,"__v_skip",!0),t}const Rn=t=>st(t)?jo(t):t,Vr=t=>st(t)?pl(t):t;function Xt(t){return t?t.__v_isRef===!0:!1}function vt(t){return Fd(t,!1)}function dm(t){return Fd(t,!0)}function Fd(t,e){return Xt(t)?t:new hm(t,e)}class hm{constructor(e,n){this.dep=new Cc,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:nt(e),this._value=n?e:Rn(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,i=this.__v_isShallow||hn(e)||gi(e);e=i?e:nt(e),zn(e,n)&&(this._rawValue=e,this._value=i?e:Rn(e),this.dep.trigger())}}function ur(t){return Xt(t)?t.value:t}const pm={get:(t,e,n)=>e==="__v_raw"?t:ur(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const r=t[e];return Xt(r)&&!Xt(n)?(r.value=n,!0):Reflect.set(t,e,n,i)}};function Od(t){return cr(t)?t:new Proxy(t,pm)}class mm{constructor(e,n,i){this.fn=e,this.setter=n,this._value=void 0,this.dep=new Cc(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ss-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=i}notify(){if(this.flags|=16,!(this.flags&8)&&mt!==this)return Ed(this,!0),!0}get value(){const e=this.dep.track();return Td(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function gm(t,e,n=!1){let i,r;return We(t)?i=t:(i=t.get,r=t.set),new mm(i,r,n)}const Ws={},Po=new WeakMap;let er;function _m(t,e=!1,n=er){if(n){let i=Po.get(n);i||Po.set(n,i=[]),i.push(t)}}function vm(t,e,n=dt){const{immediate:i,deep:r,once:s,scheduler:o,augmentJob:a,call:l}=n,c=E=>r?E:hn(E)||r===!1||r===0?ai(E,1):ai(E);let u,d,f,h,_=!1,v=!1;if(Xt(t)?(d=()=>t.value,_=hn(t)):cr(t)?(d=()=>c(t),_=!0):He(t)?(v=!0,_=t.some(E=>cr(E)||hn(E)),d=()=>t.map(E=>{if(Xt(E))return E.value;if(cr(E))return c(E);if(We(E))return l?l(E,2):E()})):We(t)?e?d=l?()=>l(t,2):t:d=()=>{if(f){pi();try{f()}finally{mi()}}const E=er;er=u;try{return l?l(t,3,[h]):t(h)}finally{er=E}}:d=kn,e&&r){const E=d,I=r===!0?1/0:r;d=()=>ai(E(),I)}const m=Yp(),p=()=>{u.stop(),m&&m.active&&Ec(m.effects,u)};if(s&&e){const E=e;e=(...I)=>{E(...I),p()}}let S=v?new Array(t.length).fill(Ws):Ws;const T=E=>{if(!(!(u.flags&1)||!u.dirty&&!E))if(e){const I=u.run();if(r||_||(v?I.some((D,L)=>zn(D,S[L])):zn(I,S))){f&&f();const D=er;er=u;try{const L=[I,S===Ws?void 0:v&&S[0]===Ws?[]:S,h];S=I,l?l(e,3,L):e(...L)}finally{er=D}}}else u.run()};return a&&a(T),u=new Sd(d),u.scheduler=o?()=>o(T,!1):T,h=E=>_m(E,!1,u),f=u.onStop=()=>{const E=Po.get(u);if(E){if(l)l(E,4);else for(const I of E)I();Po.delete(u)}},e?i?T(!0):S=u.run():o?o(T.bind(null,!0),!0):u.run(),p.pause=u.pause.bind(u),p.resume=u.resume.bind(u),p.stop=p,p}function ai(t,e=1/0,n){if(e<=0||!st(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,Xt(t))ai(t.value,e,n);else if(He(t))for(let i=0;i<t.length;i++)ai(t[i],e,n);else if($r(t)||Lr(t))t.forEach(i=>{ai(i,e,n)});else if(pd(t)){for(const i in t)ai(t[i],e,n);for(const i of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,i)&&ai(t[i],e,n)}return t}/**
* @vue/runtime-core v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Us(t,e,n,i){try{return i?t(...i):t()}catch(r){Zo(r,e,n)}}function Cn(t,e,n,i){if(We(t)){const r=Us(t,e,n,i);return r&&dd(r)&&r.catch(s=>{Zo(s,e,n)}),r}if(He(t)){const r=[];for(let s=0;s<t.length;s++)r.push(Cn(t[s],e,n,i));return r}}function Zo(t,e,n,i=!0){const r=e?e.vnode:null,{errorHandler:s,throwUnhandledErrorInProduction:o}=e&&e.appContext.config||dt;if(e){let a=e.parent;const l=e.proxy,c=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){const u=a.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](t,l,c)===!1)return}a=a.parent}if(s){pi(),Us(s,null,10,[t,l,c]),mi();return}}xm(t,n,r,i,o)}function xm(t,e,n,i=!0,r=!1){if(r)throw t;console.error(t)}const Zt=[];let Nn=-1;const Ur=[];let Ii=null,Pr=0;const Bd=Promise.resolve();let Do=null;function Jo(t){const e=Do||Bd;return t?e.then(this?t.bind(this):t):e}function Sm(t){let e=Nn+1,n=Zt.length;for(;e<n;){const i=e+n>>>1,r=Zt[i],s=Es(r);s<t||s===t&&r.flags&2?e=i+1:n=i}return e}function Ic(t){if(!(t.flags&1)){const e=Es(t),n=Zt[Zt.length-1];!n||!(t.flags&2)&&e>=Es(n)?Zt.push(t):Zt.splice(Sm(e),0,t),t.flags|=1,Vd()}}function Vd(){Do||(Do=Bd.then(Hd))}function Mm(t){He(t)?Ur.push(...t):Ii&&t.id===-1?Ii.splice(Pr+1,0,t):t.flags&1||(Ur.push(t),t.flags|=1),Vd()}function du(t,e,n=Nn+1){for(;n<Zt.length;n++){const i=Zt[n];if(i&&i.flags&2){if(t&&i.id!==t.uid)continue;Zt.splice(n,1),n--,i.flags&4&&(i.flags&=-2),i(),i.flags&4||(i.flags&=-2)}}}function zd(t){if(Ur.length){const e=[...new Set(Ur)].sort((n,i)=>Es(n)-Es(i));if(Ur.length=0,Ii){Ii.push(...e);return}for(Ii=e,Pr=0;Pr<Ii.length;Pr++){const n=Ii[Pr];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}Ii=null,Pr=0}}const Es=t=>t.id==null?t.flags&2?-1:1/0:t.id;function Hd(t){try{for(Nn=0;Nn<Zt.length;Nn++){const e=Zt[Nn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),Us(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Nn<Zt.length;Nn++){const e=Zt[Nn];e&&(e.flags&=-2)}Nn=-1,Zt.length=0,zd(),Do=null,(Zt.length||Ur.length)&&Hd()}}let Nt=null,Gd=null;function Io(t){const e=Nt;return Nt=t,Gd=t&&t.type.__scopeId||null,e}function xn(t,e=Nt,n){if(!e||t._n)return t;const i=(...r)=>{i._d&&Fo(-1);const s=Io(e);let o;try{o=t(...r)}finally{Io(s),i._d&&Fo(1)}return o};return i._n=!0,i._c=!0,i._d=!0,i}function Xs(t,e){if(Nt===null)return t;const n=ra(Nt),i=t.dirs||(t.dirs=[]);for(let r=0;r<e.length;r++){let[s,o,a,l=dt]=e[r];s&&(We(s)&&(s={mounted:s,updated:s}),s.deep&&ai(o),i.push({dir:s,instance:n,value:o,oldValue:void 0,arg:a,modifiers:l}))}return t}function Wi(t,e,n,i){const r=t.dirs,s=e&&e.dirs;for(let o=0;o<r.length;o++){const a=r[o];s&&(a.oldValue=s[o].value);let l=a.dir[i];l&&(pi(),Cn(l,n,8,[t.el,a,t,e]),mi())}}function So(t,e){if(kt){let n=kt.provides;const i=kt.parent&&kt.parent.provides;i===n&&(n=kt.provides=Object.create(i)),n[t]=e}}function bn(t,e,n=!1){const i=Th();if(i||Fr){let r=Fr?Fr._context.provides:i?i.parent==null||i.ce?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:void 0;if(r&&t in r)return r[t];if(arguments.length>1)return n&&We(e)?e.call(i&&i.proxy):e}}const Em=Symbol.for("v-scx"),ym=()=>bn(Em);function ms(t,e,n){return kd(t,e,n)}function kd(t,e,n=dt){const{immediate:i,deep:r,flush:s,once:o}=n,a=Ct({},n),l=e&&i||!e&&s!=="post";let c;if(Rs){if(s==="sync"){const h=ym();c=h.__watcherHandles||(h.__watcherHandles=[])}else if(!l){const h=()=>{};return h.stop=kn,h.resume=kn,h.pause=kn,h}}const u=kt;a.call=(h,_,v)=>Cn(h,u,_,v);let d=!1;s==="post"?a.scheduler=h=>{en(h,u&&u.suspense)}:s!=="sync"&&(d=!0,a.scheduler=(h,_)=>{_?h():Ic(h)}),a.augmentJob=h=>{e&&(h.flags|=4),d&&(h.flags|=2,u&&(h.id=u.uid,h.i=u))};const f=vm(t,e,a);return Rs&&(c?c.push(f):l&&f()),f}function bm(t,e,n){const i=this.proxy,r=St(t)?t.includes(".")?Wd(i,t):()=>i[t]:t.bind(i,i);let s;We(e)?s=e:(s=e.handler,n=e);const o=Ns(this),a=kd(r,s.bind(i),n);return o(),a}function Wd(t,e){const n=e.split(".");return()=>{let i=t;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}const Tm=Symbol("_vte"),Xd=t=>t.__isTeleport,Fn=Symbol("_leaveCb"),Qr=Symbol("_enterCb");function Am(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return Lc(()=>{t.isMounted=!0}),ta(()=>{t.isUnmounting=!0}),t}const cn=[Function,Array],qd={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:cn,onEnter:cn,onAfterEnter:cn,onEnterCancelled:cn,onBeforeLeave:cn,onLeave:cn,onAfterLeave:cn,onLeaveCancelled:cn,onBeforeAppear:cn,onAppear:cn,onAfterAppear:cn,onAppearCancelled:cn},Yd=t=>{const e=t.subTree;return e.component?Yd(e.component):e},Rm={name:"BaseTransition",props:qd,setup(t,{slots:e}){const n=Th(),i=Am();return()=>{const r=e.default&&jd(e.default(),!0);if(!r||!r.length)return;const s=$d(r),o=nt(t),{mode:a}=o;if(i.isLeaving)return xa(s);const l=hu(s);if(!l)return xa(s);let c=ml(l,o,i,n,d=>c=d);l.type!==Gt&&ys(l,c);let u=n.subTree&&hu(n.subTree);if(u&&u.type!==Gt&&!nr(u,l)&&Yd(n).type!==Gt){let d=ml(u,o,i,n);if(ys(u,d),a==="out-in"&&l.type!==Gt)return i.isLeaving=!0,d.afterLeave=()=>{i.isLeaving=!1,n.job.flags&8||n.update(),delete d.afterLeave,u=void 0},xa(s);a==="in-out"&&l.type!==Gt?d.delayLeave=(f,h,_)=>{const v=Kd(i,u);v[String(u.key)]=u,f[Fn]=()=>{h(),f[Fn]=void 0,delete c.delayedLeave,u=void 0},c.delayedLeave=()=>{_(),delete c.delayedLeave,u=void 0}}:u=void 0}else u&&(u=void 0);return s}}};function $d(t){let e=t[0];if(t.length>1){for(const n of t)if(n.type!==Gt){e=n;break}}return e}const Cm=Rm;function Kd(t,e){const{leavingVNodes:n}=t;let i=n.get(e.type);return i||(i=Object.create(null),n.set(e.type,i)),i}function ml(t,e,n,i,r){const{appear:s,mode:o,persisted:a=!1,onBeforeEnter:l,onEnter:c,onAfterEnter:u,onEnterCancelled:d,onBeforeLeave:f,onLeave:h,onAfterLeave:_,onLeaveCancelled:v,onBeforeAppear:m,onAppear:p,onAfterAppear:S,onAppearCancelled:T}=e,E=String(t.key),I=Kd(n,t),D=(b,V)=>{b&&Cn(b,i,9,V)},L=(b,V)=>{const C=V[1];D(b,V),He(b)?b.every(P=>P.length<=1)&&C():b.length<=1&&C()},x={mode:o,persisted:a,beforeEnter(b){let V=l;if(!n.isMounted)if(s)V=m||l;else return;b[Fn]&&b[Fn](!0);const C=I[E];C&&nr(t,C)&&C.el[Fn]&&C.el[Fn](),D(V,[b])},enter(b){if(I[E]===t)return;let V=c,C=u,P=d;if(!n.isMounted)if(s)V=p||c,C=S||u,P=T||d;else return;let H=!1;b[Qr]=W=>{H||(H=!0,W?D(P,[b]):D(C,[b]),x.delayedLeave&&x.delayedLeave(),b[Qr]=void 0)};const K=b[Qr].bind(null,!1);V?L(V,[b,K]):K()},leave(b,V){const C=String(t.key);if(b[Qr]&&b[Qr](!0),n.isUnmounting)return V();D(f,[b]);let P=!1;b[Fn]=K=>{P||(P=!0,V(),K?D(v,[b]):D(_,[b]),b[Fn]=void 0,I[C]===t&&delete I[C])};const H=b[Fn].bind(null,!1);I[C]=t,h?L(h,[b,H]):H()},clone(b){const V=ml(b,e,n,i,r);return r&&r(V),V}};return x}function xa(t){if(Qo(t))return t=Bi(t),t.children=null,t}function hu(t){if(!Qo(t))return Xd(t.type)&&t.children?$d(t.children):t;if(t.component)return t.component.subTree;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&We(n.default))return n.default()}}function ys(t,e){t.shapeFlag&6&&t.component?(t.transition=e,ys(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function jd(t,e=!1,n){let i=[],r=0;for(let s=0;s<t.length;s++){let o=t[s];const a=n==null?o.key:String(n)+String(o.key!=null?o.key:s);o.type===Lt?(o.patchFlag&128&&r++,i=i.concat(jd(o.children,e,a))):(e||o.type!==Gt)&&i.push(a!=null?Bi(o,{key:a}):o)}if(r>1)for(let s=0;s<i.length;s++)i[s].patchFlag=-2;return i}function Zd(t,e){return We(t)?Ct({name:t.name},e,{setup:t}):t}function Jd(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function pu(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const Lo=new WeakMap;function gs(t,e,n,i,r=!1){if(He(t)){t.forEach((v,m)=>gs(v,e&&(He(e)?e[m]:e),n,i,r));return}if(Nr(i)&&!r){i.shapeFlag&512&&i.type.__asyncResolved&&i.component.subTree.component&&gs(t,e,n,i.component.subTree);return}const s=i.shapeFlag&4?ra(i.component):i.el,o=r?null:s,{i:a,r:l}=t,c=e&&e.r,u=a.refs===dt?a.refs={}:a.refs,d=a.setupState,f=nt(d),h=d===dt?fd:v=>pu(u,v)?!1:rt(f,v),_=(v,m)=>!(m&&pu(u,m));if(c!=null&&c!==l){if(mu(e),St(c))u[c]=null,h(c)&&(d[c]=null);else if(Xt(c)){const v=e;_(c,v.k)&&(c.value=null),v.k&&(u[v.k]=null)}}if(We(l))Us(l,a,12,[o,u]);else{const v=St(l),m=Xt(l);if(v||m){const p=()=>{if(t.f){const S=v?h(l)?d[l]:u[l]:_()||!t.k?l.value:u[t.k];if(r)He(S)&&Ec(S,s);else if(He(S))S.includes(s)||S.push(s);else if(v)u[l]=[s],h(l)&&(d[l]=u[l]);else{const T=[s];_(l,t.k)&&(l.value=T),t.k&&(u[t.k]=T)}}else v?(u[l]=o,h(l)&&(d[l]=o)):m&&(_(l,t.k)&&(l.value=o),t.k&&(u[t.k]=o))};if(o){const S=()=>{p(),Lo.delete(t)};S.id=-1,Lo.set(t,S),en(S,n)}else mu(t),p()}}}function mu(t){const e=Lo.get(t);e&&(e.flags|=8,Lo.delete(t))}Yo().requestIdleCallback;Yo().cancelIdleCallback;const Nr=t=>!!t.type.__asyncLoader,Qo=t=>t.type.__isKeepAlive;function wm(t,e){Qd(t,"a",e)}function Pm(t,e){Qd(t,"da",e)}function Qd(t,e,n=kt){const i=t.__wdc||(t.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return t()});if(ea(e,i,n),n){let r=n.parent;for(;r&&r.parent;)Qo(r.parent.vnode)&&Dm(i,e,n,r),r=r.parent}}function Dm(t,e,n,i){const r=ea(e,t,i,!0);eh(()=>{Ec(i[e],r)},n)}function ea(t,e,n=kt,i=!1){if(n){const r=n[t]||(n[t]=[]),s=e.__weh||(e.__weh=(...o)=>{pi();const a=Ns(n),l=Cn(e,n,t,o);return a(),mi(),l});return i?r.unshift(s):r.push(s),s}}const Mi=t=>(e,n=kt)=>{(!Rs||t==="sp")&&ea(t,(...i)=>e(...i),n)},Im=Mi("bm"),Lc=Mi("m"),Lm=Mi("bu"),Um=Mi("u"),ta=Mi("bum"),eh=Mi("um"),Nm=Mi("sp"),Fm=Mi("rtg"),Om=Mi("rtc");function Bm(t,e=kt){ea("ec",t,e)}const th="components";function nh(t,e){return rh(th,t,!0,e)||t}const ih=Symbol.for("v-ndc");function Vm(t){return St(t)?rh(th,t,!1)||t:t||ih}function rh(t,e,n=!0,i=!1){const r=Nt||kt;if(r){const s=r.type;{const a=bg(s,!1);if(a&&(a===e||a===Jt(e)||a===Xo(Jt(e))))return s}const o=gu(r[t]||s[t],e)||gu(r.appContext[t],e);return!o&&i?s:o}}function gu(t,e){return t&&(t[e]||t[Jt(e)]||t[Xo(Jt(e))])}function Uo(t,e,n,i){let r;const s=n,o=He(t);if(o||St(t)){const a=o&&cr(t);let l=!1,c=!1;a&&(l=!hn(t),c=gi(t),t=Ko(t)),r=new Array(t.length);for(let u=0,d=t.length;u<d;u++)r[u]=e(l?c?Vr(Rn(t[u])):Rn(t[u]):t[u],u,void 0,s)}else if(typeof t=="number"){r=new Array(t);for(let a=0;a<t;a++)r[a]=e(a+1,a,void 0,s)}else if(st(t))if(t[Symbol.iterator])r=Array.from(t,(a,l)=>e(a,l,void 0,s));else{const a=Object.keys(t);r=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];r[l]=e(t[u],u,l,s)}}else r=[];return r}function _u(t,e,n={},i,r){if(Nt.ce||Nt.parent&&Nr(Nt.parent)&&Nt.parent.ce){const c=Object.keys(n).length>0;return gt(),Ts(Lt,null,[ht("slot",n,i)],c?-2:64)}let s=t[e];s&&s._c&&(s._d=!1),gt();const o=s&&sh(s(n)),a=n.key||o&&o.key,l=Ts(Lt,{key:(a&&!An(a)?a:`_${e}`)+(!o&&i?"_fb":"")},o||[],o&&t._===1?64:-2);return s&&s._c&&(s._d=!0),l}function sh(t){return t.some(e=>As(e)?!(e.type===Gt||e.type===Lt&&!sh(e.children)):!0)?t:null}const gl=t=>t?Ah(t)?ra(t):gl(t.parent):null,_s=Ct(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>gl(t.parent),$root:t=>gl(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>ah(t),$forceUpdate:t=>t.f||(t.f=()=>{Ic(t.update)}),$nextTick:t=>t.n||(t.n=Jo.bind(t.proxy)),$watch:t=>bm.bind(t)}),Sa=(t,e)=>t!==dt&&!t.__isScriptSetup&&rt(t,e),zm={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:i,data:r,props:s,accessCache:o,type:a,appContext:l}=t;if(e[0]!=="$"){const f=o[e];if(f!==void 0)switch(f){case 1:return i[e];case 2:return r[e];case 4:return n[e];case 3:return s[e]}else{if(Sa(i,e))return o[e]=1,i[e];if(r!==dt&&rt(r,e))return o[e]=2,r[e];if(rt(s,e))return o[e]=3,s[e];if(n!==dt&&rt(n,e))return o[e]=4,n[e];_l&&(o[e]=0)}}const c=_s[e];let u,d;if(c)return e==="$attrs"&&Ht(t.attrs,"get",""),c(t);if((u=a.__cssModules)&&(u=u[e]))return u;if(n!==dt&&rt(n,e))return o[e]=4,n[e];if(d=l.config.globalProperties,rt(d,e))return d[e]},set({_:t},e,n){const{data:i,setupState:r,ctx:s}=t;return Sa(r,e)?(r[e]=n,!0):i!==dt&&rt(i,e)?(i[e]=n,!0):rt(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(s[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:r,props:s,type:o}},a){let l;return!!(n[a]||t!==dt&&a[0]!=="$"&&rt(t,a)||Sa(e,a)||rt(s,a)||rt(i,a)||rt(_s,a)||rt(r.config.globalProperties,a)||(l=o.__cssModules)&&l[a])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:rt(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function vu(t){return He(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let _l=!0;function Hm(t){const e=ah(t),n=t.proxy,i=t.ctx;_l=!1,e.beforeCreate&&xu(e.beforeCreate,t,"bc");const{data:r,computed:s,methods:o,watch:a,provide:l,inject:c,created:u,beforeMount:d,mounted:f,beforeUpdate:h,updated:_,activated:v,deactivated:m,beforeDestroy:p,beforeUnmount:S,destroyed:T,unmounted:E,render:I,renderTracked:D,renderTriggered:L,errorCaptured:x,serverPrefetch:b,expose:V,inheritAttrs:C,components:P,directives:H,filters:K}=e;if(c&&Gm(c,i,null),o)for(const F in o){const se=o[F];We(se)&&(i[F]=se.bind(n))}if(r){const F=r.call(n,n);st(F)&&(t.data=jo(F))}if(_l=!0,s)for(const F in s){const se=s[F],ce=We(se)?se.bind(n,n):We(se.get)?se.get.bind(n,n):kn,xe=!We(se)&&We(se.set)?se.set.bind(n):kn,Ee=yt({get:ce,set:xe});Object.defineProperty(i,F,{enumerable:!0,configurable:!0,get:()=>Ee.value,set:_e=>Ee.value=_e})}if(a)for(const F in a)oh(a[F],i,n,F);if(l){const F=We(l)?l.call(n):l;Reflect.ownKeys(F).forEach(se=>{So(se,F[se])})}u&&xu(u,t,"c");function k(F,se){He(se)?se.forEach(ce=>F(ce.bind(n))):se&&F(se.bind(n))}if(k(Im,d),k(Lc,f),k(Lm,h),k(Um,_),k(wm,v),k(Pm,m),k(Bm,x),k(Om,D),k(Fm,L),k(ta,S),k(eh,E),k(Nm,b),He(V))if(V.length){const F=t.exposed||(t.exposed={});V.forEach(se=>{Object.defineProperty(F,se,{get:()=>n[se],set:ce=>n[se]=ce,enumerable:!0})})}else t.exposed||(t.exposed={});I&&t.render===kn&&(t.render=I),C!=null&&(t.inheritAttrs=C),P&&(t.components=P),H&&(t.directives=H),b&&Jd(t)}function Gm(t,e,n=kn){He(t)&&(t=vl(t));for(const i in t){const r=t[i];let s;st(r)?"default"in r?s=bn(r.from||i,r.default,!0):s=bn(r.from||i):s=bn(r),Xt(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:o=>s.value=o}):e[i]=s}}function xu(t,e,n){Cn(He(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function oh(t,e,n,i){let r=i.includes(".")?Wd(n,i):()=>n[i];if(St(t)){const s=e[t];We(s)&&ms(r,s)}else if(We(t))ms(r,t.bind(n));else if(st(t))if(He(t))t.forEach(s=>oh(s,e,n,i));else{const s=We(t.handler)?t.handler.bind(n):e[t.handler];We(s)&&ms(r,s,t)}}function ah(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:o}}=t.appContext,a=s.get(e);let l;return a?l=a:!r.length&&!n&&!i?l=e:(l={},r.length&&r.forEach(c=>No(l,c,o,!0)),No(l,e,o)),st(e)&&s.set(e,l),l}function No(t,e,n,i=!1){const{mixins:r,extends:s}=e;s&&No(t,s,n,!0),r&&r.forEach(o=>No(t,o,n,!0));for(const o in e)if(!(i&&o==="expose")){const a=km[o]||n&&n[o];t[o]=a?a(t[o],e[o]):e[o]}return t}const km={data:Su,props:Mu,emits:Mu,methods:cs,computed:cs,beforeCreate:$t,created:$t,beforeMount:$t,mounted:$t,beforeUpdate:$t,updated:$t,beforeDestroy:$t,beforeUnmount:$t,destroyed:$t,unmounted:$t,activated:$t,deactivated:$t,errorCaptured:$t,serverPrefetch:$t,components:cs,directives:cs,watch:Xm,provide:Su,inject:Wm};function Su(t,e){return e?t?function(){return Ct(We(t)?t.call(this,this):t,We(e)?e.call(this,this):e)}:e:t}function Wm(t,e){return cs(vl(t),vl(e))}function vl(t){if(He(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function $t(t,e){return t?[...new Set([].concat(t,e))]:e}function cs(t,e){return t?Ct(Object.create(null),t,e):e}function Mu(t,e){return t?He(t)&&He(e)?[...new Set([...t,...e])]:Ct(Object.create(null),vu(t),vu(e??{})):e}function Xm(t,e){if(!t)return e;if(!e)return t;const n=Ct(Object.create(null),t);for(const i in e)n[i]=$t(t[i],e[i]);return n}function lh(){return{app:null,config:{isNativeTag:fd,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let qm=0;function Ym(t,e){return function(i,r=null){We(i)||(i=Ct({},i)),r!=null&&!st(r)&&(r=null);const s=lh(),o=new WeakSet,a=[];let l=!1;const c=s.app={_uid:qm++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:Ag,get config(){return s.config},set config(u){},use(u,...d){return o.has(u)||(u&&We(u.install)?(o.add(u),u.install(c,...d)):We(u)&&(o.add(u),u(c,...d))),c},mixin(u){return s.mixins.includes(u)||s.mixins.push(u),c},component(u,d){return d?(s.components[u]=d,c):s.components[u]},directive(u,d){return d?(s.directives[u]=d,c):s.directives[u]},mount(u,d,f){if(!l){const h=c._ceVNode||ht(i,r);return h.appContext=s,f===!0?f="svg":f===!1&&(f=void 0),t(h,u,f),l=!0,c._container=u,u.__vue_app__=c,ra(h.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Cn(a,c._instance,16),t(null,c._container),delete c._container.__vue_app__)},provide(u,d){return s.provides[u]=d,c},runWithContext(u){const d=Fr;Fr=c;try{return u()}finally{Fr=d}}};return c}}let Fr=null;const $m=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${Jt(e)}Modifiers`]||t[`${dr(e)}Modifiers`];function Km(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||dt;let r=n;const s=e.startsWith("update:"),o=s&&$m(i,e.slice(7));o&&(o.trim&&(r=n.map(u=>St(u)?u.trim():u)),o.number&&(r=n.map(qo)));let a,l=i[a=pa(e)]||i[a=pa(Jt(e))];!l&&s&&(l=i[a=pa(dr(e))]),l&&Cn(l,t,6,r);const c=i[a+"Once"];if(c){if(!t.emitted)t.emitted={};else if(t.emitted[a])return;t.emitted[a]=!0,Cn(c,t,6,r)}}const jm=new WeakMap;function ch(t,e,n=!1){const i=n?jm:e.emitsCache,r=i.get(t);if(r!==void 0)return r;const s=t.emits;let o={},a=!1;if(!We(t)){const l=c=>{const u=ch(c,e,!0);u&&(a=!0,Ct(o,u))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!s&&!a?(st(t)&&i.set(t,null),null):(He(s)?s.forEach(l=>o[l]=null):Ct(o,s),st(t)&&i.set(t,o),o)}function na(t,e){return!t||!ko(e)?!1:(e=e.slice(2).replace(/Once$/,""),rt(t,e[0].toLowerCase()+e.slice(1))||rt(t,dr(e))||rt(t,e))}function Eu(t){const{type:e,vnode:n,proxy:i,withProxy:r,propsOptions:[s],slots:o,attrs:a,emit:l,render:c,renderCache:u,props:d,data:f,setupState:h,ctx:_,inheritAttrs:v}=t,m=Io(t);let p,S;try{if(n.shapeFlag&4){const E=r||i,I=E;p=Bn(c.call(I,E,u,d,h,f,_)),S=a}else{const E=e;p=Bn(E.length>1?E(d,{attrs:a,slots:o,emit:l}):E(d,null)),S=e.props?a:Zm(a)}}catch(E){vs.length=0,Zo(E,t,1),p=ht(Gt)}let T=p;if(S&&v!==!1){const E=Object.keys(S),{shapeFlag:I}=T;E.length&&I&7&&(s&&E.some(Mc)&&(S=Jm(S,s)),T=Bi(T,S,!1,!0))}return n.dirs&&(T=Bi(T,null,!1,!0),T.dirs=T.dirs?T.dirs.concat(n.dirs):n.dirs),n.transition&&ys(T,n.transition),p=T,Io(m),p}const Zm=t=>{let e;for(const n in t)(n==="class"||n==="style"||ko(n))&&((e||(e={}))[n]=t[n]);return e},Jm=(t,e)=>{const n={};for(const i in t)(!Mc(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function Qm(t,e,n){const{props:i,children:r,component:s}=t,{props:o,children:a,patchFlag:l}=e,c=s.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?yu(i,o,c):!!o;if(l&8){const u=e.dynamicProps;for(let d=0;d<u.length;d++){const f=u[d];if(uh(o,i,f)&&!na(c,f))return!0}}}else return(r||a)&&(!a||!a.$stable)?!0:i===o?!1:i?o?yu(i,o,c):!0:!!o;return!1}function yu(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(uh(e,t,s)&&!na(n,s))return!0}return!1}function uh(t,e,n){const i=t[n],r=e[n];return n==="style"&&st(i)&&st(r)?!Oi(i,r):i!==r}function eg({vnode:t,parent:e},n){for(;e;){const i=e.subTree;if(i.suspense&&i.suspense.activeBranch===t&&(i.el=t.el),i===t)(t=e.vnode).el=n,e=e.parent;else break}}const fh={},dh=()=>Object.create(fh),hh=t=>Object.getPrototypeOf(t)===fh;function tg(t,e,n,i=!1){const r={},s=dh();t.propsDefaults=Object.create(null),ph(t,e,r,s);for(const o in t.propsOptions[0])o in r||(r[o]=void 0);n?t.props=i?r:Ud(r):t.type.props?t.props=r:t.props=s,t.attrs=s}function ng(t,e,n,i){const{props:r,attrs:s,vnode:{patchFlag:o}}=t,a=nt(r),[l]=t.propsOptions;let c=!1;if((i||o>0)&&!(o&16)){if(o&8){const u=t.vnode.dynamicProps;for(let d=0;d<u.length;d++){let f=u[d];if(na(t.emitsOptions,f))continue;const h=e[f];if(l)if(rt(s,f))h!==s[f]&&(s[f]=h,c=!0);else{const _=Jt(f);r[_]=xl(l,a,_,h,t,!1)}else h!==s[f]&&(s[f]=h,c=!0)}}}else{ph(t,e,r,s)&&(c=!0);let u;for(const d in a)(!e||!rt(e,d)&&((u=dr(d))===d||!rt(e,u)))&&(l?n&&(n[d]!==void 0||n[u]!==void 0)&&(r[d]=xl(l,a,d,void 0,t,!0)):delete r[d]);if(s!==a)for(const d in s)(!e||!rt(e,d))&&(delete s[d],c=!0)}c&&oi(t.attrs,"set","")}function ph(t,e,n,i){const[r,s]=t.propsOptions;let o=!1,a;if(e)for(let l in e){if(ds(l))continue;const c=e[l];let u;r&&rt(r,u=Jt(l))?!s||!s.includes(u)?n[u]=c:(a||(a={}))[u]=c:na(t.emitsOptions,l)||(!(l in i)||c!==i[l])&&(i[l]=c,o=!0)}if(s){const l=nt(n),c=a||dt;for(let u=0;u<s.length;u++){const d=s[u];n[d]=xl(r,l,d,c[d],t,!rt(c,d))}}return o}function xl(t,e,n,i,r,s){const o=t[n];if(o!=null){const a=rt(o,"default");if(a&&i===void 0){const l=o.default;if(o.type!==Function&&!o.skipFactory&&We(l)){const{propsDefaults:c}=r;if(n in c)i=c[n];else{const u=Ns(r);i=c[n]=l.call(null,e),u()}}else i=l;r.ce&&r.ce._setProp(n,i)}o[0]&&(s&&!a?i=!1:o[1]&&(i===""||i===dr(n))&&(i=!0))}return i}const ig=new WeakMap;function mh(t,e,n=!1){const i=n?ig:e.propsCache,r=i.get(t);if(r)return r;const s=t.props,o={},a=[];let l=!1;if(!We(t)){const u=d=>{l=!0;const[f,h]=mh(d,e,!0);Ct(o,f),h&&a.push(...h)};!n&&e.mixins.length&&e.mixins.forEach(u),t.extends&&u(t.extends),t.mixins&&t.mixins.forEach(u)}if(!s&&!l)return st(t)&&i.set(t,Ir),Ir;if(He(s))for(let u=0;u<s.length;u++){const d=Jt(s[u]);bu(d)&&(o[d]=dt)}else if(s)for(const u in s){const d=Jt(u);if(bu(d)){const f=s[u],h=o[d]=He(f)||We(f)?{type:f}:Ct({},f),_=h.type;let v=!1,m=!0;if(He(_))for(let p=0;p<_.length;++p){const S=_[p],T=We(S)&&S.name;if(T==="Boolean"){v=!0;break}else T==="String"&&(m=!1)}else v=We(_)&&_.name==="Boolean";h[0]=v,h[1]=m,(v||rt(h,"default"))&&a.push(d)}}const c=[o,a];return st(t)&&i.set(t,c),c}function bu(t){return t[0]!=="$"&&!ds(t)}const Uc=t=>t==="_"||t==="_ctx"||t==="$stable",Nc=t=>He(t)?t.map(Bn):[Bn(t)],rg=(t,e,n)=>{if(e._n)return e;const i=xn((...r)=>Nc(e(...r)),n);return i._c=!1,i},gh=(t,e,n)=>{const i=t._ctx;for(const r in t){if(Uc(r))continue;const s=t[r];if(We(s))e[r]=rg(r,s,i);else if(s!=null){const o=Nc(s);e[r]=()=>o}}},_h=(t,e)=>{const n=Nc(e);t.slots.default=()=>n},vh=(t,e,n)=>{for(const i in e)(n||!Uc(i))&&(t[i]=e[i])},sg=(t,e,n)=>{const i=t.slots=dh();if(t.vnode.shapeFlag&32){const r=e._;r?(vh(i,e,n),n&&md(i,"_",r,!0)):gh(e,i)}else e&&_h(t,e)},og=(t,e,n)=>{const{vnode:i,slots:r}=t;let s=!0,o=dt;if(i.shapeFlag&32){const a=e._;a?n&&a===1?s=!1:vh(r,e,n):(s=!e.$stable,gh(e,r)),o=e}else e&&(_h(t,e),o={default:1});if(s)for(const a in r)!Uc(a)&&o[a]==null&&delete r[a]},en=fg;function ag(t){return lg(t)}function lg(t,e){const n=Yo();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:o,createText:a,createComment:l,setText:c,setElementText:u,parentNode:d,nextSibling:f,setScopeId:h=kn,insertStaticContent:_}=t,v=(R,w,O,Q=null,J=null,te=null,A=void 0,fe=null,ae=!!w.dynamicChildren)=>{if(R===w)return;R&&!nr(R,w)&&(Q=N(R),_e(R,J,te,!0),R=null),w.patchFlag===-2&&(ae=!1,w.dynamicChildren=null);const{type:re,ref:le,shapeFlag:M}=w;switch(re){case ia:m(R,w,O,Q);break;case Gt:p(R,w,O,Q);break;case Mo:R==null&&S(w,O,Q,A);break;case Lt:P(R,w,O,Q,J,te,A,fe,ae);break;default:M&1?I(R,w,O,Q,J,te,A,fe,ae):M&6?H(R,w,O,Q,J,te,A,fe,ae):(M&64||M&128)&&re.process(R,w,O,Q,J,te,A,fe,ae,ue)}le!=null&&J?gs(le,R&&R.ref,te,w||R,!w):le==null&&R&&R.ref!=null&&gs(R.ref,null,te,R,!0)},m=(R,w,O,Q)=>{if(R==null)i(w.el=a(w.children),O,Q);else{const J=w.el=R.el;w.children!==R.children&&c(J,w.children)}},p=(R,w,O,Q)=>{R==null?i(w.el=l(w.children||""),O,Q):w.el=R.el},S=(R,w,O,Q)=>{[R.el,R.anchor]=_(R.children,w,O,Q,R.el,R.anchor)},T=({el:R,anchor:w},O,Q)=>{let J;for(;R&&R!==w;)J=f(R),i(R,O,Q),R=J;i(w,O,Q)},E=({el:R,anchor:w})=>{let O;for(;R&&R!==w;)O=f(R),r(R),R=O;r(w)},I=(R,w,O,Q,J,te,A,fe,ae)=>{if(w.type==="svg"?A="svg":w.type==="math"&&(A="mathml"),R==null)D(w,O,Q,J,te,A,fe,ae);else{const re=R.el&&R.el._isVueCE?R.el:null;try{re&&re._beginPatch(),b(R,w,J,te,A,fe,ae)}finally{re&&re._endPatch()}}},D=(R,w,O,Q,J,te,A,fe)=>{let ae,re;const{props:le,shapeFlag:M,transition:g,dirs:U}=R;if(ae=R.el=o(R.type,te,le&&le.is,le),M&8?u(ae,R.children):M&16&&x(R.children,ae,null,Q,J,Ma(R,te),A,fe),U&&Wi(R,null,Q,"created"),L(ae,R,R.scopeId,A,Q),le){for(const ne in le)ne!=="value"&&!ds(ne)&&s(ae,ne,null,le[ne],te,Q);"value"in le&&s(ae,"value",null,le.value,te),(re=le.onVnodeBeforeMount)&&In(re,Q,R)}U&&Wi(R,null,Q,"beforeMount");const X=cg(J,g);X&&g.beforeEnter(ae),i(ae,w,O),((re=le&&le.onVnodeMounted)||X||U)&&en(()=>{re&&In(re,Q,R),X&&g.enter(ae),U&&Wi(R,null,Q,"mounted")},J)},L=(R,w,O,Q,J)=>{if(O&&h(R,O),Q)for(let te=0;te<Q.length;te++)h(R,Q[te]);if(J){let te=J.subTree;if(w===te||Eh(te.type)&&(te.ssContent===w||te.ssFallback===w)){const A=J.vnode;L(R,A,A.scopeId,A.slotScopeIds,J.parent)}}},x=(R,w,O,Q,J,te,A,fe,ae=0)=>{for(let re=ae;re<R.length;re++){const le=R[re]=fe?si(R[re]):Bn(R[re]);v(null,le,w,O,Q,J,te,A,fe)}},b=(R,w,O,Q,J,te,A)=>{const fe=w.el=R.el;let{patchFlag:ae,dynamicChildren:re,dirs:le}=w;ae|=R.patchFlag&16;const M=R.props||dt,g=w.props||dt;let U;if(O&&Xi(O,!1),(U=g.onVnodeBeforeUpdate)&&In(U,O,w,R),le&&Wi(w,R,O,"beforeUpdate"),O&&Xi(O,!0),(M.innerHTML&&g.innerHTML==null||M.textContent&&g.textContent==null)&&u(fe,""),re?V(R.dynamicChildren,re,fe,O,Q,Ma(w,J),te):A||se(R,w,fe,null,O,Q,Ma(w,J),te,!1),ae>0){if(ae&16)C(fe,M,g,O,J);else if(ae&2&&M.class!==g.class&&s(fe,"class",null,g.class,J),ae&4&&s(fe,"style",M.style,g.style,J),ae&8){const X=w.dynamicProps;for(let ne=0;ne<X.length;ne++){const q=X[ne],ye=M[q],he=g[q];(he!==ye||q==="value")&&s(fe,q,ye,he,J,O)}}ae&1&&R.children!==w.children&&u(fe,w.children)}else!A&&re==null&&C(fe,M,g,O,J);((U=g.onVnodeUpdated)||le)&&en(()=>{U&&In(U,O,w,R),le&&Wi(w,R,O,"updated")},Q)},V=(R,w,O,Q,J,te,A)=>{for(let fe=0;fe<w.length;fe++){const ae=R[fe],re=w[fe],le=ae.el&&(ae.type===Lt||!nr(ae,re)||ae.shapeFlag&198)?d(ae.el):O;v(ae,re,le,null,Q,J,te,A,!0)}},C=(R,w,O,Q,J)=>{if(w!==O){if(w!==dt)for(const te in w)!ds(te)&&!(te in O)&&s(R,te,w[te],null,J,Q);for(const te in O){if(ds(te))continue;const A=O[te],fe=w[te];A!==fe&&te!=="value"&&s(R,te,fe,A,J,Q)}"value"in O&&s(R,"value",w.value,O.value,J)}},P=(R,w,O,Q,J,te,A,fe,ae)=>{const re=w.el=R?R.el:a(""),le=w.anchor=R?R.anchor:a("");let{patchFlag:M,dynamicChildren:g,slotScopeIds:U}=w;U&&(fe=fe?fe.concat(U):U),R==null?(i(re,O,Q),i(le,O,Q),x(w.children||[],O,le,J,te,A,fe,ae)):M>0&&M&64&&g&&R.dynamicChildren&&R.dynamicChildren.length===g.length?(V(R.dynamicChildren,g,O,J,te,A,fe),(w.key!=null||J&&w===J.subTree)&&xh(R,w,!0)):se(R,w,O,le,J,te,A,fe,ae)},H=(R,w,O,Q,J,te,A,fe,ae)=>{w.slotScopeIds=fe,R==null?w.shapeFlag&512?J.ctx.activate(w,O,Q,A,ae):K(w,O,Q,J,te,A,ae):W(R,w,ae)},K=(R,w,O,Q,J,te,A)=>{const fe=R.component=xg(R,Q,J);if(Qo(R)&&(fe.ctx.renderer=ue),Sg(fe,!1,A),fe.asyncDep){if(J&&J.registerDep(fe,k,A),!R.el){const ae=fe.subTree=ht(Gt);p(null,ae,w,O),R.placeholder=ae.el}}else k(fe,R,w,O,J,te,A)},W=(R,w,O)=>{const Q=w.component=R.component;if(Qm(R,w,O))if(Q.asyncDep&&!Q.asyncResolved){F(Q,w,O);return}else Q.next=w,Q.update();else w.el=R.el,Q.vnode=w},k=(R,w,O,Q,J,te,A)=>{const fe=()=>{if(R.isMounted){let{next:M,bu:g,u:U,parent:X,vnode:ne}=R;{const Fe=Sh(R);if(Fe){M&&(M.el=ne.el,F(R,M,A)),Fe.asyncDep.then(()=>{en(()=>{R.isUnmounted||re()},J)});return}}let q=M,ye;Xi(R,!1),M?(M.el=ne.el,F(R,M,A)):M=ne,g&&xo(g),(ye=M.props&&M.props.onVnodeBeforeUpdate)&&In(ye,X,M,ne),Xi(R,!0);const he=Eu(R),Ie=R.subTree;R.subTree=he,v(Ie,he,d(Ie.el),N(Ie),R,J,te),M.el=he.el,q===null&&eg(R,he.el),U&&en(U,J),(ye=M.props&&M.props.onVnodeUpdated)&&en(()=>In(ye,X,M,ne),J)}else{let M;const{el:g,props:U}=w,{bm:X,m:ne,parent:q,root:ye,type:he}=R,Ie=Nr(w);Xi(R,!1),X&&xo(X),!Ie&&(M=U&&U.onVnodeBeforeMount)&&In(M,q,w),Xi(R,!0);{ye.ce&&ye.ce._hasShadowRoot()&&ye.ce._injectChildStyle(he,R.parent?R.parent.type:void 0);const Fe=R.subTree=Eu(R);v(null,Fe,O,Q,R,J,te),w.el=Fe.el}if(ne&&en(ne,J),!Ie&&(M=U&&U.onVnodeMounted)){const Fe=w;en(()=>In(M,q,Fe),J)}(w.shapeFlag&256||q&&Nr(q.vnode)&&q.vnode.shapeFlag&256)&&R.a&&en(R.a,J),R.isMounted=!0,w=O=Q=null}};R.scope.on();const ae=R.effect=new Sd(fe);R.scope.off();const re=R.update=ae.run.bind(ae),le=R.job=ae.runIfDirty.bind(ae);le.i=R,le.id=R.uid,ae.scheduler=()=>Ic(le),Xi(R,!0),re()},F=(R,w,O)=>{w.component=R;const Q=R.vnode.props;R.vnode=w,R.next=null,ng(R,w.props,Q,O),og(R,w.children,O),pi(),du(R),mi()},se=(R,w,O,Q,J,te,A,fe,ae=!1)=>{const re=R&&R.children,le=R?R.shapeFlag:0,M=w.children,{patchFlag:g,shapeFlag:U}=w;if(g>0){if(g&128){xe(re,M,O,Q,J,te,A,fe,ae);return}else if(g&256){ce(re,M,O,Q,J,te,A,fe,ae);return}}U&8?(le&16&&z(re,J,te),M!==re&&u(O,M)):le&16?U&16?xe(re,M,O,Q,J,te,A,fe,ae):z(re,J,te,!0):(le&8&&u(O,""),U&16&&x(M,O,Q,J,te,A,fe,ae))},ce=(R,w,O,Q,J,te,A,fe,ae)=>{R=R||Ir,w=w||Ir;const re=R.length,le=w.length,M=Math.min(re,le);let g;for(g=0;g<M;g++){const U=w[g]=ae?si(w[g]):Bn(w[g]);v(R[g],U,O,null,J,te,A,fe,ae)}re>le?z(R,J,te,!0,!1,M):x(w,O,Q,J,te,A,fe,ae,M)},xe=(R,w,O,Q,J,te,A,fe,ae)=>{let re=0;const le=w.length;let M=R.length-1,g=le-1;for(;re<=M&&re<=g;){const U=R[re],X=w[re]=ae?si(w[re]):Bn(w[re]);if(nr(U,X))v(U,X,O,null,J,te,A,fe,ae);else break;re++}for(;re<=M&&re<=g;){const U=R[M],X=w[g]=ae?si(w[g]):Bn(w[g]);if(nr(U,X))v(U,X,O,null,J,te,A,fe,ae);else break;M--,g--}if(re>M){if(re<=g){const U=g+1,X=U<le?w[U].el:Q;for(;re<=g;)v(null,w[re]=ae?si(w[re]):Bn(w[re]),O,X,J,te,A,fe,ae),re++}}else if(re>g)for(;re<=M;)_e(R[re],J,te,!0),re++;else{const U=re,X=re,ne=new Map;for(re=X;re<=g;re++){const be=w[re]=ae?si(w[re]):Bn(w[re]);be.key!=null&&ne.set(be.key,re)}let q,ye=0;const he=g-X+1;let Ie=!1,Fe=0;const de=new Array(he);for(re=0;re<he;re++)de[re]=0;for(re=U;re<=M;re++){const be=R[re];if(ye>=he){_e(be,J,te,!0);continue}let we;if(be.key!=null)we=ne.get(be.key);else for(q=X;q<=g;q++)if(de[q-X]===0&&nr(be,w[q])){we=q;break}we===void 0?_e(be,J,te,!0):(de[we-X]=re+1,we>=Fe?Fe=we:Ie=!0,v(be,w[we],O,null,J,te,A,fe,ae),ye++)}const ge=Ie?ug(de):Ir;for(q=ge.length-1,re=he-1;re>=0;re--){const be=X+re,we=w[be],Pe=w[be+1],Xe=be+1<le?Pe.el||Mh(Pe):Q;de[re]===0?v(null,we,O,Xe,J,te,A,fe,ae):Ie&&(q<0||re!==ge[q]?Ee(we,O,Xe,2):q--)}}},Ee=(R,w,O,Q,J=null)=>{const{el:te,type:A,transition:fe,children:ae,shapeFlag:re}=R;if(re&6){Ee(R.component.subTree,w,O,Q);return}if(re&128){R.suspense.move(w,O,Q);return}if(re&64){A.move(R,w,O,ue);return}if(A===Lt){i(te,w,O);for(let M=0;M<ae.length;M++)Ee(ae[M],w,O,Q);i(R.anchor,w,O);return}if(A===Mo){T(R,w,O);return}if(Q!==2&&re&1&&fe)if(Q===0)fe.beforeEnter(te),i(te,w,O),en(()=>fe.enter(te),J);else{const{leave:M,delayLeave:g,afterLeave:U}=fe,X=()=>{R.ctx.isUnmounted?r(te):i(te,w,O)},ne=()=>{te._isLeaving&&te[Fn](!0),M(te,()=>{X(),U&&U()})};g?g(te,X,ne):ne()}else i(te,w,O)},_e=(R,w,O,Q=!1,J=!1)=>{const{type:te,props:A,ref:fe,children:ae,dynamicChildren:re,shapeFlag:le,patchFlag:M,dirs:g,cacheIndex:U}=R;if(M===-2&&(J=!1),fe!=null&&(pi(),gs(fe,null,O,R,!0),mi()),U!=null&&(w.renderCache[U]=void 0),le&256){w.ctx.deactivate(R);return}const X=le&1&&g,ne=!Nr(R);let q;if(ne&&(q=A&&A.onVnodeBeforeUnmount)&&In(q,w,R),le&6)Se(R.component,O,Q);else{if(le&128){R.suspense.unmount(O,Q);return}X&&Wi(R,null,w,"beforeUnmount"),le&64?R.type.remove(R,w,O,ue,Q):re&&!re.hasOnce&&(te!==Lt||M>0&&M&64)?z(re,w,O,!1,!0):(te===Lt&&M&384||!J&&le&16)&&z(ae,w,O),Q&&ze(R)}(ne&&(q=A&&A.onVnodeUnmounted)||X)&&en(()=>{q&&In(q,w,R),X&&Wi(R,null,w,"unmounted")},O)},ze=R=>{const{type:w,el:O,anchor:Q,transition:J}=R;if(w===Lt){je(O,Q);return}if(w===Mo){E(R);return}const te=()=>{r(O),J&&!J.persisted&&J.afterLeave&&J.afterLeave()};if(R.shapeFlag&1&&J&&!J.persisted){const{leave:A,delayLeave:fe}=J,ae=()=>A(O,te);fe?fe(R.el,te,ae):ae()}else te()},je=(R,w)=>{let O;for(;R!==w;)O=f(R),r(R),R=O;r(w)},Se=(R,w,O)=>{const{bum:Q,scope:J,job:te,subTree:A,um:fe,m:ae,a:re}=R;Tu(ae),Tu(re),Q&&xo(Q),J.stop(),te&&(te.flags|=8,_e(A,R,w,O)),fe&&en(fe,w),en(()=>{R.isUnmounted=!0},w)},z=(R,w,O,Q=!1,J=!1,te=0)=>{for(let A=te;A<R.length;A++)_e(R[A],w,O,Q,J)},N=R=>{if(R.shapeFlag&6)return N(R.component.subTree);if(R.shapeFlag&128)return R.suspense.next();const w=f(R.anchor||R.el),O=w&&w[Tm];return O?f(O):w};let j=!1;const oe=(R,w,O)=>{let Q;R==null?w._vnode&&(_e(w._vnode,null,null,!0),Q=w._vnode.component):v(w._vnode||null,R,w,null,null,null,O),w._vnode=R,j||(j=!0,du(Q),zd(),j=!1)},ue={p:v,um:_e,m:Ee,r:ze,mt:K,mc:x,pc:se,pbc:V,n:N,o:t};return{render:oe,hydrate:void 0,createApp:Ym(oe)}}function Ma({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function Xi({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function cg(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function xh(t,e,n=!1){const i=t.children,r=e.children;if(He(i)&&He(r))for(let s=0;s<i.length;s++){const o=i[s];let a=r[s];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=r[s]=si(r[s]),a.el=o.el),!n&&a.patchFlag!==-2&&xh(o,a)),a.type===ia&&(a.patchFlag===-1&&(a=r[s]=si(a)),a.el=o.el),a.type===Gt&&!a.el&&(a.el=o.el)}}function ug(t){const e=t.slice(),n=[0];let i,r,s,o,a;const l=t.length;for(i=0;i<l;i++){const c=t[i];if(c!==0){if(r=n[n.length-1],t[r]<c){e[i]=r,n.push(i);continue}for(s=0,o=n.length-1;s<o;)a=s+o>>1,t[n[a]]<c?s=a+1:o=a;c<t[n[s]]&&(s>0&&(e[i]=n[s-1]),n[s]=i)}}for(s=n.length,o=n[s-1];s-- >0;)n[s]=o,o=e[o];return n}function Sh(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Sh(e)}function Tu(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function Mh(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?Mh(e.subTree):null}const Eh=t=>t.__isSuspense;function fg(t,e){e&&e.pendingBranch?He(t)?e.effects.push(...t):e.effects.push(t):Mm(t)}const Lt=Symbol.for("v-fgt"),ia=Symbol.for("v-txt"),Gt=Symbol.for("v-cmt"),Mo=Symbol.for("v-stc"),vs=[];let ln=null;function gt(t=!1){vs.push(ln=t?null:[])}function dg(){vs.pop(),ln=vs[vs.length-1]||null}let bs=1;function Fo(t,e=!1){bs+=t,t<0&&ln&&e&&(ln.hasOnce=!0)}function yh(t){return t.dynamicChildren=bs>0?ln||Ir:null,dg(),bs>0&&ln&&ln.push(t),t}function Et(t,e,n,i,r,s){return yh(Ae(t,e,n,i,r,s,!0))}function Ts(t,e,n,i,r){return yh(ht(t,e,n,i,r,!0))}function As(t){return t?t.__v_isVNode===!0:!1}function nr(t,e){return t.type===e.type&&t.key===e.key}const bh=({key:t})=>t??null,Eo=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?St(t)||Xt(t)||We(t)?{i:Nt,r:t,k:e,f:!!n}:t:null);function Ae(t,e=null,n=null,i=0,r=null,s=t===Lt?0:1,o=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&bh(e),ref:e&&Eo(e),scopeId:Gd,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Nt};return a?(Fc(l,n),s&128&&t.normalize(l)):n&&(l.shapeFlag|=St(n)?8:16),bs>0&&!o&&ln&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&ln.push(l),l}const ht=hg;function hg(t,e=null,n=null,i=0,r=null,s=!1){if((!t||t===ih)&&(t=Gt),As(t)){const a=Bi(t,e,!0);return n&&Fc(a,n),bs>0&&!s&&ln&&(a.shapeFlag&6?ln[ln.indexOf(t)]=a:ln.push(a)),a.patchFlag=-2,a}if(Tg(t)&&(t=t.__vccOpts),e){e=pg(e);let{class:a,style:l}=e;a&&!St(a)&&(e.class=En(a)),st(l)&&(Dc(l)&&!He(l)&&(l=Ct({},l)),e.style=$o(l))}const o=St(t)?1:Eh(t)?128:Xd(t)?64:st(t)?4:We(t)?2:0;return Ae(t,e,n,i,r,o,s,!0)}function pg(t){return t?Dc(t)||hh(t)?Ct({},t):t:null}function Bi(t,e,n=!1,i=!1){const{props:r,ref:s,patchFlag:o,children:a,transition:l}=t,c=e?gg(r||{},e):r,u={__v_isVNode:!0,__v_skip:!0,type:t.type,props:c,key:c&&bh(c),ref:e&&e.ref?n&&s?He(s)?s.concat(Eo(e)):[s,Eo(e)]:Eo(e):s,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Lt?o===-1?16:o|16:o,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:l,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Bi(t.ssContent),ssFallback:t.ssFallback&&Bi(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return l&&i&&ys(u,l.clone(u)),u}function Ui(t=" ",e=0){return ht(ia,null,t,e)}function mg(t,e){const n=ht(Mo,null,t);return n.staticCount=e,n}function Ea(t="",e=!1){return e?(gt(),Ts(Gt,null,t)):ht(Gt,null,t)}function Bn(t){return t==null||typeof t=="boolean"?ht(Gt):He(t)?ht(Lt,null,t.slice()):As(t)?si(t):ht(ia,null,String(t))}function si(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Bi(t)}function Fc(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(He(e))n=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),Fc(t,r()),r._c&&(r._d=!0));return}else{n=32;const r=e._;!r&&!hh(e)?e._ctx=Nt:r===3&&Nt&&(Nt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else We(e)?(e={default:e,_ctx:Nt},n=32):(e=String(e),i&64?(n=16,e=[Ui(e)]):n=8);t.children=e,t.shapeFlag|=n}function gg(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=En([e.class,i.class]));else if(r==="style")e.style=$o([e.style,i.style]);else if(ko(r)){const s=e[r],o=i[r];o&&s!==o&&!(He(s)&&s.includes(o))&&(e[r]=s?[].concat(s,o):o)}else r!==""&&(e[r]=i[r])}return e}function In(t,e,n,i=null){Cn(t,e,7,[n,i])}const _g=lh();let vg=0;function xg(t,e,n){const i=t.type,r=(e?e.appContext:t.appContext)||_g,s={uid:vg++,vnode:t,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new xd(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:mh(i,r),emitsOptions:ch(i,r),emit:null,emitted:null,propsDefaults:dt,inheritAttrs:i.inheritAttrs,ctx:dt,data:dt,props:dt,attrs:dt,slots:dt,refs:dt,setupState:dt,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=Km.bind(null,s),t.ce&&t.ce(s),s}let kt=null;const Th=()=>kt||Nt;let Oo,Sl;{const t=Yo(),e=(n,i)=>{let r;return(r=t[n])||(r=t[n]=[]),r.push(i),s=>{r.length>1?r.forEach(o=>o(s)):r[0](s)}};Oo=e("__VUE_INSTANCE_SETTERS__",n=>kt=n),Sl=e("__VUE_SSR_SETTERS__",n=>Rs=n)}const Ns=t=>{const e=kt;return Oo(t),t.scope.on(),()=>{t.scope.off(),Oo(e)}},Au=()=>{kt&&kt.scope.off(),Oo(null)};function Ah(t){return t.vnode.shapeFlag&4}let Rs=!1;function Sg(t,e=!1,n=!1){e&&Sl(e);const{props:i,children:r}=t.vnode,s=Ah(t);tg(t,i,s,e),sg(t,r,n||e);const o=s?Mg(t,e):void 0;return e&&Sl(!1),o}function Mg(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,zm);const{setup:i}=n;if(i){pi();const r=t.setupContext=i.length>1?yg(t):null,s=Ns(t),o=Us(i,t,0,[t.props,r]),a=dd(o);if(mi(),s(),(a||t.sp)&&!Nr(t)&&Jd(t),a){if(o.then(Au,Au),e)return o.then(l=>{Ru(t,l)}).catch(l=>{Zo(l,t,0)});t.asyncDep=o}else Ru(t,o)}else Rh(t)}function Ru(t,e,n){We(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:st(e)&&(t.setupState=Od(e)),Rh(t)}function Rh(t,e,n){const i=t.type;t.render||(t.render=i.render||kn);{const r=Ns(t);pi();try{Hm(t)}finally{mi(),r()}}}const Eg={get(t,e){return Ht(t,"get",""),t[e]}};function yg(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,Eg),slots:t.slots,emit:t.emit,expose:e}}function ra(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(Od(Nd(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in _s)return _s[n](t)},has(e,n){return n in e||n in _s}})):t.proxy}function bg(t,e=!0){return We(t)?t.displayName||t.name:t.name||e&&t.__name}function Tg(t){return We(t)&&"__vccOpts"in t}const yt=(t,e)=>gm(t,e,Rs);function Oc(t,e,n){try{Fo(-1);const i=arguments.length;return i===2?st(e)&&!He(e)?As(e)?ht(t,null,[e]):ht(t,e):ht(t,null,e):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&As(n)&&(n=[n]),ht(t,e,n))}finally{Fo(1)}}const Ag="3.5.30";/**
* @vue/runtime-dom v3.5.30
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Ml;const Cu=typeof window<"u"&&window.trustedTypes;if(Cu)try{Ml=Cu.createPolicy("vue",{createHTML:t=>t})}catch{}const Ch=Ml?t=>Ml.createHTML(t):t=>t,Rg="http://www.w3.org/2000/svg",Cg="http://www.w3.org/1998/Math/MathML",ri=typeof document<"u"?document:null,wu=ri&&ri.createElement("template"),wg={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const r=e==="svg"?ri.createElementNS(Rg,t):e==="mathml"?ri.createElementNS(Cg,t):n?ri.createElement(t,{is:n}):ri.createElement(t);return t==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:t=>ri.createTextNode(t),createComment:t=>ri.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>ri.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,r,s){const o=n?n.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{wu.innerHTML=Ch(i==="svg"?`<svg>${t}</svg>`:i==="mathml"?`<math>${t}</math>`:t);const a=wu.content;if(i==="svg"||i==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}e.insertBefore(a,n)}return[o?o.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},bi="transition",es="animation",Cs=Symbol("_vtc"),wh={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},Pg=Ct({},qd,wh),Dg=t=>(t.displayName="Transition",t.props=Pg,t),Ig=Dg((t,{slots:e})=>Oc(Cm,Lg(t),e)),qi=(t,e=[])=>{He(t)?t.forEach(n=>n(...e)):t&&t(...e)},Pu=t=>t?He(t)?t.some(e=>e.length>1):t.length>1:!1;function Lg(t){const e={};for(const P in t)P in wh||(e[P]=t[P]);if(t.css===!1)return e;const{name:n="v",type:i,duration:r,enterFromClass:s=`${n}-enter-from`,enterActiveClass:o=`${n}-enter-active`,enterToClass:a=`${n}-enter-to`,appearFromClass:l=s,appearActiveClass:c=o,appearToClass:u=a,leaveFromClass:d=`${n}-leave-from`,leaveActiveClass:f=`${n}-leave-active`,leaveToClass:h=`${n}-leave-to`}=t,_=Ug(r),v=_&&_[0],m=_&&_[1],{onBeforeEnter:p,onEnter:S,onEnterCancelled:T,onLeave:E,onLeaveCancelled:I,onBeforeAppear:D=p,onAppear:L=S,onAppearCancelled:x=T}=e,b=(P,H,K,W)=>{P._enterCancelled=W,Yi(P,H?u:a),Yi(P,H?c:o),K&&K()},V=(P,H)=>{P._isLeaving=!1,Yi(P,d),Yi(P,h),Yi(P,f),H&&H()},C=P=>(H,K)=>{const W=P?L:S,k=()=>b(H,P,K);qi(W,[H,k]),Du(()=>{Yi(H,P?l:s),Zn(H,P?u:a),Pu(W)||Iu(H,i,v,k)})};return Ct(e,{onBeforeEnter(P){qi(p,[P]),Zn(P,s),Zn(P,o)},onBeforeAppear(P){qi(D,[P]),Zn(P,l),Zn(P,c)},onEnter:C(!1),onAppear:C(!0),onLeave(P,H){P._isLeaving=!0;const K=()=>V(P,H);Zn(P,d),P._enterCancelled?(Zn(P,f),Nu(P)):(Nu(P),Zn(P,f)),Du(()=>{P._isLeaving&&(Yi(P,d),Zn(P,h),Pu(E)||Iu(P,i,m,K))}),qi(E,[P,K])},onEnterCancelled(P){b(P,!1,void 0,!0),qi(T,[P])},onAppearCancelled(P){b(P,!0,void 0,!0),qi(x,[P])},onLeaveCancelled(P){V(P),qi(I,[P])}})}function Ug(t){if(t==null)return null;if(st(t))return[ya(t.enter),ya(t.leave)];{const e=ya(t);return[e,e]}}function ya(t){return Bp(t)}function Zn(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t[Cs]||(t[Cs]=new Set)).add(e)}function Yi(t,e){e.split(/\s+/).forEach(i=>i&&t.classList.remove(i));const n=t[Cs];n&&(n.delete(e),n.size||(t[Cs]=void 0))}function Du(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let Ng=0;function Iu(t,e,n,i){const r=t._endId=++Ng,s=()=>{r===t._endId&&i()};if(n!=null)return setTimeout(s,n);const{type:o,timeout:a,propCount:l}=Fg(t,e);if(!o)return i();const c=o+"end";let u=0;const d=()=>{t.removeEventListener(c,f),s()},f=h=>{h.target===t&&++u>=l&&d()};setTimeout(()=>{u<l&&d()},a+1),t.addEventListener(c,f)}function Fg(t,e){const n=window.getComputedStyle(t),i=_=>(n[_]||"").split(", "),r=i(`${bi}Delay`),s=i(`${bi}Duration`),o=Lu(r,s),a=i(`${es}Delay`),l=i(`${es}Duration`),c=Lu(a,l);let u=null,d=0,f=0;e===bi?o>0&&(u=bi,d=o,f=s.length):e===es?c>0&&(u=es,d=c,f=l.length):(d=Math.max(o,c),u=d>0?o>c?bi:es:null,f=u?u===bi?s.length:l.length:0);const h=u===bi&&/\b(?:transform|all)(?:,|$)/.test(i(`${bi}Property`).toString());return{type:u,timeout:d,propCount:f,hasTransform:h}}function Lu(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,i)=>Uu(n)+Uu(t[i])))}function Uu(t){return t==="auto"?0:Number(t.slice(0,-1).replace(",","."))*1e3}function Nu(t){return(t?t.ownerDocument:document).body.offsetHeight}function Og(t,e,n){const i=t[Cs];i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const Fu=Symbol("_vod"),Bg=Symbol("_vsh"),Vg=Symbol(""),zg=/(?:^|;)\s*display\s*:/;function Hg(t,e,n){const i=t.style,r=St(n);let s=!1;if(n&&!r){if(e)if(St(e))for(const o of e.split(";")){const a=o.slice(0,o.indexOf(":")).trim();n[a]==null&&yo(i,a,"")}else for(const o in e)n[o]==null&&yo(i,o,"");for(const o in n)o==="display"&&(s=!0),yo(i,o,n[o])}else if(r){if(e!==n){const o=i[Vg];o&&(n+=";"+o),i.cssText=n,s=zg.test(n)}}else e&&t.removeAttribute("style");Fu in t&&(t[Fu]=s?i.display:"",t[Bg]&&(i.display="none"))}const Ou=/\s*!important$/;function yo(t,e,n){if(He(n))n.forEach(i=>yo(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const i=Gg(t,e);Ou.test(n)?t.setProperty(dr(i),n.replace(Ou,""),"important"):t[i]=n}}const Bu=["Webkit","Moz","ms"],ba={};function Gg(t,e){const n=ba[e];if(n)return n;let i=Jt(e);if(i!=="filter"&&i in t)return ba[e]=i;i=Xo(i);for(let r=0;r<Bu.length;r++){const s=Bu[r]+i;if(s in t)return ba[e]=s}return e}const Vu="http://www.w3.org/1999/xlink";function zu(t,e,n,i,r,s=Wp(e)){i&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Vu,e.slice(6,e.length)):t.setAttributeNS(Vu,e,n):n==null||s&&!gd(n)?t.removeAttribute(e):t.setAttribute(e,s?"":An(n)?String(n):n)}function Hu(t,e,n,i,r){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?Ch(n):n);return}const s=t.tagName;if(e==="value"&&s!=="PROGRESS"&&!s.includes("-")){const a=s==="OPTION"?t.getAttribute("value")||"":t.value,l=n==null?t.type==="checkbox"?"on":"":String(n);(a!==l||!("_value"in t))&&(t.value=l),n==null&&t.removeAttribute(e),t._value=n;return}let o=!1;if(n===""||n==null){const a=typeof t[e];a==="boolean"?n=gd(n):n==null&&a==="string"?(n="",o=!0):a==="number"&&(n=0,o=!0)}try{t[e]=n}catch{}o&&t.removeAttribute(r||e)}function li(t,e,n,i){t.addEventListener(e,n,i)}function kg(t,e,n,i){t.removeEventListener(e,n,i)}const Gu=Symbol("_vei");function Wg(t,e,n,i,r=null){const s=t[Gu]||(t[Gu]={}),o=s[e];if(i&&o)o.value=i;else{const[a,l]=Xg(e);if(i){const c=s[e]=$g(i,r);li(t,a,c,l)}else o&&(kg(t,a,o,l),s[e]=void 0)}}const ku=/(?:Once|Passive|Capture)$/;function Xg(t){let e;if(ku.test(t)){e={};let i;for(;i=t.match(ku);)t=t.slice(0,t.length-i[0].length),e[i[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):dr(t.slice(2)),e]}let Ta=0;const qg=Promise.resolve(),Yg=()=>Ta||(qg.then(()=>Ta=0),Ta=Date.now());function $g(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;Cn(Kg(i,n.value),e,5,[i])};return n.value=t,n.attached=Yg(),n}function Kg(t,e){if(He(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const Wu=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,jg=(t,e,n,i,r,s)=>{const o=r==="svg";e==="class"?Og(t,i,o):e==="style"?Hg(t,n,i):ko(e)?Mc(e)||Wg(t,e,n,i,s):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Zg(t,e,i,o))?(Hu(t,e,i),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&zu(t,e,i,o,s,e!=="value")):t._isVueCE&&(Jg(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!St(i)))?Hu(t,Jt(e),i,s,e):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),zu(t,e,i,o))};function Zg(t,e,n,i){if(i)return!!(e==="innerHTML"||e==="textContent"||e in t&&Wu(e)&&We(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const r=t.tagName;if(r==="IMG"||r==="VIDEO"||r==="CANVAS"||r==="SOURCE")return!1}return Wu(e)&&St(n)?!1:e in t}function Jg(t,e){const n=t._def.props;if(!n)return!1;const i=Jt(e);return Array.isArray(n)?n.some(r=>Jt(r)===i):Object.keys(n).some(r=>Jt(r)===i)}const Vi=t=>{const e=t.props["onUpdate:modelValue"]||!1;return He(e)?n=>xo(e,n):e};function Qg(t){t.target.composing=!0}function Xu(t){const e=t.target;e.composing&&(e.composing=!1,e.dispatchEvent(new Event("input")))}const pn=Symbol("_assign");function qu(t,e,n){return e&&(t=t.trim()),n&&(t=qo(t)),t}const Bo={created(t,{modifiers:{lazy:e,trim:n,number:i}},r){t[pn]=Vi(r);const s=i||r.props&&r.props.type==="number";li(t,e?"change":"input",o=>{o.target.composing||t[pn](qu(t.value,n,s))}),(n||s)&&li(t,"change",()=>{t.value=qu(t.value,n,s)}),e||(li(t,"compositionstart",Qg),li(t,"compositionend",Xu),li(t,"change",Xu))},mounted(t,{value:e}){t.value=e??""},beforeUpdate(t,{value:e,oldValue:n,modifiers:{lazy:i,trim:r,number:s}},o){if(t[pn]=Vi(o),t.composing)return;const a=(s||t.type==="number")&&!/^0\d/.test(t.value)?qo(t.value):t.value,l=e??"";a!==l&&(document.activeElement===t&&t.type!=="range"&&(i&&e===n||r&&t.value.trim()===l)||(t.value=l))}},e_={deep:!0,created(t,e,n){t[pn]=Vi(n),li(t,"change",()=>{const i=t._modelValue,r=zr(t),s=t.checked,o=t[pn];if(He(i)){const a=bc(i,r),l=a!==-1;if(s&&!l)o(i.concat(r));else if(!s&&l){const c=[...i];c.splice(a,1),o(c)}}else if($r(i)){const a=new Set(i);s?a.add(r):a.delete(r),o(a)}else o(Ph(t,s))})},mounted:Yu,beforeUpdate(t,e,n){t[pn]=Vi(n),Yu(t,e,n)}};function Yu(t,{value:e,oldValue:n},i){t._modelValue=e;let r;if(He(e))r=bc(e,i.props.value)>-1;else if($r(e))r=e.has(i.props.value);else{if(e===n)return;r=Oi(e,Ph(t,!0))}t.checked!==r&&(t.checked=r)}const t_={created(t,{value:e},n){t.checked=Oi(e,n.props.value),t[pn]=Vi(n),li(t,"change",()=>{t[pn](zr(t))})},beforeUpdate(t,{value:e,oldValue:n},i){t[pn]=Vi(i),e!==n&&(t.checked=Oi(e,i.props.value))}},n_={deep:!0,created(t,{value:e,modifiers:{number:n}},i){const r=$r(e);li(t,"change",()=>{const s=Array.prototype.filter.call(t.options,o=>o.selected).map(o=>n?qo(zr(o)):zr(o));t[pn](t.multiple?r?new Set(s):s:s[0]),t._assigning=!0,Jo(()=>{t._assigning=!1})}),t[pn]=Vi(i)},mounted(t,{value:e}){$u(t,e)},beforeUpdate(t,e,n){t[pn]=Vi(n)},updated(t,{value:e}){t._assigning||$u(t,e)}};function $u(t,e){const n=t.multiple,i=He(e);if(!(n&&!i&&!$r(e))){for(let r=0,s=t.options.length;r<s;r++){const o=t.options[r],a=zr(o);if(n)if(i){const l=typeof a;l==="string"||l==="number"?o.selected=e.some(c=>String(c)===String(a)):o.selected=bc(e,a)>-1}else o.selected=e.has(a);else if(Oi(zr(o),e)){t.selectedIndex!==r&&(t.selectedIndex=r);return}}!n&&t.selectedIndex!==-1&&(t.selectedIndex=-1)}}function zr(t){return"_value"in t?t._value:t.value}function Ph(t,e){const n=e?"_trueValue":"_falseValue";return n in t?t[n]:e}const Ku={created(t,e,n){qs(t,e,n,null,"created")},mounted(t,e,n){qs(t,e,n,null,"mounted")},beforeUpdate(t,e,n,i){qs(t,e,n,i,"beforeUpdate")},updated(t,e,n,i){qs(t,e,n,i,"updated")}};function i_(t,e){switch(t){case"SELECT":return n_;case"TEXTAREA":return Bo;default:switch(e){case"checkbox":return e_;case"radio":return t_;default:return Bo}}}function qs(t,e,n,i,r){const o=i_(t.tagName,n.props&&n.props.type)[r];o&&o(t,e,n,i)}const r_=["ctrl","shift","alt","meta"],s_={stop:t=>t.stopPropagation(),prevent:t=>t.preventDefault(),self:t=>t.target!==t.currentTarget,ctrl:t=>!t.ctrlKey,shift:t=>!t.shiftKey,alt:t=>!t.altKey,meta:t=>!t.metaKey,left:t=>"button"in t&&t.button!==0,middle:t=>"button"in t&&t.button!==1,right:t=>"button"in t&&t.button!==2,exact:(t,e)=>r_.some(n=>t[`${n}Key`]&&!e.includes(n))},o_=(t,e)=>{if(!t)return t;const n=t._withMods||(t._withMods={}),i=e.join(".");return n[i]||(n[i]=(r,...s)=>{for(let o=0;o<e.length;o++){const a=s_[e[o]];if(a&&a(r,e))return}return t(r,...s)})},a_=Ct({patchProp:jg},wg);let ju;function l_(){return ju||(ju=ag(a_))}const c_=(...t)=>{const e=l_().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=f_(i);if(!r)return;const s=e._component;!We(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.nodeType===1&&(r.textContent="");const o=n(r,!1,u_(r));return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),o},e};function u_(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function f_(t){return St(t)?document.querySelector(t):t}/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const d_=Symbol();var Zu;(function(t){t.direct="direct",t.patchObject="patch object",t.patchFunction="patch function"})(Zu||(Zu={}));function h_(){const t=qp(!0),e=t.run(()=>vt({}));let n=[],i=[];const r=Nd({install(s){r._a=s,s.provide(d_,r),s.config.globalProperties.$pinia=r,i.forEach(o=>n.push(o)),i=[]},use(s){return this._a?n.push(s):i.push(s),this},_p:n,_a:null,_e:t,_s:new Map,state:e});return r}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const Dr=typeof document<"u";function Dh(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function p_(t){return t.__esModule||t[Symbol.toStringTag]==="Module"||t.default&&Dh(t.default)}const it=Object.assign;function Aa(t,e){const n={};for(const i in e){const r=e[i];n[i]=wn(r)?r.map(t):t(r)}return n}const xs=()=>{},wn=Array.isArray;function Ju(t,e){const n={};for(const i in t)n[i]=i in e?e[i]:t[i];return n}const Ih=/#/g,m_=/&/g,g_=/\//g,__=/=/g,v_=/\?/g,Lh=/\+/g,x_=/%5B/g,S_=/%5D/g,Uh=/%5E/g,M_=/%60/g,Nh=/%7B/g,E_=/%7C/g,Fh=/%7D/g,y_=/%20/g;function Bc(t){return t==null?"":encodeURI(""+t).replace(E_,"|").replace(x_,"[").replace(S_,"]")}function b_(t){return Bc(t).replace(Nh,"{").replace(Fh,"}").replace(Uh,"^")}function El(t){return Bc(t).replace(Lh,"%2B").replace(y_,"+").replace(Ih,"%23").replace(m_,"%26").replace(M_,"`").replace(Nh,"{").replace(Fh,"}").replace(Uh,"^")}function T_(t){return El(t).replace(__,"%3D")}function A_(t){return Bc(t).replace(Ih,"%23").replace(v_,"%3F")}function R_(t){return A_(t).replace(g_,"%2F")}function ws(t){if(t==null)return null;try{return decodeURIComponent(""+t)}catch{}return""+t}const C_=/\/$/,w_=t=>t.replace(C_,"");function Ra(t,e,n="/"){let i,r={},s="",o="";const a=e.indexOf("#");let l=e.indexOf("?");return l=a>=0&&l>a?-1:l,l>=0&&(i=e.slice(0,l),s=e.slice(l,a>0?a:e.length),r=t(s.slice(1))),a>=0&&(i=i||e.slice(0,a),o=e.slice(a,e.length)),i=L_(i??e,n),{fullPath:i+s+o,path:i,query:r,hash:ws(o)}}function P_(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function Qu(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function D_(t,e,n){const i=e.matched.length-1,r=n.matched.length-1;return i>-1&&i===r&&Hr(e.matched[i],n.matched[r])&&Oh(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function Hr(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function Oh(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(var n in t)if(!I_(t[n],e[n]))return!1;return!0}function I_(t,e){return wn(t)?ef(t,e):wn(e)?ef(e,t):(t==null?void 0:t.valueOf())===(e==null?void 0:e.valueOf())}function ef(t,e){return wn(e)?t.length===e.length&&t.every((n,i)=>n===e[i]):t.length===1&&t[0]===e}function L_(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),i=t.split("/"),r=i[i.length-1];(r===".."||r===".")&&i.push("");let s=n.length-1,o,a;for(o=0;o<i.length;o++)if(a=i[o],a!==".")if(a==="..")s>1&&s--;else break;return n.slice(0,s).join("/")+"/"+i.slice(o).join("/")}const Ti={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let yl=function(t){return t.pop="pop",t.push="push",t}({}),Ca=function(t){return t.back="back",t.forward="forward",t.unknown="",t}({});function U_(t){if(!t)if(Dr){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),w_(t)}const N_=/^[^#]+#/;function F_(t,e){return t.replace(N_,"#")+e}function O_(t,e){const n=document.documentElement.getBoundingClientRect(),i=t.getBoundingClientRect();return{behavior:e.behavior,left:i.left-n.left-(e.left||0),top:i.top-n.top-(e.top||0)}}const sa=()=>({left:window.scrollX,top:window.scrollY});function B_(t){let e;if("el"in t){const n=t.el,i=typeof n=="string"&&n.startsWith("#"),r=typeof n=="string"?i?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!r)return;e=O_(r,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.scrollX,e.top!=null?e.top:window.scrollY)}function tf(t,e){return(history.state?history.state.position-e:-1)+t}const bl=new Map;function V_(t,e){bl.set(t,e)}function z_(t){const e=bl.get(t);return bl.delete(t),e}function H_(t){return typeof t=="string"||t&&typeof t=="object"}function Bh(t){return typeof t=="string"||typeof t=="symbol"}let xt=function(t){return t[t.MATCHER_NOT_FOUND=1]="MATCHER_NOT_FOUND",t[t.NAVIGATION_GUARD_REDIRECT=2]="NAVIGATION_GUARD_REDIRECT",t[t.NAVIGATION_ABORTED=4]="NAVIGATION_ABORTED",t[t.NAVIGATION_CANCELLED=8]="NAVIGATION_CANCELLED",t[t.NAVIGATION_DUPLICATED=16]="NAVIGATION_DUPLICATED",t}({});const Vh=Symbol("");xt.MATCHER_NOT_FOUND+"",xt.NAVIGATION_GUARD_REDIRECT+"",xt.NAVIGATION_ABORTED+"",xt.NAVIGATION_CANCELLED+"",xt.NAVIGATION_DUPLICATED+"";function Gr(t,e){return it(new Error,{type:t,[Vh]:!0},e)}function Jn(t,e){return t instanceof Error&&Vh in t&&(e==null||!!(t.type&e))}const G_=["params","query","hash"];function k_(t){if(typeof t=="string")return t;if(t.path!=null)return t.path;const e={};for(const n of G_)n in t&&(e[n]=t[n]);return JSON.stringify(e,null,2)}function W_(t){const e={};if(t===""||t==="?")return e;const n=(t[0]==="?"?t.slice(1):t).split("&");for(let i=0;i<n.length;++i){const r=n[i].replace(Lh," "),s=r.indexOf("="),o=ws(s<0?r:r.slice(0,s)),a=s<0?null:ws(r.slice(s+1));if(o in e){let l=e[o];wn(l)||(l=e[o]=[l]),l.push(a)}else e[o]=a}return e}function nf(t){let e="";for(let n in t){const i=t[n];if(n=T_(n),i==null){i!==void 0&&(e+=(e.length?"&":"")+n);continue}(wn(i)?i.map(r=>r&&El(r)):[i&&El(i)]).forEach(r=>{r!==void 0&&(e+=(e.length?"&":"")+n,r!=null&&(e+="="+r))})}return e}function X_(t){const e={};for(const n in t){const i=t[n];i!==void 0&&(e[n]=wn(i)?i.map(r=>r==null?null:""+r):i==null?i:""+i)}return e}const q_=Symbol(""),rf=Symbol(""),oa=Symbol(""),Vc=Symbol(""),Tl=Symbol("");function ts(){let t=[];function e(i){return t.push(i),()=>{const r=t.indexOf(i);r>-1&&t.splice(r,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function Li(t,e,n,i,r,s=o=>o()){const o=i&&(i.enterCallbacks[r]=i.enterCallbacks[r]||[]);return()=>new Promise((a,l)=>{const c=f=>{f===!1?l(Gr(xt.NAVIGATION_ABORTED,{from:n,to:e})):f instanceof Error?l(f):H_(f)?l(Gr(xt.NAVIGATION_GUARD_REDIRECT,{from:e,to:f})):(o&&i.enterCallbacks[r]===o&&typeof f=="function"&&o.push(f),a())},u=s(()=>t.call(i&&i.instances[r],e,n,c));let d=Promise.resolve(u);t.length<3&&(d=d.then(c)),d.catch(f=>l(f))})}function wa(t,e,n,i,r=s=>s()){const s=[];for(const o of t)for(const a in o.components){let l=o.components[a];if(!(e!=="beforeRouteEnter"&&!o.instances[a]))if(Dh(l)){const c=(l.__vccOpts||l)[e];c&&s.push(Li(c,n,i,o,a,r))}else{let c=l();s.push(()=>c.then(u=>{if(!u)throw new Error(`Couldn't resolve component "${a}" at "${o.path}"`);const d=p_(u)?u.default:u;o.mods[a]=u,o.components[a]=d;const f=(d.__vccOpts||d)[e];return f&&Li(f,n,i,o,a,r)()}))}}return s}function Y_(t,e){const n=[],i=[],r=[],s=Math.max(e.matched.length,t.matched.length);for(let o=0;o<s;o++){const a=e.matched[o];a&&(t.matched.find(c=>Hr(c,a))?i.push(a):n.push(a));const l=t.matched[o];l&&(e.matched.find(c=>Hr(c,l))||r.push(l))}return[n,i,r]}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let $_=()=>location.protocol+"//"+location.host;function zh(t,e){const{pathname:n,search:i,hash:r}=e,s=t.indexOf("#");if(s>-1){let o=r.includes(t.slice(s))?t.slice(s).length:1,a=r.slice(o);return a[0]!=="/"&&(a="/"+a),Qu(a,"")}return Qu(n,t)+i+r}function K_(t,e,n,i){let r=[],s=[],o=null;const a=({state:f})=>{const h=zh(t,location),_=n.value,v=e.value;let m=0;if(f){if(n.value=h,e.value=f,o&&o===_){o=null;return}m=v?f.position-v.position:0}else i(h);r.forEach(p=>{p(n.value,_,{delta:m,type:yl.pop,direction:m?m>0?Ca.forward:Ca.back:Ca.unknown})})};function l(){o=n.value}function c(f){r.push(f);const h=()=>{const _=r.indexOf(f);_>-1&&r.splice(_,1)};return s.push(h),h}function u(){if(document.visibilityState==="hidden"){const{history:f}=window;if(!f.state)return;f.replaceState(it({},f.state,{scroll:sa()}),"")}}function d(){for(const f of s)f();s=[],window.removeEventListener("popstate",a),window.removeEventListener("pagehide",u),document.removeEventListener("visibilitychange",u)}return window.addEventListener("popstate",a),window.addEventListener("pagehide",u),document.addEventListener("visibilitychange",u),{pauseListeners:l,listen:c,destroy:d}}function sf(t,e,n,i=!1,r=!1){return{back:t,current:e,forward:n,replaced:i,position:window.history.length,scroll:r?sa():null}}function j_(t){const{history:e,location:n}=window,i={value:zh(t,n)},r={value:e.state};r.value||s(i.value,{back:null,current:i.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function s(l,c,u){const d=t.indexOf("#"),f=d>-1?(n.host&&document.querySelector("base")?t:t.slice(d))+l:$_()+t+l;try{e[u?"replaceState":"pushState"](c,"",f),r.value=c}catch(h){console.error(h),n[u?"replace":"assign"](f)}}function o(l,c){s(l,it({},e.state,sf(r.value.back,l,r.value.forward,!0),c,{position:r.value.position}),!0),i.value=l}function a(l,c){const u=it({},r.value,e.state,{forward:l,scroll:sa()});s(u.current,u,!0),s(l,it({},sf(i.value,l,null),{position:u.position+1},c),!1),i.value=l}return{location:i,state:r,push:a,replace:o}}function Z_(t){t=U_(t);const e=j_(t),n=K_(t,e.state,e.location,e.replace);function i(s,o=!0){o||n.pauseListeners(),history.go(s)}const r=it({location:"",base:t,go:i,createHref:F_.bind(null,t)},e,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>e.state.value}),r}let sr=function(t){return t[t.Static=0]="Static",t[t.Param=1]="Param",t[t.Group=2]="Group",t}({});var Rt=function(t){return t[t.Static=0]="Static",t[t.Param=1]="Param",t[t.ParamRegExp=2]="ParamRegExp",t[t.ParamRegExpEnd=3]="ParamRegExpEnd",t[t.EscapeNext=4]="EscapeNext",t}(Rt||{});const J_={type:sr.Static,value:""},Q_=/[a-zA-Z0-9_]/;function e0(t){if(!t)return[[]];if(t==="/")return[[J_]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(h){throw new Error(`ERR (${n})/"${c}": ${h}`)}let n=Rt.Static,i=n;const r=[];let s;function o(){s&&r.push(s),s=[]}let a=0,l,c="",u="";function d(){c&&(n===Rt.Static?s.push({type:sr.Static,value:c}):n===Rt.Param||n===Rt.ParamRegExp||n===Rt.ParamRegExpEnd?(s.length>1&&(l==="*"||l==="+")&&e(`A repeatable param (${c}) must be alone in its segment. eg: '/:ids+.`),s.push({type:sr.Param,value:c,regexp:u,repeatable:l==="*"||l==="+",optional:l==="*"||l==="?"})):e("Invalid state to consume buffer"),c="")}function f(){c+=l}for(;a<t.length;){if(l=t[a++],l==="\\"&&n!==Rt.ParamRegExp){i=n,n=Rt.EscapeNext;continue}switch(n){case Rt.Static:l==="/"?(c&&d(),o()):l===":"?(d(),n=Rt.Param):f();break;case Rt.EscapeNext:f(),n=i;break;case Rt.Param:l==="("?n=Rt.ParamRegExp:Q_.test(l)?f():(d(),n=Rt.Static,l!=="*"&&l!=="?"&&l!=="+"&&a--);break;case Rt.ParamRegExp:l===")"?u[u.length-1]=="\\"?u=u.slice(0,-1)+l:n=Rt.ParamRegExpEnd:u+=l;break;case Rt.ParamRegExpEnd:d(),n=Rt.Static,l!=="*"&&l!=="?"&&l!=="+"&&a--,u="";break;default:e("Unknown state");break}}return n===Rt.ParamRegExp&&e(`Unfinished custom RegExp for param "${c}"`),d(),o(),r}const of="[^/]+?",t0={sensitive:!1,strict:!1,start:!0,end:!0};var jt=function(t){return t[t._multiplier=10]="_multiplier",t[t.Root=90]="Root",t[t.Segment=40]="Segment",t[t.SubSegment=30]="SubSegment",t[t.Static=40]="Static",t[t.Dynamic=20]="Dynamic",t[t.BonusCustomRegExp=10]="BonusCustomRegExp",t[t.BonusWildcard=-50]="BonusWildcard",t[t.BonusRepeatable=-20]="BonusRepeatable",t[t.BonusOptional=-8]="BonusOptional",t[t.BonusStrict=.7000000000000001]="BonusStrict",t[t.BonusCaseSensitive=.25]="BonusCaseSensitive",t}(jt||{});const n0=/[.+*?^${}()[\]/\\]/g;function i0(t,e){const n=it({},t0,e),i=[];let r=n.start?"^":"";const s=[];for(const c of t){const u=c.length?[]:[jt.Root];n.strict&&!c.length&&(r+="/");for(let d=0;d<c.length;d++){const f=c[d];let h=jt.Segment+(n.sensitive?jt.BonusCaseSensitive:0);if(f.type===sr.Static)d||(r+="/"),r+=f.value.replace(n0,"\\$&"),h+=jt.Static;else if(f.type===sr.Param){const{value:_,repeatable:v,optional:m,regexp:p}=f;s.push({name:_,repeatable:v,optional:m});const S=p||of;if(S!==of){h+=jt.BonusCustomRegExp;try{`${S}`}catch(E){throw new Error(`Invalid custom RegExp for param "${_}" (${S}): `+E.message)}}let T=v?`((?:${S})(?:/(?:${S}))*)`:`(${S})`;d||(T=m&&c.length<2?`(?:/${T})`:"/"+T),m&&(T+="?"),r+=T,h+=jt.Dynamic,m&&(h+=jt.BonusOptional),v&&(h+=jt.BonusRepeatable),S===".*"&&(h+=jt.BonusWildcard)}u.push(h)}i.push(u)}if(n.strict&&n.end){const c=i.length-1;i[c][i[c].length-1]+=jt.BonusStrict}n.strict||(r+="/?"),n.end?r+="$":n.strict&&!r.endsWith("/")&&(r+="(?:/|$)");const o=new RegExp(r,n.sensitive?"":"i");function a(c){const u=c.match(o),d={};if(!u)return null;for(let f=1;f<u.length;f++){const h=u[f]||"",_=s[f-1];d[_.name]=h&&_.repeatable?h.split("/"):h}return d}function l(c){let u="",d=!1;for(const f of t){(!d||!u.endsWith("/"))&&(u+="/"),d=!1;for(const h of f)if(h.type===sr.Static)u+=h.value;else if(h.type===sr.Param){const{value:_,repeatable:v,optional:m}=h,p=_ in c?c[_]:"";if(wn(p)&&!v)throw new Error(`Provided param "${_}" is an array but it is not repeatable (* or + modifiers)`);const S=wn(p)?p.join("/"):p;if(!S)if(m)f.length<2&&(u.endsWith("/")?u=u.slice(0,-1):d=!0);else throw new Error(`Missing required param "${_}"`);u+=S}}return u||"/"}return{re:o,score:i,keys:s,parse:a,stringify:l}}function r0(t,e){let n=0;for(;n<t.length&&n<e.length;){const i=e[n]-t[n];if(i)return i;n++}return t.length<e.length?t.length===1&&t[0]===jt.Static+jt.Segment?-1:1:t.length>e.length?e.length===1&&e[0]===jt.Static+jt.Segment?1:-1:0}function Hh(t,e){let n=0;const i=t.score,r=e.score;for(;n<i.length&&n<r.length;){const s=r0(i[n],r[n]);if(s)return s;n++}if(Math.abs(r.length-i.length)===1){if(af(i))return 1;if(af(r))return-1}return r.length-i.length}function af(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const s0={strict:!1,end:!0,sensitive:!1};function o0(t,e,n){const i=i0(e0(t.path),n),r=it(i,{record:t,parent:e,children:[],alias:[]});return e&&!r.record.aliasOf==!e.record.aliasOf&&e.children.push(r),r}function a0(t,e){const n=[],i=new Map;e=Ju(s0,e);function r(d){return i.get(d)}function s(d,f,h){const _=!h,v=cf(d);v.aliasOf=h&&h.record;const m=Ju(e,d),p=[v];if("alias"in d){const E=typeof d.alias=="string"?[d.alias]:d.alias;for(const I of E)p.push(cf(it({},v,{components:h?h.record.components:v.components,path:I,aliasOf:h?h.record:v})))}let S,T;for(const E of p){const{path:I}=E;if(f&&I[0]!=="/"){const D=f.record.path,L=D[D.length-1]==="/"?"":"/";E.path=f.record.path+(I&&L+I)}if(S=o0(E,f,m),h?h.alias.push(S):(T=T||S,T!==S&&T.alias.push(S),_&&d.name&&!uf(S)&&o(d.name)),Gh(S)&&l(S),v.children){const D=v.children;for(let L=0;L<D.length;L++)s(D[L],S,h&&h.children[L])}h=h||S}return T?()=>{o(T)}:xs}function o(d){if(Bh(d)){const f=i.get(d);f&&(i.delete(d),n.splice(n.indexOf(f),1),f.children.forEach(o),f.alias.forEach(o))}else{const f=n.indexOf(d);f>-1&&(n.splice(f,1),d.record.name&&i.delete(d.record.name),d.children.forEach(o),d.alias.forEach(o))}}function a(){return n}function l(d){const f=u0(d,n);n.splice(f,0,d),d.record.name&&!uf(d)&&i.set(d.record.name,d)}function c(d,f){let h,_={},v,m;if("name"in d&&d.name){if(h=i.get(d.name),!h)throw Gr(xt.MATCHER_NOT_FOUND,{location:d});m=h.record.name,_=it(lf(f.params,h.keys.filter(T=>!T.optional).concat(h.parent?h.parent.keys.filter(T=>T.optional):[]).map(T=>T.name)),d.params&&lf(d.params,h.keys.map(T=>T.name))),v=h.stringify(_)}else if(d.path!=null)v=d.path,h=n.find(T=>T.re.test(v)),h&&(_=h.parse(v),m=h.record.name);else{if(h=f.name?i.get(f.name):n.find(T=>T.re.test(f.path)),!h)throw Gr(xt.MATCHER_NOT_FOUND,{location:d,currentLocation:f});m=h.record.name,_=it({},f.params,d.params),v=h.stringify(_)}const p=[];let S=h;for(;S;)p.unshift(S.record),S=S.parent;return{name:m,path:v,params:_,matched:p,meta:c0(p)}}t.forEach(d=>s(d));function u(){n.length=0,i.clear()}return{addRoute:s,resolve:c,removeRoute:o,clearRoutes:u,getRoutes:a,getRecordMatcher:r}}function lf(t,e){const n={};for(const i of e)i in t&&(n[i]=t[i]);return n}function cf(t){const e={path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:t.aliasOf,beforeEnter:t.beforeEnter,props:l0(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}};return Object.defineProperty(e,"mods",{value:{}}),e}function l0(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const i in t.components)e[i]=typeof n=="object"?n[i]:n;return e}function uf(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function c0(t){return t.reduce((e,n)=>it(e,n.meta),{})}function u0(t,e){let n=0,i=e.length;for(;n!==i;){const s=n+i>>1;Hh(t,e[s])<0?i=s:n=s+1}const r=f0(t);return r&&(i=e.lastIndexOf(r,i-1)),i}function f0(t){let e=t;for(;e=e.parent;)if(Gh(e)&&Hh(t,e)===0)return e}function Gh({record:t}){return!!(t.name||t.components&&Object.keys(t.components).length||t.redirect)}function ff(t){const e=bn(oa),n=bn(Vc),i=yt(()=>{const l=ur(t.to);return e.resolve(l)}),r=yt(()=>{const{matched:l}=i.value,{length:c}=l,u=l[c-1],d=n.matched;if(!u||!d.length)return-1;const f=d.findIndex(Hr.bind(null,u));if(f>-1)return f;const h=df(l[c-2]);return c>1&&df(u)===h&&d[d.length-1].path!==h?d.findIndex(Hr.bind(null,l[c-2])):f}),s=yt(()=>r.value>-1&&g0(n.params,i.value.params)),o=yt(()=>r.value>-1&&r.value===n.matched.length-1&&Oh(n.params,i.value.params));function a(l={}){if(m0(l)){const c=e[ur(t.replace)?"replace":"push"](ur(t.to)).catch(xs);return t.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>c),c}return Promise.resolve()}return{route:i,href:yt(()=>i.value.href),isActive:s,isExactActive:o,navigate:a}}function d0(t){return t.length===1?t[0]:t}const h0=Zd({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:ff,setup(t,{slots:e}){const n=jo(ff(t)),{options:i}=bn(oa),r=yt(()=>({[hf(t.activeClass,i.linkActiveClass,"router-link-active")]:n.isActive,[hf(t.exactActiveClass,i.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const s=e.default&&d0(e.default(n));return t.custom?s:Oc("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:r.value},s)}}}),p0=h0;function m0(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function g0(t,e){for(const n in e){const i=e[n],r=t[n];if(typeof i=="string"){if(i!==r)return!1}else if(!wn(r)||r.length!==i.length||i.some((s,o)=>s.valueOf()!==r[o].valueOf()))return!1}return!0}function df(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const hf=(t,e,n)=>t??e??n,_0=Zd({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const i=bn(Tl),r=yt(()=>t.route||i.value),s=bn(rf,0),o=yt(()=>{let c=ur(s);const{matched:u}=r.value;let d;for(;(d=u[c])&&!d.components;)c++;return c}),a=yt(()=>r.value.matched[o.value]);So(rf,yt(()=>o.value+1)),So(q_,a),So(Tl,r);const l=vt();return ms(()=>[l.value,a.value,t.name],([c,u,d],[f,h,_])=>{u&&(u.instances[d]=c,h&&h!==u&&c&&c===f&&(u.leaveGuards.size||(u.leaveGuards=h.leaveGuards),u.updateGuards.size||(u.updateGuards=h.updateGuards))),c&&u&&(!h||!Hr(u,h)||!f)&&(u.enterCallbacks[d]||[]).forEach(v=>v(c))},{flush:"post"}),()=>{const c=r.value,u=t.name,d=a.value,f=d&&d.components[u];if(!f)return pf(n.default,{Component:f,route:c});const h=d.props[u],_=h?h===!0?c.params:typeof h=="function"?h(c):h:null,m=Oc(f,it({},_,e,{onVnodeUnmounted:p=>{p.component.isUnmounted&&(d.instances[u]=null)},ref:l}));return pf(n.default,{Component:m,route:c})||m}}});function pf(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const kh=_0;function v0(t){const e=a0(t.routes,t),n=t.parseQuery||W_,i=t.stringifyQuery||nf,r=t.history,s=ts(),o=ts(),a=ts(),l=dm(Ti);let c=Ti;Dr&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const u=Aa.bind(null,N=>""+N),d=Aa.bind(null,R_),f=Aa.bind(null,ws);function h(N,j){let oe,ue;return Bh(N)?(oe=e.getRecordMatcher(N),ue=j):ue=N,e.addRoute(ue,oe)}function _(N){const j=e.getRecordMatcher(N);j&&e.removeRoute(j)}function v(){return e.getRoutes().map(N=>N.record)}function m(N){return!!e.getRecordMatcher(N)}function p(N,j){if(j=it({},j||l.value),typeof N=="string"){const O=Ra(n,N,j.path),Q=e.resolve({path:O.path},j),J=r.createHref(O.fullPath);return it(O,Q,{params:f(Q.params),hash:ws(O.hash),redirectedFrom:void 0,href:J})}let oe;if(N.path!=null)oe=it({},N,{path:Ra(n,N.path,j.path).path});else{const O=it({},N.params);for(const Q in O)O[Q]==null&&delete O[Q];oe=it({},N,{params:d(O)}),j.params=d(j.params)}const ue=e.resolve(oe,j),me=N.hash||"";ue.params=u(f(ue.params));const R=P_(i,it({},N,{hash:b_(me),path:ue.path})),w=r.createHref(R);return it({fullPath:R,hash:me,query:i===nf?X_(N.query):N.query||{}},ue,{redirectedFrom:void 0,href:w})}function S(N){return typeof N=="string"?Ra(n,N,l.value.path):it({},N)}function T(N,j){if(c!==N)return Gr(xt.NAVIGATION_CANCELLED,{from:j,to:N})}function E(N){return L(N)}function I(N){return E(it(S(N),{replace:!0}))}function D(N,j){const oe=N.matched[N.matched.length-1];if(oe&&oe.redirect){const{redirect:ue}=oe;let me=typeof ue=="function"?ue(N,j):ue;return typeof me=="string"&&(me=me.includes("?")||me.includes("#")?me=S(me):{path:me},me.params={}),it({query:N.query,hash:N.hash,params:me.path!=null?{}:N.params},me)}}function L(N,j){const oe=c=p(N),ue=l.value,me=N.state,R=N.force,w=N.replace===!0,O=D(oe,ue);if(O)return L(it(S(O),{state:typeof O=="object"?it({},me,O.state):me,force:R,replace:w}),j||oe);const Q=oe;Q.redirectedFrom=j;let J;return!R&&D_(i,ue,oe)&&(J=Gr(xt.NAVIGATION_DUPLICATED,{to:Q,from:ue}),Ee(ue,ue,!0,!1)),(J?Promise.resolve(J):V(Q,ue)).catch(te=>Jn(te)?Jn(te,xt.NAVIGATION_GUARD_REDIRECT)?te:xe(te):se(te,Q,ue)).then(te=>{if(te){if(Jn(te,xt.NAVIGATION_GUARD_REDIRECT))return L(it({replace:w},S(te.to),{state:typeof te.to=="object"?it({},me,te.to.state):me,force:R}),j||Q)}else te=P(Q,ue,!0,w,me);return C(Q,ue,te),te})}function x(N,j){const oe=T(N,j);return oe?Promise.reject(oe):Promise.resolve()}function b(N){const j=je.values().next().value;return j&&typeof j.runWithContext=="function"?j.runWithContext(N):N()}function V(N,j){let oe;const[ue,me,R]=Y_(N,j);oe=wa(ue.reverse(),"beforeRouteLeave",N,j);for(const O of ue)O.leaveGuards.forEach(Q=>{oe.push(Li(Q,N,j))});const w=x.bind(null,N,j);return oe.push(w),z(oe).then(()=>{oe=[];for(const O of s.list())oe.push(Li(O,N,j));return oe.push(w),z(oe)}).then(()=>{oe=wa(me,"beforeRouteUpdate",N,j);for(const O of me)O.updateGuards.forEach(Q=>{oe.push(Li(Q,N,j))});return oe.push(w),z(oe)}).then(()=>{oe=[];for(const O of R)if(O.beforeEnter)if(wn(O.beforeEnter))for(const Q of O.beforeEnter)oe.push(Li(Q,N,j));else oe.push(Li(O.beforeEnter,N,j));return oe.push(w),z(oe)}).then(()=>(N.matched.forEach(O=>O.enterCallbacks={}),oe=wa(R,"beforeRouteEnter",N,j,b),oe.push(w),z(oe))).then(()=>{oe=[];for(const O of o.list())oe.push(Li(O,N,j));return oe.push(w),z(oe)}).catch(O=>Jn(O,xt.NAVIGATION_CANCELLED)?O:Promise.reject(O))}function C(N,j,oe){a.list().forEach(ue=>b(()=>ue(N,j,oe)))}function P(N,j,oe,ue,me){const R=T(N,j);if(R)return R;const w=j===Ti,O=Dr?history.state:{};oe&&(ue||w?r.replace(N.fullPath,it({scroll:w&&O&&O.scroll},me)):r.push(N.fullPath,me)),l.value=N,Ee(N,j,oe,w),xe()}let H;function K(){H||(H=r.listen((N,j,oe)=>{if(!Se.listening)return;const ue=p(N),me=D(ue,Se.currentRoute.value);if(me){L(it(me,{replace:!0,force:!0}),ue).catch(xs);return}c=ue;const R=l.value;Dr&&V_(tf(R.fullPath,oe.delta),sa()),V(ue,R).catch(w=>Jn(w,xt.NAVIGATION_ABORTED|xt.NAVIGATION_CANCELLED)?w:Jn(w,xt.NAVIGATION_GUARD_REDIRECT)?(L(it(S(w.to),{force:!0}),ue).then(O=>{Jn(O,xt.NAVIGATION_ABORTED|xt.NAVIGATION_DUPLICATED)&&!oe.delta&&oe.type===yl.pop&&r.go(-1,!1)}).catch(xs),Promise.reject()):(oe.delta&&r.go(-oe.delta,!1),se(w,ue,R))).then(w=>{w=w||P(ue,R,!1),w&&(oe.delta&&!Jn(w,xt.NAVIGATION_CANCELLED)?r.go(-oe.delta,!1):oe.type===yl.pop&&Jn(w,xt.NAVIGATION_ABORTED|xt.NAVIGATION_DUPLICATED)&&r.go(-1,!1)),C(ue,R,w)}).catch(xs)}))}let W=ts(),k=ts(),F;function se(N,j,oe){xe(N);const ue=k.list();return ue.length?ue.forEach(me=>me(N,j,oe)):console.error(N),Promise.reject(N)}function ce(){return F&&l.value!==Ti?Promise.resolve():new Promise((N,j)=>{W.add([N,j])})}function xe(N){return F||(F=!N,K(),W.list().forEach(([j,oe])=>N?oe(N):j()),W.reset()),N}function Ee(N,j,oe,ue){const{scrollBehavior:me}=t;if(!Dr||!me)return Promise.resolve();const R=!oe&&z_(tf(N.fullPath,0))||(ue||!oe)&&history.state&&history.state.scroll||null;return Jo().then(()=>me(N,j,R)).then(w=>w&&B_(w)).catch(w=>se(w,N,j))}const _e=N=>r.go(N);let ze;const je=new Set,Se={currentRoute:l,listening:!0,addRoute:h,removeRoute:_,clearRoutes:e.clearRoutes,hasRoute:m,getRoutes:v,resolve:p,options:t,push:E,replace:I,go:_e,back:()=>_e(-1),forward:()=>_e(1),beforeEach:s.add,beforeResolve:o.add,afterEach:a.add,onError:k.add,isReady:ce,install(N){N.component("RouterLink",p0),N.component("RouterView",kh),N.config.globalProperties.$router=Se,Object.defineProperty(N.config.globalProperties,"$route",{enumerable:!0,get:()=>ur(l)}),Dr&&!ze&&l.value===Ti&&(ze=!0,E(r.location).catch(ue=>{}));const j={};for(const ue in Ti)Object.defineProperty(j,ue,{get:()=>l.value[ue],enumerable:!0});N.provide(oa,Se),N.provide(Vc,Ud(j)),N.provide(Tl,l);const oe=N.unmount;je.add(N),N.unmount=function(){je.delete(N),je.size<1&&(c=Ti,H&&H(),H=null,l.value=Ti,ze=!1,F=!1),oe()}}};function z(N){return N.reduce((j,oe)=>j.then(()=>b(oe)),Promise.resolve())}return Se}function x0(){return bn(oa)}function zc(t){return bn(Vc)}const Hi=(t,e)=>{const n=t.__vccOpts||t;for(const[i,r]of e)n[i]=r;return n},S0={class:"nav-wrap"},M0={class:"nav"},E0={class:"nav__links"},y0={__name:"NavBar",setup(t){const e=zc(),n=yt(()=>e.name);return(i,r)=>{const s=nh("RouterLink");return gt(),Et("header",S0,[Ae("nav",M0,[ht(s,{class:"brand",to:"/"},{default:xn(()=>[...r[0]||(r[0]=[Ae("span",{class:"brand__dot"},null,-1),Ui(" NovaLog ",-1)])]),_:1}),Ae("div",E0,[ht(s,{class:En(["nav__link",{"is-active":n.value==="home"}]),to:"/"},{default:xn(()=>[...r[1]||(r[1]=[Ui("首页",-1)])]),_:1},8,["class"]),ht(s,{class:En(["nav__link",{"is-active":n.value==="articles"}]),to:"/articles"},{default:xn(()=>[...r[2]||(r[2]=[Ui("文章",-1)])]),_:1},8,["class"]),ht(s,{class:En(["nav__link",{"is-active":n.value==="about"}]),to:"/about"},{default:xn(()=>[...r[3]||(r[3]=[Ui("关于",-1)])]),_:1},8,["class"])]),ht(s,{class:"nav__cta",to:"/login"},{default:xn(()=>[...r[4]||(r[4]=[Ui("登录",-1)])]),_:1})])])}}},b0=Hi(y0,[["__scopeId","data-v-c65e9dfb"]]),T0={class:"app-main"},A0={__name:"MainLayout",setup(t){const e=zc(),n=yt(()=>!!e.meta.fullscreen);return(i,r)=>(gt(),Et("div",{class:En(["app-shell",{"app-shell--fullscreen":n.value}])},[n.value?_u(i.$slots,"default",{key:1},void 0):(gt(),Et(Lt,{key:0},[r[0]||(r[0]=Ae("div",{class:"bg-orb bg-orb--a"},null,-1)),r[1]||(r[1]=Ae("div",{class:"bg-orb bg-orb--b"},null,-1)),ht(b0),Ae("main",T0,[_u(i.$slots,"default",{},void 0)])],64))],2))}},R0=Hi(A0,[["__scopeId","data-v-f0291bd9"]]),C0={__name:"App",setup(t){return(e,n)=>(gt(),Ts(R0,null,{default:xn(()=>[ht(ur(kh),null,{default:xn(({Component:i,route:r})=>[ht(Ig,{name:"route-fade",mode:"out-in"},{default:xn(()=>[(gt(),Ts(Vm(i),{key:r.fullPath}))]),_:2},1024)]),_:1})]),_:1}))}},w0={class:"hero__content"},P0={class:"hero__actions"},D0={class:"hero__cards"},I0={__name:"HeroShowcase",setup(t){const e=vt([{id:1,title:"RAG 笔记流",desc:"把检索命中片段和个人理解融合成可追溯文章。"},{id:2,title:"实验室",desc:"记录模型提示词、评测策略与失败案例。"},{id:3,title:"知识地图",desc:"用可视化方式串联技术主题和项目沉淀。"}]),n=vt(null),i=vt({"--mx":"50%","--my":"50%"});function r(s){if(!n.value)return;const o=n.value.getBoundingClientRect(),a=(s.clientX-o.left)/o.width*100,l=(s.clientY-o.top)/o.height*100;i.value={"--mx":`${a.toFixed(2)}%`,"--my":`${l.toFixed(2)}%`}}return(s,o)=>{const a=nh("RouterLink");return gt(),Et("section",{ref_key:"panelRef",ref:n,class:"hero",style:$o(i.value),onMousemove:r},[Ae("div",w0,[o[2]||(o[2]=Ae("p",{class:"hero__tag"},"Personal Blog / RAG / Front-End",-1)),o[3]||(o[3]=Ae("h1",null,"把博客做成你的实验场，而不是静态简历页",-1)),o[4]||(o[4]=Ae("p",{class:"hero__desc"}," 这是一个面向内容创作和实验记录的前端骨架，你可以继续接入后端 API、RAG 搜索和管理台。 ",-1)),Ae("div",P0,[ht(a,{class:"btn btn--primary",to:"/articles"},{default:xn(()=>[...o[0]||(o[0]=[Ui("浏览文章",-1)])]),_:1}),ht(a,{class:"btn btn--ghost",to:"/login"},{default:xn(()=>[...o[1]||(o[1]=[Ui("进入后台",-1)])]),_:1})])]),Ae("div",D0,[(gt(!0),Et(Lt,null,Uo(e.value,l=>(gt(),Et("article",{key:l.id,class:"floating-card"},[Ae("h3",null,zt(l.title),1),Ae("p",null,zt(l.desc),1)]))),128))])],36)}}},L0=Hi(I0,[["__scopeId","data-v-c8a875bb"]]),U0={class:"home"},N0={class:"section"},F0={class:"highlight-grid"},O0={__name:"HomeView",setup(t){const e=[{title:"动态专题模块",text:"每个专题卡可以绑定不同 API 和图表组件，支持后续扩展。"},{title:"可插拔内容区",text:"你可以把 Markdown 渲染、评论系统、AI 总结挂到统一卡片容器。"},{title:"交互优先设计",text:"保留动效入口，避免成为只有排版没有体验的静态模板。"}];function n(r){const s=r.currentTarget,o=s.getBoundingClientRect(),a=(r.clientX-o.left)/o.width,c=((r.clientY-o.top)/o.height-.5)*-12,u=(a-.5)*16;s.style.transform=`rotateX(${c.toFixed(2)}deg) rotateY(${u.toFixed(2)}deg) translateY(-4px)`}function i(r){r.currentTarget.style.transform=""}return(r,s)=>(gt(),Et("div",U0,[ht(L0),Ae("section",N0,[s[0]||(s[0]=Ae("header",{class:"section__header"},[Ae("p",{class:"section__tag"},"Framework Blocks"),Ae("h2",null,"博客首页核心模块")],-1)),Ae("div",F0,[(gt(),Et(Lt,null,Uo(e,o=>Ae("article",{key:o.title,class:"highlight",onMousemove:n,onMouseleave:i},[Ae("h3",null,zt(o.title),1),Ae("p",null,zt(o.text),1)],32)),64))])])]))}},B0=Hi(O0,[["__scopeId","data-v-5a929f5a"]]),V0={class:"articles"},z0={class:"tags"},H0=["onClick"],G0={class:"article-grid"},k0={class:"article-card__meta"},W0={__name:"ArticlesView",setup(t){const e=["全部","RAG","Vue","Prompt","Engineering"],n=vt("全部"),i=vt([{id:1,title:"从 0 到 1：个人博客里的 RAG 检索流程",tag:"RAG",readTime:"8 min"},{id:2,title:"Vue 组件通信策略：从 Props 到 Store",tag:"Vue",readTime:"6 min"},{id:3,title:"提示词版本管理：让实验可复盘",tag:"Prompt",readTime:"9 min"},{id:4,title:"前端工程结构设计：目录不是摆设",tag:"Engineering",readTime:"7 min"}]),r=yt(()=>n.value==="全部"?i.value:i.value.filter(s=>s.tag===n.value));return(s,o)=>(gt(),Et("section",V0,[o[1]||(o[1]=Ae("header",{class:"articles__header"},[Ae("h1",null,"文章流"),Ae("p",null,"这里是可接 CMS 或后端接口的数据驱动列表。")],-1)),Ae("div",z0,[(gt(),Et(Lt,null,Uo(e,a=>Ae("button",{key:a,class:En(["tag",{"is-active":n.value===a}]),onClick:l=>n.value=a},zt(a),11,H0)),64))]),Ae("div",G0,[(gt(!0),Et(Lt,null,Uo(r.value,a=>(gt(),Et("article",{key:a.id,class:"article-card"},[Ae("div",k0,[Ae("span",null,zt(a.tag),1),Ae("span",null,zt(a.readTime),1)]),Ae("h2",null,zt(a.title),1),o[0]||(o[0]=Ae("button",{class:"article-card__action"},"阅读全文",-1))]))),128))])]))}},X0=Hi(W0,[["__scopeId","data-v-ad056805"]]),q0={},Y0={class:"about"};function $0(t,e){return gt(),Et("section",Y0,[...e[0]||(e[0]=[Ae("h1",null,"关于这个前端骨架",-1),Ae("p",null," 这个项目优先保证交互和组件扩展能力：登录页有动效入口、首页有动态模块、文章流是数据驱动结构。 ",-1),Ae("p",null," 你后续可以直接接入 API、Markdown 渲染器、评论系统和后台管理，而不需要重写页面骨架。 ",-1)])])}const K0=Hi(q0,[["render",$0],["__scopeId","data-v-a94decb7"]]);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Hc="183",j0=0,mf=1,Z0=2,bo=1,J0=2,us=3,zi=0,rn=1,ci=2,fi=0,Or=1,Al=2,gf=3,_f=4,Q0=5,ir=100,ev=101,tv=102,nv=103,iv=104,rv=200,sv=201,ov=202,av=203,Rl=204,Cl=205,lv=206,cv=207,uv=208,fv=209,dv=210,hv=211,pv=212,mv=213,gv=214,wl=0,Pl=1,Dl=2,kr=3,Il=4,Ll=5,Ul=6,Nl=7,Wh=0,_v=1,vv=2,Wn=0,Xh=1,qh=2,Yh=3,$h=4,Kh=5,jh=6,Zh=7,Jh=300,fr=301,Wr=302,Pa=303,Da=304,aa=306,Fl=1e3,ui=1001,Ol=1002,Ft=1003,xv=1004,Ys=1005,Wt=1006,Ia=1007,or=1008,dn=1009,Qh=1010,ep=1011,Ps=1012,Gc=1013,qn=1014,Hn=1015,_i=1016,kc=1017,Wc=1018,Ds=1020,tp=35902,np=35899,ip=1021,rp=1022,Mn=1023,vi=1026,ar=1027,sp=1028,Xc=1029,Xr=1030,qc=1031,Yc=1033,To=33776,Ao=33777,Ro=33778,Co=33779,Bl=35840,Vl=35841,zl=35842,Hl=35843,Gl=36196,kl=37492,Wl=37496,Xl=37488,ql=37489,Yl=37490,$l=37491,Kl=37808,jl=37809,Zl=37810,Jl=37811,Ql=37812,ec=37813,tc=37814,nc=37815,ic=37816,rc=37817,sc=37818,oc=37819,ac=37820,lc=37821,cc=36492,uc=36494,fc=36495,dc=36283,hc=36284,pc=36285,mc=36286,Sv=3200,Mv=0,Ev=1,Ni="",nn="srgb",qr="srgb-linear",Vo="linear",at="srgb",gr=7680,vf=519,yv=512,bv=513,Tv=514,$c=515,Av=516,Rv=517,Kc=518,Cv=519,xf=35044,Sf="300 es",Gn=2e3,zo=2001;function wv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Ho(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Pv(){const t=Ho("canvas");return t.style.display="block",t}const Mf={};function Ef(...t){const e="THREE."+t.shift();console.log(e,...t)}function op(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Ge(...t){t=op(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function et(...t){t=op(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Go(...t){const e=t.join(" ");e in Mf||(Mf[e]=!0,Ge(...t))}function Dv(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const Iv={[wl]:Pl,[Dl]:Ul,[Il]:Nl,[kr]:Ll,[Pl]:wl,[Ul]:Dl,[Nl]:Il,[Ll]:kr};class Kr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],La=Math.PI/180,gc=180/Math.PI;function Fs(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Bt[t&255]+Bt[t>>8&255]+Bt[t>>16&255]+Bt[t>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[n&63|128]+Bt[n>>8&255]+"-"+Bt[n>>16&255]+Bt[n>>24&255]+Bt[i&255]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]).toLowerCase()}function Ze(t,e,n){return Math.max(e,Math.min(n,t))}function Lv(t,e){return(t%e+e)%e}function Ua(t,e,n){return(1-n)*t+n*e}function ns(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function Qt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}class ut{constructor(e=0,n=0){ut.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Ze(this.x,e.x,n.x),this.y=Ze(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Ze(this.x,e,n),this.y=Ze(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class jr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],d=i[r+3],f=s[o+0],h=s[o+1],_=s[o+2],v=s[o+3];if(d!==v||l!==f||c!==h||u!==_){let m=l*f+c*h+u*_+d*v;m<0&&(f=-f,h=-h,_=-_,v=-v,m=-m);let p=1-a;if(m<.9995){const S=Math.acos(m),T=Math.sin(S);p=Math.sin(p*S)/T,a=Math.sin(a*S)/T,l=l*p+f*a,c=c*p+h*a,u=u*p+_*a,d=d*p+v*a}else{l=l*p+f*a,c=c*p+h*a,u=u*p+_*a,d=d*p+v*a;const S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=d}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],d=s[o],f=s[o+1],h=s[o+2],_=s[o+3];return e[n]=a*_+u*d+l*h-c*f,e[n+1]=l*_+u*f+c*d-a*h,e[n+2]=c*_+u*h+a*f-l*d,e[n+3]=u*_-a*d-l*f-c*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),d=a(s/2),f=l(i/2),h=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=f*u*d+c*h*_,this._y=c*h*d-f*u*_,this._z=c*u*_+f*h*d,this._w=c*u*d-f*h*_;break;case"YXZ":this._x=f*u*d+c*h*_,this._y=c*h*d-f*u*_,this._z=c*u*_-f*h*d,this._w=c*u*d+f*h*_;break;case"ZXY":this._x=f*u*d-c*h*_,this._y=c*h*d+f*u*_,this._z=c*u*_+f*h*d,this._w=c*u*d-f*h*_;break;case"ZYX":this._x=f*u*d-c*h*_,this._y=c*h*d+f*u*_,this._z=c*u*_-f*h*d,this._w=c*u*d+f*h*_;break;case"YZX":this._x=f*u*d+c*h*_,this._y=c*h*d+f*u*_,this._z=c*u*_-f*h*d,this._w=c*u*d-f*h*_;break;case"XZY":this._x=f*u*d-c*h*_,this._y=c*h*d-f*u*_,this._z=c*u*_+f*h*d,this._w=c*u*d+f*h*_;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],d=n[10],f=i+a+d;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-l)*h,this._y=(s-c)*h,this._z=(o-r)*h}else if(i>a&&i>d){const h=2*Math.sqrt(1+i-a-d);this._w=(u-l)/h,this._x=.25*h,this._y=(r+o)/h,this._z=(s+c)/h}else if(a>d){const h=2*Math.sqrt(1+a-i-d);this._w=(s-c)/h,this._x=(r+o)/h,this._y=.25*h,this._z=(l+u)/h}else{const h=2*Math.sqrt(1+d-i-a);this._w=(o-r)/h,this._x=(s+c)/h,this._y=(l+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-n;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Z{constructor(e=0,n=0,i=0){Z.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(yf.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(yf.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),d=2*(s*i-o*n);return this.x=n+l*c+o*d-a*u,this.y=i+l*u+a*c-s*d,this.z=r+l*d+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Ze(this.x,e.x,n.x),this.y=Ze(this.y,e.y,n.y),this.z=Ze(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Ze(this.x,e,n),this.y=Ze(this.y,e,n),this.z=Ze(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Na.copy(this).projectOnVector(e),this.sub(Na)}reflect(e){return this.sub(Na.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Ze(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Na=new Z,yf=new jr;class Ye{constructor(e,n,i,r,s,o,a,l,c){Ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],f=i[2],h=i[5],_=i[8],v=r[0],m=r[3],p=r[6],S=r[1],T=r[4],E=r[7],I=r[2],D=r[5],L=r[8];return s[0]=o*v+a*S+l*I,s[3]=o*m+a*T+l*D,s[6]=o*p+a*E+l*L,s[1]=c*v+u*S+d*I,s[4]=c*m+u*T+d*D,s[7]=c*p+u*E+d*L,s[2]=f*v+h*S+_*I,s[5]=f*m+h*T+_*D,s[8]=f*p+h*E+_*L,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,f=a*l-u*s,h=c*s-o*l,_=n*d+i*f+r*h;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=d*v,e[1]=(r*c-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=f*v,e[4]=(u*n-r*l)*v,e[5]=(r*s-a*n)*v,e[6]=h*v,e[7]=(i*l-c*n)*v,e[8]=(o*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Fa.makeScale(e,n)),this}rotate(e){return this.premultiply(Fa.makeRotation(-e)),this}translate(e,n){return this.premultiply(Fa.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Fa=new Ye,bf=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tf=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uv(){const t={enabled:!0,workingColorSpace:qr,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===at&&(r.r=di(r.r),r.g=di(r.g),r.b=di(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===at&&(r.r=Br(r.r),r.g=Br(r.g),r.b=Br(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Ni?Vo:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Go("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Go("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[qr]:{primaries:e,whitePoint:i,transfer:Vo,toXYZ:bf,fromXYZ:Tf,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:e,whitePoint:i,transfer:at,toXYZ:bf,fromXYZ:Tf,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),t}const Je=Uv();function di(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Br(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let _r;class Nv{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{_r===void 0&&(_r=Ho("canvas")),_r.width=e.width,_r.height=e.height;const r=_r.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=_r}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Ho("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=di(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(di(n[i]/255)*255):n[i]=di(n[i]);return{data:n,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Fv=0;class jc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Fv++}),this.uuid=Fs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayHeight,n.displayWidth,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Oa(r[o].image)):s.push(Oa(r[o]))}else s=Oa(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Oa(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Nv.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}let Ov=0;const Ba=new Z;class qt extends Kr{constructor(e=qt.DEFAULT_IMAGE,n=qt.DEFAULT_MAPPING,i=ui,r=ui,s=Wt,o=or,a=Mn,l=dn,c=qt.DEFAULT_ANISOTROPY,u=Ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ov++}),this.uuid=Fs(),this.name="",this.source=new jc(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ba).x}get height(){return this.source.getSize(Ba).y}get depth(){return this.source.getSize(Ba).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Ge(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Ge(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Jh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fl:e.x=e.x-Math.floor(e.x);break;case ui:e.x=e.x<0?0:1;break;case Ol:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fl:e.y=e.y-Math.floor(e.y);break;case ui:e.y=e.y<0?0:1;break;case Ol:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}qt.DEFAULT_IMAGE=null;qt.DEFAULT_MAPPING=Jh;qt.DEFAULT_ANISOTROPY=1;class bt{constructor(e=0,n=0,i=0,r=1){bt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],d=l[8],f=l[1],h=l[5],_=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(u-f)<.01&&Math.abs(d-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+v)<.1&&Math.abs(_+m)<.1&&Math.abs(c+h+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const T=(c+1)/2,E=(h+1)/2,I=(p+1)/2,D=(u+f)/4,L=(d+v)/4,x=(_+m)/4;return T>E&&T>I?T<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(T),r=D/i,s=L/i):E>I?E<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),i=D/r,s=x/r):I<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(I),i=L/s,r=x/s),this.set(i,r,s,n),this}let S=Math.sqrt((m-_)*(m-_)+(d-v)*(d-v)+(f-u)*(f-u));return Math.abs(S)<.001&&(S=1),this.x=(m-_)/S,this.y=(d-v)/S,this.z=(f-u)/S,this.w=Math.acos((c+h+p-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Ze(this.x,e.x,n.x),this.y=Ze(this.y,e.y,n.y),this.z=Ze(this.z,e.z,n.z),this.w=Ze(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Ze(this.x,e,n),this.y=Ze(this.y,e,n),this.z=Ze(this.z,e,n),this.w=Ze(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Ze(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Bv extends Kr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new bt(0,0,e,n),this.scissorTest=!1,this.viewport=new bt(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new qt(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const n={minFilter:Wt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new jc(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xn extends Bv{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class ap extends qt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vv extends qt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Ft,this.minFilter=Ft,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Tt{constructor(e,n,i,r,s,o,a,l,c,u,d,f,h,_,v,m){Tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,d,f,h,_,v,m)}set(e,n,i,r,s,o,a,l,c,u,d,f,h,_,v,m){const p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=f,p[3]=h,p[7]=_,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Tt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinant()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const n=this.elements,i=e.elements,r=1/vr.setFromMatrixColumn(e,0).length(),s=1/vr.setFromMatrixColumn(e,1).length(),o=1/vr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=o*u,h=o*d,_=a*u,v=a*d;n[0]=l*u,n[4]=-l*d,n[8]=c,n[1]=h+_*c,n[5]=f-v*c,n[9]=-a*l,n[2]=v-f*c,n[6]=_+h*c,n[10]=o*l}else if(e.order==="YXZ"){const f=l*u,h=l*d,_=c*u,v=c*d;n[0]=f+v*a,n[4]=_*a-h,n[8]=o*c,n[1]=o*d,n[5]=o*u,n[9]=-a,n[2]=h*a-_,n[6]=v+f*a,n[10]=o*l}else if(e.order==="ZXY"){const f=l*u,h=l*d,_=c*u,v=c*d;n[0]=f-v*a,n[4]=-o*d,n[8]=_+h*a,n[1]=h+_*a,n[5]=o*u,n[9]=v-f*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const f=o*u,h=o*d,_=a*u,v=a*d;n[0]=l*u,n[4]=_*c-h,n[8]=f*c+v,n[1]=l*d,n[5]=v*c+f,n[9]=h*c-_,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const f=o*l,h=o*c,_=a*l,v=a*c;n[0]=l*u,n[4]=v-f*d,n[8]=_*d+h,n[1]=d,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=h*d+_,n[10]=f-v*d}else if(e.order==="XZY"){const f=o*l,h=o*c,_=a*l,v=a*c;n[0]=l*u,n[4]=-d,n[8]=c*u,n[1]=f*d+v,n[5]=o*u,n[9]=h*d-_,n[2]=_*d-h,n[6]=a*u,n[10]=v*d+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zv,e,Hv)}lookAt(e,n,i){const r=this.elements;return on.subVectors(e,n),on.lengthSq()===0&&(on.z=1),on.normalize(),Ai.crossVectors(i,on),Ai.lengthSq()===0&&(Math.abs(i.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),Ai.crossVectors(i,on)),Ai.normalize(),$s.crossVectors(on,Ai),r[0]=Ai.x,r[4]=$s.x,r[8]=on.x,r[1]=Ai.y,r[5]=$s.y,r[9]=on.y,r[2]=Ai.z,r[6]=$s.z,r[10]=on.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],f=i[9],h=i[13],_=i[2],v=i[6],m=i[10],p=i[14],S=i[3],T=i[7],E=i[11],I=i[15],D=r[0],L=r[4],x=r[8],b=r[12],V=r[1],C=r[5],P=r[9],H=r[13],K=r[2],W=r[6],k=r[10],F=r[14],se=r[3],ce=r[7],xe=r[11],Ee=r[15];return s[0]=o*D+a*V+l*K+c*se,s[4]=o*L+a*C+l*W+c*ce,s[8]=o*x+a*P+l*k+c*xe,s[12]=o*b+a*H+l*F+c*Ee,s[1]=u*D+d*V+f*K+h*se,s[5]=u*L+d*C+f*W+h*ce,s[9]=u*x+d*P+f*k+h*xe,s[13]=u*b+d*H+f*F+h*Ee,s[2]=_*D+v*V+m*K+p*se,s[6]=_*L+v*C+m*W+p*ce,s[10]=_*x+v*P+m*k+p*xe,s[14]=_*b+v*H+m*F+p*Ee,s[3]=S*D+T*V+E*K+I*se,s[7]=S*L+T*C+E*W+I*ce,s[11]=S*x+T*P+E*k+I*xe,s[15]=S*b+T*H+E*F+I*Ee,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],f=e[10],h=e[14],_=e[3],v=e[7],m=e[11],p=e[15],S=l*h-c*f,T=a*h-c*d,E=a*f-l*d,I=o*h-c*u,D=o*f-l*u,L=o*d-a*u;return n*(v*S-m*T+p*E)-i*(_*S-m*I+p*D)+r*(_*T-v*I+p*L)-s*(_*E-v*D+m*L)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],f=e[10],h=e[11],_=e[12],v=e[13],m=e[14],p=e[15],S=n*a-i*o,T=n*l-r*o,E=n*c-s*o,I=i*l-r*a,D=i*c-s*a,L=r*c-s*l,x=u*v-d*_,b=u*m-f*_,V=u*p-h*_,C=d*m-f*v,P=d*p-h*v,H=f*p-h*m,K=S*H-T*P+E*C+I*V-D*b+L*x;if(K===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const W=1/K;return e[0]=(a*H-l*P+c*C)*W,e[1]=(r*P-i*H-s*C)*W,e[2]=(v*L-m*D+p*I)*W,e[3]=(f*D-d*L-h*I)*W,e[4]=(l*V-o*H-c*b)*W,e[5]=(n*H-r*V+s*b)*W,e[6]=(m*E-_*L-p*T)*W,e[7]=(u*L-f*E+h*T)*W,e[8]=(o*P-a*V+c*x)*W,e[9]=(i*V-n*P-s*x)*W,e[10]=(_*D-v*E+p*S)*W,e[11]=(d*E-u*D-h*S)*W,e[12]=(a*b-o*C-l*x)*W,e[13]=(n*C-i*b+r*x)*W,e[14]=(v*T-_*I-m*S)*W,e[15]=(u*I-d*T+f*S)*W,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,d=a+a,f=s*c,h=s*u,_=s*d,v=o*u,m=o*d,p=a*d,S=l*c,T=l*u,E=l*d,I=i.x,D=i.y,L=i.z;return r[0]=(1-(v+p))*I,r[1]=(h+E)*I,r[2]=(_-T)*I,r[3]=0,r[4]=(h-E)*D,r[5]=(1-(f+p))*D,r[6]=(m+S)*D,r[7]=0,r[8]=(_+T)*L,r[9]=(m-S)*L,r[10]=(1-(f+v))*L,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),n.identity(),this;let o=vr.set(r[0],r[1],r[2]).length();const a=vr.set(r[4],r[5],r[6]).length(),l=vr.set(r[8],r[9],r[10]).length();s<0&&(o=-o),gn.copy(this);const c=1/o,u=1/a,d=1/l;return gn.elements[0]*=c,gn.elements[1]*=c,gn.elements[2]*=c,gn.elements[4]*=u,gn.elements[5]*=u,gn.elements[6]*=u,gn.elements[8]*=d,gn.elements[9]*=d,gn.elements[10]*=d,n.setFromRotationMatrix(gn),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,r,s,o,a=Gn,l=!1){const c=this.elements,u=2*s/(n-e),d=2*s/(i-r),f=(n+e)/(n-e),h=(i+r)/(i-r);let _,v;if(l)_=s/(o-s),v=o*s/(o-s);else if(a===Gn)_=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===zo)_=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=d,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Gn,l=!1){const c=this.elements,u=2/(n-e),d=2/(i-r),f=-(n+e)/(n-e),h=-(i+r)/(i-r);let _,v;if(l)_=1/(o-s),v=o/(o-s);else if(a===Gn)_=-2/(o-s),v=-(o+s)/(o-s);else if(a===zo)_=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=d,c[9]=0,c[13]=h,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const vr=new Z,gn=new Tt,zv=new Z(0,0,0),Hv=new Z(1,1,1),Ai=new Z,$s=new Z,on=new Z,Af=new Tt,Rf=new jr;class xi{constructor(e=0,n=0,i=0,r=xi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],d=r[2],f=r[6],h=r[10];switch(n){case"XYZ":this._y=Math.asin(Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,h),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ze(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,h));break;case"XZY":this._z=Math.asin(-Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,h),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Af.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Af,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Rf.setFromEuler(this),this.setFromQuaternion(Rf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}xi.DEFAULT_ORDER="XYZ";class lp{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Gv=0;const Cf=new Z,xr=new jr,Qn=new Tt,Ks=new Z,is=new Z,kv=new Z,Wv=new jr,wf=new Z(1,0,0),Pf=new Z(0,1,0),Df=new Z(0,0,1),If={type:"added"},Xv={type:"removed"},Sr={type:"childadded",child:null},Va={type:"childremoved",child:null};class Yt extends Kr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gv++}),this.uuid=Fs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Yt.DEFAULT_UP.clone();const e=new Z,n=new xi,i=new jr,r=new Z(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Tt},normalMatrix:{value:new Ye}}),this.matrix=new Tt,this.matrixWorld=new Tt,this.matrixAutoUpdate=Yt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new lp,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return xr.setFromAxisAngle(e,n),this.quaternion.multiply(xr),this}rotateOnWorldAxis(e,n){return xr.setFromAxisAngle(e,n),this.quaternion.premultiply(xr),this}rotateX(e){return this.rotateOnAxis(wf,e)}rotateY(e){return this.rotateOnAxis(Pf,e)}rotateZ(e){return this.rotateOnAxis(Df,e)}translateOnAxis(e,n){return Cf.copy(e).applyQuaternion(this.quaternion),this.position.add(Cf.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(wf,e)}translateY(e){return this.translateOnAxis(Pf,e)}translateZ(e){return this.translateOnAxis(Df,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Qn.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ks.copy(e):Ks.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),is.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Qn.lookAt(is,Ks,this.up):Qn.lookAt(Ks,is,this.up),this.quaternion.setFromRotationMatrix(Qn),r&&(Qn.extractRotation(r.matrixWorld),xr.setFromRotationMatrix(Qn),this.quaternion.premultiply(xr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(et("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(If),Sr.child=e,this.dispatchEvent(Sr),Sr.child=null):et("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(Xv),Va.child=e,this.dispatchEvent(Va),Va.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Qn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Qn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Qn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(If),Sr.child=e,this.dispatchEvent(Sr),Sr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,e,kv),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(is,Wv,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),f=o(e.skeletons),h=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),f.length>0&&(i.skeletons=f),h.length>0&&(i.animations=h),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Yt.DEFAULT_UP=new Z(0,1,0);Yt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class js extends Yt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qv={type:"move"};class za{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new js,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new js,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new js,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=n.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,_=.005;c.inputState.pinching&&f>h+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=h-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(qv)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new js;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const cp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ri={h:0,s:0,l:0},Zs={h:0,s:0,l:0};function Ha(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class tt{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=Je.workingColorSpace){return this.r=e,this.g=n,this.b=i,Je.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=Je.workingColorSpace){if(e=Lv(e,1),n=Ze(n,0,1),i=Ze(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Ha(o,s,e+1/3),this.g=Ha(o,s,e),this.b=Ha(o,s,e-1/3)}return Je.colorSpaceToWorking(this,r),this}setStyle(e,n=nn){function i(s){s!==void 0&&parseFloat(s)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Ge("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=nn){const i=cp[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=di(e.r),this.g=di(e.g),this.b=di(e.b),this}copyLinearToSRGB(e){return this.r=Br(e.r),this.g=Br(e.g),this.b=Br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return Je.workingToColorSpace(Vt.copy(this),e),Math.round(Ze(Vt.r*255,0,255))*65536+Math.round(Ze(Vt.g*255,0,255))*256+Math.round(Ze(Vt.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Je.workingColorSpace){Je.workingToColorSpace(Vt.copy(this),n);const i=Vt.r,r=Vt.g,s=Vt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Je.workingColorSpace){return Je.workingToColorSpace(Vt.copy(this),n),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=nn){Je.workingToColorSpace(Vt.copy(this),e);const n=Vt.r,i=Vt.g,r=Vt.b;return e!==nn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Ri),this.setHSL(Ri.h+e,Ri.s+n,Ri.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Ri),e.getHSL(Zs);const i=Ua(Ri.h,Zs.h,n),r=Ua(Ri.s,Zs.s,n),s=Ua(Ri.l,Zs.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new tt;tt.NAMES=cp;class Zc{constructor(e,n=1,i=1e3){this.isFog=!0,this.name="",this.color=new tt(e),this.near=n,this.far=i}clone(){return new Zc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Yv extends Yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xi,this.environmentIntensity=1,this.environmentRotation=new xi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const _n=new Z,ei=new Z,Ga=new Z,ti=new Z,Mr=new Z,Er=new Z,Lf=new Z,ka=new Z,Wa=new Z,Xa=new Z,qa=new bt,Ya=new bt,$a=new bt;class Sn{constructor(e=new Z,n=new Z,i=new Z){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),_n.subVectors(e,n),r.cross(_n);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){_n.subVectors(r,n),ei.subVectors(i,n),Ga.subVectors(e,n);const o=_n.dot(_n),a=_n.dot(ei),l=_n.dot(Ga),c=ei.dot(ei),u=ei.dot(Ga),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;const f=1/d,h=(c*l-a*u)*f,_=(o*u-a*l)*f;return s.set(1-h-_,_,h)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,ti)===null?!1:ti.x>=0&&ti.y>=0&&ti.x+ti.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,ti)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ti.x),l.addScaledVector(o,ti.y),l.addScaledVector(a,ti.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return qa.setScalar(0),Ya.setScalar(0),$a.setScalar(0),qa.fromBufferAttribute(e,n),Ya.fromBufferAttribute(e,i),$a.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(qa,s.x),o.addScaledVector(Ya,s.y),o.addScaledVector($a,s.z),o}static isFrontFacing(e,n,i,r){return _n.subVectors(i,n),ei.subVectors(e,n),_n.cross(ei).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return _n.subVectors(this.c,this.b),ei.subVectors(this.a,this.b),_n.cross(ei).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Sn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Sn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Sn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Sn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Sn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;Mr.subVectors(r,i),Er.subVectors(s,i),ka.subVectors(e,i);const l=Mr.dot(ka),c=Er.dot(ka);if(l<=0&&c<=0)return n.copy(i);Wa.subVectors(e,r);const u=Mr.dot(Wa),d=Er.dot(Wa);if(u>=0&&d<=u)return n.copy(r);const f=l*d-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(Mr,o);Xa.subVectors(e,s);const h=Mr.dot(Xa),_=Er.dot(Xa);if(_>=0&&h<=_)return n.copy(s);const v=h*c-l*_;if(v<=0&&c>=0&&_<=0)return a=c/(c-_),n.copy(i).addScaledVector(Er,a);const m=u*_-h*d;if(m<=0&&d-u>=0&&h-_>=0)return Lf.subVectors(s,r),a=(d-u)/(d-u+(h-_)),n.copy(r).addScaledVector(Lf,a);const p=1/(m+v+f);return o=v*p,a=f*p,n.copy(i).addScaledVector(Mr,o).addScaledVector(Er,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Os{constructor(e=new Z(1/0,1/0,1/0),n=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(vn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(vn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=vn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,vn):vn.fromBufferAttribute(s,o),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Js.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Js.copy(i.boundingBox)),Js.applyMatrix4(e.matrixWorld),this.union(Js)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rs),Qs.subVectors(this.max,rs),yr.subVectors(e.a,rs),br.subVectors(e.b,rs),Tr.subVectors(e.c,rs),Ci.subVectors(br,yr),wi.subVectors(Tr,br),$i.subVectors(yr,Tr);let n=[0,-Ci.z,Ci.y,0,-wi.z,wi.y,0,-$i.z,$i.y,Ci.z,0,-Ci.x,wi.z,0,-wi.x,$i.z,0,-$i.x,-Ci.y,Ci.x,0,-wi.y,wi.x,0,-$i.y,$i.x,0];return!Ka(n,yr,br,Tr,Qs)||(n=[1,0,0,0,1,0,0,0,1],!Ka(n,yr,br,Tr,Qs))?!1:(eo.crossVectors(Ci,wi),n=[eo.x,eo.y,eo.z],Ka(n,yr,br,Tr,Qs))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ni),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ni=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],vn=new Z,Js=new Os,yr=new Z,br=new Z,Tr=new Z,Ci=new Z,wi=new Z,$i=new Z,rs=new Z,Qs=new Z,eo=new Z,Ki=new Z;function Ka(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Ki.fromArray(t,s);const a=r.x*Math.abs(Ki.x)+r.y*Math.abs(Ki.y)+r.z*Math.abs(Ki.z),l=e.dot(Ki),c=n.dot(Ki),u=i.dot(Ki);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const At=new Z,to=new ut;let $v=0;class Tn{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:$v++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=xf,this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)to.fromBufferAttribute(this,n),to.applyMatrix3(e),this.setXY(n,to.x,to.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.applyMatrix3(e),this.setXYZ(n,At.x,At.y,At.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.applyMatrix4(e),this.setXYZ(n,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.applyNormalMatrix(e),this.setXYZ(n,At.x,At.y,At.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.transformDirection(e),this.setXYZ(n,At.x,At.y,At.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ns(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Qt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ns(n,this.array)),n}setX(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ns(n,this.array)),n}setY(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ns(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ns(n,this.array)),n}setW(e,n){return this.normalized&&(n=Qt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Qt(n,this.array),i=Qt(i,this.array),r=Qt(r,this.array),s=Qt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==xf&&(e.usage=this.usage),e}}class up extends Tn{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class fp extends Tn{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class hi extends Tn{constructor(e,n,i){super(new Float32Array(e),n,i)}}const Kv=new Os,ss=new Z,ja=new Z;class la{constructor(e=new Z,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):Kv.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ss.subVectors(e,this.center);const n=ss.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ss,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ja.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ss.copy(e.center).add(ja)),this.expandByPoint(ss.copy(e.center).sub(ja))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let jv=0;const un=new Tt,Za=new Yt,Ar=new Z,an=new Os,os=new Os,It=new Z;class Pn extends Kr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jv++}),this.uuid=Fs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(wv(e)?fp:up)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ye().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return un.makeRotationFromQuaternion(e),this.applyMatrix4(un),this}rotateX(e){return un.makeRotationX(e),this.applyMatrix4(un),this}rotateY(e){return un.makeRotationY(e),this.applyMatrix4(un),this}rotateZ(e){return un.makeRotationZ(e),this.applyMatrix4(un),this}translate(e,n,i){return un.makeTranslation(e,n,i),this.applyMatrix4(un),this}scale(e,n,i){return un.makeScale(e,n,i),this.applyMatrix4(un),this}lookAt(e){return Za.lookAt(e),Za.updateMatrix(),this.applyMatrix4(Za.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ar).negate(),this.translate(Ar.x,Ar.y,Ar.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new hi(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Os);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];an.setFromBufferAttribute(s),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,an.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,an.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(an.min),this.boundingBox.expandByPoint(an.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&et('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new la);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){et("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Z,1/0);return}if(e){const i=this.boundingSphere.center;if(an.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];os.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(an.min,os.min),an.expandByPoint(It),It.addVectors(an.max,os.max),an.expandByPoint(It)):(an.expandByPoint(os.min),an.expandByPoint(os.max))}an.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)It.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(It));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)It.fromBufferAttribute(a,c),l&&(Ar.fromBufferAttribute(e,c),It.add(Ar)),r=Math.max(r,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&et('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){et("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let x=0;x<i.count;x++)a[x]=new Z,l[x]=new Z;const c=new Z,u=new Z,d=new Z,f=new ut,h=new ut,_=new ut,v=new Z,m=new Z;function p(x,b,V){c.fromBufferAttribute(i,x),u.fromBufferAttribute(i,b),d.fromBufferAttribute(i,V),f.fromBufferAttribute(s,x),h.fromBufferAttribute(s,b),_.fromBufferAttribute(s,V),u.sub(c),d.sub(c),h.sub(f),_.sub(f);const C=1/(h.x*_.y-_.x*h.y);isFinite(C)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(d,-h.y).multiplyScalar(C),m.copy(d).multiplyScalar(h.x).addScaledVector(u,-_.x).multiplyScalar(C),a[x].add(v),a[b].add(v),a[V].add(v),l[x].add(m),l[b].add(m),l[V].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,b=S.length;x<b;++x){const V=S[x],C=V.start,P=V.count;for(let H=C,K=C+P;H<K;H+=3)p(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const T=new Z,E=new Z,I=new Z,D=new Z;function L(x){I.fromBufferAttribute(r,x),D.copy(I);const b=a[x];T.copy(b),T.sub(I.multiplyScalar(I.dot(b))).normalize(),E.crossVectors(D,b);const C=E.dot(l[x])<0?-1:1;o.setXYZW(x,T.x,T.y,T.z,C)}for(let x=0,b=S.length;x<b;++x){const V=S[x],C=V.start,P=V.count;for(let H=C,K=C+P;H<K;H+=3)L(e.getX(H+0)),L(e.getX(H+1)),L(e.getX(H+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Tn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,h=i.count;f<h;f++)i.setXYZ(f,0,0,0);const r=new Z,s=new Z,o=new Z,a=new Z,l=new Z,c=new Z,u=new Z,d=new Z;if(e)for(let f=0,h=e.count;f<h;f+=3){const _=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,v),o.fromBufferAttribute(n,m),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,h=n.count;f<h;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),o.fromBufferAttribute(n,f+2),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)It.fromBufferAttribute(e,n),It.normalize(),e.setXYZ(n,It.x,It.y,It.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,d=a.normalized,f=new c.constructor(l.length*u);let h=0,_=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?h=l[v]*a.data.stride+a.offset:h=l[v]*u;for(let p=0;p<u;p++)f[_++]=c[h++]}return new Tn(f,u,d)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Pn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,d=c.length;u<d;u++){const f=c[u],h=e(f,i);l.push(h)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let d=0,f=c.length;d<f;d++){const h=c[d];u.push(h.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],d=s[c];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let Zv=0;class Bs extends Kr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zv++}),this.uuid=Fs(),this.name="",this.type="Material",this.blending=Or,this.side=zi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rl,this.blendDst=Cl,this.blendEquation=ir,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new tt(0,0,0),this.blendAlpha=0,this.depthFunc=kr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=vf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gr,this.stencilZFail=gr,this.stencilZPass=gr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Ge(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Ge(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Or&&(i.blending=this.blending),this.side!==zi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Rl&&(i.blendSrc=this.blendSrc),this.blendDst!==Cl&&(i.blendDst=this.blendDst),this.blendEquation!==ir&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==kr&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==vf&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==gr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==gr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const ii=new Z,Ja=new Z,no=new Z,Pi=new Z,Qa=new Z,io=new Z,el=new Z;class dp{constructor(e=new Z,n=new Z(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ii)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=ii.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(ii.copy(this.origin).addScaledVector(this.direction,n),ii.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Ja.copy(e).add(n).multiplyScalar(.5),no.copy(n).sub(e).normalize(),Pi.copy(this.origin).sub(Ja);const s=e.distanceTo(n)*.5,o=-this.direction.dot(no),a=Pi.dot(this.direction),l=-Pi.dot(no),c=Pi.lengthSq(),u=Math.abs(1-o*o);let d,f,h,_;if(u>0)if(d=o*l-a,f=o*a-l,_=s*u,d>=0)if(f>=-_)if(f<=_){const v=1/u;d*=v,f*=v,h=d*(d+o*f+2*a)+f*(o*d+f+2*l)+c}else f=s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*l)+c;else f=-s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*l)+c;else f<=-_?(d=Math.max(0,-(-o*s+a)),f=d>0?-s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c):f<=_?(d=0,f=Math.min(Math.max(-s,-l),s),h=f*(f+2*l)+c):(d=Math.max(0,-(o*s+a)),f=d>0?s:Math.min(Math.max(-s,-l),s),h=-d*d+f*(f+2*l)+c);else f=o>0?-s:s,d=Math.max(0,-(o*f+a)),h=-d*d+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(Ja).addScaledVector(no,f),h}intersectSphere(e,n){ii.subVectors(e.center,this.origin);const i=ii.dot(this.direction),r=ii.dot(ii)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-f.z)*d,l=(e.max.z-f.z)*d):(a=(e.max.z-f.z)*d,l=(e.min.z-f.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,ii)!==null}intersectTriangle(e,n,i,r,s){Qa.subVectors(n,e),io.subVectors(i,e),el.crossVectors(Qa,io);let o=this.direction.dot(el),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Pi.subVectors(this.origin,e);const l=a*this.direction.dot(io.crossVectors(Pi,io));if(l<0)return null;const c=a*this.direction.dot(Qa.cross(Pi));if(c<0||l+c>o)return null;const u=-a*Pi.dot(el);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class hp extends Bs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new tt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xi,this.combine=Wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Uf=new Tt,ji=new dp,ro=new la,Nf=new Z,so=new Z,oo=new Z,ao=new Z,tl=new Z,lo=new Z,Ff=new Z,co=new Z;class Si extends Yt{constructor(e=new Pn,n=new hp){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){lo.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],d=s[l];u!==0&&(tl.fromBufferAttribute(d,e),o?lo.addScaledVector(tl,u):lo.addScaledVector(tl.sub(n),u))}n.add(lo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ro.copy(i.boundingSphere),ro.applyMatrix4(s),ji.copy(e.ray).recast(e.near),!(ro.containsPoint(ji.origin)===!1&&(ji.intersectSphere(ro,Nf)===null||ji.origin.distanceToSquared(Nf)>(e.far-e.near)**2))&&(Uf.copy(s).invert(),ji.copy(e.ray).applyMatrix4(Uf),!(i.boundingBox!==null&&ji.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,ji)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,h=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,v=f.length;_<v;_++){const m=f[_],p=o[m.materialIndex],S=Math.max(m.start,h.start),T=Math.min(a.count,Math.min(m.start+m.count,h.start+h.count));for(let E=S,I=T;E<I;E+=3){const D=a.getX(E),L=a.getX(E+1),x=a.getX(E+2);r=uo(this,p,e,i,c,u,d,D,L,x),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,h.start),v=Math.min(a.count,h.start+h.count);for(let m=_,p=v;m<p;m+=3){const S=a.getX(m),T=a.getX(m+1),E=a.getX(m+2);r=uo(this,o,e,i,c,u,d,S,T,E),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,v=f.length;_<v;_++){const m=f[_],p=o[m.materialIndex],S=Math.max(m.start,h.start),T=Math.min(l.count,Math.min(m.start+m.count,h.start+h.count));for(let E=S,I=T;E<I;E+=3){const D=E,L=E+1,x=E+2;r=uo(this,p,e,i,c,u,d,D,L,x),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,h.start),v=Math.min(l.count,h.start+h.count);for(let m=_,p=v;m<p;m+=3){const S=m,T=m+1,E=m+2;r=uo(this,o,e,i,c,u,d,S,T,E),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function Jv(t,e,n,i,r,s,o,a){let l;if(e.side===rn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===zi,a),l===null)return null;co.copy(a),co.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(co);return c<n.near||c>n.far?null:{distance:c,point:co.clone(),object:t}}function uo(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,so),t.getVertexPosition(l,oo),t.getVertexPosition(c,ao);const u=Jv(t,e,n,i,so,oo,ao,Ff);if(u){const d=new Z;Sn.getBarycoord(Ff,so,oo,ao,d),r&&(u.uv=Sn.getInterpolatedAttribute(r,a,l,c,d,new ut)),s&&(u.uv1=Sn.getInterpolatedAttribute(s,a,l,c,d,new ut)),o&&(u.normal=Sn.getInterpolatedAttribute(o,a,l,c,d,new Z),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new Z,materialIndex:0};Sn.getNormal(so,oo,ao,f.normal),u.face=f,u.barycoord=d}return u}class Qv extends qt{constructor(e=null,n=1,i=1,r,s,o,a,l,c=Ft,u=Ft,d,f){super(null,o,a,l,c,u,r,s,d,f),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const nl=new Z,ex=new Z,tx=new Ye;class tr{constructor(e=new Z(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=nl.subVectors(i,n).cross(ex.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(nl),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||tx.getNormalMatrix(e),r=this.coplanarPoint(nl).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zi=new la,nx=new ut(.5,.5),fo=new Z;class pp{constructor(e=new tr,n=new tr,i=new tr,r=new tr,s=new tr,o=new tr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Gn,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],d=s[5],f=s[6],h=s[7],_=s[8],v=s[9],m=s[10],p=s[11],S=s[12],T=s[13],E=s[14],I=s[15];if(r[0].setComponents(c-o,h-u,p-_,I-S).normalize(),r[1].setComponents(c+o,h+u,p+_,I+S).normalize(),r[2].setComponents(c+a,h+d,p+v,I+T).normalize(),r[3].setComponents(c-a,h-d,p-v,I-T).normalize(),i)r[4].setComponents(l,f,m,E).normalize(),r[5].setComponents(c-l,h-f,p-m,I-E).normalize();else if(r[4].setComponents(c-l,h-f,p-m,I-E).normalize(),n===Gn)r[5].setComponents(c+l,h+f,p+m,I+E).normalize();else if(n===zo)r[5].setComponents(l,f,m,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Zi.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){Zi.center.set(0,0,0);const n=nx.distanceTo(e.center);return Zi.radius=.7071067811865476+n,Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(fo.x=r.normal.x>0?e.max.x:e.min.x,fo.y=r.normal.y>0?e.max.y:e.min.y,fo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(fo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class mp extends Bs{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new tt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Of=new Tt,_c=new dp,ho=new la,po=new Z;class ix extends Yt{constructor(e=new Pn,n=new mp){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ho.copy(i.boundingSphere),ho.applyMatrix4(r),ho.radius+=s,e.ray.intersectsSphere(ho)===!1)return;Of.copy(r).invert(),_c.copy(e.ray).applyMatrix4(Of);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,d=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),h=Math.min(c.count,o.start+o.count);for(let _=f,v=h;_<v;_++){const m=c.getX(_);po.fromBufferAttribute(d,m),Bf(po,m,l,r,e,n,this)}}else{const f=Math.max(0,o.start),h=Math.min(d.count,o.start+o.count);for(let _=f,v=h;_<v;_++)po.fromBufferAttribute(d,_),Bf(po,_,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Bf(t,e,n,i,r,s,o){const a=_c.distanceSqToPoint(t);if(a<n){const l=new Z;_c.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class gp extends qt{constructor(e=[],n=fr,i,r,s,o,a,l,c,u){super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rx extends qt{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Is extends qt{constructor(e,n,i=qn,r,s,o,a=Ft,l=Ft,c,u=vi,d=1){if(u!==vi&&u!==ar)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:n,depth:d};super(f,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new jc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class sx extends Is{constructor(e,n=qn,i=fr,r,s,o=Ft,a=Ft,l,c=vi){const u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,n,i,r,s,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class _p extends qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Vs extends Pn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],d=[];let f=0,h=0;_("z","y","x",-1,-1,i,n,e,o,s,0),_("z","y","x",1,-1,i,n,-e,o,s,1),_("x","z","y",1,1,e,i,n,r,o,2),_("x","z","y",1,-1,e,i,-n,r,o,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new hi(c,3)),this.setAttribute("normal",new hi(u,3)),this.setAttribute("uv",new hi(d,2));function _(v,m,p,S,T,E,I,D,L,x,b){const V=E/L,C=I/x,P=E/2,H=I/2,K=D/2,W=L+1,k=x+1;let F=0,se=0;const ce=new Z;for(let xe=0;xe<k;xe++){const Ee=xe*C-H;for(let _e=0;_e<W;_e++){const ze=_e*V-P;ce[v]=ze*S,ce[m]=Ee*T,ce[p]=K,c.push(ce.x,ce.y,ce.z),ce[v]=0,ce[m]=0,ce[p]=D>0?1:-1,u.push(ce.x,ce.y,ce.z),d.push(_e/L),d.push(1-xe/x),F+=1}}for(let xe=0;xe<x;xe++)for(let Ee=0;Ee<L;Ee++){const _e=f+Ee+W*xe,ze=f+Ee+W*(xe+1),je=f+(Ee+1)+W*(xe+1),Se=f+(Ee+1)+W*xe;l.push(_e,ze,Se),l.push(ze,je,Se),se+=6}a.addGroup(h,se,b),h+=se,f+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class ca extends Pn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,d=e/a,f=n/l,h=[],_=[],v=[],m=[];for(let p=0;p<u;p++){const S=p*f-o;for(let T=0;T<c;T++){const E=T*d-s;_.push(E,-S,0),v.push(0,0,1),m.push(T/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){const T=S+c*p,E=S+c*(p+1),I=S+1+c*(p+1),D=S+1+c*p;h.push(T,E,D),h.push(E,I,D)}this.setIndex(h),this.setAttribute("position",new hi(_,3)),this.setAttribute("normal",new hi(v,3)),this.setAttribute("uv",new hi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ca(e.width,e.height,e.widthSegments,e.heightSegments)}}function Yr(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Kt(t){const e={};for(let n=0;n<t.length;n++){const i=Yr(t[n]);for(const r in i)e[r]=i[r]}return e}function ox(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function vp(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const ax={clone:Yr,merge:Kt};var lx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Yn extends Bs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lx,this.fragmentShader=cx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yr(e.uniforms),this.uniformsGroups=ox(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class ux extends Yn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class fx extends Bs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class dx extends Bs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class hx extends Yt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new tt(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}class px extends hx{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Yt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new tt(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}toJSON(e){const n=super.toJSON(e);return n.object.groundColor=this.groundColor.getHex(),n}}const mo=new Z,go=new jr,Ln=new Z;class xp extends Yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Tt,this.projectionMatrix=new Tt,this.projectionMatrixInverse=new Tt,this.coordinateSystem=Gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(mo,go,Ln),Ln.x===1&&Ln.y===1&&Ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mo,go,Ln.set(1,1,1)).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorld.decompose(mo,go,Ln),Ln.x===1&&Ln.y===1&&Ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(mo,go,Ln.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Di=new Z,Vf=new ut,zf=new ut;class fn extends xp{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=gc*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(La*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gc*2*Math.atan(Math.tan(La*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,n){return this.getViewBounds(e,Vf,zf),n.subVectors(zf,Vf)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(La*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class Sp extends xp{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Rr=-90,Cr=1;class mx extends Yt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new fn(Rr,Cr,e,n);r.layers=this.layers,this.add(r);const s=new fn(Rr,Cr,e,n);s.layers=this.layers,this.add(s);const o=new fn(Rr,Cr,e,n);o.layers=this.layers,this.add(o);const a=new fn(Rr,Cr,e,n);a.layers=this.layers,this.add(a);const l=new fn(Rr,Cr,e,n);l.layers=this.layers,this.add(l);const c=new fn(Rr,Cr,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===Gn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===zo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(d,f,h),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class gx extends fn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class _x{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ge("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=performance.now();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}function Hf(t,e,n,i){const r=vx(i);switch(n){case ip:return t*e;case sp:return t*e/r.components*r.byteLength;case Xc:return t*e/r.components*r.byteLength;case Xr:return t*e*2/r.components*r.byteLength;case qc:return t*e*2/r.components*r.byteLength;case rp:return t*e*3/r.components*r.byteLength;case Mn:return t*e*4/r.components*r.byteLength;case Yc:return t*e*4/r.components*r.byteLength;case To:case Ao:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Ro:case Co:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Vl:case Hl:return Math.max(t,16)*Math.max(e,8)/4;case Bl:case zl:return Math.max(t,8)*Math.max(e,8)/2;case Gl:case kl:case Xl:case ql:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Wl:case Yl:case $l:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Kl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case jl:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Zl:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Jl:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Ql:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case ec:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case tc:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case nc:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case ic:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case rc:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case sc:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case oc:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case ac:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case lc:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case cc:case uc:case fc:return Math.ceil(t/4)*Math.ceil(e/4)*16;case dc:case hc:return Math.ceil(t/4)*Math.ceil(e/4)*8;case pc:case mc:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function vx(t){switch(t){case dn:case Qh:return{byteLength:1,components:1};case Ps:case ep:case _i:return{byteLength:2,components:1};case kc:case Wc:return{byteLength:2,components:4};case qn:case Gc:case Hn:return{byteLength:4,components:1};case tp:case np:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Hc}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Hc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Mp(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function xx(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,d=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,u),a.onUploadCallback();let h;if(c instanceof Float32Array)h=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)h=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?h=t.HALF_FLOAT:h=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)h=t.SHORT;else if(c instanceof Uint32Array)h=t.UNSIGNED_INT;else if(c instanceof Int32Array)h=t.INT;else if(c instanceof Int8Array)h=t.BYTE;else if(c instanceof Uint8Array)h=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)h=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:h,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){const u=l.array,d=l.updateRanges;if(t.bindBuffer(c,a),d.length===0)t.bufferSubData(c,0,u);else{d.sort((h,_)=>h.start-_.start);let f=0;for(let h=1;h<d.length;h++){const _=d[f],v=d[h];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++f,d[f]=v)}d.length=f+1;for(let h=0,_=d.length;h<_;h++){const v=d[h];t.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var Sx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Mx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ex=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,yx=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Tx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ax=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Rx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cx=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,wx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Px=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Dx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ix=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Lx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ux=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Nx=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Fx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ox=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Vx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,zx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Hx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Gx=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,kx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Wx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Xx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,qx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Yx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$x=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jx="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Qx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,eS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,tS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,nS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,iS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,sS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,oS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,aS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,uS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,dS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,hS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_S=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,vS=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,xS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,SS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,MS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ES=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,TS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,AS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,RS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,CS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,PS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,DS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,IS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,LS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,US=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,NS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,FS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,OS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,BS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,VS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,HS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,GS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,kS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,WS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,XS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,YS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$S=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,KS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,jS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ZS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,JS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,QS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,eM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,nM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,iM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,rM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,sM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,oM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,aM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,cM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,uM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,hM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,pM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,mM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,gM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,_M=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,vM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,SM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,MM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,EM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,AM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,RM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,CM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,wM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,PM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,DM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,IM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,UM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,NM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,FM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,BM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,zM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,HM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,GM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,WM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$M=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,KM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ZM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,JM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$e={alphahash_fragment:Sx,alphahash_pars_fragment:Mx,alphamap_fragment:Ex,alphamap_pars_fragment:yx,alphatest_fragment:bx,alphatest_pars_fragment:Tx,aomap_fragment:Ax,aomap_pars_fragment:Rx,batching_pars_vertex:Cx,batching_vertex:wx,begin_vertex:Px,beginnormal_vertex:Dx,bsdfs:Ix,iridescence_fragment:Lx,bumpmap_pars_fragment:Ux,clipping_planes_fragment:Nx,clipping_planes_pars_fragment:Fx,clipping_planes_pars_vertex:Ox,clipping_planes_vertex:Bx,color_fragment:Vx,color_pars_fragment:zx,color_pars_vertex:Hx,color_vertex:Gx,common:kx,cube_uv_reflection_fragment:Wx,defaultnormal_vertex:Xx,displacementmap_pars_vertex:qx,displacementmap_vertex:Yx,emissivemap_fragment:$x,emissivemap_pars_fragment:Kx,colorspace_fragment:jx,colorspace_pars_fragment:Zx,envmap_fragment:Jx,envmap_common_pars_fragment:Qx,envmap_pars_fragment:eS,envmap_pars_vertex:tS,envmap_physical_pars_fragment:dS,envmap_vertex:nS,fog_vertex:iS,fog_pars_vertex:rS,fog_fragment:sS,fog_pars_fragment:oS,gradientmap_pars_fragment:aS,lightmap_pars_fragment:lS,lights_lambert_fragment:cS,lights_lambert_pars_fragment:uS,lights_pars_begin:fS,lights_toon_fragment:hS,lights_toon_pars_fragment:pS,lights_phong_fragment:mS,lights_phong_pars_fragment:gS,lights_physical_fragment:_S,lights_physical_pars_fragment:vS,lights_fragment_begin:xS,lights_fragment_maps:SS,lights_fragment_end:MS,logdepthbuf_fragment:ES,logdepthbuf_pars_fragment:yS,logdepthbuf_pars_vertex:bS,logdepthbuf_vertex:TS,map_fragment:AS,map_pars_fragment:RS,map_particle_fragment:CS,map_particle_pars_fragment:wS,metalnessmap_fragment:PS,metalnessmap_pars_fragment:DS,morphinstance_vertex:IS,morphcolor_vertex:LS,morphnormal_vertex:US,morphtarget_pars_vertex:NS,morphtarget_vertex:FS,normal_fragment_begin:OS,normal_fragment_maps:BS,normal_pars_fragment:VS,normal_pars_vertex:zS,normal_vertex:HS,normalmap_pars_fragment:GS,clearcoat_normal_fragment_begin:kS,clearcoat_normal_fragment_maps:WS,clearcoat_pars_fragment:XS,iridescence_pars_fragment:qS,opaque_fragment:YS,packing:$S,premultiplied_alpha_fragment:KS,project_vertex:jS,dithering_fragment:ZS,dithering_pars_fragment:JS,roughnessmap_fragment:QS,roughnessmap_pars_fragment:eM,shadowmap_pars_fragment:tM,shadowmap_pars_vertex:nM,shadowmap_vertex:iM,shadowmask_pars_fragment:rM,skinbase_vertex:sM,skinning_pars_vertex:oM,skinning_vertex:aM,skinnormal_vertex:lM,specularmap_fragment:cM,specularmap_pars_fragment:uM,tonemapping_fragment:fM,tonemapping_pars_fragment:dM,transmission_fragment:hM,transmission_pars_fragment:pM,uv_pars_fragment:mM,uv_pars_vertex:gM,uv_vertex:_M,worldpos_vertex:vM,background_vert:xM,background_frag:SM,backgroundCube_vert:MM,backgroundCube_frag:EM,cube_vert:yM,cube_frag:bM,depth_vert:TM,depth_frag:AM,distance_vert:RM,distance_frag:CM,equirect_vert:wM,equirect_frag:PM,linedashed_vert:DM,linedashed_frag:IM,meshbasic_vert:LM,meshbasic_frag:UM,meshlambert_vert:NM,meshlambert_frag:FM,meshmatcap_vert:OM,meshmatcap_frag:BM,meshnormal_vert:VM,meshnormal_frag:zM,meshphong_vert:HM,meshphong_frag:GM,meshphysical_vert:kM,meshphysical_frag:WM,meshtoon_vert:XM,meshtoon_frag:qM,points_vert:YM,points_frag:$M,shadow_vert:KM,shadow_frag:jM,sprite_vert:ZM,sprite_frag:JM},Te={common:{diffuse:{value:new tt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new tt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new tt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new tt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},Vn={basic:{uniforms:Kt([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Kt([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new tt(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Kt([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new tt(0)},specular:{value:new tt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Kt([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new tt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Kt([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new tt(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Kt([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Kt([Te.points,Te.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Kt([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Kt([Te.common,Te.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Kt([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Kt([Te.sprite,Te.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:Kt([Te.common,Te.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:Kt([Te.lights,Te.fog,{color:{value:new tt(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};Vn.physical={uniforms:Kt([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new tt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new tt(0)},specularColor:{value:new tt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const _o={r:0,b:0,g:0},Ji=new xi,QM=new Tt;function eE(t,e,n,i,r,s){const o=new tt(0);let a=r===!0?0:1,l,c,u=null,d=0,f=null;function h(S){let T=S.isScene===!0?S.background:null;if(T&&T.isTexture){const E=S.backgroundBlurriness>0;T=e.get(T,E)}return T}function _(S){let T=!1;const E=h(S);E===null?m(o,a):E&&E.isColor&&(m(E,1),T=!0);const I=t.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,s):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||T)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function v(S,T){const E=h(T);E&&(E.isCubeTexture||E.mapping===aa)?(c===void 0&&(c=new Si(new Vs(1,1,1),new Yn({name:"BackgroundCubeMaterial",uniforms:Yr(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(I,D,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),Ji.copy(T.backgroundRotation),Ji.x*=-1,Ji.y*=-1,Ji.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Ji.y*=-1,Ji.z*=-1),c.material.uniforms.envMap.value=E,c.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(QM.makeRotationFromEuler(Ji)),c.material.toneMapped=Je.getTransfer(E.colorSpace)!==at,(u!==E||d!==E.version||f!==t.toneMapping)&&(c.material.needsUpdate=!0,u=E,d=E.version,f=t.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new Si(new ca(2,2),new Yn({name:"BackgroundMaterial",uniforms:Yr(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:zi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Je.getTransfer(E.colorSpace)!==at,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||d!==E.version||f!==t.toneMapping)&&(l.material.needsUpdate=!0,u=E,d=E.version,f=t.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,T){S.getRGB(_o,vp(t)),n.buffers.color.setClear(_o.r,_o.g,_o.b,T,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,T=1){o.set(S),a=T,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:_,addToRenderList:v,dispose:p}}function tE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(C,P,H,K,W){let k=!1;const F=d(C,K,H,P);s!==F&&(s=F,c(s.object)),k=h(C,K,H,W),k&&_(C,K,H,W),W!==null&&e.update(W,t.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,E(C,P,H,K),W!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return t.createVertexArray()}function c(C){return t.bindVertexArray(C)}function u(C){return t.deleteVertexArray(C)}function d(C,P,H,K){const W=K.wireframe===!0;let k=i[P.id];k===void 0&&(k={},i[P.id]=k);const F=C.isInstancedMesh===!0?C.id:0;let se=k[F];se===void 0&&(se={},k[F]=se);let ce=se[H.id];ce===void 0&&(ce={},se[H.id]=ce);let xe=ce[W];return xe===void 0&&(xe=f(l()),ce[W]=xe),xe}function f(C){const P=[],H=[],K=[];for(let W=0;W<n;W++)P[W]=0,H[W]=0,K[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:H,attributeDivisors:K,object:C,attributes:{},index:null}}function h(C,P,H,K){const W=s.attributes,k=P.attributes;let F=0;const se=H.getAttributes();for(const ce in se)if(se[ce].location>=0){const Ee=W[ce];let _e=k[ce];if(_e===void 0&&(ce==="instanceMatrix"&&C.instanceMatrix&&(_e=C.instanceMatrix),ce==="instanceColor"&&C.instanceColor&&(_e=C.instanceColor)),Ee===void 0||Ee.attribute!==_e||_e&&Ee.data!==_e.data)return!0;F++}return s.attributesNum!==F||s.index!==K}function _(C,P,H,K){const W={},k=P.attributes;let F=0;const se=H.getAttributes();for(const ce in se)if(se[ce].location>=0){let Ee=k[ce];Ee===void 0&&(ce==="instanceMatrix"&&C.instanceMatrix&&(Ee=C.instanceMatrix),ce==="instanceColor"&&C.instanceColor&&(Ee=C.instanceColor));const _e={};_e.attribute=Ee,Ee&&Ee.data&&(_e.data=Ee.data),W[ce]=_e,F++}s.attributes=W,s.attributesNum=F,s.index=K}function v(){const C=s.newAttributes;for(let P=0,H=C.length;P<H;P++)C[P]=0}function m(C){p(C,0)}function p(C,P){const H=s.newAttributes,K=s.enabledAttributes,W=s.attributeDivisors;H[C]=1,K[C]===0&&(t.enableVertexAttribArray(C),K[C]=1),W[C]!==P&&(t.vertexAttribDivisor(C,P),W[C]=P)}function S(){const C=s.newAttributes,P=s.enabledAttributes;for(let H=0,K=P.length;H<K;H++)P[H]!==C[H]&&(t.disableVertexAttribArray(H),P[H]=0)}function T(C,P,H,K,W,k,F){F===!0?t.vertexAttribIPointer(C,P,H,W,k):t.vertexAttribPointer(C,P,H,K,W,k)}function E(C,P,H,K){v();const W=K.attributes,k=H.getAttributes(),F=P.defaultAttributeValues;for(const se in k){const ce=k[se];if(ce.location>=0){let xe=W[se];if(xe===void 0&&(se==="instanceMatrix"&&C.instanceMatrix&&(xe=C.instanceMatrix),se==="instanceColor"&&C.instanceColor&&(xe=C.instanceColor)),xe!==void 0){const Ee=xe.normalized,_e=xe.itemSize,ze=e.get(xe);if(ze===void 0)continue;const je=ze.buffer,Se=ze.type,z=ze.bytesPerElement,N=Se===t.INT||Se===t.UNSIGNED_INT||xe.gpuType===Gc;if(xe.isInterleavedBufferAttribute){const j=xe.data,oe=j.stride,ue=xe.offset;if(j.isInstancedInterleavedBuffer){for(let me=0;me<ce.locationSize;me++)p(ce.location+me,j.meshPerAttribute);C.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let me=0;me<ce.locationSize;me++)m(ce.location+me);t.bindBuffer(t.ARRAY_BUFFER,je);for(let me=0;me<ce.locationSize;me++)T(ce.location+me,_e/ce.locationSize,Se,Ee,oe*z,(ue+_e/ce.locationSize*me)*z,N)}else{if(xe.isInstancedBufferAttribute){for(let j=0;j<ce.locationSize;j++)p(ce.location+j,xe.meshPerAttribute);C.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=xe.meshPerAttribute*xe.count)}else for(let j=0;j<ce.locationSize;j++)m(ce.location+j);t.bindBuffer(t.ARRAY_BUFFER,je);for(let j=0;j<ce.locationSize;j++)T(ce.location+j,_e/ce.locationSize,Se,Ee,_e*z,_e/ce.locationSize*j*z,N)}}else if(F!==void 0){const Ee=F[se];if(Ee!==void 0)switch(Ee.length){case 2:t.vertexAttrib2fv(ce.location,Ee);break;case 3:t.vertexAttrib3fv(ce.location,Ee);break;case 4:t.vertexAttrib4fv(ce.location,Ee);break;default:t.vertexAttrib1fv(ce.location,Ee)}}}}S()}function I(){b();for(const C in i){const P=i[C];for(const H in P){const K=P[H];for(const W in K){const k=K[W];for(const F in k)u(k[F].object),delete k[F];delete K[W]}}delete i[C]}}function D(C){if(i[C.id]===void 0)return;const P=i[C.id];for(const H in P){const K=P[H];for(const W in K){const k=K[W];for(const F in k)u(k[F].object),delete k[F];delete K[W]}}delete i[C.id]}function L(C){for(const P in i){const H=i[P];for(const K in H){const W=H[K];if(W[C.id]===void 0)continue;const k=W[C.id];for(const F in k)u(k[F].object),delete k[F];delete W[C.id]}}}function x(C){for(const P in i){const H=i[P],K=C.isInstancedMesh===!0?C.id:0,W=H[K];if(W!==void 0){for(const k in W){const F=W[k];for(const se in F)u(F[se].object),delete F[se];delete W[k]}delete H[K],Object.keys(H).length===0&&delete i[P]}}}function b(){V(),o=!0,s!==r&&(s=r,c(s.object))}function V(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:b,resetDefaultState:V,dispose:I,releaseStatesOfGeometry:D,releaseStatesOfObject:x,releaseStatesOfProgram:L,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function nE(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,d){d!==0&&(t.drawArraysInstanced(i,c,u,d),n.update(u,i,d))}function a(c,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,d);let h=0;for(let _=0;_<d;_++)h+=u[_];n.update(h,i,1)}function l(c,u,d,f){if(d===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let _=0;_<c.length;_++)o(c[_],u[_],f[_]);else{h.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,d);let _=0;for(let v=0;v<d;v++)_+=u[v]*f[v];n.update(_,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function iE(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const L=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(L){return!(L!==Mn&&i.convert(L)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(L){const x=L===_i&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(L!==dn&&i.convert(L)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&L!==Hn&&!x)}function l(L){if(L==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(Ge("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),h=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),S=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),T=t.getParameter(t.MAX_VARYING_VECTORS),E=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),I=t.getParameter(t.MAX_SAMPLES),D=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:h,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:T,maxFragmentUniforms:E,maxSamples:I,samples:D}}function rE(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new tr,a=new Ye,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const h=d.length!==0||f||i!==0||r;return r=f,i=d.length,h},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){n=u(d,f,0)},this.setState=function(d,f,h){const _=d.clippingPlanes,v=d.clipIntersection,m=d.clipShadows,p=t.get(d);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const S=s?0:i,T=S*4;let E=p.clippingState||null;l.value=E,E=u(_,f,T,h);for(let I=0;I!==T;++I)E[I]=n[I];p.clippingState=E,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,f,h,_){const v=d!==null?d.length:0;let m=null;if(v!==0){if(m=l.value,_!==!0||m===null){const p=h+v*4,S=f.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,E=h;T!==v;++T,E+=4)o.copy(d[T]).applyMatrix4(S,a),o.normal.toArray(m,E),m[E+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}const Fi=4,Gf=[.125,.215,.35,.446,.526,.582],rr=20,sE=256,as=new Sp,kf=new tt;let il=null,rl=0,sl=0,ol=!1;const oE=new Z;class Wf{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:o=256,position:a=oE}=s;il=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Yf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=qf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(il,rl,sl),this._renderer.xr.enabled=ol,e.scissorTest=!1,wr(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===fr||e.mapping===Wr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),il=this._renderer.getRenderTarget(),rl=this._renderer.getActiveCubeFace(),sl=this._renderer.getActiveMipmapLevel(),ol=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Wt,minFilter:Wt,generateMipmaps:!1,type:_i,format:Mn,colorSpace:qr,depthBuffer:!1},r=Xf(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xf(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=aE(s)),this._blurMaterial=cE(s,e,n),this._ggxMaterial=lE(s,e,n)}return r}_compileMaterial(e){const n=new Si(new Pn,e);this._renderer.compile(n,as)}_sceneToCubeUV(e,n,i,r,s){const l=new fn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(kf),d.toneMapping=Wn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Si(new Vs,new hp({name:"PMREM.Background",side:rn,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,p=!0):(m.color.copy(kf),p=!0);for(let T=0;T<6;T++){const E=T%3;E===0?(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[T],s.y,s.z)):E===1?(l.up.set(0,0,c[T]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[T],s.z)):(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[T]));const I=this._cubeSize;wr(r,E*I,T>2?I:0,I,I),d.setRenderTarget(r),p&&d.render(v,l),d.render(e,l)}d.toneMapping=h,d.autoClear=f,e.background=S}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===fr||e.mapping===Wr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Yf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=qf());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;wr(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,as)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),f=0+c*1.25,h=d*f,{_lodMax:_}=this,v=this._sizeLods[i],m=3*v*(i>_-Fi?i-_+Fi:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=h,l.mipInt.value=_-n,wr(s,m,p,3*v,2*v),r.setRenderTarget(s),r.render(a,as),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=_-i,wr(e,m,p,3*v,2*v),r.setRenderTarget(e),r.render(a,as)}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&et("blur direction must be either latitudinal or longitudinal!");const u=3,d=this._lodMeshes[r];d.material=c;const f=c.uniforms,h=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*rr-1),v=s/_,m=isFinite(s)?1+Math.floor(u*v):rr;m>rr&&Ge(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${rr}`);const p=[];let S=0;for(let L=0;L<rr;++L){const x=L/v,b=Math.exp(-x*x/2);p.push(b),L===0?S+=b:L<m&&(S+=2*b)}for(let L=0;L<p.length;L++)p[L]=p[L]/S;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:T}=this;f.dTheta.value=_,f.mipInt.value=T-i;const E=this._sizeLods[r],I=3*E*(r>T-Fi?r-T+Fi:0),D=4*(this._cubeSize-E);wr(n,I,D,3*E,2*E),l.setRenderTarget(n),l.render(d,as)}}function aE(t){const e=[],n=[],i=[];let r=t;const s=t-Fi+1+Gf.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>t-Fi?l=Gf[o-t+Fi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,d=1+c,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,_=6,v=3,m=2,p=1,S=new Float32Array(v*_*h),T=new Float32Array(m*_*h),E=new Float32Array(p*_*h);for(let D=0;D<h;D++){const L=D%3*2/3-1,x=D>2?0:-1,b=[L,x,0,L+2/3,x,0,L+2/3,x+1,0,L,x,0,L+2/3,x+1,0,L,x+1,0];S.set(b,v*_*D),T.set(f,m*_*D);const V=[D,D,D,D,D,D];E.set(V,p*_*D)}const I=new Pn;I.setAttribute("position",new Tn(S,v)),I.setAttribute("uv",new Tn(T,m)),I.setAttribute("faceIndex",new Tn(E,p)),i.push(new Si(I,null)),r>Fi&&r--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function Xf(t,e,n){const i=new Xn(t,e,n);return i.texture.mapping=aa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function wr(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function lE(t,e,n){return new Yn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:sE,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ua(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function cE(t,e,n){const i=new Float32Array(rr),r=new Z(0,1,0);return new Yn({name:"SphericalGaussianBlur",defines:{n:rr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ua(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function qf(){return new Yn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ua(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Yf(){return new Yn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ua(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function ua(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Ep extends Xn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new gp(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Vs(5,5,5),s=new Yn({name:"CubemapFromEquirect",uniforms:Yr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:rn,blending:fi});s.uniforms.tEquirect.value=n;const o=new Si(r,s),a=n.minFilter;return n.minFilter===or&&(n.minFilter=Wt),new mx(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}function uE(t){let e=new WeakMap,n=new WeakMap,i=null;function r(f,h=!1){return f==null?null:h?o(f):s(f)}function s(f){if(f&&f.isTexture){const h=f.mapping;if(h===Pa||h===Da)if(e.has(f)){const _=e.get(f).texture;return a(_,f.mapping)}else{const _=f.image;if(_&&_.height>0){const v=new Ep(_.height);return v.fromEquirectangularTexture(t,f),e.set(f,v),f.addEventListener("dispose",c),a(v.texture,f.mapping)}else return null}}return f}function o(f){if(f&&f.isTexture){const h=f.mapping,_=h===Pa||h===Da,v=h===fr||h===Wr;if(_||v){let m=n.get(f);const p=m!==void 0?m.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==p)return i===null&&(i=new Wf(t)),m=_?i.fromEquirectangular(f,m):i.fromCubemap(f,m),m.texture.pmremVersion=f.pmremVersion,n.set(f,m),m.texture;if(m!==void 0)return m.texture;{const S=f.image;return _&&S&&S.height>0||v&&S&&l(S)?(i===null&&(i=new Wf(t)),m=_?i.fromEquirectangular(f):i.fromCubemap(f),m.texture.pmremVersion=f.pmremVersion,n.set(f,m),f.addEventListener("dispose",u),m.texture):null}}}return f}function a(f,h){return h===Pa?f.mapping=fr:h===Da&&(f.mapping=Wr),f}function l(f){let h=0;const _=6;for(let v=0;v<_;v++)f[v]!==void 0&&h++;return h===_}function c(f){const h=f.target;h.removeEventListener("dispose",c);const _=e.get(h);_!==void 0&&(e.delete(h),_.dispose())}function u(f){const h=f.target;h.removeEventListener("dispose",u);const _=n.get(h);_!==void 0&&(n.delete(h),_.dispose())}function d(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function fE(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Go("WebGLRenderer: "+i+" extension not supported."),r}}}function dE(t,e,n,i){const r={},s=new WeakMap;function o(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",o),delete r[f.id];const h=s.get(f);h&&(e.remove(h),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function a(d,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,n.memory.geometries++),f}function l(d){const f=d.attributes;for(const h in f)e.update(f[h],t.ARRAY_BUFFER)}function c(d){const f=[],h=d.index,_=d.attributes.position;let v=0;if(_===void 0)return;if(h!==null){const S=h.array;v=h.version;for(let T=0,E=S.length;T<E;T+=3){const I=S[T+0],D=S[T+1],L=S[T+2];f.push(I,D,D,L,L,I)}}else{const S=_.array;v=_.version;for(let T=0,E=S.length/3-1;T<E;T+=3){const I=T+0,D=T+1,L=T+2;f.push(I,D,D,L,L,I)}}const m=new(_.count>=65535?fp:up)(f,1);m.version=v;const p=s.get(d);p&&e.remove(p),s.set(d,m)}function u(d){const f=s.get(d);if(f){const h=d.index;h!==null&&f.version<h.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function hE(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,h){t.drawElements(i,h,s,f*o),n.update(h,i,1)}function c(f,h,_){_!==0&&(t.drawElementsInstanced(i,h,s,f*o,_),n.update(h,i,_))}function u(f,h,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,f,0,_);let m=0;for(let p=0;p<_;p++)m+=h[p];n.update(m,i,1)}function d(f,h,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)c(f[p]/o,h[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,h,0,s,f,0,v,0,_);let p=0;for(let S=0;S<_;S++)p+=h[S]*v[S];n.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function pE(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:et("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function mE(t,e,n){const i=new WeakMap,r=new bt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==d){let V=function(){x.dispose(),i.delete(a),a.removeEventListener("dispose",V)};var h=V;f!==void 0&&f.texture.dispose();const _=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],T=a.morphAttributes.color||[];let E=0;_===!0&&(E=1),v===!0&&(E=2),m===!0&&(E=3);let I=a.attributes.position.count*E,D=1;I>e.maxTextureSize&&(D=Math.ceil(I/e.maxTextureSize),I=e.maxTextureSize);const L=new Float32Array(I*D*4*d),x=new ap(L,I,D,d);x.type=Hn,x.needsUpdate=!0;const b=E*4;for(let C=0;C<d;C++){const P=p[C],H=S[C],K=T[C],W=I*D*4*C;for(let k=0;k<P.count;k++){const F=k*b;_===!0&&(r.fromBufferAttribute(P,k),L[W+F+0]=r.x,L[W+F+1]=r.y,L[W+F+2]=r.z,L[W+F+3]=0),v===!0&&(r.fromBufferAttribute(H,k),L[W+F+4]=r.x,L[W+F+5]=r.y,L[W+F+6]=r.z,L[W+F+7]=0),m===!0&&(r.fromBufferAttribute(K,k),L[W+F+8]=r.x,L[W+F+9]=r.y,L[W+F+10]=r.z,L[W+F+11]=K.itemSize===4?r.w:1)}}f={count:d,texture:x,size:new ut(I,D)},i.set(a,f),a.addEventListener("dispose",V)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let _=0;for(let m=0;m<c.length;m++)_+=c[m];const v=a.morphTargetsRelative?1:1-_;l.getUniforms().setValue(t,"morphTargetBaseInfluence",v),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function gE(t,e,n,i,r){let s=new WeakMap;function o(c){const u=r.render.frame,d=c.geometry,f=e.get(c,d);if(s.get(f)!==u&&(e.update(f),s.set(f,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const h=c.skeleton;s.get(h)!==u&&(h.update(),s.set(h,u))}return f}function a(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}const _E={[Xh]:"LINEAR_TONE_MAPPING",[qh]:"REINHARD_TONE_MAPPING",[Yh]:"CINEON_TONE_MAPPING",[$h]:"ACES_FILMIC_TONE_MAPPING",[jh]:"AGX_TONE_MAPPING",[Zh]:"NEUTRAL_TONE_MAPPING",[Kh]:"CUSTOM_TONE_MAPPING"};function vE(t,e,n,i,r){const s=new Xn(e,n,{type:t,depthBuffer:i,stencilBuffer:r}),o=new Xn(e,n,{type:_i,depthBuffer:!1,stencilBuffer:!1}),a=new Pn;a.setAttribute("position",new hi([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new hi([0,2,0,0,2,0],2));const l=new ux({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Si(a,l),u=new Sp(-1,1,1,-1,0,1);let d=null,f=null,h=!1,_,v=null,m=[],p=!1;this.setSize=function(S,T){s.setSize(S,T),o.setSize(S,T);for(let E=0;E<m.length;E++){const I=m[E];I.setSize&&I.setSize(S,T)}},this.setEffects=function(S){m=S,p=m.length>0&&m[0].isRenderPass===!0;const T=s.width,E=s.height;for(let I=0;I<m.length;I++){const D=m[I];D.setSize&&D.setSize(T,E)}},this.begin=function(S,T){if(h||S.toneMapping===Wn&&m.length===0)return!1;if(v=T,T!==null){const E=T.width,I=T.height;(s.width!==E||s.height!==I)&&this.setSize(E,I)}return p===!1&&S.setRenderTarget(s),_=S.toneMapping,S.toneMapping=Wn,!0},this.hasRenderPass=function(){return p},this.end=function(S,T){S.toneMapping=_,h=!0;let E=s,I=o;for(let D=0;D<m.length;D++){const L=m[D];if(L.enabled!==!1&&(L.render(S,I,E,T),L.needsSwap!==!1)){const x=E;E=I,I=x}}if(d!==S.outputColorSpace||f!==S.toneMapping){d=S.outputColorSpace,f=S.toneMapping,l.defines={},Je.getTransfer(d)===at&&(l.defines.SRGB_TRANSFER="");const D=_E[f];D&&(l.defines[D]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=E.texture,S.setRenderTarget(v),S.render(c,u),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const yp=new qt,vc=new Is(1,1),bp=new ap,Tp=new Vv,Ap=new gp,$f=[],Kf=[],jf=new Float32Array(16),Zf=new Float32Array(9),Jf=new Float32Array(4);function Zr(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=$f[r];if(s===void 0&&(s=new Float32Array(r),$f[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function wt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Pt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function fa(t,e){let n=Kf[e];n===void 0&&(n=new Int32Array(e),Kf[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function xE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function SE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(wt(n,e))return;t.uniform2fv(this.addr,e),Pt(n,e)}}function ME(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(wt(n,e))return;t.uniform3fv(this.addr,e),Pt(n,e)}}function EE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(wt(n,e))return;t.uniform4fv(this.addr,e),Pt(n,e)}}function yE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(wt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Pt(n,e)}else{if(wt(n,i))return;Jf.set(i),t.uniformMatrix2fv(this.addr,!1,Jf),Pt(n,i)}}function bE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(wt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Pt(n,e)}else{if(wt(n,i))return;Zf.set(i),t.uniformMatrix3fv(this.addr,!1,Zf),Pt(n,i)}}function TE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(wt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Pt(n,e)}else{if(wt(n,i))return;jf.set(i),t.uniformMatrix4fv(this.addr,!1,jf),Pt(n,i)}}function AE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function RE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(wt(n,e))return;t.uniform2iv(this.addr,e),Pt(n,e)}}function CE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(wt(n,e))return;t.uniform3iv(this.addr,e),Pt(n,e)}}function wE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(wt(n,e))return;t.uniform4iv(this.addr,e),Pt(n,e)}}function PE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function DE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(wt(n,e))return;t.uniform2uiv(this.addr,e),Pt(n,e)}}function IE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(wt(n,e))return;t.uniform3uiv(this.addr,e),Pt(n,e)}}function LE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(wt(n,e))return;t.uniform4uiv(this.addr,e),Pt(n,e)}}function UE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(vc.compareFunction=n.isReversedDepthBuffer()?Kc:$c,s=vc):s=yp,n.setTexture2D(e||s,r)}function NE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Tp,r)}function FE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Ap,r)}function OE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||bp,r)}function BE(t){switch(t){case 5126:return xE;case 35664:return SE;case 35665:return ME;case 35666:return EE;case 35674:return yE;case 35675:return bE;case 35676:return TE;case 5124:case 35670:return AE;case 35667:case 35671:return RE;case 35668:case 35672:return CE;case 35669:case 35673:return wE;case 5125:return PE;case 36294:return DE;case 36295:return IE;case 36296:return LE;case 35678:case 36198:case 36298:case 36306:case 35682:return UE;case 35679:case 36299:case 36307:return NE;case 35680:case 36300:case 36308:case 36293:return FE;case 36289:case 36303:case 36311:case 36292:return OE}}function VE(t,e){t.uniform1fv(this.addr,e)}function zE(t,e){const n=Zr(e,this.size,2);t.uniform2fv(this.addr,n)}function HE(t,e){const n=Zr(e,this.size,3);t.uniform3fv(this.addr,n)}function GE(t,e){const n=Zr(e,this.size,4);t.uniform4fv(this.addr,n)}function kE(t,e){const n=Zr(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function WE(t,e){const n=Zr(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function XE(t,e){const n=Zr(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function qE(t,e){t.uniform1iv(this.addr,e)}function YE(t,e){t.uniform2iv(this.addr,e)}function $E(t,e){t.uniform3iv(this.addr,e)}function KE(t,e){t.uniform4iv(this.addr,e)}function jE(t,e){t.uniform1uiv(this.addr,e)}function ZE(t,e){t.uniform2uiv(this.addr,e)}function JE(t,e){t.uniform3uiv(this.addr,e)}function QE(t,e){t.uniform4uiv(this.addr,e)}function ey(t,e,n){const i=this.cache,r=e.length,s=fa(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=vc:o=yp;for(let a=0;a!==r;++a)n.setTexture2D(e[a]||o,s[a])}function ty(t,e,n){const i=this.cache,r=e.length,s=fa(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||Tp,s[o])}function ny(t,e,n){const i=this.cache,r=e.length,s=fa(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Ap,s[o])}function iy(t,e,n){const i=this.cache,r=e.length,s=fa(n,r);wt(i,s)||(t.uniform1iv(this.addr,s),Pt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||bp,s[o])}function ry(t){switch(t){case 5126:return VE;case 35664:return zE;case 35665:return HE;case 35666:return GE;case 35674:return kE;case 35675:return WE;case 35676:return XE;case 5124:case 35670:return qE;case 35667:case 35671:return YE;case 35668:case 35672:return $E;case 35669:case 35673:return KE;case 5125:return jE;case 36294:return ZE;case 36295:return JE;case 36296:return QE;case 35678:case 36198:case 36298:case 36306:case 35682:return ey;case 35679:case 36299:case 36307:return ty;case 35680:case 36300:case 36308:case 36293:return ny;case 36289:case 36303:case 36311:case 36292:return iy}}class sy{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=BE(n.type)}}class oy{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=ry(n.type)}}class ay{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const al=/(\w+)(\])?(\[|\.)?/g;function Qf(t,e){t.seq.push(e),t.map[e.id]=e}function ly(t,e,n){const i=t.name,r=i.length;for(al.lastIndex=0;;){const s=al.exec(i),o=al.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Qf(n,c===void 0?new sy(a,t,e):new oy(a,t,e));break}else{let d=n.map[a];d===void 0&&(d=new ay(a),Qf(n,d)),n=d}}}class wo{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);ly(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function ed(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const cy=37297;let uy=0;function fy(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const td=new Ye;function dy(t){Je._getMatrix(td,Je.workingColorSpace,t);const e=`mat3( ${td.elements.map(n=>n.toFixed(4))} )`;switch(Je.getTransfer(t)){case Vo:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function nd(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+fy(t.getShaderSource(e),a)}else return s}function hy(t,e){const n=dy(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const py={[Xh]:"Linear",[qh]:"Reinhard",[Yh]:"Cineon",[$h]:"ACESFilmic",[jh]:"AgX",[Zh]:"Neutral",[Kh]:"Custom"};function my(t,e){const n=py[e];return n===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const vo=new Z;function gy(){Je.getLuminanceCoefficients(vo);const t=vo.x.toFixed(4),e=vo.y.toFixed(4),n=vo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function _y(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fs).join(`
`)}function vy(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function xy(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function fs(t){return t!==""}function id(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rd(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Sy=/^[ \t]*#include +<([\w\d./]+)>/gm;function xc(t){return t.replace(Sy,Ey)}const My=new Map;function Ey(t,e){let n=$e[e];if(n===void 0){const i=My.get(e);if(i!==void 0)n=$e[i],Ge('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return xc(n)}const yy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sd(t){return t.replace(yy,by)}function by(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function od(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Ty={[bo]:"SHADOWMAP_TYPE_PCF",[us]:"SHADOWMAP_TYPE_VSM"};function Ay(t){return Ty[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ry={[fr]:"ENVMAP_TYPE_CUBE",[Wr]:"ENVMAP_TYPE_CUBE",[aa]:"ENVMAP_TYPE_CUBE_UV"};function Cy(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":Ry[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const wy={[Wr]:"ENVMAP_MODE_REFRACTION"};function Py(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":wy[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Dy={[Wh]:"ENVMAP_BLENDING_MULTIPLY",[_v]:"ENVMAP_BLENDING_MIX",[vv]:"ENVMAP_BLENDING_ADD"};function Iy(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":Dy[t.combine]||"ENVMAP_BLENDING_NONE"}function Ly(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function Uy(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=Ay(n),c=Cy(n),u=Py(n),d=Iy(n),f=Ly(n),h=_y(n),_=vy(s),v=r.createProgram();let m,p,S=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(fs).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(fs).join(`
`),p.length>0&&(p+=`
`)):(m=[od(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),p=[od(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Wn?"#define TONE_MAPPING":"",n.toneMapping!==Wn?$e.tonemapping_pars_fragment:"",n.toneMapping!==Wn?my("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,hy("linearToOutputTexel",n.outputColorSpace),gy(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(fs).join(`
`)),o=xc(o),o=id(o,n),o=rd(o,n),a=xc(a),a=id(a,n),a=rd(a,n),o=sd(o),a=sd(a),n.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===Sf?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Sf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const T=S+m+o,E=S+p+a,I=ed(r,r.VERTEX_SHADER,T),D=ed(r,r.FRAGMENT_SHADER,E);r.attachShader(v,I),r.attachShader(v,D),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function L(C){if(t.debug.checkShaderErrors){const P=r.getProgramInfoLog(v)||"",H=r.getShaderInfoLog(I)||"",K=r.getShaderInfoLog(D)||"",W=P.trim(),k=H.trim(),F=K.trim();let se=!0,ce=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(se=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,I,D);else{const xe=nd(r,I,"vertex"),Ee=nd(r,D,"fragment");et("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+W+`
`+xe+`
`+Ee)}else W!==""?Ge("WebGLProgram: Program Info Log:",W):(k===""||F==="")&&(ce=!1);ce&&(C.diagnostics={runnable:se,programLog:W,vertexShader:{log:k,prefix:m},fragmentShader:{log:F,prefix:p}})}r.deleteShader(I),r.deleteShader(D),x=new wo(r,v),b=xy(r,v)}let x;this.getUniforms=function(){return x===void 0&&L(this),x};let b;this.getAttributes=function(){return b===void 0&&L(this),b};let V=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return V===!1&&(V=r.getProgramParameter(v,cy)),V},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=uy++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=D,this}let Ny=0;class Fy{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new Oy(e),n.set(e,i)),i}}class Oy{constructor(e){this.id=Ny++,this.code=e,this.usedTimes=0}}function By(t,e,n,i,r,s){const o=new lp,a=new Fy,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer;let f=i.precision;const h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,b,V,C,P){const H=C.fog,K=P.geometry,W=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?C.environment:null,k=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,F=e.get(x.envMap||W,k),se=F&&F.mapping===aa?F.image.height:null,ce=h[x.type];x.precision!==null&&(f=i.getMaxPrecision(x.precision),f!==x.precision&&Ge("WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const xe=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Ee=xe!==void 0?xe.length:0;let _e=0;K.morphAttributes.position!==void 0&&(_e=1),K.morphAttributes.normal!==void 0&&(_e=2),K.morphAttributes.color!==void 0&&(_e=3);let ze,je,Se,z;if(ce){const ot=Vn[ce];ze=ot.vertexShader,je=ot.fragmentShader}else ze=x.vertexShader,je=x.fragmentShader,a.update(x),Se=a.getVertexShaderID(x),z=a.getFragmentShaderID(x);const N=t.getRenderTarget(),j=t.state.buffers.depth.getReversed(),oe=P.isInstancedMesh===!0,ue=P.isBatchedMesh===!0,me=!!x.map,R=!!x.matcap,w=!!F,O=!!x.aoMap,Q=!!x.lightMap,J=!!x.bumpMap,te=!!x.normalMap,A=!!x.displacementMap,fe=!!x.emissiveMap,ae=!!x.metalnessMap,re=!!x.roughnessMap,le=x.anisotropy>0,M=x.clearcoat>0,g=x.dispersion>0,U=x.iridescence>0,X=x.sheen>0,ne=x.transmission>0,q=le&&!!x.anisotropyMap,ye=M&&!!x.clearcoatMap,he=M&&!!x.clearcoatNormalMap,Ie=M&&!!x.clearcoatRoughnessMap,Fe=U&&!!x.iridescenceMap,de=U&&!!x.iridescenceThicknessMap,ge=X&&!!x.sheenColorMap,be=X&&!!x.sheenRoughnessMap,we=!!x.specularMap,Pe=!!x.specularColorMap,Xe=!!x.specularIntensityMap,B=ne&&!!x.transmissionMap,Me=ne&&!!x.thicknessMap,ve=!!x.gradientMap,Le=!!x.alphaMap,pe=x.alphaTest>0,ie=!!x.alphaHash,Ue=!!x.extensions;let ke=Wn;x.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(ke=t.toneMapping);const pt={shaderID:ce,shaderType:x.type,shaderName:x.name,vertexShader:ze,fragmentShader:je,defines:x.defines,customVertexShaderID:Se,customFragmentShaderID:z,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:ue,batchingColor:ue&&P._colorsTexture!==null,instancing:oe,instancingColor:oe&&P.instanceColor!==null,instancingMorph:oe&&P.morphTexture!==null,outputColorSpace:N===null?t.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:qr,alphaToCoverage:!!x.alphaToCoverage,map:me,matcap:R,envMap:w,envMapMode:w&&F.mapping,envMapCubeUVHeight:se,aoMap:O,lightMap:Q,bumpMap:J,normalMap:te,displacementMap:A,emissiveMap:fe,normalMapObjectSpace:te&&x.normalMapType===Ev,normalMapTangentSpace:te&&x.normalMapType===Mv,metalnessMap:ae,roughnessMap:re,anisotropy:le,anisotropyMap:q,clearcoat:M,clearcoatMap:ye,clearcoatNormalMap:he,clearcoatRoughnessMap:Ie,dispersion:g,iridescence:U,iridescenceMap:Fe,iridescenceThicknessMap:de,sheen:X,sheenColorMap:ge,sheenRoughnessMap:be,specularMap:we,specularColorMap:Pe,specularIntensityMap:Xe,transmission:ne,transmissionMap:B,thicknessMap:Me,gradientMap:ve,opaque:x.transparent===!1&&x.blending===Or&&x.alphaToCoverage===!1,alphaMap:Le,alphaTest:pe,alphaHash:ie,combine:x.combine,mapUv:me&&_(x.map.channel),aoMapUv:O&&_(x.aoMap.channel),lightMapUv:Q&&_(x.lightMap.channel),bumpMapUv:J&&_(x.bumpMap.channel),normalMapUv:te&&_(x.normalMap.channel),displacementMapUv:A&&_(x.displacementMap.channel),emissiveMapUv:fe&&_(x.emissiveMap.channel),metalnessMapUv:ae&&_(x.metalnessMap.channel),roughnessMapUv:re&&_(x.roughnessMap.channel),anisotropyMapUv:q&&_(x.anisotropyMap.channel),clearcoatMapUv:ye&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:he&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ie&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Fe&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:de&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&_(x.sheenRoughnessMap.channel),specularMapUv:we&&_(x.specularMap.channel),specularColorMapUv:Pe&&_(x.specularColorMap.channel),specularIntensityMapUv:Xe&&_(x.specularIntensityMap.channel),transmissionMapUv:B&&_(x.transmissionMap.channel),thicknessMapUv:Me&&_(x.thicknessMap.channel),alphaMapUv:Le&&_(x.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(te||le),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!K.attributes.uv&&(me||Le),fog:!!H,useFog:x.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||K.attributes.normal===void 0&&te===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:P.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:_e,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:t.shadowMap.enabled&&V.length>0,shadowMapType:t.shadowMap.type,toneMapping:ke,decodeVideoTexture:me&&x.map.isVideoTexture===!0&&Je.getTransfer(x.map.colorSpace)===at,decodeVideoTextureEmissive:fe&&x.emissiveMap.isVideoTexture===!0&&Je.getTransfer(x.emissiveMap.colorSpace)===at,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===ci,flipSided:x.side===rn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Ue&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&x.extensions.multiDraw===!0||ue)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return pt.vertexUv1s=l.has(1),pt.vertexUv2s=l.has(2),pt.vertexUv3s=l.has(3),l.clear(),pt}function m(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const V in x.defines)b.push(V),b.push(x.defines[V]);return x.isRawShaderMaterial===!1&&(p(b,x),S(b,x),b.push(t.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function p(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function S(x,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),x.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),x.push(o.mask)}function T(x){const b=h[x.type];let V;if(b){const C=Vn[b];V=ax.clone(C.uniforms)}else V=x.uniforms;return V}function E(x,b){let V=u.get(b);return V!==void 0?++V.usedTimes:(V=new Uy(t,b,x,r),c.push(V),u.set(b,V)),V}function I(x){if(--x.usedTimes===0){const b=c.indexOf(x);c[b]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function D(x){a.remove(x)}function L(){a.dispose()}return{getParameters:v,getProgramCacheKey:m,getUniforms:T,acquireProgram:E,releaseProgram:I,releaseShaderCache:D,programs:c,dispose:L}}function Vy(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function zy(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function ad(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function ld(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(f){let h=0;return f.isInstancedMesh&&(h+=2),f.isSkinnedMesh&&(h+=1),h}function a(f,h,_,v,m,p){let S=t[e];return S===void 0?(S={id:f.id,object:f,geometry:h,material:_,materialVariant:o(f),groupOrder:v,renderOrder:f.renderOrder,z:m,group:p},t[e]=S):(S.id=f.id,S.object=f,S.geometry=h,S.material=_,S.materialVariant=o(f),S.groupOrder=v,S.renderOrder=f.renderOrder,S.z=m,S.group=p),e++,S}function l(f,h,_,v,m,p){const S=a(f,h,_,v,m,p);_.transmission>0?i.push(S):_.transparent===!0?r.push(S):n.push(S)}function c(f,h,_,v,m,p){const S=a(f,h,_,v,m,p);_.transmission>0?i.unshift(S):_.transparent===!0?r.unshift(S):n.unshift(S)}function u(f,h){n.length>1&&n.sort(f||zy),i.length>1&&i.sort(h||ad),r.length>1&&r.sort(h||ad)}function d(){for(let f=e,h=t.length;f<h;f++){const _=t[f];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:d,sort:u}}function Hy(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new ld,t.set(i,[o])):r>=s.length?(o=new ld,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function Gy(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new Z,color:new tt};break;case"SpotLight":n={position:new Z,direction:new Z,color:new tt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new Z,color:new tt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new Z,skyColor:new tt,groundColor:new tt};break;case"RectAreaLight":n={color:new tt,position:new Z,halfWidth:new Z,halfHeight:new Z};break}return t[e.id]=n,n}}}function ky(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let Wy=0;function Xy(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function qy(t){const e=new Gy,n=ky(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new Z);const r=new Z,s=new Tt,o=new Tt;function a(c){let u=0,d=0,f=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let h=0,_=0,v=0,m=0,p=0,S=0,T=0,E=0,I=0,D=0,L=0;c.sort(Xy);for(let b=0,V=c.length;b<V;b++){const C=c[b],P=C.color,H=C.intensity,K=C.distance;let W=null;if(C.shadow&&C.shadow.map&&(C.shadow.map.texture.format===Xr?W=C.shadow.map.texture:W=C.shadow.map.depthTexture||C.shadow.map.texture),C.isAmbientLight)u+=P.r*H,d+=P.g*H,f+=P.b*H;else if(C.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(C.sh.coefficients[k],H);L++}else if(C.isDirectionalLight){const k=e.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const F=C.shadow,se=n.get(C);se.shadowIntensity=F.intensity,se.shadowBias=F.bias,se.shadowNormalBias=F.normalBias,se.shadowRadius=F.radius,se.shadowMapSize=F.mapSize,i.directionalShadow[h]=se,i.directionalShadowMap[h]=W,i.directionalShadowMatrix[h]=C.shadow.matrix,S++}i.directional[h]=k,h++}else if(C.isSpotLight){const k=e.get(C);k.position.setFromMatrixPosition(C.matrixWorld),k.color.copy(P).multiplyScalar(H),k.distance=K,k.coneCos=Math.cos(C.angle),k.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),k.decay=C.decay,i.spot[v]=k;const F=C.shadow;if(C.map&&(i.spotLightMap[I]=C.map,I++,F.updateMatrices(C),C.castShadow&&D++),i.spotLightMatrix[v]=F.matrix,C.castShadow){const se=n.get(C);se.shadowIntensity=F.intensity,se.shadowBias=F.bias,se.shadowNormalBias=F.normalBias,se.shadowRadius=F.radius,se.shadowMapSize=F.mapSize,i.spotShadow[v]=se,i.spotShadowMap[v]=W,E++}v++}else if(C.isRectAreaLight){const k=e.get(C);k.color.copy(P).multiplyScalar(H),k.halfWidth.set(C.width*.5,0,0),k.halfHeight.set(0,C.height*.5,0),i.rectArea[m]=k,m++}else if(C.isPointLight){const k=e.get(C);if(k.color.copy(C.color).multiplyScalar(C.intensity),k.distance=C.distance,k.decay=C.decay,C.castShadow){const F=C.shadow,se=n.get(C);se.shadowIntensity=F.intensity,se.shadowBias=F.bias,se.shadowNormalBias=F.normalBias,se.shadowRadius=F.radius,se.shadowMapSize=F.mapSize,se.shadowCameraNear=F.camera.near,se.shadowCameraFar=F.camera.far,i.pointShadow[_]=se,i.pointShadowMap[_]=W,i.pointShadowMatrix[_]=C.shadow.matrix,T++}i.point[_]=k,_++}else if(C.isHemisphereLight){const k=e.get(C);k.skyColor.copy(C.color).multiplyScalar(H),k.groundColor.copy(C.groundColor).multiplyScalar(H),i.hemi[p]=k,p++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Te.LTC_FLOAT_1,i.rectAreaLTC2=Te.LTC_FLOAT_2):(i.rectAreaLTC1=Te.LTC_HALF_1,i.rectAreaLTC2=Te.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=f;const x=i.hash;(x.directionalLength!==h||x.pointLength!==_||x.spotLength!==v||x.rectAreaLength!==m||x.hemiLength!==p||x.numDirectionalShadows!==S||x.numPointShadows!==T||x.numSpotShadows!==E||x.numSpotMaps!==I||x.numLightProbes!==L)&&(i.directional.length=h,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=E+I-D,i.spotLightMap.length=I,i.numSpotLightShadowsWithMaps=D,i.numLightProbes=L,x.directionalLength=h,x.pointLength=_,x.spotLength=v,x.rectAreaLength=m,x.hemiLength=p,x.numDirectionalShadows=S,x.numPointShadows=T,x.numSpotShadows=E,x.numSpotMaps=I,x.numLightProbes=L,i.version=Wy++)}function l(c,u){let d=0,f=0,h=0,_=0,v=0;const m=u.matrixWorldInverse;for(let p=0,S=c.length;p<S;p++){const T=c[p];if(T.isDirectionalLight){const E=i.directional[d];E.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),d++}else if(T.isSpotLight){const E=i.spot[h];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(T.matrixWorld),r.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(m),h++}else if(T.isRectAreaLight){const E=i.rectArea[_];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(m),o.identity(),s.copy(T.matrixWorld),s.premultiply(m),o.extractRotation(s),E.halfWidth.set(T.width*.5,0,0),E.halfHeight.set(0,T.height*.5,0),E.halfWidth.applyMatrix4(o),E.halfHeight.applyMatrix4(o),_++}else if(T.isPointLight){const E=i.point[f];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(m),f++}else if(T.isHemisphereLight){const E=i.hemi[v];E.direction.setFromMatrixPosition(T.matrixWorld),E.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:i}}function cd(t){const e=new qy(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function o(u){i.push(u)}function a(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function Yy(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new cd(t),e.set(r,[a])):s>=o.length?(a=new cd(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}const $y=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ky=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,jy=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],Zy=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],ud=new Tt,ls=new Z,ll=new Z;function Jy(t,e,n){let i=new pp;const r=new ut,s=new ut,o=new bt,a=new fx,l=new dx,c={},u=n.maxTextureSize,d={[zi]:rn,[rn]:zi,[ci]:ci},f=new Yn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:$y,fragmentShader:Ky}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const _=new Pn;_.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Si(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bo;let p=this.type;this.render=function(D,L,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||D.length===0)return;this.type===J0&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=bo);const b=t.getRenderTarget(),V=t.getActiveCubeFace(),C=t.getActiveMipmapLevel(),P=t.state;P.setBlending(fi),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);const H=p!==this.type;H&&L.traverse(function(K){K.material&&(Array.isArray(K.material)?K.material.forEach(W=>W.needsUpdate=!0):K.material.needsUpdate=!0)});for(let K=0,W=D.length;K<W;K++){const k=D[K],F=k.shadow;if(F===void 0){Ge("WebGLShadowMap:",k,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;r.copy(F.mapSize);const se=F.getFrameExtents();r.multiply(se),s.copy(F.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/se.x),r.x=s.x*se.x,F.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/se.y),r.y=s.y*se.y,F.mapSize.y=s.y));const ce=t.state.buffers.depth.getReversed();if(F.camera._reversedDepth=ce,F.map===null||H===!0){if(F.map!==null&&(F.map.depthTexture!==null&&(F.map.depthTexture.dispose(),F.map.depthTexture=null),F.map.dispose()),this.type===us){if(k.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}F.map=new Xn(r.x,r.y,{format:Xr,type:_i,minFilter:Wt,magFilter:Wt,generateMipmaps:!1}),F.map.texture.name=k.name+".shadowMap",F.map.depthTexture=new Is(r.x,r.y,Hn),F.map.depthTexture.name=k.name+".shadowMapDepth",F.map.depthTexture.format=vi,F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=Ft,F.map.depthTexture.magFilter=Ft}else k.isPointLight?(F.map=new Ep(r.x),F.map.depthTexture=new sx(r.x,qn)):(F.map=new Xn(r.x,r.y),F.map.depthTexture=new Is(r.x,r.y,qn)),F.map.depthTexture.name=k.name+".shadowMap",F.map.depthTexture.format=vi,this.type===bo?(F.map.depthTexture.compareFunction=ce?Kc:$c,F.map.depthTexture.minFilter=Wt,F.map.depthTexture.magFilter=Wt):(F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=Ft,F.map.depthTexture.magFilter=Ft);F.camera.updateProjectionMatrix()}const xe=F.map.isWebGLCubeRenderTarget?6:1;for(let Ee=0;Ee<xe;Ee++){if(F.map.isWebGLCubeRenderTarget)t.setRenderTarget(F.map,Ee),t.clear();else{Ee===0&&(t.setRenderTarget(F.map),t.clear());const _e=F.getViewport(Ee);o.set(s.x*_e.x,s.y*_e.y,s.x*_e.z,s.y*_e.w),P.viewport(o)}if(k.isPointLight){const _e=F.camera,ze=F.matrix,je=k.distance||_e.far;je!==_e.far&&(_e.far=je,_e.updateProjectionMatrix()),ls.setFromMatrixPosition(k.matrixWorld),_e.position.copy(ls),ll.copy(_e.position),ll.add(jy[Ee]),_e.up.copy(Zy[Ee]),_e.lookAt(ll),_e.updateMatrixWorld(),ze.makeTranslation(-ls.x,-ls.y,-ls.z),ud.multiplyMatrices(_e.projectionMatrix,_e.matrixWorldInverse),F._frustum.setFromProjectionMatrix(ud,_e.coordinateSystem,_e.reversedDepth)}else F.updateMatrices(k);i=F.getFrustum(),E(L,x,F.camera,k,this.type)}F.isPointLightShadow!==!0&&this.type===us&&S(F,x),F.needsUpdate=!1}p=this.type,m.needsUpdate=!1,t.setRenderTarget(b,V,C)};function S(D,L){const x=e.update(v);f.defines.VSM_SAMPLES!==D.blurSamples&&(f.defines.VSM_SAMPLES=D.blurSamples,h.defines.VSM_SAMPLES=D.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new Xn(r.x,r.y,{format:Xr,type:_i})),f.uniforms.shadow_pass.value=D.map.depthTexture,f.uniforms.resolution.value=D.mapSize,f.uniforms.radius.value=D.radius,t.setRenderTarget(D.mapPass),t.clear(),t.renderBufferDirect(L,null,x,f,v,null),h.uniforms.shadow_pass.value=D.mapPass.texture,h.uniforms.resolution.value=D.mapSize,h.uniforms.radius.value=D.radius,t.setRenderTarget(D.map),t.clear(),t.renderBufferDirect(L,null,x,h,v,null)}function T(D,L,x,b){let V=null;const C=x.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(C!==void 0)V=C;else if(V=x.isPointLight===!0?l:a,t.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){const P=V.uuid,H=L.uuid;let K=c[P];K===void 0&&(K={},c[P]=K);let W=K[H];W===void 0&&(W=V.clone(),K[H]=W,L.addEventListener("dispose",I)),V=W}if(V.visible=L.visible,V.wireframe=L.wireframe,b===us?V.side=L.shadowSide!==null?L.shadowSide:L.side:V.side=L.shadowSide!==null?L.shadowSide:d[L.side],V.alphaMap=L.alphaMap,V.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,V.map=L.map,V.clipShadows=L.clipShadows,V.clippingPlanes=L.clippingPlanes,V.clipIntersection=L.clipIntersection,V.displacementMap=L.displacementMap,V.displacementScale=L.displacementScale,V.displacementBias=L.displacementBias,V.wireframeLinewidth=L.wireframeLinewidth,V.linewidth=L.linewidth,x.isPointLight===!0&&V.isMeshDistanceMaterial===!0){const P=t.properties.get(V);P.light=x}return V}function E(D,L,x,b,V){if(D.visible===!1)return;if(D.layers.test(L.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&V===us)&&(!D.frustumCulled||i.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,D.matrixWorld);const H=e.update(D),K=D.material;if(Array.isArray(K)){const W=H.groups;for(let k=0,F=W.length;k<F;k++){const se=W[k],ce=K[se.materialIndex];if(ce&&ce.visible){const xe=T(D,ce,b,V);D.onBeforeShadow(t,D,L,x,H,xe,se),t.renderBufferDirect(x,null,H,xe,D,se),D.onAfterShadow(t,D,L,x,H,xe,se)}}}else if(K.visible){const W=T(D,K,b,V);D.onBeforeShadow(t,D,L,x,H,W,null),t.renderBufferDirect(x,null,H,W,D,null),D.onAfterShadow(t,D,L,x,H,W,null)}}const P=D.children;for(let H=0,K=P.length;H<K;H++)E(P[H],L,x,b,V)}function I(D){D.target.removeEventListener("dispose",I);for(const x in c){const b=c[x],V=D.target.uuid;V in b&&(b[V].dispose(),delete b[V])}}}function Qy(t,e){function n(){let B=!1;const Me=new bt;let ve=null;const Le=new bt(0,0,0,0);return{setMask:function(pe){ve!==pe&&!B&&(t.colorMask(pe,pe,pe,pe),ve=pe)},setLocked:function(pe){B=pe},setClear:function(pe,ie,Ue,ke,pt){pt===!0&&(pe*=ke,ie*=ke,Ue*=ke),Me.set(pe,ie,Ue,ke),Le.equals(Me)===!1&&(t.clearColor(pe,ie,Ue,ke),Le.copy(Me))},reset:function(){B=!1,ve=null,Le.set(-1,0,0,0)}}}function i(){let B=!1,Me=!1,ve=null,Le=null,pe=null;return{setReversed:function(ie){if(Me!==ie){const Ue=e.get("EXT_clip_control");ie?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),Me=ie;const ke=pe;pe=null,this.setClear(ke)}},getReversed:function(){return Me},setTest:function(ie){ie?N(t.DEPTH_TEST):j(t.DEPTH_TEST)},setMask:function(ie){ve!==ie&&!B&&(t.depthMask(ie),ve=ie)},setFunc:function(ie){if(Me&&(ie=Iv[ie]),Le!==ie){switch(ie){case wl:t.depthFunc(t.NEVER);break;case Pl:t.depthFunc(t.ALWAYS);break;case Dl:t.depthFunc(t.LESS);break;case kr:t.depthFunc(t.LEQUAL);break;case Il:t.depthFunc(t.EQUAL);break;case Ll:t.depthFunc(t.GEQUAL);break;case Ul:t.depthFunc(t.GREATER);break;case Nl:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Le=ie}},setLocked:function(ie){B=ie},setClear:function(ie){pe!==ie&&(pe=ie,Me&&(ie=1-ie),t.clearDepth(ie))},reset:function(){B=!1,ve=null,Le=null,pe=null,Me=!1}}}function r(){let B=!1,Me=null,ve=null,Le=null,pe=null,ie=null,Ue=null,ke=null,pt=null;return{setTest:function(ot){B||(ot?N(t.STENCIL_TEST):j(t.STENCIL_TEST))},setMask:function(ot){Me!==ot&&!B&&(t.stencilMask(ot),Me=ot)},setFunc:function(ot,$n,Kn){(ve!==ot||Le!==$n||pe!==Kn)&&(t.stencilFunc(ot,$n,Kn),ve=ot,Le=$n,pe=Kn)},setOp:function(ot,$n,Kn){(ie!==ot||Ue!==$n||ke!==Kn)&&(t.stencilOp(ot,$n,Kn),ie=ot,Ue=$n,ke=Kn)},setLocked:function(ot){B=ot},setClear:function(ot){pt!==ot&&(t.clearStencil(ot),pt=ot)},reset:function(){B=!1,Me=null,ve=null,Le=null,pe=null,ie=null,Ue=null,ke=null,pt=null}}}const s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},d={},f=new WeakMap,h=[],_=null,v=!1,m=null,p=null,S=null,T=null,E=null,I=null,D=null,L=new tt(0,0,0),x=0,b=!1,V=null,C=null,P=null,H=null,K=null;const W=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,F=0;const se=t.getParameter(t.VERSION);se.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(se)[1]),k=F>=1):se.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),k=F>=2);let ce=null,xe={};const Ee=t.getParameter(t.SCISSOR_BOX),_e=t.getParameter(t.VIEWPORT),ze=new bt().fromArray(Ee),je=new bt().fromArray(_e);function Se(B,Me,ve,Le){const pe=new Uint8Array(4),ie=t.createTexture();t.bindTexture(B,ie),t.texParameteri(B,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(B,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ue=0;Ue<ve;Ue++)B===t.TEXTURE_3D||B===t.TEXTURE_2D_ARRAY?t.texImage3D(Me,0,t.RGBA,1,1,Le,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(Me+Ue,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return ie}const z={};z[t.TEXTURE_2D]=Se(t.TEXTURE_2D,t.TEXTURE_2D,1),z[t.TEXTURE_CUBE_MAP]=Se(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),z[t.TEXTURE_2D_ARRAY]=Se(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),z[t.TEXTURE_3D]=Se(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),N(t.DEPTH_TEST),o.setFunc(kr),J(!1),te(mf),N(t.CULL_FACE),O(fi);function N(B){u[B]!==!0&&(t.enable(B),u[B]=!0)}function j(B){u[B]!==!1&&(t.disable(B),u[B]=!1)}function oe(B,Me){return d[B]!==Me?(t.bindFramebuffer(B,Me),d[B]=Me,B===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=Me),B===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=Me),!0):!1}function ue(B,Me){let ve=h,Le=!1;if(B){ve=f.get(Me),ve===void 0&&(ve=[],f.set(Me,ve));const pe=B.textures;if(ve.length!==pe.length||ve[0]!==t.COLOR_ATTACHMENT0){for(let ie=0,Ue=pe.length;ie<Ue;ie++)ve[ie]=t.COLOR_ATTACHMENT0+ie;ve.length=pe.length,Le=!0}}else ve[0]!==t.BACK&&(ve[0]=t.BACK,Le=!0);Le&&t.drawBuffers(ve)}function me(B){return _!==B?(t.useProgram(B),_=B,!0):!1}const R={[ir]:t.FUNC_ADD,[ev]:t.FUNC_SUBTRACT,[tv]:t.FUNC_REVERSE_SUBTRACT};R[nv]=t.MIN,R[iv]=t.MAX;const w={[rv]:t.ZERO,[sv]:t.ONE,[ov]:t.SRC_COLOR,[Rl]:t.SRC_ALPHA,[dv]:t.SRC_ALPHA_SATURATE,[uv]:t.DST_COLOR,[lv]:t.DST_ALPHA,[av]:t.ONE_MINUS_SRC_COLOR,[Cl]:t.ONE_MINUS_SRC_ALPHA,[fv]:t.ONE_MINUS_DST_COLOR,[cv]:t.ONE_MINUS_DST_ALPHA,[hv]:t.CONSTANT_COLOR,[pv]:t.ONE_MINUS_CONSTANT_COLOR,[mv]:t.CONSTANT_ALPHA,[gv]:t.ONE_MINUS_CONSTANT_ALPHA};function O(B,Me,ve,Le,pe,ie,Ue,ke,pt,ot){if(B===fi){v===!0&&(j(t.BLEND),v=!1);return}if(v===!1&&(N(t.BLEND),v=!0),B!==Q0){if(B!==m||ot!==b){if((p!==ir||E!==ir)&&(t.blendEquation(t.FUNC_ADD),p=ir,E=ir),ot)switch(B){case Or:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Al:t.blendFunc(t.ONE,t.ONE);break;case gf:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case _f:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:et("WebGLState: Invalid blending: ",B);break}else switch(B){case Or:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Al:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case gf:et("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _f:et("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:et("WebGLState: Invalid blending: ",B);break}S=null,T=null,I=null,D=null,L.set(0,0,0),x=0,m=B,b=ot}return}pe=pe||Me,ie=ie||ve,Ue=Ue||Le,(Me!==p||pe!==E)&&(t.blendEquationSeparate(R[Me],R[pe]),p=Me,E=pe),(ve!==S||Le!==T||ie!==I||Ue!==D)&&(t.blendFuncSeparate(w[ve],w[Le],w[ie],w[Ue]),S=ve,T=Le,I=ie,D=Ue),(ke.equals(L)===!1||pt!==x)&&(t.blendColor(ke.r,ke.g,ke.b,pt),L.copy(ke),x=pt),m=B,b=!1}function Q(B,Me){B.side===ci?j(t.CULL_FACE):N(t.CULL_FACE);let ve=B.side===rn;Me&&(ve=!ve),J(ve),B.blending===Or&&B.transparent===!1?O(fi):O(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);const Le=B.stencilWrite;a.setTest(Le),Le&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),fe(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?N(t.SAMPLE_ALPHA_TO_COVERAGE):j(t.SAMPLE_ALPHA_TO_COVERAGE)}function J(B){V!==B&&(B?t.frontFace(t.CW):t.frontFace(t.CCW),V=B)}function te(B){B!==j0?(N(t.CULL_FACE),B!==C&&(B===mf?t.cullFace(t.BACK):B===Z0?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):j(t.CULL_FACE),C=B}function A(B){B!==P&&(k&&t.lineWidth(B),P=B)}function fe(B,Me,ve){B?(N(t.POLYGON_OFFSET_FILL),(H!==Me||K!==ve)&&(H=Me,K=ve,o.getReversed()&&(Me=-Me),t.polygonOffset(Me,ve))):j(t.POLYGON_OFFSET_FILL)}function ae(B){B?N(t.SCISSOR_TEST):j(t.SCISSOR_TEST)}function re(B){B===void 0&&(B=t.TEXTURE0+W-1),ce!==B&&(t.activeTexture(B),ce=B)}function le(B,Me,ve){ve===void 0&&(ce===null?ve=t.TEXTURE0+W-1:ve=ce);let Le=xe[ve];Le===void 0&&(Le={type:void 0,texture:void 0},xe[ve]=Le),(Le.type!==B||Le.texture!==Me)&&(ce!==ve&&(t.activeTexture(ve),ce=ve),t.bindTexture(B,Me||z[B]),Le.type=B,Le.texture=Me)}function M(){const B=xe[ce];B!==void 0&&B.type!==void 0&&(t.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function g(){try{t.compressedTexImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function U(){try{t.compressedTexImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function X(){try{t.texSubImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function ne(){try{t.texSubImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function q(){try{t.compressedTexSubImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function ye(){try{t.compressedTexSubImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function he(){try{t.texStorage2D(...arguments)}catch(B){et("WebGLState:",B)}}function Ie(){try{t.texStorage3D(...arguments)}catch(B){et("WebGLState:",B)}}function Fe(){try{t.texImage2D(...arguments)}catch(B){et("WebGLState:",B)}}function de(){try{t.texImage3D(...arguments)}catch(B){et("WebGLState:",B)}}function ge(B){ze.equals(B)===!1&&(t.scissor(B.x,B.y,B.z,B.w),ze.copy(B))}function be(B){je.equals(B)===!1&&(t.viewport(B.x,B.y,B.z,B.w),je.copy(B))}function we(B,Me){let ve=c.get(Me);ve===void 0&&(ve=new WeakMap,c.set(Me,ve));let Le=ve.get(B);Le===void 0&&(Le=t.getUniformBlockIndex(Me,B.name),ve.set(B,Le))}function Pe(B,Me){const Le=c.get(Me).get(B);l.get(Me)!==Le&&(t.uniformBlockBinding(Me,Le,B.__bindingPointIndex),l.set(Me,Le))}function Xe(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},ce=null,xe={},d={},f=new WeakMap,h=[],_=null,v=!1,m=null,p=null,S=null,T=null,E=null,I=null,D=null,L=new tt(0,0,0),x=0,b=!1,V=null,C=null,P=null,H=null,K=null,ze.set(0,0,t.canvas.width,t.canvas.height),je.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:N,disable:j,bindFramebuffer:oe,drawBuffers:ue,useProgram:me,setBlending:O,setMaterial:Q,setFlipSided:J,setCullFace:te,setLineWidth:A,setPolygonOffset:fe,setScissorTest:ae,activeTexture:re,bindTexture:le,unbindTexture:M,compressedTexImage2D:g,compressedTexImage3D:U,texImage2D:Fe,texImage3D:de,updateUBOMapping:we,uniformBlockBinding:Pe,texStorage2D:he,texStorage3D:Ie,texSubImage2D:X,texSubImage3D:ne,compressedTexSubImage2D:q,compressedTexSubImage3D:ye,scissor:ge,viewport:be,reset:Xe}}function eb(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,u=new WeakMap;let d;const f=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(M,g){return h?new OffscreenCanvas(M,g):Ho("canvas")}function v(M,g,U){let X=1;const ne=le(M);if((ne.width>U||ne.height>U)&&(X=U/Math.max(ne.width,ne.height)),X<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){const q=Math.floor(X*ne.width),ye=Math.floor(X*ne.height);d===void 0&&(d=_(q,ye));const he=g?_(q,ye):d;return he.width=q,he.height=ye,he.getContext("2d").drawImage(M,0,0,q,ye),Ge("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+q+"x"+ye+")."),he}else return"data"in M&&Ge("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),M;return M}function m(M){return M.generateMipmaps}function p(M){t.generateMipmap(M)}function S(M){return M.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?t.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function T(M,g,U,X,ne=!1){if(M!==null){if(t[M]!==void 0)return t[M];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let q=g;if(g===t.RED&&(U===t.FLOAT&&(q=t.R32F),U===t.HALF_FLOAT&&(q=t.R16F),U===t.UNSIGNED_BYTE&&(q=t.R8)),g===t.RED_INTEGER&&(U===t.UNSIGNED_BYTE&&(q=t.R8UI),U===t.UNSIGNED_SHORT&&(q=t.R16UI),U===t.UNSIGNED_INT&&(q=t.R32UI),U===t.BYTE&&(q=t.R8I),U===t.SHORT&&(q=t.R16I),U===t.INT&&(q=t.R32I)),g===t.RG&&(U===t.FLOAT&&(q=t.RG32F),U===t.HALF_FLOAT&&(q=t.RG16F),U===t.UNSIGNED_BYTE&&(q=t.RG8)),g===t.RG_INTEGER&&(U===t.UNSIGNED_BYTE&&(q=t.RG8UI),U===t.UNSIGNED_SHORT&&(q=t.RG16UI),U===t.UNSIGNED_INT&&(q=t.RG32UI),U===t.BYTE&&(q=t.RG8I),U===t.SHORT&&(q=t.RG16I),U===t.INT&&(q=t.RG32I)),g===t.RGB_INTEGER&&(U===t.UNSIGNED_BYTE&&(q=t.RGB8UI),U===t.UNSIGNED_SHORT&&(q=t.RGB16UI),U===t.UNSIGNED_INT&&(q=t.RGB32UI),U===t.BYTE&&(q=t.RGB8I),U===t.SHORT&&(q=t.RGB16I),U===t.INT&&(q=t.RGB32I)),g===t.RGBA_INTEGER&&(U===t.UNSIGNED_BYTE&&(q=t.RGBA8UI),U===t.UNSIGNED_SHORT&&(q=t.RGBA16UI),U===t.UNSIGNED_INT&&(q=t.RGBA32UI),U===t.BYTE&&(q=t.RGBA8I),U===t.SHORT&&(q=t.RGBA16I),U===t.INT&&(q=t.RGBA32I)),g===t.RGB&&(U===t.UNSIGNED_INT_5_9_9_9_REV&&(q=t.RGB9_E5),U===t.UNSIGNED_INT_10F_11F_11F_REV&&(q=t.R11F_G11F_B10F)),g===t.RGBA){const ye=ne?Vo:Je.getTransfer(X);U===t.FLOAT&&(q=t.RGBA32F),U===t.HALF_FLOAT&&(q=t.RGBA16F),U===t.UNSIGNED_BYTE&&(q=ye===at?t.SRGB8_ALPHA8:t.RGBA8),U===t.UNSIGNED_SHORT_4_4_4_4&&(q=t.RGBA4),U===t.UNSIGNED_SHORT_5_5_5_1&&(q=t.RGB5_A1)}return(q===t.R16F||q===t.R32F||q===t.RG16F||q===t.RG32F||q===t.RGBA16F||q===t.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function E(M,g){let U;return M?g===null||g===qn||g===Ds?U=t.DEPTH24_STENCIL8:g===Hn?U=t.DEPTH32F_STENCIL8:g===Ps&&(U=t.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===qn||g===Ds?U=t.DEPTH_COMPONENT24:g===Hn?U=t.DEPTH_COMPONENT32F:g===Ps&&(U=t.DEPTH_COMPONENT16),U}function I(M,g){return m(M)===!0||M.isFramebufferTexture&&M.minFilter!==Ft&&M.minFilter!==Wt?Math.log2(Math.max(g.width,g.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?g.mipmaps.length:1}function D(M){const g=M.target;g.removeEventListener("dispose",D),x(g),g.isVideoTexture&&u.delete(g)}function L(M){const g=M.target;g.removeEventListener("dispose",L),V(g)}function x(M){const g=i.get(M);if(g.__webglInit===void 0)return;const U=M.source,X=f.get(U);if(X){const ne=X[g.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&b(M),Object.keys(X).length===0&&f.delete(U)}i.remove(M)}function b(M){const g=i.get(M);t.deleteTexture(g.__webglTexture);const U=M.source,X=f.get(U);delete X[g.__cacheKey],o.memory.textures--}function V(M){const g=i.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),i.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(g.__webglFramebuffer[X]))for(let ne=0;ne<g.__webglFramebuffer[X].length;ne++)t.deleteFramebuffer(g.__webglFramebuffer[X][ne]);else t.deleteFramebuffer(g.__webglFramebuffer[X]);g.__webglDepthbuffer&&t.deleteRenderbuffer(g.__webglDepthbuffer[X])}else{if(Array.isArray(g.__webglFramebuffer))for(let X=0;X<g.__webglFramebuffer.length;X++)t.deleteFramebuffer(g.__webglFramebuffer[X]);else t.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&t.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&t.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let X=0;X<g.__webglColorRenderbuffer.length;X++)g.__webglColorRenderbuffer[X]&&t.deleteRenderbuffer(g.__webglColorRenderbuffer[X]);g.__webglDepthRenderbuffer&&t.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const U=M.textures;for(let X=0,ne=U.length;X<ne;X++){const q=i.get(U[X]);q.__webglTexture&&(t.deleteTexture(q.__webglTexture),o.memory.textures--),i.remove(U[X])}i.remove(M)}let C=0;function P(){C=0}function H(){const M=C;return M>=r.maxTextures&&Ge("WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+r.maxTextures),C+=1,M}function K(M){const g=[];return g.push(M.wrapS),g.push(M.wrapT),g.push(M.wrapR||0),g.push(M.magFilter),g.push(M.minFilter),g.push(M.anisotropy),g.push(M.internalFormat),g.push(M.format),g.push(M.type),g.push(M.generateMipmaps),g.push(M.premultiplyAlpha),g.push(M.flipY),g.push(M.unpackAlignment),g.push(M.colorSpace),g.join()}function W(M,g){const U=i.get(M);if(M.isVideoTexture&&ae(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&U.__version!==M.version){const X=M.image;if(X===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{z(U,M,g);return}}else M.isExternalTexture&&(U.__webglTexture=M.sourceTexture?M.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,U.__webglTexture,t.TEXTURE0+g)}function k(M,g){const U=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&U.__version!==M.version){z(U,M,g);return}else M.isExternalTexture&&(U.__webglTexture=M.sourceTexture?M.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,U.__webglTexture,t.TEXTURE0+g)}function F(M,g){const U=i.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&U.__version!==M.version){z(U,M,g);return}n.bindTexture(t.TEXTURE_3D,U.__webglTexture,t.TEXTURE0+g)}function se(M,g){const U=i.get(M);if(M.isCubeDepthTexture!==!0&&M.version>0&&U.__version!==M.version){N(U,M,g);return}n.bindTexture(t.TEXTURE_CUBE_MAP,U.__webglTexture,t.TEXTURE0+g)}const ce={[Fl]:t.REPEAT,[ui]:t.CLAMP_TO_EDGE,[Ol]:t.MIRRORED_REPEAT},xe={[Ft]:t.NEAREST,[xv]:t.NEAREST_MIPMAP_NEAREST,[Ys]:t.NEAREST_MIPMAP_LINEAR,[Wt]:t.LINEAR,[Ia]:t.LINEAR_MIPMAP_NEAREST,[or]:t.LINEAR_MIPMAP_LINEAR},Ee={[yv]:t.NEVER,[Cv]:t.ALWAYS,[bv]:t.LESS,[$c]:t.LEQUAL,[Tv]:t.EQUAL,[Kc]:t.GEQUAL,[Av]:t.GREATER,[Rv]:t.NOTEQUAL};function _e(M,g){if(g.type===Hn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Wt||g.magFilter===Ia||g.magFilter===Ys||g.magFilter===or||g.minFilter===Wt||g.minFilter===Ia||g.minFilter===Ys||g.minFilter===or)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(M,t.TEXTURE_WRAP_S,ce[g.wrapS]),t.texParameteri(M,t.TEXTURE_WRAP_T,ce[g.wrapT]),(M===t.TEXTURE_3D||M===t.TEXTURE_2D_ARRAY)&&t.texParameteri(M,t.TEXTURE_WRAP_R,ce[g.wrapR]),t.texParameteri(M,t.TEXTURE_MAG_FILTER,xe[g.magFilter]),t.texParameteri(M,t.TEXTURE_MIN_FILTER,xe[g.minFilter]),g.compareFunction&&(t.texParameteri(M,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(M,t.TEXTURE_COMPARE_FUNC,Ee[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Ft||g.minFilter!==Ys&&g.minFilter!==or||g.type===Hn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||i.get(g).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");t.texParameterf(M,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,r.getMaxAnisotropy())),i.get(g).__currentAnisotropy=g.anisotropy}}}function ze(M,g){let U=!1;M.__webglInit===void 0&&(M.__webglInit=!0,g.addEventListener("dispose",D));const X=g.source;let ne=f.get(X);ne===void 0&&(ne={},f.set(X,ne));const q=K(g);if(q!==M.__cacheKey){ne[q]===void 0&&(ne[q]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,U=!0),ne[q].usedTimes++;const ye=ne[M.__cacheKey];ye!==void 0&&(ne[M.__cacheKey].usedTimes--,ye.usedTimes===0&&b(g)),M.__cacheKey=q,M.__webglTexture=ne[q].texture}return U}function je(M,g,U){return Math.floor(Math.floor(M/U)/g)}function Se(M,g,U,X){const q=M.updateRanges;if(q.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,g.width,g.height,U,X,g.data);else{q.sort((de,ge)=>de.start-ge.start);let ye=0;for(let de=1;de<q.length;de++){const ge=q[ye],be=q[de],we=ge.start+ge.count,Pe=je(be.start,g.width,4),Xe=je(ge.start,g.width,4);be.start<=we+1&&Pe===Xe&&je(be.start+be.count-1,g.width,4)===Pe?ge.count=Math.max(ge.count,be.start+be.count-ge.start):(++ye,q[ye]=be)}q.length=ye+1;const he=t.getParameter(t.UNPACK_ROW_LENGTH),Ie=t.getParameter(t.UNPACK_SKIP_PIXELS),Fe=t.getParameter(t.UNPACK_SKIP_ROWS);t.pixelStorei(t.UNPACK_ROW_LENGTH,g.width);for(let de=0,ge=q.length;de<ge;de++){const be=q[de],we=Math.floor(be.start/4),Pe=Math.ceil(be.count/4),Xe=we%g.width,B=Math.floor(we/g.width),Me=Pe,ve=1;t.pixelStorei(t.UNPACK_SKIP_PIXELS,Xe),t.pixelStorei(t.UNPACK_SKIP_ROWS,B),n.texSubImage2D(t.TEXTURE_2D,0,Xe,B,Me,ve,U,X,g.data)}M.clearUpdateRanges(),t.pixelStorei(t.UNPACK_ROW_LENGTH,he),t.pixelStorei(t.UNPACK_SKIP_PIXELS,Ie),t.pixelStorei(t.UNPACK_SKIP_ROWS,Fe)}}function z(M,g,U){let X=t.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(X=t.TEXTURE_2D_ARRAY),g.isData3DTexture&&(X=t.TEXTURE_3D);const ne=ze(M,g),q=g.source;n.bindTexture(X,M.__webglTexture,t.TEXTURE0+U);const ye=i.get(q);if(q.version!==ye.__version||ne===!0){n.activeTexture(t.TEXTURE0+U);const he=Je.getPrimaries(Je.workingColorSpace),Ie=g.colorSpace===Ni?null:Je.getPrimaries(g.colorSpace),Fe=g.colorSpace===Ni||he===Ie?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,g.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Fe);let de=v(g.image,!1,r.maxTextureSize);de=re(g,de);const ge=s.convert(g.format,g.colorSpace),be=s.convert(g.type);let we=T(g.internalFormat,ge,be,g.colorSpace,g.isVideoTexture);_e(X,g);let Pe;const Xe=g.mipmaps,B=g.isVideoTexture!==!0,Me=ye.__version===void 0||ne===!0,ve=q.dataReady,Le=I(g,de);if(g.isDepthTexture)we=E(g.format===ar,g.type),Me&&(B?n.texStorage2D(t.TEXTURE_2D,1,we,de.width,de.height):n.texImage2D(t.TEXTURE_2D,0,we,de.width,de.height,0,ge,be,null));else if(g.isDataTexture)if(Xe.length>0){B&&Me&&n.texStorage2D(t.TEXTURE_2D,Le,we,Xe[0].width,Xe[0].height);for(let pe=0,ie=Xe.length;pe<ie;pe++)Pe=Xe[pe],B?ve&&n.texSubImage2D(t.TEXTURE_2D,pe,0,0,Pe.width,Pe.height,ge,be,Pe.data):n.texImage2D(t.TEXTURE_2D,pe,we,Pe.width,Pe.height,0,ge,be,Pe.data);g.generateMipmaps=!1}else B?(Me&&n.texStorage2D(t.TEXTURE_2D,Le,we,de.width,de.height),ve&&Se(g,de,ge,be)):n.texImage2D(t.TEXTURE_2D,0,we,de.width,de.height,0,ge,be,de.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){B&&Me&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Le,we,Xe[0].width,Xe[0].height,de.depth);for(let pe=0,ie=Xe.length;pe<ie;pe++)if(Pe=Xe[pe],g.format!==Mn)if(ge!==null)if(B){if(ve)if(g.layerUpdates.size>0){const Ue=Hf(Pe.width,Pe.height,g.format,g.type);for(const ke of g.layerUpdates){const pt=Pe.data.subarray(ke*Ue/Pe.data.BYTES_PER_ELEMENT,(ke+1)*Ue/Pe.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,pe,0,0,ke,Pe.width,Pe.height,1,ge,pt)}g.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,pe,0,0,0,Pe.width,Pe.height,de.depth,ge,Pe.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,pe,we,Pe.width,Pe.height,de.depth,0,Pe.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?ve&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,pe,0,0,0,Pe.width,Pe.height,de.depth,ge,be,Pe.data):n.texImage3D(t.TEXTURE_2D_ARRAY,pe,we,Pe.width,Pe.height,de.depth,0,ge,be,Pe.data)}else{B&&Me&&n.texStorage2D(t.TEXTURE_2D,Le,we,Xe[0].width,Xe[0].height);for(let pe=0,ie=Xe.length;pe<ie;pe++)Pe=Xe[pe],g.format!==Mn?ge!==null?B?ve&&n.compressedTexSubImage2D(t.TEXTURE_2D,pe,0,0,Pe.width,Pe.height,ge,Pe.data):n.compressedTexImage2D(t.TEXTURE_2D,pe,we,Pe.width,Pe.height,0,Pe.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?ve&&n.texSubImage2D(t.TEXTURE_2D,pe,0,0,Pe.width,Pe.height,ge,be,Pe.data):n.texImage2D(t.TEXTURE_2D,pe,we,Pe.width,Pe.height,0,ge,be,Pe.data)}else if(g.isDataArrayTexture)if(B){if(Me&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Le,we,de.width,de.height,de.depth),ve)if(g.layerUpdates.size>0){const pe=Hf(de.width,de.height,g.format,g.type);for(const ie of g.layerUpdates){const Ue=de.data.subarray(ie*pe/de.data.BYTES_PER_ELEMENT,(ie+1)*pe/de.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ie,de.width,de.height,1,ge,be,Ue)}g.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,de.width,de.height,de.depth,ge,be,de.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,we,de.width,de.height,de.depth,0,ge,be,de.data);else if(g.isData3DTexture)B?(Me&&n.texStorage3D(t.TEXTURE_3D,Le,we,de.width,de.height,de.depth),ve&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,de.width,de.height,de.depth,ge,be,de.data)):n.texImage3D(t.TEXTURE_3D,0,we,de.width,de.height,de.depth,0,ge,be,de.data);else if(g.isFramebufferTexture){if(Me)if(B)n.texStorage2D(t.TEXTURE_2D,Le,we,de.width,de.height);else{let pe=de.width,ie=de.height;for(let Ue=0;Ue<Le;Ue++)n.texImage2D(t.TEXTURE_2D,Ue,we,pe,ie,0,ge,be,null),pe>>=1,ie>>=1}}else if(Xe.length>0){if(B&&Me){const pe=le(Xe[0]);n.texStorage2D(t.TEXTURE_2D,Le,we,pe.width,pe.height)}for(let pe=0,ie=Xe.length;pe<ie;pe++)Pe=Xe[pe],B?ve&&n.texSubImage2D(t.TEXTURE_2D,pe,0,0,ge,be,Pe):n.texImage2D(t.TEXTURE_2D,pe,we,ge,be,Pe);g.generateMipmaps=!1}else if(B){if(Me){const pe=le(de);n.texStorage2D(t.TEXTURE_2D,Le,we,pe.width,pe.height)}ve&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ge,be,de)}else n.texImage2D(t.TEXTURE_2D,0,we,ge,be,de);m(g)&&p(X),ye.__version=q.version,g.onUpdate&&g.onUpdate(g)}M.__version=g.version}function N(M,g,U){if(g.image.length!==6)return;const X=ze(M,g),ne=g.source;n.bindTexture(t.TEXTURE_CUBE_MAP,M.__webglTexture,t.TEXTURE0+U);const q=i.get(ne);if(ne.version!==q.__version||X===!0){n.activeTexture(t.TEXTURE0+U);const ye=Je.getPrimaries(Je.workingColorSpace),he=g.colorSpace===Ni?null:Je.getPrimaries(g.colorSpace),Ie=g.colorSpace===Ni||ye===he?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,g.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);const Fe=g.isCompressedTexture||g.image[0].isCompressedTexture,de=g.image[0]&&g.image[0].isDataTexture,ge=[];for(let ie=0;ie<6;ie++)!Fe&&!de?ge[ie]=v(g.image[ie],!0,r.maxCubemapSize):ge[ie]=de?g.image[ie].image:g.image[ie],ge[ie]=re(g,ge[ie]);const be=ge[0],we=s.convert(g.format,g.colorSpace),Pe=s.convert(g.type),Xe=T(g.internalFormat,we,Pe,g.colorSpace),B=g.isVideoTexture!==!0,Me=q.__version===void 0||X===!0,ve=ne.dataReady;let Le=I(g,be);_e(t.TEXTURE_CUBE_MAP,g);let pe;if(Fe){B&&Me&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Le,Xe,be.width,be.height);for(let ie=0;ie<6;ie++){pe=ge[ie].mipmaps;for(let Ue=0;Ue<pe.length;Ue++){const ke=pe[Ue];g.format!==Mn?we!==null?B?ve&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue,0,0,ke.width,ke.height,we,ke.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue,Xe,ke.width,ke.height,0,ke.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?ve&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue,0,0,ke.width,ke.height,we,Pe,ke.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue,Xe,ke.width,ke.height,0,we,Pe,ke.data)}}}else{if(pe=g.mipmaps,B&&Me){pe.length>0&&Le++;const ie=le(ge[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Le,Xe,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(de){B?ve&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,ge[ie].width,ge[ie].height,we,Pe,ge[ie].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Xe,ge[ie].width,ge[ie].height,0,we,Pe,ge[ie].data);for(let Ue=0;Ue<pe.length;Ue++){const pt=pe[Ue].image[ie].image;B?ve&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue+1,0,0,pt.width,pt.height,we,Pe,pt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue+1,Xe,pt.width,pt.height,0,we,Pe,pt.data)}}else{B?ve&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,we,Pe,ge[ie]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Xe,we,Pe,ge[ie]);for(let Ue=0;Ue<pe.length;Ue++){const ke=pe[Ue];B?ve&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue+1,0,0,we,Pe,ke.image[ie]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ue+1,Xe,we,Pe,ke.image[ie])}}}m(g)&&p(t.TEXTURE_CUBE_MAP),q.__version=ne.version,g.onUpdate&&g.onUpdate(g)}M.__version=g.version}function j(M,g,U,X,ne,q){const ye=s.convert(U.format,U.colorSpace),he=s.convert(U.type),Ie=T(U.internalFormat,ye,he,U.colorSpace),Fe=i.get(g),de=i.get(U);if(de.__renderTarget=g,!Fe.__hasExternalTextures){const ge=Math.max(1,g.width>>q),be=Math.max(1,g.height>>q);ne===t.TEXTURE_3D||ne===t.TEXTURE_2D_ARRAY?n.texImage3D(ne,q,Ie,ge,be,g.depth,0,ye,he,null):n.texImage2D(ne,q,Ie,ge,be,0,ye,he,null)}n.bindFramebuffer(t.FRAMEBUFFER,M),fe(g)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,X,ne,de.__webglTexture,0,A(g)):(ne===t.TEXTURE_2D||ne>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,X,ne,de.__webglTexture,q),n.bindFramebuffer(t.FRAMEBUFFER,null)}function oe(M,g,U){if(t.bindRenderbuffer(t.RENDERBUFFER,M),g.depthBuffer){const X=g.depthTexture,ne=X&&X.isDepthTexture?X.type:null,q=E(g.stencilBuffer,ne),ye=g.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;fe(g)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,A(g),q,g.width,g.height):U?t.renderbufferStorageMultisample(t.RENDERBUFFER,A(g),q,g.width,g.height):t.renderbufferStorage(t.RENDERBUFFER,q,g.width,g.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ye,t.RENDERBUFFER,M)}else{const X=g.textures;for(let ne=0;ne<X.length;ne++){const q=X[ne],ye=s.convert(q.format,q.colorSpace),he=s.convert(q.type),Ie=T(q.internalFormat,ye,he,q.colorSpace);fe(g)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,A(g),Ie,g.width,g.height):U?t.renderbufferStorageMultisample(t.RENDERBUFFER,A(g),Ie,g.width,g.height):t.renderbufferStorage(t.RENDERBUFFER,Ie,g.width,g.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ue(M,g,U){const X=g.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,M),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(g.depthTexture);if(ne.__renderTarget=g,(!ne.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,g.depthTexture.addEventListener("dispose",D)),ne.__webglTexture===void 0){ne.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ne.__webglTexture),_e(t.TEXTURE_CUBE_MAP,g.depthTexture);const Fe=s.convert(g.depthTexture.format),de=s.convert(g.depthTexture.type);let ge;g.depthTexture.format===vi?ge=t.DEPTH_COMPONENT24:g.depthTexture.format===ar&&(ge=t.DEPTH24_STENCIL8);for(let be=0;be<6;be++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+be,0,ge,g.width,g.height,0,Fe,de,null)}}else W(g.depthTexture,0);const q=ne.__webglTexture,ye=A(g),he=X?t.TEXTURE_CUBE_MAP_POSITIVE_X+U:t.TEXTURE_2D,Ie=g.depthTexture.format===ar?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(g.depthTexture.format===vi)fe(g)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Ie,he,q,0,ye):t.framebufferTexture2D(t.FRAMEBUFFER,Ie,he,q,0);else if(g.depthTexture.format===ar)fe(g)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Ie,he,q,0,ye):t.framebufferTexture2D(t.FRAMEBUFFER,Ie,he,q,0);else throw new Error("Unknown depthTexture format")}function me(M){const g=i.get(M),U=M.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==M.depthTexture){const X=M.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),X){const ne=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,X.removeEventListener("dispose",ne)};X.addEventListener("dispose",ne),g.__depthDisposeCallback=ne}g.__boundDepthTexture=X}if(M.depthTexture&&!g.__autoAllocateDepthBuffer)if(U)for(let X=0;X<6;X++)ue(g.__webglFramebuffer[X],M,X);else{const X=M.texture.mipmaps;X&&X.length>0?ue(g.__webglFramebuffer[0],M,0):ue(g.__webglFramebuffer,M,0)}else if(U){g.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(n.bindFramebuffer(t.FRAMEBUFFER,g.__webglFramebuffer[X]),g.__webglDepthbuffer[X]===void 0)g.__webglDepthbuffer[X]=t.createRenderbuffer(),oe(g.__webglDepthbuffer[X],M,!1);else{const ne=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,q=g.__webglDepthbuffer[X];t.bindRenderbuffer(t.RENDERBUFFER,q),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,q)}}else{const X=M.texture.mipmaps;if(X&&X.length>0?n.bindFramebuffer(t.FRAMEBUFFER,g.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=t.createRenderbuffer(),oe(g.__webglDepthbuffer,M,!1);else{const ne=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,q=g.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,q),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,q)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function R(M,g,U){const X=i.get(M);g!==void 0&&j(X.__webglFramebuffer,M,M.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),U!==void 0&&me(M)}function w(M){const g=M.texture,U=i.get(M),X=i.get(g);M.addEventListener("dispose",L);const ne=M.textures,q=M.isWebGLCubeRenderTarget===!0,ye=ne.length>1;if(ye||(X.__webglTexture===void 0&&(X.__webglTexture=t.createTexture()),X.__version=g.version,o.memory.textures++),q){U.__webglFramebuffer=[];for(let he=0;he<6;he++)if(g.mipmaps&&g.mipmaps.length>0){U.__webglFramebuffer[he]=[];for(let Ie=0;Ie<g.mipmaps.length;Ie++)U.__webglFramebuffer[he][Ie]=t.createFramebuffer()}else U.__webglFramebuffer[he]=t.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){U.__webglFramebuffer=[];for(let he=0;he<g.mipmaps.length;he++)U.__webglFramebuffer[he]=t.createFramebuffer()}else U.__webglFramebuffer=t.createFramebuffer();if(ye)for(let he=0,Ie=ne.length;he<Ie;he++){const Fe=i.get(ne[he]);Fe.__webglTexture===void 0&&(Fe.__webglTexture=t.createTexture(),o.memory.textures++)}if(M.samples>0&&fe(M)===!1){U.__webglMultisampledFramebuffer=t.createFramebuffer(),U.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let he=0;he<ne.length;he++){const Ie=ne[he];U.__webglColorRenderbuffer[he]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,U.__webglColorRenderbuffer[he]);const Fe=s.convert(Ie.format,Ie.colorSpace),de=s.convert(Ie.type),ge=T(Ie.internalFormat,Fe,de,Ie.colorSpace,M.isXRRenderTarget===!0),be=A(M);t.renderbufferStorageMultisample(t.RENDERBUFFER,be,ge,M.width,M.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+he,t.RENDERBUFFER,U.__webglColorRenderbuffer[he])}t.bindRenderbuffer(t.RENDERBUFFER,null),M.depthBuffer&&(U.__webglDepthRenderbuffer=t.createRenderbuffer(),oe(U.__webglDepthRenderbuffer,M,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(q){n.bindTexture(t.TEXTURE_CUBE_MAP,X.__webglTexture),_e(t.TEXTURE_CUBE_MAP,g);for(let he=0;he<6;he++)if(g.mipmaps&&g.mipmaps.length>0)for(let Ie=0;Ie<g.mipmaps.length;Ie++)j(U.__webglFramebuffer[he][Ie],M,g,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+he,Ie);else j(U.__webglFramebuffer[he],M,g,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(g)&&p(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ye){for(let he=0,Ie=ne.length;he<Ie;he++){const Fe=ne[he],de=i.get(Fe);let ge=t.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(ge=M.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ge,de.__webglTexture),_e(ge,Fe),j(U.__webglFramebuffer,M,Fe,t.COLOR_ATTACHMENT0+he,ge,0),m(Fe)&&p(ge)}n.unbindTexture()}else{let he=t.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(he=M.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(he,X.__webglTexture),_e(he,g),g.mipmaps&&g.mipmaps.length>0)for(let Ie=0;Ie<g.mipmaps.length;Ie++)j(U.__webglFramebuffer[Ie],M,g,t.COLOR_ATTACHMENT0,he,Ie);else j(U.__webglFramebuffer,M,g,t.COLOR_ATTACHMENT0,he,0);m(g)&&p(he),n.unbindTexture()}M.depthBuffer&&me(M)}function O(M){const g=M.textures;for(let U=0,X=g.length;U<X;U++){const ne=g[U];if(m(ne)){const q=S(M),ye=i.get(ne).__webglTexture;n.bindTexture(q,ye),p(q),n.unbindTexture()}}}const Q=[],J=[];function te(M){if(M.samples>0){if(fe(M)===!1){const g=M.textures,U=M.width,X=M.height;let ne=t.COLOR_BUFFER_BIT;const q=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ye=i.get(M),he=g.length>1;if(he)for(let Fe=0;Fe<g.length;Fe++)n.bindFramebuffer(t.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Fe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ye.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Fe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const Ie=M.texture.mipmaps;Ie&&Ie.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let Fe=0;Fe<g.length;Fe++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(ne|=t.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(ne|=t.STENCIL_BUFFER_BIT)),he){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ye.__webglColorRenderbuffer[Fe]);const de=i.get(g[Fe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,de,0)}t.blitFramebuffer(0,0,U,X,0,0,U,X,ne,t.NEAREST),l===!0&&(Q.length=0,J.length=0,Q.push(t.COLOR_ATTACHMENT0+Fe),M.depthBuffer&&M.resolveDepthBuffer===!1&&(Q.push(q),J.push(q),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,J)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Q))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),he)for(let Fe=0;Fe<g.length;Fe++){n.bindFramebuffer(t.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Fe,t.RENDERBUFFER,ye.__webglColorRenderbuffer[Fe]);const de=i.get(g[Fe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ye.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Fe,t.TEXTURE_2D,de,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&l){const g=M.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[g])}}}function A(M){return Math.min(r.maxSamples,M.samples)}function fe(M){const g=i.get(M);return M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function ae(M){const g=o.render.frame;u.get(M)!==g&&(u.set(M,g),M.update())}function re(M,g){const U=M.colorSpace,X=M.format,ne=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||U!==qr&&U!==Ni&&(Je.getTransfer(U)===at?(X!==Mn||ne!==dn)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):et("WebGLTextures: Unsupported texture color space:",U)),g}function le(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(c.width=M.naturalWidth||M.width,c.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(c.width=M.displayWidth,c.height=M.displayHeight):(c.width=M.width,c.height=M.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=P,this.setTexture2D=W,this.setTexture2DArray=k,this.setTexture3D=F,this.setTextureCube=se,this.rebindTextures=R,this.setupRenderTarget=w,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=te,this.setupDepthRenderbuffer=me,this.setupFrameBufferTexture=j,this.useMultisampledRTT=fe,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function tb(t,e){function n(i,r=Ni){let s;const o=Je.getTransfer(r);if(i===dn)return t.UNSIGNED_BYTE;if(i===kc)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Wc)return t.UNSIGNED_SHORT_5_5_5_1;if(i===tp)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===np)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===Qh)return t.BYTE;if(i===ep)return t.SHORT;if(i===Ps)return t.UNSIGNED_SHORT;if(i===Gc)return t.INT;if(i===qn)return t.UNSIGNED_INT;if(i===Hn)return t.FLOAT;if(i===_i)return t.HALF_FLOAT;if(i===ip)return t.ALPHA;if(i===rp)return t.RGB;if(i===Mn)return t.RGBA;if(i===vi)return t.DEPTH_COMPONENT;if(i===ar)return t.DEPTH_STENCIL;if(i===sp)return t.RED;if(i===Xc)return t.RED_INTEGER;if(i===Xr)return t.RG;if(i===qc)return t.RG_INTEGER;if(i===Yc)return t.RGBA_INTEGER;if(i===To||i===Ao||i===Ro||i===Co)if(o===at)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===To)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ao)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ro)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Co)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===To)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ao)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ro)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Co)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Bl||i===Vl||i===zl||i===Hl)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Bl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Vl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===zl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Hl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Gl||i===kl||i===Wl||i===Xl||i===ql||i===Yl||i===$l)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Gl||i===kl)return o===at?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Wl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Xl)return s.COMPRESSED_R11_EAC;if(i===ql)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Yl)return s.COMPRESSED_RG11_EAC;if(i===$l)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Kl||i===jl||i===Zl||i===Jl||i===Ql||i===ec||i===tc||i===nc||i===ic||i===rc||i===sc||i===oc||i===ac||i===lc)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Kl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===jl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Zl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Jl)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ql)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ec)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===tc)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===nc)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ic)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===rc)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===sc)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===oc)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ac)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===lc)return o===at?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===cc||i===uc||i===fc)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===cc)return o===at?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===uc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===fc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===dc||i===hc||i===pc||i===mc)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===dc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===hc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===pc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===mc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ds?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const nb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ib=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class rb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new _p(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Yn({vertexShader:nb,fragmentShader:ib,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Si(new ca(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class sb extends Kr{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,f=null,h=null,_=null;const v=typeof XRWebGLBinding<"u",m=new rb,p={},S=n.getContextAttributes();let T=null,E=null;const I=[],D=[],L=new ut;let x=null;const b=new fn;b.viewport=new bt;const V=new fn;V.viewport=new bt;const C=[b,V],P=new gx;let H=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let N=I[z];return N===void 0&&(N=new za,I[z]=N),N.getTargetRaySpace()},this.getControllerGrip=function(z){let N=I[z];return N===void 0&&(N=new za,I[z]=N),N.getGripSpace()},this.getHand=function(z){let N=I[z];return N===void 0&&(N=new za,I[z]=N),N.getHandSpace()};function W(z){const N=D.indexOf(z.inputSource);if(N===-1)return;const j=I[N];j!==void 0&&(j.update(z.inputSource,z.frame,c||o),j.dispatchEvent({type:z.type,data:z.inputSource}))}function k(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",k),r.removeEventListener("inputsourceschange",F);for(let z=0;z<I.length;z++){const N=D[z];N!==null&&(D[z]=null,I[z].disconnect(N))}H=null,K=null,m.reset();for(const z in p)delete p[z];e.setRenderTarget(T),h=null,f=null,d=null,r=null,E=null,Se.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(L.width,L.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(z){s=z,i.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){a=z,i.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(z){c=z},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d===null&&v&&(d=new XRWebGLBinding(r,n)),d},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(z){if(r=z,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",k),r.addEventListener("inputsourceschange",F),S.xrCompatible!==!0&&await n.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(L),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let j=null,oe=null,ue=null;S.depth&&(ue=S.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,j=S.stencil?ar:vi,oe=S.stencil?Ds:qn);const me={colorFormat:n.RGBA8,depthFormat:ue,scaleFactor:s};d=this.getBinding(),f=d.createProjectionLayer(me),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),E=new Xn(f.textureWidth,f.textureHeight,{format:Mn,type:dn,depthTexture:new Is(f.textureWidth,f.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,j),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const j={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,n,j),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),E=new Xn(h.framebufferWidth,h.framebufferHeight,{format:Mn,type:dn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Se.setContext(r),Se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function F(z){for(let N=0;N<z.removed.length;N++){const j=z.removed[N],oe=D.indexOf(j);oe>=0&&(D[oe]=null,I[oe].disconnect(j))}for(let N=0;N<z.added.length;N++){const j=z.added[N];let oe=D.indexOf(j);if(oe===-1){for(let me=0;me<I.length;me++)if(me>=D.length){D.push(j),oe=me;break}else if(D[me]===null){D[me]=j,oe=me;break}if(oe===-1)break}const ue=I[oe];ue&&ue.connect(j)}}const se=new Z,ce=new Z;function xe(z,N,j){se.setFromMatrixPosition(N.matrixWorld),ce.setFromMatrixPosition(j.matrixWorld);const oe=se.distanceTo(ce),ue=N.projectionMatrix.elements,me=j.projectionMatrix.elements,R=ue[14]/(ue[10]-1),w=ue[14]/(ue[10]+1),O=(ue[9]+1)/ue[5],Q=(ue[9]-1)/ue[5],J=(ue[8]-1)/ue[0],te=(me[8]+1)/me[0],A=R*J,fe=R*te,ae=oe/(-J+te),re=ae*-J;if(N.matrixWorld.decompose(z.position,z.quaternion,z.scale),z.translateX(re),z.translateZ(ae),z.matrixWorld.compose(z.position,z.quaternion,z.scale),z.matrixWorldInverse.copy(z.matrixWorld).invert(),ue[10]===-1)z.projectionMatrix.copy(N.projectionMatrix),z.projectionMatrixInverse.copy(N.projectionMatrixInverse);else{const le=R+ae,M=w+ae,g=A-re,U=fe+(oe-re),X=O*w/M*le,ne=Q*w/M*le;z.projectionMatrix.makePerspective(g,U,X,ne,le,M),z.projectionMatrixInverse.copy(z.projectionMatrix).invert()}}function Ee(z,N){N===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(N.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.updateCamera=function(z){if(r===null)return;let N=z.near,j=z.far;m.texture!==null&&(m.depthNear>0&&(N=m.depthNear),m.depthFar>0&&(j=m.depthFar)),P.near=V.near=b.near=N,P.far=V.far=b.far=j,(H!==P.near||K!==P.far)&&(r.updateRenderState({depthNear:P.near,depthFar:P.far}),H=P.near,K=P.far),P.layers.mask=z.layers.mask|6,b.layers.mask=P.layers.mask&-5,V.layers.mask=P.layers.mask&-3;const oe=z.parent,ue=P.cameras;Ee(P,oe);for(let me=0;me<ue.length;me++)Ee(ue[me],oe);ue.length===2?xe(P,b,V):P.projectionMatrix.copy(b.projectionMatrix),_e(z,P,oe)};function _e(z,N,j){j===null?z.matrix.copy(N.matrixWorld):(z.matrix.copy(j.matrixWorld),z.matrix.invert(),z.matrix.multiply(N.matrixWorld)),z.matrix.decompose(z.position,z.quaternion,z.scale),z.updateMatrixWorld(!0),z.projectionMatrix.copy(N.projectionMatrix),z.projectionMatrixInverse.copy(N.projectionMatrixInverse),z.isPerspectiveCamera&&(z.fov=gc*2*Math.atan(1/z.projectionMatrix.elements[5]),z.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(f===null&&h===null))return l},this.setFoveation=function(z){l=z,f!==null&&(f.fixedFoveation=z),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(P)},this.getCameraTexture=function(z){return p[z]};let ze=null;function je(z,N){if(u=N.getViewerPose(c||o),_=N,u!==null){const j=u.views;h!==null&&(e.setRenderTargetFramebuffer(E,h.framebuffer),e.setRenderTarget(E));let oe=!1;j.length!==P.cameras.length&&(P.cameras.length=0,oe=!0);for(let w=0;w<j.length;w++){const O=j[w];let Q=null;if(h!==null)Q=h.getViewport(O);else{const te=d.getViewSubImage(f,O);Q=te.viewport,w===0&&(e.setRenderTargetTextures(E,te.colorTexture,te.depthStencilTexture),e.setRenderTarget(E))}let J=C[w];J===void 0&&(J=new fn,J.layers.enable(w),J.viewport=new bt,C[w]=J),J.matrix.fromArray(O.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(O.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Q.x,Q.y,Q.width,Q.height),w===0&&(P.matrix.copy(J.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),oe===!0&&P.cameras.push(J)}const ue=r.enabledFeatures;if(ue&&ue.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){d=i.getBinding();const w=d.getDepthInformation(j[0]);w&&w.isValid&&w.texture&&m.init(w,r.renderState)}if(ue&&ue.includes("camera-access")&&v){e.state.unbindTexture(),d=i.getBinding();for(let w=0;w<j.length;w++){const O=j[w].camera;if(O){let Q=p[O];Q||(Q=new _p,p[O]=Q);const J=d.getCameraImage(O);Q.sourceTexture=J}}}}for(let j=0;j<I.length;j++){const oe=D[j],ue=I[j];oe!==null&&ue!==void 0&&ue.update(oe,N,c||o)}ze&&ze(z,N),N.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:N}),_=null}const Se=new Mp;Se.setAnimationLoop(je),this.setAnimationLoop=function(z){ze=z},this.dispose=function(){}}}const Qi=new xi,ob=new Tt;function ab(t,e){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,vp(t)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,S,T,E){p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),f(m,p),p.isMeshPhysicalMaterial&&h(m,p,E)):p.isMeshMatcapMaterial?(s(m,p),_(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,S,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===rn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===rn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=e.get(p),T=S.envMap,E=S.envMapRotation;T&&(m.envMap.value=T,Qi.copy(E),Qi.x*=-1,Qi.y*=-1,Qi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Qi.y*=-1,Qi.z*=-1),m.envMapRotation.value.setFromMatrix4(ob.makeRotationFromEuler(Qi)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=T*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function h(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===rn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function lb(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(S,T){const E=T.program;i.uniformBlockBinding(S,E)}function c(S,T){let E=r[S.id];E===void 0&&(_(S),E=u(S),r[S.id]=E,S.addEventListener("dispose",m));const I=T.program;i.updateUBOMapping(S,I);const D=e.render.frame;s[S.id]!==D&&(f(S),s[S.id]=D)}function u(S){const T=d();S.__bindingPointIndex=T;const E=t.createBuffer(),I=S.__size,D=S.usage;return t.bindBuffer(t.UNIFORM_BUFFER,E),t.bufferData(t.UNIFORM_BUFFER,I,D),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,T,E),E}function d(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return et("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(S){const T=r[S.id],E=S.uniforms,I=S.__cache;t.bindBuffer(t.UNIFORM_BUFFER,T);for(let D=0,L=E.length;D<L;D++){const x=Array.isArray(E[D])?E[D]:[E[D]];for(let b=0,V=x.length;b<V;b++){const C=x[b];if(h(C,D,b,I)===!0){const P=C.__offset,H=Array.isArray(C.value)?C.value:[C.value];let K=0;for(let W=0;W<H.length;W++){const k=H[W],F=v(k);typeof k=="number"||typeof k=="boolean"?(C.__data[0]=k,t.bufferSubData(t.UNIFORM_BUFFER,P+K,C.__data)):k.isMatrix3?(C.__data[0]=k.elements[0],C.__data[1]=k.elements[1],C.__data[2]=k.elements[2],C.__data[3]=0,C.__data[4]=k.elements[3],C.__data[5]=k.elements[4],C.__data[6]=k.elements[5],C.__data[7]=0,C.__data[8]=k.elements[6],C.__data[9]=k.elements[7],C.__data[10]=k.elements[8],C.__data[11]=0):(k.toArray(C.__data,K),K+=F.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,P,C.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function h(S,T,E,I){const D=S.value,L=T+"_"+E;if(I[L]===void 0)return typeof D=="number"||typeof D=="boolean"?I[L]=D:I[L]=D.clone(),!0;{const x=I[L];if(typeof D=="number"||typeof D=="boolean"){if(x!==D)return I[L]=D,!0}else if(x.equals(D)===!1)return x.copy(D),!0}return!1}function _(S){const T=S.uniforms;let E=0;const I=16;for(let L=0,x=T.length;L<x;L++){const b=Array.isArray(T[L])?T[L]:[T[L]];for(let V=0,C=b.length;V<C;V++){const P=b[V],H=Array.isArray(P.value)?P.value:[P.value];for(let K=0,W=H.length;K<W;K++){const k=H[K],F=v(k),se=E%I,ce=se%F.boundary,xe=se+ce;E+=ce,xe!==0&&I-xe<F.storage&&(E+=I-xe),P.__data=new Float32Array(F.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=E,E+=F.storage}}}const D=E%I;return D>0&&(E+=I-D),S.__size=E,S.__cache={},this}function v(S){const T={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(T.boundary=4,T.storage=4):S.isVector2?(T.boundary=8,T.storage=8):S.isVector3||S.isColor?(T.boundary=16,T.storage=12):S.isVector4?(T.boundary=16,T.storage=16):S.isMatrix3?(T.boundary=48,T.storage=48):S.isMatrix4?(T.boundary=64,T.storage=64):S.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ge("WebGLRenderer: Unsupported uniform value type.",S),T}function m(S){const T=S.target;T.removeEventListener("dispose",m);const E=o.indexOf(T.__bindingPointIndex);o.splice(E,1),t.deleteBuffer(r[T.id]),delete r[T.id],delete s[T.id]}function p(){for(const S in r)t.deleteBuffer(r[S]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}const cb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Un=null;function ub(){return Un===null&&(Un=new Qv(cb,16,16,Xr,_i),Un.name="DFG_LUT",Un.minFilter=Wt,Un.magFilter=Wt,Un.wrapS=ui,Un.wrapT=ui,Un.generateMipmaps=!1,Un.needsUpdate=!0),Un}class fb{constructor(e={}){const{canvas:n=Pv(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1,outputBufferType:h=dn}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=o;const v=h,m=new Set([Yc,qc,Xc]),p=new Set([dn,qn,Ps,Ds,kc,Wc]),S=new Uint32Array(4),T=new Int32Array(4);let E=null,I=null;const D=[],L=[];let x=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let V=!1;this._outputColorSpace=nn;let C=0,P=0,H=null,K=-1,W=null;const k=new bt,F=new bt;let se=null;const ce=new tt(0);let xe=0,Ee=n.width,_e=n.height,ze=1,je=null,Se=null;const z=new bt(0,0,Ee,_e),N=new bt(0,0,Ee,_e);let j=!1;const oe=new pp;let ue=!1,me=!1;const R=new Tt,w=new Z,O=new bt,Q={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let J=!1;function te(){return H===null?ze:1}let A=i;function fe(y,G){return n.getContext(y,G)}try{const y={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Hc}`),n.addEventListener("webglcontextlost",Ue,!1),n.addEventListener("webglcontextrestored",ke,!1),n.addEventListener("webglcontextcreationerror",pt,!1),A===null){const G="webgl2";if(A=fe(G,y),A===null)throw fe(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw et("WebGLRenderer: "+y.message),y}let ae,re,le,M,g,U,X,ne,q,ye,he,Ie,Fe,de,ge,be,we,Pe,Xe,B,Me,ve,Le;function pe(){ae=new fE(A),ae.init(),Me=new tb(A,ae),re=new iE(A,ae,e,Me),le=new Qy(A,ae),re.reversedDepthBuffer&&f&&le.buffers.depth.setReversed(!0),M=new pE(A),g=new Vy,U=new eb(A,ae,le,g,re,Me,M),X=new uE(b),ne=new xx(A),ve=new tE(A,ne),q=new dE(A,ne,M,ve),ye=new gE(A,q,ne,ve,M),Pe=new mE(A,re,U),ge=new rE(g),he=new By(b,X,ae,re,ve,ge),Ie=new ab(b,g),Fe=new Hy,de=new Yy(ae),we=new eE(b,X,le,ye,_,l),be=new Jy(b,ye,re),Le=new lb(A,M,re,le),Xe=new nE(A,ae,M),B=new hE(A,ae,M),M.programs=he.programs,b.capabilities=re,b.extensions=ae,b.properties=g,b.renderLists=Fe,b.shadowMap=be,b.state=le,b.info=M}pe(),v!==dn&&(x=new vE(v,n.width,n.height,r,s));const ie=new sb(b,A);this.xr=ie,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const y=ae.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=ae.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return ze},this.setPixelRatio=function(y){y!==void 0&&(ze=y,this.setSize(Ee,_e,!1))},this.getSize=function(y){return y.set(Ee,_e)},this.setSize=function(y,G,ee=!0){if(ie.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}Ee=y,_e=G,n.width=Math.floor(y*ze),n.height=Math.floor(G*ze),ee===!0&&(n.style.width=y+"px",n.style.height=G+"px"),x!==null&&x.setSize(n.width,n.height),this.setViewport(0,0,y,G)},this.getDrawingBufferSize=function(y){return y.set(Ee*ze,_e*ze).floor()},this.setDrawingBufferSize=function(y,G,ee){Ee=y,_e=G,ze=ee,n.width=Math.floor(y*ee),n.height=Math.floor(G*ee),this.setViewport(0,0,y,G)},this.setEffects=function(y){if(v===dn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let G=0;G<y.length;G++)if(y[G].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(k)},this.getViewport=function(y){return y.copy(z)},this.setViewport=function(y,G,ee,$){y.isVector4?z.set(y.x,y.y,y.z,y.w):z.set(y,G,ee,$),le.viewport(k.copy(z).multiplyScalar(ze).round())},this.getScissor=function(y){return y.copy(N)},this.setScissor=function(y,G,ee,$){y.isVector4?N.set(y.x,y.y,y.z,y.w):N.set(y,G,ee,$),le.scissor(F.copy(N).multiplyScalar(ze).round())},this.getScissorTest=function(){return j},this.setScissorTest=function(y){le.setScissorTest(j=y)},this.setOpaqueSort=function(y){je=y},this.setTransparentSort=function(y){Se=y},this.getClearColor=function(y){return y.copy(we.getClearColor())},this.setClearColor=function(){we.setClearColor(...arguments)},this.getClearAlpha=function(){return we.getClearAlpha()},this.setClearAlpha=function(){we.setClearAlpha(...arguments)},this.clear=function(y=!0,G=!0,ee=!0){let $=0;if(y){let Y=!1;if(H!==null){const Re=H.texture.format;Y=m.has(Re)}if(Y){const Re=H.texture.type,De=p.has(Re),Ce=we.getClearColor(),Ne=we.getClearAlpha(),Be=Ce.r,qe=Ce.g,Ke=Ce.b;De?(S[0]=Be,S[1]=qe,S[2]=Ke,S[3]=Ne,A.clearBufferuiv(A.COLOR,0,S)):(T[0]=Be,T[1]=qe,T[2]=Ke,T[3]=Ne,A.clearBufferiv(A.COLOR,0,T))}else $|=A.COLOR_BUFFER_BIT}G&&($|=A.DEPTH_BUFFER_BIT),ee&&($|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&A.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Ue,!1),n.removeEventListener("webglcontextrestored",ke,!1),n.removeEventListener("webglcontextcreationerror",pt,!1),we.dispose(),Fe.dispose(),de.dispose(),g.dispose(),X.dispose(),ye.dispose(),ve.dispose(),Le.dispose(),he.dispose(),ie.dispose(),ie.removeEventListener("sessionstart",eu),ie.removeEventListener("sessionend",tu),Gi.stop()};function Ue(y){y.preventDefault(),Ef("WebGLRenderer: Context Lost."),V=!0}function ke(){Ef("WebGLRenderer: Context Restored."),V=!1;const y=M.autoReset,G=be.enabled,ee=be.autoUpdate,$=be.needsUpdate,Y=be.type;pe(),M.autoReset=y,be.enabled=G,be.autoUpdate=ee,be.needsUpdate=$,be.type=Y}function pt(y){et("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ot(y){const G=y.target;G.removeEventListener("dispose",ot),$n(G)}function $n(y){Kn(y),g.remove(y)}function Kn(y){const G=g.get(y).programs;G!==void 0&&(G.forEach(function(ee){he.releaseProgram(ee)}),y.isShaderMaterial&&he.releaseShaderCache(y))}this.renderBufferDirect=function(y,G,ee,$,Y,Re){G===null&&(G=Q);const De=Y.isMesh&&Y.matrixWorld.determinant()<0,Ce=Cp(y,G,ee,$,Y);le.setMaterial($,De);let Ne=ee.index,Be=1;if($.wireframe===!0){if(Ne=q.getWireframeAttribute(ee),Ne===void 0)return;Be=2}const qe=ee.drawRange,Ke=ee.attributes.position;let Ve=qe.start*Be,lt=(qe.start+qe.count)*Be;Re!==null&&(Ve=Math.max(Ve,Re.start*Be),lt=Math.min(lt,(Re.start+Re.count)*Be)),Ne!==null?(Ve=Math.max(Ve,0),lt=Math.min(lt,Ne.count)):Ke!=null&&(Ve=Math.max(Ve,0),lt=Math.min(lt,Ke.count));const Mt=lt-Ve;if(Mt<0||Mt===1/0)return;ve.setup(Y,$,Ce,ee,Ne);let _t,ct=Xe;if(Ne!==null&&(_t=ne.get(Ne),ct=B,ct.setIndex(_t)),Y.isMesh)$.wireframe===!0?(le.setLineWidth($.wireframeLinewidth*te()),ct.setMode(A.LINES)):ct.setMode(A.TRIANGLES);else if(Y.isLine){let Ot=$.linewidth;Ot===void 0&&(Ot=1),le.setLineWidth(Ot*te()),Y.isLineSegments?ct.setMode(A.LINES):Y.isLineLoop?ct.setMode(A.LINE_LOOP):ct.setMode(A.LINE_STRIP)}else Y.isPoints?ct.setMode(A.POINTS):Y.isSprite&&ct.setMode(A.TRIANGLES);if(Y.isBatchedMesh)if(Y._multiDrawInstances!==null)Go("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ct.renderMultiDrawInstances(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount,Y._multiDrawInstances);else if(ae.get("WEBGL_multi_draw"))ct.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{const Ot=Y._multiDrawStarts,Oe=Y._multiDrawCounts,sn=Y._multiDrawCount,Qe=Ne?ne.get(Ne).bytesPerElement:1,mn=g.get($).currentProgram.getUniforms();for(let Dn=0;Dn<sn;Dn++)mn.setValue(A,"_gl_DrawID",Dn),ct.render(Ot[Dn]/Qe,Oe[Dn])}else if(Y.isInstancedMesh)ct.renderInstances(Ve,Mt,Y.count);else if(ee.isInstancedBufferGeometry){const Ot=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,Oe=Math.min(ee.instanceCount,Ot);ct.renderInstances(Ve,Mt,Oe)}else ct.render(Ve,Mt)};function Qc(y,G,ee){y.transparent===!0&&y.side===ci&&y.forceSinglePass===!1?(y.side=rn,y.needsUpdate=!0,Hs(y,G,ee),y.side=zi,y.needsUpdate=!0,Hs(y,G,ee),y.side=ci):Hs(y,G,ee)}this.compile=function(y,G,ee=null){ee===null&&(ee=y),I=de.get(ee),I.init(G),L.push(I),ee.traverseVisible(function(Y){Y.isLight&&Y.layers.test(G.layers)&&(I.pushLight(Y),Y.castShadow&&I.pushShadow(Y))}),y!==ee&&y.traverseVisible(function(Y){Y.isLight&&Y.layers.test(G.layers)&&(I.pushLight(Y),Y.castShadow&&I.pushShadow(Y))}),I.setupLights();const $=new Set;return y.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;const Re=Y.material;if(Re)if(Array.isArray(Re))for(let De=0;De<Re.length;De++){const Ce=Re[De];Qc(Ce,ee,Y),$.add(Ce)}else Qc(Re,ee,Y),$.add(Re)}),I=L.pop(),$},this.compileAsync=function(y,G,ee=null){const $=this.compile(y,G,ee);return new Promise(Y=>{function Re(){if($.forEach(function(De){g.get(De).currentProgram.isReady()&&$.delete(De)}),$.size===0){Y(y);return}setTimeout(Re,10)}ae.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let da=null;function Rp(y){da&&da(y)}function eu(){Gi.stop()}function tu(){Gi.start()}const Gi=new Mp;Gi.setAnimationLoop(Rp),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(y){da=y,ie.setAnimationLoop(y),y===null?Gi.stop():Gi.start()},ie.addEventListener("sessionstart",eu),ie.addEventListener("sessionend",tu),this.render=function(y,G){if(G!==void 0&&G.isCamera!==!0){et("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(V===!0)return;const ee=ie.enabled===!0&&ie.isPresenting===!0,$=x!==null&&(H===null||ee)&&x.begin(b,H);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),ie.enabled===!0&&ie.isPresenting===!0&&(x===null||x.isCompositing()===!1)&&(ie.cameraAutoUpdate===!0&&ie.updateCamera(G),G=ie.getCamera()),y.isScene===!0&&y.onBeforeRender(b,y,G,H),I=de.get(y,L.length),I.init(G),L.push(I),R.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),oe.setFromProjectionMatrix(R,Gn,G.reversedDepth),me=this.localClippingEnabled,ue=ge.init(this.clippingPlanes,me),E=Fe.get(y,D.length),E.init(),D.push(E),ie.enabled===!0&&ie.isPresenting===!0){const De=b.xr.getDepthSensingMesh();De!==null&&ha(De,G,-1/0,b.sortObjects)}ha(y,G,0,b.sortObjects),E.finish(),b.sortObjects===!0&&E.sort(je,Se),J=ie.enabled===!1||ie.isPresenting===!1||ie.hasDepthSensing()===!1,J&&we.addToRenderList(E,y),this.info.render.frame++,ue===!0&&ge.beginShadows();const Y=I.state.shadowsArray;if(be.render(Y,y,G),ue===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset(),($&&x.hasRenderPass())===!1){const De=E.opaque,Ce=E.transmissive;if(I.setupLights(),G.isArrayCamera){const Ne=G.cameras;if(Ce.length>0)for(let Be=0,qe=Ne.length;Be<qe;Be++){const Ke=Ne[Be];iu(De,Ce,y,Ke)}J&&we.render(y);for(let Be=0,qe=Ne.length;Be<qe;Be++){const Ke=Ne[Be];nu(E,y,Ke,Ke.viewport)}}else Ce.length>0&&iu(De,Ce,y,G),J&&we.render(y),nu(E,y,G)}H!==null&&P===0&&(U.updateMultisampleRenderTarget(H),U.updateRenderTargetMipmap(H)),$&&x.end(b),y.isScene===!0&&y.onAfterRender(b,y,G),ve.resetDefaultState(),K=-1,W=null,L.pop(),L.length>0?(I=L[L.length-1],ue===!0&&ge.setGlobalState(b.clippingPlanes,I.state.camera)):I=null,D.pop(),D.length>0?E=D[D.length-1]:E=null};function ha(y,G,ee,$){if(y.visible===!1)return;if(y.layers.test(G.layers)){if(y.isGroup)ee=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(G);else if(y.isLight)I.pushLight(y),y.castShadow&&I.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||oe.intersectsSprite(y)){$&&O.setFromMatrixPosition(y.matrixWorld).applyMatrix4(R);const De=ye.update(y),Ce=y.material;Ce.visible&&E.push(y,De,Ce,ee,O.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||oe.intersectsObject(y))){const De=ye.update(y),Ce=y.material;if($&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),O.copy(y.boundingSphere.center)):(De.boundingSphere===null&&De.computeBoundingSphere(),O.copy(De.boundingSphere.center)),O.applyMatrix4(y.matrixWorld).applyMatrix4(R)),Array.isArray(Ce)){const Ne=De.groups;for(let Be=0,qe=Ne.length;Be<qe;Be++){const Ke=Ne[Be],Ve=Ce[Ke.materialIndex];Ve&&Ve.visible&&E.push(y,De,Ve,ee,O.z,Ke)}}else Ce.visible&&E.push(y,De,Ce,ee,O.z,null)}}const Re=y.children;for(let De=0,Ce=Re.length;De<Ce;De++)ha(Re[De],G,ee,$)}function nu(y,G,ee,$){const{opaque:Y,transmissive:Re,transparent:De}=y;I.setupLightsView(ee),ue===!0&&ge.setGlobalState(b.clippingPlanes,ee),$&&le.viewport(k.copy($)),Y.length>0&&zs(Y,G,ee),Re.length>0&&zs(Re,G,ee),De.length>0&&zs(De,G,ee),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function iu(y,G,ee,$){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;if(I.state.transmissionRenderTarget[$.id]===void 0){const Ve=ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float");I.state.transmissionRenderTarget[$.id]=new Xn(1,1,{generateMipmaps:!0,type:Ve?_i:dn,minFilter:or,samples:Math.max(4,re.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace})}const Re=I.state.transmissionRenderTarget[$.id],De=$.viewport||k;Re.setSize(De.z*b.transmissionResolutionScale,De.w*b.transmissionResolutionScale);const Ce=b.getRenderTarget(),Ne=b.getActiveCubeFace(),Be=b.getActiveMipmapLevel();b.setRenderTarget(Re),b.getClearColor(ce),xe=b.getClearAlpha(),xe<1&&b.setClearColor(16777215,.5),b.clear(),J&&we.render(ee);const qe=b.toneMapping;b.toneMapping=Wn;const Ke=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),I.setupLightsView($),ue===!0&&ge.setGlobalState(b.clippingPlanes,$),zs(y,ee,$),U.updateMultisampleRenderTarget(Re),U.updateRenderTargetMipmap(Re),ae.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let lt=0,Mt=G.length;lt<Mt;lt++){const _t=G[lt],{object:ct,geometry:Ot,material:Oe,group:sn}=_t;if(Oe.side===ci&&ct.layers.test($.layers)){const Qe=Oe.side;Oe.side=rn,Oe.needsUpdate=!0,ru(ct,ee,$,Ot,Oe,sn),Oe.side=Qe,Oe.needsUpdate=!0,Ve=!0}}Ve===!0&&(U.updateMultisampleRenderTarget(Re),U.updateRenderTargetMipmap(Re))}b.setRenderTarget(Ce,Ne,Be),b.setClearColor(ce,xe),Ke!==void 0&&($.viewport=Ke),b.toneMapping=qe}function zs(y,G,ee){const $=G.isScene===!0?G.overrideMaterial:null;for(let Y=0,Re=y.length;Y<Re;Y++){const De=y[Y],{object:Ce,geometry:Ne,group:Be}=De;let qe=De.material;qe.allowOverride===!0&&$!==null&&(qe=$),Ce.layers.test(ee.layers)&&ru(Ce,G,ee,Ne,qe,Be)}}function ru(y,G,ee,$,Y,Re){y.onBeforeRender(b,G,ee,$,Y,Re),y.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),Y.onBeforeRender(b,G,ee,$,y,Re),Y.transparent===!0&&Y.side===ci&&Y.forceSinglePass===!1?(Y.side=rn,Y.needsUpdate=!0,b.renderBufferDirect(ee,G,$,Y,y,Re),Y.side=zi,Y.needsUpdate=!0,b.renderBufferDirect(ee,G,$,Y,y,Re),Y.side=ci):b.renderBufferDirect(ee,G,$,Y,y,Re),y.onAfterRender(b,G,ee,$,Y,Re)}function Hs(y,G,ee){G.isScene!==!0&&(G=Q);const $=g.get(y),Y=I.state.lights,Re=I.state.shadowsArray,De=Y.state.version,Ce=he.getParameters(y,Y.state,Re,G,ee),Ne=he.getProgramCacheKey(Ce);let Be=$.programs;$.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?G.environment:null,$.fog=G.fog;const qe=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;$.envMap=X.get(y.envMap||$.environment,qe),$.envMapRotation=$.environment!==null&&y.envMap===null?G.environmentRotation:y.envMapRotation,Be===void 0&&(y.addEventListener("dispose",ot),Be=new Map,$.programs=Be);let Ke=Be.get(Ne);if(Ke!==void 0){if($.currentProgram===Ke&&$.lightsStateVersion===De)return ou(y,Ce),Ke}else Ce.uniforms=he.getUniforms(y),y.onBeforeCompile(Ce,b),Ke=he.acquireProgram(Ce,Ne),Be.set(Ne,Ke),$.uniforms=Ce.uniforms;const Ve=$.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Ve.clippingPlanes=ge.uniform),ou(y,Ce),$.needsLights=Pp(y),$.lightsStateVersion=De,$.needsLights&&(Ve.ambientLightColor.value=Y.state.ambient,Ve.lightProbe.value=Y.state.probe,Ve.directionalLights.value=Y.state.directional,Ve.directionalLightShadows.value=Y.state.directionalShadow,Ve.spotLights.value=Y.state.spot,Ve.spotLightShadows.value=Y.state.spotShadow,Ve.rectAreaLights.value=Y.state.rectArea,Ve.ltc_1.value=Y.state.rectAreaLTC1,Ve.ltc_2.value=Y.state.rectAreaLTC2,Ve.pointLights.value=Y.state.point,Ve.pointLightShadows.value=Y.state.pointShadow,Ve.hemisphereLights.value=Y.state.hemi,Ve.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Ve.spotLightMatrix.value=Y.state.spotLightMatrix,Ve.spotLightMap.value=Y.state.spotLightMap,Ve.pointShadowMatrix.value=Y.state.pointShadowMatrix),$.currentProgram=Ke,$.uniformsList=null,Ke}function su(y){if(y.uniformsList===null){const G=y.currentProgram.getUniforms();y.uniformsList=wo.seqWithValue(G.seq,y.uniforms)}return y.uniformsList}function ou(y,G){const ee=g.get(y);ee.outputColorSpace=G.outputColorSpace,ee.batching=G.batching,ee.batchingColor=G.batchingColor,ee.instancing=G.instancing,ee.instancingColor=G.instancingColor,ee.instancingMorph=G.instancingMorph,ee.skinning=G.skinning,ee.morphTargets=G.morphTargets,ee.morphNormals=G.morphNormals,ee.morphColors=G.morphColors,ee.morphTargetsCount=G.morphTargetsCount,ee.numClippingPlanes=G.numClippingPlanes,ee.numIntersection=G.numClipIntersection,ee.vertexAlphas=G.vertexAlphas,ee.vertexTangents=G.vertexTangents,ee.toneMapping=G.toneMapping}function Cp(y,G,ee,$,Y){G.isScene!==!0&&(G=Q),U.resetTextureUnits();const Re=G.fog,De=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?G.environment:null,Ce=H===null?b.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:qr,Ne=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Be=X.get($.envMap||De,Ne),qe=$.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,Ke=!!ee.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ve=!!ee.morphAttributes.position,lt=!!ee.morphAttributes.normal,Mt=!!ee.morphAttributes.color;let _t=Wn;$.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(_t=b.toneMapping);const ct=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,Ot=ct!==void 0?ct.length:0,Oe=g.get($),sn=I.state.lights;if(ue===!0&&(me===!0||y!==W)){const Dt=y===W&&$.id===K;ge.setState($,y,Dt)}let Qe=!1;$.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==sn.state.version||Oe.outputColorSpace!==Ce||Y.isBatchedMesh&&Oe.batching===!1||!Y.isBatchedMesh&&Oe.batching===!0||Y.isBatchedMesh&&Oe.batchingColor===!0&&Y.colorTexture===null||Y.isBatchedMesh&&Oe.batchingColor===!1&&Y.colorTexture!==null||Y.isInstancedMesh&&Oe.instancing===!1||!Y.isInstancedMesh&&Oe.instancing===!0||Y.isSkinnedMesh&&Oe.skinning===!1||!Y.isSkinnedMesh&&Oe.skinning===!0||Y.isInstancedMesh&&Oe.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Oe.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&Oe.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&Oe.instancingMorph===!1&&Y.morphTexture!==null||Oe.envMap!==Be||$.fog===!0&&Oe.fog!==Re||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==ge.numPlanes||Oe.numIntersection!==ge.numIntersection)||Oe.vertexAlphas!==qe||Oe.vertexTangents!==Ke||Oe.morphTargets!==Ve||Oe.morphNormals!==lt||Oe.morphColors!==Mt||Oe.toneMapping!==_t||Oe.morphTargetsCount!==Ot)&&(Qe=!0):(Qe=!0,Oe.__version=$.version);let mn=Oe.currentProgram;Qe===!0&&(mn=Hs($,G,Y));let Dn=!1,ki=!1,hr=!1;const ft=mn.getUniforms(),Ut=Oe.uniforms;if(le.useProgram(mn.program)&&(Dn=!0,ki=!0,hr=!0),$.id!==K&&(K=$.id,ki=!0),Dn||W!==y){le.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),ft.setValue(A,"projectionMatrix",y.projectionMatrix),ft.setValue(A,"viewMatrix",y.matrixWorldInverse);const yi=ft.map.cameraPosition;yi!==void 0&&yi.setValue(A,w.setFromMatrixPosition(y.matrixWorld)),re.logarithmicDepthBuffer&&ft.setValue(A,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&ft.setValue(A,"isOrthographic",y.isOrthographicCamera===!0),W!==y&&(W=y,ki=!0,hr=!0)}if(Oe.needsLights&&(sn.state.directionalShadowMap.length>0&&ft.setValue(A,"directionalShadowMap",sn.state.directionalShadowMap,U),sn.state.spotShadowMap.length>0&&ft.setValue(A,"spotShadowMap",sn.state.spotShadowMap,U),sn.state.pointShadowMap.length>0&&ft.setValue(A,"pointShadowMap",sn.state.pointShadowMap,U)),Y.isSkinnedMesh){ft.setOptional(A,Y,"bindMatrix"),ft.setOptional(A,Y,"bindMatrixInverse");const Dt=Y.skeleton;Dt&&(Dt.boneTexture===null&&Dt.computeBoneTexture(),ft.setValue(A,"boneTexture",Dt.boneTexture,U))}Y.isBatchedMesh&&(ft.setOptional(A,Y,"batchingTexture"),ft.setValue(A,"batchingTexture",Y._matricesTexture,U),ft.setOptional(A,Y,"batchingIdTexture"),ft.setValue(A,"batchingIdTexture",Y._indirectTexture,U),ft.setOptional(A,Y,"batchingColorTexture"),Y._colorsTexture!==null&&ft.setValue(A,"batchingColorTexture",Y._colorsTexture,U));const Ei=ee.morphAttributes;if((Ei.position!==void 0||Ei.normal!==void 0||Ei.color!==void 0)&&Pe.update(Y,ee,mn),(ki||Oe.receiveShadow!==Y.receiveShadow)&&(Oe.receiveShadow=Y.receiveShadow,ft.setValue(A,"receiveShadow",Y.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&G.environment!==null&&(Ut.envMapIntensity.value=G.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=ub()),ki&&(ft.setValue(A,"toneMappingExposure",b.toneMappingExposure),Oe.needsLights&&wp(Ut,hr),Re&&$.fog===!0&&Ie.refreshFogUniforms(Ut,Re),Ie.refreshMaterialUniforms(Ut,$,ze,_e,I.state.transmissionRenderTarget[y.id]),wo.upload(A,su(Oe),Ut,U)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(wo.upload(A,su(Oe),Ut,U),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&ft.setValue(A,"center",Y.center),ft.setValue(A,"modelViewMatrix",Y.modelViewMatrix),ft.setValue(A,"normalMatrix",Y.normalMatrix),ft.setValue(A,"modelMatrix",Y.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const Dt=$.uniformsGroups;for(let yi=0,pr=Dt.length;yi<pr;yi++){const au=Dt[yi];Le.update(au,mn),Le.bind(au,mn)}}return mn}function wp(y,G){y.ambientLightColor.needsUpdate=G,y.lightProbe.needsUpdate=G,y.directionalLights.needsUpdate=G,y.directionalLightShadows.needsUpdate=G,y.pointLights.needsUpdate=G,y.pointLightShadows.needsUpdate=G,y.spotLights.needsUpdate=G,y.spotLightShadows.needsUpdate=G,y.rectAreaLights.needsUpdate=G,y.hemisphereLights.needsUpdate=G}function Pp(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(y,G,ee){const $=g.get(y);$.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),g.get(y.texture).__webglTexture=G,g.get(y.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:ee,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,G){const ee=g.get(y);ee.__webglFramebuffer=G,ee.__useDefaultFramebuffer=G===void 0};const Dp=A.createFramebuffer();this.setRenderTarget=function(y,G=0,ee=0){H=y,C=G,P=ee;let $=null,Y=!1,Re=!1;if(y){const Ce=g.get(y);if(Ce.__useDefaultFramebuffer!==void 0){le.bindFramebuffer(A.FRAMEBUFFER,Ce.__webglFramebuffer),k.copy(y.viewport),F.copy(y.scissor),se=y.scissorTest,le.viewport(k),le.scissor(F),le.setScissorTest(se),K=-1;return}else if(Ce.__webglFramebuffer===void 0)U.setupRenderTarget(y);else if(Ce.__hasExternalTextures)U.rebindTextures(y,g.get(y.texture).__webglTexture,g.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const qe=y.depthTexture;if(Ce.__boundDepthTexture!==qe){if(qe!==null&&g.has(qe)&&(y.width!==qe.image.width||y.height!==qe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(y)}}const Ne=y.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(Re=!0);const Be=g.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Be[G])?$=Be[G][ee]:$=Be[G],Y=!0):y.samples>0&&U.useMultisampledRTT(y)===!1?$=g.get(y).__webglMultisampledFramebuffer:Array.isArray(Be)?$=Be[ee]:$=Be,k.copy(y.viewport),F.copy(y.scissor),se=y.scissorTest}else k.copy(z).multiplyScalar(ze).floor(),F.copy(N).multiplyScalar(ze).floor(),se=j;if(ee!==0&&($=Dp),le.bindFramebuffer(A.FRAMEBUFFER,$)&&le.drawBuffers(y,$),le.viewport(k),le.scissor(F),le.setScissorTest(se),Y){const Ce=g.get(y.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+G,Ce.__webglTexture,ee)}else if(Re){const Ce=G;for(let Ne=0;Ne<y.textures.length;Ne++){const Be=g.get(y.textures[Ne]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Ne,Be.__webglTexture,ee,Ce)}}else if(y!==null&&ee!==0){const Ce=g.get(y.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Ce.__webglTexture,ee)}K=-1},this.readRenderTargetPixels=function(y,G,ee,$,Y,Re,De,Ce=0){if(!(y&&y.isWebGLRenderTarget)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ne=g.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&De!==void 0&&(Ne=Ne[De]),Ne){le.bindFramebuffer(A.FRAMEBUFFER,Ne);try{const Be=y.textures[Ce],qe=Be.format,Ke=Be.type;if(y.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+Ce),!re.textureFormatReadable(qe)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!re.textureTypeReadable(Ke)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=y.width-$&&ee>=0&&ee<=y.height-Y&&A.readPixels(G,ee,$,Y,Me.convert(qe),Me.convert(Ke),Re)}finally{const Be=H!==null?g.get(H).__webglFramebuffer:null;le.bindFramebuffer(A.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(y,G,ee,$,Y,Re,De,Ce=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ne=g.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&De!==void 0&&(Ne=Ne[De]),Ne)if(G>=0&&G<=y.width-$&&ee>=0&&ee<=y.height-Y){le.bindFramebuffer(A.FRAMEBUFFER,Ne);const Be=y.textures[Ce],qe=Be.format,Ke=Be.type;if(y.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+Ce),!re.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!re.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ve=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Ve),A.bufferData(A.PIXEL_PACK_BUFFER,Re.byteLength,A.STREAM_READ),A.readPixels(G,ee,$,Y,Me.convert(qe),Me.convert(Ke),0);const lt=H!==null?g.get(H).__webglFramebuffer:null;le.bindFramebuffer(A.FRAMEBUFFER,lt);const Mt=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Dv(A,Mt,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Ve),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,Re),A.deleteBuffer(Ve),A.deleteSync(Mt),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,G=null,ee=0){const $=Math.pow(2,-ee),Y=Math.floor(y.image.width*$),Re=Math.floor(y.image.height*$),De=G!==null?G.x:0,Ce=G!==null?G.y:0;U.setTexture2D(y,0),A.copyTexSubImage2D(A.TEXTURE_2D,ee,0,0,De,Ce,Y,Re),le.unbindTexture()};const Ip=A.createFramebuffer(),Lp=A.createFramebuffer();this.copyTextureToTexture=function(y,G,ee=null,$=null,Y=0,Re=0){let De,Ce,Ne,Be,qe,Ke,Ve,lt,Mt;const _t=y.isCompressedTexture?y.mipmaps[Re]:y.image;if(ee!==null)De=ee.max.x-ee.min.x,Ce=ee.max.y-ee.min.y,Ne=ee.isBox3?ee.max.z-ee.min.z:1,Be=ee.min.x,qe=ee.min.y,Ke=ee.isBox3?ee.min.z:0;else{const Ut=Math.pow(2,-Y);De=Math.floor(_t.width*Ut),Ce=Math.floor(_t.height*Ut),y.isDataArrayTexture?Ne=_t.depth:y.isData3DTexture?Ne=Math.floor(_t.depth*Ut):Ne=1,Be=0,qe=0,Ke=0}$!==null?(Ve=$.x,lt=$.y,Mt=$.z):(Ve=0,lt=0,Mt=0);const ct=Me.convert(G.format),Ot=Me.convert(G.type);let Oe;G.isData3DTexture?(U.setTexture3D(G,0),Oe=A.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(U.setTexture2DArray(G,0),Oe=A.TEXTURE_2D_ARRAY):(U.setTexture2D(G,0),Oe=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,G.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,G.unpackAlignment);const sn=A.getParameter(A.UNPACK_ROW_LENGTH),Qe=A.getParameter(A.UNPACK_IMAGE_HEIGHT),mn=A.getParameter(A.UNPACK_SKIP_PIXELS),Dn=A.getParameter(A.UNPACK_SKIP_ROWS),ki=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,_t.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,_t.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Be),A.pixelStorei(A.UNPACK_SKIP_ROWS,qe),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Ke);const hr=y.isDataArrayTexture||y.isData3DTexture,ft=G.isDataArrayTexture||G.isData3DTexture;if(y.isDepthTexture){const Ut=g.get(y),Ei=g.get(G),Dt=g.get(Ut.__renderTarget),yi=g.get(Ei.__renderTarget);le.bindFramebuffer(A.READ_FRAMEBUFFER,Dt.__webglFramebuffer),le.bindFramebuffer(A.DRAW_FRAMEBUFFER,yi.__webglFramebuffer);for(let pr=0;pr<Ne;pr++)hr&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,g.get(y).__webglTexture,Y,Ke+pr),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,g.get(G).__webglTexture,Re,Mt+pr)),A.blitFramebuffer(Be,qe,De,Ce,Ve,lt,De,Ce,A.DEPTH_BUFFER_BIT,A.NEAREST);le.bindFramebuffer(A.READ_FRAMEBUFFER,null),le.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(Y!==0||y.isRenderTargetTexture||g.has(y)){const Ut=g.get(y),Ei=g.get(G);le.bindFramebuffer(A.READ_FRAMEBUFFER,Ip),le.bindFramebuffer(A.DRAW_FRAMEBUFFER,Lp);for(let Dt=0;Dt<Ne;Dt++)hr?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Ut.__webglTexture,Y,Ke+Dt):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Ut.__webglTexture,Y),ft?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Ei.__webglTexture,Re,Mt+Dt):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Ei.__webglTexture,Re),Y!==0?A.blitFramebuffer(Be,qe,De,Ce,Ve,lt,De,Ce,A.COLOR_BUFFER_BIT,A.NEAREST):ft?A.copyTexSubImage3D(Oe,Re,Ve,lt,Mt+Dt,Be,qe,De,Ce):A.copyTexSubImage2D(Oe,Re,Ve,lt,Be,qe,De,Ce);le.bindFramebuffer(A.READ_FRAMEBUFFER,null),le.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else ft?y.isDataTexture||y.isData3DTexture?A.texSubImage3D(Oe,Re,Ve,lt,Mt,De,Ce,Ne,ct,Ot,_t.data):G.isCompressedArrayTexture?A.compressedTexSubImage3D(Oe,Re,Ve,lt,Mt,De,Ce,Ne,ct,_t.data):A.texSubImage3D(Oe,Re,Ve,lt,Mt,De,Ce,Ne,ct,Ot,_t):y.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,Re,Ve,lt,De,Ce,ct,Ot,_t.data):y.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,Re,Ve,lt,_t.width,_t.height,ct,_t.data):A.texSubImage2D(A.TEXTURE_2D,Re,Ve,lt,De,Ce,ct,Ot,_t);A.pixelStorei(A.UNPACK_ROW_LENGTH,sn),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Qe),A.pixelStorei(A.UNPACK_SKIP_PIXELS,mn),A.pixelStorei(A.UNPACK_SKIP_ROWS,Dn),A.pixelStorei(A.UNPACK_SKIP_IMAGES,ki),Re===0&&G.generateMipmaps&&A.generateMipmap(Oe),le.unbindTexture()},this.initRenderTarget=function(y){g.get(y).__webglFramebuffer===void 0&&U.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?U.setTextureCube(y,0):y.isData3DTexture?U.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?U.setTexture2DArray(y,0):U.setTexture2D(y,0),le.unbindTexture()},this.resetState=function(){C=0,P=0,H=null,le.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),n.unpackColorSpace=Je._getUnpackColorSpace()}}const db={__name:"LoginClothScene",setup(t){const e=vt(null);let n=null,i=null,r=null,s=null,o=0,a=null;const l=[],c={x:0,y:0,vx:0,vy:0,targetX:0,targetY:0,strength:0,targetStrength:0,inside:!1};function u(v){const m=document.createElement("canvas");m.width=64,m.height=64;const p=m.getContext("2d"),S=p.createRadialGradient(32,32,3,32,32,32);S.addColorStop(0,"rgba(255,255,255,1)"),S.addColorStop(.24,v),S.addColorStop(.7,"rgba(255,255,255,0.18)"),S.addColorStop(1,"rgba(255,255,255,0)"),p.fillStyle=S,p.fillRect(0,0,64,64);const T=new rx(m);return T.colorSpace=nn,T}function d(v){const m=new Pn,p=new Float32Array(v.count*3),S=new Float32Array(v.count*3),T=new Float32Array(v.count*3),E=new Float32Array(v.count*4);for(let L=0;L<v.count;L+=1){const x=L*3,b=L*4,V=(Math.random()-.5)*v.width,C=(Math.random()-.5)*v.height,P=(Math.random()-.5)*v.depth;p[x]=V,p[x+1]=C,p[x+2]=P,S[x]=V,S[x+1]=C,S[x+2]=P,E[b]=Math.random()*Math.PI*2,E[b+1]=.3+Math.random()*1.4,E[b+2]=.4+Math.random()*.8,E[b+3]=.6+Math.random()*1.2}m.setAttribute("position",new Tn(p,3));const I=new mp({map:u(v.color),color:v.tint,transparent:!0,opacity:v.opacity,size:v.size,sizeAttenuation:!0,depthWrite:!1,blending:Al}),D=new ix(m,I);return{...v,points:D,geometry:m,material:I,positions:p,basePositions:S,velocities:T,seeds:E}}function f(v,m,p,S,T){const E=v.positions,I=v.basePositions,D=v.velocities,L=v.seeds,x=T?0:v.amplitude,b=v.influenceRadius,V=v.pointerStrength*c.strength;for(let C=0;C<v.count;C+=1){const P=C*3,H=C*4,K=I[P],W=I[P+1],k=I[P+2],F=Math.sin(m*L[H+1]+L[H])*x,se=Math.cos(m*L[H+2]+L[H])*x*.8,ce=Math.sin(m*L[H+3]+L[H])*x*1.3;let xe=K+F,Ee=W+se,_e=k+ce;const ze=xe-p,je=Ee-S,Se=ze*ze+je*je;if(Se<b*b){const z=Math.sqrt(Se)||1e-4,N=(1-z/b)*V;xe+=ze/z*N,Ee+=je/z*N*.68,_e+=N*.12}D[P]=(D[P]+(xe-E[P])*v.spring*c.strength)*v.friction,D[P+1]=(D[P+1]+(Ee-E[P+1])*v.spring*c.strength)*v.friction,D[P+2]=(D[P+2]+(_e-E[P+2])*v.spring*c.strength)*v.friction,D[P]+=(K+F-E[P])*v.spring*(1-c.strength)*.35,D[P+1]+=(W+se-E[P+1])*v.spring*(1-c.strength)*.35,D[P+2]+=(k+ce-E[P+2])*v.spring*(1-c.strength)*.25,E[P]+=D[P],E[P+1]+=D[P+1],E[P+2]+=D[P+2]}v.geometry.attributes.position.needsUpdate=!0,v.points.rotation.z=Math.sin(m*v.rotationSpeed)*v.rotationAmount,v.points.rotation.x=Math.cos(m*v.rotationSpeed*.72)*v.rotationAmount*.45}function h(){const v=e.value;if(!v)return;const m=window.matchMedia("(prefers-reduced-motion: reduce)"),p=new _x;n=new fb({alpha:!0,antialias:!0,powerPreference:"high-performance"}),n.outputColorSpace=nn,n.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8)),n.domElement.className="login-cloth-scene__canvas",n.domElement.style.touchAction="none",v.appendChild(n.domElement),i=new Yv,i.fog=new Zc(16183267,12,26),r=new fn(36,1,.1,100),r.position.set(0,0,11);const S=new px(16249578,11454168,1.85);i.add(S),[{count:240,width:10.5,height:7.2,depth:3.2,size:.16,opacity:.66,amplitude:.036,influenceRadius:2.6,pointerStrength:.14,spring:.022,friction:.945,rotationSpeed:.14,rotationAmount:.024,color:"rgba(255, 228, 188, 0.85)",tint:16773331},{count:180,width:8.8,height:6.4,depth:2.2,size:.1,opacity:.5,amplitude:.024,influenceRadius:2.15,pointerStrength:.11,spring:.025,friction:.95,rotationSpeed:.19,rotationAmount:.022,color:"rgba(190, 231, 255, 0.9)",tint:14086655},{count:120,width:7.4,height:5.2,depth:1.5,size:.07,opacity:.34,amplitude:.016,influenceRadius:1.8,pointerStrength:.08,spring:.028,friction:.952,rotationSpeed:.24,rotationAmount:.018,color:"rgba(255, 255, 255, 0.92)",tint:16777215}].forEach((V,C)=>{const P=d(V);P.points.position.z=-C*.65,l.push(P),i.add(P.points)});function E(){if(!e.value||!n||!r)return;const{clientWidth:V,clientHeight:C}=e.value;!V||!C||(n.setSize(V,C,!1),r.aspect=V/C,r.updateProjectionMatrix())}function I(V){const C=n.domElement.getBoundingClientRect(),P=(V.clientX-C.left)/C.width*2-1,H=-((V.clientY-C.top)/C.height)*2+1;c.targetX=P*4.2,c.targetY=H*2.8,c.inside=!0,c.targetStrength=1}function D(V){I(V)}function L(V){I(V)}function x(){c.inside=!1,c.targetX=0,c.targetY=0,c.targetStrength=0}n.domElement.addEventListener("pointermove",D),n.domElement.addEventListener("pointerenter",L),n.domElement.addEventListener("pointerleave",x),a=()=>{var V,C,P;(V=n==null?void 0:n.domElement)==null||V.removeEventListener("pointermove",D),(C=n==null?void 0:n.domElement)==null||C.removeEventListener("pointerenter",L),(P=n==null?void 0:n.domElement)==null||P.removeEventListener("pointerleave",x)},s=new ResizeObserver(E),s.observe(v),E();function b(){o=window.requestAnimationFrame(b);const V=Math.min(p.getDelta(),1/24),C=p.elapsedTime,P=m.matches,H=1-Math.exp(-V*4.2),K=Math.exp(-V*7.2),W=1-Math.exp(-V*4.8),k=1-Math.exp(-V*3.1);c.vx+=(c.targetX-c.x)*H,c.vy+=(c.targetY-c.y)*H,c.vx*=K,c.vy*=K,c.x+=c.vx*V*60,c.y+=c.vy*V*60,c.strength+=(c.targetStrength-c.strength)*W,l.forEach(F=>f(F,C,c.x,c.y,P)),r.position.x+=(c.x*.038-r.position.x)*k,r.position.y+=(c.y*.024-r.position.y)*k,r.lookAt(0,0,0),n.render(i,r)}b()}function _(){var v;window.cancelAnimationFrame(o),a==null||a(),s==null||s.disconnect(),l.forEach(m=>{var p,S;m.geometry.dispose(),(S=(p=m.material.map)==null?void 0:p.dispose)==null||S.call(p),m.material.dispose()}),l.length=0,i==null||i.traverse(m=>{var p,S,T,E;(S=(p=m.geometry)==null?void 0:p.dispose)==null||S.call(p),m.material&&!Array.isArray(m.material)&&((E=(T=m.material).dispose)==null||E.call(T))}),n==null||n.dispose(),(v=n==null?void 0:n.domElement)==null||v.remove(),n=null,i=null,r=null,s=null,a=null,c.x=0,c.y=0,c.vx=0,c.vy=0,c.targetX=0,c.targetY=0,c.strength=0,c.targetStrength=0,c.inside=!1}return Lc(()=>{try{h()}catch(v){console.error("[LoginClothScene]",v)}}),ta(()=>{_()}),(v,m)=>(gt(),Et("div",{ref_key:"rootRef",ref:e,class:"login-cloth-scene","aria-hidden":"true"},null,512))}},hb=Hi(db,[["__scopeId","data-v-df17b137"]]),pb={class:"login-page"},mb=["aria-label"],gb={class:"music-trigger__tooltip",role:"tooltip"},_b={class:"login-shell"},vb={class:"password-wrap"},xb=["type","autocomplete"],Sb=["aria-label","title"],Mb={key:0,viewBox:"0 0 24 24","aria-hidden":"true"},Eb={key:1,viewBox:"0 0 24 24","aria-hidden":"true"},yb={key:0},bb={class:"code-wrap"},Tb=["disabled"],Ab={key:1},Rb=["type"],Cb=["disabled"],wb={class:"auth-switch"},Pb="/luoluo",cl="Drink, Pray, Love!",Db={__name:"LoginView",setup(t){const e=zc(),n=x0(),i="".trim(),r=vt(!1),s=vt(e.query.mode==="register"?"register":"login"),o=yt(()=>s.value==="register"),a=vt(""),l=vt(""),c=vt(""),u=vt(""),d=vt(!1),f=vt(!1),h=vt(0),_=vt(""),v=vt("info"),m=vt(null),p=vt(!1),S=vt(!1);let T=null;const E=yt(()=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.value)),I=yt(()=>d.value?"发送中...":h.value>0?`${h.value}s 后重发`:"发送验证码"),D=yt(()=>f.value?o.value?"注册中...":"登录中...":o.value?"注册":"登录"),L=yt(()=>o.value&&E.value&&!d.value&&h.value===0&&!f.value),x=yt(()=>o.value?"register-card":"login-card"),b=yt(()=>p.value?`${cl} · 点击播放`:S.value?`${cl} · 正在播放`:`${cl} · 已暂停`);function V(Se,z="info"){_.value=Se,v.value=z}function C(Se){s.value!==Se&&(s.value=Se,r.value=!1,l.value="",c.value="",u.value="",P(),h.value=0,V("","info"))}function P(){T&&(clearInterval(T),T=null)}function H(Se=60){h.value=Se,P(),T=setInterval(()=>{if(h.value<=1){h.value=0,P();return}h.value-=1},1e3)}function K(){u.value=u.value.replace(/\D/g,"").slice(0,6)}function W(Se){const z=Se.trim();return z?z.length<6?"密码长度至少 6 位":"":"请输入密码"}async function k(Se,z){const N=Se.startsWith("/")?Se:`/${Se}`,j=await fetch(`${i}${Pb}${N}`,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(z)}),me=(j.headers.get("content-type")||"").includes("application/json")?await j.json():{message:await j.text()};if(!j.ok)throw new Error((me==null?void 0:me.message)||(me==null?void 0:me.error)||"请求失败，请稍后重试");return me}function F(Se){var N;const z=(Se==null?void 0:Se.token)||((N=Se==null?void 0:Se.data)==null?void 0:N.token)||"";z&&localStorage.setItem("auth_token",z)}function se(){const Se=m.value;Se&&(Se.pause(),Se.currentTime=0,S.value=!1,p.value=!1)}async function ce(){const Se=m.value;if(Se){Se.volume=.45;try{await Se.play(),S.value=!0,p.value=!1}catch{S.value=!1,p.value=!0}}}function xe(){const Se=m.value;if(Se){if(Se.paused){ce();return}Se.pause(),S.value=!1}}function Ee(){S.value=!0,p.value=!1}function _e(){S.value=!1}async function ze(){if(!E.value){V("请先输入正确的邮箱地址","error");return}if(L.value){d.value=!0,V("","info");try{const Se=await k("/api/auth/send-code",{email:a.value.trim()});V((Se==null?void 0:Se.message)||"验证码已发送，请查收邮箱","success"),H(60)}catch(Se){V((Se==null?void 0:Se.message)||"验证码发送失败，请稍后重试","error")}finally{d.value=!1}}}async function je(){if(f.value)return;if(V("","info"),!E.value){V("请输入正确的邮箱地址","error");return}const Se=W(l.value);if(Se){V(Se,"error");return}f.value=!0;try{if(o.value){if(K(),u.value.length!==6){V("请输入 6 位邮箱验证码","error");return}if(!c.value.trim()){V("请再次输入密码","error");return}if(l.value.trim()!==c.value.trim()){V("两次输入的密码不一致","error");return}const N=await k("/api/auth/register",{email:a.value.trim(),password:l.value.trim(),code:u.value});l.value="",c.value="",u.value="",P(),h.value=0,C("login"),V((N==null?void 0:N.message)||"注册成功，请登录","success");return}const z=await k("/api/auth/login",{email:a.value.trim(),password:l.value.trim()});F(z),V((z==null?void 0:z.message)||"登录成功，正在跳转","success"),await n.push("/")}catch(z){V((z==null?void 0:z.message)||"请求失败，请稍后重试","error")}finally{f.value=!1}}return ms(()=>[e.query.mode,e.query.email],([Se,z])=>{Se==="register"?C("register"):Se==="login"&&C("login"),typeof z=="string"&&z&&(a.value=z),Jo(()=>{ce()})},{immediate:!0}),ta(()=>{P(),se()}),(Se,z)=>(gt(),Et("section",pb,[z[13]||(z[13]=mg('<div class="bg-shape bg-a" data-v-d4f7afd9></div><div class="bg-shape bg-b" data-v-d4f7afd9></div><div class="bg-shape bg-c" data-v-d4f7afd9></div><div class="bg-shape bg-d" data-v-d4f7afd9></div><div class="bg-shape bg-e" data-v-d4f7afd9></div><div class="bg-shape bg-f" data-v-d4f7afd9></div>',6)),ht(hb,{class:"page-particles"}),z[14]||(z[14]=Ae("a",{class:"github-link",href:"https://github.com/luoluo10486",target:"_blank",rel:"noopener noreferrer","aria-label":"打开 GitHub 主页",title:"GitHub"},[Ae("svg",{viewBox:"0 0 24 24","aria-hidden":"true"},[Ae("path",{d:"M12 .5a11.5 11.5 0 0 0-3.637 22.41c.575.106.785-.25.785-.556 0-.275-.01-1.004-.016-1.97-3.193.694-3.868-1.538-3.868-1.538-.522-1.326-1.276-1.68-1.276-1.68-1.043-.714.079-.699.079-.699 1.153.081 1.759 1.184 1.759 1.184 1.025 1.757 2.69 1.25 3.346.956.103-.743.401-1.25.729-1.538-2.55-.29-5.232-1.275-5.232-5.674 0-1.253.447-2.278 1.18-3.08-.118-.29-.512-1.455.112-3.034 0 0 .962-.308 3.15 1.176a10.95 10.95 0 0 1 5.736 0c2.186-1.484 3.146-1.176 3.146-1.176.626 1.579.232 2.744.114 3.034.735.802 1.178 1.827 1.178 3.08 0 4.41-2.686 5.38-5.244 5.664.412.355.779 1.055.779 2.126 0 1.536-.014 2.775-.014 3.153 0 .309.207.668.79.554A11.5 11.5 0 0 0 12 .5Z",fill:"currentColor"})])],-1)),Ae("audio",{ref_key:"loginMusicRef",ref:m,src:"/login-bgm.mp3",preload:"auto",loop:"",onPlay:Ee,onPause:_e},null,544),Ae("button",{type:"button",class:En(["music-trigger",{"is-playing":S.value,"is-blocked":p.value}]),"aria-label":S.value?"暂停音乐":"播放音乐",onClick:xe},[z[6]||(z[6]=Ae("svg",{class:"music-trigger__icon music-note",viewBox:"0 0 64 64","aria-hidden":"true"},[Ae("path",{d:"M31 12v27.5M31 12l18 11M31 12c6 1 9 4 11 8.5",fill:"none",stroke:"#5853a6","stroke-width":"3.5","stroke-linecap":"round","stroke-linejoin":"round"}),Ae("ellipse",{cx:"25.5",cy:"45.5",rx:"9.5",ry:"7.5",fill:"#f4c24f"}),Ae("ellipse",{cx:"25.5",cy:"45.5",rx:"9.5",ry:"7.5",fill:"none",stroke:"#5853a6","stroke-width":"3.3"})],-1)),Ae("span",gb,zt(b.value),1)],10,mb),Ae("div",_b,[(gt(),Et("form",{key:x.value,class:"login-card",onSubmit:o_(je,["prevent"])},[Ae("h1",null,zt(o.value?"创建账号":"请登录"),1),Ae("label",null,[z[7]||(z[7]=Ae("span",null,"邮箱",-1)),Xs(Ae("input",{"onUpdate:modelValue":z[0]||(z[0]=N=>a.value=N),type:"email",placeholder:"请输入邮箱",autocomplete:"email"},null,512),[[Bo,a.value,void 0,{trim:!0}]])]),Ae("label",null,[z[10]||(z[10]=Ae("span",null,"密码",-1)),Ae("div",vb,[Xs(Ae("input",{"onUpdate:modelValue":z[1]||(z[1]=N=>l.value=N),type:r.value?"text":"password",placeholder:"请输入密码",autocomplete:o.value?"new-password":"current-password"},null,8,xb),[[Ku,l.value]]),Ae("button",{type:"button",class:En(["toggle",r.value?"is-visible":"is-hidden"]),"aria-label":r.value?"隐藏密码":"显示密码",title:r.value?"隐藏密码":"显示密码",onClick:z[2]||(z[2]=N=>r.value=!r.value)},[r.value?(gt(),Et("svg",Mb,[...z[8]||(z[8]=[Ae("path",{d:"M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Z"},null,-1),Ae("circle",{cx:"12",cy:"12",r:"2.8"},null,-1)])])):(gt(),Et("svg",Eb,[...z[9]||(z[9]=[Ae("path",{d:"M4 15c2.2-2.6 5-4 8-4 3.1 0 5.8 1.4 8 4"},null,-1),Ae("path",{d:"M8.2 18 6.8 20"},null,-1),Ae("path",{d:"M12 17.6V20"},null,-1),Ae("path",{d:"m15.8 18 1.4 2"},null,-1)])]))],10,Sb)])]),o.value?(gt(),Et("label",yb,[z[11]||(z[11]=Ae("span",null,"邮箱验证码",-1)),Ae("div",bb,[Xs(Ae("input",{"onUpdate:modelValue":z[3]||(z[3]=N=>u.value=N),type:"text",inputmode:"numeric",maxlength:"6",placeholder:"请输入验证码",autocomplete:"one-time-code",onInput:K},null,544),[[Bo,u.value,void 0,{trim:!0}]]),Ae("button",{type:"button",class:"send-code",disabled:!L.value,onClick:ze},zt(I.value),9,Tb)])])):Ea("",!0),o.value?(gt(),Et("label",Ab,[z[12]||(z[12]=Ae("span",null,"确认密码",-1)),Xs(Ae("input",{"onUpdate:modelValue":z[4]||(z[4]=N=>c.value=N),type:r.value?"text":"password",placeholder:"请再次输入密码",autocomplete:"new-password"},null,8,Rb),[[Ku,c.value]])])):Ea("",!0),Ae("button",{class:"submit",type:"submit",disabled:f.value},zt(D.value),9,Cb),Ae("p",wb,[Ae("span",null,zt(o.value?"已有账号？":"还没有账号？"),1),Ae("button",{type:"button",class:"auth-switch__action",onClick:z[5]||(z[5]=N=>C(o.value?"login":"register"))},zt(o.value?"立即登录":"立即注册"),1)]),_.value?(gt(),Et("p",{key:2,class:En(["form-tip",`form-tip--${v.value}`])},zt(_.value),3)):Ea("",!0)],32))])]))}},Ib=Hi(Db,[["__scopeId","data-v-d4f7afd9"]]),Lb=v0({history:Z_(),routes:[{path:"/",name:"home",component:B0},{path:"/articles",name:"articles",component:X0},{path:"/about",name:"about",component:K0},{path:"/login",name:"login",component:Ib,meta:{fullscreen:!0}},{path:"/register",redirect:{path:"/login",query:{mode:"register"}}}]}),Jc=c_(C0);Jc.use(h_());Jc.use(Lb);Jc.mount("#app");
