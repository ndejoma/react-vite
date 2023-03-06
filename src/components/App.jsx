import { useEffect } from 'react';
import PokemonSpritesList from '@/components/PokemonSpritesList';
import Spinner from '@/components/icons/Spinner';
import fetchJsonData from '@/utils/fetchJsonData';
import useSWRInfinite from 'swr/infinite';
import { useInView } from 'react-intersection-observer';

const START_PAGE_IDX = 0;
const PAGE_ITEMS_LIMIT = 20;

function getReqKey(pageIdx, prevPageData) {
  if (+pageIdx === 0 && !prevPageData) {
    return `https://pokeapi.co/api/v2/pokemon-species/?offset=${START_PAGE_IDX}&limit=${PAGE_ITEMS_LIMIT}`;
  }
  if (prevPageData && prevPageData?.next) {
    return `https://pokeapi.co/api/v2/pokemon-species/?offset=${
      pageIdx * 20
    }&limit=${PAGE_ITEMS_LIMIT}`;
  }
  //if there it is no the first request or the previousPage data has next as null
  return null;
}

function App() {
  const { ref, entry, inView } = useInView({ rootMargin: '400px' });
  //fetch the data infinite
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite(getReqKey, fetchJsonData);
  //the state calculated from existing states
  // the pokemon species data transformed and flatten to include just the results
  const pokemonSpecies = data ? data.flatMap(({ results }) => results) : [];
  /**
   * Check is the last element in the array has a next property
   *  to determine if there is more data to load
   */
  const hasMoreDataToLoad =
    data?.length > 0 && Boolean(data[data.length - 1]?.next);
  const isEmpty = pokemonSpecies?.length === 0;
  // console.log(data && data[size - 1]  === "undefined", "WHAT IS THIS");
  const isLoadingMore =
    !error &&
    (isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined'));
  const availableSpeciesNo = data ? data[data.length - 1]?.count : 0;
  const loadSpeciesNo = pokemonSpecies.length;

  //effects
  useEffect(() => {
    if (inView && hasMoreDataToLoad) {
      setSize(size + 1);
    }
    //adding size as a dependecy will make the component re-render infinitely, ignore the deps rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  return (
    <>
      <header>
        <nav className='max-w-screen-xl mx-auto px-6 py-10'>
          <ul className='flex justify-between'>
            <li>
              <a
                href='#home'
                className='font-mono text-2xl font-bold tracking-tight text-slate-800'
              >
                Infinite
              </a>
            </li>
            <li>
              <a
                href='#home'
                className='bg-primary text-white py-3 px-6 rounded-md font-bold hover:bg-primary/95 focus-visible:outline-offset-2 focus-visible:outline-pink-300 focus:outline-pink-300 focus:outline-offset-2 drop-shadow-sm'
              >
                Go to
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className='min-h-screen max-w-screen-xl mx-auto px-6'>
        <section className='py-12'>
          <div>
            <label className='text-2xl tracking-tight font-semibold mb-1.5 block'>
              Search species
            </label>
            <input
              type='text'
              className='border block mb-10 py-2 rounded-md px-2 border-gray-400 focus:outline-primary focus:border-primary'
            />
          </div>
          {!isEmpty ? (
            <>
              <PokemonSpritesList pokemonSpecies={pokemonSpecies} />
              <div className='mt-6 ml-2'>
                <p className='text-xl'>
                  Loaded <strong>{loadSpeciesNo}</strong> of{' '}
                  <strong>{availableSpeciesNo}</strong> pokemon species
                </p>
              </div>
              <div className='py-10 flex items-center justify-center text-lg font-semibold'>
                {isLoadingMore && (
                  <div>
                    <Spinner className='text-gray-700 h-8 w-8' /> Loading
                  </div>
                )}
                {!hasMoreDataToLoad && (
                  <div className='text-red-500'>
                    {' '}
                    <p>No more data to load</p>
                  </div>
                )}
              </div>
              <div className='flex items-center justify-center mt-0'>
                <button
                  ref={ref}
                  disabled={isLoading || isValidating || !hasMoreDataToLoad}
                  className='bg-primary py-4 px-10 font-bold rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed text-white focus:outline-rose-500 focus:outline-offset-2 focus-visible:outline-rose-500 focus-visible:outline-offset-2 hover:bg-primary/90 hover:scale-[.98]  transition-transform duration-[50ms] inline-flex items-center justify-center gap-2 invisible'
                >
                  {!hasMoreDataToLoad ? (
                    <>No more pokemon species</>
                  ) : isLoadingMore ? (
                    <>
                      <Spinner /> Loading more
                    </>
                  ) : (
                    <>Load more</>
                  )}
                  {}
                </button>
              </div>
            </>
          ) : (
            <div className='py-10 text-center'>
              {' '}
              <h3 className='text-2xl font-medium text-red-500'>
                {' '}
                Ooops, There are no pokemon species to show
              </h3>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
