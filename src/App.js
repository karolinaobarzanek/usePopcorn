import { useState, useEffect } from "react";
import {KEY} from "./APIkey";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import Main from "./Main";
import Box from "./Box";
import Loader from "./Loader";
import MovieList from "./MovieList";
import ErrorMessage from "./ErrorMessage";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  useEffect(function() {
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${KEY}`);
        
        if (!res.ok) throw new Error("Something went wrong with fetching movies");
        
        
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
      
      } catch (err) {
          console.error(err.message);
          setError(err.message);
      } finally {
          setIsLoading(false);
      }
    }

      if(query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    }, [query]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery}/>
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails 
              selectedId={selectedId} 
              onCloseMovie={handleCloseMovie} 
              onAddWatched={handleAddWatched}
              watched={watched}
            /> 
            ) : (
            <>
            <WatchedSummary watched={watched} average={average}/>
            <WatchedMoviesList watched={watched} onDeleteWatched = {handleDeleteWatched}/>
            </>
            )}
        </Box> 
      </Main>
    </>
  );
}