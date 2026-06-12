import { JAGUAR, RACCOON, type MascotInfo } from '../types';

/**
 * Mascot info laid out across the six volleyball court positions.
 * Order is the on-court layout: front row 4-3-2, back row 5-6-1.
 *
 * Raccoon values come from the proposal docx (inteligencia, adaptabilidad,
 * resiliencia, curiosidad, trabajo en equipo) plus its real habitat in Costa
 * Rica. Jaguar is the explosive-power counterpart grounded in Costa Rican fauna.
 * Spanish copy — single source for the court text.
 */
export const MASCOTS: Record<'jaguar' | 'raccoon', MascotInfo> = {
  jaguar: {
    team: JAGUAR,
    name: 'Jaguar',
    img: '/assets/jaguar-dark.webp',
    intro:
      'El jaguar encarna el poder explosivo de la fauna costarricense: pura fuerza y dominio en la cancha.',
    positions: [
      {
        zone: 4,
        value: 'Poder',
        long: 'El jaguar tiene la mordida más potente de todos los felinos de América. En la cancha, ese poder se traduce en remates que atraviesan el bloqueo y definen el punto de un solo golpe. Cuando el equipo necesita un cierre contundente, el poder del jaguar aparece.',
      },
      {
        zone: 3,
        value: 'Fuerza',
        long: 'Domina la red con presencia física y seguridad. Su fuerza no está solo en el ataque: también sostiene el bloqueo y marca territorio, haciendo que el rival lo piense dos veces antes de atacar por el centro.',
      },
      {
        zone: 2,
        value: 'Ataque',
        long: 'Velocidad explosiva para llegar antes que nadie. El jaguar pasa de cero a máxima potencia en un instante, igual que un ataque rápido que sorprende a la defensa rival antes de que alcance a acomodarse.',
      },
      {
        zone: 5,
        value: 'Valentía',
        long: 'No retrocede ante ningún rival, por más alto o fuerte que sea. Esa valentía contagia al equipo: salta a bloquear al mejor rematador y se lanza por cada balón como si fuera el último del partido.',
      },
      {
        zone: 6,
        value: 'Liderazgo',
        long: 'Lidera con el ejemplo y con garra. En los momentos de presión, el jaguar levanta la voz, sube la intensidad y arrastra a todo el equipo hacia adelante. Su energía marca el ritmo del partido.',
      },
      {
        zone: 1,
        value: 'Raíz tica',
        long: 'El jaguar es el felino más grande de América y un símbolo de la riqueza natural de Costa Rica. Elegirlo es llevar en el pecho la fuerza de nuestra fauna y el orgullo de representar a Moravia con poder.',
      },
    ],
  },
  raccoon: {
    team: RACCOON,
    name: 'Mapache',
    img: '/assets/raccoon-dark.webp',
    intro:
      'El mapache cangrejero vive en Costa Rica y nuestra zona. Astuto, adaptable y siempre alerta: inteligencia hecha equipo.',
    positions: [
      {
        zone: 4,
        value: 'Inteligencia',
        long: 'El mapache es uno de los animales más astutos: resuelve problemas complejos y recuerda soluciones. En el voleibol, esa inteligencia es leer al rival, anticipar la jugada y elegir el golpe correcto en el momento justo, no solo pegar más fuerte.',
      },
      {
        zone: 3,
        value: 'Adaptabilidad',
        long: 'Vive igual en el bosque que en la ciudad: se ajusta a cualquier entorno. Un equipo con esa adaptabilidad cambia de plan sin perder el control, se acomoda a cualquier rival, cancha o marcador, y siempre encuentra la manera de seguir compitiendo.',
      },
      {
        zone: 2,
        value: 'Resiliencia',
        long: 'Aunque enfrenta muchos peligros, el mapache sobrevive y prospera. Esa resiliencia es levantarse después de un set perdido, aguantar la presión y seguir luchando punto a punto sin bajar nunca los brazos.',
      },
      {
        zone: 5,
        value: 'Curiosidad',
        long: 'Explora todo lo que encuentra y aprende de su entorno. En el equipo, esa curiosidad es la búsqueda constante de mejorar: estudiar nuevas tácticas, aprender de cada partido y nunca conformarse con lo que ya se sabe.',
      },
      {
        zone: 6,
        value: 'Equipo',
        long: 'Aunque suele ser solitario, el mapache se une a otros para compartir y conseguir alimento. Es el recordatorio de que en el voleibol nadie gana solo: el apoyo mutuo y la unión son lo que sostiene al equipo en los momentos difíciles.',
      },
      {
        zone: 1,
        value: 'Raíz Moraviana',
        long: 'El mapache cangrejero habita Costa Rica y zonas como la nuestra. Su característica "máscara" representa una identidad única, audaz y siempre alerta: la del equipo de Moravia, preparado para actuar en cualquier momento del juego.',
      },
    ],
  },
};
