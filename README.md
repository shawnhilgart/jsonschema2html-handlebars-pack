jsonschema2html-handlebars-pack
===============================

A Pack for jsonschema2html that outputs a handlebars template.

## Usage

### Basic Example

In the following example we use the jsonschema2html-handlebars-pack to render out a handlebars template string.

```
var Schema2Html = require('jsonschema2html');
var handlebarsPack = require('jsonschema2html-handlebars-pack')
var schema = {
    "id":"sample",
    "type":"object",
    "properties":{
        "author":{
            "type":"string"
        },
        "bookTitle":{
            "type":"string"
        },
        "libraries":{
            "type":"array",
            "items":{
                "type":"object",
                "properties":{
                    "name":{
                        "type":"string"
                    },
                    "address":{
                        "type":"string"
                    },
                    "zip":{
                        "type":"integer"
                    }
                }
            }
        }
    }

}

var parser = new Schema2Html(schema, null, {pack:handlebarsPack});
parser.buildForm(function(err, html) {
    console.log(html);
}); 

```

### Outputs

```
<form>
 <div id="sample">
  <input type="text" id="author" name="author" value="{{author}}" />
  <input type="text" id="booktitle" name="bookTitle" value="{{bookTitle}}" />
  {{#libraries}}
  {{setIndex @index}}
   <div id="libraries-group-{{index}}-libraries-{{index}}">
    <div id="libraries-{{index}}">
     <input type="text" id="libraries-{{index}}-name" name="libraries[{{index}}][name]" value="{{name}}" />
     <input type="text" id="libraries-{{index}}-address" name="libraries[{{index}}][address]" value="{{address}}" />
     <input type="text" id="libraries-{{index}}-zip" name="libraries[{{index}}][zip]" value="{{zip}}" />
    </div>
   </div>
  {{/libraries}}
 </div>
</form>

```

