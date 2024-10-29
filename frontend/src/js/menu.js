'use strict'


/**
* Easy selector helper function
*/
export function menuScript() {
    const myselect = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }

    /**
     * Easy event listener function
     */
    const myon = (type, el, listener, all = false) => {
        let selectEl = myselect(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }
    /**
    * Mobile nav toggle
    */
    myon('click', '.mobile-nav-toggle', function (e) {
        /*     alert('clic su mobile');*/
        myselect('#navbar').classList.toggle('navbar-mobile')
        this.classList.toggle('bi-list')
        this.classList.toggle('bi-x')
    })

    /**
     * Mobile nav dropdowns activate
     */
    myon('click', '.navbar .dropdown > a', function (e) {
        if (myselect('#navbar').classList.contains('navbar-mobile')) {
            e.preventDefault()
            this.nextElementSibling.classList.toggle('dropdown-active')
        }
    }, true)

    function fadeInPage(element, duration) {
        element.style.opacity = 0;
        element.style.display = 'block';

        let startTime = null;

        function animation(currentTime) {
            if (!startTime) {
                startTime = currentTime;
            }

            let timeElapsed = currentTime - startTime;
            let progress = Math.min(timeElapsed / duration, 1);

            element.style.opacity = progress;

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }


    function loadAlsoScript(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const header = document.querySelector('header');
        //alert(header);
        // Aggiungi l'HTML al documento
        Array.from(doc.body.childNodes).forEach(node => {
            header.appendChild(node);
        });

        // Trova e esegui gli script nel contenuto caricato
        const scripts = Array.from(doc.querySelectorAll('script'));
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
            if (!script.src) {
                newScript.parentNode.removeChild(newScript); // Rimuovi lo script dopo l'esecuzione se non ha un src
            }
        });
    }


    document.addEventListener('DOMContentLoaded', function () {
        var nodata = new FormData;
        var lg = document.getElementById("logButton");
        if (lg != null) {
            lg.addEventListener("click", function (event) {

                event.preventDefault();

                let promo = fetch('include/login.php', { method: 'POST' })
                    .then(response => response.text())
                    .then(html => {
                        loadAlsoScript(html);

                        //Opzionalmente, aggiungi un fadeIn o altro effetto visivo
                        const loginPage = header.querySelector('#login-page');
                        if (loginPage) {
                            loginPage.style.display = 'none';
                            fadeInPage(loginPage, 300);
                        }
                    })
                    .catch(error => console.error('Error loading the login page:', error));

            });
        }

        document.querySelectorAll('#navbar a').forEach(link => {
            link.addEventListener('click', function (event) {
                if (!this.classList.contains('no_link')) {
                    if (this.id !== "logButton" && this.id !== "m_logout") {
                        // Implementazione di waitIcon senza jQuery
                        // waitIcon('#contentPage');
                        // console.log(this.getAttribute('href'));
                        if (timer) { clearInterval(timer); }
                        // Caricamento del contenuto con Fetch API
                        fetch(this.getAttribute('href'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: 'page=99'
                        })
                            .then(response => response.text())
                            .then(html => {
                                /*loadAlsoScript(html);*/
                                insertAndExecuteScripts('#contentPage', html);
                                //        document.querySelector('#contentPage').innerHTML = html;
                            });

                        // Gestione della visualizzazione del menu attivo
                        document.querySelectorAll('.active').forEach(active => {
                            active.classList.remove('active');
                        });
                        this.classList.add('active');

                        // Aggiornamento nel DB della pagina utente corrente con Fetch API
                        fetch('ajax/updmenu.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            body: 'menu=' + this.id
                        });

                        if (document.querySelector('#navbar').classList.contains('navbar-mobile')) {
                            let el = document.getElementById('mobileMenu');
                            el.click(); // Simulazione click su mobileMenu
                        }

                        event.preventDefault(); // Previene il comportamento di default del link
                    }
                }
            });
        });

    });
}