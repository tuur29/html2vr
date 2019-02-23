
# HTML2VR.js

You can download the [latest release here](https://github.com/tuur29/html2vr/releases).

## How to use

Add both `html2vr.js` and `html2vr.js` to your project structure (same folder). Then load `html2vr.js` onto your page and call `html2vr.init()` in a script tag.

Lastly you need to add the `data-html2vr-page-type` and `data-html2vr-selector` properties to the body element of each page you want to support.

> Note: Firefox is currently the only supported browser!

## Properties and settings 

Settings: [view defaultConfig.js](./src/defaultConfig.js)

Properties:

``` html
    data-html2vr-page-type=""        <!-- grid, detail -->
    data-html2vr-selector=""         <!-- querySelector(All) -->
```


## Example

```html
<html>
    <head></head>
    <body data-html2vr-page-type="grid" data-html2vr-selector="a img">
        <script src="./assets/html2vr.js"></script>
        <script>
            html2vr.init({
                columnCount: 4
            });
        </script>
    </body>
</html>
```

You can also add your own button and call `html2vr.openPopup({...})` to open the popup.

## Development

Dev: `npm start`

Build release: `npm run build`

## Links

View [the demo](../demo)  
or discover [the extensions](../extension) for consumer usage.
