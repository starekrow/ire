class Field
{
    constructor()
    {
        this._value = undefined;
        this._bound = new WeakMap();
        this.working = 0;
        this.events = {};
    }

    set value(v)
    {
        if (!this.working) {
            ++this.working;
            this.apply_value(v);
            this.apply_trigger("set", v);
            --this.working;    
        }
    }

    get value()
    {
        if (!this.working) {
            ++this.working;
            this.apply_trigger("get", v);
            --this.working;
        }
        return this._value;
    }

    query(...args)
    {
        if (!this.working++) {
            this.apply_trigger("query", v);
        }
        let source = this._value;
        let answer;
        if (source) {
            if (typeof source === "function") {
                answer = Promise.resolve(source.apply(this, args));
            } else if (typeof source.then == "function") {
                answer = Promise.resolve(source);
            }
        } else {
            answer = Promise.resolve(this._value);
        }
        --this.working;
        return answer;
    }

    apply_value(v, source)
    {
        this._value = v;
        for (let k in this._bound) {
            if (k != source) {
                k.apply_value(v, this);
            }
        }
    }

    apply_trigger(event, data, source)
    {
        this.trigger(event, data);
        for (let k in this._bound) {
            if (k != source) {
                k.trigger(event, data);
            }
        }
    }

    on(event, handler)
    {
        if (handler) {
            if (this.events[event]) {
                this.events[event].push(handler);
            } else {
                this.events[event] = [handler];
            }
        }
    }

    off(event, handler)
    {
        if (handler) {
            let l = this.events[event];
            if (l) {
                let exists = l.indexOf(handler);
                if (exists >= 0) {
                    this.events[event] = l.splice(exists,1);
                }
            }
        }
    }

    trigger(event, data)
    {
        let l = this.events[event];
        if (l) {
            for (let k in l.slice(0)) {
                l[k].call(this, data);
            }    
        }
    }

    bind(value)
    {
        if (!(field instanceof Field)) {
            this.apply_value(value);
        } else if (value != this) {
            this.apply_value(value._value);
            this._bound[value] = true;
            value._bound[this] = true;
        }
    }
}
