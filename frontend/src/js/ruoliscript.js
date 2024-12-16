
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

    ready(function () {

        let rpp = document.querySelectorAll(".ruoliprimari");
    //alert("ready "+rpp);
    for (let i = 0; i < rpp.length; i++) {
        //alert('i ' + i);
        rpp[i].addEventListener("click", (e) => {
            //console.log('- ' + e.target.nodeName);
            //e.target.nodeName != 'LABEL' &&
            if (e.target.nodeName != 'INPUT') { return; }
            else {
                let elem = e.target;
                //alert('click su ' + elem.nodeName);
                if (!elem.checked) {
                    let na = elem.getAttribute('data-lui');
                    let dv = document.getElementById("dv" + na);
                    let rss = dv.querySelectorAll(".ruolisec");
                    for (let j = 0; j < rss.length; j++) {
                        if (rss[j].checked)
                            rss[j].checked = '';
                    }
                }
            }

        });
        }

    });

    function resetRuoliPrimSec() {
    var tr = document.getElementById("TR");
    var rp = tr.querySelectorAll('.ruoliprimari');
    var dv;
    //azzero tutti i check primari
    //alert("sono in reset");
    for (let j = 0; j < rp.length; j++) {
        // alert('dentro al for');
        let na = rp[j].getAttribute('data-lui');
    //var ogg = recupera_na(rp[j]);

    if (rp[j].checked) {
        //alert(j + " ha il check");
        //tolgo prima i check ai secondari
        dv = document.getElementById("dv" + na);
    let rss = dv.querySelectorAll(".ruolisec");
    for (let k = 0; k < rss.length; k++) {
                    if (rss[k].checked)
    {
        rss[k].checked = '';
                        //alert('tolto check a s '+rss[k].value);
                    }
                }
    rp[j].checked = ''; //prima era false
    //alert('tolto check a p '+rp[j].value);
    if (dv.classList.contains('show'))
    {
        dv.classList.remove('show');
                //alert('tolta classe show a '+dv);
            }
           // dv.hide();
        }
    }
 }

    function serializeRuoli() {
    var ruol = [];
    //var ind = 0;
    var tr = document.getElementById("TR");
    var rp = tr.querySelectorAll('.ruoliprimari');
    //console.log('TR e rp ' + tr + ' ' + rp);
    for (j = 0; j < rp.length; j++) {
        let na = rp[j].getAttribute('data-lui');
    if (rp[j].checked) {
        let dv = document.getElementById("dv" + na);
    let rss = dv.querySelectorAll(".ruolisec");
    let cont = 0;
    for (let k = 0; k < rss.length; k++) {
                    if (rss[k].checked)
    cont++;
                }
    if (cont == 0)
    ruol.push(rp[j].value, '0');
    else {
                    for (let k = 0; k < rss.length; k++) {
                        if (rss[k].checked)
    ruol.push(rp[j].value, rss[k].value);
                    }
                }
            }
     /*   }*/
    }
    // alert(ruol);
    // console.log("ruoli: " + ruol);
    return ruol;
}



    function checkedRuoli(ut)       //passato ut['ruolo']
    {
        resetRuoliPrimSec();
    //console.log('In checked ruoli ' + ut);
    var tr = document.getElementById("TR");
    var rp = document.querySelectorAll('.ruoliprimari');
    for (i = 0; i < ut.length; i++) {
            for (j = 0; j < rp.length; j++) {
        let na = rp[j].getAttribute('data-lui');
    // var ogg = recupera_na(rp[j]);

    if (rp[j].value == ut[i]['idR']) {
        rp[j].checked = true;
    //console.log('metto i check a ' + rp[j]);
    let dv = document.getElementById("dv" + na);
    dv.classList.add('show');
    if (ut[i]['idS'] != 0) {
        // console.log('checked ruoli ids ' + ut[i]['idS']);
        let rss = dv.querySelectorAll(".ruolisec");
    for (let k = 0; k < rss.length; k++) {
                                if (rss[k].value == ut[i]['idS'])
    rss[k].checked = true;
                        }   //endfor
                    }//endif
                }//endif
            }
        }
   }
