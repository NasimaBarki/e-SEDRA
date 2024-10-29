
/** This file is part of e-Sedra.
 *
 *   e-Sedra is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   e-Sedra is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *   along with e-Sedra.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @copyright Copyright 2023 e-Sedra. All Rights Reserved.
 *
 */
const starTemplate = document.createElement('template');
starTemplate.innerHTML = `
    <span class="rating"></span>
`;

const template = document.createElement('template');
template.innerHTML = `
    <style>
    .rating {
	    color: orange;
    }
    .rating:hover{
        cursor: pointer;
    }
    </style>
    <div id="root"></div>
`;

class MyRating extends HTMLElement {
    constructor() {
        super();
        this._maxValue = 5;
        this._value = 0;
        this._oldvalue = 0;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.createStarList();
    }

    static get observedAttributes() {
        return ["max-value", "value", "old-value"];
    }

    get maxValue() {
        return this._maxValue;
    }

    set maxValue(val) {
        this._maxValue = val;
        this.setAttribute("max-value", val);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        //this._oldvalue = this._value;
        this._value = val;
        this.setAttribute("value", val);
    }

    get oldvalue() {
        return this._oldvalue;
    }

    set oldvalue(val) {
        this._oldvalue = val;
        this.setAttribute("old-value", val);
        // this.replaceStarList();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            switch (name) {
                case "max-value":
                    this._maxValue = newValue;
                    break;
                case "value":
                    this._value = newValue;
                    break;
                case "old-value":
                    this._oldvalue = newValue;
                    /* this._value = newValue;*/
                    break;
            }
            this.replaceStarList();
        }
    }

    replaceStarList() {
        let starNode = this.shadowRoot.getElementById("root");
        if (starNode) {
            this.createStarList();
        }
    }

    createStarList() {
        let div = this.shadowRoot.getElementById("root");
        let star;
        div.innerHTML = "";
        for (let i = 1; i <= this.maxValue; i++) {
            if (i <= this.value) {
                star = this.createStar("&#x2605", i);
            } else {
                star = this.createStar("&#x2606;", i);
            }
            div.appendChild(star);
        }
        const starNode = starTemplate.content.cloneNode(true);
        const span = starNode.querySelector("span");
        if (this.value != 0) span.innerHTML = ' ' + this.value + '/' + this.maxValue;
        else span.innerHTML = ' N.V.';
        div.appendChild(span);
        return div;
    }

    createStar(starCode, index) {
        const starNode = starTemplate.content.cloneNode(true);
        const span = starNode.querySelector("span");
        span.addEventListener("click", () => {
            this.setAttribute("old-value", this.getAttribute("value"));
            this.setAttribute("value", index);
        });
        span.innerHTML = starCode;
        return span;
    }
}
customElements.define("my-rating", MyRating);