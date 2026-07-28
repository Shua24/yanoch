// Yanoch theme toggle — applied as early as possible to avoid a flash of the
// wrong theme. Loaded synchronously from <head> in App.razor (BEFORE
// blazor.web.js) so the .dark class is on <html> by the time the first
// pixels render.
//
// Storage: localStorage "yanoch-theme" — one of "light" | "dark" | null.
// If unset, falls back to the OS preference (prefers-color-scheme).
//
// API exposed on window.yanochTheme:
//   current()            -> "light" | "dark"
//   set(theme)           -> apply + persist, returns the new theme
//   toggle()             -> flip, apply, persist, returns the new theme
(function () {
    'use strict';

    var STORAGE_KEY = 'yanoch-theme';
    var doc = document.documentElement;

    function getStored() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStored(value) {
        try {
            if (value === null) {
                localStorage.removeItem(STORAGE_KEY);
            } else {
                localStorage.setItem(STORAGE_KEY, value);
            }
        } catch (e) {
            // localStorage may be blocked — silently ignore
        }
    }

    function systemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    function apply(theme) {
        if (theme === 'dark') {
            doc.classList.add('dark');
        } else {
            doc.classList.remove('dark');
        }
    }

    function resolveInitial() {
        var stored = getStored();
        if (stored === 'light' || stored === 'dark') return stored;
        return systemTheme();
    }

    // Apply on first script run, before any styles render. This is the
    // anti-FOIT/FOUC step — the very next paint is already in the right theme.
    var initial = resolveInitial();
    apply(initial);

    // Keep the OS preference in sync if the user hasn't explicitly chosen.
    // Only reacts when there's no stored value, so a user who picked light
    // won't get yanked back to dark when the OS flips to dark.
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onChange = function () {
            if (getStored() === null) apply(systemTheme());
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange); // Safari < 14
    }

    window.yanochTheme = {
        current: function () {
            return doc.classList.contains('dark') ? 'dark' : 'light';
        },
        set: function (theme) {
            var t = theme === 'dark' ? 'dark' : 'light';
            setStored(t);
            apply(t);
            return t;
        },
        toggle: function () {
            return window.yanochTheme.set(
                window.yanochTheme.current() === 'dark' ? 'light' : 'dark'
            );
        }
    };
})();
