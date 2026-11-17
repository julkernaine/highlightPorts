// ==UserScript==
// @name        Highlight Non-Matching Ports
// @namespace   Violentmonkey Scripts
// @match       https://app.customscity.com/*
// @grant       none
// @version     1.0
// @author      Assistant
// @description Highlights manifestedPortOfUnlading and actualPortOfUnlading if they don't contain 2720 or 3901.
// ==/UserScript==

(function() {
    'use strict';

    const allowedCodes = ['2720', '3901'];

    function checkAndHighlight() {
        // Check if the specific modal header is present
        const modalHeader = document.querySelector('header.modal-header');
        if (!modalHeader || !modalHeader.textContent.includes('Manifest Query')) return;

        const ids = ['manifestedPortOfUnlading', 'actualPortOfUnlading'];

        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const val = el.value || "";
                // Check if the value contains any of the allowed codes
                const isAllowed = allowedCodes.some(code => val.includes(code));

                if (!isAllowed && val.trim() !== "") {
                    el.style.backgroundColor = '#ffcccc'; // Light red background
                    el.style.border = '2px solid red';    // Red border for emphasis
                    el.style.color = 'black';             // Ensure text is readable
                } else {
                    // Reset styles if it matches (in case of modal reuse/updates)
                    el.style.backgroundColor = '';
                    el.style.border = '';
                    el.style.color = '';
                }
            }
        });
    }

    // Observe the body for changes to catch the modal appearing
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                checkAndHighlight();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case it's already there
    checkAndHighlight();
})();