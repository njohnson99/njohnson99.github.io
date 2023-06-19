var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function a(t){t.forEach(e)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let o,s;function c(t,e){return o||(o=document.createElement("a")),o.href=e,t===o.href}function l(t,e){t.appendChild(e)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function m(){return h(" ")}function p(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function f(t){s=t}const g=[],v=[],b=[],y=[],w=Promise.resolve();let k=!1;function $(t){b.push(t)}const x=new Set;let _=0;function S(){const t=s;do{for(;_<g.length;){const t=g[_];_++,f(t),C(t.$$)}for(f(null),g.length=0,_=0;v.length;)v.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];x.has(e)||(x.add(e),e())}b.length=0}while(g.length);for(;y.length;)y.pop()();k=!1,x.clear(),f(t)}function C(t){if(null!==t.fragment){t.update(),a(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach($)}}const M=new Set;function A(t,e){-1===t.$$.dirty[0]&&(g.push(t),k||(k=!0,w.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function T(i,o,c,l,u,h,m,p=[-1]){const g=s;f(i);const v=i.$$={fragment:null,ctx:[],props:h,update:t,not_equal:u,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(g?g.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:o.target||g.$$.root};m&&m(v.root);let b=!1;if(v.ctx=c?c(i,o.props||{},((t,e,...n)=>{const a=n.length?n[0]:e;return v.ctx&&u(v.ctx[t],v.ctx[t]=a)&&(!v.skip_bound&&v.bound[t]&&v.bound[t](a),b&&A(i,t)),e})):[],v.update(),b=!0,a(v.before_update),v.fragment=!!l&&l(v.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);v.fragment&&v.fragment.l(t),t.forEach(d)}else v.fragment&&v.fragment.c();o.intro&&((y=i.$$.fragment)&&y.i&&(M.delete(y),y.i(w))),function(t,n,i,o){const{fragment:s,after_update:c}=t.$$;s&&s.m(n,i),o||$((()=>{const n=t.$$.on_mount.map(e).filter(r);t.$$.on_destroy?t.$$.on_destroy.push(...n):a(n),t.$$.on_mount=[]})),c.forEach($)}(i,o.target,o.anchor,o.customElement),S()}var y,w;f(g)}class I{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(a(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(e,n){if(!r(n))return t;const a=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return a.push(n),()=>{const t=a.indexOf(n);-1!==t&&a.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function P(e){let n,a,r,i,o,s,f,g,v,b,y,w,k,$,x,_,S,C,M,A,T,I,P,H,L,E,q,j,G,F,J,R,V,X,z,B,O,U,W,K,Z,Q;return{c(){n=u("main"),a=u("div"),r=u("div"),r.innerHTML="<b>Nari Johnson</b>",i=m(),o=u("div"),s=u("a"),s.textContent="Google Scholar",f=m(),g=u("img"),b=m(),y=u("a"),y.textContent="Github",w=m(),k=u("img"),x=m(),_=u("a"),_.textContent="Twitter",S=m(),C=u("div"),M=h('Hello! My name is Nari (rhymes with "'),A=u("a"),T=h("starry"),I=h("\") and I am a PhD student in Carnegie Mellon University's "),P=u("a"),P.textContent="Machine Learning Department",H=h(" advised by "),L=u("a"),L.textContent="Hoda Heidari",E=h(".\n\t\t\tI've also been lucky to work with "),q=u("a"),q.textContent="Ameet Talwalkar",j=h(".  \n\t\t\tI graduated from Harvard in 2021 with a BA and MS in Computer Science, where I previously worked with "),G=u("a"),G.textContent="Finale Doshi-Velez",F=h("."),J=u("br"),R=u("br"),V=h("\n\t\n\t\t\tI am broadly interested in the societal impacts of machine learning.  \n\t\t\tMy recent work uses methods from ML and HCI to examine tools that help stakeholders understand the behavior of complex models.  \n\t\t\tMy present research interests lie in algorithmic transparency, evaluation, and accountability."),X=u("br"),z=u("br"),B=h("\n\n\t\t\tEmail: narij at cmu dot edu"),O=m(),U=u("div"),U.innerHTML='<div id="header" class="svelte-sccdu3">Recent Work</div>\n\n\t\t\t* denotes equal contribution.  Honors <mark class="svelte-sccdu3">highlighted</mark>.\n\t\t\t\n\t\t\t<div class="article svelte-sccdu3"><i>&quot;Where Does My Model Underperform? A Human Evaluation of Slice Discovery Algorithms&quot;</i>. \n\t\t\t\t<b>Nari Johnson</b>, Ángel Alexander Cabrera, Gregory Plumb, Ameet Talwalkar. \n\t\t\t\tPreprint (under review). \n\t\t\t\t[<a href="https://arxiv.org/abs/2306.08167">arXiv</a>]</div> \n\n\t\t\t<div class="article svelte-sccdu3"><i>&quot;Towards a More Rigorous Science of Blindspot Discovery in Image Classification Models&quot;</i>. \n\t\t\t\tGregory Plumb*, <b>Nari Johnson</b>*, Ángel Alexander Cabrera, Ameet Talwalkar.\n\t\t\t\tICML Workshop on Spurious Correlations, Invariance, and Stability, 2022.\n\t\t\t\tTransactions on ML Research (TMLR), 2023.\n\t\t\t\t[<a href="https://arxiv.org/abs/2207.04104">arXiv</a>]</div> \n\n\n\t\t\t<div class="article svelte-sccdu3"><i>&quot;Use-Case-Grounded Simulations for Explanation Evaluation&quot;</i>. \n\t\t\t\tValerie Chen, <b>Nari Johnson</b>, Nicholay Topin*, Gregory Plumb*, Ameet Talwalkar.\n\t\t\t\tNeurIPS, 2022.\n\t\t\t\t[<a href="https://arxiv.org/abs/2206.02256">arXiv</a>]</div> \n\n\n\t\t\t<div class="article svelte-sccdu3"><i>&quot;OpenXAI: Towards a Transparent Evaluation of Model Explanations&quot;</i>. \n\t\t\t\tChirag Agarwal, Satyapriya Krishna, Eshika Saxena, Martin Pawelczyk, <b>Nari Johnson</b>, Isha Puri, Marinka Zitnik, Himabindu Lakkaraju.\n\t\t\t\tICLR Pair2Struct Workshop, 2022 <mark class="svelte-sccdu3">(Oral)</mark>.\n\t\t\t\tNeurIPS Track on Datasets and Benchmarks, 2022.\n\t\t\t\t[<a href="https://arxiv.org/abs/2206.11104">arXiv</a>] [<a href="https://open-xai.github.io">code</a>]</div> \n\n\t\t\t<div class="article svelte-sccdu3"><i>&quot;Learning Predictive and Interpretable Timeseries Summaries from ICU Data.&quot;</i>.\n\t\t\t\t<b>Nari Johnson</b>, Sonali Parbhoo, Andrew Slavin Ross, Finale Doshi-Velez.\n\t\t\t\tAMIA Annual Symposium, 2021.  <mark class="svelte-sccdu3">Student Paper Competition Finalist</mark>, <mark class="svelte-sccdu3">Knowledge Discovery &amp; Data Mining Student Innovation Award</mark>.\n\t\t\t\t[<a href="https://arxiv.org/abs/2109.11043">arXiv</a>]</div>',W=m(),K=u("div"),K.innerHTML='<div id="header" class="svelte-sccdu3">Teaching</div>\n\t\t\t\n\t\t\tI&#39;ve greatly enjoyed helping to teach several classes in college and my PhD.\n\t\t\tMy teaching philosophy is inspired by my commitment to expanding access to computing, and understanding teaching as a transformative practice.\n\t\t\tIn college, I designed and led Harvard Computer Science&#39;s first <a href="https://www.thecrimson.com/article/2020/10/7/cs-tf-training/">inclusive teaching training</a>.\n\t\t\tMy teaching has been recognized with several honors, including Carnegie Mellon&#39;s <mark class="svelte-sccdu3">Machine Learning TA Award</mark>, Harvard&#39;s <mark class="svelte-sccdu3"><a href="https://csadvising.seas.harvard.edu/opportunities/patel/">Alex Patel Teaching Fellowship</a></mark>, and Harvard&#39;s <mark class="svelte-sccdu3"><a href="https://bokcenter.harvard.edu/teaching-awards">Derek Bok Certificate of Distinction in Teaching</a> (4x)</mark>.<br/> \n\n\t\t\t<ul><li><a href="https://www.cs.cmu.edu/~aarti/Class/10701_Spring23/">10-701: Introduction to Machine Learning</a>, Spring 2023</li> \n\t\t\t\t<li><a href="https://harvard-ml-courses.github.io/cs181-web/">CS 181: Machine Learning</a>, Spring 2021. <b>Head Teaching Fellow</b></li> \n\t\t\t\t<li><a href="http://people.seas.harvard.edu/~madhusudan/courses/Fall2020/">CS 121: Theoretical Computer Science</a>, Fall 2020. <b>Alex Patel Fellow</b></li> \n\t\t\t\t<li><a href="https://harvard-ml-courses.github.io/cs181-web/">CS 181: Machine Learning</a>, Spring 2020</li> \n\t\t\t\t<li><a href="https://cs121.boazbarak.org/">CS 121: Theoretical Computer Science</a>, Fall 2019</li> \n\t\t\t\t<li><a href="https://qrd.college.harvard.edu/classes/math-23c-mathematics-computation-statistics-and-data-science">Math 23c: Mathematics for Computation and Data Science</a>, Spring 2019</li></ul>',Z=m(),Q=u("div"),p(r,"id","header"),p(r,"class","svelte-sccdu3"),p(s,"href","https://scholar.google.com/citations?hl=en&user=otKyVIAAAAAJ"),c(g.src,v=N)||p(g,"src",v),p(g,"width","20"),p(y,"href","https://github.com/njohnson99"),c(k.src,$=N)||p(k,"src",$),p(k,"width","20"),p(_,"href","https://twitter.com/narijohnson"),p(o,"id","links"),p(o,"class","svelte-sccdu3"),p(A,"href",D),p(P,"href","https://www.ml.cmu.edu/about/"),p(L,"href","https://www.cs.cmu.edu/~hheidari/"),p(q,"href","https://www.cs.cmu.edu/~atalwalk/"),p(G,"href","https://finale.seas.harvard.edu"),p(C,"id","intro-div"),p(C,"class","svelte-sccdu3"),p(U,"id","research-div"),p(U,"class","svelte-sccdu3"),p(K,"id","teaching-div"),p(K,"class","svelte-sccdu3"),p(Q,"id","filler"),p(a,"id","page-container"),p(a,"class","svelte-sccdu3")},m(t,e){!function(t,e,n){t.insertBefore(e,n||null)}(t,n,e),l(n,a),l(a,r),l(a,i),l(a,o),l(o,s),l(o,f),l(o,g),l(o,b),l(o,y),l(o,w),l(o,k),l(o,x),l(o,_),l(a,S),l(a,C),l(C,M),l(C,A),l(A,T),l(C,I),l(C,P),l(C,H),l(C,L),l(C,E),l(C,q),l(C,j),l(C,G),l(C,F),l(C,J),l(C,R),l(C,V),l(C,X),l(C,z),l(C,B),l(a,O),l(a,U),l(a,W),l(a,K),l(a,Z),l(a,Q)},p:t,i:t,o:t,d(t){t&&d(n)}}}let N="./pagebreak.png",D="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/700px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg";return new class extends I{constructor(t){super(),T(this,t,null,P,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
