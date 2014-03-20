/*jslint node: true,nomen: true, vars: true */
/*jshint maxcomplexity: 5 */
'use strict';

var fs = require('fs');
var handlebars = require('handlebars');

function repeat(num,dp) {
    return new Array( num + 1 ).join( dp );
}

module.exports = {
    built: false,
    renderMode:2,
    engine: {
        index:'index',
        backtick:'../',
        open:'{{',
        close:'}}'
    },

    templates: {
        formOpen: function(data) {
            return "<form>" + "\n";
        },

        formClose: function() {
            return "</form>";
        },

        groupItemOpen: function(data) {
            
            return repeat(data.options.depth,' ') + '<div id="' + data.id + '">' + "\n";
            //repeat(data.options.depth,'-') + 'groupItemOpen:' + data.name + "</br>";
        },

        groupItemClose: function(data) {
            //return repeat(data.options.depth,'-') + 'groupItemClose:' + data.name + "</br>";
            return repeat(data.options.depth,' ') + '</div>' + "\n";
        },

        textfield: function(data) {
            return repeat(data.options.depth,' ') + '<input type="text" id="'+data.id+'" name="'+data.name+'" value="{{' + data.options.keyInner + '}}" />' + "\n";
        },  

        textarea: function(data) {
            
            return 'textarea:' + data.name + "=" + data.val +  "\n";
        },

        upload: function(data) {
            return 'upload:' + data.name + "=" + data.val +  "\n";
        },

        selectlist: function(data) {
            return 'selectlist:' + data.name + "=" + data.val +  "\n";
        },

        groupArrayOpen: function(data) {
            //return repeat(data.options.depth,'-') + 'groupArrayOpen:' + data.id + "</br>";
            //
            if(data.options.arrayDepth > 0){
                return repeat(data.options.depth,' ') + "{{#" + data.options.keyInner + "}}\n {{setIndex @index}}" + "\n";
            } else{
                return repeat(data.options.depth,' ') + "{{#" + data.options.keyName + "}}\n {{setIndex @index}}" + "\n";    
            }
            
        },

        groupArrayClose: function(data) {
            //return repeat(data.options.depth,'-') + 'groupArrayClose:' + data.id + "</br>";
            //
            
            if(data.options.arrayDepth > 0){
                return repeat(data.options.depth,' ') + "{{/" + data.options.keyInner + "}}" + "\n";
            } else {
                return repeat(data.options.depth,' ') + "{{/" + data.options.keyName + "}}" + "\n";    
            }
        },

        help: function(data) {
            return repeat(data.options.depth,'-') + 'help:' + data.id + "</br>";
        },

        startGroup: function(data) {
            //return repeat(data.options.depth,'-') + 'startGroup:' + data.id + "</br>";
            return repeat(data.options.depth,' ') + '<div id="' + data.id + '">' + "\n";
        },

        endGroup: function(data) {
            return repeat(data.options.depth,' ') + '</div>' + "\n";
        },

        startGroupNoMethod: function() {

        },

        startGroupHidden: function() {

        },

        image: function(data) {
            return 'image:' + data.name + "/" + data.val +  "</br>";
        },

        readonly: function() {

        },

        file: function(data) {
            return 'file:' + data.name + "/" + data.val +  "</br>";
        },

        hidden: function(data) {
            return 'hidden:' + data.name + "=" + data.val +  "</br>";
        },

        password: function(data) {
            return 'password:' + data.name + "=" + data.val +  "</br>";
        },

        anyOfOpen: function(data) {
            return '{{#ifEqual projectType "'+data.dataRef+'"}}' + "\n";
        },

        anyOfClose: function(data) {
            return '{{/ifEqual}}' + "\n";
        }
    },



    /**
     * @description Template loading method, each formPack should provide its own method to load its template files
     *
     * @param {string} key Key file for template to load
     * @param {function} callback Callback function accepts err and result
     */

    loadTemplate: function(key, callback) {
        callback(null,templates[key]);
    },

    /**
     * @description Template rendering method, each formPack should provide its own rendering method
     *
     * @param {*} template Template (function, object, or string) returned from the loadTemplate function
     * @param {object} data Data object from json schema
     * @param {function} callback callback function accepts err, and result
     */

    renderTemplate: function(template, data, callback) {
        var result = null,
            err = null;
            data = data || {};
            data.options = data.options || {};
            data.options.depth = data.options.depth || 1;
            data.id = data.id || '';

        if (template === null) {
            callback(new Error("Could not render template of null"));
        } else {

            try {
                result = template(data);
            } catch (e) {
                err = e;
            }

            callback(err, result);
        }
    },

    /**
     * @description Utility function to clear up any runtime dependencies neccesary to run the form pack
     */

    build: function() {
        handlebars.registerHelper('ifEqual', function (v1, v2, options) {
            return v1 === v2 ? options.fn(this) : false;
        });

        handlebars.registerHelper('setIndex', function(value){
            this.index = Number(value + 1); //I needed human readable index, not zero based
        });

        this.built = true;
    },

    /**
     * @description Utility function to manage roles for each item within a schema file, called by the render loop on each schema item
     */

    security: function(schema) {
        return true;
    }
};