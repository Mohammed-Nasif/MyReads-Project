import React, { useState, useEffect, useCallback } from 'react';
import * as BooksAPI from './BooksAPI';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';

// Import All APP Component
import Search from './components/Search';
import HomePage from './components/HomePage';
// Import All APP Component

function BooksApp() {
	const [HomeSections] = useState([
		{ id: 0, name: 'Currently Reading', shelf: 'currentlyReading' },
		{ id: 1, name: 'Want to Read', shelf: 'wantToRead' },
		{ id: 2, name: 'Read', shelf: 'read' },
	]);
	const [AllBooks, setAllBooks] = useState([]);
	const [SearchedBooks, setSearchedBooks] = useState([]);
	const [currentBooks, setcurrentBooks] = useState([]);
	const [SearchedArchive, setSearchedArchive] = useState([]);
	const [searchquery, setsearchquery] = useState(false);

	useEffect(() => {
		console.log('Mount');
		BooksAPI.getAll().then((data) => {
			let Books = data;
			setAllBooks(Books);
			// console.log(Books);
			const booksTitle = Books.map((b) => b.title);
			setcurrentBooks(booksTitle);
		});
	}, [searchquery]);

	const toggleQuery = () => {
		setsearchquery({ searchquery: false });
	};

	const notify = useCallback(() => {
		return toast.error('There is No Books Match Your Search', {
			position: 'bottom-right',
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			toastId: 0,
		});
	}, []);

	const changeHandler = async (e, book) => {
		//Take A copy From The Book Data
		const oldBook = { ...JSON.parse(book) };
		const selectedValue = e.target.value;
		const SearchedArchiveNew = [...SearchedArchive];
		if (selectedValue === 'none') {
			console.log(SearchedArchive);
			SearchedArchiveNew.push(oldBook);
			console.log(SearchedArchiveNew);
			// To Archive All Books That goes back to None Shelf To Be Showen In Search if = query
			setSearchedArchive([...SearchedArchive, SearchedArchiveNew]);
		}
		// Call Backend API and Update The DATABASE
		await BooksAPI.update(oldBook, selectedValue);
		await BooksAPI.getAll().then((data) => {
			let Books = data;
			setAllBooks(Books);
			let SearchedBooksNew = [...SearchedBooks];
			SearchedBooksNew.forEach((b) => {
				b.title.trim() === oldBook.title.trim()
					? (b.shelf = selectedValue)
					: (b.shelf = 'none');

				if (b.shelf === selectedValue) {
					const getNewBook = SearchedBooksNew.slice(b.id, 1);
					console.log(getNewBook);
					SearchedBooksNew.splice(b.id, 1);
				}
			});
			setSearchedBooks(SearchedBooksNew);
		});
	};

	const searchHandler = (e) => {
		setTimeout(async () => {
			let query;
			if (!searchquery) {
				query = e.target.value.toLowerCase().trim();
				// console.log(query);
			} else {
				query = '';
			}
			if (query !== '') {
				await BooksAPI.search(query).then((data) => {
					if (data && !data.error) {
						let SearchedBooksRes = data;
						SearchedBooksRes = SearchedBooksRes.filter(
							(b) => !currentBooks.includes(b.title),
						);
						SearchedBooksRes.forEach((book) => (book.shelf = 'none'));
						console.log(SearchedBooksRes);
						setSearchedBooks(SearchedBooksRes);
					} else {
						let EmptySearchedBooks = [];
						setSearchedBooks(EmptySearchedBooks);
						notify();
					}
				});
			} else {
				let EmptySearchedBooks = [];
				setSearchedBooks(EmptySearchedBooks);
			}
		}, 500);
	};

	return (
		<div className='app'>
			<ToastContainer
				limit={2}
				position='bottom-right'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				toastStyle={{ backgroundColor: 'black' }}
			/>
			<Routes>
				<Route
					path='/search'
					element={
						<Search
							searchHandler={searchHandler}
							Books={SearchedBooks}
							changeHandler={changeHandler}
							toggleQuery={toggleQuery}
						/>
					}
				/>
				<Route
					path='/'
					element={
						<HomePage
							HomeSections={HomeSections}
							Books={AllBooks}
							changeHandler={changeHandler}
						/>
					}
				/>
				<Route
					path='/home'
					element={
						<HomePage
							HomeSections={HomeSections}
							Books={AllBooks}
							changeHandler={changeHandler}
							searchHandler={searchHandler}
						/>
					}
				/>
			</Routes>
		</div>
	);
}

export default BooksApp;
