import * as React from 'react';
import { render } from 'react-dom';
import Popup from './components/popupApp/app';

(() => {
    const element = document.getElementById('popup-app');
    if (element) {
        var app = <Popup />;
        render(app, element);
    }
})();