USE dirifinal;

INSERT INTO movies
  (title, director, release_year, genre, duration_minutes, synopsis, poster_path)
VALUES
  ('Cars', 'John Lasseter', 2006, 'Animación', 117,
   'El famoso coche de carreras Rayo McQueen acaba en un pequeño pueblo donde aprende el valor de la amistad y el trabajo en equipo.', 'cars.webp'),
  ('Matrix', 'Lana Wachowski y Lilly Wachowski', 1999, 'Ciencia ficción', 136,
   'Un programador descubre que la realidad es una simulación y se une a la lucha contra las máquinas que controlan a la humanidad.', 'matrix.jpg'),
  ('Top Gun', 'Tony Scott', 1986, 'Acción', 110,
   'Un piloto de combate ingresa en la prestigiosa escuela Top Gun, donde deberá superar intensos desafíos personales y profesionales.', 'top-gun.jpg'),
  ('Shrek', 'Andrew Adamson y Vicky Jenson', 2001, 'Animación', 90,
   'Un ogro emprende una inesperada aventura para rescatar a una princesa y recuperar la tranquilidad de su pantano.', 'shrek.jpg'),
  ('Avatar', 'James Cameron', 2009, 'Ciencia ficción', 162,
   'Un exmarine viaja al planeta Pandora y termina dividido entre cumplir su misión o proteger a los habitantes nativos.', 'avatar.jpeg'),
  ('Your Name', 'Makoto Shinkai', 2016, 'Animación', 106,
   'Dos adolescentes intercambian misteriosamente sus cuerpos y crean un vínculo que desafía el tiempo y la distancia.', 'your-name.webp');
