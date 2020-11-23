(function() {
    'use strict';
    (function() {
        var rule = Array.prototype.find.call(document.styleSheets[1].rules, function(rule) {
            return rule.selectorText === 'header::before';
        });
        var offset = 3;
        var pattern = rule.style.content.replace(/"/g, '');
        var content = Array(50).fill('').map(function() {
            pattern = pattern.substr(offset) + pattern.substr(0, offset);
            return pattern.repeat(10);
        }).join('\\00000a');
        rule.style.content = '"' + content + '"';
    })();

    (function() {
        var quote = document.querySelector('blockquote'),
            text = quote.textContent,
            typed = quote.childNodes[0],
            space = document.createTextNode(text.replace(/\S/g, String.fromCharCode(160))),
            caret = document.createElement('span'),
            i = 0;
        typed.textContent = '';
        quote.appendChild(caret).textContent = '_';
        quote.appendChild(space);
        setInterval(function () {
            caret.style.visibility = caret.style.visibility ? '' : 'hidden';
        }, 500);
        function type() {
            typed.textContent = text.substr(0, typed.textContent.length + 1);
            space.textContent = (' ').repeat(space.textContent.length - 1);
            ++i < text.length && setTimeout(function() {
                requestAnimationFrame(type);
            }, 20);
        }
        setTimeout(function() {
            space.textContent = (' ').repeat(text.length);
            requestAnimationFrame(type);
        }, 1000)
    })();

    (function() {
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
                            var message = document.documentElement.lang.indexOf('pt') >= 0
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
    })();

    (function() {
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
    })();
})();
