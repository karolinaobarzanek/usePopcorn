import { useState, useEffect } from "react";
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
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  //const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const {movies, isLoading, error} = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], 'watched');

  //const [watched, setWatched] = useState(function() {
  //  const storedValue = localStorage.getItem('watched');
  //  return JSON.parse(storedValue);
  //});
  
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

  //useEffect(function() {
  //  localStorage.setItem('watched', JSON.stringify(watched));
  //},[watched])

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