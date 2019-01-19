
// Steps:
// 1.  Load: 'https://static.sketchfab.com/api/sketchfab-viewer-1.4.0.js' in script
// 2.  Define urlid (example: '7w7pAfrCfjovwykkEeRFLGw5SXS') in script
// 3.  Add an empty iframe with id 'sketchfab-viewer'
// 4.  Load this script

var iframe = document.getElementById('sketchfab-viewer');

// By default, the latest version of the viewer API will be used.
var client = new Sketchfab(iframe);

// Alternatively, you can request a specific version.
// var client = new Sketchfab( '1.4.0', iframe );

client.init( urlid, {
    success: function onSuccess( api ){
        api.start();
        api.addEventListener( 'viewerready', function() {
            
            // API is ready to use
            // Insert your code here
            console.log( 'Viewer is ready' );
            
        } );
    },
    error: function onError() {
        console.log( 'Viewer error' );
    }
} );
