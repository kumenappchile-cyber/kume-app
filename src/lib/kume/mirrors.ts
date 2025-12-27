export type MirrorSet = {
  base: string;
  vulnerable: string;
};

export const MIRRORS_BY_QUESTION_ID: Record<string, MirrorSet> = {
  q1: {
    base:
      "Sostener pesa cuando se hace solo.\nQue tu cuerpo lo registre no es debilidad, es honestidad.",
    vulnerable:
      "Tiene sentido que eso canse tanto.\nHas sostenido mucho por mucho tiempo.",
  },
  q2: {
    base:
      "Notarlo ya es salir un poco del automático.\nAhí empieza la conciencia.",
    vulnerable:
      "Reaccionar así no te define.\nFue una respuesta aprendida, no un fallo.",
  },
  q3: {
    base:
      "No necesitas llegar al fondo hoy.\nCon notar la evitación, es suficiente.",
    vulnerable:
      "Evitar también fue una forma de cuidarte.\nNo hay nada malo en eso.",
  },
  q4: {
    base:
      "La energía suele ir donde el cuerpo cree que hay riesgo.\nEso habla de protección, no de error.",
    vulnerable:
      "Estar siempre atento cansa.\nTiene sentido que hoy te sientas así.",
  },
  q5: {
    base:
      "Los pensamientos repetidos no siempre son verdad.\nMuchas veces son solo caminos conocidos.",
    vulnerable:
      "Que ese pensamiento vuelva no significa que seas eso.\nSignifica que estuvo mucho tiempo contigo.",
  },
  q6: {
    base:
      "Esa parte no es tu enemiga.\nAprendió a cuidarte de la mejor forma que pudo.",
    vulnerable:
      "Esa protección nació cuando la necesitabas.\nNo hay nada que reprocharle.",
  },
  q7: {
    base:
      "Nombrar lo que se siente ya le da espacio.\nNo necesitas entenderlo todo.",
    vulnerable:
      "Esa emoción no llegó tarde ni por error.\nLlegó cuando hubo espacio.",
  },
  q8: {
    base:
      "Los pasos pequeños también construyen identidad.\nEsto cuenta.",
    vulnerable:
      "Aunque no se sienta suficiente, fue real.\nY lo real importa.",
  },
  q9: {
    base:
      "Mirarte sin juicio es un acto de valentía.\nNo es algo menor.",
    vulnerable:
      "No juzgarte no te vuelve complaciente.\nTe vuelve humano.",
  },
  q10: {
    base:
      "Escucharte ya es una forma de cuidado.",
    vulnerable:
      "No necesitas resolverlo todo ahora.\nSolo no estar solo con esto.",
  },
};
