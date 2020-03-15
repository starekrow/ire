class FieldSet2
{
    constructor()
    {
        this.fields = {};
        this._bound = new WeakMap();
        this._values = new Proxy(this, {
            get: function(target, property, receiver) {
                if (!target.fields[property]) {
                    return target;
                }
                return target.fields[property];
            },
            set: function(target, property, value, receiver) {
                if (!target.fields[property]) {
                    FieldSet.addField(target, property);
                }
                target.fields[property].value = value;
                return true;
            },
            has: function(target, property) {
                return target.fields[property] !== undefined;
            },
        });
    }

    static bind(src, dst)
    {
        let fs1 = src["!instance"], fs2 = dst["!instance"];
        fs1.bind(fs2);
    }

    static unbind(src, dst)
    {
        let fs1 = src["!instance"], fs2 = dst["!instance"];
        fs1.bind(fs2);
    }

    static field(fieldset, name)
    {

    }

    static fieldExists(fieldset, name)
    {
        
    }

    static addField(fieldset, name)
    {
        
    }

    bind(fieldset)
    {

    }
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
        let source = this._value;
        if (source) {
            if (typeof source === "function") {
                return Promise.resolve(source.apply(this, args));
            } else if (typeof source.then == "function") {
                return Promise.resolve(source);
            }
        }
        return Promise.resolve(this._value);
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