/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  messages: string[] = [];
  message: string = '';

  constructor() {
    this.messages = [
      "Oops, la pagina che cerchi si è presa una vacanza. Riprova quando è tornata abbronzata!",
      "Non è colpa tua, la pagina ha deciso di andare a fare una passeggiata senza dirci dove!",
      "La pagina è fuggita... Magari l'hai vista passare di qua?",
      "Hai scoperto una pagina segreta... segretamente vuota.",
      "Chi ha rubato la mia pagina? Se la vedi, dille di tornare!",
      "La pagina che cerchi non c'è... o forse è dietro di te!",
      "La pagina è in un'altra dimensione. Vuoi provare con un'altra?",
      "Abbiamo cercato ovunque, anche sotto il divano, ma questa pagina non si trova!",
      "Troppo occupata per rispondere. La tua pagina non è disponibile al momento!",
      "La pagina è in pausa caffè. Tornerà (forse) a breve!",
      "Sei arrivato al capolinea del web. Torna indietro finché sei in tempo!",
      "Non è un bug, è una feature! La pagina non c'è di proposito.",
      "La pagina che cerchi è in un castello lontano lontano. E intanto sei finito qui.",
      "Abbiamo scordato dove l'abbiamo messa. Scusaci!",
      "Se fossi una pagina web, dove mi nasconderei? Non qui, apparentemente."
    ];
  }

  ngOnInit(): void {
    this.message = this.messages[Math.floor(Math.random() * this.messages.length)];
  }

}
