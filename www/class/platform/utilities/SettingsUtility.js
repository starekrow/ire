class SettingsUtility
{
    constructor(data)
    {
        this.settings = {};
        return new Proxy(this, {
            get: function(target, property, receiver)
            {
                return target.settings[property];
            },
            set: function(target, property, value, receiver)
            {
                target.settings[property] = value;
                return true;
            },
            has: function(target, property, receiver)
            {
                return property in target.settings;
            },
            ownKeys: function(target)
            {
                return Object.ownKeys(target.settings);
            }
        });
    }
}