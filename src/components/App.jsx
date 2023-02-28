import PokemonSprite from '@/components/PokemonSprite';
import Spinner from '@/components/icons/Spinner';
import fetchJsonData from '@/utils/fetchJsonData';
import {useState, useEffect} from 'react';
import useSWRInfinite from 'swr/infinite';

function getReqKey(pageOffset, prevPageData) {
	console.log(pageOffset, 'The page offset');
	console.log(prevPageData, 'THe previous page data');
	console.log(prevPageData?.next, 'The next item');
	if (+pageOffset === 0 && !prevPageData) {
		console.log('Page offset is 0 I was returned');
		return `https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=20`;
	}
	if (prevPageData && prevPageData?.next) {
		console.log('THere was prevPage data and I was returned');
		return `https://pokeapi.co/api/v2/pokemon-species/?offset=${
			pageOffset * 20
		}&limit=20`;
	}
	console.log('A null key was returned');
	//if there it is not the first request or the previousPaga data has next as null
	return null;
}

function App() {
	const [spriteOffset, setSpriteOffset] = useState(0);
	const [deferredOffset, setDeferredOffset] = useState(spriteOffset);
	const [isFetching, setIsFetching] = useState(false);

	//fetch the data infinite
	const {data, isLoading, isValidating, setSize, size} = useSWRInfinite(
		getReqKey,
		fetchJsonData
	);
	console.log(data, 'The data from fetch');

	useEffect(() => {
		console.log(spriteOffset, 'THe sprite offset changed');
		let timerId = window.setTimeout(() => {
			setDeferredOffset(spriteOffset);
		}, 0);
		return () => {
			window.clearTimeout(timerId);
		};
	}, [spriteOffset]);

	//search when the deferredoffset value changes
	// useEffect(() => {
	// 	console.log(deferredOffset, 'The deferred offset changed');
	// 	const controller = new AbortController();
	// 	async function fetchPokemonSpecies(offset = 0) {
	// 		try {
	// 			setIsFetching(true);
	// 			const data = await fetchJsonData(
	// 				`https://pokeapi.co/api/v2/pokemon-species/?offset=${offset}&limit=20`,
	// 				{
	// 					signal: controller.signal,
	// 				}
	// 			);
	// 			setIsFetching(false);
	// 			console.log(data);
	// 		} catch (error) {
	// 			setIsFetching(false);
	// 			console.log(error, 'The error');
	// 		}
	// 	}
	// 	fetchPokemonSpecies(deferredOffset);
	// 	return () => {
	// 		controller.abort();
	// 	};
	// }, [deferredOffset]);

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
				{/* <PokemonSprite /> */}
				<section className='py-12'>
					<div>
						<label className='text-2xl tracking-tight font-semibold mb-1.5 block'>
							Search species
						</label>
						<input
							// onChange={e => {
							// 	setSpriteOffset(e.target.value);
							// }}
							type='text'
							className='border block mb-10 py-2 rounded-md px-2 border-gray-400 focus:outline-primary focus:border-primary'
							// value={spriteOffset}
						/>
					</div>
					<div className='grid gap-x-6 gap-y-8 xs:grid-cols-2 lg:grid-cols-4 '>
						<PokemonSprite />
						<PokemonSprite />
						<PokemonSprite />
						<PokemonSprite />
					</div>
					<div>{JSON.stringify(data, null, 2)}</div>
					<div className='flex items-center justify-center mt-12'>
						<button
							disabled={isFetching}
							onClick={() => {
								// setSpriteOffset(spriteOffset + 20);
								console.log(size, 'THe size *********');
								setSize(size + 1);
							}}
							className='bg-primary py-4 px-10 font-bold rounded-md disabled:bg-primary/50 disabled:cursor-not-allowed text-white focus:outline-rose-500 focus:outline-offset-2 focus-visible:outline-rose-500 focus-visible:outline-offset-2 hover:bg-primary/90 hover:scale-[.98]  transition-transform duration-[50ms] inline-flex items-center justify-center gap-2'
						>
							{isFetching ? (
								<>
									<Spinner /> Fetching
								</>
							) : (
								<>Loading more</>
							)}
						</button>
					</div>
				</section>
			</main>
		</>
	);
}

export default App;
