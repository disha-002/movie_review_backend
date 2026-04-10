import express from 'express';
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
    const Year = data.Year;
    const Runtime = data.Runtime;

    res.json({ Title, Year, Runtime });
  }
  catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching movie data' });
  }
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
