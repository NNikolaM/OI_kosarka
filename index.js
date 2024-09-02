const fs = require('fs'); // Modul za rad sa fajlovima

let GF = {};              // Rezultati grupne faze
let plasmanGF = {};       // Plasman timova nakon grupne faze
let sesiri = {};          // Raspodela timova u šešire
let elFaza = [];          // Parovi za eliminacionu fazu
let cetvrtfinale = [];    // Parovi za četvrtfinale
let polufinale = [];      // Parovi za polufinale
let treceMesto = [];      // Parovi za utakmicu za treće mesto
let finale = [];          // Parovi za finale
let medalje = [];         // Podela medalja

// Funkcija za verovatnoću pobede
function P (rang1, rang2){ 
  return 1 / (1 + Math.pow(10, (rang2 - rang1) / 400));
};

// Funkcija za simulaciju igre
function simulacijaIgre(tim1, tim2, rang1, rang2) {
  const p = P(rang1, rang2); // Verovatnoća pobede tima 1
  const rez1 = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
  const rez2 = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
  if (p > 0.5) {  
    return result = {
      [tim1]: Math.max(rez1, rez2),
      [tim2]: Math.min(rez1, rez2)
    };
  } else {
    return result = {
      [tim1]: Math.min(rez1, rez2),
      [tim2]: Math.max(rez1, rez2)
    };
  }
}

function grupnaFaza() {  
  console.log("REZULTATI GRUPNE FAZE")
  for(let k=0; k<3; k++){
    console.log("Grupna faza "+(k+1)+" kolo:");
    for(const group in GF){
      console.log("\tGrupa "+group);
      console.log("\t\t"+Object.keys(GF[group][k])[0]+" - "+Object.keys(GF[group][k])[1]+": ( "+
      Object.values(GF[group][k])[0]+" : "+Object.values(GF[group][k])[1]+" )");
      console.log("\t\t"+Object.keys(GF[group][GF[group].length-1-k])[0]+" - "+
      Object.keys(GF[group][GF[group].length-1-k])[1]+": ( "+
      Object.values(GF[group][GF[group].length-1-k])[0]+" : "+
      Object.values(GF[group][GF[group].length-1-k])[1]+" )");
    }
  }
  console.log();
}

function bodovi(tim) {
  let rezultati = { pobede: 0, porazi: 0, bodovi: 0, postignuti: 0, primeljeni: 0, razlika: 0 };

  // Prolazak kroz sve grupe
  for (const grupa in GF) {
    for (const utakmica of GF[grupa]) {
      const timovi = Object.keys(utakmica);
      const [tim1, tim2] = timovi;

      if(tim === tim1 || tim === tim2){ // Ako je tim onaj za koji se računaju bodovi
        if(tim === tim1){
          if(utakmica[tim1]>utakmica[tim2]){
            rezultati.postignuti += utakmica[tim1];
            rezultati.primeljeni += utakmica[tim2];
            rezultati.pobede += 1;
          } else if(utakmica[tim1]<utakmica[tim2]){
            rezultati.postignuti += utakmica[tim1];
            rezultati.primeljeni += utakmica[tim2];
            rezultati.porazi += 1;
          }
        } else {
          if(utakmica[tim1]>utakmica[tim2]){
            rezultati.postignuti += utakmica[tim2];
            rezultati.primeljeni += utakmica[tim1];
            rezultati.porazi += 1;
          } else if(utakmica[tim1]<utakmica[tim2]){
            rezultati.postignuti += utakmica[tim2];
            rezultati.primeljeni += utakmica[tim1];
            rezultati.pobede += 1;
          }
        }
      }
    }
  }

  // Računanje ukupnih bodova i razlike
  rezultati.bodovi = 2 * rezultati.pobede + 1 * rezultati.porazi;
  rezultati.razlika = rezultati.postignuti - rezultati.primeljeni;
  return rezultati;
}

function rangiraj(){
  for (let grupa in plasmanGF) {
    let timovi = plasmanGF[grupa];
    timovi.sort((a, b) => b.bodovi - a.bodovi);
  }

  for(let grupa in plasmanGF){
    for(let i=0; i<plasmanGF[grupa].length; i++){
      // Rangiranje ako su tri utakmice ostvarile isti broj bodova
      if (i + 2 < plasmanGF[grupa].length && plasmanGF[grupa][i].bodovi === plasmanGF[grupa][i + 1].bodovi && plasmanGF[grupa][i].bodovi === plasmanGF[grupa][i + 2].bodovi) {
          let tim1 = plasmanGF[grupa][i].Team; 
          let tim2 = plasmanGF[grupa][i + 1].Team; 
          let tim3 = plasmanGF[grupa][i + 2].Team; 
          let raz1 = 0;
          let raz2 = 0;
          let raz3 = 0;

          // Računanje medjusobnih razlika
          for(let j=0; j< GF[grupa].length; j++){
            if(Object.keys(GF[grupa][j])[0] === tim1 && Object.keys(GF[grupa][j])[1] === tim2){ 
              raz1 += Object.values(GF[grupa][j])[0] - Object.values(GF[grupa][j])[1];
              raz2 += Object.values(GF[grupa][j])[1] - Object.values(GF[grupa][j])[0];
            }else if(Object.keys(GF[grupa][j])[0] === tim2 && Object.keys(GF[grupa][j])[1] === tim1){
              raz2 += Object.values(GF[grupa][j])[0] - Object.values(GF[grupa][j])[1];
              raz1 += Object.values(GF[grupa][j])[1] - Object.values(GF[grupa][j])[0];
            }else if(Object.keys(GF[grupa][j])[0] === tim1 && Object.keys(GF[grupa][j])[1] === tim3){
              raz1 += Object.values(GF[grupa][j])[0] - Object.values(GF[grupa][j])[1];
              raz3 += Object.values(GF[grupa][j])[1] - Object.values(GF[grupa][j])[0];
            }else if(Object.keys(GF[grupa][j])[0] === tim3 && Object.keys(GF[grupa][j])[1] === tim1){ 
              raz3 += Object.values(GF[grupa][j])[0] - Object.values(GF[grupa][j])[1];
              raz1 += Object.values(GF[grupa][j])[1] - Object.values(GF[grupa][j])[0];
            }else if(Object.keys(GF[grupa][j])[0] === tim2 && Object.keys(GF[grupa][j])[1] === tim3){ 
              raz2 += Object.values(GF[grupa][j])[0] - Object.values(GF[grupa][j])[1];
              raz3 += Object.values(GF[grupa][j])[1] - Object.values(GF[grupa][j])[0];
            }else if(Object.keys(GF[grupa][j])[0] === tim3 && Object.keys(GF[grupa][j])[1] === tim2){ 
              raz3 += Object.values(GF[grupa][j])[0] - Object.values(GF[grupa][j])[1];
              raz2 += Object.values(GF[grupa][j])[1] - Object.values(GF[grupa][j])[0];
            }else{}
          }

          let pom;
          if (raz1 >raz2 && raz1 >raz3) {
            if (raz2 < raz3) {
              pom = plasmanGF[grupa][i+1];
              plasmanGF[grupa][i+1] = plasmanGF[grupa][i + 2];
              plasmanGF[grupa][i + 2] = pom;
            }
          } else if (raz2 >raz1 && raz2 >raz3) {
            pom = plasmanGF[grupa][i];
            plasmanGF[grupa][i] = plasmanGF[grupa][i + 1];
            if (raz1 >raz3) {
              plasmanGF[grupa][i+1] = pom;
            } else {
              plasmanGF[grupa][i+1] = plasmanGF[grupa][i + 1];
              plasmanGF[grupa][i+2] = pom;
            }
          } else if (raz3 >raz1 && raz3 >raz2) {
            pom = plasmanGF[grupa][i];
            plasmanGF[grupa][i] = plasmanGF[grupa][i + 2];
            if (raz1 >raz2) {
              plasmanGF[grupa][i+2] = plasmanGF[grupa][i+1];
              plasmanGF[grupa][i+1] = pom;
            } else {
              plasmanGF[grupa][i+2] = pom;
            }
          }
          i += 2;

      // Rangiranje ako su dve utakmice ostvarile isti broj bodova     
      }else if(i + 1 < plasmanGF[grupa].length && plasmanGF[grupa][i].bodovi === plasmanGF[grupa][i + 1].bodovi) {
        for(let j=0; j< GF[grupa].length; j++){
          if ((Object.keys(GF[grupa][j])[0] === plasmanGF[grupa][i].Team || Object.keys(GF[grupa][j])[0] === plasmanGF[grupa][i+1].Team) 
              && (Object.keys(GF[grupa][j])[1] === plasmanGF[grupa][i].Team || Object.keys(GF[grupa][j])[1] === plasmanGF[grupa][i+1].Team) ) {   
            if (Object.values(GF[grupa][j])[0] < Object.values(GF[grupa][j])[1]) {
              let pom = plasmanGF[grupa][i];
              plasmanGF[grupa][i] = plasmanGF[grupa][i + 1];
              plasmanGF[grupa][i + 1] = pom;
            }
          }      
        }
      }else {}

    }
  }
}

function dodeliRang() {

  // Funkcija koja sortira timove po odredjenim kriterijumima
  function sortirajTimove(timovi) {
    return timovi.sort((a, b) => {
      if (a.bodovi !== b.bodovi) return b.bodovi - a.bodovi;
      if (a.razlika !== b.razlika) return b.razlika - a.razlika;
      return b.postignuti - a.postignuti;
    });
  }
  let timovi = [];
  let rang = 1;
  for(let i=0; i<3; i++){
    for(const grupa in plasmanGF){
      timovi.push(plasmanGF[grupa][i]);
    }
    sortirajTimove(timovi);   

    // Dodeljivanje rangova timovima
    for(const grupa in timovi){
      for(const grupaGF in plasmanGF){
        if(plasmanGF[grupaGF][i].Team === timovi[grupa].Team){
          plasmanGF[grupaGF][i].rang = rang++;
        }
      }
    }
    timovi = [];
  }
}

function ispisiPlasmanGF() {
  console.log("Konačan plasman u grupama:");
  for (const grupa in plasmanGF) {
    console.log(`    Grupa ${grupa} (Ime - pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika)::`);
    plasmanGF[grupa].forEach((tim, index) => {
      console.log(
        `        ${index + 1}. ${tim.Team.padEnd(12)} ${tim.pobede} / ${tim.porazi} / ${tim.bodovi} / ${tim.postignuti} / ${tim.primeljeni} / ${tim.razlika} / ${tim.rang !== undefined ? tim.rang : 'x'}`
      );
    });
  }
  console.log()
}

function formirajSesire() {
  const sesiri = { 'D': [], 'E': [], 'F': [], 'G': []};

  // Formiranje sesira u zavisnosti od ranga tima
  for (const grupa in plasmanGF) {
    plasmanGF[grupa].forEach(tim => {
      if (tim.rang === 1 || tim.rang === 2) {
        sesiri['D'].push(tim);
      } else if (tim.rang === 3 || tim.rang === 4) {
        sesiri['E'].push(tim);
      } else if (tim.rang === 5 || tim.rang === 6) {
        sesiri['F'].push(tim);
      } else if (tim.rang === 7 || tim.rang === 8) {
        sesiri['G'].push(tim);
      }
    });
  }
  return sesiri;
}

function ispisiSesire() {
  console.log("Šeširi:");
  for (const sesir in sesiri) {
    console.log(`    ${sesir}`);
    sesiri[sesir].forEach(tim => {
      console.log(`        ${tim.Team}`);
    });
  }
}

function proveraEliminacije(parovi){
  // Formiranje nasumicnih timova za eliminacionu fazu
  let par = parovi[Math.floor(Math.random() * parovi.length)];
  let ponovljena;

  while(true){
    ponovljena = false;
    for(const grupa in GF){
      for(let i=0; i<GF[grupa].length; i++){
        if(((Object.keys(GF[grupa][i])[0] === par[0][0] || Object.keys(GF[grupa][i])[1] === par[0][0]) &&
        (Object.keys(GF[grupa][i])[0] === par[0][1] || Object.keys(GF[grupa][i])[1] === par[0][1])) ||
        ((Object.keys(GF[grupa][i])[0] === par[1][0] || Object.keys(GF[grupa][i])[1] === par[1][0]) &&
        (Object.keys(GF[grupa][i])[0] === par[1][1] || Object.keys(GF[grupa][i])[1] === par[1][1]))){
          // Ako je formirani par za eliminacionu fazu vec igrao u grupnoj fazi
          ponovljena = true; 
        }
      }
    }
    if(ponovljena) { 
      // Ako je utakmica odigrana u grupnoj fazi nasumicno se uzima novi par
      par = parovi[Math.floor(Math.random() * parovi.length)];
    }else{
      break;
    } 
  }
  return par;
}

function eliminacionaFaza() {
  const sesiriDG = [];
  const sesiriEF = [];

  // Formiranje timova na osnovu ukrstanja sesira
  for (let i = 0; i < sesiri["D"].length; i++) {
    for (let j = 0; j < sesiri["G"].length; j++) {
      sesiriDG.push([sesiri["D"][i].Team, sesiri["G"][j].Team]);
    }
  }
  for (let i = 0; i < sesiri["E"].length; i++) {
    for (let j = 0; j < sesiri["F"].length; j++) {
      sesiriEF.push([sesiri["E"][i].Team, sesiri["F"][j].Team]);
    }
  }

  let paroviDG = [
    [sesiriDG[0], sesiriDG[3]], 
    [sesiriDG[1], sesiriDG[2]]  
  ];
  let paroviEF = [
    [sesiriEF[0], sesiriEF[3]], 
    [sesiriEF[1], sesiriEF[2]]  
  ];

  let par1 = proveraEliminacije(paroviDG);
  let par2 = proveraEliminacije(paroviEF);
  elFaza = [
    [ 
      { [par1[0][0]]: 0, [par1[0][1]]: 0 },  
      { [par2[0][0]]: 0, [par2[0][1]]: 0 }   
    ],
    [
      { [par1[1][0]]: 0, [par1[1][1]]: 0 },      
      { [par2[1][0]]: 0, [par2[1][1]]: 0 }  
    ]     
  ];
}

function ispisiEliminacionuFazu() {
  console.log("\nEliminaciona faza:");
  elFaza.forEach((parovi, index) => {
    parovi.forEach(par => {
      const timovi = Object.keys(par);
      console.log(`\t${timovi[0]} - ${timovi[1]}`);
    });
    if (index < elFaza.length - 1) {
      console.log();
    }
  });
}

function cetvrtfinaleIgra(){
  console.log("\nČetvrtfinale:")
  for(const i in elFaza){
    for(const j in elFaza[i]){
      let tim1 = Object.keys(elFaza[i][j])[0];
      let tim2 = Object.keys(elFaza[i][j])[1]; 
      let rang1;
      let rang2;
      for(const grupa in plasmanGF){
        for(let k=0; k<plasmanGF[grupa].length; k++){
          // Simulacija igre
          if(plasmanGF[grupa][k].Team === tim1) rang1=plasmanGF[grupa][k].FIBARanking;
          if(plasmanGF[grupa][k].Team === tim2) rang2=plasmanGF[grupa][k].FIBARanking;
        }
      }
      cetvrtfinale.push(simulacijaIgre(tim1, tim2, rang1, rang2));
    }
  }
  cetvrtfinale.forEach((rezultat) => {
    const [tim1] = Object.keys(rezultat);
    const [tim2] = Object.keys(rezultat).slice(1);
    const rezultatTim1 = rezultat[tim1];
    const rezultatTim2 = rezultat[tim2];
    console.log(`\t${tim1} - ${tim2} (${rezultatTim1}: ${rezultatTim2})`);
  });
}

function polufinaleIgra() {
  console.log("\nPolufinale:")
  const parovi = [ [0, 1], [2, 3] ]; 
  for (const [index1, index2] of parovi) {
    const tim1 = Object.keys(cetvrtfinale[index1]).reduce((a, b) =>
      cetvrtfinale[index1][a] > cetvrtfinale[index1][b] ? a : b
    );
    const tim2 = Object.keys(cetvrtfinale[index2]).reduce((a, b) =>
      cetvrtfinale[index2][a] > cetvrtfinale[index2][b] ? a : b
    );
    let rang1, rang2;
    for (const grupa in plasmanGF) {
      for (let k = 0; k < plasmanGF[grupa].length; k++) {
        // Simulacija igre
        if (plasmanGF[grupa][k].Team === tim1) rang1 = plasmanGF[grupa][k].FIBARanking;
        if (plasmanGF[grupa][k].Team === tim2) rang2 = plasmanGF[grupa][k].FIBARanking;
      }
    }
    polufinale.push(simulacijaIgre(tim1, tim2, rang1, rang2));
  }

  // Ispisivanje rezultata polufinala
  polufinale.forEach((rezultat) => {
    const [tim1] = Object.keys(rezultat);
    const [tim2] = Object.keys(rezultat).slice(1);
    const rezultatTim1 = rezultat[tim1];
    const rezultatTim2 = rezultat[tim2];
    console.log(`\t${tim1} - ${tim2} (${rezultatTim1}: ${rezultatTim2})`);
  });
}

function treceMestoIgra(){
  console.log("\nUtakmica za treće mesto:");
  let tim1, tim2;
  let rang1, rang2;

  if(Object.values(polufinale[0])[0]<Object.values(polufinale[0])[1]) tim1 = Object.keys(polufinale[0])[0];
  else tim1 =Object.keys(polufinale[0])[1];
  if(Object.values(polufinale[1])[0]<Object.values(polufinale[1])[1]) tim2 = Object.keys(polufinale[1])[0];
  else tim2 =Object.keys(polufinale[1])[1];

  for (const grupa in plasmanGF) {
    for (let k = 0; k < plasmanGF[grupa].length; k++) {
      // Simulacija igre
      if (plasmanGF[grupa][k].Team === tim1) rang1 = plasmanGF[grupa][k].FIBARanking;
      if (plasmanGF[grupa][k].Team === tim2) rang2 = plasmanGF[grupa][k].FIBARanking;
    }
  }

    treceMesto.push(simulacijaIgre(tim1, tim2, rang1, rang2));

    if(Object.values(treceMesto[0])[0]>Object.values(treceMesto[0])[1]) medalje[0] = Object.keys(treceMesto[0])[0];
    // Medalja za trece mesto 
    else medalje[0] = Object.keys(treceMesto[0])[1];

    // Ispisivanje rezultata utakmica za trece mesto
    treceMesto.forEach((rezultat) => {
      const [tim1] = Object.keys(rezultat);
      const [tim2] = Object.keys(rezultat).slice(1);
      const rezultatTim1 = rezultat[tim1];
      const rezultatTim2 = rezultat[tim2];
      console.log(`\t${tim1} - ${tim2} (${rezultatTim1}: ${rezultatTim2})`);
    })
}

function finaleIgra(){
  console.log("\nFinale:");
  let tim1, tim2;
  let rang1, rang2;

  if(Object.values(polufinale[0])[0]>Object.values(polufinale[0])[1]) tim1 = Object.keys(polufinale[0])[0];
  else tim1 =Object.keys(polufinale[0])[1];
  if(Object.values(polufinale[1])[0]>Object.values(polufinale[1])[1]) tim2 = Object.keys(polufinale[1])[0];
  else tim2 =Object.keys(polufinale[1])[1];

  for (const grupa in plasmanGF) {
    for (let k = 0; k < plasmanGF[grupa].length; k++) {
      if (plasmanGF[grupa][k].Team === tim1) rang1 = plasmanGF[grupa][k].FIBARanking;
      if (plasmanGF[grupa][k].Team === tim2) rang2 = plasmanGF[grupa][k].FIBARanking;
    }
  }

  finale.push(simulacijaIgre(tim1, tim2, rang1, rang2));

  // Medalje za prvo i drugo mesto
  if(Object.values(finale[0])[0]>Object.values(finale[0])[1]) {
    medalje[2] = Object.keys(finale[0])[0];
    medalje[1] = Object.keys(finale[0])[1];
  }else{
    medalje[1] = Object.keys(finale[0])[0];
    medalje[2] = Object.keys(finale[0])[1];
  } 

  finale.forEach((rezultat) => {
    const [tim1] = Object.keys(rezultat);
    const [tim2] = Object.keys(rezultat).slice(1);
    const rezultatTim1 = rezultat[tim1];
    const rezultatTim2 = rezultat[tim2];
    console.log(`\t${tim1} - ${tim2} (${rezultatTim1}: ${rezultatTim2})`);
  })
}

function ispisiMedalje(){
  console.log("\nMedalje:");
  let mesto = 1;
  for(let i = medalje.length-1; i>=0; i--){
    console.log("\t "+mesto+". "+medalje[i]);
    mesto++;
  }
}

fs.readFile('groups.json', 'utf8', (greska, podaci) => {
  if (greska) {
    console.error('Greška pri čitanju fajla:', greska);
    return;
  }
  try {
    const grupe = JSON.parse(podaci);  
    for (let group in grupe) {
        let pom = [];
        for(let i=0; i<grupe[group].length; i++){
          for(let j=1+i; j<grupe[group].length; j++){
            // Simulacija igre
            pom.push(simulacijaIgre(grupe[group][i].Team, grupe[group][j].Team, grupe[group][i].FIBARanking, grupe[group][j].FIBARankingk));
          }
        }
        GF[group] = pom;
    }

    plasmanGF = JSON.parse(JSON.stringify(grupe)); 
    for (const group in plasmanGF) {
        for (let i = 0; i < plasmanGF[group].length; i++) {
          plasmanGF[group][i] = Object.assign(plasmanGF[group][i], bodovi(plasmanGF[group][i].Team));
        }
    }
    grupnaFaza();

    rangiraj();
    dodeliRang();
    ispisiPlasmanGF(); 

    sesiri = formirajSesire(plasmanGF);
    ispisiSesire();

    eliminacionaFaza();
    ispisiEliminacionuFazu();

    cetvrtfinaleIgra();
    polufinaleIgra();
    treceMestoIgra();
    finaleIgra();
    ispisiMedalje();

  } catch (parseError) {
    console.error('Greška pri parsiranju JSON-a:', parseError);
  }
});

