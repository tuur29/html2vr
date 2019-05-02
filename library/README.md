
# HTML2VR.js

You can download the [latest release here](https://github.com/tuur29/html2vr/releases).

## How to use

Add both `html2vr.js` and `html2vr.js` to your project structure (same folder). Then load `html2vr.js` onto your page and call `html2vr.init()` in a script tag.

Lastly you need to add the `data-html2vr-page-type` and `data-html2vr-selector` properties to the body element of each page you want to support.

> Note: Firefox is currently the only fully supported browser!

## Properties and settings

Settings: [view defaultConfig.js](./src/defaultConfig.js)

Properties:

```html
    data-html2vr-page-type=""        <!-- grid, detail -->
    data-html2vr-selector=""         <!-- querySelector(All) -->
    data-html2vr-custom-render=""    <!-- function name (gets params) -->
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

## Custom renderer

You can add your own [aframe](https://aframe.io/) elements to the scene by defining a function on the page and referencing the name in `data-html2vr-custom-render`. Your function will get the settings defined in the `init` call together with the default settings (see above).

Do note you can use this property to make your own detail page or enhance an existing one.

```html
<body data-html2vr-custom-render="render">
    <h1>Title</h1>
    <script>
        function render(params) {
            return `
                <a-text
                    class="html2vr-element"
                    position="0 -1.5 -6"
                    value="${document.querySelector('h1').textContent}"
                    anchor="left"
                    geometry="primitive:plane; width: auto; height: "
                    material="opacity: 0"
                    color="black"
                />
            `;
        }
        html2vr.init();
    </script>
</body>
```

Full example: View the source code of [demo page 2](../demo/site/detail/2.html).

## Development

Dev: `npm start`

Build release: `npm run build`

## Links

View [the demo](../demo)  
or discover [the extensions](../extension) for consumer usage.
