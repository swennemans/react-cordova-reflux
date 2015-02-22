import React from 'react';
import Router from 'react-router';
import routes from './routes';


window.onerror = function(message, url, line) {
    alert(message + "\n" + url + ":" + line);
};

function startApp(){
    Router.run(routes, Handler => React.render(<Handler />, document.body));
}


/* If mobile device, wait for Cordova's device APIs to be loaded
   an ready for acces
 */
window.onload = function(){
    var url = document.URL;
    var isSmart = (url.indexOf("http://") === -1 && url.indexOf("https://") === -1);
    if( isSmart ){
        alert('isSmart')
        document.addEventListener('deviceready', startApp, false);
    }
    else{
        startApp();
    }
}
