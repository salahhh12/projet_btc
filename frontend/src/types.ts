export interface Author {
  id: number;
  name: string;
  profile_path: string;
  character: string;  // Le rôle de l'acteur dans le film
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  credits?: {
    cast: Author[];  // Liste des acteurs
    crew: Author[];  // Liste de l'équipe de production (réalisateurs, producteurs, etc.)
  };
}
