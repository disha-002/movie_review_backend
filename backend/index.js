import express from 'express';
import pg from 'pg';

const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'movie',
  password: 'database',
  port: 5432,
});
client.connect();

const app = express();
app.use(express.json());


app.post('/movie', async (req, res) => {
  const movie = req.body.movie;
  if (!movie || typeof movie !== 'string') {
    return res.status(400).json({ error: 'Movie name is required' });
  }
  const formattedMovie = movie.replaceAll(' ', '+');
  try{
    const response = await fetch(`https://www.omdbapi.com/?t=${formattedMovie}&apikey=146aa30b`);
    const data = await response.json();
    if(data.Response === 'False') {
        return res.status(404).json({ error: 'Movie not found' });
    }
    const Title = data.Title;
    res.json({ Title});
  }
  catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching movie data' });
  }
});

app.post('/review', async (req, res) => {
  const { Title, review } = req.body;
  if (!Title || typeof Title !== 'string' || !review || typeof review !== 'string') {
    return res.status(400).json({ error: 'Title and review are required' });
  }
  try {
    await client.query('INSERT INTO movies (movie_name, review) VALUES ($1, $2)', [Title, review]);
    res.json({ message: 'Review added successfully', Title, review });
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ error: 'An error occurred while adding the review' });
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
