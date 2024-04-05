import { useState, useEffect } from "react";
import {KEY} from "../APIkey";
import NavBar from "./navbar-components/NavBar";
import NumResults from "./navbar-components/NumResults";
import Search from "./navbar-components/Search";
import Main from "./main-components/Main";
import Box from "./main-components/Box";
import Loader from "./main-components/Loader";
import MovieList from "./main-components/MovieList";
import ErrorMessage from "./main-components/ErrorMessage";
import MovieDetails from "./main-components/MovieDetails";
import WatchedSummary from "./main-components/WatchedSummary";
import WatchedMoviesList from "./main-components/WatchedMoviesList";


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
    const controller = new AbortController();
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,{signal: controller.signal});
        
        if (!res.ok) throw new Error("Something went wrong with fetching movies");
        
        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
        setError("");
      } catch (err) {
          if (err.name !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
      } finally {
          setIsLoading(false);
      }
    }

      if(query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovies();

      return function() {
        controller.abort();
      }
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