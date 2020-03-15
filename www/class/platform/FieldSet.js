class FieldSet
{
    constructor()
    {
        this.fields = new Proxy(this, {

        });
        this.query = new Proxy(this, {
            
        });
        this.value = new Proxy(this, {

        });
        this.bind = new Proxy(this, {
            get: function(target, property, receiver) {
                return function(value) {
                    return target.getField(property);
                };
            },
        });
//        {};
        this._bound = new WeakMap();
        return new Proxy(this, {
            get: function(target, property, receiver) {
                if (property === '!instance') {
                    return target;
                } else if (!target.fields[property]) {

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
}