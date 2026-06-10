import { JAGUAR, RACCOON, type Question } from '../types';

/**
 * 5 situational volleyball questions (odd count → no ties).
 * Jaguar answers = explosive power / fierce leadership.
 * Raccoon answers = adaptability / tactical intelligence / resilience.
 *
 * Copy is in Spanish for the Moravia athletes; swap freely — this is the
 * single source of all quiz text.
 */
export const questions: Question[] = [
  {
    id: 'block',
    prompt: 'Tienes enfrente un bloqueo doble y altísimo. ¿Qué haces?',
    answers: [
      { label: 'Remato con todo y lo rompo', mascot: JAGUAR },
      { label: 'Finta y dejada: busco el hueco', mascot: RACCOON },
    ],
  },
  {
    id: 'serve',
    prompt: 'Te llega un saque potente y pesado directo a ti.',
    answers: [
      { label: 'Doy un paso al frente y ataco la recepción', mascot: JAGUAR },
      { label: 'Lo leo, controlo y doy un pase limpio', mascot: RACCOON },
    ],
  },
  {
    id: 'matchpoint',
    prompt: 'Punto de partido. El estadio retiene el aire.',
    answers: [
      { label: 'Pido el balón y asumo el remate', mascot: JAGUAR },
      { label: 'Armo la jugada perfecta para el equipo', mascot: RACCOON },
    ],
  },
  {
    id: 'momentum',
    prompt: 'El rival agarró racha y el equipo se está cayendo.',
    answers: [
      { label: 'Enciendo a todos y lidero con garra', mascot: JAGUAR },
      { label: 'Ajusto la estrategia y cambio el plan', mascot: RACCOON },
    ],
  },
  {
    id: 'rally',
    prompt: 'Rally eterno, ya no sientes las piernas.',
    answers: [
      { label: 'Estallo en un último remate demoledor', mascot: JAGUAR },
      { label: 'Sigo defendiendo y resisto más que el rival', mascot: RACCOON },
    ],
  },
];
