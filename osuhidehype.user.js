// ==UserScript==
// @name         osu! hide praises/hype
// @namespace    https://osu.ppy.sh/users/3378391
// @version      1.0
// @description  Add hide praise/hype button
// @author       -Keitaro
// @grant        none
// @include      /http[s]:\/\/osu\.ppy\.sh\/beatmapsets\/.+\/discussion.*/
// @run-at       document-idle
// ==/UserScript==

function initApplication() {
    // lol nice meme
    // lazy to make complex shit so lemme just copy paste my html xd
    var checkbox_html = $('<label class="praisehide beatmap-discussions__toolbar-item beatmap-discussions__toolbar-item--link beatmap-discussion-new__notice-checkbox"><div class="osu-switch-v2"><input id="isPraiseHide" class="osu-switch-v2__input" type="checkbox"><span class="osu-switch-v2__content"></span></div>Hide all hype/praise</label>')
    var toolbar = $(".beatmap-discussions__toolbar-content--right")

    // Busy wait until initial osu!js for rendering is done
    while (toolbar.length == 0) {
        toolbar = $(".beatmap-discussions__toolbar-content--right")
    }

    toolbar.prepend(checkbox_html)
    checkbox_html.click(function () {
        // TBH don't want to check every praises here but like sometimes if we store everything outside
        // it simply just doesnt work after changing tab, idk why.
        // so yeah lets just find everything
        var praises = $(".beatmap-discussion-message-type--hype, .beatmap-discussion-message-type--praise").parents(".beatmap-discussions__discussion")
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
}

(function() {
    'use strict';
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            initApplication();
        }
    }
})();
