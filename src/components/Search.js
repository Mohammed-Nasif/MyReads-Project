import React from 'react';
import { Link } from 'react-router-dom';

import Book from './Book';

const Search = (props) => {
	return (
		<div className='search-books'>
			<div className='search-books-bar'>
				<Link
					to='/home'
					className='close-search'
					onClick={() => this.toggleQuery()}>
					Close
				</Link>
				<div className='search-books-input-wrapper'>
					<input
						type='text'
						placeholder='Search by title or author'
						onChange={props.searchHandler}
					/>
				</div>
			</div>
			<div className='search-books-results'>
				<div className='bookshelf'>
					<h2 className='bookshelf-title'>Search</h2>
					<ol className='books-grid'>
						{/* Books */}
						{props.Books.map((book) => (
							<li key={book.id}>
								<Book Book={book} changeHandler={props.changeHandler} />
							</li>
						))}
					</ol>
				</div>
			</div>
		</div>
	);
};

export default Search;
