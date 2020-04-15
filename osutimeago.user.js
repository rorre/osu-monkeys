// ==UserScript==
// @name         osu! old timeago
// @namespace    https://osu.ppy.sh/users/3378391
// @version      1.1
// @description  Use old scheme for timeago
// @author       -Keitaro
// @include      http://osu.ppy.sh*
// @include      https://osu.ppy.sh*
// @run-at       document-end
// ==/UserScript==

var $t = $.timeago;

function TinWords(distanceMillis, elem) {
    let $this = $(elem)
    let parents = $this.parent()
    if (parents.length != 0 && parents.hasClass("profile-extra-recent-infringements__table-cell--date")) {
        return moment.duration(-1 * distanceMillis).humanize(true)
    } else {
        if (!$t.settings.allowPast && ! $t.settings.allowFuture) {
            throw 'timeago allowPast and allowFuture settings can not both be set to false.';
        }

        var $l = $t.settings.strings;
        var prefix = $l.prefixAgo;
        var suffix = $l.suffixAgo;
        if ($t.settings.allowFuture) {
            if (distanceMillis < 0) {
                prefix = $l.prefixFromNow;
                suffix = $l.suffixFromNow;
            }
        }

        if (!$t.settings.allowPast && distanceMillis >= 0) {
            return $t.settings.strings.inPast;
        }

        var seconds = Math.abs(distanceMillis) / 1000;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        function substitute(stringOrFunction, number) {
            var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
            var value = ($l.numbers && $l.numbers[number]) || number;
            return string.replace(/%d/i, value);
        }

        var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
            seconds < 90 && substitute($l.minute, 1) ||
            minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
            minutes < 90 && substitute($l.hour, 1) ||
            hours < 24 && substitute($l.hours, Math.round(hours)) ||
            hours < 42 && substitute($l.day, 1) ||
            days < 30 && substitute($l.days, Math.round(days)) ||
            days < 45 && substitute($l.month, 1) ||
            days < 365 && substitute($l.months, Math.round(days / 30)) ||
            years < 1.5 && substitute($l.year, 1) ||
            substitute($l.years, Math.round(years));

        var separator = $l.wordSeparator || "";
        if ($l.wordSeparator === undefined) { separator = " "; }
        return $.trim([prefix, words, suffix].join(separator));
    }
}

function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
        element.data("timeago", { datetime: $t.datetime(element) });
        var text = $.trim(element.text());
        if ($t.settings.localeTitle) {
            element.attr("title", element.data('timeago').datetime.toLocaleString());
        } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
            element.attr("title", text);
        }
    }
    return element.data("timeago");
}

function distance(date) {
    return (new Date().getTime() - date.getTime());
}

function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement,this)) {
        //stop if it has been removed
        $(this).timeago("dispose");
        return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
        if ( $s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
            $(this).text(inWords(data.datetime, this));
        } else {
            if ($(this).attr('title').length > 0) {
                $(this).text($(this).attr('title'));
            }
        }
    }
    return this;
}
function dispose () {
    if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
    }
}

function init() {
    dispose.call(this);
    var refresh_el = $.proxy(refresh, this);
    refresh_el();
    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
    }
}

function inWords(date, elem) {
    return $t.inWords(distance(date), elem);
  }

function timeago (action, options) {
    // each over objects here and call the requested function
    this.each(function() {
        init.call(this, options);
    });
    return this;
};

(function() {
    'use strict';
    moment.relativeTimeThreshold('ss', 44)
    moment.relativeTimeThreshold('s', 120)
    moment.relativeTimeThreshold('m', 120)
    moment.relativeTimeThreshold('h', 48)
    moment.relativeTimeThreshold('d', 62)
    moment.relativeTimeThreshold('M', 24)
    jQuery.timeago.inWords = TinWords
    $.fn.timeago = timeago

})();
