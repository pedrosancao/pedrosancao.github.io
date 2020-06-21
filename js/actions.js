(function() {
    'use strict';
    var isClientPt = navigator.language.indexOf('pt') >= 0;
    function languageNavigation() {
        var href = location.toString().replace(/\/$/, '');
        var base = href.replace(/\/en$/, '');
        if (document.referrer.indexOf(base) < 0) {
            var expectedLang = isClientPt ? 'pt-BR' : 'en';
            if (document.documentElement.lang !== expectedLang) {
                location.replace(base + (isClientPt ? '' : '/en'));
            }
        }
    }
    languageNavigation();

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

    function mail() {
        var link = document.querySelector('a.mailto'), loaded = false;
        function listener(e) {
            function clearCaptcha() {
                window.removeEventListener('resize', clearCaptcha, false);
                document.body.removeChild(document.querySelector('.captcha'));
            }
            function validateCaptcha(container, response) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://us-central1-xenon-sentry-248115.cloudfunctions.net/pedrosancao-show-email');
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        if (this.status === 200) {
                            if (this.responseText.length) {
                                link.textContent = this.responseText;
                                link.href = 'mailto:' + this.responseText;
                                link.removeEventListener('click', listener, false);
                                if (typeof ga === 'function') {
                                    ga('send', 'event', 'see-email');
                                }
                            }
                        } else {
                            var message = isClientPt
                                ? 'Ah não! Aconteceu um erro. Por favor tente novamente mais tarde. :)'
                                : 'Oh no! An error as occurred. Please try again later';
                            alert(message);
                        }
                        clearCaptcha(container);
                    }
                };
                setTimeout(function() {
                    xhr.send('response=' + encodeURIComponent(response));
                }, 300);
            }
            function showCaptcha() {
                var container = document.createElement('div'),
                    width = window.innerWidth || document.documentElement.clientWidth;
                container.className = 'captcha';
                document.body.appendChild(container);
                grecaptcha.render(container, {
                    'sitekey': '6Ld81v4SAAAAAHGOrau6cMO6eFH0AxHt4hgoVBk4',
                    'callback': function(response) {
                        validateCaptcha(container, response);
                    }
                });
                container.style.top = (link.offsetTop - container.offsetHeight / 3) + 'px';
                container.style.left = ((width - container.offsetWidth) / 2) + 'px';
                if (container.offsetWidth > width - 10) {
                    container.style.left = '5px';
                    container.style.transformOrigin = '0 0';
                    container.style.transform = 'scale(' + ((width - 10) / container.offsetWidth).toString().substr(0,6) + ')';
                }
                window.addEventListener('resize', clearCaptcha, false);
            }
            function loadCaptcha() {
                var s;
                if (loaded) {
                    showCaptcha();
                } else {
                    window.captchaCallback = function() {
                        delete window.captchaCallback;
                        showCaptcha();
                        loaded = true;
                    };
                    s = document.createElement('script');
                    s.defer = true;
                    s.async = true;
                    s.src = 'https://www.google.com/recaptcha/api.js?hl=ptBR&onload=captchaCallback&render=explicit';
                    document.body.appendChild(s);
                }
            }
            e.preventDefault();
            loadCaptcha();
            if (typeof ga === 'function') {
                ga('send', 'event', 'request-email');
            }
        }
        link.addEventListener('click', listener, false);
    }
    mail();

    function portfolioBehavior() {
        var els = document.querySelectorAll('section.portfolio figure');
        if (document.documentElement.ontouchstart !== undefined) {
            document.body.className = 'touch';
        }
        document.addEventListener('scroll', function() {
            var winHeight = window.innerHeight || document.documentElement.clientHeight,
                winTop = window.scrollY,
                winBottom = winTop + winHeight;
            Array.prototype.forEach.call(els, function(el) {
                var top = el.offsetTop + el.offsetParent.offsetTop, bottom = top + el.offsetHeight;
				var offset = 0.2 * el.offsetHeight;
				top += offset;
				bottom -= offset;
                el.className = (top <= winBottom && bottom >= winTop) ? 'on-screen' : '';
            });
        }, false);
        Array.prototype.forEach.call(els, function(el) {
            el.addEventListener('click', function(e) {
                if (e.target.tagName !== 'A') {
                    let link = this.querySelector('a');
                    link.target === '_blank' ? open(link.href) : location = link.href;
                }
            }, false);
        });
    }
    portfolioBehavior();
})();
