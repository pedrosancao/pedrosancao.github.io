(function () {
    'use strict';
    function setHeight() {
        var height = window.innerHeight || document.documentElement.clientHeight;
        if (height) {
            document.querySelector('header div').style.height = height + 'px';
        }
    }
    window.addEventListener('resize', setHeight, false);
    setHeight();
    
    function typein() {
        var quote = document.querySelector('blockquote'), text = quote.textContent, caret = '_', i;
        function setCaret() {
            caret = caret === '_' ? ' ' : '_';
            quote.textContent = quote.textContent.substr(0, quote.textContent.length - 1) + caret;
        }
        function addChar() {
            quote.textContent = text.substr(0, quote.textContent.length) + caret;
        }
        quote.textContent = '_';
        setInterval(setCaret, 450);
        for (i = 0; i < text.length; i += 1) {
            setTimeout(addChar, 65 * i + 1600);
        }
    }
    typein();
})();
