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

	useEffect(() => {
		try {
			BooksAPI.getAll().then((data) => {
				let Books = data;
				setAllBooks(Books);
			});
			console.info(
				'%c Mounted Successfully',
				'background: green; color: white',
			);
		} catch (error) {
			console.warn(
				`%c ${error}  while Mounting`,
				'background: red; color: white',
			);
		}
	}, []);

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
		// Call Backend API and Update The DATABASE
		await BooksAPI.update(oldBook, selectedValue);
		await BooksAPI.getAll().then((data) => {
			let Books = data;
			setAllBooks(Books);
		});
	};

	const searchBlur = () => {
		let EmptySearchedBooks = [];
		setSearchedBooks(EmptySearchedBooks);
	};

	const searchHandler = (e) => {
		setTimeout(async () => {
			let query;
			query = e.target.value.toLowerCase().trim();
			if (query !== '') {
				await BooksAPI.search(query).then((data) => {
					if (data && !data.error) {
						let SearchedBooksRes = data;
						setSearchedBooks(SearchedBooksRes);
						SearchedBooksRes.forEach((element) => {
							element.shelf = 'none';
						});
						const SearchedBooksEditedRes = JSON.parse(
							JSON.stringify(SearchedBooksRes),
						).map((book) => {
							AllBooks.map((activeBook) => {
								if (book.title === activeBook.title) {
									return (book['shelf'] = activeBook['shelf']);
								}
								return book;
							});
							return book;
						});
						setSearchedBooks(SearchedBooksEditedRes);
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
							searchBlur={searchBlur}
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
