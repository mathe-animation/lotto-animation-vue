import random from 'random'

/*function lotto_experiment(k, n, number_trials) {
    console.log(k + n + number_trials)
    let win_counter = 0
    for (let i = 0; i < number_trials; i++) {
        random_number = random.float((min = 0), (max = 1))
    }
    return win_counter
}*/

function factorial(n) {
// n!
   var fac = 1;
   for (i = 1; i <= n; i++) fac = fac*i;
   return fac;
}

function binomial(n, k) {
// Binomialkoeffizient von n über k
   var bin = factorial(n)/(factorial(k)*factorial(n-k));
   return bin;
}

function Prob(n, k) {
// Wahrscheinlichkeit für genau r Richtige bei einem Lottofeld
   var N = binomial(n, k);
   var y = 1/N
   return y;
}

export function LottoExperiment(n, k, number_trials) {
   const prob = Prob(n, k)
   let count_wins = 0
   for (let i = 0; i < number_trials; i++) {
      random_number = random.float((min = 0), (max = 1))
      if (random_number <= prob) {
         count_wins++
      }
   }
   return count_wins
}

//function pot(x, n) {
// x^n für natürliche n
/*   var y = 1;
   if (n == 0) {y = 1}
   else for (i=1; i<=n; i++) y = x*y;
   return y;
}*/


//function Prob(r) {
// Wahrscheinlichkeit für genau r Richtige bei einem Lottofeld
/*   var N = binomial (49, 6);
   var y = binomial(6, r)*binomial(43, 6-r)/N;
   return y;
}*/

/*function Convert(input) {
// verhindert die Ausgabe kleiner Zahlen in wissenschaftlicher Notation.
// Wahrscheinlichkeitswerte, die nicht exakt gleich 1 sind,
// werden in der Form "0.9999999..." ausgegeben.
   var inp;
   var anz0;
   var st;
   if ((input > 0.9999999999)&& (input < 1)) input = 0.9999999999;
   inp = Math.round(10000000000*input) + "";
   anz0 = 10 - inp.length;
   st = "0.";
   for (i = 1; i <= anz0; i++) st = st + "0";
   var out = st + inp;
   out = out.slice(0, 11);

   if (input >= 1) {output = "1"}
   else {
      if (input <= 0) {output = "0"}
      else output = out
   }
   if (output == "0.9999999999") output ="0.9999999999...";
   return output;
}

function Lotto() {
// berechnet Wahrscheinlichkeitswerte für Ereignisse beim Spiel "6 aus 49"
   with (document.f_lottoEingabe) {
      e_r.value = CheckInput(e_r.value);
      e_z.value = CheckInput(e_z.value);
      if (e_r.value > 6) {
         document.f_lottoEingabe.e_r.value = 6
      }

      var r = Math.ceil(e_r.value);
      var z = Math.ceil(e_z.value);
   }

   with (document.f_lottoAusgabe) {
      e_A.value = Convert(Prob(r));

      var pB = 0;
      var i = r;
      while (i < 7) {pB = pB + Prob(i); i++}

      e_B.value = Convert(pB);

      var pC = 1 - pot((1 - Prob(r)), z);
      e_C.value = Convert(pC);

      var pD = 1 - pot((1 - pB), z);
      e_D.value = Convert(pD);

      pE = 0;
      i = r+1;
      while (i < 7) {pE = pE + Prob(i); i++}
      pE = pot((1 - pE), z);
      e_E.value = Convert(pE);
   }
}*/