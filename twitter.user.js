// ==UserScript==
// @name         Twitter Scripts
// @namespace    http://github.com/rorre
// @version      0.1
// @description  Twitter keyboard stuffs
// @author       You
// @match        http://www.twitter.com/*
// @match        https://www.twitter.com/*
// @match        http://twitter.com/*
// @match        https://twitter.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function onKeydown(evt) {
        console.log(evt.keyCode)
        if (evt.keyCode == 186) {
            // ; key
            // Remove the blur notice
            console.log("Run unblur");
            const tweet = document.querySelector('[data-focusvisible-polyfill="true"]')
            tweet.querySelectorAll('[role="button"]')[1].click()
        }
    }

    document.addEventListener('keydown', onKeydown, true);
})();
