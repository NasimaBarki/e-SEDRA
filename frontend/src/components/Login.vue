<style>
    #login-page {
            position: fixed;
            background-color: rgb(43, 14, 5, 0.50);
            z-index: 100;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        #login-modal {
            margin: 10% auto 0;
            border-radius: .5em;
            position: relative;
            z-index: 101;
            background: linear-gradient(to left, var(--bs-primary), var(--bs-danger));
            max-width: 60vmin;
            padding: 3.5%;
            text-align: center;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.3), 0 5px 5px 0 rgba(0, 0, 0, 0.2);
        }

        @media screen and (max-width: 900px) {
            #login-modal {
                max-width: 50vw;
                margin: 4% auto 0;
            }
        }

        @media screen and (max-width: 600px) {
            #login-modal {
                max-width: 70vmin;
                margin: 20% auto 0;
            }
        }

        @media screen and (max-width: 400px) {
            #login-modal {
                max-width: 85vmin;
                margin: 20% auto 0;
            }
        }

        @media screen and (max-width: 300px) {
            #login-modal {
                max-width: 98vmin;
                margin: 4% auto 0;
            }
        }

        #login-modal .login-input {
            font-family: sans-serif;
            width: 100%;
            margin: 0 0 1.3em;
            padding: .6em;
            font-size: .87em;
        }

        #login-modal .login-button {
            font-family: sans-serif;
            text-transform: uppercase;
            outline: 0;
            background: var(--bs-warning);
            width: 100%;
            border: 0;
            padding: .7em;
            color: #FFFFFF;
            font-size: .87em;
            transition: all 0.3s ease;
        }

            #login-modal .login-button:hover {
                background: var(--bs-primary);
            }

            #login-modal .login-button:active {
                background: var(--bs-warning);
            }

        #login-modal .message {
            margin: 1.2em 0;
            font-size: .8em;
            color: var(--bs-white);
        }

            #login-modal .message a {
                color: var(--bs-warning);
                text-decoration: none;
            }

        #modal-close-button a {
            position: absolute;
            right: 1em;
            top: -1.8em;
        }

            #modal-close-button a::before {
                content: '';
                position: absolute;
                width: .22em;
                height: 1.5em;
                background-color: #e2f4f8;
                transform: rotate(45deg);
            }

            #modal-close-button a::after {
                content: '';
                position: absolute;
                width: .22em;
                height: 1.5em;
                background-color: #e2f4f8;
                transform: rotate(-45deg);
            }

        #login-form {
            display: block;
            /*transition: opacity 0.5s, height 0.5s ease;*/
            /*overflow: hidden;*/ /*Previene lo sfarfallio durante la transizione di altezza*/
        }

        #register-form, #token-form, #expPsw-form {
            display: none;
           /* opacity: 1;  visibile*/
        }

</style>

<template>
    <div id="login-page">
        <div id="login-modal">
            <div @click="hideModal()" id="modal-close-button">
                <a href="#"></a>
            </div>
            <div id="spinner-div" class="pt-2 pb-3 d-flex align-items-center justify-content-center d-none" style="z-index:500;position:fixed;width:30vw;top:50%;left:50%;transform:translate(-50%,-50%);">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
            <form id="login-form" >
                <p class="message">
                    Hai richiesto un Token? <a class="register-link" href="#">Usalo!</a>
                </p>
                <input id="email" class="login-input" type="email" name="EMAIL" placeholder="email" />
                <input id="password" class="login-input" type="password" name="PSW" placeholder="password" />
                <input class="login-button" type="submit" value="LOGIN" name="login" />
                <p class="message">
                    Password dimenticata? <a class="token-link" href="#">Richiedi un Token</a>
                </p>
            </form>



            <form id="register-form">
                <p class="message">
                    Non hai un token? <a class="token-link" href="#">Richiedi Token</a>
                </p>
                <input class="login-input" type="text" name="TOKEN" placeholder="Token" />
                <input id="newPswR" class="login-input" type="password" name="NEWPSW" placeholder="nuova password" />
                <input id="rNewPswR" class="login-input" type="password" name="rnewpsw" placeholder="ripeti nuova password" />
                <input class="login-button" type="submit" value="REGISTRA PASSWORD" name="regpsw" />
                <p class="message">
                    Hai una password? <a class="login-link" href="#">Effettua il login</a>
                </p>
            </form>

            <form id="token-form">
                <p class="message">
                    Hai richiesto un Token? <a class="register-link" href="#">Usalo!</a>
                </p>
                <input class="login-input" type="email" name="EMAIL" placeholder="email" />
                <input class="login-button" type="submit" value="RICHIEDI TOKEN" name="reqtoken" />
                <p class="message">
                    Hai una password? <a class="login-link" href="#">Effettua il login</a>
                </p>
            </form>


            <form id="expPsw-form">
                <p class="message" id="warning">
                    Mancano <span id="ggScadPsw"></span>
                    giorni alla scadenza della password.<br />
                    Cambiarla ora? <a class="close-link" href="#">No, non ora!</a>
                </p>
                <p class="message" id="expired" style="color:blue;">Attenzione: la password &#232; scaduta! Per continuare &#200; necessario impostare una nuova password! </p>
                <input class="login-input" type="email" name="EMAIL" placeholder="email" />
                <input class="login-input" type="password" name="OLDPSW" placeholder="vecchia password" />
                <input id="newPswE" class="login-input" type="password" name="NEWPSW" placeholder="nuova password" />
                <input id="rNewPswE" class="login-input" type="password" name="rnewpsw" placeholder="ripeti nuova password" />
                <input class="login-button" type="submit" value="CAMBIA PASSWORD" name="updPsw" />
            </form>

        </div>
    </div>
</template>

<script>
export default {
    props: ['show-hide-login-modal'],
    methods:
    {
        hideModal()
        {
            this.showHideLoginModal()
        }
    }
}
</script>