
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/App.svelte generated by Svelte v3.55.0 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div13;
    	let div0;
    	let b0;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let a1;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let a2;
    	let t9;
    	let div2;
    	let t10;
    	let a3;
    	let t11;
    	let t12;
    	let a4;
    	let t14;
    	let a5;
    	let t16;
    	let a6;
    	let t18;
    	let a7;
    	let t20;
    	let br0;
    	let br1;
    	let t21;
    	let br2;
    	let br3;
    	let t22;
    	let t23;
    	let div9;
    	let div3;
    	let t25;
    	let mark0;
    	let t27;
    	let div4;
    	let i0;
    	let t29;
    	let b1;
    	let t31;
    	let a8;
    	let t33;
    	let t34;
    	let div5;
    	let i1;
    	let t36;
    	let b2;
    	let t38;
    	let a9;
    	let t40;
    	let t41;
    	let div6;
    	let i2;
    	let t43;
    	let b3;
    	let t45;
    	let a10;
    	let t47;
    	let t48;
    	let div7;
    	let i3;
    	let t50;
    	let b4;
    	let t52;
    	let mark1;
    	let t54;
    	let a11;
    	let t56;
    	let a12;
    	let t58;
    	let t59;
    	let div8;
    	let i4;
    	let t61;
    	let b5;
    	let t63;
    	let mark2;
    	let t65;
    	let mark3;
    	let t67;
    	let a13;
    	let t69;
    	let t70;
    	let div11;
    	let div10;
    	let t72;
    	let a14;
    	let t74;
    	let mark4;
    	let t76;
    	let mark5;
    	let a15;
    	let t78;
    	let mark6;
    	let a16;
    	let t80;
    	let t81;
    	let br4;
    	let t82;
    	let ul;
    	let li0;
    	let a17;
    	let t84;
    	let t85;
    	let li1;
    	let a18;
    	let t87;
    	let b6;
    	let t89;
    	let li2;
    	let a19;
    	let t91;
    	let b7;
    	let t93;
    	let li3;
    	let a20;
    	let t95;
    	let t96;
    	let li4;
    	let a21;
    	let t98;
    	let t99;
    	let li5;
    	let a22;
    	let t101;
    	let t102;
    	let div12;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div13 = element("div");
    			div0 = element("div");
    			b0 = element("b");
    			b0.textContent = "Nari Johnson";
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Google Scholar";
    			t3 = space();
    			img0 = element("img");
    			t4 = space();
    			a1 = element("a");
    			a1.textContent = "Github";
    			t6 = space();
    			img1 = element("img");
    			t7 = space();
    			a2 = element("a");
    			a2.textContent = "Twitter";
    			t9 = space();
    			div2 = element("div");
    			t10 = text("Hello! My name is Nari (rhymes with \"");
    			a3 = element("a");
    			t11 = text("starry");
    			t12 = text("\") and I am a PhD student in Carnegie Mellon University's ");
    			a4 = element("a");
    			a4.textContent = "Machine Learning Department";
    			t14 = text(" advised by ");
    			a5 = element("a");
    			a5.textContent = "Hoda Heidari";
    			t16 = text(".\n\t\t\tI've also been lucky to work with ");
    			a6 = element("a");
    			a6.textContent = "Ameet Talwalkar";
    			t18 = text(".  \n\t\t\tI graduated from Harvard in 2021 with a BA and MS in Computer Science, where I previously worked with ");
    			a7 = element("a");
    			a7.textContent = "Finale Doshi-Velez";
    			t20 = text(".");
    			br0 = element("br");
    			br1 = element("br");
    			t21 = text("\n\t\n\t\t\tI am broadly interested in the societal impacts of machine learning.  \n\t\t\tMy recent work uses methods from ML and HCI to examine tools that help stakeholders understand the behavior of complex models.  \n\t\t\tMy present research interests lie in algorithmic transparency, evaluation, and accountability.");
    			br2 = element("br");
    			br3 = element("br");
    			t22 = text("\n\n\t\t\tEmail: narij at cmu dot edu");
    			t23 = space();
    			div9 = element("div");
    			div3 = element("div");
    			div3.textContent = "Recent Work";
    			t25 = text("\n\n\t\t\t* denotes equal contribution.  Honors ");
    			mark0 = element("mark");
    			mark0.textContent = "highlighted";
    			t27 = text(".\n\t\t\t\n\t\t\t");
    			div4 = element("div");
    			i0 = element("i");
    			i0.textContent = "\"Where Does My Model Underperform? A Human Evaluation of Slice Discovery Algorithms\"";
    			t29 = text(". \n\t\t\t\t");
    			b1 = element("b");
    			b1.textContent = "Nari Johnson";
    			t31 = text(", Ángel Alexander Cabrera, Gregory Plumb, Ameet Talwalkar. \n\t\t\t\tPreprint (under review). \n\t\t\t\t[");
    			a8 = element("a");
    			a8.textContent = "arXiv";
    			t33 = text("]");
    			t34 = space();
    			div5 = element("div");
    			i1 = element("i");
    			i1.textContent = "\"Towards a More Rigorous Science of Blindspot Discovery in Image Classification Models\"";
    			t36 = text(". \n\t\t\t\tGregory Plumb*, ");
    			b2 = element("b");
    			b2.textContent = "Nari Johnson";
    			t38 = text("*, Ángel Alexander Cabrera, Ameet Talwalkar.\n\t\t\t\tICML Workshop on Spurious Correlations, Invariance, and Stability, 2022.\n\t\t\t\tTransactions on ML Research (TMLR), 2023.\n\t\t\t\t[");
    			a9 = element("a");
    			a9.textContent = "arXiv";
    			t40 = text("]");
    			t41 = space();
    			div6 = element("div");
    			i2 = element("i");
    			i2.textContent = "\"Use-Case-Grounded Simulations for Explanation Evaluation\"";
    			t43 = text(". \n\t\t\t\tValerie Chen, ");
    			b3 = element("b");
    			b3.textContent = "Nari Johnson";
    			t45 = text(", Nicholay Topin*, Gregory Plumb*, Ameet Talwalkar.\n\t\t\t\tNeurIPS, 2022.\n\t\t\t\t[");
    			a10 = element("a");
    			a10.textContent = "arXiv";
    			t47 = text("]");
    			t48 = space();
    			div7 = element("div");
    			i3 = element("i");
    			i3.textContent = "\"OpenXAI: Towards a Transparent Evaluation of Model Explanations\"";
    			t50 = text(". \n\t\t\t\tChirag Agarwal, Satyapriya Krishna, Eshika Saxena, Martin Pawelczyk, ");
    			b4 = element("b");
    			b4.textContent = "Nari Johnson";
    			t52 = text(", Isha Puri, Marinka Zitnik, Himabindu Lakkaraju.\n\t\t\t\tICLR Pair2Struct Workshop, 2022 ");
    			mark1 = element("mark");
    			mark1.textContent = "(Oral)";
    			t54 = text(".\n\t\t\t\tNeurIPS Track on Datasets and Benchmarks, 2022.\n\t\t\t\t[");
    			a11 = element("a");
    			a11.textContent = "arXiv";
    			t56 = text("] [");
    			a12 = element("a");
    			a12.textContent = "code";
    			t58 = text("]");
    			t59 = space();
    			div8 = element("div");
    			i4 = element("i");
    			i4.textContent = "\"Learning Predictive and Interpretable Timeseries Summaries from ICU Data.\"";
    			t61 = text(".\n\t\t\t\t");
    			b5 = element("b");
    			b5.textContent = "Nari Johnson";
    			t63 = text(", Sonali Parbhoo, Andrew Slavin Ross, Finale Doshi-Velez.\n\t\t\t\tAMIA Annual Symposium, 2021.  ");
    			mark2 = element("mark");
    			mark2.textContent = "Student Paper Competition Finalist";
    			t65 = text(", ");
    			mark3 = element("mark");
    			mark3.textContent = "Knowledge Discovery & Data Mining Student Innovation Award";
    			t67 = text(".\n\t\t\t\t[");
    			a13 = element("a");
    			a13.textContent = "arXiv";
    			t69 = text("]");
    			t70 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div10.textContent = "Teaching";
    			t72 = text("\n\t\t\t\n\t\t\tI've greatly enjoyed helping to teach several classes in college and my PhD.\n\t\t\tMy teaching philosophy is inspired by my commitment to expanding access to computing, and understanding teaching as a transformative practice.\n\t\t\tIn college, I designed and led Harvard Computer Science's first ");
    			a14 = element("a");
    			a14.textContent = "inclusive teaching training";
    			t74 = text(".\n\t\t\tMy teaching has been recognized with several honors, including Carnegie Mellon's ");
    			mark4 = element("mark");
    			mark4.textContent = "Machine Learning TA Award";
    			t76 = text(", Harvard's ");
    			mark5 = element("mark");
    			a15 = element("a");
    			a15.textContent = "Alex Patel Teaching Fellowship";
    			t78 = text(", and Harvard's ");
    			mark6 = element("mark");
    			a16 = element("a");
    			a16.textContent = "Derek Bok Certificate of Distinction in Teaching";
    			t80 = text(" (4x)");
    			t81 = text(".");
    			br4 = element("br");
    			t82 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a17 = element("a");
    			a17.textContent = "10-701: Introduction to Machine Learning";
    			t84 = text(", Spring 2023");
    			t85 = space();
    			li1 = element("li");
    			a18 = element("a");
    			a18.textContent = "CS 181: Machine Learning";
    			t87 = text(", Spring 2021. ");
    			b6 = element("b");
    			b6.textContent = "Head Teaching Fellow";
    			t89 = space();
    			li2 = element("li");
    			a19 = element("a");
    			a19.textContent = "CS 121: Theoretical Computer Science";
    			t91 = text(", Fall 2020. ");
    			b7 = element("b");
    			b7.textContent = "Alex Patel Fellow";
    			t93 = space();
    			li3 = element("li");
    			a20 = element("a");
    			a20.textContent = "CS 181: Machine Learning";
    			t95 = text(", Spring 2020");
    			t96 = space();
    			li4 = element("li");
    			a21 = element("a");
    			a21.textContent = "CS 121: Theoretical Computer Science";
    			t98 = text(", Fall 2019");
    			t99 = space();
    			li5 = element("li");
    			a22 = element("a");
    			a22.textContent = "Math 23c: Mathematics for Computation and Data Science";
    			t101 = text(", Spring 2019");
    			t102 = space();
    			div12 = element("div");
    			add_location(b0, file, 8, 19, 356);
    			attr_dev(div0, "id", "header");
    			attr_dev(div0, "class", "svelte-15ejm3h");
    			add_location(div0, file, 8, 2, 339);
    			attr_dev(a0, "href", "https://scholar.google.com/citations?hl=en&user=otKyVIAAAAAJ");
    			add_location(a0, file, 9, 20, 402);
    			if (!src_url_equal(img0.src, img0_src_value = /*pagebreak_fp*/ ctx[0])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "width", "20");
    			add_location(img0, file, 9, 112, 494);
    			attr_dev(a1, "href", "https://github.com/njohnson99");
    			add_location(a1, file, 9, 153, 535);
    			if (!src_url_equal(img1.src, img1_src_value = /*pagebreak_fp*/ ctx[0])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "width", "20");
    			add_location(img1, file, 9, 206, 588);
    			attr_dev(a2, "href", "https://twitter.com/narijohnson");
    			add_location(a2, file, 9, 247, 629);
    			attr_dev(div1, "id", "links");
    			attr_dev(div1, "class", "svelte-15ejm3h");
    			add_location(div1, file, 9, 2, 384);
    			attr_dev(a3, "href", /*starrynight*/ ctx[1]);
    			add_location(a3, file, 12, 40, 756);
    			attr_dev(a4, "href", "https://www.ml.cmu.edu/about/");
    			add_location(a4, file, 12, 132, 848);
    			attr_dev(a5, "href", "https://www.cs.cmu.edu/~hheidari/");
    			add_location(a5, file, 12, 217, 933);
    			attr_dev(a6, "href", "https://www.cs.cmu.edu/~atalwalk/");
    			add_location(a6, file, 13, 37, 1034);
    			attr_dev(a7, "href", "https://finale.seas.harvard.edu");
    			add_location(a7, file, 14, 105, 1208);
    			add_location(br0, file, 14, 172, 1275);
    			add_location(br1, file, 14, 177, 1280);
    			add_location(br2, file, 18, 97, 1591);
    			add_location(br3, file, 18, 101, 1595);
    			attr_dev(div2, "id", "intro-div");
    			attr_dev(div2, "class", "svelte-15ejm3h");
    			add_location(div2, file, 11, 2, 695);
    			attr_dev(div3, "id", "header");
    			attr_dev(div3, "class", "svelte-15ejm3h");
    			add_location(div3, file, 24, 3, 1673);
    			attr_dev(mark0, "class", "svelte-15ejm3h");
    			add_location(mark0, file, 26, 41, 1752);
    			add_location(i0, file, 29, 4, 1813);
    			add_location(b1, file, 30, 4, 1911);
    			attr_dev(a8, "href", "https://arxiv.org/abs/2306.08167");
    			add_location(a8, file, 32, 5, 2025);
    			attr_dev(div4, "class", "article svelte-15ejm3h");
    			add_location(div4, file, 28, 3, 1785);
    			add_location(i1, file, 36, 4, 2123);
    			add_location(b2, file, 37, 20, 2240);
    			attr_dev(a9, "href", "https://arxiv.org/abs/2207.04104");
    			add_location(a9, file, 40, 5, 2432);
    			attr_dev(div5, "class", "article svelte-15ejm3h");
    			add_location(div5, file, 35, 3, 2095);
    			add_location(i2, file, 45, 4, 2531);
    			add_location(b3, file, 46, 18, 2617);
    			attr_dev(a10, "href", "https://arxiv.org/abs/2206.02256");
    			add_location(a10, file, 48, 5, 2712);
    			attr_dev(div6, "class", "article svelte-15ejm3h");
    			add_location(div6, file, 44, 3, 2503);
    			add_location(i3, file, 53, 4, 2811);
    			add_location(b4, file, 54, 73, 2959);
    			attr_dev(mark1, "class", "svelte-15ejm3h");
    			add_location(mark1, file, 55, 36, 3064);
    			attr_dev(a11, "href", "https://arxiv.org/abs/2206.11104");
    			add_location(a11, file, 57, 5, 3142);
    			attr_dev(a12, "href", "https://open-xai.github.io");
    			add_location(a12, file, 57, 62, 3199);
    			attr_dev(div7, "class", "article svelte-15ejm3h");
    			add_location(div7, file, 52, 3, 2783);
    			add_location(i4, file, 61, 4, 3290);
    			add_location(b5, file, 62, 4, 3378);
    			attr_dev(mark2, "class", "svelte-15ejm3h");
    			add_location(mark2, file, 63, 34, 3489);
    			attr_dev(mark3, "class", "svelte-15ejm3h");
    			add_location(mark3, file, 63, 83, 3538);
    			attr_dev(a13, "href", "https://arxiv.org/abs/2109.11043");
    			add_location(a13, file, 64, 5, 3616);
    			attr_dev(div8, "class", "article svelte-15ejm3h");
    			add_location(div8, file, 60, 3, 3262);
    			attr_dev(div9, "id", "research-div");
    			attr_dev(div9, "class", "svelte-15ejm3h");
    			add_location(div9, file, 23, 2, 1644);
    			attr_dev(div10, "id", "header");
    			attr_dev(div10, "class", "svelte-15ejm3h");
    			add_location(div10, file, 70, 3, 3725);
    			attr_dev(a14, "href", "https://www.thecrimson.com/article/2020/10/7/cs-tf-training/");
    			add_location(a14, file, 74, 67, 4056);
    			attr_dev(mark4, "class", "svelte-15ejm3h");
    			add_location(mark4, file, 75, 84, 4246);
    			attr_dev(a15, "href", "https://csadvising.seas.harvard.edu/opportunities/patel/");
    			add_location(a15, file, 75, 140, 4302);
    			attr_dev(mark5, "class", "svelte-15ejm3h");
    			add_location(mark5, file, 75, 134, 4296);
    			attr_dev(a16, "href", "https://bokcenter.harvard.edu/teaching-awards");
    			add_location(a16, file, 75, 272, 4434);
    			attr_dev(mark6, "class", "svelte-15ejm3h");
    			add_location(mark6, file, 75, 266, 4428);
    			add_location(br4, file, 75, 395, 4557);
    			attr_dev(a17, "href", "https://www.cs.cmu.edu/~aarti/Class/10701_Spring23/");
    			add_location(a17, file, 78, 8, 4579);
    			add_location(li0, file, 78, 4, 4575);
    			attr_dev(a18, "href", "https://harvard-ml-courses.github.io/cs181-web/");
    			add_location(a18, file, 79, 8, 4714);
    			add_location(b6, file, 79, 111, 4817);
    			add_location(li1, file, 79, 4, 4710);
    			attr_dev(a19, "href", "http://people.seas.harvard.edu/~madhusudan/courses/Fall2020/");
    			add_location(a19, file, 80, 8, 4858);
    			add_location(b7, file, 80, 134, 4984);
    			add_location(li2, file, 80, 4, 4854);
    			attr_dev(a20, "href", "https://harvard-ml-courses.github.io/cs181-web/");
    			add_location(a20, file, 81, 8, 5022);
    			add_location(li3, file, 81, 4, 5018);
    			attr_dev(a21, "href", "https://cs121.boazbarak.org/");
    			add_location(a21, file, 82, 8, 5137);
    			add_location(li4, file, 82, 4, 5133);
    			attr_dev(a22, "href", "https://qrd.college.harvard.edu/classes/math-23c-mathematics-computation-statistics-and-data-science");
    			add_location(a22, file, 83, 8, 5243);
    			add_location(li5, file, 83, 4, 5239);
    			add_location(ul, file, 77, 3, 4566);
    			attr_dev(div11, "id", "teaching-div");
    			attr_dev(div11, "class", "svelte-15ejm3h");
    			add_location(div11, file, 69, 2, 3696);
    			attr_dev(div12, "id", "filler");
    			add_location(div12, file, 87, 2, 5454);
    			attr_dev(div13, "id", "page-container");
    			attr_dev(div13, "class", "svelte-15ejm3h");
    			add_location(div13, file, 7, 1, 309);
    			add_location(main, file, 6, 0, 301);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div13);
    			append_dev(div13, div0);
    			append_dev(div0, b0);
    			append_dev(div13, t1);
    			append_dev(div13, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, img0);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(div1, t6);
    			append_dev(div1, img1);
    			append_dev(div1, t7);
    			append_dev(div1, a2);
    			append_dev(div13, t9);
    			append_dev(div13, div2);
    			append_dev(div2, t10);
    			append_dev(div2, a3);
    			append_dev(a3, t11);
    			append_dev(div2, t12);
    			append_dev(div2, a4);
    			append_dev(div2, t14);
    			append_dev(div2, a5);
    			append_dev(div2, t16);
    			append_dev(div2, a6);
    			append_dev(div2, t18);
    			append_dev(div2, a7);
    			append_dev(div2, t20);
    			append_dev(div2, br0);
    			append_dev(div2, br1);
    			append_dev(div2, t21);
    			append_dev(div2, br2);
    			append_dev(div2, br3);
    			append_dev(div2, t22);
    			append_dev(div13, t23);
    			append_dev(div13, div9);
    			append_dev(div9, div3);
    			append_dev(div9, t25);
    			append_dev(div9, mark0);
    			append_dev(div9, t27);
    			append_dev(div9, div4);
    			append_dev(div4, i0);
    			append_dev(div4, t29);
    			append_dev(div4, b1);
    			append_dev(div4, t31);
    			append_dev(div4, a8);
    			append_dev(div4, t33);
    			append_dev(div9, t34);
    			append_dev(div9, div5);
    			append_dev(div5, i1);
    			append_dev(div5, t36);
    			append_dev(div5, b2);
    			append_dev(div5, t38);
    			append_dev(div5, a9);
    			append_dev(div5, t40);
    			append_dev(div9, t41);
    			append_dev(div9, div6);
    			append_dev(div6, i2);
    			append_dev(div6, t43);
    			append_dev(div6, b3);
    			append_dev(div6, t45);
    			append_dev(div6, a10);
    			append_dev(div6, t47);
    			append_dev(div9, t48);
    			append_dev(div9, div7);
    			append_dev(div7, i3);
    			append_dev(div7, t50);
    			append_dev(div7, b4);
    			append_dev(div7, t52);
    			append_dev(div7, mark1);
    			append_dev(div7, t54);
    			append_dev(div7, a11);
    			append_dev(div7, t56);
    			append_dev(div7, a12);
    			append_dev(div7, t58);
    			append_dev(div9, t59);
    			append_dev(div9, div8);
    			append_dev(div8, i4);
    			append_dev(div8, t61);
    			append_dev(div8, b5);
    			append_dev(div8, t63);
    			append_dev(div8, mark2);
    			append_dev(div8, t65);
    			append_dev(div8, mark3);
    			append_dev(div8, t67);
    			append_dev(div8, a13);
    			append_dev(div8, t69);
    			append_dev(div13, t70);
    			append_dev(div13, div11);
    			append_dev(div11, div10);
    			append_dev(div11, t72);
    			append_dev(div11, a14);
    			append_dev(div11, t74);
    			append_dev(div11, mark4);
    			append_dev(div11, t76);
    			append_dev(div11, mark5);
    			append_dev(mark5, a15);
    			append_dev(div11, t78);
    			append_dev(div11, mark6);
    			append_dev(mark6, a16);
    			append_dev(mark6, t80);
    			append_dev(div11, t81);
    			append_dev(div11, br4);
    			append_dev(div11, t82);
    			append_dev(div11, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a17);
    			append_dev(li0, t84);
    			append_dev(ul, t85);
    			append_dev(ul, li1);
    			append_dev(li1, a18);
    			append_dev(li1, t87);
    			append_dev(li1, b6);
    			append_dev(ul, t89);
    			append_dev(ul, li2);
    			append_dev(li2, a19);
    			append_dev(li2, t91);
    			append_dev(li2, b7);
    			append_dev(ul, t93);
    			append_dev(ul, li3);
    			append_dev(li3, a20);
    			append_dev(li3, t95);
    			append_dev(ul, t96);
    			append_dev(ul, li4);
    			append_dev(li4, a21);
    			append_dev(li4, t98);
    			append_dev(ul, t99);
    			append_dev(ul, li5);
    			append_dev(li5, a22);
    			append_dev(li5, t101);
    			append_dev(div13, t102);
    			append_dev(div13, div12);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let pagebreak_fp = './pagebreak.png';
    	let starrynight = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/700px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pagebreak_fp, starrynight });

    	$$self.$inject_state = $$props => {
    		if ('pagebreak_fp' in $$props) $$invalidate(0, pagebreak_fp = $$props.pagebreak_fp);
    		if ('starrynight' in $$props) $$invalidate(1, starrynight = $$props.starrynight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pagebreak_fp, starrynight];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
