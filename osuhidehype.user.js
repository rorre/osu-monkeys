// ==UserScript==
// @name         osu! hide praises/hype
// @namespace    https://osu.ppy.sh/users/3378391
// @version      1.0
// @description  Add hide praise/hype button
// @author       -Keitaro
// @grant        none
// @include      http://osu.ppy.sh*
// @include      https://osu.ppy.sh*
// @run-at       document-idle
// ==/UserScript==

// TODO: Save hide state? seems like gonna be an unnecessary work to do but maybe, just maybe /shrug
async function initApplication() {
    // lol nice meme
    // lazy to make complex shit so lemme just copy paste my html xd
    var checkbox_html = $('<label class="praisehide beatmap-discussions__toolbar-item beatmap-discussions__toolbar-item--link beatmap-discussion-new__notice-checkbox"><div class="osu-switch-v2"><input id="isPraiseHide" class="osu-switch-v2__input" type="checkbox"><span class="osu-switch-v2__content"></span></div>Hide all hype/praise</label>')
    var toolbar = $(".beatmap-discussions__toolbar-content--right")

    // Busy wait until initial osu!js for rendering is done, else everything else will simply break
    while (toolbar.length == 0) {
        toolbar = $(".beatmap-discussions__toolbar-content--right")
        await new Promise(r => setTimeout(r, 2000));
    }

    var praises;
    toolbar.prepend(checkbox_html)
    checkbox_html.click(function () {
        // Praises seems to be different for each tab so let's just restore the praises of current tab
        // into the variable, so it can also be used for reshowing when changing tabs.
        praises = $(".beatmap-discussion-message-type--hype, .beatmap-discussion-message-type--praise").parents(".beatmap-discussions__discussion")
        var e = $("#isPraiseHide")[0].checked

        // The performance of removing the elements is much better but since its a checkbox,
        // I don't think we want to re-render everything and it just clutters performance even more
        // by rendering many, many times if someone were to spam the checkbox lmao
        if (e) {
            praises.hide()
        } else {
            praises.show()
        }
    })

    $(".page-mode__item, beatmap-list__item").click(function () {
        // Show the praises again once changing tab OR changing difficulty.
        if (praises) praises.show()
        $("#isPraiseHide")[0].checked = false
    })

    // Mark as initialized so we don't initialize it many times
    $("body").prepend('<div id="osuHideInitialized"></div>')
}

function init() {
    var currentUrl;

    // Looping because... lazy loading page.
    setInterval(function(){
        if(currentUrl != window.location.href){
            var url = window.location.href
            if ($("#osuHideInitialized").length) return
            if(url.match(/http[s]:\/\/osu\.ppy\.sh\/beatmapsets\/.+\/discussion.*/)){
                initApplication()
            }
        }
    }, 1000);
}

(function() {
    'use strict';
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            init();
        }
    }
})();
